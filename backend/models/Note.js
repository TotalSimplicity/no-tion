const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
    },
    tags: [String],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      default: null,
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);
