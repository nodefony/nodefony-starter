// ROUTING

module.exports = {
  home: {
    pattern: "/",
    defaults: {
      controller: "app:app:index"
    }
  }
  //GOOGLE ROUTE AREA oauth
  /*googleArea: {
    pattern: "/login/google",
    defaults: {
      controller: "framework:default:401"
    }
  },
  googleCallBackArea: {
    pattern: "/login/google/callback",
    defaults: {
      controller: "framework:default:401"
    }
  },
  // GITHUB ROUTE AREA oauth
  githubArea: {
    pattern: "/login/github",
    defaults: {
      controller: "framework:default:401"
    }
  },
  githubCallBackArea: {
    pattern: "/login/github/callback",
    defaults: {
      controller: "framework:default:401"
    }
  }*/
};