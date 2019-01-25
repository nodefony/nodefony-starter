// ROUTING

module.exports = {
  home: {
    pattern: "/",
    defaults: {
      controller: "app:app:index"
    }
  },
  documentation: {
    pattern: "/documentation",
    defaults: {
      controller: "app:app:documentation"
    }
  }
  //GOOGLE AUTH AREA
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
  // GITHUB AUTH AREA
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