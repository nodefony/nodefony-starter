module.exports = {
  Query: {
    //  provides all functions for each API endpoint
    async user(obj, field, context, info) {
      const user = context.getUser()
      const usersService = context.get("users");
      return await usersService.findOne(field.username, user);
    },

    async users(obj, field, context, info) {
      const user = context.getUser()
      const usersService = context.get("users");
      let res = await usersService.find({}, {}, user);
      return res.rows;
    }
  },
  Mutation: {
    async addUser(obj, field, context, info) {
      const {
        input
      } = field;
      const user = context.getUser()
      const usersService = context.get("users");
      let myuser = null;
      let error = null;
      if (!input.password || !input.confirm) {
        error = new Error(`Password can't be empty`);
      }
      if (input.password !== input.confirm) {
        error = new Error(`Bad confirm password`);
      }
      if (error) {
        context.logger(error, "ERROR");
        throw error;
      }
      try {
        myuser = await usersService.create(input, user);
        if (myuser) {
          delete myuser.password;
          delete myuser["2fa-token"];
          return myuser
        }
        throw new nodefony.Error("user not create",400)
      } catch (e) {
        context.logger(e, "ERROR");
        throw new nodefony.Error(e,400)
      }
    },

    async updateUser(obj, field, context, info) {
      const user = context.getUser()
      const usersService = context.get("users");
      const orm = context.kernel.getORM();
      const {
        input
      } = field;
      const username = input.username
      return usersService.findOne(username, user)
        .then(async (myuser) => {
          if (myuser) {
            if (input.password) {
              let confirm = false
              if (input.confirm) {
                if (input.password !== input.confirm) {
                  throw new Error(`Bad confirm password`);
                }
                delete input.confirm;
                confirm = true;
              }
              if (input["old-password"]) {
                let encoder = orm.getNodefonyEntity("user").getEncoder();
                let check = await encoder.isPasswordValid(input["old-password"], myuser.password);
                if (!check) {
                  throw new Error(`User ${username} bad passport`);
                }
                delete input["old-password"];
                confirm = true;
              }
              if (!confirm) {
                throw new Error(`User ${username} no confirm passport`);
              }
            }
            return usersService.update(myuser, input, user)
              .then(async (res) => {
                let message = `Update User ${input.username} OK`;
                context.log(message, "INFO");
                if (context.session && myuser.username === user.username) {
                  if (input.username !== myuser.username) {
                    user.username = input.username;
                  }
                  if (context.locale !== input.lang) {
                    context.session.set("lang", input.lang);
                  }
                }
                let newUser = await usersService.findOne(input.username, user);
                delete newUser.password;
                delete newUser["2fa-token"];
                return newUser
              });
          }
          throw new Error(`User ${username} not found`);
        })
    },

    async deleteUser(obj, field, context, info){
      const {
        username
      } = field;
      const user = context.getUser()
      const usersService = context.get("users");
      return usersService.delete(username, user)
    },

    async deleteUsers(obj, field, context, info){
      const {
        users
      } = field;
      return []
    }
  }
}
