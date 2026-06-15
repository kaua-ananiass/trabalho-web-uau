// Seleciona todos os botoes de compra da pagina.
const botoesComprar = document.querySelectorAll(".botao-comprar");

// Seleciona a area onde o resultado da compra sera mostrado.
const resultadoCompra = document.getElementById("resultadoCompra");

// Seleciona o corpo da tabela que vai receber as compras.
const tabelaCompras = document.getElementById("tabelaCompras");

// Seleciona os campos do formulario para pegar os dados digitados.
const formCompra = document.getElementById("formCompra");
const nomeCliente = document.getElementById("nomeCliente");
const cidadeCliente = document.getElementById("cidadeCliente");
const cepCliente = document.getElementById("cepCliente");
const pagamentoCliente = document.getElementById("pagamentoCliente");
const secaoFormularioCompra = document.getElementById("secaoFormularioCompra");
const produtoSelecionado = document.getElementById("produtoSelecionado");
const finalizarCompraBtn = document.getElementById("finalizarCompraBtn");

// Seleciona os elementos usados para trocar a moeda e mostrar a cotacao.
const moedaSelect = document.getElementById("moedaSelect");
const statusMoeda = document.getElementById("statusMoeda");
const precosProdutos = document.querySelectorAll(".preco-produto");
const enderecoCompra = document.getElementById("enderecoCompra");

// Define os enderecos das APIs usadas na pagina.
const apiCotacao =
  "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL";

// Guarda todas as compras feitas durante o uso da pagina.
let listaCompras = [];

// Guarda a moeda atual escolhida pelo usuario.
let moedaAtual = "BRL";

// Guarda a ultima compra mostrada na tela.
let ultimaCompraFeita = null;

// Guarda o produto escolhido antes da finalizacao da compra.
let produtoEscolhido = null;

// Guarda as cotacoes vindas da API. O real comeca valendo 1 porque e a moeda base.
let cotacoes = {
  BRL: 1
};

// Formata o valor dependendo da moeda que foi escolhida.
function formatarMoeda(valor, moeda) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: moeda
  });
}

// Converte um preco em real para a moeda escolhida.
function converterPreco(valorEmReal, moeda) {
  if (moeda === "BRL") {
    return valorEmReal;
  }

  const cotacao = cotacoes[moeda];

  if (!cotacao) {
    return valorEmReal;
  }

  const valorConvertido = valorEmReal / cotacao;
  return valorConvertido;
}

// Converte e formata o valor para aparecer pronto na pagina.
function pegarPrecoFormatado(valorEmReal) {
  const valorConvertido = converterPreco(valorEmReal, moedaAtual);
  return formatarMoeda(valorConvertido, moedaAtual);
}

// Atualiza o texto que aparece abaixo do seletor da moeda.
function atualizarStatusMoeda(texto) {
  statusMoeda.textContent = texto;
}

// Busca as cotacoes da AwesomeAPI para usar na loja.
async function carregarCotacoes() {
  atualizarStatusMoeda("Carregando cotacoes da AwesomeAPI...");
  console.log("Buscando cotacoes na AwesomeAPI.");

  try {
    const resposta = await fetch(apiCotacao);
    const dados = await resposta.json();

    cotacoes.USD = Number(dados.USDBRL.bid);
    cotacoes.EUR = Number(dados.EURBRL.bid);
    cotacoes.GBP = Number(dados.GBPBRL.bid);

    console.log("Cotacoes carregadas com sucesso.");
    console.log(dados);

    atualizarStatusMoeda("Cotacoes carregadas. Agora voce pode trocar a moeda.");
    atualizarPrecosDaTela();
  } catch (erro) {
    console.log("Erro ao carregar cotacoes.");
    console.log(erro);
    atualizarStatusMoeda("Nao foi possivel carregar as cotacoes agora.");
  }
}

// Atualiza os precos dos cards dos produtos.
function atualizarPrecosProdutos() {
  for (let i = 0; i < precosProdutos.length; i += 1) {
    const precoBase = Number(precosProdutos[i].dataset.precoBase);
    const precoFormatado = pegarPrecoFormatado(precoBase);
    precosProdutos[i].textContent = "Preco: " + precoFormatado;
  }
}

// Mostra o produto escolhido acima do formulario.
function mostrarProdutoSelecionado() {
  if (!produtoEscolhido) {
    produtoSelecionado.textContent = "Nenhum produto foi selecionado ainda.";
    return;
  }

  produtoSelecionado.innerHTML =
    "<strong>Produto escolhido:</strong> " + produtoEscolhido.nome + "<br>" +
    "Preco atual: " + pegarPrecoFormatado(produtoEscolhido.precoBase);
}

// Verifica se todos os campos do formulario foram preenchidos.
function validarCamposPreenchidos() {
  if (nomeCliente.value.trim() === "") {
    resultadoCompra.textContent = "Preencha o nome do cliente para continuar.";
    nomeCliente.focus();
    return false;
  }

  if (cidadeCliente.value.trim() === "") {
    resultadoCompra.textContent = "Preencha a cidade para continuar.";
    cidadeCliente.focus();
    return false;
  }

  if (cepCliente.value.trim() === "") {
    resultadoCompra.textContent = "Preencha o CEP para continuar.";
    cepCliente.focus();
    return false;
  }

  if (pagamentoCliente.value.trim() === "") {
    resultadoCompra.textContent = "Escolha a forma de pagamento para continuar.";
    pagamentoCliente.focus();
    return false;
  }

  return true;
}

// Gera um numero grande aleatorio para o meio do codigo.
function gerarNumeroAleatorio() {
  const numero = Math.floor(Math.random() * 900000000) + 100000000;
  return numero;
}

// Define as letras do inicio do codigo.
function gerarLetrasInicio() {
  return "BR";
}

// Define as letras do final do codigo.
function gerarLetrasFim() {
  return "GO";
}

// Junta letras e numeros para montar um codigo parecido com os Correios.
function gerarCodigoCorreios() {
  const inicio = gerarLetrasInicio();
  const meio = gerarNumeroAleatorio();
  const fim = gerarLetrasFim();
  const codigoFinal = inicio + meio + fim;
  return codigoFinal;
}

// Pega o nome digitado. Se estiver vazio, coloca um texto padrao.
function pegarNomeCliente() {
  const nome = nomeCliente.value.trim();

  if (nome === "") {
    return "Cliente sem nome";
  }

  return nome;
}

// Pega a cidade digitada. Se estiver vazia, coloca um texto padrao.
function pegarCidadeCliente() {
  const cidade = cidadeCliente.value.trim();

  if (cidade === "") {
    return "Cidade nao informada";
  }

  return cidade;
}

// Pega a forma de pagamento escolhida no select.
function pegarPagamentoCliente() {
  const pagamento = pagamentoCliente.value;
  return pagamento;
}

// Remove pontos, tracos e qualquer outro caractere que nao seja numero do CEP.
function limparCep(valor) {
  const cepLimpo = valor.replace(/\D/g, "");
  return cepLimpo;
}

// Verifica se o CEP ficou com exatamente 8 numeros.
function validarCep(cep) {
  if (cep.length !== 8) {
    return false;
  }

  return true;
}

// Mostra na tela o endereco encontrado para a compra.
function mostrarEnderecoNaCompra(dados) {
  enderecoCompra.innerHTML =
    "<strong>Endereco encontrado para entrega:</strong><br>" +
    "CEP: " + dados.cep + "<br>" +
    "Logradouro: " + dados.logradouro + "<br>" +
    "Bairro: " + dados.bairro + "<br>" +
    "Cidade: " + dados.localidade + "<br>" +
    "Estado: " + dados.uf;
}

// Busca o endereco da entrega usando a API do ViaCEP.
async function buscarEnderecoPorCep() {
  const cepOriginal = cepCliente.value;
  const cep = limparCep(cepOriginal);

  if (!validarCep(cep)) {
    throw new Error("CEP_INVALIDO");
  }

  console.log("Buscando CEP no ViaCEP para a compra.");
  console.log(cep);

  const resposta = await fetch("https://viacep.com.br/ws/" + cep + "/json/");
  const dados = await resposta.json();

  if (dados.erro) {
    throw new Error("CEP_NAO_ENCONTRADO");
  }

  mostrarEnderecoNaCompra(dados);
  return dados;
}

// Salva somente o ultimo codigo gerado no localStorage.
function salvarUltimoCodigo(codigo) {
  localStorage.setItem("ultimoCodigoGerado", codigo);
}

// Salva a ultima compra inteira no localStorage para usar em outra pagina.
function salvarUltimaCompra(compra) {
  localStorage.setItem("ultimaCompra", JSON.stringify(compra));
}

// Salva tambem o historico das compras para rastrear por codigo.
function salvarHistoricoCompras() {
  localStorage.setItem("historicoCompras", JSON.stringify(listaCompras));
}

// Mostra na tela os dados da compra feita pelo usuario.
function mostrarResultado(compra) {
  const precoFormatado = pegarPrecoFormatado(compra.precoBase);

  resultadoCompra.innerHTML =
    "<strong>Compra feita com sucesso.</strong><br>" +
    "Cliente: " + compra.cliente + "<br>" +
    "Cidade: " + compra.cidade + "<br>" +
    "Pagamento: " + compra.pagamento + "<br>" +
    "Produto: " + compra.produto + "<br>" +
    "Preco: " + precoFormatado + "<br>" +
    "Entrega para: " + compra.endereco.localidade + " - " + compra.endereco.uf + "<br>" +
    "Codigo gerado: <strong>" + compra.codigo + "</strong><br>" +
    'Use esse codigo na outra pagina para acompanhar o pacote ficticio.';
}

// Limpa a mensagem inicial da tabela quando a primeira compra for adicionada.
function limparTabelaSePrecisar() {
  if (listaCompras.length === 1) {
    tabelaCompras.innerHTML = "";
  }
}

// Cria uma linha nova na tabela com os dados da compra.
function adicionarLinhaNaTabela(compra) {
  limparTabelaSePrecisar();

  const linha = document.createElement("tr");
  const colunaCliente = document.createElement("td");
  const colunaProduto = document.createElement("td");
  const colunaPreco = document.createElement("td");
  const colunaCodigo = document.createElement("td");

  linha.dataset.precoBase = compra.precoBase;

  colunaCliente.textContent = compra.cliente;
  colunaProduto.textContent = compra.produto;
  colunaPreco.textContent = pegarPrecoFormatado(compra.precoBase);
  colunaCodigo.textContent = compra.codigo;

  linha.appendChild(colunaCliente);
  linha.appendChild(colunaProduto);
  linha.appendChild(colunaPreco);
  linha.appendChild(colunaCodigo);

  tabelaCompras.appendChild(linha);
}

// Atualiza a coluna de preco da tabela quando a moeda e trocada.
function atualizarPrecosTabela() {
  const linhasDaTabela = tabelaCompras.querySelectorAll("tr[data-preco-base]");

  for (let i = 0; i < linhasDaTabela.length; i += 1) {
    const precoBase = Number(linhasDaTabela[i].dataset.precoBase);
    const colunaPreco = linhasDaTabela[i].children[2];

    if (colunaPreco) {
      colunaPreco.textContent = pegarPrecoFormatado(precoBase);
    }
  }
}

// Atualiza todos os precos da tela de uma vez.
function atualizarPrecosDaTela() {
  atualizarPrecosProdutos();
  atualizarPrecosTabela();
  mostrarProdutoSelecionado();

  if (ultimaCompraFeita) {
    mostrarResultado(ultimaCompraFeita);
  }
}

// Faz toda a montagem da compra quando um produto e selecionado.
async function fazerCompra(produto, preco) {
  const codigo = gerarCodigoCorreios();
  const precoBase = Number(preco);

  let endereco;

  try {
    endereco = await buscarEnderecoPorCep();
  } catch (erro) {
    if (erro.message === "CEP_INVALIDO") {
      resultadoCompra.textContent = "Digite um CEP valido com 8 numeros para finalizar a compra.";
      enderecoCompra.textContent = "Nenhum endereco foi consultado ainda.";
      return;
    }

    if (erro.message === "CEP_NAO_ENCONTRADO") {
      resultadoCompra.textContent = "O CEP informado nao foi encontrado. Digite um CEP existente.";
      enderecoCompra.textContent = "Nenhum endereco foi consultado ainda.";
      return;
    }

    resultadoCompra.textContent = "Ocorreu um erro ao consultar o CEP da entrega.";
    enderecoCompra.textContent = "Nenhum endereco foi consultado ainda.";

    console.log("Erro ao consultar CEP na compra.");
    console.log(erro);
    return;
  }

  const compra = {
    cliente: pegarNomeCliente(),
    cidade: pegarCidadeCliente(),
    pagamento: pegarPagamentoCliente(),
    produto: produto,
    precoBase: precoBase,
    codigo: codigo,
    cep: endereco.cep,
    endereco: endereco
  };

  listaCompras.push(compra);
  ultimaCompraFeita = compra;

  salvarUltimoCodigo(codigo);
  salvarUltimaCompra(compra);
  salvarHistoricoCompras();

  mostrarResultado(compra);
  adicionarLinhaNaTabela(compra);

  console.log("Compra criada");
  console.log(compra);
}

// Mostra o formulario quando o usuario escolhe um produto.
function escolherProduto(evento) {
  const botao = evento.target;
  const produto = botao.dataset.produto;
  const preco = botao.dataset.preco;

  produtoEscolhido = {
    nome: produto,
    precoBase: Number(preco)
  };

  secaoFormularioCompra.classList.remove("formulario-compra-escondido");
  mostrarProdutoSelecionado();
  resultadoCompra.textContent = "Preencha o formulario abaixo para finalizar a compra.";
  enderecoCompra.textContent = "Nenhum endereco foi consultado ainda.";
  nomeCliente.focus();
}

// Finaliza a compra do produto que foi escolhido antes.
async function enviarFormularioCompra(evento) {
  evento.preventDefault();

  if (!produtoEscolhido) {
    resultadoCompra.textContent = "Escolha um produto antes de preencher o formulario.";
    return;
  }

  if (!validarCamposPreenchidos()) {
    return;
  }

  finalizarCompraBtn.disabled = true;
  finalizarCompraBtn.textContent = "Finalizando...";

  await fazerCompra(produtoEscolhido.nome, produtoEscolhido.precoBase);

  finalizarCompraBtn.disabled = false;
  finalizarCompraBtn.textContent = "Finalizar compra";
}

// Troca a moeda atual e atualiza os valores dos produtos e da compra.
function trocarMoeda() {
  moedaAtual = moedaSelect.value;

  if (moedaAtual !== "BRL" && !cotacoes[moedaAtual]) {
    moedaAtual = "BRL";
    moedaSelect.value = "BRL";
    atualizarStatusMoeda("Sem cotacao no momento. Os precos continuam em real.");
    atualizarPrecosDaTela();
    return;
  }

  if (moedaAtual === "BRL") {
    atualizarStatusMoeda("Precos mostrados em real.");
  } else {
    atualizarStatusMoeda("Precos convertidos para " + moedaAtual + ".");
  }

  atualizarPrecosDaTela();
}

// Coloca o evento de clique em cada botao de comprar.
for (let i = 0; i < botoesComprar.length; i += 1) {
  botoesComprar[i].addEventListener("click", escolherProduto);
}

// Quando a moeda mudar, os precos mudam junto.
moedaSelect.addEventListener("change", trocarMoeda);

// Quando o formulario for enviado, a compra e finalizada.
formCompra.addEventListener("submit", enviarFormularioCompra);

// Busca as cotacoes da API quando a pagina carrega.
carregarCotacoes();
