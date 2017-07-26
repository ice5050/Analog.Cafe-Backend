module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    username: DataTypes.STRING,
    realUsername: DataTypes.STRING,
    name: DataTypes.STRING,
    profilePic: DataTypes.STRING,
    role: DataTypes.STRING
  })
}
