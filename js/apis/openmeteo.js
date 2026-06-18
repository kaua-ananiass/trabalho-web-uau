// Traduz alguns codigos de clima para um texto simples em portugues.
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

// Busca latitude e longitude da cidade usando a geocoding API do Open-Meteo.
async function buscarCidadeOpenMeteo(nomeCidade) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
    encodeURIComponent(nomeCidade) +
    "&count=1&language=pt&countryCode=BR&format=json";

  const resposta = await fetch(url);
  const dados = await resposta.json();

  if (!dados.results || dados.results.length === 0) {
    throw new Error("CIDADE_NAO_ENCONTRADA");
  }

  return dados.results[0];
}

// Busca o clima atual da cidade usando latitude e longitude.
async function buscarClimaAtualOpenMeteo(latitude, longitude) {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    latitude +
    "&longitude=" +
    longitude +
    "&current=temperature_2m,apparent_temperature,weather_code&timezone=auto";

  const resposta = await fetch(url);
  const dados = await resposta.json();

  if (!dados.current) {
    throw new Error("CLIMA_NAO_ENCONTRADO");
  }

  return dados.current;
}

// Junta a busca da cidade e do clima atual.


async function buscarClimaPorCidade(nomeCidade) {
  console.log("Buscando clima da cidade no Open-Meteo.");
  console.log(nomeCidade);

  const cidade = await buscarCidadeOpenMeteo(nomeCidade);
  const clima = await buscarClimaAtualOpenMeteo(cidade.latitude, cidade.longitude);

  return {
    cidade: cidade.name,
    estado: cidade.admin1 || "",
    temperatura: clima.temperature_2m,
    sensacao: clima.apparent_temperature,
    codigoClima: clima.weather_code,
    descricao: traduzirCodigoClima(clima.weather_code)
  };
}

