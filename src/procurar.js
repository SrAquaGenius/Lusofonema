/* ----------------------------------------------------------------------------
 * File:     verificar.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { execSync } = require('child_process');

const { obterPalavraAleatoria } = require("./gestorCorpus");
const { converterDadosParaTexto, lerPalavra,
		copiarTemplateJSON } = require("./gestorPalavras");
const { corrigirAdicionar } = require("./corrigir");
const { buscarDadosWiktionary } = require("./wiktionary");
const { corrigirIPA } = require("./ipa");
const { aplicarLusofonema, aplicarLusofonemaPorSilaba } = require("./regras");

const { log, error, debug } = require("./debug");


/**
 * @brief Mostra a transcrição fonética e lusofonema de uma palavra.
 *        Se a palavra estiver no dicionário, mostra a entrada.
 *        Se for nova, gera entrada com espeak-ng e sugere correção.
 *        Se input for vazio, escolhe palavra aleatória do corpus.
 *        Se for "0", retorna ao menu.
 * @param {readline.Interface} rl Interface readline.
 * @param {Function} callback Função de retorno.
 */
async function procurarPalavra(rl, callback, input) {

	let palavra = input.trim().toLowerCase();
	if (palavra == "0") {
		log("A voltar ao menu ...\n");
		return callback();
	}

	// Palavra aleatória se input estiver vazio
	if (!palavra) {
		palavra = obterPalavraAleatoria();

		if (!palavra) {
			error("Falha a obter uma palavra aleatória.\n");
			return callback();
		}

		log(`🎲 Palavra aleatória: ${palavra}\n`);
	}

	// Procurar pela palavra escolhida
	const res = await pesquisarPalavra(palavra);

	debug(res);

	if (!res || !res.fonte) {
		error("Erro ao obter a informação da palavra.\n");
		return callback();
	}

	log(`📚 Entrada ${res.fonte}:`);
	log(converterDadosParaTexto(res.dados, true));

	await corrigirAdicionar(rl, palavra, res.dados);
	return callback();
}

/**
 * @brief Procura a palavra nos ficheiros .json ou gera automaticamente.
 * @param {string} palavra Palavra a procurar.
 * @returns {object|null} Objeto com pesquisa da palavra e fonte ("ficheiro"|"gerado").
 */
async function pesquisarPalavra(palavra) {

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


module.exports = { procurarPalavra };
