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

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id)
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
})

router.get("/get-children/:id", async (req, res) => {
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
}
);

router.post("/", async (req, res) => {
  try {
    const { title, content, tags, parentId } = req.body;
    const newNote = new Note({
      title,
      content,
      tags,
      parent: parentId || null,
    });
    const savedNote = await newNote.save()

    if (parentId) {
      await Note.findByIdAndUpdate(parentId, {
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
    const note = await Note.findById(id)

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await deleteNoteAndChildren(id);
    res.status(200).json({ message: "Note and its children deleted successfully" });
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
    const { title, content, tags, parentId } = req.body;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (parentId !== undefined && parentId !== note.parent?.toString()) {
      if (note.parent) {
        await Note.findByIdAndUpdate(note.parent, {
          $pull: { children: note._id },
        });
      }
      if (parentId) {
        await Note.findByIdAndUpdate(parentId, {
          $push: { children: note._id },
        });
      }
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, tags, parent: parentId || null },
      { new: true }
    );

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
