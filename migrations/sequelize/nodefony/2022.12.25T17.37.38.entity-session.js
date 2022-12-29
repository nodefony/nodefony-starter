'use strict';
const {
  Sequelize,
  DataTypes,
  Model
} = require('sequelize');

class Migrate extends nodefony.Service {
  constructor(kernel) {
    super("Migrate", kernel.container);
    this.entityName = "sessions"
  }

  async up({
    name,
    context: queryInterface
  }) {
    let descriptions = null
    try {
      descriptions = await queryInterface.describeTable(this.entityName)
    } catch (e) {
      this.log(`Migrate file : ${name}`)
    }
    const exist = await queryInterface.tableExists(this.entityName)
    if (exist) {
      this.log(`Entity ${this.entityName} already exist`);
      return descriptions
    }
    let transaction = null
    try {
      transaction = await queryInterface.sequelize.transaction();
      let res = await queryInterface.createTable(this.entityName, {
        session_id: {
          type: DataTypes.STRING(126),
          primaryKey: true
        },
        context: {
          type: DataTypes.STRING(126),
          defaultValue: "default"
        },
        Attributes: {
          type: DataTypes.JSON
        },
        flashBag: {
          type: DataTypes.JSON
        },
        metaBag: {
          type: DataTypes.JSON,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        username: {
          type: DataTypes.STRING(126),
          references: {
            model: 'user',
            key: 'username'
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      }, {
        transaction
      });
      return await transaction.commit();
    } catch (e) {
      if (transaction && !transaction.finished) {
        this.log(e, "ERROR")
        this.log(`Rollback transaction on table ${this.entityName}`);
        await transaction.rollback();
      }
      this.log("Rollback Transaction already finished", "WARNING")
      throw e
    }
  }

  async down({
    name,
    context: queryInterface,
    context: sequelize
  }) {
    try {
      const descriptions = await queryInterface.describeTable(this.entityName)
      return await queryInterface.dropTable(this.entityName);
    } catch (e) {
      this.log(`Entity ${this.entityName} not exist`, "WARNING")
      throw e
    }
  }
}

module.exports = new Migrate(kernel);
