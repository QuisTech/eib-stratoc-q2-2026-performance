"use server"

import { getSessionUser } from "./auth"
import { isSuperAdminEmail } from "@/lib/access-control"

export async function runFirestoreQuotaScript() {
  const user = await getSessionUser()
  if (!user || !isSuperAdminEmail(user.email)) {
    throw new Error("Unauthorized")
  }

  try {
    let token = "";
    
    let rawCreds = process.env.GCLOUD_USER_CREDENTIALS;
    
    // Fallback: Manually read from .env if Next.js/PM2 drops the variable
    if (!rawCreds) {
      try {
        const fs = require('fs');
        const envPath = require('path').resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf8');
          const match = envContent.match(/GCLOUD_USER_CREDENTIALS=['"]?(\{.*?\})['"]?/);
          if (match && match[1]) {
            rawCreds = match[1];
          }
        }
      } catch (e) {
        console.error("Failed to read .env manually", e);
      }
    }

    if (rawCreds) {
      const creds = JSON.parse(rawCreds);
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
      throw new Error("GCLOUD_USER_CREDENTIALS environment variable is missing in both process.env and .env file.");
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
      return { error: data.error.message || JSON.stringify(data.error) };
    }

    let output = "\n--- FIRESTORE READS (HOURLY SINCE RESET) ---\n";
    
    const series = data.timeSeries || [];
    if (!series.length) {
      return { output: output + "No read activity since reset.\n" };
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

    return { output };

  } catch (error: any) {
    return { error: error.message };
  }
}
