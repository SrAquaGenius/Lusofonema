/* ----------------------------------------------------------------------------
 * File:     verificar.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { corrigirIPA } = require("./ipa");
const { aplicarLuzofonema } = require("./regras");
const { corrigirAdicionar } = require("./corrigir");

function obterPalavraAleatoriaDeCorpus() {
	const pasta = "./corpus";
	const ficheiros = fs.readdirSync(pasta).filter(f => f.endsWith(".xml"));

	if (ficheiros.length === 0) {
		console.warn("⚠️ Nenhum ficheiro XML encontrado na pasta ./corpus");
		return null;
	}

	// Escolher ficheiro aleatoriamente
	const ficheiroAleatorio = ficheiros[Math.floor(Math.random() * ficheiros.length)];
	const caminho = path.join(pasta, ficheiroAleatorio);
	const conteudoXML = fs.readFileSync(caminho, "utf8");

	// Remover tags XML e pontuação, obter palavras
	const textoLimpo = conteudoXML
		.replace(/<[^>]+>/g, " ")     // remover tags
		.replace(/[^\p{L}\s]/gu, " ") // remover pontuação, manter letras Unicode
		.replace(/\s+/g, " ");        // normalizar espaços

	const palavras = textoLimpo
		.toLowerCase()
		.split(" ")
		.map(p => p.trim())
		.filter(p => p.length >= 3);

	if (palavras.length === 0) {
		console.warn(`⚠️ Nenhuma palavra adequada encontrada em ${ficheiroAleatorio}`);
		return null;
	}

	// Escolher palavra aleatória
	return palavras[Math.floor(Math.random() * palavras.length)];
}

function palavraJaNoDicionario(palavra) {
	const ficheiro = "dicionario.tsv";
	const conteudo = fs.existsSync(ficheiro) ? fs.readFileSync(ficheiro, "utf8") : "";
	const linhas = conteudo.split("\n").filter(Boolean);
	return linhas.some(linha => linha.startsWith(`${palavra}\t`));
}

function verificarPalavra(rl, callback) {
	rl.question("✍  Palavra a validar (Enter para aleatória): ", (input) => {
		let palavraOriginal = input.trim().toLowerCase();

		if (!palavraOriginal) {
			// Obter uma palavra aleatória, garantindo que não está no dicionário
			do {
				palavraOriginal = obterPalavraAleatoriaDeCorpus();
			} while (palavraOriginal && palavraJaNoDicionario(palavraOriginal));

			if (!palavraOriginal) {
				console.log("❌ Falha ao obter palavra aleatória ou todas as palavras já estão no dicionário.\n");
				return callback();
			}

			console.log(`🎲 Palavra aleatória: ${palavraOriginal}`);
		}

		try {
			let ipa = execSync(`espeak-ng -v pt --ipa=3 -q "${palavraOriginal}" 2>/dev/null`).toString().trim();
			ipa = corrigirIPA(ipa);
			let luzofonema = aplicarLuzofonema(palavraOriginal, ipa);

			console.log(`🔤 ${palavraOriginal} → ${ipa} → ${luzofonema}\n`);

			corrigirAdicionar(rl, callback, palavraOriginal, ipa, luzofonema);
			
		} catch (error) {
			console.error(`❌ Erro ao processar "${palavraOriginal}":`, error.message);
			callback();
		}
	});
}

module.exports = { verificarPalavra };
