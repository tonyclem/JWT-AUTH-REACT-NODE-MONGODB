const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

const maxDays = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
};

const handleError = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "incorrect Email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect Password") {
    errors.email = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.create({ email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxDays: maxDays * 1000,
    });
    res.status(201).json({ user: user._id, created: true });
  } catch (error) {
    console.log(error);
    const errors = handleError(error);
    res.json({ errors, created: false });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: false,
      maxDays: maxDays * 1000,
    });
    res.status(200).json({ user: user._id, status: true });
  } catch (error) {
    console.log(error);
    const errors = handleError(error);
    res.json({ errors, status: false });
  }
};
