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
      tdActions.innerHTML = `<button onclick="openModal(${category.id});" class="edit-btn">Editar</button><button onclick="removeCategory(${category.id});">Deletar</button>`;
      tdActions.className = 'actions-td';

      tr.appendChild(tdId);
      tr.appendChild(tdName);
      tr.appendChild(tdActions);
      table.appendChild(tr);
    });
  }

function openModal(categoryId) {
 if (categoryId) {
   var request = new XMLHttpRequest();
   request.open('GET', `http://loja.buiar.com/?key=2xhj8d&c=categoria&f=json&t=listar&id=${categoryId}`);
   request.send();
   request.onload = function() {
     var form = document.getElementById('form');

     data = request.response;
     dataJson = JSON.parse(data);

     form.id.value = dataJson.dados[0].id;
     form.name.value = dataJson.dados[0].nome;
   }
 }
  var modal = document.getElementById('modal');

  modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById('modal');
  var form = document.getElementById('form');

  form.id.value = null;
  form.name.value = null;
  modal.style.display = "none";
}

function saveCategory(form) {
  if (form.id.value) {
    editCategory(form);
  } else {
    createCategory(form);
  }
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
    dataJson = JSON.parse(data);

    if (dataJson.dados.length > 0 ) {
      alert('Existem produtos cadastrados nessa categoria!');
      return
    } else {
      request.open('POST', 'http://loja.buiar.com/?key=2xhj8d&c=categoria&t=remover&id=' + id)
      request.send();
      window.location.reload();
    }
  }
}
