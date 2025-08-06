/* ----------------------------------------------------------------------------
 * File:     menus/testarTexto.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");
const path = require("path");
const { DOMParser } = require("@xmldom/xmldom");
const xpath = require("xpath");
const { execSync } = require("child_process");

const { corrigirIPA } = require("../analise/ipa");
const { aplicarLusofonema } = require("../analise/regras");

const { log, warn } = require("../utils/utils");


let obraAtual = null;
let tokensAtuais = [];
let posicaoAtual = 0;

/**
 * @brief Função principal que mostra e transcreve texto de uma obra.
 * @param {readline.Interface} rl Interface readline para CLI.
 * @param {Function} callback Função a executar no final.
 * @param {boolean} continuarUsarMesmaObra Se deve continuar a mesma obra.
 */
function testarTexto(rl, callback, continuarUsarMesmaObra = false) {
	if (!continuarUsarMesmaObra || !obraAtual) {
		if (!prepararNovaObra()) {
			warn("Nenhuma obra encontrada na pasta corpus/");
			return callback();
		}
	}

	const tokens = extrairProximaFatiaDeTokens();
	if (tokens.length === 0) {
		log("🏁 Fim do texto da obra.");
		return callback();
	}

	log("\n📝 Texto original (50 palavras):\n");
	log(tokens.join("") + "\n");

	rl.question("🔤 Mostrar transcrição fonética (IPA)? (s/n) ", (resposta) => {
		const mostrarIPA = resposta.trim().toLowerCase() === "s";
		const dicionario = carregarDicionario();

		const [ipaArr, luzArr] = transcreverTexto(tokens, dicionario);

		if (mostrarIPA) {
			log("🔈 Transcrição fonética (IPA):\n");
			log(ipaArr.join("") + "\n");
		}

		log("🔊 Versão em Luzofonema:\n");
		log(luzArr.join("") + "\n");

		log("📋 Menu:");
		log("1 - Traduzir mais texto da mesma obra");
		log("2 - Traduzir texto de outra obra");
		log("0 - Voltar ao menu principal");

		rl.question("👉 Escolha uma opção : ", (opcao) => {
			if (opcao === "1") return testarTexto(rl, callback, true);
			if (opcao === "2") return testarTexto(rl, callback, false);

			log("");
			return callback();
		});
	});
}

/** @brief Reinicia os dados da obra atual com uma nova obra aleatória. */
function prepararNovaObra() {

	const caminho = escolherObraAleatoria();
	if (!caminho) return null;

	obraAtual = caminho;
	const xmlRaw = fs.readFileSync(caminho, "utf8");
	tokensAtuais = extrairPrimeirosTokens(xmlRaw, 1000); // extrair muito texto
	posicaoAtual = 0;
	return caminho;
}

/**
 * @brief Extrai N palavras (não tokens) do texto atual.
 * @param {number} quantidade Quantidade de palavras a extrair.
 * @returns {string[]} Array de tokens a mostrar.
 */
function extrairProximaFatiaDeTokens(quantidade = 50) {

	const resultado = [];
	let contador = 0;

	while (posicaoAtual < tokensAtuais.length && contador < quantidade) {
		const token = tokensAtuais[posicaoAtual++];
		if (/^\p{L}+$/u.test(token) || /^\d+$/u.test(token)) contador++;
		resultado.push(token);
	}
	return resultado;
}

/**
 * @brief Seleciona aleatoriamente uma obra da pasta corpus.
 * @returns {string|null} Caminho do ficheiro XML ou null.
 */
function escolherObraAleatoria() {

	const corpusDir = path.join(__dirname, "..", "corpus");
	const obras = fs.readdirSync(corpusDir).filter(f => f.endsWith(".xml"));

	if (obras.length === 0) return null;
	const obra = obras[Math.floor(Math.random() * obras.length)];

	log(`📖 Obra escolhida: ${obra}`);
	return path.join(corpusDir, obra);
}

/**
 * @brief Extrai as primeiras 50 palavras (tokens) do corpo da obra.
 * @param {string} xmlRaw Conteúdo XML como string.
 * @returns {string[]} Lista de tokens.
 */
function extrairPrimeirosTokens(xmlRaw) {

	const doc = new DOMParser().parseFromString(xmlRaw, "text/xml");
	const select = xpath.useNamespaces({ "tei": "http://www.tei-c.org/ns/1.0" });

	const parags = select("//tei:body//tei:p", doc);
	const texto = parags.map(p => p.textContent).join(" ");

	const tokens = texto.match(/[\p{L}-]+|[.,!?;:()"'«»…—–-]+|\s+/gu) || [];

	const resultado = [];
	let contador = 0;

	for (const token of tokens) {
		if (contador >= 50) break;
		if (/^\p{L}+$/u.test(token) || /^\d+$/u.test(token)) contador++;
		resultado.push(token);
	}

	return resultado;
}

/**
 * @brief Constrói um dicionário a partir do ficheiro .tsv.
 * @returns {Object} Dicionário palavra → luzofonema.
 */
function carregarDicionario() {

	const ficheiro = "dicionario.tsv";
	if (!fs.existsSync(ficheiro)) return {};

	const linhas = fs.readFileSync(ficheiro, "utf8").split("\n").filter(Boolean);
	return Object.fromEntries(
		linhas.map(l => {
			const [pal, , luz] = l.split("\t");
			return [pal, luz];
		})
	);
}

/**
 * @brief Gera a transcrição IPA e luzofonema de uma palavra.
 * @param {string} palavraOriginal Palavra com capitalização.
 * @param {Object} dicionario Mapa palavra → luzofonema.
 * @returns {[string, string]} Par [ipa, luzofonema].
 */
function transcreverPalavra(palavraOriginal, dicionario) {

	const minuscula = palavraOriginal.toLowerCase();
	let ipa = "?";
	let luz = "?";

	try {
		ipa = execSync(
			`espeak-ng -v pt --ipa=3 -q "${palavraOriginal}" 2>/dev/null`
		).toString().trim();
	} catch {}

	if (dicionario[minuscula]) {
		try {
			ipa = corrigirIPA(ipa);
			luz = "*" + dicionario[minuscula];
		} catch {}
	}
	else {
		try {
			ipa = corrigirIPA(palavraOriginal, ipa);
			luz = aplicarLusofonema(palavraOriginal, ipa);
		} catch {}
	}

	// Capitalizar se a palavra original for capitalizada
	if (/^[A-ZÁÉÍÓÚÂÊÔÀÃÕÇ]/.test(palavraOriginal)) {
		luz = luz.charAt(0).toUpperCase() + luz.slice(1);
	}

	return [ipa, luz];
}

/**
 * @brief Transcreve um array de tokens em IPA e luzofonema.
 * @param {string[]} tokens Lista de palavras e pontuação.
 * @param {Object} dicionario Mapa palavra → luzofonema.
 * @returns {[string[], string[]]} Par [ipa[], luzofonema[]].
 */
function transcreverTexto(tokens, dicionario) {
	const ipaArr = [];
	const luzArr = [];

	for (const token of tokens) {
		if (/^\p{L}/u.test(token)) {
			const [ipa, luz] = transcreverPalavra(token, dicionario);
			ipaArr.push(ipa);
			luzArr.push(luz);
		} else {
			ipaArr.push(token);
			luzArr.push(token);
		}
	}

	return [ipaArr, luzArr];
}


// function testarTexto(rl, callback) {

// 	const corpusDir = path.join(__dirname, "..", "corpus");
// 	const obras = fs.readdirSync(corpusDir).filter(f => f.endsWith(".xml"));

// 	if (obras.length === 0) {
// 		warn("Nenhuma obra encontrada na pasta corpus/");
// 		return callback();
// 	}

// 	const obra = obras[Math.floor(Math.random() * obras.length)];
// 	log(`📖 Obra escolhida: ${obra}`);

// 	const xmlRaw = fs.readFileSync(path.join(corpusDir, obra), "utf8");

// 	// Definir namespace TEI e preparar XPath
// 	const doc = new DOMParser().parseFromString(xmlRaw, "text/xml");
// 	const select = xpath.useNamespaces({ "tei": "http://www.tei-c.org/ns/1.0" });

// 	// Extrair todos os textos dos parágrafos <p> dentro de <body>
// 	const parags = select("//tei:body//tei:p", doc);
// 	const textoSemTags = parags.map(p => p.textContent).join(" ");

// 	// Extrair palavras com capitalização preservada
// 	// Separar texto em tokens: palavras, pontuação, espaços
// 	const tokens = textoSemTags.match(/[\p{L}-]+|[.,!?;:()"'«»…—–-]+|\s+/gu) || [];

// 	const primeiras50 = [];
// 	let palavraCount = 0;
// 	for (const token of tokens) {
// 		if (palavraCount >= 50) break;
// 		if (/^\p{L}+$/u.test(token) || /^\d+$/u.test(token)) palavraCount++;
// 		primeiras50.push(token);
// 	}

// 	log("\n📝 Texto original (50 primeiras palavras):\n");
// 	log(primeiras50.join("") + "\n");

// 	// Perguntar se deve mostrar transcrição
// 	rl.question("🔤 Mostrar transcrição fonética (IPA)? (s/n) ", (resposta) => {
// 		const mostrarIPA = resposta.trim().toLowerCase() === "s";

// 		// Carregar dicionário
// 		const ficheiro = "dicionario.tsv";
// 		const conteudo = fs.existsSync(ficheiro) ? fs.readFileSync(ficheiro, "utf8") : "";
// 		const linhas = conteudo.split("\n").filter(Boolean);
// 		const dicionario = Object.fromEntries(linhas.map(l => {
// 			const [pal, , luz] = l.split("\t");
// 			return [pal, luz];
// 		}));

// 		// Preparar arrays de IPA e luzofonema
// 		const transcricoesIPA = [];
// 		const luzofonemas = [];

// 		for (const token of primeiras50) {
// 			if (/^\p{L}/u.test(token)) {
// 				const palavraOriginal = token;
// 				const minuscula = palavraOriginal.toLowerCase();
// 				let ipa = "?";
// 				let luz = "?";

// 				if (dicionario[minuscula]) {
// 					try {
// 						ipa = execSync(`espeak-ng -v pt --ipa=3 -q "${palavraOriginal}" 2>/dev/null`).toString().trim();
// 						ipa = corrigirIPA(ipa);
// 						luz = "*" + dicionario[minuscula];
// 					} catch {}
// 				} else {
// 					try {
// 						ipa = execSync(`espeak-ng -v pt --ipa=3 -q "${palavraOriginal}" 2>/dev/null`).toString().trim();
// 						ipa = corrigirIPA(palavraOriginal, ipa);
// 						luz = aplicarLusofonema(palavraOriginal, ipa);
// 					} catch {}
// 				}

// 				if (/^[A-ZÁÉÍÓÚÂÊÔÀÃÕÇ]/.test(palavraOriginal)) {
// 					luz = luz.charAt(0).toUpperCase() + luz.slice(1);
// 				}

// 				transcricoesIPA.push(ipa);
// 				luzofonemas.push(luz);
// 			} else {
// 				// Manter pontuação ou espaço tal como está
// 				transcricoesIPA.push(token);
// 				luzofonemas.push(token);
// 			}
// 		}

// 		if (mostrarIPA) {
// 			log("🔈 Transcrição fonética (IPA):\n");
// 			log(transcricoesIPA.join("") + "\n");
// 		}

// 		log("🔊 Versão em Luzofonema:\n");
// 		log(luzofonemas.join("") + "\n");

// 		// Menu
// 		log("📋 Menu:");
// 		log("1 - Traduzir mais texto da mesma obra");
// 		log("2 - Traduzir texto de outra obra");
// 		log("0 - Voltar ao menu principal");

// 		rl.question("👉 Escolha uma opção : ", (opcao) => {
// 			if (opcao === "1") return testarTexto(rl, callback);
// 			if (opcao === "2") return testarTexto(rl, callback);

// 			log("");
// 			return callback();
// 		});
// 	});
// }


module.exports = { testarTexto };
