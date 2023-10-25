const chalk = require("chalk");
const Note = require("./models/note");

async function addNote(title, owner) {
  await Note.create({ title, owner });

  console.log(chalk.bgGreen(`Заметка добавлена!`));
}

async function getNotes() {
  const notes = await Note.find();

  return notes;
}

async function editNote({ id, title }, owner) {
  const result = await Note.updateOne({ _id: id, owner }, { title: title });
  if (result.matchedCount === 0) {
    throw new Error("Нет заметок для редактирования");
  }
  return console.log(chalk.bgGreen(`Заметка с id ${id} изменена!`));
}

async function removeNote(id, owner) {
  const result = await Note.deleteOne({ _id: id, owner });
  if (result.matchedCount === 0) {
    throw new Error("Нет заметок для удаления");
  }
  console.log(chalk.bgGreen(`Заметка с id ${id} удалена`));
}

module.exports = {
  addNote,
  getNotes,
  editNote,
  removeNote,
};
