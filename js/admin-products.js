window.onload =
  async function listProductsAndCategories() {
    let response = await fetch('http://loja.buiar.com/?key=2xhj8d&f=json&c=produto&t=listar');
    let data = await response.json();

    const contentDiv = document.getElementById('products-list');

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

      // <p>Cod. ${product.codigo}</p>
      // <p>${brLocale.format(product.peso) + 'KG'}</p>

      // let tr = document.createElement("tr");
      // let tdId = document.createElement("td");
      // let tdCod = document.createElement("td");
      // let tdCategory = document.createElement("td");
      // let tdName = document.createElement("td");
      // let tdDesc = document.createElement("td");
      // let tdWeight = document.createElement("td");
      // let tdPrice = document.createElement("td");
      // let tdEdit = document.createElement("td");
      // let tdDelete = document.createElement("td");
      //
      // tdId.innerText = product.id;
      // tdCod.innerText = product.codigo;
      // tdCategory.innerText = product.categoria;
      // tdName.innerText = product.nome;
      // tdDesc.innerText = product.descricao;
      // tdWeight.innerText = brLocale.format(product.peso) + 'KG';
      // tdPrice.innerText = realBRLocale.format(product.preco);
      // tdEdit.innerHTML = `<button onclick="openModal(${product.id});">Editar</button>`;
      // tdDelete.innerHTML = `<button onclick="removeProduct(${product.id});">Deletar</button>`;
      //
      // tr.appendChild(tdId);
      // tr.appendChild(tdCod);
      // tr.appendChild(tdCategory);
      // tr.appendChild(tdName);
      // tr.appendChild(tdDesc);
      // tr.appendChild(tdWeight);
      // tr.appendChild(tdPrice);
      // tr.appendChild(tdEdit);
      // tr.appendChild(tdDelete);
      // table.appendChild(tr);
    });

    response = await fetch('http://loja.buiar.com/?key=2xhj8d&f=json&c=categoria&t=listar');
    data = await response.json();

    const categoriesSelect = document.getElementById('categories-list');

    data.dados.forEach((category) => {
      let opt = document.createElement("option");

      opt.value = category.id;
      opt.text = category.nome;

      categoriesSelect.appendChild(opt);
    });
  }

function openModal(productId) {
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
    form.weight.value = dataJson.dados[0].peso;
    form.price.value = dataJson.dados[0].preco;
  }

  var modal = document.getElementById('modal');

  modal.style.display = "block";
}

function closeModal() {
  var modal = document.getElementById('modal');
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
  var url = `http://loja.buiar.com/?key=2xhj8d&c=produto&t=inserir&nome=${form.name.value}&codigo=${form.cod.value}&categoria=${form.cat.value}&peso=${formattedWeight}&preco=${formattedPrice}&descricao=${form.desc.value}`;
  request.open('POST', url);
  request.send();
}

function editProduct(form) {
  var request = new XMLHttpRequest();
  let formattedWeight = form.weight.value.replace(',', '.');
  let formattedPrice = form.price.value.replace(',', '.');
  request.open('POST', `http://loja.buiar.com/?key=2xhj8d&c=produto&t=alterar&id=${form.id.value}&nome=${form.name.value}&codigo=${form.cod.value}&categoria=${form.cat.value}&peso=${formattedWeight}&preco=${formattedPrice}&descricao=${form.desc.value}`)
  request.send();
}

function removeProduct(id) {
  var request = new XMLHttpRequest();
  request.open('POST', 'http://loja.buiar.com/?key=2xhj8d&c=produto&t=remover&id=' + id)
  request.send();
  window.location.reload();
}
