/* ----------------------------------------------------------------------------
 * File:     mostrarPalavra.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");
const path = require("path");

const { pesquisarPalavra } = require("./pesquisar");
const { converterDadosParaTexto } = require("./gestorPalavras");

const { log, debug } = require("./debug");


/**
 * @brief Mostra a transcrição fonética e lusofonema de uma palavra.
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
		if (palavra == "0") {
			log("A voltar ao menu ...\n");
			return callback();
		}

		// Palavra aleatória se input estiver vazio
		if (!palavra) {
			palavra = obterPalavraAleatoriaDeCorpus();

			if (!palavra) {
				error("Falha a obter uma palavra aleatória.\n");
				return callback();
			}

			log(`🎲 Palavra aleatória: ${palavra}`);
		}

		// Procurar pela palavra escolhida
		const resultado = await pesquisarPalavra(palavra, callback);

		debug(resultado);

		if (!resultado || !resultado.fonte) {
			error("Erro ao obter a informação da palavra.\n");
			return callback();
		}

		log(`📚 Entrada ${resultado.fonte}:`);
		log(converterDadosParaTexto(resultado.dados, true));
		return callback();
	});
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


module.exports = { mostrarPalavra };
