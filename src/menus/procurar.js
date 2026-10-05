/* ----------------------------------------------------------------------------
 * File:     menus/procurar.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { obterPalavraAleatoria } = require("../gestor/gestorCorpus");
const { converterDadosParaTexto, lerPalavra,
		copiarTemplateJSON } = require("../gestor/gestorPalavras");
const { corrigirAdicionar } = require("../analise/corrigir");
const { buscarDadosWiktionary } = require("../gestor/gestorWikti");
const { gerarIPA, corrigirIPA } = require("../analise/ipa");
const { aplicarLusofonemaLinear, aplicarLusofonemaPorSilaba
		} = require("../analise/aplicarRegras");

const { log, error, debug } = require("../utils/utils");


/**
 * @brief Mostra a transcrição fonética e lusofonema de uma palavra.
 *        Se a palavra estiver no dicionário, mostra a entrada.
 *        Se for nova, gera entrada com espeak-ng e sugere correção.
 *        Se input for vazio, escolhe palavra aleatória do corpus.
 *        Se for "0", retorna ao menu.
 * @param {Function} callback Função de retorno.
 */
async function procurarPalavra(callback, input) {

	let palavra = input.trim().toLowerCase();
	debug("Palavra:", palavra);

	if (palavra === "0") {
		log("A voltar ao menu ...");
		return callback();
	}

	// Palavra aleatória se input estiver vazio
	if (!palavra) {
		palavra = obterPalavraAleatoria();

		if (!palavra) {
			error("Falha a obter uma palavra aleatória.");
			return callback();
		}

		log(`🎲 Palavra aleatória: ${palavra}\n`);
	}

	// Procurar pela palavra escolhida
	const res = await pesquisarPalavra(palavra);

	debug(res);

	if (!res || !res.fonte) {
		error("Erro ao obter a informação da palavra.");
		return callback();
	}

	log(`📚 Entrada ${res.fonte}:`);
	log(converterDadosParaTexto(res.dados, true));

	await corrigirAdicionar(palavra, res.dados);
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

		debug("Pesquisa por Wiktionary");

		const res = await buscarDadosWiktionary(palavra, dados);

		debug("Dados:", dados);

		if (res == null || res == false) {
			error("Procura de dados no Wiktionary falhou.");
			return null;
		}

		else if (res == true && dados.ipa) {

			dados.ipa = corrigirIPA(dados.ipa);
			dados.lusofonema = aplicarLusofonemaPorSilaba(dados);

			return { fonte: "por pesquisa", dados: dados };
		}
	}
	catch (e) {
		error(`Erro na busca por Wiktionary: ${e.message}`);
		return null;
	}

	// 3. Fallback: gera com espeak-ng
	try {

		debug("Fallbak. Obter IPA com espeak");

		dados.ipa = gerarIPA(dados.palavra);

		let luso;

		if (!dados.palavra.includes(".") || !dados.ipa.includes("."))
			luso = aplicarLusofonemaLinear(dados.palavra, dados.ipa);
		else luso = aplicarLusofonemaPorSilaba(dados);

		dados.lusofonema = luso;

		return { fonte: "gerada", dados: dados };
	}
	catch (e) {
		error(`Erro ao gerar palavra "${palavra}":`, e.message);
		return null;
	}
}


module.exports = { procurarPalavra };
