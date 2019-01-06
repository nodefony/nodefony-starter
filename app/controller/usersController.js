/**
 *    @Route ("/users")
 */
module.exports = class usersController extends nodefony.controller {

  constructor(container, context) {
    super(container, context);
    // start session
    this.startSession();
    // CSRF cross-site request forgery
    this.setCsrfToken("nodefony_csrf", {
      secret: "Make him an offer he can't refuse",
      cookie: {
        signed: false,
        secure: true,
        sameSite: "strict",
        path: "/users",
        maxAge: 200
      }
    });
    this.entity = this.getEntity("user");
    this.ormName = this.getOrm().name;
    this.translation = this.get("translation");
  }

  /**
   *    @Method ({"GET", "POST"})
   *    @Route ( "/create", name="nodefony-user-create")
   *
   */
  createAction() {
    switch (this.method) {
    case "GET":
      let size = Object.keys(this.queryGet).length;
      if (size) {
        if (this.queryGet.roles) {
          this.queryGet.roles = this.queryGet.roles.split(",");
        }
        this.queryGet.passwd = null;
        this.queryGet.confirm = null;
      }
      return this.render("app:users:createUser.html.twig", {
        langs: this.translation.getLangs(),
        locale: this.getLocale(),
        queryString: size ? this.queryGet : null
      });
    case "POST":
      // FORM DATA
      let error = null;
      if (!this.query.passwd || !this.query.confirm) {
        error = new Error(`Password can't be empty`);
      }
      if (this.query.passwd !== this.query.confirm) {
        error = new Error(`Bad confirm password`);
      }
      if (error) {
        this.setFlashBag("error", error.message);
        this.logger(error, "ERROR");
        delete this.query.passwd;
        delete this.query.confirm;
        return this.redirectToRoute("nodefony-user-create", {
          queryString: this.query
        });
      }
      if (nodefony.typeOf(this.query.roles) === "string") {
        this.query.roles = [this.query.roles];
      }
      this.checkAuthorisation(null, this.query);
      return this.create()
        .then((user) => {
          let message = `${this.translate("added", "users")} ${user.username}`;
          this.setFlashBag("info", message);
          this.logger(message, "INFO");
          return this.redirectToRoute("home");
        })
        .catch((error) => {
          this.setFlashBag("error", error.message);
          this.logger(error, "ERROR");
          delete this.query.passwd;
          delete this.query.confirm;
          return this.redirectToRoute("nodefony-user-create", {
            queryString: this.query
          });
        });
    default:
      throw new Error("Bad Method");
    }
  }

  /**
   *    @Method ({"GET","POST", "PUT"})
   *    @Route ( "/update/{username}", name="nodefony-user-update")
   */
  updateAction(username) {
    this.checkAuthorisation(username, this.query);
    switch (this.method) {
    case "GET":
      return this.findOne(username)
        .then((result) => {
          if (result) {
            return this.render("app:users:createUser.html.twig", {
              user: result,
              langs: this.translation.getLangs(),
              locale: this.getLocale()
            });
          }
          throw new Error(`User ${username} not found`);
        }).catch(e => {
          throw e;
        });
    case "PUT":
    case "POST":
      return this.findOne(username)
        .then((user) => {
          if (user) {
            if (nodefony.typeOf(this.query.roles) === "string") {
              this.query.roles = [this.query.roles];
            }
            let value = {
              username: this.query.username || null,
              email: this.query.email,
              name: this.query.name,
              surname: this.query.surname,
              gender: this.query.gender,
              roles: this.query.roles || [],
              lang: this.query.lang,
              enabled: this.query.enabled
            };
            if (this.query.passwd && this.isGranted("ROLE_ADMIN")) {
              let error = null;
              if (this.query.passwd && this.query.passwd !== this.query.confirm) {
                error = new Error(`Bad confirm password`);
              }
              if (error) {
                throw error;
              }
              value.password = this.query.passwd;
            } else {
              if (this.query.passwd && this.query["old-passwd"]) {
                let encoder = this.getNodefonyEntity("user").getEncoder();
                let check = encoder.isPasswordValid(this.query["old-passwd"], user.password);
                if (check) {
                  value.password = this.query.passwd;
                } else {
                  throw new Error(`User ${username} bad passport`);
                }
              }
            }
            return this.update(user, value)
              .then(() => {
                let message = `Update User ${this.query.username} OK`;
                this.setFlashBag("info", message);
                this.logger(message, "INFO");
                let currentUser = this.getUser();
                if (user.username === currentUser.username) {
                  if (this.query.username !== user.username) {
                    currentUser.username = this.query.username;
                  }
                  if (this.getLocale() !== this.query.lang) {
                    this.session.set("lang", this.query.lang);
                  }
                  let token = this.getToken();
                  return token.refreshToken(this.context)
                    .then(() => {
                      return this.redirectToRoute("home");
                    })
                    .catch((error) => {
                      throw error;
                    });
                }
                return this.redirectToRoute("home");
              });
          }
          throw new Error(`User ${username} not found`);
        })
        .catch((error) => {
          this.setFlashBag("error", error.message);
          this.logger(error, "ERROR");
          return this.redirectToRoute("nodefony-user-update", {
            username: username
          });
        });
    default:
      throw new Error("Bad Method");
    }
  }

  /**
   *    @Method ({"GET", "POST", "DELETE"})
   *    @Route ("/delete/{username}", name="nodefony-user-delete")
   *
   */
  deleteAction(username) {
    this.checkAuthorisation(username);
    return this.findOne(username)
      .then((user) => {
        if (user) {
          return this.delete(user)
            .then((result) => {
              let message = `Delete User ${result.username} OK`;
              this.setFlashBag("info", message);
              if (this.getUser().username === username) {
                this.session.invalidate();
              }
              return this.redirectToRoute("nodefony-user");
            }).catch(e => {
              this.logger(e, "ERROR");
              this.setFlashBag("error", e.message);
              return this.redirectToRoute("nodefony-user");
            });
        }
        let error = new nodefony.Error(`User ${username} not found`, this.context);
        this.setFlashBag("error", error.message);
        this.logger(error, "ERROR");
        return this.redirectToRoute("nodefony-user");
      }).catch(e => {
        throw e;
      });
  }

  /**
   *    @Method ({"GET", "PUT", "POST", "DELETE"})
   *    @Route ( "/{username}",name="nodefony-user",defaults={"username" = ""})
   *
   */
  userAction(username) {
    if (username) {
      switch (this.method) {
      case "PUT":
        return this.updateAction(username);
      case "DELETE":
        return this.deleteAction(username);
      case "GET":
        return this.findOne(username)
          .then((result) => {
            if (result) {
              return this.render("app:users:readUsers.html.twig", {
                users: [result]
              });
            }
            return this.render("app:users:readUsers.html.twig");
          }).catch(e => {
            throw e;
          });
      }
    }
    switch (this.method) {
    case "POST":
      return this.createAction();
    default:
      return this.find()
        .then((result) => {
          return this.render("app:users:readUsers.html.twig", {
            users: result
          });
        }).catch(e => {
          throw e;
        });
    }
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
    }
    if (query && query.role && query.role.length) {
      if (query.role.indexOf("ROLE_ADMIN") >= 0 && (!granted)) {
        throw new nodefony.authorizationError("Unauthorized Role", 401, this.context);
      }
    }
    return true;
  }

  find() {
    switch (this.ormName) {
    case "mongoose":
      return this.entity.find();
    case "sequelize":
      return this.entity.findAll();
    }
  }

  findOne(username) {
    switch (this.ormName) {
    case "mongoose":
      return this.entity.findOne({
        username: username
      });
    case "sequelize":
      return this.entity.findOne({
        where: {
          username: username
        }
      });
    }
  }

  update(user, value) {
    switch (this.ormName) {
    case "mongoose":
      return user.update(value);
    case "sequelize":
      return user.update(value);
    }
  }

  create() {
    switch (this.ormName) {
    case "mongoose":
    case "sequelize":
      return this.entity.create({
        username: this.query.username || null,
        email: this.query.email,
        password: this.query.passwd,
        name: this.query.name,
        surname: this.query.surname,
        gender: this.query.gender,
        roles: this.query.roles
      });
    }
  }

  delete(user) {
    switch (this.ormName) {
    case "mongoose":
      return user.remove({
        force: true
      });
    case "sequelize":
      return user.destroy();
    }
  }

};