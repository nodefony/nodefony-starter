// migrations/00_initial.js

const {
  Sequelize
} = require('sequelize');

class Migrate extends nodefony.Service {
  constructor(kernel) {
    super("Migrate", kernel.container);
    this.serviceUmzug = this.get("umzug");
    this.orm = this.kernel.getOrm();
  }

  async up({
    context: queryInterface
  }) {
    this.log("Migrate up for user table");
    let sequelize = queryInterface.sequelize;
    let userModel = sequelize.model("user");

    return await queryInterface.describeTable("user")
      .then(async (tableDefinition) => {
        if (tableDefinition.token) {
          return Promise.resolve(userModel)
        }
        this.transaction = await queryInterface.sequelize.transaction();
        return queryInterface.addColumn(
          "user",
          "token", {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: "1234"
          }, {
            transaction: this.transaction
          }
        ).then(() => {
          return Promise.resolve(userModel);
        })
      })
      .then(async (model) => {
        this.log("Migrate upgrade data for user table");
        let users = await model.findAll();
        users.map(async (user) => {
          // change data
					this.log(`Update token for user : ${user.username}`);
          /*await user.update({
          }).then((updatedRecord) => {
            this.log(`Update token for user : ${updatedRecord.username}`);
          })*/
        })
				if( this.transaction){
					await this.transaction.commit();
				}
				return this;
      })
      .catch(async (e) => {
        if (this.transaction) {
          await this.transaction.rollback();
        }
        return Promise.reject(e);
      })
  }

  async down({
    context: queryInterface
  }) {
    this.log("Migrate Reverting for user table");
    let sequelize = queryInterface.sequelize;
    let userModel = sequelize.model("user");
    return await queryInterface.describeTable("user")
      .then(async (tableDefinition) => {
        if (tableDefinition.token) {
          this.transaction = await queryInterface.sequelize.transaction();
          return await queryInterface.removeColumn("user", "token", {
            transaction: this.transaction
          });
        }
        return Promise.resolve(userModel);
      })
      .then(() => {
        this.log(`Table user removeColumn token`);
        return userModel
      })
      .then(async (model) => {
        let users = await model.findAll();
        users.map(async (user) => {
					this.log(`Update user when migrate down : ${user.username}`);
        });
				if( this.transaction){
					await this.transaction.commit();
				}
        return this;
      })
      .catch(async (e) => {
        if (this.transaction) {
          await this.transaction.rollback();
        }
        this.log(e, "ERROR");
      })
  }
}

module.exports = new Migrate(kernel);
