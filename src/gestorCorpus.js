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

	return tentativa || null;
}

module.exports = { obterPalavraAleatoria };
