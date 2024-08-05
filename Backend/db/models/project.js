'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // Define association here
      Project.hasMany(models.ProjectImage, {
        foreignKey: 'projectId',
        as: 'images'
      });

      // Project.hasMany(models.Employee, {
      //   foreignKey: 'projectId',
      //   as: 'employees'
      // });
    }
  }

  Project.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [7, 30],
          msg: "Project Name must have between 7 and 30 characters"
        },
        notEmpty: { 
          msg: "Project Name is required" 
        },
        notNull: {
          msg: "Project Name is required"
        }
      }
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [7, 30],
          msg: "Client Name must have between 7 and 30 characters"
        },
        notEmpty: { 
          msg: "Client Name is required" 
        },
        notNull: {
          msg: "Client Name is required"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: { 
          args: [30, 2000], 
          msg: "Project Description must have between 30 and 2000 characters" 
        },
        notEmpty: { 
          msg: "Project Description is required" 
        },
        notNull: {
          msg: "Project Description is required"
        }
      }
    },
    budget: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { 
          msg: "Budget is required" 
        },
        notNull: {
          msg: "Budget is required"
        },
        min: {
          args: [501],
          msg: "Budget must be greater than 500"
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Start Date is required" },
        isAfterNow(value) {
          if (new Date(value) <= new Date()) {
            throw new Error("Start Date cannot be in the past");
          }
        }
      }
    },
    projectManagerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Completion Date is required" },
        isAfterStartDate(value) {
          if (new Date(value) <= new Date(this.startDate)) {
            throw new Error("Completion Date cannot be on or before Start Date");
          }
        },
      }
    },
  }, {
    sequelize,
    modelName: 'Project',
  });

  return Project;
};
