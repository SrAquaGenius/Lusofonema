/* ----------------------------------------------------------------------------
 * File:     debug.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

let debugAtivo = false;

function ativarDebug() {
	debugAtivo = true;
}

function desativarDebug() {
	debugAtivo = false;
}

function debug(...mensagens) {
	if (debugAtivo) {
		console.log("[DEBUG]", ...mensagens);
	}
}

module.exports = { debug, ativarDebug, desativarDebug };
