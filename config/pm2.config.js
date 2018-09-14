const cpu = require('os').cpus().length;
let name = "myproject";
let script = process.argv[1] || "nodefony";
let logFile = path.resolve("tmp", "myproject.log");

/**
 * Application configuration section
 * http://pm2.keymetrics.io/docs/usage/application-declaration/
 */
module.exports = {
  apps: [{
    name: name,
    script: script,
    args: "pm2",
    //node_args           : "--expose-gc",
    watch: false,
    exec_mode: "cluster",
    instances: cpu,
    max_memory_restart: "1024M",
    autorestart: true,
    max_restarts: 10,
    //log_file            : logFile,
    out_file: logFile,
    error_file: logFile,
    merge_logs: true,
    env: {
      "NODE_ENV": "development",
      "MODE_START": "PM2",
      "NODEFONY_DEBUG": true
    },
    env_production: {
      "NODE_ENV": "production",
      "MODE_START": "PM2",
      "NODEFONY_DEBUG": false
    }
  }]
};
