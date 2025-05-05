const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

router.get("/", (req, res) => {
  try {
    Note.find()
      .then((notes) => {
        res.status(200).json(notes);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Error fetching notes" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const newNote = new Note({
      title,
      content,
      tags,
    });

    newNote
      .save()
      .then((note) => {
        res.status(201).json(note);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Error creating note" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;
    Note.findByIdAndDelete(id)
      .then((note) => {
        if (!note) {
          return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Error deleting note" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    console.log("retrieved");
    Note.findByIdAndUpdate(id, { title, content, tags }, { new: true })
      .then((note) => {
        if (!note) {
          return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Error updating note" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
