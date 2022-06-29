const forEachOfClass = (className, func) =>
  Array.from(document.getElementsByClassName(className)).forEach(func);
const addClass = (element, className) =>
  !element.className.includes(className)
    ? (element.className += ` ${className}`)
    : void 0;
const removeClass = (element, className) =>
  (element.className = element.className.replace(
    new RegExp(`\\s*${className}`, "g"),
    ""
  ));

const testEmpty = (element) =>
  element.value.length == 0
    ? removeClass(element, "not_empty")
    : addClass(element, "not_empty");

function onLoad() {
  const zipcode = document.getElementById("zip-code");
  zipcode.addEventListener("input", onZipCodeChange);
  if (zipcode.value) onZipCodeChange();

  document.getElementById("cpf").addEventListener("input", onCPFChange);
}

function onZipCodeChange() {
  const target = document.getElementById("zip-code");
  testEmpty(target);
  const { value } = target;
  handleZipCodeResponse();

  if (value.length < 8) return;
  fetch(`https://viacep.com.br/ws/${value}/json`)
    .then((res) => res.json())
    .then(handleZipCodeResponse)
    .catch((...err) => {
      console.error(...err);
      setCPFInvalido();
    });
}

function handleZipCodeResponse(
  { bairro, localidade, logradouro, uf, erro } = {
    erro: "true",
  }
) {
  //   console.log(...arguments);
  const zipCodeElement = document.getElementById("zip-code");

  if (erro) {
    bairro = "";
    localidade = "";
    logradouro = "";
    uf = "";
    setCPFInvalido();
  } else {
    zipCodeElement.blur();
    setCPFValido();
  }

  document.getElementById("street").value = logradouro;
  document.getElementById("neighborhood").value = bairro;
  document.getElementById("city").value = localidade;
  document.getElementById("state").value = uf.toLowerCase();
}

function setCPFInvalido() {
  document.getElementById("zip-code").setCustomValidity("CEP invalido");
  forEachOfClass("zip-code-dependent", (element) =>
    addClass(element, "hidden")
  );
}

function setCPFValido() {
  document.getElementById("zip-code").setCustomValidity("");
  forEachOfClass("zip-code-dependent", (element) =>
    removeClass(element, "hidden")
  );
}

/**
 * Testa se um CPF é valido e seta a validity do ev.target de acordo
 * @param {Event} ev
 */
function onCPFChange(ev) {
  const { target } = ev;
  testEmpty(target);
  if (testaCPF(target.value)) target.setCustomValidity("");
  else target.setCustomValidity("CPF invalido");
}

/**
 * Verifica um CPF
 * @param {string} cpf O CPF a ser testado
 * @returns {boolean} true se o cpf for valido e false se não for
 */
function testaCPF(cpf) {
  if (cpf.length < 11) return false;
  return testDigito(cpf, 9) && testDigito(cpf, 10);
}

/**
 * Verifica um digito do CPF
 * @param {string} cpf O CPF a ser testado
 * @param {number} pos A posição do digito verificador
 * @returns {boolean} true se o digito for valido e false se não for
 */
function testDigito(cpf, pos) {
  if (cpf < pos) return false;
  let soma = 0;
  for (let i = 0; i < pos; i++) {
    let char = cpf[i];
    let num = parseInt(char);
    if (isNaN(num)) return false;
    soma += num * (pos + 1 - i);
  }
  if ((soma * 10) % 11 != cpf[pos]) return false;
  return true;
}