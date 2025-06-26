/* ----------------------------------------------------------------------------
 * File:     luzofonema.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const readline = require("readline");

const { mostrarAlfabetoLusofonema, mostrarSonsIPA } = require("./alfabeto");
const { mostrarPalavra } = require("./mostrarPalavra");
const { testarTexto } = require("./testarTexto");

const { mostrarDebug, mudarDebug, log, todo } = require("./debug");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


log("🗣️  Lusofonema — Uma versão fonética da língua Portuguesa");
log("========================================================\n");


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
	log("Menu:");
	log("1 - Ver alfabeto do Lusofonema");
	log("2 - Ver alfabeto fonético");
	log("3 - Mostrar uma palavra");
	log("4 - Mostrar texto");
	log("5 - Ativar/Desativar o debug: (", mostrarDebug() ? "🟢" : "⚫", ")");
	log("0 - Sair da aplicação");

	rl.question(": ", (opcao) => {
		log("");
		switch (opcao.trim()) {
			case "1":
				mostrarAlfabetoLusofonema(mostrarMenu);
				break;
			case "2":
				mostrarSonsIPA(mostrarMenu);
				break;
			case "3":
				mostrarPalavra(rl, mostrarMenu);
				break;
			case "4":
				todo("testarTexto");
				mostrarMenu();
				// testarTexto(rl, mostrarMenu);
				break;
			case "5":
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
