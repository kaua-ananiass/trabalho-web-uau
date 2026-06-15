// Seleciona os elementos da pagina de rastreio.
const codigoGerado = document.getElementById("codigoGerado");
const codigoDigitado = document.getElementById("codigoDigitado");
const mensagemCep = document.getElementById("mensagemCep");
const resumoRastreio = document.getElementById("resumoRastreio");
const trilhaPacote = document.getElementById("trilhaPacote");
const formCep = document.getElementById("formCep");
const avancarEtapaBtn = document.getElementById("avancarEtapaBtn");
const limparBtn = document.getElementById("limparBtn");

// Guarda o pedido atualmente carregado no rastreio.
let compraAtualRastreio = null;

// Guarda a etapa atual do pedido carregado.
let etapaAtualRastreio = 0;

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

// Monta a chave usada para salvar a etapa no navegador.
function pegarChaveEtapa(codigo) {
  return "etapaAtual_" + codigo;
}

// Busca a etapa salva anteriormente para o codigo.
function carregarEtapaSalva(codigo, totalEtapas) {
  const valorSalvo = localStorage.getItem(pegarChaveEtapa(codigo));
  const etapa = Number(valorSalvo);

  if (Number.isNaN(etapa)) {
    return 0;
  }

  if (etapa < 0) {
    return 0;
  }

  if (etapa > totalEtapas - 1) {
    return totalEtapas - 1;
  }

  return etapa;
}

// Salva no navegador a etapa atual do pedido.
function salvarEtapaAtual(codigo, etapa) {
  localStorage.setItem(pegarChaveEtapa(codigo), String(etapa));
}

// Atualiza o estado do botao de avancar.
function atualizarBotaoAvancar(totalEtapas) {
  if (!compraAtualRastreio) {
    avancarEtapaBtn.disabled = true;
    avancarEtapaBtn.textContent = "Avancar etapa";
    return;
  }

  if (etapaAtualRastreio >= totalEtapas - 1) {
    avancarEtapaBtn.disabled = false;
    avancarEtapaBtn.textContent = "Voltar para o inicio";
    return;
  }

  avancarEtapaBtn.disabled = false;
  avancarEtapaBtn.textContent = "Avancar etapa";
}

// Mostra no topo um resumo do pedido rastreado.
function mostrarResumo(compra, etapaAtual) {
  const etapas = montarEtapasFicticias(compra);
  const etapa = etapas[etapaAtual];

  resumoRastreio.innerHTML =
    "<strong>Pedido encontrado.</strong><br>" +
    "Cliente: " + compra.cliente + "<br>" +
    "Produto: " + compra.produto + "<br>" +
    "Destino: " + compra.endereco.logradouro + ", " + compra.endereco.bairro + "<br>" +
    compra.endereco.localidade + " - " + compra.endereco.uf + "<br>" +
    "CEP: " + compra.cep + "<br>" +
    "Etapa atual: " + etapa.numero + " de " + etapas.length + "<br>" +
    "Pacote esta agora em: " + etapa.titulo;
}

// Mostra somente a etapa atual da trilha.
function mostrarTrilha(compra, etapaAtual) {
  const etapas = montarEtapasFicticias(compra);
  const etapa = etapas[etapaAtual];

  trilhaPacote.innerHTML = "";

  const checkpoint = document.createElement("div");
  const progresso = document.createElement("div");
  const bola = document.createElement("div");
  const conteudo = document.createElement("div");
  const imagem = document.createElement("img");
  const texto = document.createElement("div");
  const titulo = document.createElement("h4");
  const situacao = document.createElement("p");

  checkpoint.className = "checkpoint checkpoint-atual checkpoint-unico";
  progresso.className = "checkpoint-progresso";
  progresso.textContent = "Etapa " + etapa.numero + " de " + etapas.length;

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

  trilhaPacote.appendChild(checkpoint);
}

// Mostra a trilha vazia quando ainda nao existe rastreio.
function mostrarTrilhaVazia() {
  trilhaPacote.innerHTML = '<div class="trilha-vazia">Nenhuma trilha foi carregada ainda.</div>';
}

// Atualiza toda a tela do rastreio com base na etapa atual.
function atualizarTelaRastreio() {
  if (!compraAtualRastreio) {
    return;
  }

  const etapas = montarEtapasFicticias(compraAtualRastreio);
  mostrarResumo(compraAtualRastreio, etapaAtualRastreio);
  mostrarTrilha(compraAtualRastreio, etapaAtualRastreio);
  atualizarBotaoAvancar(etapas.length);
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

// Pesquisa o codigo de rastreio informado.
function pesquisarRastreio(evento) {
  evento.preventDefault();

  const codigo = codigoDigitado.value.trim();

  if (codigo === "") {
    mensagemCep.textContent = "Digite o codigo de rastreio.";
    resumoRastreio.textContent = "Nenhum pedido foi carregado ainda.";
    compraAtualRastreio = null;
    etapaAtualRastreio = 0;
    mostrarTrilhaVazia();
    atualizarBotaoAvancar(0);
    return;
  }

  const compra = procurarCompraPorCodigo(codigo);

  if (!compra) {
    mensagemCep.textContent = "Codigo nao encontrado no sistema.";
    resumoRastreio.textContent = "Nenhum pedido foi carregado ainda.";
    compraAtualRastreio = null;
    etapaAtualRastreio = 0;
    mostrarTrilhaVazia();
    atualizarBotaoAvancar(0);
    return;
  }

  compraAtualRastreio = compra;
  etapaAtualRastreio = carregarEtapaSalva(
    compraAtualRastreio.codigo,
    montarEtapasFicticias(compraAtualRastreio).length
  );

  mensagemCep.textContent = "Rastreio encontrado com sucesso.";
  atualizarTelaRastreio();

  console.log("Rastreio encontrado");
  console.log(compra);
}

// Avanca a trilha para a proxima etapa.
function avancarEtapa() {
  if (!compraAtualRastreio) {
    mensagemCep.textContent = "Pesquise um codigo antes de avancar a trilha.";
    return;
  }

  const etapas = montarEtapasFicticias(compraAtualRastreio);

  if (etapaAtualRastreio >= etapas.length - 1) {
    etapaAtualRastreio = 0;
    salvarEtapaAtual(compraAtualRastreio.codigo, etapaAtualRastreio);
    mensagemCep.textContent = "A trilha voltou para o inicio.";
    atualizarTelaRastreio();
    return;
  }

  if (etapaAtualRastreio === etapas.length - 2) {
    mensagemCep.textContent = "Ultima etapa liberada.";
  } else {
    mensagemCep.textContent = "Pacote avancou para a proxima etapa.";
  }

  etapaAtualRastreio += 1;
  salvarEtapaAtual(compraAtualRastreio.codigo, etapaAtualRastreio);
  atualizarTelaRastreio();
}

// Limpa os campos e a tabela da pagina de rastreio.
function limparTudo() {
  codigoDigitado.value = "";
  mensagemCep.textContent = "Digite o codigo para procurar o pacote.";
  resumoRastreio.textContent = "Nenhum pedido foi carregado ainda.";
  compraAtualRastreio = null;
  etapaAtualRastreio = 0;
  mostrarTrilhaVazia();
  atualizarBotaoAvancar(0);
}

// Quando o formulario for enviado, chama a pesquisa do rastreio.
formCep.addEventListener("submit", pesquisarRastreio);

// Quando o botao de limpar for clicado, limpa os campos.
limparBtn.addEventListener("click", limparTudo);

// Quando o botao de avancar for clicado, a trilha anda.
avancarEtapaBtn.addEventListener("click", avancarEtapa);

// Mostra o ultimo codigo salvo ao abrir a pagina.
mostrarUltimoCodigo();
mostrarTrilhaVazia();
atualizarBotaoAvancar(0);
