/* ----------------------------------------------------------------------------
 * File:     corrigir.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");
const { aplicarLuzofonema } = require("./regras");

function corrigirAdicionar(rl, callback, palavraOriginal, ipaOriginal, luzofonemaOriginal) {
	function cicloCorrecao(palavraAtual, ipaAtual, luzofonemaAtual) {
		rl.question("🔧 Queres corrigir este triplo? (s/n/q): ", (resposta) => {
			const r = resposta.trim().toLowerCase();
			if (r === "q") {
				console.log("🚪 Saída forçada. A operação foi cancelada.\n");
				callback();
				return;
			}

			if (r === "s") {
				console.log("1 - Corrigir tudo");
				console.log("2 - Corrigir só o IPA e reaplicar regras");
				console.log("0 - Cancelar correção");
				console.log("q - Cancelar e voltar ao menu inicial");
				rl.question("✏️  Escolhe uma opção: ", (modo) => {
					switch (modo.trim()) {
						case "1":
							rl.question(`✏️  Palavra [${palavraAtual}]: `, (novaPalavra) => {
								if (novaPalavra.trim().toLowerCase() === "q") {
									console.log("🚪 Saída forçada. A operação foi cancelada.\n");
									callback();
									return;
								}
								const nova = novaPalavra.trim().toLowerCase() || palavraAtual;

								rl.question(`✏️  IPA [${ipaAtual}]: `, (novoIPA) => {
									if (novoIPA.trim().toLowerCase() === "q") {
										console.log("🚪 Saída forçada. A operação foi cancelada.\n");
										callback();
										return;
									}
									const novo = novoIPA.trim() || ipaAtual;

									rl.question(`✏️  Luzofonema [${luzofonemaAtual}]: `, (novoLuzofonema) => {
										if (novoLuzofonema.trim().toLowerCase() === "q") {
											console.log("🚪 Saída forçada. A operação foi cancelada.\n");
											callback();
											return;
										}
										const novoLuz = novoLuzofonema.trim() || luzofonemaAtual;
										cicloCorrecao(nova, novo, novoLuz);
									});
								});
							});
							break;

						case "2":
							rl.question(`✏️  Novo IPA [${ipaAtual}]: `, (novoIPA) => {
								if (novoIPA.trim().toLowerCase() === "q") {
									console.log("🚪 Saída forçada. A operação foi cancelada.\n");
									callback();
									return;
								}
								const novo = novoIPA.trim() || ipaAtual;
								const novoLuz = aplicarLuzofonema(palavraAtual, novo);
								console.log(`🔁 Novo Luzofonema gerado: ${novoLuz}`);
								cicloCorrecao(palavraAtual, novo, novoLuz);
							});
							break;

						case "q":
							console.log("🚪 Saída forçada. A operação foi cancelada.\n");
							callback();
							break;

						default:
							console.log("❌ Cancelado.\n");
							cicloCorrecao(palavraAtual, ipaAtual, luzofonemaAtual);
							break;
					}
				});
			} else {
				// Apenas se não quiser corrigir (e não sair) é que avança para guardar
				guardarEntrada(rl, callback, palavraAtual, ipaAtual, luzofonemaAtual);
			}
		});
	}

	cicloCorrecao(palavraOriginal, ipaOriginal, luzofonemaOriginal);
}

function guardarEntrada(rl, callback, palavra, ipa, luzofonema) {
	const linhaNova = `${palavra}\t${ipa}\t${luzofonema}`;
	const ficheiro = "dicionario.tsv";
	let conteudo = fs.existsSync(ficheiro) ? fs.readFileSync(ficheiro, "utf8") : "";
	const linhas = conteudo.split("\n").filter(Boolean);
	const indiceExistente = linhas.findIndex(l => l.startsWith(`${palavra}\t`));

	if (indiceExistente === -1) {
		rl.question("💾 Adicionar ao dicionário? (s/n/q): ", (respostaAdicionar) => {
			const r = respostaAdicionar.trim().toLowerCase();
			if (r === "q") {
				console.log("🚪 Saída forçada. A operação foi cancelada.\n");
				callback();
			} else if (r === "s") {
				fs.appendFileSync(ficheiro, linhaNova + "\n", "utf8");
				console.log("✅ Adicionado ao dicionário.\n");
				callback();
			} else {
				console.log("❌ Não foi adicionado.\n");
				callback();
			}
		});
	} else {
		console.log(`📚 Palavra já existe:\n→ ${linhas[indiceExistente]}`);
		rl.question("✏️  Queres substituir esta entrada? (s/n/q): ", (respostaSubstituir) => {
			const r = respostaSubstituir.trim().toLowerCase();
			if (r === "q") {
				console.log("🚪 Saída forçada. A operação foi cancelada.\n");
				callback();
			} else if (r === "s") {
				linhas[indiceExistente] = linhaNova;
				fs.writeFileSync(ficheiro, linhas.join("\n") + "\n", "utf8");
				console.log("✅ Entrada atualizada.\n");
				callback();
			} else {
				console.log("❌ Entrada mantida.\n");
				callback();
			}
		});
	}
}

module.exports = { corrigirAdicionar };
