window.onload =
  async function listCategories() {
    const response = await fetch('http://loja.buiar.com/?key=2xhj8d&f=json&c=categoria&t=listar');
    const data = await response.json();

    const table = document.getElementById('categories-list');

    data.dados.forEach((category) => {
      let tr = document.createElement("tr");
      let tdId = document.createElement("td");
      let tdName = document.createElement("td");
      let tdEdit = document.createElement("td");
      let tdDelete = document.createElement("td");

      tdId.innerText = category.id;
      tdName.innerText = category.nome;
      tdEdit.innerHTML = `<button onclick="openEditModal(${category.id});">Editar</button>`;
      tdDelete.innerHTML = `<button onclick="removeCategory(${category.id});">Deletar</button>`;

      tr.appendChild(tdId);
      tr.appendChild(tdName);
      tr.appendChild(tdEdit);
      tr.appendChild(tdDelete);
      table.appendChild(tr);
    });
  }

function openEditModal(categoryId) {
  var modal = document.getElementById('editModal');
  var editForm = document.getElementById('editForm');

  editForm.id.value = categoryId;

  modal.style.display = "block";
}

function closeEditModal() {
  var modal = document.getElementById('editModal');
  modal.style.display = "none";
}

function createCategory(form) {
  var request = new XMLHttpRequest();
  request.open('POST', 'http://loja.buiar.com/?key=2xhj8d&c=categoria&t=inserir&nome=' + form.name.value);
  request.send();
}

function editCategory(form) {
  var request = new XMLHttpRequest();
  request.open('POST', `http://loja.buiar.com/?key=2xhj8d&c=categoria&t=alterar&id=${form.id.value}&nome=${form.name.value}`)
  request.send();
}

function removeCategory(id) {
  var request = new XMLHttpRequest();
  request.open('POST', 'http://loja.buiar.com/?key=2xhj8d&c=categoria&t=remover&id=' + id)
  request.send();
  window.location.reload();
}
