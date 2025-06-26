/* ----------------------------------------------------------------------------
 * File:     corrigir.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { guardarPalavra } = require("./gestorPalavras");
const { aplicarLusofonema } = require("./regras");
const { log, warn, error } = require("./debug");


/**
 * @brief Inicia o ciclo de correção e eventual atualização do ficheiro JSON.
 * @param {readline.Interface} rl Interface readline CLI.
 * @param {Function}  Função chamada no fim do processo.
 * @param {object} dados Objeto com os campos da palavra a corrigir.
 */
async function corrigirAdicionar(rl, dados) {
	return new Promise((resolve) => {

		if (!dados) {
			error("Dados enviados estão vazios");
			return resolve();
		}

		let palavra = dados.palavra;
		let ipa = dados.ipa;
		let luso = dados.lusofonema;

		function ciclo() {
			log("\n🛠️  Correção atual:");
			log(`→ Palavra: ${palavra}`);
			log(`→ IPA: ${ipa}`);
			log(`→ Lusofonema: ${luso}\n`);

			perguntarSeCorrigir();
		}

		function perguntarSeCorrigir() {
			rl.question("🔧 Queres corrigir este triplo? (s/n/q): ", (res) => {

				const r = res.trim().toLowerCase();

				if (r === "q") {
					warn("Saída forçada. A operação foi cancelada.\n");
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
								warn("Saída forçada. A operação foi cancelada.\n");
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

		function editarTodosCampos() {
			rl.question(`✏️  Palavra [${palavra}]: `, (inPalavra) => {
				if (inPalavra.trim().toLowerCase() === "q") {
					warn("Saída forçada. A operação foi cancelada.\n");
					return resolve();
				}
				palavra = inPalavra.trim().toLowerCase() || palavra;

				rl.question(`✏️  IPA [${ipa}]: `, (inIPA) => {
					if (inIPA.trim().toLowerCase() === "q") {
						warn("Saída forçada. A operação foi cancelada.\n");
						return resolve();
					}
					ipa = inIPA.trim() || ipa;

					rl.question(`✏️  Lusofonema [${luso}]: `, (inLuso) => {
						if (inLuso.trim().toLowerCase() === "q") {
							warn("Saída forçada. A operação foi cancelada.\n");
							return resolve();
						}
						luso = inLuso.trim() || luso;
						ciclo();
					});
				});
			});
		}

		function editarIPA() {
			rl.question(`✏️  Novo IPA [${ipa}]: `, (inIPA) => {
				if (inIPA.trim().toLowerCase() === "q") {
					warn("Saída forçada. A operação foi cancelada.\n");
					return resolve();
				}
				ipa = inIPA.trim() || ipa;
				luso = aplicarLusofonema(palavra, ipa);
				ciclo();
			});
		}

		function editarLusofonema() {
			rl.question(`✏️  Novo Lusofonema [${luso}]: `, (inLuso) => {
				if (inLuso.trim().toLowerCase() === "q") {
					warn("Saída forçada. A operação foi cancelada.\n");
					return resolve();
				}
				luso = inLuso.trim() || luso;
				ciclo();
			});
		}

		function guardarJSONCorrigido() {
			const dados = { palavra, ipa, lusofonema: luso };
			rl.question("💾 Guardar os dados corrigidos? (s/n/q): ", (res) => {
				const r = res.trim().toLowerCase();
				if (r === "q") {
					warn("Saída forçada. A operação foi cancelada.\n");
					return resolve();
				}
				if (r === "s") {
					guardarPalavra(dados);
					log("✅ Palavra corrigida e guardada com sucesso.\n");
					return resolve();
				}
				error("Dados não foram guardados.\n");
				resolve();
			});
		}

		ciclo();
	});
}


module.exports = { corrigirAdicionar };
