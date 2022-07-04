window.onload = async function() {
  const response = await fetch('http://loja.buiar.com/?key=2xhj8d&f=json&c=categoria&t=listar');
  const data = await response.json();

  data.dados.forEach((category) => {
    let opt = document.createElement("option");

    opt.value = category.id;
    opt.text = category.nome;

    document.getElementById('category-selection').appendChild(opt);
  });

  listProducts(null);
}

async function listProducts(form) {
  let response = "";

  if (form && form.value != "") {
    response = await fetch(`http://loja.buiar.com/?key=2xhj8d&f=json&c=produto&t=listar&categoria=${form.value}`);
  } else {
    response = await fetch(`http://loja.buiar.com/?key=2xhj8d&f=json&c=produto&t=listar`);
  }

  const data = await response.json();

  let realBRLocale = Intl.NumberFormat('pt-BR', {
    style: "currency",
    currency: "BRL",
  });

  let brLocale = Intl.NumberFormat('pt-BR');

  const productsList = document.getElementById('products-list');
  productsList.innerText = "";

  if (data.dados.length === 0) {
    productsList.innerText = `Nenhum produto encontrado na categoria ${form.value}`;
  }

  // data.dados.forEach((product) => {
  //   let div = document.createElement("div");
  //   div.setAttribute('class', 'product-item');
  //   div.setAttribute('id', product.id);
  //   div.setAttribute('title', 'Para adicionar o produto ao carrinho, arraste ou dê um duplo clique');
  //   div.setAttribute('draggable', 'true');
  //   div.setAttribute('ondragstart', 'dragstart_handler(event)');
  //   div.setAttribute('ondblclick', 'checkCartQtd(this.id)');
  //   productsList.appendChild(div);
  //
  //   let divImg = document.createElement("div");
  //   divImg.setAttribute('class', "img-div");
  //   div.appendChild(divImg);
  //   let img = document.createElement("img");
  //   img.setAttribute('src', product.imagem);
  //   img.setAttribute('alt', product.nome);
  //   img.setAttribute('class', "myImg");
  //   img.setAttribute('draggable', 'false');
  //   img.setAttribute('onclick', "openModal(this)");
  //   divImg.appendChild(img);
  //
  //   let divInfo = document.createElement("div");
  //   divInfo.setAttribute("class", "info-div");
  //   div.appendChild(divInfo);
  //   let hNome = document.createElement("h3");
  //   hNome.innerText = product.nome;
  //   divInfo.appendChild(hNome);
  //   let pDesc = document.createElement("p");
  //   pDesc.innerText = product.descricao;
  //   divInfo.appendChild(pDesc);
  //
  //   let divPreco = document.createElement("div");
  //   divPreco.setAttribute("class", "preco-div");
  //   div.appendChild(divPreco);
  //   let hPreco = document.createElement("h4");
  //   hPreco.innerText = `R$ ${product.preco}`;
  //   divPreco.appendChild(hPreco);
  //
  //   let line = document.createElement("hr");
  //   productsList.appendChild(line);
  // });

  data.dados.forEach((product) => {
    let div = document.createElement("div");
    div.setAttribute('class', 'product-item');
    div.setAttribute('id', product.id);
    div.setAttribute('title', 'Para adicionar o produto ao carrinho, arraste ou dê um duplo clique');
    div.setAttribute('draggable', 'true');
    div.setAttribute('ondragstart', 'dragstart_handler(event)');
    div.setAttribute('ondblclick', 'checkCartQtd(this.id)');

    div.innerHTML =
      `<img src="../images/view.png" class="product-view" style="float:right;" onclick="openProduct(${product.id})">
      <h1 style="margin-top: 30px;">${product.nome}</h1>
      <img src="${product.imagem}" class="product-img" draggable="false">
      <p class="product-desc">${product.descricao}</p>
      <p class="product-price"><b>${realBRLocale.format(product.preco)}</b></p>`

    div.className = "product-card";

    productsList.appendChild(div);
  });
}

function openProduct(productId) {
  var request = new XMLHttpRequest();
  request.open('GET', `http://loja.buiar.com/?key=2xhj8d&c=produto&f=json&t=listar&id=${productId}`);
  request.setRequestHeader('Access-Control-Allow-Origin', '*');
  request.send();
  request.onload = function() {
    var productModalContent = document.getElementById('product-modal-content');
    let div = document.createElement("div");
    let realBRLocale = Intl.NumberFormat('pt-BR', {
      style: "currency",
      currency: "BRL",
    });
    let brLocale = Intl.NumberFormat('pt-BR');

    data = request.response;
    dataJson = JSON.parse(data);

    div.innerHTML =
      `<span onclick="closeProduct();" style="float:right;margin-left: 15px;">&times;</span>
      <p>Código: ${dataJson.dados[0].codigo}</p>
      <h1 style="margin-top: 30px;">${dataJson.dados[0].nome}</h1>
      <img src="${dataJson.dados[0].imagem}" class="product-img" draggable="false">
      <p>${brLocale.format(dataJson.dados[0].peso) + 'KG'}</p>
      <p class="">${dataJson.dados[0].descricao}</p>
      <p class="product-price"><b>${realBRLocale.format(dataJson.dados[0].preco)}</b></p>`

    div.className = "detailed-product-card";

    productModalContent.appendChild(div);
  }

  var productModal = document.getElementById('product-modal');
  productModal.style.display = "block";
}

function closeProduct() {
  var productModal = document.getElementById('product-modal');
  var productCard = document.getElementsByClassName('detailed-product-card')[0];

  productCard.remove();
  productModal.style.display = "none";
}

function openModal(img) {
  var modal = document.getElementById('myModal');
  var modalImg = document.getElementById("img01");
  var captionText = document.getElementById("caption");

  modal.style.display = "block";
  modalImg.src = img.src;
  modalImg.alt = img.alt;
  captionText.innerHTML = img.alt;

  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.style.display = "none";
  }
}

function openCart() {
  let cart = document.getElementById('floatingcart');

  if(window.getComputedStyle(cart).display === 'none') {
    cart.style.display = 'block';
  } else if(window.getComputedStyle(cart).display === 'block') {
    cart.style.display = 'none';
  }

  let cartClose = document.getElementById('cart-close');
  cartClose.onclick = function() {
    cart.style.display = 'none';
  }
}

function dragstart_handler(ev) {
  ev.dataTransfer.setData('text', ev.target.id);
  ev.dataTransfer.dropEffect = "copy";
}

function dragover_handler(ev) {
 ev.preventDefault();
 ev.dataTransfer.dropEffect = "copy";
}

function drop_handler(ev) {
  ev.preventDefault();

  let id = ev.dataTransfer.getData('text');

  checkCartQtd(id);
}

async function checkCartQtd(id) {
  if(document.getElementById(`cart-product-id-${id}`)) {
    let inputQtd = document.getElementById(`cart-product-id-${id}-qtd`);

    inputQtd.value = Number(inputQtd.value) + 1;
    // let qtd = Number(inputQtd.textContent);
    // qtd++;

    // inputQtd.innerText = '';
    // inputQtd.innerText = qtd.toString();

    const response = await fetch(`http://loja.buiar.com/?key=2xhj8d&f=json&c=produto&t=listar&id=${id}`);
    const data = await response.json();

    data.dados.forEach((product) => {
      let preco = Number(product.preco)
      let total = Number(document.getElementById('cart-total').textContent);
      total = total + preco;
      document.getElementById('cart-total').innerText = '';
      document.getElementById('cart-total').innerText = total.toString();
    });
  } else {
    addToCart(id);
  }
}

async function addToCart(id) {
  const response = await fetch(`http://loja.buiar.com/?key=2xhj8d&f=json&c=produto&t=listar&id=${id}`);
  const data = await response.json();

  let cartBody = document.getElementById('cart-body');

  data.dados.forEach((product) => {
    let div = document.createElement('div');
    div.setAttribute('class', 'cart-product-item');
    div.setAttribute('id', `cart-product-id-${product.id}`);
    div.setAttribute('data-product-id', product.id);
    cartBody.appendChild(div);

    let divImg = document.createElement('div');
    divImg.setAttribute('class', 'img-div');
    div.appendChild(divImg);
    let img = document.createElement('img');
    img.setAttribute('src', product.imagem);
    img.setAttribute('alt', product.nome);
    img.setAttribute('class', 'cart-product-image');
    img.setAttribute('onclick', 'openModal(this)');
    divImg.appendChild(img);

    let divInfo = document.createElement('div');
    divInfo.setAttribute('class', 'info-div');
    div.appendChild(divInfo);

    let hNome = document.createElement('h4');
    hNome.innerText = product.nome;
    divInfo.appendChild(hNome);

    let pPreco = document.createElement('p');
    pPreco.innerText = `R$ ${product.preco}`;
    divInfo.appendChild(pPreco);

    let inputQtd = document.createElement('input');
    inputQtd.setAttribute('type', 'number');
    inputQtd.setAttribute('onchange', `updateCartTotal()`);
    inputQtd.setAttribute('id', `cart-product-id-${product.id}-qtd`);
    inputQtd.setAttribute('class', 'cart-product-qtd');
    inputQtd.value = '1';
    divInfo.appendChild(inputQtd);

    let x = document.createElement('span');
    x.innerText = 'x';
    divInfo.appendChild(x);

    let line = document.createElement('hr');
    cartBody.appendChild(line);

    let preco = Number(product.preco)
    let total = Number(document.getElementById('cart-total').textContent);
    total = total + preco;
    document.getElementById('cart-total').innerText = '';
    document.getElementById('cart-total').innerText = total.toString();

    let divProductDelete = document.createElement('div');
    divProductDelete.setAttribute('class', 'div-product-delete');
    div.appendChild(divProductDelete);
    let productDelete = document.createElement('img');
    productDelete.setAttribute('src', '../images/delete.png');
    productDelete.setAttribute('alt', 'delete');
    productDelete.setAttribute('class', 'cart-product-delete');
    divProductDelete.onclick = function() {
      let qtd = Number(inputQtd.value);
      let preco = Number(product.preco * inputQtd.value)
      let total = Number(document.getElementById('cart-total').textContent);

      // if(qtd === 1) {
        cartBody.removeChild(div);
        cartBody.removeChild(line);
        div.remove();
        line.remove();
        divImg.remove();
        img.remove();
        divInfo.remove();
        hNome.remove();
        pPreco.remove();
        inputQtd.remove();
        x.remove();
      // } else if(qtd > 1) {
      //   qtd--;
      //   inputQtd.innerText = '';
      //   inputQtd.innerText = qtd.toString();
      // }

      total = total - preco;
      document.getElementById('cart-total').innerText = '';
      document.getElementById('cart-total').innerText = total.toString();
    }
    productDelete.innerText = 'x';
    divProductDelete.appendChild(productDelete);
  });
}

async function updateCartTotal() {
  const parent = document.getElementById('cart-body');
  const children = Array.from(parent.children);
  let total = 0;

  await Promise.all(children.map(async (child) => {
    if(child.tagName == 'DIV') {
      const productId = child.getAttribute("data-product-id");
      const qtd = document.getElementById(`cart-product-id-${productId}-qtd`).value;
      const response = await fetch(`http://loja.buiar.com/?key=2xhj8d&f=json&c=produto&t=listar&id=${productId}`);
      const data = await response.json();

      debugger
      let preco = Number(data.dados[0].preco)

      total = total + (preco * qtd);

      document.getElementById('cart-total').innerText = total.toString();
    }
  }));
}

function checkCartTotalItems() {
  let cart = document.getElementById('floatingcart');
  let cartItems = cart.getElementsByClassName('cart-product-item');
  let cartTotalItems = cartItems.length;

  if(cartTotalItems > 0) {
    for(let item in cartItems) {
      if(cartItems[item].id != undefined) {
        let pontoRecorte = cartItems[item].id.lastIndexOf("-");
        let itemId = Number(cartItems[item].id.substring(pontoRecorte+1));
        let qtd = Number(document.getElementById(`cart-product-id-${itemId}-qtd`).value);

        if(qtd > 1) {
          qtd--;
          cartTotalItems = cartTotalItems + qtd;
        }
      } else {
        console.log('Erro: cartItems[item].id está undefined');
        console.log(`cartItems[item]: ${cartItems[item]}`);
        console.log(`item: ${item}`);
        console.log(cartItems);
      }
    }
  }
  return cartTotalItems;
}

function openCartSubmitModal() {
  var modal = document.getElementById('cart-submit-modal');

  localStorage.setItem('form', 'not-submitted');

  window.addEventListener('storage', registerOrder);

  modal.style.display = 'block';

  var span = document.getElementsByClassName('close')[1];
  span.onclick = function() {
    modal.style.display = 'none';
  }
}

function cartSubmit() {
  if (checkCartTotalItems() > 0) {
    openCartSubmitModal();

  } else {
    alert('Seu carrinho está vazio.');
  }
}

/**/

function completeOrderRegistration(id) {
  let div = document.getElementById('text-modal-body');
  let divCabecalho = document.getElementById('text-modal-header');
  div.innerText = '';

  var span = document.getElementById("text-modal-close");
  span.onclick = function() {
    div.style.display = "none";
    window.location.reload();
  }

  let cabecalho = document.createElement('h3');
  cabecalho.innerText = 'SUCESSO';
  divCabecalho.appendChild(cabecalho);

  let info = document.createElement('p');
  info.innerText = `Seu pedido nº ${id} foi criado com sucesso. Acesse a página de pedidos para mais informações.`;
  div.appendChild(info);

  let linkBoleto = `http://loja.buiar.com/?key=2xhj8d&c=boleto&t=listar&id=${id}`;

  let boleto = document.createElement('p');
  boleto.innerText = 'Para acessar seu boleto de pagamento '
  let anchorBoleto = document.createElement('a');
  anchorBoleto.setAttribute('href', linkBoleto);
  anchorBoleto.setAttribute('target', '_blank');
  anchorBoleto.innerText = 'clique aqui.';
  boleto.appendChild(anchorBoleto);
  div.appendChild(boleto);

  document.getElementById('text-modal').style.display = 'block';
  document.getElementById('loading-modal').style.display = 'none';
}

async function addItemsToOrder(id) {
  let cart = document.getElementById('floatingcart');
  let cartItems = cart.getElementsByClassName('cart-product-item');
  let erros = 0;

  for(let item in cartItems) {
    if(cartItems[item].id != undefined) {
      let pontoRecorte = cartItems[item].id.lastIndexOf("-");
      let itemId = Number(cartItems[item].id.substring(pontoRecorte+1));

      let qtd = Number(document.getElementById(`cart-product-id-${itemId}-qtd`).value);

      let url_ = `http://loja.buiar.com/?key=2xhj8d&c=item&t=inserir&pedido=${id}&produto=${itemId}&qtd=${qtd}`;

      var request = new XMLHttpRequest();
      request.open('POST', url_);
      request.send();
    }
  }

  completeOrderRegistration(id);
}

function registerOrder() {
  if(localStorage.getItem('form') === 'submitted') {
    document.getElementById('cart-submit-modal').style.display = 'none';
    document.getElementById('loading-modal').style.display = 'block';
    let nome = localStorage.getItem('nome');
    let cpf = localStorage.getItem('cpf');
    let cep = localStorage.getItem('cep');
    let rua = localStorage.getItem('rua');
    let numero = localStorage.getItem('numero');
    let complemento = localStorage.getItem('complemento');
    let bairro = localStorage.getItem('bairro');
    let cidade = localStorage.getItem('cidade');
    let uf = localStorage.getItem('uf');

    if(complemento != ''){
      complemento = `&complemento=${complemento}`;
    }

    let url_ = `http://loja.buiar.com/?key=2xhj8d&c=pedido&f=json&t=inserir&nome=${nome}&cpf=${cpf}&cep=${cep}&rua=${rua}&numero=${numero}&bairro=${bairro}&cidade=${cidade}&uf=${uf}${complemento}`;

    var request = new XMLHttpRequest();
    request.open('POST', url_);
    request.send();

    request.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status == 200 && this.status < 300) {
          var response = JSON.parse(this.responseText);
          var orderId = response.dados.id;
          addItemsToOrder(orderId);
        }
      }
    }

    localStorage.setItem('form', 'not-submitted');
  }
}
