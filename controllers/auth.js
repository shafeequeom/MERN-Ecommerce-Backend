const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  const { name, picture, email } = res.user;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name, picture },
      { new: true }
    );

    if (user) {
      res.json(user);
    } else {
      const newUser = await new User({
        email,
        name,
        picture,
      }).save();
      res.json(newUser);
    }
  } catch (error) {
    console.log(error);
  }
};
