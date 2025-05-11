/* ----------------------------------------------------------------------------
 * File:     luzofonema.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const readline = require("readline");
const { mostrarAlfabeto } = require("./alfabeto");
const { mostrarPalavra } = require("./mostrar");
const { verificarPalavra } = require("./verificar");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

console.log("🗣️  Luzofonema — Uma versão fonética da língua Portuguesa");
console.log("========================================================\n");

function mostrarMenu() {
	console.log("Menu:");
	console.log("1 - Ver alfabeto");
	console.log("2 - Mostrar uma palavra");
	console.log("3 - Validar uma palavra");
	console.log("0 - Sair da aplicação");

	rl.question(": ", (opcao) => {
		console.log("");
		switch (opcao.trim()) {
			case "1":
				mostrarAlfabeto(mostrarMenu);
				break;
			case "2":
				mostrarPalavra(rl, mostrarMenu);
				break;
			case "3":
				verificarPalavra(rl, mostrarMenu);
				break;
			case "0":
				console.log("👋 Adeus!");
				rl.close();
				break;
			default:
				console.log("❗ Opção inválida.\n");
				mostrarMenu();
				break;
		}
	});
}

mostrarMenu();
