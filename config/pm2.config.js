const cpu = require('os').cpus().length ;

module.exports = {
  apps : [{
    name                : "demo",
    script              : "./nodefony",
    args                : "pm2",
    watch               : false,
    exec_mode		        : "cluster",
    instances           : cpu,
    max_memory_restart  : "1024M",
    autorestart         : true,
    max_restarts		    : 10,
    log_file            : "./tmp/nodefony.log",
    out_file            : "./tmp/nodefony.out.log",
    error_file          : "./tmp/nodefony.error.log",
    merge_logs          : true,
    env: {
      "NODE_ENV"        : "development",
      "MODE_START"      : "PM2",
      "NODEFONY_DEBUG"  : true
    },
    env_production : {
       "NODE_ENV"       : "production",
       "MODE_START"     : "PM2",
       "NODEFONY_DEBUG" : false
    }
  }]
}
