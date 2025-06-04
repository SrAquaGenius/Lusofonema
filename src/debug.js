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
		let origem = "desconhecida";

		// Tenta obter a função chamadora
		if (linhas.length >= 3) {
			const linha = linhas[2];

			// Caso com nome da função: at separarSilabas (/caminho/ficheiro.js:linha:col)
			let matchFuncao = linha.match(/at (\S+) \(([^)]+)\)/);

			if (matchFuncao) {
				origem = matchFuncao[1];
			}
			else {
				// Caso sem nome da função: at /caminho/ficheiro.js:linha:col
				let matchFicheiro = linha.match(/at .*\/([^\/:]+):\d+:\d+/);
				if (matchFicheiro) {
					origem = matchFicheiro[1];
				}
			}
		}

		console.log(`[DEBUG][${origem}]`, ...mensagens);
	}
}


module.exports = { debug, ativarDebug, desativarDebug };
