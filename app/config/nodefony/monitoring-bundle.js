/**
 *    OVERRIDE MONITORING BUNDLE
 *
 *    see MONITORING BUNDLE config for more options
 *
 */
module.exports = {
  debugBar: true,
  forceDebugBarProd: false,
  profiler: {
    active: false,
    storage: "orm"
  },
  // entry point swagger Multi URL
  swagger:{
    projectName: "NODEFONY",
    logo: "/app/images/app-logo.png",
    urls: [{
      url: "/api/users/documentation",
      name: "users"
    }, {
      url: "/api/jwt/documentation",
      name: "login"
    }],
    primaryName: "users"
  },

  // entry point graphigl monitoring only 1 URL (use merge in graphgl controller )
  graphigl:{
    projectName: "Nodefony Graphql Api",
    logo: "/app/images/app-logo.png",
    url:"/api/graphql"
  },
};
