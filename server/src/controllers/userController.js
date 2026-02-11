const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const { name, avatarUrl, bio } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = { updateProfile };
