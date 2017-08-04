const cpu = require('os').cpus().length ;
const path = require("path");
const fs   = require('fs');
const yml = require("js-yaml");
let name = "nodefony";

try {
  const config = yml.safeLoad(fs.readFileSync(path.resolve("app", "config", "config.yml"), 'utf8'));
  name = config.App.projectName;
}catch(e){
  throw e ;
}

module.exports = {
  apps : [{
    name                : name,
    script              : "./nodefony",
    args                : "pm2",
    //node_args           : "--expose-gc",
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
