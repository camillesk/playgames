window.onload =
  async function listCategories() {
    let response = await fetch('http://loja.buiar.com/?key=2xhj8d&f=json&c=categoria&t=listar');
    data = await response.json();

    const categoriesSelect = document.getElementById('categories-list');
    const categoriesFilterSelect = document.getElementById('categories-filter');

    data.dados.forEach((category) => {
      let opt = document.createElement("option");

      opt.value = category.id;
      opt.text = category.nome;

      categoriesSelect.appendChild(opt);
    });

    data.dados.forEach((category) => {
      let opt = document.createElement("option");

      opt.value = category.id;
      opt.text = category.nome;

      categoriesFilterSelect.appendChild(opt);
    });

    listProducts();
  }

async function listProducts(categoryId) {
  const contentDiv = document.getElementById('products-list');

  while (contentDiv.hasChildNodes()) {
    contentDiv.removeChild(contentDiv.firstChild);
  }

  let response = "";

  if (categoryId && categoryId.value != "") {
    response = await fetch(`http://loja.buiar.com/?key=2xhj8d&f=json&c=produto&t=listar&categoria=${categoryId.value}`);
  } else {
    response = await fetch(`http://loja.buiar.com/?key=2xhj8d&f=json&c=produto&t=listar`);
  }

  let data = await response.json();

  let realBRLocale = Intl.NumberFormat('pt-BR', {
    style: "currency",
    currency: "BRL",
  });

  let brLocale = Intl.NumberFormat('pt-BR');

  data.dados.forEach((product) => {
    let div = document.createElement("div");

    div.innerHTML =
      `<img src="../images/delete.png" class="product-delete" style="float:right;" onclick="removeProduct(${product.id})">
      <img src="../images/edit.png" class="product-edit" style="float:right;" onclick="openModal(${product.id})">
      <h1 style="margin-top: 30px;">${product.nome}</h1>
      <img src="${product.imagem}" class="product-img">
      <p class="product-desc">${product.descricao}</p>
      <p class="product-price"><b>${realBRLocale.format(product.preco)}</b></p>`

    div.className = "product-card";

    contentDiv.appendChild(div);
  });
}

function openModal(productId) {
  let brLocale = Intl.NumberFormat('pt-BR');
  var request = new XMLHttpRequest();

  request.open('GET', `http://loja.buiar.com/?key=2xhj8d&c=produto&f=json&t=listar&id=${productId}`);
  request.setRequestHeader('Access-Control-Allow-Origin', '*');
  request.send();
  request.onload = function() {
    var form = document.getElementById('form');

    data = request.response;
    dataJson = JSON.parse(data);

    form.id.value = dataJson.dados[0].id;
    form.cod.value = dataJson.dados[0].codigo;
    form.cat.value = dataJson.dados[0].categoria;
    form.name.value = dataJson.dados[0].nome;
    form.desc.value = dataJson.dados[0].descricao;
    form.weight.value = brLocale.format(dataJson.dados[0].peso);
    form.price.value = brLocale.format(dataJson.dados[0].preco);
    form.image.value = dataJson.dados[0].imagem;
  }

  var modal = document.getElementById('modal');

  modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById('modal');
  var form = document.getElementById('form');

  form.id.value = '';
  form.cod.value = '';
  form.cat.value = '';
  form.name.value = '';
  form.desc.value = '';
  form.weight.value = '';
  form.price.value = '';
  form.image.value = '';

  modal.style.display = "none";
}

function saveProduct(form) {
  if (form.id.value) {
    editProduct(form);
  } else {
    createProduct(form);
  }
}

function createProduct(form) {
  var request = new XMLHttpRequest();
  let formattedWeight = form.weight.value.replace(',', '.');
  let formattedPrice = form.price.value.replace(',', '.');
  var url = `http://loja.buiar.com/?key=2xhj8d&c=produto&t=inserir&nome=${form.name.value}&codigo=${form.cod.value}&categoria=${form.cat.value}&peso=${formattedWeight}&preco=${formattedPrice}&descricao=${form.desc.value}&imagem=${form.image.value}`;
  request.open('POST', url);
  request.send();
}

function editProduct(form) {
  var request = new XMLHttpRequest();
  let formattedWeight = form.weight.value.replace(',', '.');
  let formattedPrice = form.price.value.replace(',', '.');
  request.open('POST', `http://loja.buiar.com/?key=2xhj8d&c=produto&t=alterar&id=${form.id.value}&nome=${form.name.value}&codigo=${form.cod.value}&categoria=${form.cat.value}&peso=${formattedWeight}&preco=${formattedPrice}&descricao=${form.desc.value}&imagem=${form.image.value}`)
  request.send();
}

function removeProduct(id) {
  var request = new XMLHttpRequest();
  request.open('POST', 'http://loja.buiar.com/?key=2xhj8d&c=produto&t=remover&id=' + id)
  request.send();
  window.location.reload();
}
