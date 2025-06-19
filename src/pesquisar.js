/* ----------------------------------------------------------------------------
 * File:     pesquisar.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { execSync } = require("child_process");
const { corrigirIPA } = require("./ipa");
const { aplicarLuzofonema } = require("./regras");

/**
 * @brief Procura a palavra nos ficheiros .json ou gera automaticamente.
 * @param {string} palavra Palavra a procurar.
 * @returns {object|null} Objeto com dados da palavra e fonte ("ficheiro"|"gerado").
 */
function pesquisarPalavra(palavra) {

	try {
		let ipa = execSync(`espeak-ng -v pt --ipa=3 -q "${palavra}" 2>/dev/null`).toString().trim();
		ipa = corrigirIPA(ipa);
		const luzofonema = aplicarLuzofonema(palavra, ipa);

		return {
			fonte: "gerado",
			palavra,
			ipa,
			luzofonema
		};

	}
	catch (error) {
		console.error(`❌ Erro ao gerar palavra "${palavra}":`, error.message);
		return null;
	}
}

module.exports = { pesquisarPalavra };
