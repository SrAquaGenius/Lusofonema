/* ----------------------------------------------------------------------------
 * File:     corrigir.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");

function corrigirAdicionar(rl, callback, palavraOriginal, ipa, luzofonema) {

	rl.question("🔧 Queres corrigir este triplo? (s/n): ", (resposta) => {
		if (resposta.trim().toLowerCase() === "s") {
			// Permitir correção manual
			rl.question(`✏️  Palavra [${palavraOriginal}]: `, (novaPalavra) => {
				const palavra = novaPalavra.trim().toLowerCase() || palavraOriginal;

				rl.question(`✏️  IPA [${ipa}]: `, (novoIPA) => {
					ipa = novoIPA.trim() || ipa;

					rl.question(`✏️  Luzofonema [${luzofonema}]: `, (novoLuzofonema) => {
						luzofonema = novoLuzofonema.trim() || luzofonema;

						const linhaNova = `${palavra}\t${ipa}\t${luzofonema}`;
						const ficheiro = "dicionario.tsv";
						let conteudo = fs.existsSync(ficheiro) ? fs.readFileSync(ficheiro, "utf8") : "";

						const linhas = conteudo.split("\n").filter(Boolean);
						const indiceExistente = linhas.findIndex(l => l.startsWith(`${palavra}\t`));

						if (indiceExistente === -1) {
							rl.question("💾 Adicionar ao dicionário? (s/n): ", (respostaAdicionar) => {
								if (respostaAdicionar.trim().toLowerCase() === "s") {
									fs.appendFileSync(ficheiro, linhaNova + "\n", "utf8");
									console.log("✅ Adicionado ao dicionário.\n");
								} else {
									console.log("❌ Não foi adicionado.\n");
								}
								callback();
							});
						} else {
							console.log(`📚 Palavra já existe:\n→ ${linhas[indiceExistente]}`);
							rl.question("✏️  Queres substituir esta entrada? (s/n): ", (respostaSubstituir) => {
								if (respostaSubstituir.trim().toLowerCase() === "s") {
									linhas[indiceExistente] = linhaNova;
									fs.writeFileSync(ficheiro, linhas.join("\n") + "\n", "utf8");
									console.log("✅ Entrada atualizada.\n");
								} else {
									console.log("❌ Entrada mantida.\n");
								}
								callback();
							});
						}
					});
				});
			});
		} else {
			// Caso não queira corrigir, perguntar se quer adicionar
			const linhaNova = `${palavraOriginal}\t${ipa}\t${luzofonema}`;
			const ficheiro = "dicionario.tsv";
			let conteudo = fs.existsSync(ficheiro) ? fs.readFileSync(ficheiro, "utf8") : "";

			const linhas = conteudo.split("\n").filter(Boolean);
			const indiceExistente = linhas.findIndex(l => l.startsWith(`${palavraOriginal}\t`));

			if (indiceExistente === -1) {
				rl.question("💾 Adicionar ao dicionário? (s/n): ", (respostaAdicionar) => {
					if (respostaAdicionar.trim().toLowerCase() === "s") {
						fs.appendFileSync(ficheiro, linhaNova + "\n", "utf8");
						console.log("✅ Adicionado ao dicionário.\n");
					} else {
						console.log("❌ Não foi adicionado.\n");
					}
					callback();
				});
			} else {
				console.log(`📚 Palavra já existe:\n→ ${linhas[indiceExistente]}`);
				rl.question("✏️  Queres substituir esta entrada? (s/n): ", (respostaSubstituir) => {
					if (respostaSubstituir.trim().toLowerCase() === "s") {
						linhas[indiceExistente] = linhaNova;
						fs.writeFileSync(ficheiro, linhas.join("\n") + "\n", "utf8");
						console.log("✅ Entrada atualizada.\n");
					} else {
						console.log("❌ Entrada mantida.\n");
					}
					callback();
				});
			}
		}
	});
}

module.exports = { corrigirAdicionar };
