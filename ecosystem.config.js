module.exports = {
  apps: [
    {
      name: "eib-lms-production",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
      // Ensures PM2 restarts the app if it crashes
      autorestart: true,
      // Log files
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm Z"
    }
  ]
};
