/**
 *    @Route ("/api/graphql/users")
 *
 */
const userType = require(path.resolve(__dirname, "userType.js"));
const userResolver = require(path.resolve(__dirname, "userResolver.js"));

module.exports = class graphqlController extends nodefony.Controller {

  constructor(container, context) {
    super(container, context);
    // service entity
    this.usersService = this.get("users");
    // graphql api
    this.api = new nodefony.api.Graphql({
      name: "users-grahql-api",
      version: this.bundle.version,
      description: "Nodefony Users graphql Api",
      basePath: "/api/graphql/users",
      schema: graphqlController.schema(this.context),
      rootValue: this
    }, this.context);
  }

  /**
   *    @Method ({"GET", "POST","OPTIONS"})
   *    @Route ( "*",name="api-user-graphql")
   */
  graphqlAction() {
    try {
      return this.api.query(this.query.query, this.query.variables, this.query.operationName)
        .then((data) => {
          return this.api.render(data);
        }).catch((e) => {
          this.api.logger(this.query.query, "WARNING")
          this.api.logger(e, "ERROR");
          return this.api.renderError(e, 400);
        });
    } catch (e) {
      throw e;
    }
  }

  static schema(context) {
    return  nodefony.api.Graphql.makeExecutableSchema({
      typeDefs: graphqlController.types(context),
      resolvers: graphqlController.resolvers(context)
    });
  }

  static types(context) {
    return [userType];
  }
  static resolvers(context) {
    return [userResolver]
  }

}
