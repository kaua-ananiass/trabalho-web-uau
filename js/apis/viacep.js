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

// Busca um CEP na API publica ViaCEP e devolve os dados encontrados.
async function buscarCepViaCep(cepOriginal) {
  const cep = limparCep(cepOriginal);

  if (!validarCep(cep)) {
    throw new Error("CEP_INVALIDO");
  }

  console.log("Buscando CEP na API ViaCEP.");
  console.log(cep);

  const resposta = await fetch("https://viacep.com.br/ws/" + cep + "/json/");
  const dados = await resposta.json();

  if (dados.erro) {
    throw new Error("CEP_NAO_ENCONTRADO");
  }

  return dados;
}

