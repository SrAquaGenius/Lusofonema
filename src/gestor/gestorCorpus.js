/* ----------------------------------------------------------------------------
 * File:     gestorCorpus.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");
const path = require("path");

const { palavraGuardada } = require("./gestorPalavras");


/**
 * @brief Extrai uma palavra aleatória do corpus, que não esteja no dicionário.
 * @returns {string|null} Palavra aleatória válida ou null em caso de erro.
 */
function obterPalavraAleatoria() {

	const pasta = "./corpus";
	const ficheiros = fs.readdirSync(pasta).filter(f => f.endsWith(".xml"));
	if (ficheiros.length === 0) return null;

	const ficheiro = ficheiros[Math.floor(Math.random() * ficheiros.length)];
	const caminho = path.join(pasta, ficheiro);
	const conteudo = fs.readFileSync(caminho, "utf8");

	const texto = conteudo
		.replace(/<[^>]+>/g, " ")
		.replace(/[^\p{L}\s]/gu, " ")
		.replace(/\s+/g, " ");

	const palavras = texto.toLowerCase().split(" ")
						  .map(p => p.trim())
						  .filter(p => p.length >= 3);

	let tentativa;
	do {
		tentativa = palavras[Math.floor(Math.random() * palavras.length)];
	} while (tentativa && palavraGuardada(tentativa));

	return normalizarGrafiaAntiga(tentativa) || null;
}

/**
 * @brief Substitui grafias antigas por formas modernas equivalentes.
 *        Ex: "elle" → "ele", "pharmacia" → "farmácia"
 *
 * @param {string} palavra Palavra a normalizar.
 * @returns {string} Palavra com ortografia modernizada.
 */
function normalizarGrafiaAntiga(palavra) {

	const substituicoes = [
		[/\bll\b/gi, "l"],			// elle → ele
		[/\bnn\b/gi, "n"],			// elle → ele
		[/\besta\b/gi, "esta"],		// evita "êsta" → "esta"
		[/\bph/g, "f"],				// pharmacia → farmácia
		[/\bth/g, "t"],				// theatro → teatro
		[/\bgy/g, "gi"],			// gymnasio → ginásio
		[/\bly/g, "li"],			// lyrico → lírico
		[/\bcy/g, "ci"],			// cyprino → ciprino
		[/\bsy/g, "si"],			// symphonia → sinfonia
	];

	let resultado = palavra;
	for (const [regex, novaForma] of substituicoes) {
		resultado = resultado.replace(regex, novaForma);
	}

	return resultado;
}


module.exports = { obterPalavraAleatoria };
