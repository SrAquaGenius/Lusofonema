/* ----------------------------------------------------------------------------
 * File:     mostrarPalavra.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const { corrigirAdicionar } = require("./corrigir");
const { pesquisarPalavra } = require("./pesquisar");

const { log, error } = require("./debug");


/**
 * @brief Mostra a transcrição fonética e luzofonema de uma palavra.
 *        Se a palavra estiver no dicionário, mostra a entrada.
 *        Se for nova, gera entrada com espeak-ng e sugere correção.
 *        Se input for vazio, escolhe palavra aleatória do corpus.
 *        Se for "0", retorna ao menu.
 * @param {readline.Interface} rl Interface readline.
 * @param {Function} callback Função de retorno.
 */
async function mostrarPalavra(rl, callback) {
	rl.question("🔍 Palavra ('Enter' para aleatória, '0' para voltar): ",
			async (input) => {

		let palavra = input.trim().toLowerCase();

		if (palavra === "0") {
			log("A voltar ao menu ...\n");
			return callback();
		}

		// Palavra aleatória se input estiver vazio
		if (!palavra) {
			palavra = obterPalavraAleatoriaDeCorpus();

			if (!palavra) {
				error("Não foi possível obter uma palavra aleatória.\n");
				return callback();
			}

			log(`🎲 Palavra aleatória: ${palavra}`);
		}

		await mostrarOuAdicionarPalavra(palavra, rl, callback);
	});
}

/**
 * @brief Mostra a entrada da palavra se já existir, ou sugere nova entrada.
 * @param {string} palavra Palavra a mostrar ou sugerir.
 * @param {readline.Interface} rl Interface readline.
 * @param {Function} callback Função de retorno.
 */
async function mostrarOuAdicionarPalavra(palavra, rl, callback) {

	const resultado = await pesquisarPalavra(palavra);

	if (!resultado) {
		error("Erro ao obter informação da palavra.\n");
		return callback();
	}

	if (resultado.fonte === "dicionario") {
		log(`📚 Entrada encontrada: ${resultado.palavra} → ${resultado.ipa} → ${resultado.luzofonema}\n`);
		return callback();
	}

	try {
		let ipa = execSync(`espeak-ng -v pt --ipa=3 -q "${palavra}"`).toString().trim();
		ipa = corrigirIPA(ipa);
		const luzofonema = aplicarLuzofonema(palavra, ipa);

		log(`📚 Entrada sugerida: ${palavra} → ${ipa} → ${luzofonema}\n`);

		corrigirAdicionar(rl, callback, palavra, ipa, luzofonema);
	}
	catch (erro) {
		error(`Erro ao gerar IPA com espeak-ng:`, erro.message);
		callback();
	}
}

/**
 * @brief Verifica se a palavra já se encontra no dicionário.
 * @param {string} palavra Palavra a verificar.
 * @returns {boolean} Verdadeiro se a palavra já estiver no dicionário.
 */
function palavraJaNoDicionario(palavra) {

	const ficheiro = "dicionario.tsv";
	if (!fs.existsSync(ficheiro)) return false;

	const conteudo = fs.readFileSync(ficheiro, "utf8");
	const linhas = conteudo.split("\n").filter(Boolean);
	return linhas.some(linha => linha.startsWith(`${palavra}\t`));
}

/**
 * @brief Extrai uma palavra aleatória do corpus, que não esteja no dicionário.
 * @returns {string|null} Palavra aleatória válida ou null em caso de erro.
 */
function obterPalavraAleatoriaDeCorpus() {

	const pasta = "./corpus";
	const ficheiros = fs.readdirSync(pasta).filter(f => f.endsWith(".xml"));
	if (ficheiros.length === 0) return null;

	const ficheiro = ficheiros[Math.floor(Math.random() * ficheiros.length)];
	const caminho = path.join(pasta, ficheiro);
	const conteudo = fs.readFileSync(caminho, "utf8");

	const texto = conteudo
		.replace(/<[^>]+>/g, " ")
		.replace(/[^\p{L}\s]/gu, " ")
		.replace(/\s+/g, " ");

	const palavras = texto.toLowerCase().split(" ")
		.map(p => p.trim())
		.filter(p => p.length >= 3);

	let tentativa;
	do {
		tentativa = palavras[Math.floor(Math.random() * palavras.length)];
	} while (tentativa && palavraJaNoDicionario(tentativa));

	return tentativa || null;
}


module.exports = { mostrarPalavra };
