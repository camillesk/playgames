(function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();

window.onload = async function() {
  const response = await fetch('http://loja.buiar.com/?key=2xhj8d&f=json&c=categoria&t=listar');
  const data = await response.json();

  data.dados.forEach((category) => {
    let opt = document.createElement("option");

    opt.value = category.id;
    opt.text = category.nome;

    document.getElementById('category-selection').appendChild(opt);
  });
}

async function listProducts(form) {
  const response = await fetch(`http://loja.buiar.com/?key=2xhj8d&f=json&c=produto&t=listar&categoria=${form.value}`);
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

  data.dados.forEach((product) => {
    let div = document.createElement("div");
    div.setAttribute('class', 'product-item');
    div.setAttribute('id', product.id);
    div.setAttribute('title', 'Para adicionar o produto ao carrinho, arraste ou dê um duplo clique');
    div.setAttribute('draggable', 'true');
    div.setAttribute('ondragstart', 'dragstart_handler(event)');
    div.setAttribute('ondblclick', 'checkCartQtd(this.id)');
    productsList.appendChild(div);

    let divImg = document.createElement("div");
    divImg.setAttribute('class', "img-div");
    div.appendChild(divImg);
    let img = document.createElement("img");
    img.setAttribute('src', product.imagem);
    img.setAttribute('alt', product.nome);
    img.setAttribute('class', "myImg");
    img.setAttribute('draggable', 'false');
    img.setAttribute('onclick', "openModal(this)");
    divImg.appendChild(img);

    let divInfo = document.createElement("div");
    divInfo.setAttribute("class", "info-div");
    div.appendChild(divInfo);
    let hNome = document.createElement("h3");
    hNome.innerText = product.nome;
    divInfo.appendChild(hNome);
    let pDesc = document.createElement("p");
    pDesc.innerText = product.descricao;
    divInfo.appendChild(pDesc);

    let divPreco = document.createElement("div");
    divPreco.setAttribute("class", "preco-div");
    div.appendChild(divPreco);
    let hPreco = document.createElement("h4");
    hPreco.innerText = `R$ ${product.preco}`;
    divPreco.appendChild(hPreco);

    let line = document.createElement("hr");
    productsList.appendChild(line);
  });
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
    let spanQtd = document.getElementById(`cart-product-id-${id}-qtd`);
    
    let qtd = Number(spanQtd.textContent);
    qtd++;

    spanQtd.innerText = '';
    spanQtd.innerText = qtd.toString();

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
    let spanQtd = document.createElement('span');
    spanQtd.setAttribute('id', `cart-product-id-${product.id}-qtd`);
    spanQtd.setAttribute('class', 'cart-product-qtd');
    spanQtd.innerText = '1';
    divInfo.appendChild(spanQtd);
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
      let qtd = Number(spanQtd.textContent);

      if(qtd === 1) {
        cartBody.removeChild(div);
        cartBody.removeChild(line);
        div.remove();
        line.remove();
        divImg.remove();
        img.remove();
        divInfo.remove();
        hNome.remove();
        pPreco.remove();
        spanQtd.remove();
        x.remove();
      } else if(qtd > 1) {
        qtd--;
        spanQtd.innerText = '';
        spanQtd.innerText = qtd.toString();
      }

      let preco = Number(product.preco)
      let total = Number(document.getElementById('cart-total').textContent);
      total = total - preco;
      document.getElementById('cart-total').innerText = '';
      document.getElementById('cart-total').innerText = total.toString();
    }
    productDelete.innerText = 'x';
    divProductDelete.appendChild(productDelete);
  });
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
        let qtd = Number(document.getElementById(`cart-product-id-${itemId}-qtd`).textContent);

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

      let qtd = Number(document.getElementById(`cart-product-id-${itemId}-qtd`).textContent);

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