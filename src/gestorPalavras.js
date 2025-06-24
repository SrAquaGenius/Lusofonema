/* ----------------------------------------------------------------------------
 * File:     gestorPalavras.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");
const path = require("path");

const { log, warn } = require("./debug");


const PASTA_PALAVRAS = path.join(__dirname, "..", "palavras");

/** @brief Garante que a pasta de palavras existe. */
function garantirPasta() {

	if (!fs.existsSync(PASTA_PALAVRAS)) {
		fs.mkdirSync(PASTA_PALAVRAS);
	}
}

/**
 * @brief Cria ou atualiza o ficheiro JSON de uma palavra.
 * @param {object} dados Objeto com os campos da palavra.
 */
function guardarPalavra(dados) {

	garantirPasta();
	const nomeFicheiro = `${dados.palavra.toLowerCase()}.json`;
	const caminho = path.join(PASTA_PALAVRAS, nomeFicheiro);
	fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), "utf-8");
	log(`✅ Palavra "${dados.palavra}" guardada em ${caminho}`);
}

/**
 * @brief Lê os dados de uma palavra.
 * @param {string} palavra Palavra a procurar.
 * @returns {object|null} Objeto da palavra ou null.
 */
function lerPalavra(palavra) {

	const caminho = path.join(PASTA_PALAVRAS, `${palavra.toLowerCase()}.json`);
	if (!fs.existsSync(caminho)) {
		warn(`Palavra "${palavra}" não encontrada no dicionário.`);
		return null;
	}
	const conteudo = fs.readFileSync(caminho, "utf-8");
	return JSON.parse(conteudo);
}

/**
 * @brief Elimina o ficheiro de uma palavra.
 * @param {string} palavra Palavra a eliminar.
 */
function eliminarPalavra(palavra) {

	const caminho = path.join(PASTA_PALAVRAS, `${palavra.toLowerCase()}.json`);
	if (fs.existsSync(caminho)) {
		fs.unlinkSync(caminho);
		log(`🗑️ Palavra "${palavra}" eliminada.`);
	}
	
	else warn(`Palavra "${palavra}" não existe.`);
}

module.exports = { guardarPalavra, lerPalavra, eliminarPalavra };
