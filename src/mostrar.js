/* ----------------------------------------------------------------------------
 * File:     mostrar.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");
const path = require("path");
const { DOMParser } = require("@xmldom/xmldom");
const xpath = require("xpath");
const { execSync } = require("child_process");
const { corrigirIPA } = require("./ipa");
const { aplicarLuzofonema } = require("./regras");
const { corrigirAdicionar } = require("./corrigir");

const { lerPalavra } = require("./gestorPalavras");
const { pesquisarPalavra } = require("./pesquisar");

/**
 * @brief Mostra a transcrição fonética e luzofonema de uma palavra.
 *        Primeiro tenta carregar a palavra a partir do ficheiro JSON.
 *        Se não encontrar, gera automaticamente a entrada via espeak-ng
 *        e sugere a adição ao dicionário.
 *
 * @param {readline.Interface} rl Interface readline para interação CLI.
 * @param {Function} callback Função a invocar no fim do processo.
 */
function mostrarPalavra(rl, callback) {
	rl.question("🔍 Palavra: ", (input) => {

		// Converte a palavra para minúsculas
		const palavra = input.trim().toLowerCase();

		if (!palavra) {
			console.log("⚠️  Palavra vazia.\n");
			return callback();
		}

		// Tenta ler do ficheiro JSON com definição da palavra
		const entrada = lerPalavra(palavra);

		if (entrada) {
			console.log(`📚 Entrada encontrada:\n🔤 ${entrada.palavra} → ${entrada.ipa} → ${entrada.luzofonema}\n`);
			return callback();
		}

		// Se não existir, pesquisar pela palavra
		const resultado = pesquisarPalavra(palavra);

		if (!resultado) {
			console.log("⚠️ Erro ao obter informação da palavra.\n");
			return callback();
		}

		console.log(`📚 Entrada sugerida: ${resultado.palavra} → ${resultado.ipa} → ${resultado.luzofonema}`);

		corrigirAdicionar(rl, callback, resultado.palavra, resultado.ipa,
						  resultado.luzofonema);
	});
}




function mostrarTexto(rl, callback) {
	const corpusDir = path.join(__dirname, "..", "corpus");
	const obras = fs.readdirSync(corpusDir).filter(f => f.endsWith(".xml"));

	if (obras.length === 0) {
		console.log("⚠️  Nenhuma obra encontrada na pasta corpus/");
		return callback();
	}

	const obra = obras[Math.floor(Math.random() * obras.length)];
	console.log(`📖 Obra escolhida: ${obra}`);

	const xmlRaw = fs.readFileSync(path.join(corpusDir, obra), "utf8");

	// Definir namespace TEI e preparar XPath
	const doc = new DOMParser().parseFromString(xmlRaw, "text/xml");
	const select = xpath.useNamespaces({ "tei": "http://www.tei-c.org/ns/1.0" });

	// Extrair todos os textos dos parágrafos <p> dentro de <body>
	const parags = select("//tei:body//tei:p", doc);
	const textoSemTags = parags.map(p => p.textContent).join(" ");

	// Extrair palavras com capitalização preservada
	// Separar texto em tokens: palavras, pontuação, espaços
	const tokens = textoSemTags.match(/[\p{L}-]+|[.,!?;:()"'«»…—–-]+|\s+/gu) || [];

	const primeiras50 = [];
	let palavraCount = 0;
	for (const token of tokens) {
		if (palavraCount >= 50) break;
		if (/^\p{L}+$/u.test(token) || /^\d+$/u.test(token)) palavraCount++;
		primeiras50.push(token);
	}

	console.log("\n📝 Texto original (50 primeiras palavras):\n");
	console.log(primeiras50.join("") + "\n");

	// Perguntar se deve mostrar transcrição
	rl.question("🔤 Mostrar transcrição fonética (IPA)? (s/n) ", (resposta) => {
		const mostrarIPA = resposta.trim().toLowerCase() === "s";

		// Carregar dicionário
		const ficheiro = "dicionario.tsv";
		const conteudo = fs.existsSync(ficheiro) ? fs.readFileSync(ficheiro, "utf8") : "";
		const linhas = conteudo.split("\n").filter(Boolean);
		const dicionario = Object.fromEntries(linhas.map(l => {
			const [pal, , luz] = l.split("\t");
			return [pal, luz];
		}));

		// Preparar arrays de IPA e luzofonema
		const transcricoesIPA = [];
		const luzofonemas = [];

		for (const token of primeiras50) {
			if (/^\p{L}/u.test(token)) {
				const palavraOriginal = token;
				const minuscula = palavraOriginal.toLowerCase();
				let ipa = "?";
				let luz = "?";

				if (dicionario[minuscula]) {
					try {
						ipa = execSync(`espeak-ng -v pt --ipa=3 -q "${palavraOriginal}" 2>/dev/null`).toString().trim();
						ipa = corrigirIPA(ipa);
						luz = "*" + dicionario[minuscula];
					} catch {}
				} else {
					try {
						ipa = execSync(`espeak-ng -v pt --ipa=3 -q "${palavraOriginal}" 2>/dev/null`).toString().trim();
						ipa = corrigirIPA(palavraOriginal, ipa);
						luz = aplicarLuzofonema(palavraOriginal, ipa);
					} catch {}
				}

				if (/^[A-ZÁÉÍÓÚÂÊÔÀÃÕÇ]/.test(palavraOriginal)) {
					luz = luz.charAt(0).toUpperCase() + luz.slice(1);
				}

				transcricoesIPA.push(ipa);
				luzofonemas.push(luz);
			} else {
				// Manter pontuação ou espaço tal como está
				transcricoesIPA.push(token);
				luzofonemas.push(token);
			}
		}

		if (mostrarIPA) {
			console.log("🔈 Transcrição fonética (IPA):\n");
			console.log(transcricoesIPA.join("") + "\n");
		}

		console.log("🔊 Versão em Luzofonema:\n");
		console.log(luzofonemas.join("") + "\n");

		// Menu
		console.log("📋 Menu:");
		console.log("1 - Traduzir mais texto da mesma obra");
		console.log("2 - Traduzir texto de outra obra");
		console.log("0 - Voltar ao menu principal");

		rl.question("👉 Escolha uma opção : ", (opcao) => {
			if (opcao === "1") return mostrarTexto(rl, callback);
			if (opcao === "2") return mostrarTexto(rl, callback);
			return callback();
		});
	});
}

module.exports = { mostrarPalavra, mostrarTexto };
