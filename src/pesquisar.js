/* ----------------------------------------------------------------------------
 * File:     pesquisar.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { lerPalavra, guardarPalavra } = require("./gestorPalavras");
const { corrigirIPA } = require("./ipa");
const { aplicarLusofonema, aplicarLusofonemaPorSilaba } = require("./regras");
const { buscarDadosWiktionary } = require("./wiktionary");

const { debug, error } = require("./debug");


/**
 * @brief Procura a palavra nos ficheiros .json ou gera automaticamente.
 * @param {string} palavra Palavra a procurar.
 * @returns {object|null} Objeto com dados da palavra e fonte ("ficheiro"|"gerado").
 */
async function pesquisarPalavra(palavra, callback) {

	// 1. Tenta ler do ficheiro JSON com definição da palavra
	const entrada = lerPalavra(palavra);

	if (entrada) {
		return { fonte: "no dicionario", dados: entrada };
	}

	// 2. Busca dados no Wiktionary
	try {
		const dados = await buscarDadosWiktionary(palavra, callback);

		debug("Dados:", dados);

		if (dados && dados.ipa) {

			dados.ipa = corrigirIPA(dados.ipa);
			dados.lusofonema = aplicarLusofonemaPorSilaba(dados);

			return { fonte: "por pesquisa", dados: dados };
		}
	}
	catch (e) {
		error(`Erro no Wiktionary: ${e.message}`);
	}

	// 3. Fallback: gera com espeak-ng
	// try {
	// 	let ipa = execSync(`espeak-ng -v pt --ipa=3 -q "${palavra}" 2>/dev/null`).toString().trim();
	// 	ipa = corrigirIPA(ipa);
	// 	const lusofonema = aplicarLusofonema(palavra, ipa);

	// 	debug("Gerado: ", palavra, ", ", ipa, ", ", lusofonema);

	// 	return { fonte: "gerada", palavra, ipa, lusofonema };
	// }
	// catch (error) {
	// 	error(`Erro ao gerar palavra "${palavra}":`, error.message);
	// 	return null;
	// }
}


module.exports = { pesquisarPalavra };
