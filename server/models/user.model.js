const { sequelize } = require("../config/connectDB");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const CustomError = require("../errors");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "A  firstname is required!",
        },
        isLowercase: true,
        isAlphanumeric: true,
        len: [1, 50],
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "A  lastname is required!",
        },
        isLowercase: true,
        isAlphanumeric: true,
        len: [1, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: "Email format is not correct",
        },
        len: [10, 100],
      },
      unique: {
        args: true,
        msg: "Email address already in use",
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 11],
      },
      unique: {
        args: true,
        msg: "Phone number already linked to existing account",
      },
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: "Birth format is not correct",
        },
        notEmpty: {
          args: true,
          msg: "Please provide a password",
        },
      },
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide a password",
        },
        len: {
          args: [8, 100],
          msg: "The password should be at least 8 chars long",
        },
      },
    },
    confirmed_password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "You need to confirm your pssword",
        },
        passwordsMatch(val) {
          if (val != this.password) {
            throw new CustomError.BadRequestError(
              "Passwords does not match each other"
            );
          }
          return true;
        },
      },
    },
    verification_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reset_password_token: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: "default.jpg",
    },
    last_active: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  },
  {
    hooks: {
      beforeSave: async user => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeCreate: user => {
        const now = new Date();
        now.setFullYear(now.getFullYear() - 18);
        const birthDate = new Date(user.birth_date);
        if (now < birthDate) {
          throw new CustomError.BadRequestError(
            "Sorry you need to be older than 18 to create an account"
          );
        }
      },
      afterDestroy: async user => {
        const accounts = await user.getBankAccounts();
        //  accounts.forEach(async account => {
        //     await account.destroy();
        //   });
        accounts.forEach(async account => await account.destroy());
      },
    },
    validate: {
      usernamePassMatch() {
        if (this.username === this.password) {
          throw new Error("Password cannot be your username");
        }
      },
    },
    paranoid: true,
  }
);

User.prototype.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
