// ROUTING

module.exports = {
  home: {
    pattern: "/",
    defaults: {
      controller: "app:app:index"
    }
  },
  login: {
    pattern: "/login/{type}",
    defaults: {
      controller: "app:login:login",
      type: "local"
    }
  },
  logout: {
    pattern: "/logout",
    defaults: {
      controller: "app:login:logout"
    }
  },
  lang: {
    pattern: "/lang",
    defaults: {
      controller: "app:app:lang"
    }
  }
};
