/* ----------------------------------------------------------------------------
 * File:     corrigir.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { guardarPalavra } = require("../gestor/gestorPalavras");

const { rl } = require("../utils/readline");
const { log, warn, error, todo } = require("../utils/utils");

/**
 * @brief Inicia o ciclo de correção e eventual atualização do ficheiro JSON.
 * @param {string} palavra Palavra em estudo.
 * @param {object} dados Objeto com os campos da palavra a corrigir.
 */
async function corrigirAdicionar(palavra, dados) {
	return new Promise((resolve) => {

		if (!dados) {
			error("Dados enviados estão vazios");
			return resolve();
		}

		let word = dados.palavra;
		let ipa = dados.ipa;
		let luso = dados.lusofonema;

		/* --------------------------------------------------------------------
		 * @brief Mostra o estado atual e inicia o ciclo de correção.
		 * ----------------------------------------------------------------- */
		function ciclo() {
			log("\n🛠️  Correção atual:");
			log(`→ Palavra: ${word}`);
			log(`→ IPA: ${ipa}`);
			log(`→ Lusofonema: ${luso}\n`);

			perguntarSeCorrigir();
		}

		/* --------------------------------------------------------------------
		 * @brief Pergunta se o utilizador quer corrigir e apresenta opções.
		 * ----------------------------------------------------------------- */
		function perguntarSeCorrigir() {
			rl.question("🔧 Queres corrigir este triplo? (s/n/q): ", (res) => {
				const r = res.trim().toLowerCase();

				if (r === "q") {
					warn("Saída forçada. Operação cancelada.");
					return resolve();
				}
				if (r === "s") {
					log("1 - Corrigir tudo");
					log("2 - Corrigir só o IPA e reaplicar regras");
					log("3 - Corrigir só o Lusofonema");
					log("0 - Cancelar correção");
					log("q - Cancelar e voltar ao menu inicial");

					rl.question("✏️  Escolhe uma opção: ", (modo) => {
						switch (modo.trim()) {
							case "1": editarTodosCampos(); break;
							case "2": editarIPA(); break;
							case "3": editarLusofonema(); break;
							case "0": ciclo(); break;
							case "q": 
								warn("Saída forçada. Operação cancelada.");
								return resolve();
							default:
								error("Opção inválida.\n");
								ciclo();
						}
					});
				}
				else if (r === "n") guardarJSONCorrigido();
				else {
					error("Carácter inválido.\n");
					perguntarSeCorrigir();
				}
			});
		}

		/* --------------------------------------------------------------------
		 * @brief Permite editar palavra, IPA e Lusofonema manualmente.
		 * ----------------------------------------------------------------- */
		function editarTodosCampos() {
			rl.question(`✏️  Palavra [${word}]: `, (inPalavra) => {
				if (inPalavra.trim().toLowerCase() === "q") {
					warn("Saída forçada. Operação cancelada.");
					return resolve();
				}
				word = inPalavra.trim().toLowerCase() || word;

				rl.question(`✏️  IPA [${ipa}]: `, (inIPA) => {
					if (inIPA.trim().toLowerCase() === "q") {
						warn("Saída forçada. Operação cancelada.");
						return resolve();
					}
					ipa = inIPA.trim() || ipa;

					rl.question(`✏️  Lusofonema [${luso}]: `, (inLuso) => {
						if (inLuso.trim().toLowerCase() === "q") {
							warn("Saída forçada. Operação cancelada.");
							return resolve();
						}
						luso = inLuso.trim() || luso;
						ciclo();
					});
				});
			});
		}

		/* --------------------------------------------------------------------
		 * @brief Permite editar apenas o IPA e reaplica o Lusofonema.
		 * ------------------------------------------------------------------ */
		function editarIPA() {
			rl.question(`✏️  Novo IPA [${ipa}]: `, (inIPA) => {
				if (inIPA.trim().toLowerCase() === "q") {
					warn("Saída forçada. Operação cancelada.");
					return resolve();
				}
				ipa = inIPA.trim() || ipa;
				todo("Chamar aplicarLusofonema");
				//luso = aplicarLusofonema(word, ipa);
				ciclo();
			});
		}

		/* --------------------------------------------------------------------
		 * @brief Permite editar apenas o campo Lusofonema.
		 * ----------------------------------------------------------------- */
		function editarLusofonema() {
			rl.question(`✏️  Novo Lusofonema [${luso}]: `, (inLuso) => {
				if (inLuso.trim().toLowerCase() === "q") {
					warn("Saída forçada. Operação cancelada.");
					return resolve();
				}
				dados.lusofonema = inLuso.trim() || luso;
				ciclo();
			});
		}

		/* --------------------------------------------------------------------
		 * @brief Pergunta se deve guardar e atualiza o ficheiro JSON.
		 * ----------------------------------------------------------------- */
		function guardarJSONCorrigido() {
			rl.question("💾 Guardar os dados corrigidos? (s/n/q): ", (res) => {
				const r = res.trim().toLowerCase();

				if (r === "q") {
					warn("Saída forçada. Operação cancelada.");
					return resolve();
				}

				if (r === "s") {
					dados.palavra = word;
					dados.ipa = ipa;
					dados.lusofonema = luso;

					guardarPalavra(palavra, dados);
					log("✅ Palavra corrigida e guardada com sucesso.");
					return resolve();
				}

				error("Dados não foram guardados.");
				resolve();
			});
		}

		// Início do ciclo
		ciclo();
	});
}

/**
 * @brief Permite corrigir qualquer campo de uma palavra no dicionário.
 * @param {string} palavra Palavra em estudo.
 * @param {object} dados Objeto completo da palavra (pode ter campos extra).
 */
async function corrigirDicionario(palavra, dados) {
	return new Promise((resolve) => {

		if (!dados) {
			error("Objeto de dados vazio.");
			return resolve();
		}

		const campos = Object.keys(dados);
		let index = 0;

		async function ciclo() {

			const continuar = await perguntarSeCorrigir();

			if (!continuar) return;

			log("\n🛠️  Correção de todos os campos: ('q' para sair)");

			if (index >= campos.length) {
				return perguntarGuardar();
			}

			const campo = campos[index];
			const valor = dados[campo];

			rl.question(`✏️  ${campo} [${valor}]: `, (input) => {
				if (input.trim().toLowerCase() === "q") {
					warn("Saída forçada. Operação cancelada.");
					return resolve();
				}

				if (input.trim() !== "") {
					dados[campo] = input.trim();
				}

				index++;
				ciclo();
			});
		}

		function perguntarGuardar() {
			rl.question("💾 Guardar alterações no ficheiro? (s/n/q): ", (res) => {

				const r = res.trim().toLowerCase();

				if (r === "q") {
					warn("Saída forçada. Operação cancelada.");
					return resolve();
				}
				else if (r === "s") {
					guardarPalavra(palavra, dados);
					log("✅ Dados corrigidos e guardados.");
				}
				else if (r === "n") {
					log("Alterações descartadas.");
					return resolve();
				}
				
				warn("Caracter Inválido!");
				perguntarGuardar();
			});
		}

		/* --------------------------------------------------------------------
		 * @brief Pergunta se o utilizador quer corrigir e apresenta opções.
		 * ----------------------------------------------------------------- */
		function perguntarSeCorrigir() {
			rl.question("🔧 Queres corrigir esta definição? (s/n/q): ", (res) => {

				const r = res.trim().toLowerCase();

				if (r === "q") {
					warn("Saída forçada. Operação cancelada.");
					return resolve();
				}
				if (r === "s") {
					// Não fazer nada, continuar execução
				}
				else if (r === "n") return resolve();
				else {
					error("Carácter inválido.\n");
					perguntarSeCorrigir();
				}
			});
		}

		ciclo();
	});
}


module.exports = { corrigirAdicionar, corrigirDicionario };
