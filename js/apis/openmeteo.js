// Esta funcao recebe o numero do weather_code da API e transforma em um texto


// simples para aparecer de forma mais melhor na tela

// weather_code



function traduzirCodigoClima(codigo) {
  const codigos = {
    0: "Ceu limpo",
    1: "Poucas nuvens",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Nevoeiro",
    48: "Nevoeiro com gelo",
    51: "Garoa fraca",
    53: "Garoa moderada",
    55: "Garoa forte",
    61: "Chuva fraca",
    63: "Chuva moderada",
    65: "Chuva forte",
    71: "Neve fraca",
    73: "Neve moderada",
    75: "Neve forte",
    80: "Pancadas fracas",
    81: "Pancadas moderadas",
    82: "Pancadas fortes",
    95: "Trovoada"
  };

  if (codigos[codigo]) {
    return codigos[codigo];
  }

  return "Clima variado";
}

// Passo 1 da Open-Meteo:
// aqui a gente envia o nome da cidade para a API de geolocalizacao.
// A resposta devolve a cidade encontrada com latitude e longitude,
// que serao usadas na proxima etapa para buscar o clima.



async function buscarCidadeOpenMeteo(nomeCidade) {
  // encodeURIComponent ajuda a enviar nomes de cidade com espaco ou acento.
  const url =
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
    encodeURIComponent(nomeCidade) +
    "&count=1&language=pt&countryCode=BR&format=json";

  // Faz a requisicao para a API e converte a resposta para JSON.

  const resposta = await fetch(url);
  const dados = await resposta.json();


  if (!dados.results || dados.results.length === 0) {
    throw new Error("CIDADE_NAO_ENCONTRADA");
  }

  
  return dados.results[0];
}

// Passo 2 da Open-Meteo:
// depois de descobrir onde a cidade fica no mapa, esta funcao usa
// latitude e longitude para buscar o clima atual dessa localizacao.


async function buscarClimaAtualOpenMeteo(latitude, longitude) {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    latitude +
    "&longitude=" +
    longitude +
    "&current=temperature_2m,apparent_temperature,weather_code&timezone=auto";

  //transforma em json a resposta da API.


  const resposta = await fetch(url);
  const dados = await resposta.json();


  if (!dados.current) {
    throw new Error("CLIMA_NAO_ENCONTRADO");
  }

  
  return dados.current;
}

// Passo final:
// esta funcao junta tudo em ordem.


async function buscarClimaPorCidade(nomeCidade) {
  console.log("Buscando clima da cidade no Open-Meteo.");
  console.log(nomeCidade);

  // Primeiro pega os dados da cidade no mapa.
  const cidade = await buscarCidadeOpenMeteo(nomeCidade);

  // Depois usa as coordenadas da cidade para descobrir o clima atual.
  const clima = await buscarClimaAtualOpenMeteo(cidade.latitude, cidade.longitude);

  // Retorna um objeto menor e mais facil de usar no restante do projeto.
  return {
    cidade: cidade.name,
    estado: cidade.admin1 || "",
    temperatura: clima.temperature_2m,
    sensacao: clima.apparent_temperature,
    codigoClima: clima.weather_code,
    descricao: traduzirCodigoClima(clima.weather_code)
  };
}
