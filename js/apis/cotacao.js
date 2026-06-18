
const apiCotacao =
  "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL";

// Busca as cotacoes na API e devolve os valores prontos para a loja usar.
async function buscarCotacoesMoedas() {
  const resposta = await fetch(apiCotacao);
  const dados = await resposta.json();

  return {
    USD: Number(dados.USDBRL.bid),
    EUR: Number(dados.EURBRL.bid),
    GBP: Number(dados.GBPBRL.bid)
  };
}

