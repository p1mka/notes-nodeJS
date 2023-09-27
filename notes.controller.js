const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");

async function saveNotes(notes) {
  await fs.writeFile(notesPath, JSON.stringify(notes));
}

async function addNote(title) {
  const notes = await getNotes();

  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await saveNotes(notes);
  console.log(chalk.bgGreen(`Заметка с id ${note.id} добавлена!`));
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function printNotes() {
  const notes = await getNotes();

  console.log(chalk.bgBlue("Список заметок: "));
  notes.forEach((note) =>
    console.log(chalk.bgBlue(note.id), chalk.blue(note.title))
  );
}

async function editNote(id, title) {
  const notes = await getNotes();

  const noteIndexForRemove = notes.findIndex((note) => note.id === id);

  const note = {
    title,
    id,
  };

  notes.splice(noteIndexForRemove, 1, note);
  await saveNotes(notes);
  return console.log(chalk.bgGreen(`Заметка с id ${note.id} изменена!`));
}

async function removeNote(id) {
  const notes = await getNotes();
  const noteIndexForRemove = notes.findIndex((note) => note.id === id);

  notes.splice(noteIndexForRemove, 1);
  await saveNotes(notes);
  console.log(chalk.bgGreen(`Заметка с id ${id} удалена`));
}

module.exports = {
  addNote,
  getNotes,
  editNote,
  removeNote,
};
