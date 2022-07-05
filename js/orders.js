function toBrRealNumber(string) {
  let pontoRecorte = string.lastIndexOf(",");
  string = string.substring(0, pontoRecorte);
  string = string.replace(/[^\d]+/g,'');
  return Number(string);
}

function toBrRealString(number) {
  let string = Number.parseFloat(number).toFixed(2).toLocaleString();
  string = string.replace(/.([^.]*)$/, ',$1');

  if(number >= 1000) {
    let milhar = string.substring(0, 1);
    let resto = string.substring(1, string.length);
    string = milhar + '.' + resto;
  }

  return string;
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

window.onload = function() {
	document.getElementById('input-id-order').addEventListener("keypress", function(event) {
		if(event.key === "Enter") {
			event.preventDefault();
			document.getElementById('confirm-id-order').click();
			document.getElementById('input-id-order').blur();
		}
	});
}

async function idOrderConfirmed() {
	document.body.style.cursor = 'wait';
	let id = document.getElementById('input-id-order').value;
	const response = await fetch(`http://loja.buiar.com/?key=2xhj8d&f=json&c=pedido&t=listar&id=${id}`);
	const data = await response.json();

	const clientInfo = document.getElementById('client-info');

	if(data.dados.length != 0) {
		data.dados.forEach((order) => {
			if(order.id != undefined && order.id != null && order.id == id) {
				let complemento = '';
				if(order.complemento != ''){complemento = `, ${order.complemento}`}

				let cep = order.cep;
				let cepComeco = cep.substring(0, 5);
				let cepFinal = cep.substring(5, 8);
				cep = cepComeco + '-' + cepFinal;

				let cpf = order.cpf;
				let trio1 = cpf.substring(0, 3);
				let trio2 = cpf.substring(3, 6);
				let trio3 = cpf.substring(6, 9);
				let dupla = cpf.substring(9, 11);
				cpf = trio1 + '.' + trio2 + '.' + trio3 + '-' + dupla;


				document.getElementById('order-id-update').innerText = '';
				document.getElementById('order-client-name-update').innerText = '';
				document.getElementById('order-client-cpf-update').innerText = '';
				document.getElementById('order-client-address-update').innerText = '';

				document.getElementById('order-id-update').innerText = order.id;
				document.getElementById('order-client-name-update').innerText = order.nome.toUpperCase();
				document.getElementById('order-client-cpf-update').innerText = cpf;
				document.getElementById('order-client-address-update').innerText = order.rua.toUpperCase() + ', ' + order.numero + complemento.toUpperCase() + ' - ' + order.bairro.toUpperCase() + ', ' + order.cidade.toUpperCase() + ' - ' + order.uf.toUpperCase() + ', ' + cep;

				document.getElementById('payment-slip-btn').href = `http://loja.buiar.com/?key=2xhj8d&c=boleto&t=listar&id=${order.id}`;

				clientInfo.style.display = 'grid';
			}
		});
	} else {
		document.body.style.cursor = 'auto';
		clientInfo.style.display = 'none';
	}

	listOrderProducts();
}

async function listOrderProducts() {
	let id = document.getElementById('input-id-order').value;
	const response = await fetch(`http://loja.buiar.com/?key=2xhj8d&f=json&c=item&t=listar&pedido=${id}`);
	const data = await response.json();

	const orderProductsList = document.getElementById('order-products-list');
	orderProductsList.innerText = "";

  debugger

	if (data.dados.length === 0) {
		orderProductsList.innerText = `Nenhum produto encontrado no pedido ${id}`;
		document.body.style.cursor = 'auto';
		document.getElementById('client-info').style.display = 'none';
	} else {
		data.dados.forEach((product) => {
			if (product.produto != undefined && product.produto != null) {
				let url_ = `http://loja.buiar.com/?key=2xhj8d&f=json&c=produto&t=listar&id=${product.produto}`;
				var request = new XMLHttpRequest();
			    request.open('GET', url_);
			    request.setRequestHeader('Access-Control-Allow-Origin', '*');
			    request.send();

			    request.onreadystatechange = function() {
			      if (this.readyState === 4) {
			        if (this.status == 200 && this.status < 300) {
			          var response = JSON.parse(this.responseText);
			          var produto = response.dados[0];

			          let string = parseInt(product.qtd).toString();
  					  string = string.replace(/[^\d]+/g,'');

			          var div = document.createElement("div");
					  div.setAttribute('class', 'product-item');
					  div.setAttribute('id', `order-product-${produto.id}`);
					  div.setAttribute('draggable', 'false');

					  div.innerHTML =
					  `<h1 style="margin-top: 30px;">${produto.nome.toString().toUpperCase()}</h1>
					  <img src="${produto.imagem}" class="product-img myImg" alt="${produto.nome.toString().toUpperCase()}" draggable="false" onclick="openModal(this)">
					  <p class="product-desc">${produto.descricao}</p>
					  <p class="product-price"><b>R$ ${toBrRealString(produto.preco)}</b></p>
					  <p class="order-product-qtd">Quantidade: ${string}</p>
					  <img src="../images/zoom-in.png" class="zoom-in" draggable="false" title="Clique para mais detalhes sobre o produto" onclick="openProduct(${product.produto})" onmouseover="this.src = '../images/zoom-in2.png'" onmouseout="this.src = '../images/zoom-in.png'" onmousedown="this.src = '../images/zoom-in.png'" onmouseup="this.src = '../images/zoom-in2.png'">`;

					  div.className = "product-card";

					  orderProductsList.appendChild(div);
			        }
			      }
			    }
			}
	  	});
	  	document.body.style.cursor = 'auto';
	}
}

/**/

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
