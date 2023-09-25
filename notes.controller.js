const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");

async function addNote(title) {
  const notes = await getNotes();

  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await fs.writeFile("./db.json", JSON.stringify(notes));
  console.log(chalk.bgGreen("Note was added"));
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

async function removeNote(id) {
  if (!id) {
    return console.log(chalk.red("Необходим ID заметки!"));
  }

  const notes = await getNotes();
  const noteIndexForRemove = await notes.findIndex((note) => note.id === id);

  if (noteIndexForRemove === -1) {
    return console.log(chalk.red("Заметки с таким ID не существует!"));
  }

  notes.splice(noteIndexForRemove, 1);
  await fs.writeFile("./db.json", JSON.stringify(notes));
  console.log(chalk.bgGreen("Заметка удалена"));
}

module.exports = {
  addNote,
  printNotes,
  removeNote,
};
