"use server"

import { exec } from "child_process"
import { promisify } from "util"
import { getSessionUser } from "./auth"
import { isSuperAdminEmail } from "@/lib/access-control"

const execAsync = promisify(exec)

export async function runFirestoreQuotaScript() {
  const user = await getSessionUser()
  if (!user || !isSuperAdminEmail(user.email)) {
    throw new Error("Unauthorized")
  }

  // The exact bash script provided by the user, writing the temporary python parser to /tmp
  const script = `
if [ "$(date -u +%H)" -lt 7 ]; then
    START="$(date -u -d 'yesterday 07:00' +%Y-%m-%dT%H:%M:%SZ)"
else
    START="$(date -u -d 'today 07:00' +%Y-%m-%dT%H:%M:%SZ)"
fi

END="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
TOKEN="$(gcloud auth print-access-token)"

cat > /tmp/check_quota_hourly.py <<'EOF'
import sys, json
from datetime import datetime

data = json.load(sys.stdin)

if "error" in data:
    print("ERROR:", data["error"].get("message", data["error"]))
    sys.exit(1)

print("\\n--- FIRESTORE READS (HOURLY SINCE RESET) ---")

series = data.get("timeSeries", [])
if not series:
    print("No read activity since reset.")
    sys.exit(0)

points = {}

for ts in series:
    for p in ts.get("points", []):
        t = p["interval"]["endTime"]
        v = int(p["value"].get("int64Value", 0))
        points[t] = points.get(t, 0) + v

total = 0
for t in sorted(points):
    dt = datetime.strptime(t, "%Y-%m-%dT%H:%M:%SZ")
    total += points[t]
    print(f"{dt.strftime('%H:00 UTC')}: {points[t]:8,} reads")

print("-" * 44)
print(f"TOTAL SINCE RESET: {total:,} reads")
EOF

curl -s -G \\
  -H "Authorization: Bearer $TOKEN" \\
  --data-urlencode 'filter=metric.type="firestore.googleapis.com/document/read_count"' \\
  --data-urlencode "interval.startTime=$START" \\
  --data-urlencode "interval.endTime=$END" \\
  --data-urlencode "aggregation.alignmentPeriod=3600s" \\
  --data-urlencode "aggregation.perSeriesAligner=ALIGN_SUM" \\
  "https://monitoring.googleapis.com/v3/projects/eib-lms/timeSeries" \\
| python3 /tmp/check_quota_hourly.py
  `

  try {
    const { stdout, stderr } = await execAsync(script)
    // Sometimes scripts write to stderr but don't fail
    if (stderr && !stdout) {
      return { error: stderr }
    }
    return { output: stdout || stderr }
  } catch (error: any) {
    return { error: error.message }
  }
}
