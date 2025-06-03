/* ----------------------------------------------------------------------------
 * File:     debug.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

let debugAtivo = false;

/** Ativa a saída de debug. */
function ativarDebug() {
	debugAtivo = true;
}

/** Desativa a saída de debug. */
function desativarDebug() {
	debugAtivo = false;
}

/**
 * Imprime mensagens de debug, indicando a função de chamada.
 * @param {...any} mensagens Mensagens a imprimir em modo debug.
 */
function debug(...mensagens) {

	if (debugAtivo) {
		const stack = new Error().stack;
		const linhas = stack.split("\n");
		let funcao = "desconhecida";

		// Tenta extrair o nome da função chamadora
		if (linhas.length >= 3) {
			const match = linhas[2].match(/at (\S+)/);
			if (match) funcao = match[1];
		}

		console.log(`[DEBUG][${funcao}]`, ...mensagens);
	}
}

module.exports = { debug, ativarDebug, desativarDebug };
