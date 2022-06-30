window.onload =
  async function listCategories() {
    const response = await fetch('http://loja.buiar.com/?key=2xhj8d&f=json&c=categoria&t=listar');
    const data = await response.json();

    const table = document.getElementById('categories-list');

    data.dados.forEach((category) => {
      let tr = document.createElement("tr");
      let tdId = document.createElement("td");
      let tdName = document.createElement("td");
      let tdActions = document.createElement("td");

      tdId.innerText = category.id;
      tdName.innerText = category.nome;
      tdActions.innerHTML = `<button onclick="openEditModal(${category.id});" class="edit-btn">Editar</button><button onclick="removeCategory(${category.id});">Deletar</button>`;
      tdActions.className = 'actions-td';

      tr.appendChild(tdId);
      tr.appendChild(tdName);
      tr.appendChild(tdActions);
      table.appendChild(tr);
    });
  }

function openEditModal(categoryId) {
 var request = new XMLHttpRequest();
  request.open('GET', `http://loja.buiar.com/?key=2xhj8d&c=categoria&f=json&t=listar&id=${categoryId}`);
  request.send();
  request.onload = function() {
    var editForm = document.getElementById('editForm');

    data = request.response;
    dataJson = JSON.parse(data);

    editForm.id.value = dataJson.dados[0].id;
    editForm.name.value = dataJson.dados[0].nome;
  }

  var modal = document.getElementById('editModal');

  modal.style.display = "block";
}

function closeEditModal() {
  var modal = document.getElementById('editModal');
  var editForm = document.getElementById('editForm');

  editForm.id.value = null;
  editForm.name.value = null;
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
  request.open('POST', `http://loja.buiar.com/?key=2xhj8d&f=json&c=produto&t=listar&categoria=${id}`)
  request.send();
  request.onload = function() {
    data = request.response;
    if (data.length > 0 ) {
      alert('Existem produtos cadastrados nessa categoria!');
      return
    } else {
      request.open('POST', 'http://loja.buiar.com/?key=2xhj8d&c=categoria&t=remover&id=' + id)
      request.send();
      window.location.reload();
    }
  }
}
