/* ----------------------------------------------------------------------------
 * File:     luzofonema.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const readline = require("readline");
const { mostrarAlfabetoLusofonema, mostrarAlfabetoIPA } = require("./alfabeto");
const { mostrarPalavra, mostrarTexto } = require("./mostrar");
const { verificarPalavra } = require("./verificar");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

console.log("🗣️  Lusofonema — Uma versão fonética da língua Portuguesa");
console.log("========================================================\n");

function mostrarMenu() {
	console.log("Menu:");
	console.log("1 - Ver alfabeto do Lusofonema");
	console.log("2 - Ver alfabeto fonético");
	console.log("3 - Mostrar uma palavra");
	console.log("4 - Validar uma palavra");
	console.log("5 - Mostrar texto");
	console.log("0 - Sair da aplicação");

	rl.question(": ", (opcao) => {
		console.log("");
		switch (opcao.trim()) {
			case "1":
				mostrarAlfabetoLusofonema(mostrarMenu);
				break;
			case "2":
				mostrarAlfabetoIPA(mostrarMenu);
				break;
			case "3":
				mostrarPalavra(rl, mostrarMenu);
				break;
			case "4":
				verificarPalavra(rl, mostrarMenu);
				break;
			case "5":
				mostrarTexto(rl, mostrarMenu);
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
