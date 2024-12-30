import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    reviews: {
      type: Number,
    },
    ratings: {
      type: Number,
    },
    previewLink: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Book = new mongoose.model("Book", bookSchema);

export default Book;
