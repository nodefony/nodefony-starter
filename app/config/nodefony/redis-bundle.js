/**
 *    OVERRIDE REDIS BUNDLE SETTINGS
 *
 *   All Options :                https://github.com/redis/node-redis
 *          https://github.com/redis/node-redis/blob/master/docs/client-configuration.md
 *
 *   Add clients connections
 *   connections :{
 *     data :{
 *       name: "data"
 *      },
 *     publish :{
 *       name: "publish"
 *      },
 *     subscribe :{
 *       name: "subscribe"
 *      }
 *    }
 */
module.exports = {
  redis: {
    debug: true,
    globalOptions: {
      socket:{
        host: "localhost",
        port: 6379,
        family: "IPv4"
      },
      //username:"nodefony",
      //password:"nodefony",
    },
    connections: {
      main: {
        name: "main"
      }
      /*publish: {
        name: "publish"
      },
      subscribe: {
        name: "subscribe"
      },*/
    }
  }
};
