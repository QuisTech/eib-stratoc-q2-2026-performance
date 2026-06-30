# EIB LMS: On-Premise Linux Deployment Guide

This guide is for the IT/SysAdmin team to configure the Ubuntu Linux Virtual Machine to securely run the LMS application and automatically deploy updates pushed to GitHub without opening inbound firewall ports.

## 1. Prerequisites (Install Node.js & PM2)

SSH into your Linux VM and run the following commands to install Node.js (v20) and PM2 (our background process manager).

```bash
# 1. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2 globally
sudo npm install pm2 -g

# 3. Ensure PM2 starts automatically if the server reboots
pm2 startup
# (Run the command that pm2 outputs on the screen)
```

## 2. Set up the GitHub Self-Hosted Runner

The runner is a secure agent that sits on your VM, connects outwardly to GitHub, and waits for deployment instructions.

1. Go to the project repository on GitHub.
2. Click **Settings** > **Actions** > **Runners**.
3. Click **New self-hosted runner**.
4. Select **Linux** and **x64**.
5. You will see a list of commands provided by GitHub (under "Download" and "Configure"). Copy and paste those commands directly into your Linux VM terminal to download and configure the agent.
6. When prompted, press Enter to accept the default settings (it will name the runner after your hostname).
7. Finally, install the runner as a background service so it stays alive:

```bash
sudo ./svc.sh install
sudo ./svc.sh start
```

## 3. Environment Variables

The application requires environment variables to connect to the database and manage authentication. 

Navigate to the directory where the GitHub runner cloned the repository (usually `actions-runner/_work/eib-stratoc-q2-2026-performance/eib-stratoc-q2-2026-performance`) and create a `.env` file:

```bash
nano .env
```

Paste the following variables and update them with your actual credentials:

```env
DATABASE_URL="postgres://username:password@localhost:5432/eib_lms"
BETTER_AUTH_SECRET="generate-a-secure-random-string-here"
BETTER_AUTH_URL="http://your-internal-ip-or-domain:3000"
DEFAULT_RESET_PASSWORD="ChangeMeImmediately123!"
```

## 4. Initial Start

The CI/CD pipeline (`.github/workflows/on-premise-deploy.yml`) will automatically pull the code and run the build steps when developers push to `main`. However, for the very first deployment, you must build the database schema and start the app:

```bash
npm install
npm run build

# Apply the database schema (Enterprise migrations)
npm run db:migrate

# Start the application using PM2
pm2 start ecosystem.config.js --env production
pm2 save
```

## Maintenance

- **Restarting the app**: `pm2 restart eib-lms-production`
- **Viewing live logs**: `pm2 logs eib-lms-production`
- **Updates**: Will happen entirely automatically! When the dev team pushes to GitHub, the runner agent will safely download the updates, rebuild the app, and run a zero-downtime `pm2 reload`.
