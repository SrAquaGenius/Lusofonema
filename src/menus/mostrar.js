/* ----------------------------------------------------------------------------
 * File:     menus/mostrar.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const {
	converterDadosParaTexto, lerPalavra
} = require("../gestor/gestorPalavras");
const { procurarPalavra } = require("./procurar");

const { log, error, debug, warn } = require("../utils/utils");


/**
 * @brief Mostra a transcrição fonética e lusofonema de uma palavra.
 *        - Se a palavra estiver no dicionário, imprime a entrada formatada.
 *        - Se a palavra não existir, oferece opção de pesquisa.
 *        - Se for "0", retorna ao menu inicial.
 *        - Se estiver vazia, apresenta erro e retorna.
 *
 * @param {readline.Interface} rl Interface readline CLI.
 * @param {Function} callback Função de retorno ao menu ou próximo passo.
 * @param {string} input Palavra a mostrar (inserida pelo utilizador).
 */
async function mostrarPalavra(rl, callback, input) {

	let palavra = input.trim().toLowerCase();
	if (palavra == "0") {
		log("A voltar ao menu ...\n");
		return callback();
	}

	if (!palavra) {
		error("Uma palavra vazia foi inserida. A sair...\n");
		return callback();
	}

	// Procurar pela palavra escolhida
	const res = lerPalavra(palavra);

	debug(res);

	if (!res) {
		warn(`Palavra "${palavra}" não existe na base de dados.`);
		return perguntaVerificar(rl, callback);
	}

	log(`📚 Entrada no dicionário:`);
	log(converterDadosParaTexto(res, true));
	return callback();
}

/**
 * @brief Pergunta ao utilizador se deseja pesquisar uma palavra no dicionário.
 *        Se responder "s", inicia a função `procurarPalavra`. 
 *        Se responder "n", chama o callback fornecido.
 *        Caso contrário, repete a pergunta.
 *
 * @param {readline.Interface} rl Interface readline CLI para input do utilizador.
 * @param {function} callback Função a executar se o utilizador não quiser pesquisar.
 */
function perguntaVerificar(rl, callback) {
	rl.question("🔍 Pretende pesquisar pela palavra? (s/n): ",
		(input) => {
			const c = input.trim().toLowerCase();

			if (c === "s") {
				return procurarPalavra(rl, callback);
			}

			else if (c === "n") {
				return callback();
			}

			warn("Carácter inválido.\n");
			return perguntaVerificar(rl, callback);
		}
	);
}


module.exports = { mostrarPalavra };
