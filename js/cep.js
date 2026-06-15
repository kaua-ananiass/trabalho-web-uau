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

// Escolhe a imagem da etapa do MC Poze dependendo da camiseta comprada.
function pegarImagemDaEtapaPoze(produto) {
  if (produto === "Camiseta Gato Huh") {
    return "imagens/etapas-envio/gatinho-huh.jpg";
  }

  if (produto === "Camiseta Gato Danger") {
    return "imagens/etapas-envio/gatinho-danger-meme.jpg";
  }

  return "imagens/etapas-envio/hamster-meme.jpg";
}

// Gera uma lista ficticia de locais e status do pacote.
function montarEtapasFicticias(compra) {
  return [
    {
      numero: "01",
      titulo: "Saindo do galpao clandestino da loolja",
      descricao: "A camiseta acabou de sair do galpao mais suspeito do pais.",
      imagem: "imagens/etapas-envio/loolja-galpao.jpg"
    },
    {
      numero: "02",
      titulo: "Perdido em todo mundo em panico",
      descricao: "Ja liberou, sem danos, mas deu uma preocupada geral no setor.",
      imagem: "imagens/etapas-envio/iaeee.webp"
    },
    {
      numero: "03",
      titulo: "Imposto sobre envio",
      descricao: "Foi cobrado um adicional de 150 porque aparentemente respirar tambem gera taxa.",
      imagem: "imagens/etapas-envio/corre-taxade.webp"
    },
    {
      numero: "04",
      titulo: "Casa do mini messi",
      descricao: "A encomenda parou para ver o mini messi jogar muito.",
      imagem: "imagens/etapas-envio/messi-meme.png"
    },
    {
      numero: "05",
      titulo: "Perdido em Curitiba",
      descricao: "Pessima hora para isso, mas o pacote sumiu por uns instantes.",
      imagem: "imagens/etapas-envio/curitiba-meme.png"
    },
    {
      numero: "06",
      titulo: "Encontrado pelo Manoel Gomes",
      descricao: "Obrigado, Caneta Azul. O pacote foi recuperado em grande estilo.",
      imagem: "imagens/etapas-envio/manoel.webp"
    },
    {
      numero: "07",
      titulo: "Em transito",
      descricao: "A camisa entrou num engarrafamento absurdo na avenida.",
      imagem: "imagens/etapas-envio/engarrafamento.png"
    },
    {
      numero: "08",
      titulo: "Imposto pela demora do engarrafamento",
      descricao: "A vida nao esta facil e inventaram mais uma taxa no caminho.",
      imagem: "imagens/etapas-envio/corre-taxade.webp"
    },
    {
      numero: "09",
      titulo: "Perdida na casa do MC Poze",
      descricao: "Ele encontrou sua camisa e analisou bem a estampa escolhida.",
      imagem: pegarImagemDaEtapaPoze(compra.produto)
    },
    {
      numero: "10",
      titulo: "Policia invadiu e recuperou sua camiseta",
      descricao: "Gloria. A operacao deu certo e sua camiseta voltou para o rastreio.",
      imagem: "imagens/etapas-envio/policial-voou.jpg"
    },
    {
      numero: "11",
      titulo: "Em transito novamente",
      descricao: "Agora chega. Pelo menos dessa vez parece que vai andar.",
      imagem: "imagens/etapas-envio/aleluia.webp"
    },
    {
      numero: "12",
      titulo: "Passeando pelo oceano",
      descricao: "Foi visto um doguinho na praia refletindo enquanto o pacote passava.",
      imagem: "imagens/etapas-envio/doguinho.webp"
    },
    {
      numero: "13",
      titulo: "Foi aceito o suborno nos Correios",
      descricao: "Sinto muito. A situacao ficou meio triste para a sua camiseta.",
      imagem: "imagens/etapas-envio/perdeu-triste.jpg"
    },
    {
      numero: "14",
      titulo: "Cachorro caramelo pegou ela",
      descricao: "Nosso heroi entrou em acao e assumiu a entrega por conta propria.",
      imagem: "imagens/etapas-envio/caramelo-pegou.jpg"
    },
    {
      numero: "15",
      titulo: "Ela esta a caminho da sua casa",
      descricao: "Agora sim vai chegar. Esta vindo a toda velocidade.",
      imagem: "imagens/etapas-envio/salvou.jpg"
    },
    {
      numero: "16",
      titulo: "O nosso heroi",
      descricao: "Boaa. Fim da jornada da camiseta com honra maxima.",
      imagem: "imagens/etapas-envio/heroi-dms.jpg"
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
