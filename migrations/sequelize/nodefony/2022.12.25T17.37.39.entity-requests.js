'use strict';
const {
  Sequelize,
  DataTypes,
  Model
} = require('sequelize');

class Migrate extends nodefony.Service {
  constructor(kernel) {
    super("Migrate", kernel.container);
    this.entityName = "requests"
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
          primaryKey: true,
          autoIncrement: true
        },
        remoteAddress: {
          type: DataTypes.STRING
        },
        userAgent: {
          type: DataTypes.STRING
        },
        url: {
          type: DataTypes.TEXT
        },
        route: {
          type: DataTypes.STRING
        },
        method: {
          type: DataTypes.STRING
        },
        state: {
          type: DataTypes.STRING
        },
        protocol: {
          type: DataTypes.STRING
        },
        scheme: {
          type: DataTypes.STRING
        },
        time: {
          type: DataTypes.FLOAT
        },
        data: {
          type: DataTypes.TEXT
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
        }
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
