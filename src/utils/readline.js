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

module.exports = { rl, perguntar };
