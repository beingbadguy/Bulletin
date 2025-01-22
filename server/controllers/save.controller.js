import User from "../models/user.model.js";

export const saveArticle = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.saved.includes(id)) {
      return res.status(200).json({
        success: true,
        message: "Article already saved",
      }); // User has already saved this article.
    } else {
      user.saved.push(id);
      await user.save();
    }

    res.json({
      success: true,
      message: "Article saved successfully",
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeArticle = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { articles: id } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      message: "Article saved successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({
      success: false,
      message: "Internal server error",
    });
  }
};
