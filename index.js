require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const {
  addNote,
  getNotes,
  editNote,
  removeNote,
} = require("./notes.controller");
const { addUser, loginUser } = require("./users.controller");
const auth = require("./middlewares/auth");

const port = 3005;
const app = express();

app.set("view engine", "ejs"); //настройка ejs для express
app.set("views", "pages");

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.json()); // чтобы была возможность отправлять на сервер данные в формате JSON
app.use(cookieParser()); //middleware, добавляет к запросу cookie и метод для их отправки
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/login", async (req, res) => {
  res.render("login", {
    title: "Express App",
    error: undefined,
  }); //возвращает страницу пользователю
});

app.get("/register", async (req, res) => {
  res.render("register", {
    title: "Express App",
    error: undefined,
  }); //возвращает страницу пользователю
});
app.post("/register", async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);
    res.redirect("/login");
  } catch (e) {
    if (e.code === 11000) {
      res.render("register", {
        title: "Express App",
        error: "Этот E-mail уже используется",
      });
    }
    res.render("register", {
      title: "Express App",
      error: e.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/");
  } catch (e) {
    res.render("login", {
      title: "Express App",
      error: e.message,
    });
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true });
  res.redirect("/login");
});

app.use(auth);

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Express App",
    notes: await getNotes(),
    userEmail: req.user.email,
    created: false,
    error: false,
  }); //возвращает страницу пользователю
});

app.post("/", async (req, res) => {
  try {
    await addNote(req.body.title, req.user.email);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: true,
      error: false,
    });
  } catch (e) {
    console.error("Ошибка создания", e);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: true,
    });
  }
});

app.put("/:id", async (req, res) => {
  try {
    await editNote({ id: req.params.id, title: req.body.title });
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    await removeNote(req.params.id);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
  app.listen(port, () => {
    console.log(chalk.green(`Сервер запущен на порту ${port}`));
  });
});
