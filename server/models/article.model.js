import mongoose from "mongoose";

const listItemSchema = new mongoose.Schema({
  // Items within a list
  item: { type: String, required: true },
});

const blockSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Unique block identifier
  type: { type: String, required: true }, // Block type (e.g., paragraph, list, etc.)
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }, // Data content, can be of any type (for paragraphs, lists, etc.)
});

const editorContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    blocks: [blockSchema], // Array of blocks as received from EditorJS
    // image: {
    //   type: String,
    //   required: true,
    // },
    type: {
      type: String,
      required: true,
      enum: ["Coding", "Sports", "Entertainment", "Photography", "Other"],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const EditorContent = mongoose.model("EditorContent", editorContentSchema);

export default EditorContent;
