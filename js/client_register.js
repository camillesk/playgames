function onLoad() {
  document
    .getElementById("zip-code")
    .addEventListener("input", onZipCodeChange);
}

/**
 *
 * @param {Event} ev
 */
function onZipCodeChange(ev) {
  const { target } = ev;
  const { value } = target;
  const zipErrorElement = document.getElementById("zip-code-error");
  setZipCodeResponse();
  zipErrorElement.setAttribute("shown", false);
  if (value.length < 8) return;
  const fetchURL = `https://viacep.com.br/ws/${value}/json`;
  fetch(fetchURL)
    .then((res) => res.json())
    .then((data) => {
      setZipCodeResponse(data);
    })
    .catch((...err) => {
      console.error(...err);
      zipErrorElement.setAttribute("shown", true);

      forEachOfClass("zip-code-dependent", (element) =>
        addClass(element, "hidden")
      );
    });
}

function setZipCodeResponse(
  { bairro, localidade, logradouro, uf, erro } = {
    erro: "true",
  }
) {
  //   console.log(...arguments);
  const zipCodeElement = document.getElementById("zip-code");

  if (erro) {
    document.getElementById("zip-code-error").setAttribute("shown", "true");
    bairro = "";
    localidade = "";
    logradouro = "";
    uf = "";

    forEachOfClass("zip-code-dependent", (element) =>
      addClass(element, "hidden")
    );
  } else {
    zipCodeElement.blur();
    forEachOfClass("zip-code-dependent", (element) =>
      removeClass(element, "hidden")
    );
  }
  document.getElementById("street").value = logradouro;
  document.getElementById("neighborhood").value = bairro;
  document.getElementById("city").value = localidade;
  document.getElementById("state").value = uf.toLowerCase();
}

const addClass = (element, className) =>
  !element.className.includes(className)
    ? (element.className += className)
    : void 0;
const removeClass = (element, className) =>
  (element.className = element.className.replace(
    new RegExp(className, "g"),
    ""
  ));

const forEachOfClass = (className, func) =>
  Array.from(document.getElementsByClassName(className)).forEach(func);
