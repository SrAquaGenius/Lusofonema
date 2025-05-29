/* ----------------------------------------------------------------------------
 * File:     luzofonema.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const readline = require("readline");
const { mostrarAlfabetoLusofonema, mostrarAlfabetoIPA } = require("./alfabeto");
const { mostrarPalavra, mostrarTexto } = require("./mostrar");
const { verificarPalavra } = require("./verificar");
const { ativarDebug, desativarDebug } = require("./debug");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


console.log("🗣️  Lusofonema — Uma versão fonética da língua Portuguesa");
console.log("========================================================\n");


// Debug introduction code ----------------------------------------------------

// Adiciona uma variável para o estado do debug
let debugLigado = false;

function changeDebug() {
	debugLigado = !debugLigado;
	if (debugLigado) ativarDebug();
	else desativarDebug();
	console.log(`Modo de debug ${debugLigado ? "ativado 🐞" : "desativado"}\n`);
	mostrarMenu();
}


/**
 * @brief Exibe o menu principal da aplicação Lusofonema e trata as interações do utilizador.
 *
 * Esta função imprime no terminal uma lista de opções numeradas que permitem
 * ao utilizador explorar funcionalidades da aplicação, tais como:
 * - Visualizar os alfabetos fonético e lusofonémico.
 * - Mostrar ou validar uma palavra.
 * - Apresentar um excerto de texto anotado.
 * - Ativar ou desativar o modo de depuração (debug).
 * - Encerrar a aplicação.
 *
 * Após o utilizador introduzir uma opção, a função redireciona para a
 * funcionalidade correspondente e, quando necessário, volta a apresentar o menu.
 *
 * Utiliza `readline` para entrada interativa e espera pela escolha do
 * utilizador. Não recebe parâmetros diretamente, mas depende de variáveis e
 * funções do escopo exterior, incluindo o estado `debugLigado`.
 */
function mostrarMenu() {
	console.log("Menu:");
	console.log("1 - Ver alfabeto do Lusofonema");
	console.log("2 - Ver alfabeto fonético");
	console.log("3 - Mostrar uma palavra");
	console.log("4 - Validar uma palavra");
	console.log("5 - Mostrar texto");
	console.log("6 - Ativar/Desativar (", debugLigado ? "🟢" : "⚫", ")");
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
			case "6":
				changeDebug();
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
