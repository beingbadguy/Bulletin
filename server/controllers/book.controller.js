import cloudinary from "cloudinary";
import Book from "../models/book.model.js";

export const createBook = async (req, res) => {
  const { title, author, description, price } = req.body;
  const bookpdf = req.files?.pdf;

  try {
    // Validate input fields
    if (!title || !author || !description || !price || !bookpdf) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields and upload a PDF file",
      });
    }

    // Validate if the uploaded file is a PDF
    if (bookpdf.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Uploaded file must be a PDF",
      });
    }

    // Upload the PDF to Cloudinary
    const pdfUploadResult = await cloudinary.v2.uploader.upload(
      bookpdf.tempFilePath,
      {
        folder: "books", // Folder name in Cloudinary where the file will be stored
        resource_type: "raw", // Automatically determine the type of
        format: "pdf",
      }
    );

    console.log(pdfUploadResult);

    // Create the book document in your database with the uploaded file's URL
    const book = await Book.create({
      title,
      author,
      description,
      price,
      previewLink: pdfUploadResult.secure_url, // Secure URL to the uploaded PDF on Cloudinary
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
