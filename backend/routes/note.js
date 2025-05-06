const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id/get-children", async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await Note.find({ parent: id });
    if (!notes) {
      return res.status(404).json({ message: "No children notes found" });
    }
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/", async (req, res) => {
  try {
    const { title, content, tags, parent } = req.body;
    const newNote = new Note({
      title,
      content,
      tags,
      parent: parent || null,
    });
    const savedNote = await newNote.save();

    if (parent) {
      await Note.findByIdAndUpdate(parent, {
        $push: { children: savedNote._id },
      });
    }
    res.status(201).json(savedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await deleteNoteAndChildren(id);
    res
      .status(200)
      .json({ message: "Note and its children deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

async function deleteNoteAndChildren(noteId) {
  const note = await Note.findById(noteId);
  if (!note) return;

  for (const childId of note.children) {
    await deleteNoteAndChildren(childId);
  }

  if (note.parent) {
    await Note.findByIdAndUpdate(note.parent, {
      $pull: { children: note._id },
    });
  }

  await Note.findByIdAndDelete(noteId);
}

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the note to update
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Create update object with only the fields provided in the request
    const updateFields = {};
    const { title, content, tags, parent } = req.body;
    
    // Only add fields to the update object if they were provided
    if (title !== undefined) updateFields.title = title;
    if (content !== undefined) updateFields.content = content;
    if (tags !== undefined) updateFields.tags = tags;
    if (parent !== undefined) updateFields.parent = parent || null;

    // Special handling for parent changes to maintain referential integrity
    if (parent !== undefined && parent !== note.parent?.toString()) {
      // Remove this note from old parent's children array
      if (note.parent) {
        await Note.findByIdAndUpdate(note.parent, {
          $pull: { children: note._id },
        });
      }
      
      // Add this note to new parent's children array
      if (parent) {
        await Note.findByIdAndUpdate(parent, {
          $push: { children: note._id },
        });
      }
    }

    // Only perform update if there are fields to update
    if (Object.keys(updateFields).length > 0) {
      const updatedNote = await Note.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
      );
      
      res.status(200).json(updatedNote);
    } else {
      // If no fields were provided to update, just return the existing note
      res.status(200).json(note);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
