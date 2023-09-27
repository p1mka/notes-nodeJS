document.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (e.target.dataset.type === "remove") {
    remove(id).then(() => {
      e.target.closest("li").remove();
    });
  } else if (e.target.dataset.type === "edit") {
    const newTitle = prompt("Введите новое значение:");

    !newTitle
      ? null
      : edit(id, newTitle).then(() => {
          e.target.closest("li").firstChild.textContent = newTitle;
        });
  }
});

async function remove(id) {
  await fetch(`/${id}`, {
    method: "DELETE",
  });
}

async function edit(id, title) {
  await fetch(`/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "Location/json;charset=utf-8" },
    body: JSON.stringify({
      title,
    }),
  });
}
