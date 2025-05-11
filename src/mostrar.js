/* ----------------------------------------------------------------------------
 * File:     mostrar.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");
const { execSync } = require("child_process");
const { corrigirIPA } = require("./ipa");
const { aplicarLuzofonema } = require("./regras");
const { corrigirAdicionar } = require("./corrigir");

function mostrarPalavra(rl, callback) {
	rl.question("🔍 Palavra: ", (input) => {

		// Convertendo a palavra para minúsculas
		const palavra = input.trim().toLowerCase();

		if (!palavra) {
			console.log("⚠️  Palavra vazia.\n");
			return callback();
		}

		const ficheiro = "dicionario.tsv";
		const conteudo = fs.existsSync(ficheiro) ? fs.readFileSync(ficheiro, "utf8") : "";
		const linhas = conteudo.split("\n").filter(Boolean);
		const entrada = linhas.find(l => l.startsWith(`${palavra}\t`));

		if (entrada) {
			const [pal, ipa, luzofonema] = entrada.split("\t");
			console.log(`📚 Entrada encontrada:\n🔤 ${pal} → ${ipa} → ${luzofonema}\n`);
			return callback();
		}

		// Se não existir, sugerir e perguntar se quer adicionar
		try {
			let ipa = execSync(`espeak-ng -v pt --ipa=3 -q "${palavra}" 2>/dev/null`).toString().trim();
			ipa = corrigirIPA(palavra, ipa);
			const luzofonema = aplicarLuzofonema(palavra, ipa);

			console.log(`❓ Palavra não encontrada no dicionário.`);
			console.log(`🔤 Sugerido: ${palavra} → ${ipa} → ${luzofonema}`);

			corrigirAdicionar(rl, callback, palavra, ipa, luzofonema);

		} catch (error) {
			console.error(`❌ Erro ao processar "${palavra}":`, error.message);
			callback();
		}
	});
}

module.exports = { mostrarPalavra };
