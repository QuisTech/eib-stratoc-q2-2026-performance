const { execSync } = require('child_process');
const env = {
  DATABASE_URL: "postgresql://neondb_owner:npg_2yXk0SMWCDie@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  CLOUD_DATABASE_URL: "postgresql://neondb_owner:npg_2yXk0SMWCDie@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  POSTGRES_URL: "postgresql://neondb_owner:npg_2yXk0SMWCDie@ep-winter-wave-atnjpdlp-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  BETTER_AUTH_SECRET: "RuaTqRt6ICEj3GhCllM3yOhbLFIBGq6RrESdeXgv3p8=",
  BETTER_AUTH_URL: "https://lms-eibgroup.vercel.app",
  DEFAULT_RESET_PASSWORD: "ChangeMeImmediately123!"
};

for (const [k, v] of Object.entries(env)) {
  console.log(`Setting ${k}...`);
  try {
    execSync(`vercel env rm ${k} production -y`, { stdio: 'ignore' });
  } catch(e) {}
  execSync(`vercel env add ${k} production`, { input: v, stdio: 'pipe' });
}
console.log('Done.');
