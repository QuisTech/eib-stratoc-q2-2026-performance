import { getApp } from "firebase-admin/app";
import fs from "fs";
import path from "path";

// Load environment natively if we have .env.local
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath) && typeof (process as any).loadEnvFile === 'function') {
    (process as any).loadEnvFile(envPath);
  }
} catch (e) {
  // ignore
}

async function runFirestoreQuotaScriptManual() {
  try {
    let token = "";
    
    // Use Personal GCloud User Credentials to bypass billing
    if (process.env.GCLOUD_USER_CREDENTIALS) {
      const creds = JSON.parse(process.env.GCLOUD_USER_CREDENTIALS);
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: creds.client_id,
          client_secret: creds.client_secret,
          refresh_token: creds.refresh_token,
          grant_type: "refresh_token"
        })
      });
      const tokenData = await tokenResponse.json();
      if (tokenData.access_token) {
        token = tokenData.access_token;
      } else {
        throw new Error("Failed to refresh personal access token: " + JSON.stringify(tokenData));
      }
    } else {
      throw new Error("GCLOUD_USER_CREDENTIALS environment variable is missing.");
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || 'eib-lms';
    const now = new Date();
    const currentHourUTC = now.getUTCHours();
    
    let start = new Date(now);
    if (currentHourUTC < 7) {
      start.setUTCDate(start.getUTCDate() - 1);
    }
    start.setUTCHours(7, 0, 0, 0);
    
    const startTimeStr = start.toISOString().replace(/\.\d{3}Z$/, 'Z');
    const endTimeStr = now.toISOString().replace(/\.\d{3}Z$/, 'Z');
    
    const url = new URL(`https://monitoring.googleapis.com/v3/projects/${projectId}/timeSeries`);
    url.searchParams.append('filter', 'metric.type="firestore.googleapis.com/document/read_count"');
    url.searchParams.append('interval.startTime', startTimeStr);
    url.searchParams.append('interval.endTime', endTimeStr);
    url.searchParams.append('aggregation.alignmentPeriod', '3600s');
    url.searchParams.append('aggregation.perSeriesAligner', 'ALIGN_SUM');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("ERROR:", data.error.message || JSON.stringify(data.error));
      process.exit(1);
    }

    let output = "\n--- FIRESTORE READS (HOURLY SINCE RESET) ---\n";
    
    const series = data.timeSeries || [];
    if (!series.length) {
      console.log(output + "No read activity since reset.\n");
      process.exit(0);
    }

    const points: Record<string, number> = {};
    for (const ts of series) {
      for (const p of ts.points || []) {
        const t = p.interval.endTime;
        const v = parseInt(p.value.int64Value || "0", 10);
        points[t] = (points[t] || 0) + v;
      }
    }

    let total = 0;
    const sortedTimes = Object.keys(points).sort();
    for (const t of sortedTimes) {
      total += points[t];
      const dt = new Date(t);
      const formattedTime = dt.toISOString().slice(11, 16) + ' UTC';
      output += `${formattedTime}: ${points[t].toLocaleString().padStart(8)} reads\n`;
    }

    output += "-".repeat(44) + "\n";
    output += `TOTAL SINCE RESET: ${total.toLocaleString()} reads\n`;

    console.log(output);
    process.exit(0);
  } catch (error: any) {
    console.error("Script failed:", error.message);
    process.exit(1);
  }
}

runFirestoreQuotaScriptManual();
