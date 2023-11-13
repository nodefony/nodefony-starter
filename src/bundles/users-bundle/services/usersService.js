/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable max-lines-per-function */
module.exports = class users extends nodefony.Service {
  constructor (container) {
    super("users", container);
    this.orm = this.kernel.getORM();
    this.ormName = this.orm.name;
    if (this.orm.ready) {
      this.initialize();
    } else {
      this.orm.on("onOrmReady", () => {
        this.initialize();
      });
    }
  }

  initialize () {
    this.entity = this.orm.getEntity("user");
  }

  getSchemaAttributes () {
    switch (this.ormName) {
    case "sequelize":
      return this.entity.rawAttributes;
    case "mongoose":
      return this.entity.schema.paths;
    }
  }

  checkSchema (query) {
    try {
      if (query) {
        const attr = this.getSchemaAttributes();
        for (const ele in query) {
          if (ele in attr) {
            continue;
          }
          throw new nodefony.Error(`${ele} not found in User Entity Schema`, 400);
        }
      }
    } catch (e) {
      throw e;
    }
  }

  async sanitizeError (error, transaction = null) {
    this.log(error, "ERROR");
    if (transaction && !transaction.finished) {
      switch (this.ormName) {
      case "sequelize":
        if (!transaction.finished) {
          await transaction.rollback();
        }
        break;
      case "mongoose":
        await transaction.abortTransaction();
        break;
      }
    }
    if (nodefony.Error.isError(error) === "SequelizeError") {
      return new nodefony.Error(error);
    }
    return error;
  }

  checkAuthorisation (action, user = null, query = null) {
    if (!user) {
      throw new nodefony.authorizationError("User not authorized", 403);
    }
    const obj = {
      isAdmin: user.hasRole("ROLE_ADMIN"),
      isUser: user.hasRole("ROLE_USER"),
      query
    };
    switch (action) {
    case "update":
      if (!obj.isAdmin) {
        if (query.where) {
          if (user.username !== query.where.username) {
            throw new nodefony.authorizationError("User not authorized", 403);
          }
        } else {
          throw new nodefony.authorizationError("User not authorized", 403);
        }
      }
      break;
    case "insert":
    case "delete":
      if (!obj.isAdmin) {
        throw new nodefony.authorizationError("User not authorized", 403);
      }
      break;
    case "search":
    case "list":
      if (!obj.isAdmin) {
        if (!obj.isUser) {
          throw new nodefony.authorizationError("User not authorized", 403);
        }
      }
      break;
    case "find":
    case "findAll":
    case "findOne":
      if (!obj.isAdmin) {
        if (!obj.isUser) {
          throw new nodefony.authorizationError("User not authorized", 403);
        }
      }
      break;
    default:
      throw new nodefony.authorizationError("Action not authorized", 403);
    }
    return obj;
  }

  async find (query = {}, options = {}, user) {
    try {
      const auth = this.checkAuthorisation("find", user, query);
      switch (this.ormName) {
      case "mongoose":
        if (options.limit || options.offset || options.page) {
          return this.entity.paginate(auth.query, {
            page: options.page,
            limit: options.limit,
            offset: options.offset
          })
            .then((res) => {
              const tab = [];
              if (!res) {
                return {
                  page: options.page,
                  limit: options.limit,
                  offset: options.offset,
                  total: tab.length,
                  rows: tab
                };
              }
              return {
                page: res.page,
                limit: res.limit,
                offset: res.offset,
                total: res.totalDocs,
                totalPages: res.totalPages,
                pagingCounter: res.pagingCounter,
                hasPrevPage: res.hasPrevPage,
                hasNextPage: res.hasNextPage,
                prevPage: res.prevPage,
                nextPage: res.nextPage,
                rows: res.docs
              };
            })
            .catch(async (e) => {
              throw await this.sanitizeError(e);
            });
        }
        return this.entity.find(auth.query, options)
          .then((res) => {
            const tab = [];
            if (!res) {
              return {
                total: tab.length,
                rows: tab
              };
            }
            return {
              total: res.length,
              rows: res
            };
          })
          .catch(async (e) => {
            throw await this.sanitizeError(e);
          });
      case "sequelize":
        // query = nodefony.extend(query, options);
        if (query.limit || query.offset) {
          return this.entity.findAndCountAll(auth.query)
            .then((res) => {
              const tab = [];
              if (!res) {
                return {
                  page: query.page,
                  limit: query.limit,
                  offset: query.offset,
                  total: tab.length,
                  rows: tab
                };
              }
              res.rows.map((el) => {
                const userS = el.get({
                  plain: true
                });
                tab.push(userS);
              });
              return {
                page: query.page,
                limit: query.limit,
                offset: query.offset,
                total: res.count,
                rows: tab
              };
            })
            .catch(async (e) => {
              throw await this.sanitizeError(e);
            });
        }
        return this.entity.findAll(auth.query)
          .then((res) => {
            const tab = [];
            if (!res) {
              return {
                total: tab.length,
                rows: tab
              };
            }
            res.map((el) => {
              const userS = el.get({
                plain: true
              });
              tab.push(userS);
            });
            return {
              total: tab.length,
              rows: tab
            };
          })
          .catch(async (e) => {
            throw await this.sanitizeError(e);
          });
      }
    } catch (e) {
      throw await this.sanitizeError(e);
    }
  }

  async findOne (username, user) {
    try {
      switch (this.ormName) {
      case "mongoose":
        return this.entity.findOne({
          username
        })
          .catch(async (e) => {
            throw await this.sanitizeError(e);
          });
      case "sequelize":
        return this.entity.findOne({
          where: {
            username
          }
        })
          .then((user) => {
            if (!user) {
              throw new nodefony.Error(`Username ${username} not found`, 404);
            }
            return user;
          })
          .catch(async (e) => {
            throw await this.sanitizeError(e);
          });
      }
    } catch (e) {
      throw await this.sanitizeError(e);
    }
  }

  async update (userentity, value, user, transac = null) {
    let transaction = transac;
    if (!transac) {
      transaction = await this.orm.startTransaction("user");
    }
    switch (this.ormName) {
    case "mongoose":
      try {
        return userentity.updateOne(value, {
          //  session: transaction
        })
          .then(async (user) =>
          // await transaction.commitTransaction();
            user)
          .catch(async (e) => {
            throw await this.sanitizeError(e, transaction);
          });
      } catch (e) {
        throw await this.sanitizeError(e, transaction);
      } finally { }
    case "sequelize":
      try {
        const {
          username
        } = userentity;
        return this.entity.update(value, {
          where: {
            username
          },
          transaction
        })
          .then(async (user) => {
            await transaction.commit();
            return user;
          })
          .catch(async (e) => {
            throw await this.sanitizeError(e, transaction);
          });
      } catch (e) {
        throw await this.sanitizeError(e, transaction);
      }
    }
  }

  async create (query, user, transac = null) {
    let transaction = transac;
    if (!transac) {
      transaction = await this.orm.startTransaction("user");
    }
    switch (this.ormName) {
    case "sequelize":
      try {
        return this.entity.create(query, {
          transaction
        })
          .then(async (user) => {
            await transaction.commit();
            return user;
          })
          .catch(async (e) => {
            throw await this.sanitizeError(e, transaction);
          });
      } catch (e) {
        throw await this.sanitizeError(e, transaction);
      }
    case "mongoose":
      try {
        return this.entity.create([query], {
          // session: transaction
        })
          .then(async (myuser) =>
          // await transaction.commitTransaction();
            myuser[0] || myuser)
          .catch(async (e) => {
            throw await this.sanitizeError(e, transaction);
          });
      } catch (e) {
        throw await this.sanitizeError(e, transaction);
      }
    }
  }

  async delete (username, user, transac = null) {
    let transaction = transac;
    if (!transac) {
      transaction = await this.orm.startTransaction("user");
    }
    switch (this.ormName) {
    case "mongoose":
      try {
        return this.entity.findOne({
          username
        })
          .then((user) => {
            if (!user) {
              throw new nodefony.Error(`User ${username} not found`);
            }
            return user.deleteOne({
              force: true
              // session: transaction
            })
              .then(async (state) =>
              // await transaction.commitTransaction();
                ({username}))
              .catch(async (e) => {
                throw await this.sanitizeError(e, transaction);
              });
          })
          .catch(async (e) => {
            throw await this.sanitizeError(e, transaction);
          });
      } catch (e) {
        throw await this.sanitizeError(e, transaction);
      }
    case "sequelize":
      try {
        return this.entity.findOne({
          where: {
            username
          }
        })
          .then((user) => {
            if (!user) {
              throw new nodefony.Error(`User ${username} not found`);
            }
            return user.destroy({
              transaction
            })
              .then(async (user) => {
                await transaction.commit();
                return user;
              })
              .catch(async (e) => {
                throw await this.sanitizeError(e, transaction);
              });
          })
          .catch(async (e) => {
            throw await this.sanitizeError(e, transaction);
          });
      } catch (e) {
        throw await this.sanitizeError(e, transaction);
      }
    }
  }
};
