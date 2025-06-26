/* ----------------------------------------------------------------------------
 * File:     mostrarPalavra.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { obterPalavraAleatoria } = require("./gestorCorpus");
const { pesquisarPalavra } = require("./pesquisar");
const { converterDadosParaTexto } = require("./gestorPalavras");
const { corrigirAdicionar } = require("./corrigir");

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
async function mostrarPalavra(rl, callback) {

	rl.question("🔍 Palavra ('Enter' para aleatória, '0' para voltar): ",
			async (input) => {

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
	});
}


module.exports = { mostrarPalavra };
