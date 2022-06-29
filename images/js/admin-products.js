window.onload =
  async function listProductsAndCategories() {
    let response = await fetch('http://loja.buiar.com/?key=2xhj8d&f=json&c=produto&t=listar');
    let data = await response.json();

    const table = document.getElementById('products-list');

    let realBRLocale = Intl.NumberFormat('pt-BR', {
      style: "currency",
      currency: "BRL",
    });

    let brLocale = Intl.NumberFormat('pt-BR');

    data.dados.forEach((product) => {
      let tr = document.createElement("tr");
      let tdId = document.createElement("td");
      let tdCod = document.createElement("td");
      let tdCategory = document.createElement("td");
      let tdName = document.createElement("td");
      let tdDesc = document.createElement("td");
      let tdWeight = document.createElement("td");
      let tdPrice = document.createElement("td");
      let tdEdit = document.createElement("td");
      let tdDelete = document.createElement("td");

      tdId.innerText = product.id;
      tdCod.innerText = product.codigo;
      tdCategory.innerText = product.categoria;
      tdName.innerText = product.nome;
      tdDesc.innerText = product.descricao;
      tdWeight.innerText = brLocale.format(product.peso) + 'KG';
      tdPrice.innerText = realBRLocale.format(product.preco);
      tdEdit.innerHTML = `<button onclick="openEditModal(${product.id});">Editar</button>`;
      tdDelete.innerHTML = `<button onclick="removeProduct(${product.id});">Deletar</button>`;

      tr.appendChild(tdId);
      tr.appendChild(tdCod);
      tr.appendChild(tdCategory);
      tr.appendChild(tdName);
      tr.appendChild(tdDesc);
      tr.appendChild(tdWeight);
      tr.appendChild(tdPrice);
      tr.appendChild(tdEdit);
      tr.appendChild(tdDelete);
      table.appendChild(tr);
    });

    response = await fetch('http://loja.buiar.com/?key=2xhj8d&f=json&c=categoria&t=listar');
    data = await response.json();

    const selectCreate = document.getElementById('categories-create');
    const selectEdit = document.getElementById('categories-edit');

    data.dados.forEach((category) => {
      let opt = document.createElement("option");

      opt.value = category.id;
      opt.text = category.nome;

      selectCreate.appendChild(opt);
    });

    data.dados.forEach((category) => {
      let opt = document.createElement("option");

      opt.value = category.id;
      opt.text = category.nome;

      selectEdit.appendChild(opt);
    });
  }

function openEditModal(productId) {
  var request = new XMLHttpRequest();
  request.open('GET', `http://loja.buiar.com/?key=2xhj8d&f=json&t=listar&id=${productId}`);
  request.setRequestHeader('Access-Control-Allow-Origin', '*');
  request.send();
  request.onload = function() {
    var editForm = document.getElementById('editForm');

    data = request.response;

    editForm.id.value = data.dados[0].id;
    editForm.cod.value = data.dados[0].codigo;
    editForm.cat.value = data.dados[0].categoria;
    editForm.name.value = data.dados[0].nome;
    editForm.desc.value = data.dados[0].descricao;
    editForm.weight.value = data.dados[0].peso;
    editForm.price.value = data.dados[0].preco;
  }

  var modal = document.getElementById('editModal');

  modal.style.display = "block";
}

function closeEditModal() {
  var modal = document.getElementById('editModal');
  modal.style.display = "none";
}

function createProduct(form) {
  var request = new XMLHttpRequest();
  let formattedWeight = form.weight.value.replace(',', '.');
  let formattedPrice = form.price.value.replace(',', '.');
  let encodedImageUrl = encodeURIComponent(form.url.value);
  let encodedDesc = encodeURIComponent(form.desc.value);
  var url = `http://loja.buiar.com/?key=2xhj8d&c=produto&t=inserir&nome=${form.name.value}&codigo=${form.cod.value}&categoria=${form.cat.value}&peso=${formattedWeight}&preco=${formattedPrice}&descricao=${encodedDesc}&imagem=${encodedImageUrl}`;
  request.open('POST', url);
  request.responseType = 'text';
  request.send();
}

function editProduct(form) {
  var request = new XMLHttpRequest();
  let encodedImageUrl = encodeURIComponent(form.url.value);
  let encodedDesc = encodeURIComponent(form.desc.value);
  request.open('POST', `http://loja.buiar.com/?key=2xhj8d&c=produto&t=alterar&id=${form.id.value}&nome=${form.name.value}&codigo=${form.cod.value}&categoria=${form.cat.value}&peso=${form.weight.value}&preco=${form.price.value}&descricao=${encodedDesc}&imagem=${encodedImageUrl}`);
  request.send();
}

function removeProduct(id) {
  var request = new XMLHttpRequest();
  request.open('POST', 'http://loja.buiar.com/?key=2xhj8d&c=produto&t=remover&id=' + id)
  request.send();
  window.location.reload();
}
