/* ----------------------------------------------------------------------------
 * File:     pesquisar.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { execSync } = require('child_process');

const { lerPalavra, copiarTemplateJSON } = require("./gestorPalavras");
const { buscarDadosWiktionary } = require("./wiktionary");
const { corrigirIPA } = require("./ipa");
const { aplicarLusofonema, aplicarLusofonemaPorSilaba } = require("./regras");

const { debug, error } = require("./debug");


/**
 * @brief Procura a palavra nos ficheiros .json ou gera automaticamente.
 * @param {string} palavra Palavra a procurar.
 * @returns {object|null} Objeto com pesquisa da palavra e fonte ("ficheiro"|"gerado").
 */
async function pesquisarPalavra(callback, palavra) {

	// 1. Tenta ler do ficheiro JSON com definição da palavra
	let dados = lerPalavra(palavra);

	if (dados) {
		return { fonte: "no dicionario", dados: dados };
	}

	dados = copiarTemplateJSON();
	if (!dados) {
		error("Copiar template falhou.");
		return null;
	}

	// 2. Busca dados no Wiktionary
	try {
		const eval = await buscarDadosWiktionary(palavra, dados);

		debug("Dados:", dados);

		if (eval == null) {
			error("Procura de dados no Wiktionary falhou.");
			return null;
		}

		else if (eval == true && dados.ipa) {

			dados.ipa = corrigirIPA(dados.ipa);
			dados.lusofonema = aplicarLusofonemaPorSilaba(dados);

			return { fonte: "por pesquisa", dados: dados };
		}
	}
	catch (e) {
		error(`Erro no Wiktionary: ${e.message}`);
		return null;
	}

	// 3. Fallback: gera com espeak-ng
	try {
		dados.ipa = execSync(`espeak-ng -v pt --ipa=3 -q "${palavra}" 2>/dev/null`).toString().trim();

		debug(dados.ipa);

		dados.ipa = corrigirIPA(dados.ipa);
		dados.lusofonema = aplicarLusofonema(palavra, dados.ipa);

		return { fonte: "gerada", dados: dados };
	}
	catch (e) {
		error(`Erro ao gerar palavra "${palavra}":`, e.message);
		return null;
	}
}


module.exports = { pesquisarPalavra };
