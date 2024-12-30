import Wishlist from "../models/wishlist.model.js";

export const addToWishlist = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user._id;
  try {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      const newWishlist = new Wishlist({
        user: userId,
        items: [{ bookId }],
      });
      await newWishlist.save();
      return res
        .status(201)
        .json({ success: true, message: "Added to wishlist" });
    }
    const alreadyAddedBook = wishlist.items.some(
      (item) => item.book.toString() === bookId
    );

    if (alreadyAddedBook) {
      return res
        .status(400)
        .json({ success: false, message: "Book already in wishlist" });
    }
    wishlist.items.push({ book: bookId });
    await wishlist.save();
    return res
      .status(201)
      .json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user._id;
  try {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }
    const updatedWishlist = wishlist.items.filter(
      (item) => item.book.toString() !== bookId
    );
    wishlist.items = updatedWishlist;
    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getWishlist = async (req, res) => {
  const userId = req.user._id;
  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "items.book"
    );
    if (!wishlist) {
      return res
        .status(404)
        .json({ success: false, message: "Wishlist not found" });
    }
    return res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
