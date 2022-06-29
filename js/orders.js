/**
 * @readonly
 * @enum {number}
 */
const MODES = {
  ORDERS: 0,
  PRODUCTS: 1,
};

var items = {};
var products = {};

function onLoad() {
  let orders_url = "http://loja.buiar.com/?key=2xhj8d&c=pedido&t=listar&f=json";
  let items_url = "http://loja.buiar.com/?key=2xhj8d&c=item&t=listar&f=json";

  fetch(orders_url)
    .then((res) => res.json())
    .then(handleGetOrders);

  fetch(items_url)
    .then((res) => res.json())
    .then(({ dados }) => {
      dados.forEach((d) => {
        if (!(d.pedido in items)) items[d.pedido] = [];
        items[d.pedido].push(d);
        document.dispatchEvent(
          new CustomEvent("item-loaded", { detail: d.pedido })
        );
      });
    });
}

function createElement(type, className = "", text) {
  if (!type) throw "No type defined for order child";
  let el = document.createElement(type);
  if (className) el.className = className;
  if (text) el.innerHTML = text;
  return el;
}

/**
 * @typedef Order
 * @prop {string} bairro
 * @prop {string} cep
 * @prop {string} cidade
 * @prop {string} complemento
 * @prop {string} cpf
 * @prop {string} id
 * @prop {string} nome
 * @prop {string} numero
 * @prop {string} rua
 * @prop {string} time
 * @prop {string} uf
 */
/**
 * @typedef Product
 * @prop {string} categoria
 * @prop {string} codigo
 * @prop {string} descricao
 * @prop {string} id
 * @prop {string} imagem
 * @prop {string} nome
 * @prop {string} peso
 * @prop {string} preco
 */

/** @param {{dados: {[n: number]: Order}, descricao: string, erro: number, mensagem: string, status: string}} param0 */
function handleGetOrders({ dados, erro, descricao, messagem, status }) {
  if (erro) return;
  dados = Object.values(dados);
  const ordersElement = document.getElementById("orders-body");
  for (const order of dados) {
    ordersElement.appendChild(getOrderElement(order));
  }
}

/** @param {Order} order */
function getOrderElement(order, button = true) {
  const res = document.createElement("tr");
  res.className = "order-container";

  const addChild = (type, className, text) => {
    let el = createElement(type, className, text);
    res.appendChild(el);
    return el;
  };

  addChild("th", "order-field order-id", order.id);
  addChild("td", "order-field order-name", order.nome);
  addChild("td", "order-field order-cpf", order.cpf);
  addChild("td", "order-field order-zipcode", order.cep);
  addChild("td", "order-field order-state", order.uf);
  addChild("td", "order-field order-city", order.cidade);
  addChild("td", "order-field order-neighborhood", order.bairro);
  addChild("td", "order-field order-street", order.rua);
  addChild("td", "order-field order-complemento", order.complemento);
  addChild("td", "order-field order-number", order.numero);
  addChild("td", "order-field order-time", order.time);

  if (button) {
    let productsContainer = addChild("td", "order-field order-products");

    let productsButton = document.createElement("a");
    productsButton.innerText =
      (items[order.id]?.reduce((pv, cv) => pv + parseFloat(cv.qtd), 0) ??
        "Ver") + " items";
    document.addEventListener(`item-loaded`, (ev) => {
      if (ev.detail != order.id) return;
      productsButton.innerText =
        (items[order.id]?.reduce((pv, cv) => pv + parseFloat(cv.qtd), 0) ??
          "Ver") + " items";
    });

    productsButton.href = "#";
    productsContainer.appendChild(productsButton);

    productsButton.onclick = (ev) => {
      setMode(MODES.PRODUCTS);
      setOrder(order);

      let content = document.getElementById("products-content");

      for (const item of items[order.id]) {
        if (!(item.produto in products))
          fetch(
            `http://loja.buiar.com/?key=2xhj8d&c=produto&t=listar&id=${item.produto}&f=json`
          )
            .then((res) => res.json())
            .then(({ dados }) => {
              products[item.produto] = dados[0];
              content.appendChild(addProduct(dados[0], item.qtd));
            });
        else content.appendChild(addProduct(products[item.produto], item.qtd));
      }
    };
  }
  return res;
}

/** @param {MODES} mode */
function setMode(mode) {
  switch (mode) {
    case MODES.ORDERS:
      document.getElementById("orders-outer").removeAttribute("hidden");
      document.getElementById("products").setAttribute("hidden", "true");
      break;
    case MODES.PRODUCTS:
      document.getElementById("orders-outer").setAttribute("hidden", "true");
      document.getElementById("products").removeAttribute("hidden");
      break;
  }
}

/**
 *
 * @param {Order} order
 */
function setOrder(order) {
  let prod = document.getElementById("products");
  let template = document.getElementById("products-template");

  prod.innerHTML = "";
  prod.appendChild(template.content.cloneNode(true));

  let pbody = document.getElementById("products-body");
  pbody.appendChild(getOrderElement(order, false));

  document.getElementById("order-number").innerText = order.id;
}

/**
 *  @param {Product} product
 *  @param {string} quantity
 */
function addProduct(product, quantity) {
  let res = createElement("div", "flex-0 order-item");

  const addChild = (type, className = "", text) => {
    let el = createElement(type, className, text);
    res.appendChild(el);
    return el;
  };

  addChild("a", "", `${parseFloat(quantity)} x ${product.nome}`);
  let imageContainer = addChild("div", "product-image-container flex-0");
  let image = createElement("img", "product-image");
  image.src = product.imagem;
  imageContainer.appendChild(image);

  return res;
}
