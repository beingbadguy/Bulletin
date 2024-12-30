import EditorContent from "../models/article.model.js";
import cloudinary from "cloudinary";

export const AddArticle = async (req, res) => {
  const { title, content, type } = req.body;
  // console.log(req.user);
  const userId = req.user._id;
  // console.log(req.files.image);
  // const imageFile = req.files.image;
  // console.log(content);

  try {
    // const imageResult = await cloudinary.v2.uploader.upload(
    //   imageFile.tempFilePath,
    //   {
    //     folder: "Article", // Folder name in Cloudinary where the file will be stored
    //   }
    // );
    const editorContent = new EditorContent({
      title: title || "My Document", // Use title or set default
      blocks: content,
      type: type, // Type of content (Article, Book, etc.)
      postedBy: userId,
      // image: imageResult.secureUrl, // Pass the blocks data as it is from EditorJS
    });

    // Save content to the database
    await editorContent.save();

    res.status(201).json({
      success: true,
      message: "Content saved successfully",
      data: content.blocks,
    });
  } catch (err) {
    console.error("Error saving content:", err);
    res
      .status(500)
      .json({ success: false, message: "Error saving content", error: err });
  }
};

export const GetArticle = async (req, res) => {
  try {
    const content = await EditorContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }
    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (err) {
    console.error("Error getting content:", err);
    res
      .status(500)
      .json({ success: false, message: "Error getting content", error: err });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const contents = await EditorContent.find();
    res.status(200).json({
      success: true,
      data: contents,
    });
  } catch (err) {
    console.error("Error getting contents:", err);
    res
      .status(500)
      .json({ success: false, message: "Error getting contents", error: err });
  }
};

export const deleteArticle = async (req, res) => {
  console.log(req.user._id);
  try {
    const content = await EditorContent.findById(req.params.id);

    console.log(content.postedBy);
    if (content.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this content",
      }); // User is not authorized to delete the content.
    }

    const thatContent = await EditorContent.findByIdAndDelete(req.params.id);
    if (!thatContent) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting content:", err);
    res
      .status(500)
      .json({ success: false, message: "Error deleting content", error: err });
  }
};
