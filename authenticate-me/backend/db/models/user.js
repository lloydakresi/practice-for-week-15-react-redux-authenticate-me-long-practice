'use strict';
const { Validator } = require('sequelize');
const bycrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        len: [4, 30],
        isNotEmail(value){
          if(Validator.isEmail(value)){
            throw new Error("Username must not be an e-mail")
          }
        }
      }
    },
    email:{
      type:DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        len:[3, 256],
        isEmail:true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate:{
        len:[60, 60]
      }

  }}, {
    defaultScope:{
      attributes:{
        exclude:['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    },
    scopes:{
      currentUser:{
        attributes:{
          eclude: ['hashedPassword']
        }
      },
      loginUser:{
        attributes:{}
      }

    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };

  User.prototype.toSafeObject = function(){
    const {id, username, email} = this;
    return {id , username, email};
  };

  User.prototype.validatePassword = function(password){
    return bycrypt.compareSync(password, this.hashedPassword.toString())
  };

  User.getCurrentUserById = async function(id){
    return await User.scope('currentUser').findByPk(id)
  }

  User.login = async function({credential, password}){
    const { Op } = require('sequelize');
    const user = await User.scope('currentUser').findOne({
      where:{
        [Op.or]:{
          username: credential,
          email: credential
        }
      }
    })

    if(user && user.validatePassword(password)){
      return await User.scope('currentUser').findByPk(user.id)
    }
  }

  User.signup = async function({username, email, password}){
    const hashedPassword = bycrypt.hashSync(password);
    const user = await User.create({
      username, email, hashedPassword
    });

    return await User.scope('currentUser').findByPk(user.id);
  };

  return User;
};
