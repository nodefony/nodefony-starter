/**
 *    @Route ("/api/users")
 */
class restController extends nodefony.Controller {

  constructor(container, context) {
    super(container, context);
    // service entity
    this.usersService = this.get("users");
    // api
    this.api = new nodefony.api.OpenApi({
      name: "users-api",
      version: this.bundle.version,
      description: "Nodefony Users Api",
      basePath: "/api/users"
    }, this.context);
  }

  checkAuthorisation(username, query) {
    let granted = this.is_granted("ROLE_ADMIN");
    if (username) {
      let user = this.getUser();
      if (!user) {
        throw new nodefony.authorizationError("Unauthorized", 401, this.context);
      }
      if (user.username !== username) {
        if (!granted) {
          throw new nodefony.authorizationError("Unauthorized Role", 401, this.context);
        }
      }
    } else {
      if (!granted) {
        throw new nodefony.authorizationError("Unauthorized", 401, this.context);
      }
    }
    if (query && query.roles && query.roles.length) {
      if (query.roles.indexOf("ROLE_ADMIN") >= 0 && (!granted)) {
        throw new nodefony.authorizationError("Unauthorized Role", 401, this.context);
      }
    }
    return true;
  }

  /**
   *    @Method ({"GET"})
   *    @Route ("/documentation",
   *      name="nodefony-users-apidoc"
   *    )
   *    @Firewall ({bypass:true})
   */
  swaggerAction() {
    return this.optionsAction();
  }

  /**
   *    @Method ({"OPTIONS"})
   *    @Route ( "",name="api-users-options")
   */
  optionsAction() {
    try {
      let openApiConfig = require(path.resolve(this.bundle.path, "Resources", "swagger", "openapi", "users.js"));
      return this.api.renderSchema(openApiConfig, this.usersService.entity);
    } catch (e) {
      return this.api.renderError(e, 400);
    }
  }

  /**
   *    @Method ({"GET"})
   *    @Route ( "/{username}",name="api-user",defaults={"username" = ""})
   */
  async getAction(username) {
    let result = null;
    const user = this.getUser();
    try {
      if (username) {
        result = await this.usersService.findOne(username, this.query, user);
        delete result.password;
        delete result["2fa-token"];
      } else {
        result = await this.usersService.find(this.query.query, this.query, user);
        result.rows.map((user) => {
          delete user.password;
          delete user["2fa-token"];
        });
      }
      return this.api.render(result);
    } catch (e) {
      return this.api.renderError(e);
    }
  }

  /**
   *    @Method ({"HEAD"})
   *    @Route ( "",name="api-users-head",)
   */
  headAction() {
    return this.renderResponse("");
  }

  /**
   *    @Method ({"POST"})
   *    @Route ( "",name="api-users-post")
   */
  async postAction() {
    let myuser = null;
    let error = null;
    if (!this.query.password || !this.query.confirm) {
      error = new Error(`Password can't be empty`);
    }
    if (this.query.password !== this.query.confirm) {
      error = new Error(`Bad confirm password`);
    }
    if (error) {
      this.logger(error, "ERROR");
      throw error;
    }
    try {
      this.checkAuthorisation(null, this.query);
      const user = this.getUser()
      myuser = await this.usersService.create(this.query, user);
      if (myuser) {
        delete myuser.password;
        delete myuser["2fa-token"];
        let res = {
          query: this.query,
          user: myuser
        };
        return this.api.render(res);
      }
      return this.api.render({
        query: this.query,
        user: null
      });
    } catch (e) {
      this.log(e, "ERROR");
      return this.api.renderError(e, 400);
    }
  }

  /**
   *    @Method ({"PUT"})
   *    @Route ( "/{username}",name="api-user-put")
   */
  async putAction(username) {
    this.checkAuthorisation(this.query.username, this.query);
    const user = this.getUser()
    return this.usersService.findOne(username, user)
      .then(async (myuser) => {
        if (myuser) {
          if (this.query.password) {
            let confirm = false
            if (this.query.confirm) {
              if (this.query.password !== this.query.confirm) {
                throw new Error(`Bad confirm password`);
              }
              delete this.query.confirm;
              confirm = true;
            }
            if (this.query["old-password"]) {
              let encoder = this.getNodefonyEntity("user").getEncoder();
              let check = await encoder.isPasswordValid(this.query["old-password"], myuser.password);
              if (!check) {
                throw new Error(`User ${username} bad passport`);
              }
              delete this.query["old-password"];
              confirm = true;
            }
            if (!confirm) {
              throw new Error(`User ${username} no confirm passport`);
            }
          }
          return this.usersService.update(myuser, this.query, user)
            .then(async (res) => {
              let message = `Update User ${this.query.username} OK`;
              this.log(message, "INFO");
              let currentUser = this.getUser();
              if (this.session && myuser.username === currentUser.username) {
                if (this.query.username !== myuser.username) {
                  currentUser.username = this.query.username;
                }
                if (this.getLocale() !== this.query.lang) {
                  this.session.set("lang", this.query.lang);
                }
              }
              let newUser = await this.usersService.findOne(this.query.username, user);
              delete newUser.password;
              delete newUser["2fa-token"];
              return this.api.render({
                query: this.query,
                user: newUser
              });
            });
        }
        throw new Error(`User ${username} not found`);
      })
      .catch((error) => {
        this.log(error, "ERROR");
        throw error;
      });
  }

  /**
   *    @Method ({"PATCH"})
   *    @Route ( "/{username}",name="api-user-patch")
   */
   // TODO
  async patchAction(username) {
    this.log(username);
  }

  /**
   *    @Method ({"DELETE"})
   *    @Route ( "/{username}",name="api-user-delete")
   */
  async deleteAction(username) {
    try {
      this.checkAuthorisation(this.query.username, this.query);
      const user = this.getUser()
      return this.usersService.delete(username, user)
        .then((user) => {
          delete user.password;
          delete user["2fa-token"];
          return this.api.render({
            user: user
          });
        })
        .catch((error) => {
          throw error;
        });
    } catch (e) {
      return this.api.renderError(e, e.code || 400);
    }
  }

  /**
   *    @Method ({"TRACE"})
   *
   */
  traceAction() {
    return this.renderResponse(JSON.stringify(this.request.request.headers, null, " "), 200, {
      "Content-Type": "message/http"
    });
  }

}

module.exports = restController;
