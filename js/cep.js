// Seleciona os elementos da pagina de rastreio.
const codigoGerado = document.getElementById("codigoGerado");
const codigoDigitado = document.getElementById("codigoDigitado");
const mensagemCep = document.getElementById("mensagemCep");
const resumoRastreio = document.getElementById("resumoRastreio");
const trilhaPacote = document.getElementById("trilhaPacote");
const formCep = document.getElementById("formCep");
const limparBtn = document.getElementById("limparBtn");

// Mostra o ultimo codigo salvo quando a pagina abre.
function mostrarUltimoCodigo() {
  const ultimaCompra = localStorage.getItem("ultimaCompra");

  if (!ultimaCompra) {
    codigoGerado.textContent = "Nenhum codigo foi gerado ainda.";
    return;
  }

  const compraConvertida = JSON.parse(ultimaCompra);

  codigoGerado.innerHTML =
    "Ultimo codigo salvo: <strong>" + compraConvertida.codigo + "</strong><br>" +
    "Produto: " + compraConvertida.produto + "<br>" +
    "Destino: " + compraConvertida.endereco.localidade + " - " + compraConvertida.endereco.uf;

  codigoDigitado.value = compraConvertida.codigo;
}

// Escolhe a imagem principal de acordo com o produto comprado.
function pegarImagemDoProduto(produto) {
  if (produto === "Camiseta Gato Huh") {
    return "imagens/D_Q_NP_2X_930253-MLB82586863637_022025-E-camiseta-basica-engracada-unissex-gato-huh-meme-100-algodao.png";
  }

  if (produto === "Camiseta Gato Danger") {
    return "imagens/D_Q_NP_2X_645750-MLB87160395916_072025-E-camiseta-estampa-gato-meme-danger-to-society-camisa-unissex.png";
  }

  return "imagens/D_Q_NP_2X_655339-CBT91568445436_092025-E-camiseta-meme-de-hamster-chorando-olhos-grandes-engracado.webp";
}

// Gera uma lista simples de etapas do pedido.
function montarEtapasFicticias(compra) {
  const imagemProduto = pegarImagemDoProduto(compra.produto);

  return [
    {
      numero: "01",
      titulo: "Pedido confirmado",
      descricao: "Seu pedido foi registrado com sucesso no sistema da loolja.",
      imagem: imagemProduto
    },
    {
      numero: "02",
      titulo: "Pagamento aprovado",
      descricao: "O pagamento foi aprovado e o pedido foi liberado para separacao.",
      imagem: imagemProduto
    },
    {
      numero: "03",
      titulo: "Tributacao do envio",
      descricao: "O pedido passou pela etapa de tributacao antes de seguir para a separacao.",
      imagem: "imagens/etapas-envio/corre-taxade.webp"
    },
    {
      numero: "04",
      titulo: "Pedido em embalagem",
      descricao: "O produto foi embalado e esta pronto para seguir transporte.",
      imagem: imagemProduto
    },
    {
      numero: "05",
      titulo: "Perdido em Curitiba",
      descricao: "O pedido teve um atraso no centro logistico de Curitiba antes de continuar a rota.",
      imagem: "imagens/etapas-envio/curitiba-meme.png"
    },
    {
      numero: "06",
      titulo: "Em transporte",
      descricao: "O pedido esta em deslocamento para o centro de distribuicao da sua regiao.",
      imagem: "imagens/etapas-envio/engarrafamento.png"
    },
    {
      numero: "07",
      titulo: "Saiu para entrega",
      descricao: "O pedido saiu para entrega no endereco informado na compra.",
      imagem: "imagens/etapas-envio/salvou.jpg"
    },
    {
      numero: "08",
      titulo: "Entrega concluida",
      descricao: "O pedido foi entregue com sucesso no endereco cadastrado.",
      imagem: imagemProduto
    }
  ];
}

// Procura a compra no historico salvo no navegador.
function procurarCompraPorCodigo(codigo) {
  const historico = localStorage.getItem("historicoCompras");

  if (!historico) {
    return null;
  }

  const compras = JSON.parse(historico);

  for (let i = 0; i < compras.length; i += 1) {
    if (compras[i].codigo === codigo) {
      return compras[i];
    }
  }

  return null;
}

// Mostra no topo um resumo do pedido rastreado.
function mostrarResumo(compra, etapas) {
  const ultimaEtapa = etapas[etapas.length - 1];

  resumoRastreio.innerHTML =
    "<strong>Pedido encontrado.</strong><br>" +
    "Cliente: " + compra.cliente + "<br>" +
    "Produto: " + compra.produto + "<br>" +
    "Destino: " + compra.endereco.logradouro + ", " + compra.endereco.bairro + "<br>" +
    compra.endereco.localidade + " - " + compra.endereco.uf + "<br>" +
    "CEP: " + compra.cep + "<br>" +
    "Total de etapas: " + etapas.length + "<br>" +
    "Fim do caminho: " + ultimaEtapa.titulo;
}

// Cria um card visual para uma etapa da trilha.
function criarCheckpoint(etapa, indice, totalEtapas) {
  const checkpoint = document.createElement("div");
  const progresso = document.createElement("div");
  const bola = document.createElement("div");
  const conteudo = document.createElement("div");
  const imagem = document.createElement("img");
  const texto = document.createElement("div");
  const titulo = document.createElement("h4");
  const situacao = document.createElement("p");

  checkpoint.className = "checkpoint checkpoint-lista checkpoint-deslocado-" + (indice % 3);
  if (indice === totalEtapas - 1) {
    checkpoint.classList.add("checkpoint-final");
  }

  progresso.className = "checkpoint-progresso";
  progresso.textContent = "Etapa " + etapa.numero + " de " + totalEtapas;

  bola.className = "checkpoint-bola";
  bola.textContent = etapa.numero;

  conteudo.className = "checkpoint-conteudo";
  imagem.className = "checkpoint-imagem";
  imagem.src = etapa.imagem;
  imagem.alt = etapa.titulo;

  texto.className = "checkpoint-texto";
  titulo.textContent = etapa.titulo;
  situacao.textContent = etapa.descricao;

  texto.appendChild(titulo);
  texto.appendChild(situacao);
  conteudo.appendChild(imagem);
  conteudo.appendChild(texto);
  checkpoint.appendChild(progresso);
  checkpoint.appendChild(bola);
  checkpoint.appendChild(conteudo);

  return checkpoint;
}

// Mostra a trilha completa de uma vez, em ordem vertical.
function mostrarTrilhaCompleta(compra) {
  const etapas = montarEtapasFicticias(compra);
  trilhaPacote.innerHTML = "";

  for (let i = 0; i < etapas.length; i += 1) {
    const checkpoint = criarCheckpoint(etapas[i], i, etapas.length);
    trilhaPacote.appendChild(checkpoint);
  }

  return etapas;
}

// Mostra a trilha vazia quando ainda nao existe rastreio.
function mostrarTrilhaVazia() {
  trilhaPacote.innerHTML = '<div class="trilha-vazia">Nenhuma trilha foi carregada ainda.</div>';
}

// Pesquisa o codigo de rastreio informado.
function pesquisarRastreio(evento) {
  evento.preventDefault();

  const codigo = codigoDigitado.value.trim();

  if (codigo === "") {
    mensagemCep.textContent = "Digite o codigo de rastreio.";
    resumoRastreio.textContent = "Nenhum pedido foi carregado ainda.";
    mostrarTrilhaVazia();
    return;
  }

  const compra = procurarCompraPorCodigo(codigo);

  if (!compra) {
    mensagemCep.textContent = "Codigo nao encontrado no sistema.";
    resumoRastreio.textContent = "Nenhum pedido foi carregado ainda.";
    mostrarTrilhaVazia();
    return;
  }

  const etapas = mostrarTrilhaCompleta(compra);
  mostrarResumo(compra, etapas);
  mensagemCep.textContent = "Rastreio encontrado com sucesso. A trilha completa ja apareceu abaixo.";

  console.log("Rastreio encontrado");
  console.log(compra);
}

// Limpa os campos e os dados da pagina de rastreio.
function limparTudo() {
  codigoDigitado.value = "";
  mensagemCep.textContent = "Digite o codigo para procurar o pacote.";
  resumoRastreio.textContent = "Nenhum pedido foi carregado ainda.";
  mostrarTrilhaVazia();
}

// Quando o formulario for enviado, chama a pesquisa do rastreio.
formCep.addEventListener("submit", pesquisarRastreio);

// Quando o botao de limpar for clicado, limpa os campos.
limparBtn.addEventListener("click", limparTudo);

// Mostra o ultimo codigo salvo ao abrir a pagina.
mostrarUltimoCodigo();
mostrarTrilhaVazia();
