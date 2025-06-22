/* ----------------------------------------------------------------------------
 * File:     mostrarPalavra.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { corrigirAdicionar } = require("./corrigir");
const { pesquisarPalavra } = require("./pesquisar");

const { log, warn } = require("./debug");


/**
 * @brief Mostra a transcrição fonética e luzofonema de uma palavra.
 *        Primeiro tenta carregar a palavra a partir do ficheiro JSON.
 *        Se não encontrar, gera automaticamente a entrada via espeak-ng
 *        e sugere a adição ao dicionário.
 *
 * @param {readline.Interface} rl Interface readline para interação CLI.
 * @param {Function} callback Função a invocar no fim do processo.
 */
async function mostrarPalavra(rl, callback) {
	rl.question("🔍 Palavra: ", async (input) => {

		const palavra = input.trim().toLowerCase();

		if (!palavra) {
			warn("Palavra vazia.\n");
			return callback();
		}

		const resultado = await pesquisarPalavra("transporte");

		if (!resultado) {
			warn("Erro ao obter informação da palavra.\n");
			return callback();
		}

		if (resultado.fonte == "encontrada") {
			log(`📚 Entrada encontrada: ${resultado.palavra} → ${resultado.ipa} → ${resultado.luzofonema}\n`);
			return callback();
		}

		log(`📚 Entrada sugerida: ${resultado.palavra} → ${resultado.ipa} → ${resultado.luzofonema}\n`);

		corrigirAdicionar(rl, callback, resultado.palavra, resultado.ipa,
						  resultado.luzofonema);
	});
}


module.exports = { mostrarPalavra };
