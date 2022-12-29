'use strict';
const {
  Sequelize,
  DataTypes,
  Model
} = require('sequelize');

class Migrate extends nodefony.Service {
  constructor(kernel) {
    super("Migrate", kernel.container);
    this.entityName = "jwts"
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
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        refreshToken: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        token: {
          type: DataTypes.TEXT,
        },
        active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
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
    //`username` VARCHAR(126) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE);
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
