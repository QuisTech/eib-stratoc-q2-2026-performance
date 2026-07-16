import { createSign } from "crypto"

type UsageMetric = {
  count: number
  quota: number
  percent: number
}

export type FirestoreUsageSummary = {
  available: boolean
  projectId: string
  resetAt: string
  measuredAt: string
  reads: UsageMetric
  writes: UsageMetric
  deletes: UsageMetric
  error?: string
}

const METRICS = {
  reads: "firestore.googleapis.com/document/read_count",
  writes: "firestore.googleapis.com/document/write_count",
  deletes: "firestore.googleapis.com/document/delete_count",
} as const

const FREE_QUOTAS = {
  reads: 50000,
  writes: 20000,
  deletes: 20000,
}

function toBase64Url(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

function getPrivateKey() {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || ""
  privateKey = privateKey.replace(/^\"|\"$/g, "")
  privateKey = privateKey.replace(/\\\\n/g, "\n")

  if (!privateKey.includes("\n") && privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
    const body = privateKey
      .replace("-----BEGIN PRIVATE KEY-----", "")
      .replace("-----END PRIVATE KEY-----", "")
      .replace(/ /g, "")
    const chunks = body.match(/.{1,64}/g) || []
    privateKey = `-----BEGIN PRIVATE KEY-----\n${chunks.join("\n")}\n-----END PRIVATE KEY-----\n`
  }

  return privateKey
}

function getResetStart(now = new Date()) {
  const reset = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 7, 0, 0))
  if (now.getTime() < reset.getTime()) reset.setUTCDate(reset.getUTCDate() - 1)
  return reset
}

async function getMonitoringAccessToken() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.replace(/[\r\n\s]+/g, "").replace(/\\n/g, "")
  const privateKey = getPrivateKey()

  if (!clientEmail || !privateKey) {
    throw new Error("Missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY for Monitoring API access.")
  }

  const now = Math.floor(Date.now() / 1000)
  const header = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const payload = toBase64Url(JSON.stringify({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/monitoring.read",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }))

  const unsigned = `${header}.${payload}`
  const signer = createSign("RSA-SHA256")
  signer.update(unsigned)
  signer.end()
  const signature = toBase64Url(signer.sign(privateKey))

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Google token request failed: ${response.status} ${details}`)
  }

  const data = await response.json()
  return data.access_token as string
}

async function fetchMetricCount(projectId: string, token: string, metricType: string, start: Date, end: Date) {
  const url = new URL(`https://monitoring.googleapis.com/v3/projects/${projectId}/timeSeries`)
  url.searchParams.set("filter", `metric.type="${metricType}"`)
  url.searchParams.set("interval.startTime", start.toISOString())
  url.searchParams.set("interval.endTime", end.toISOString())

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(5000),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Monitoring API request failed: ${response.status} ${details}`)
  }

  const data = await response.json()
  let total = 0
  for (const series of data.timeSeries || []) {
    for (const point of series.points || []) {
      const value = point.value || {}
      total += Number(value.int64Value || value.doubleValue || 0)
    }
  }
  return total
}

function metric(count: number, quota: number): UsageMetric {
  return {
    count,
    quota,
    percent: quota > 0 ? Math.round((count / quota) * 1000) / 10 : 0,
  }
}

export async function getFirestoreUsageSummary(): Promise<FirestoreUsageSummary> {
  const projectId = process.env.FIREBASE_PROJECT_ID?.replace(/[\r\n\s]+/g, "").replace(/\\n/g, "") || "eib-lms"
  const start = getResetStart()
  const end = new Date()

  try {
    const token = await getMonitoringAccessToken()
    const [reads, writes, deletes] = await Promise.all([
      fetchMetricCount(projectId, token, METRICS.reads, start, end),
      fetchMetricCount(projectId, token, METRICS.writes, start, end),
      fetchMetricCount(projectId, token, METRICS.deletes, start, end),
    ])

    return {
      available: true,
      projectId,
      resetAt: start.toISOString(),
      measuredAt: end.toISOString(),
      reads: metric(reads, FREE_QUOTAS.reads),
      writes: metric(writes, FREE_QUOTAS.writes),
      deletes: metric(deletes, FREE_QUOTAS.deletes),
    }
  } catch (error: any) {
    return {
      available: false,
      projectId,
      resetAt: start.toISOString(),
      measuredAt: end.toISOString(),
      reads: metric(0, FREE_QUOTAS.reads),
      writes: metric(0, FREE_QUOTAS.writes),
      deletes: metric(0, FREE_QUOTAS.deletes),
      error: error?.message || "Unable to load Firestore usage.",
    }
  }
}
