/* ----------------------------------------------------------------------------
 * File:     lusofonema.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { mostrarAlfabeto, mostrarSons } = require("./menus/alfabeto");
const { mostrarResumoDicionario } = require("./menus/dicionario");
const { mostrarPalavra } = require("./menus/mostrar");
const { procurarPalavra } = require("./menus/procurar");
// const { testarTexto } = require("./menu/testarTexto");

const { rl, perguntar } = require("./utils/readline");
const { mostrarDebug, mudarDebug, log, todo, clear } = require("./utils/utils");

clear();
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
async function mostrarMenu() {
	const opcao = await perguntar(`
Menu:
1 - Ver alfabeto
2 - Ver sons
3 - Ver dicionário
4 - Mostrar palavra
5 - Procurar palavra
6 - Testar Texto
7 - Ativar/Desativar o debug: (${mostrarDebug() ? "on" : "off"})
0 - Sair
: `);

	switch (opcao.trim()) {
		case "1":
			mostrarAlfabeto();
			mostrarMenu();
			break;
		case "2":
			mostrarSons();
			mostrarMenu();
			break;
		case "3":
			mostrarResumoDicionario();
			mostrarMenu();
			break;

		case "4":
			clear();
			input = await perguntar(
				"🔍 Palavra a mostrar ('0' para voltar): ");
			await mostrarPalavra(mostrarMenu, input);		
			break;

		case "5":
			clear();
			input = await perguntar(
				"🔍 Palavra a procurar ('Enter' para aleatória, '0' para voltar): ");
			await procurarPalavra(mostrarMenu, input);
			break;

		case "6":
			todo("testarTexto");
			// testarTexto(mostrarMenu);
			mostrarMenu();
			break;
		case "7":
			clear();
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
	};
}

mostrarMenu();
