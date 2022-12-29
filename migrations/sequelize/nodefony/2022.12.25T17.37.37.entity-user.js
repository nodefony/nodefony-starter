'use strict';
const {
  Sequelize,
  DataTypes,
  Model
} = require('sequelize');

class Migrate extends nodefony.Service {
  constructor(kernel) {
    super("Migrate", kernel.container);
    this.entityName = "user"
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
        username: {
          type: DataTypes.STRING(126),
          primaryKey: true,
          unique: true,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING(256),
          allowNull: false
        },
        "2fa": {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        "2fa-token": DataTypes.STRING(256),
        enabled: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        userNonExpired: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        credentialsNonExpired: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        accountNonLocked: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        email: {
          type: DataTypes.STRING,
          //primaryKey: true,
          unique: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        surname: {
          type: DataTypes.STRING,
          allowNull: true
        },
        lang: {
          type: DataTypes.STRING,
          defaultValue: "en_en"
        },
        roles: {
          type: DataTypes.JSON,
          defaultValue: ["ROLE_USER"]
        },
        gender: {
          type: DataTypes.STRING,
          defaultValue: "none"
        },
        url: {
          type: DataTypes.STRING,
          allowNull: true
        },
        image: DataTypes.STRING,
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
        }
      }, {
        transaction
      });
      await transaction.commit();
      return await queryInterface.addIndex(this.entityName, {
        unique: true,
        fields: ['email']
      })
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
