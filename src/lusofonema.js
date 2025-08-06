/* ----------------------------------------------------------------------------
 * File:     lusofonema.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const readline = require("readline");

const { mostrarAlfabeto, mostrarSons } = require("./menus/alfabeto");
const { mostrarResumoDicionario } = require("./menus/dicionario");
const { mostrarPalavra } = require("./menus/mostrar");
const { procurarPalavra } = require("./menus/procurar");
// const { testarTexto } = require("./menu/testarTexto");

const { mostrarDebug, mudarDebug, log, todo, clear } = require("./utils/utils");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


log("🗣️  Lusofonema — Uma versão fonética da língua Portuguesa");
log("========================================================");


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
	log("\nMenu:");
	log("1 - Ver alfabeto do Lusofonema");
	log("2 - Ver alfabeto fonético");
	log("3 - Mostrar resumo do dicionario");
	log("4 - Mostrar uma palavra");
	log("5 - Procurar por uma palavra");
	log("6 - Mostrar texto");
	log("7 - Ativar/Desativar o debug: (", mostrarDebug() ? "🟢" : "⚫", ")");
	log("0 - Sair da aplicação");

	rl.question(": ", (opcao) => {
		log("");
		switch (opcao.trim()) {
			case "1":
				mostrarAlfabeto(mostrarMenu);
				break;
			case "2":
				mostrarSons(mostrarMenu);
				break;
			case "3":
				mostrarResumoDicionario();
				mostrarMenu();
				break;

			case "4":
				clear();
				rl.question("🔍 Palavra a mostrar ('0' para voltar): ",
					async (input) => {
						mostrarPalavra(rl, mostrarMenu, input);
					}
				);				
				break;

			case "5":
				clear();
				rl.question(
					"🔍 Palavra a procurar ('Enter' para aleatória, '0' para voltar): ",
					async (input) => {
						procurarPalavra(rl, mostrarMenu, input);
					}
				);
				break;

			case "6":
				todo("testarTexto");
				mostrarMenu();
				// testarTexto(rl, mostrarMenu);
				break;
			case "7":
				mudarDebug();
				mostrarMenu();
				break;
			case "0":
				log("👋 Adeus!");
				rl.close();
				break;
			default:
				log("❗ Opção inválida.\n");
				mostrarMenu();
				break;
		}
	});
}

mostrarMenu();
