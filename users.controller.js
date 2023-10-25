const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./constants");

const addUser = async (email, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, password: passwordHash });
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Пользователь не найден!");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("Неверный пароль!");
  }

  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "30d" }); //сразу делаем объект, чтоб можно было в любой момент добавить данные
};

module.exports = {
  addUser,
  loginUser,
};
