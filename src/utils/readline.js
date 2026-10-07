/* ----------------------------------------------------------------------------
 * File:     readline.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function perguntar(pergunta) {
	return new Promise((resolve) => {
		rl.question(pergunta, resolve);
	});
}

async function perguntarCampo(campo, valor) {
	const input = await perguntar(`${campo} [${valor}]: `);
	const resposta = input.trim().toLowerCase();

	if (resposta === "q") {
		warn("Saída forçada. Operação cancelada.");
		return null;
	}

	if (resposta === "") return valor;
	return input.trim() || valor;
}

module.exports = { rl, perguntar, perguntarCampo };
