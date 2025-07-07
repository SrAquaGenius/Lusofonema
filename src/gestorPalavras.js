/* ----------------------------------------------------------------------------
 * File:     gestorPalavras.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");
const path = require("path");

const { debug, log, warn } = require("./debug");


const PASTA_PALAVRAS = path.join(__dirname, "..", "palavras");

/**
 * @brief Cria uma cópia do template JSON usado para palavras.
 *        Lê o ficheiro './template.json' e devolve um novo objeto.
 * @returns {object|null} Objeto com os campos do template ou null em caso de erro.
 */
function copiarTemplateJSON() {
	try {
		const conteudo = fs.readFileSync("./template.json", "utf8");
		const template = JSON.parse(conteudo);
		return { ...template }; // cópia independente
	}
	catch (erro) {
		error("Erro ao copiar template JSON:", erro.message);
		return null;
	}
}

/** @brief Garante que a pasta de palavras existe. */
function garantirPasta() {

	if (fs.existsSync(PASTA_PALAVRAS)) {
		debug("Pasta para palavras existe");
		return;
	}

	fs.mkdirSync(PASTA_PALAVRAS);
	debug("Pasta para palavras criada");
}

/**
 * @brief Cria ou atualiza o ficheiro JSON de uma palavra.
 * @param {object} dados Objeto com os campos da palavra.
 */
function guardarPalavra(palavra, dados) {

	garantirPasta();
	const nomeFicheiro = `${palavra.toLowerCase()}.json`;
	const caminho = path.join(PASTA_PALAVRAS, nomeFicheiro);
	fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), "utf-8");
	log(`✅ Palavra "${palavra}" guardada em ${caminho}`);
}

/**
 * @brief Lê os dados de uma palavra.
 * @param {string} palavra Palavra a procurar.
 * @returns {object|null} Objeto da palavra ou null.
 */
function lerPalavra(palavra) {

	const caminho = path.join(PASTA_PALAVRAS, `${palavra.toLowerCase()}.json`);
	if (!fs.existsSync(caminho)) {
		debug(`Palavra "${palavra}" não encontrada no dicionário.`);
		return null;
	}
	const conteudo = fs.readFileSync(caminho, "utf-8");
	return JSON.parse(conteudo);
}

/**
 * @brief Procura se uma dada palavra existe na pasta de palavras
 * @param {string} palavra Palavra a procurar
 * @returns {true|false}
 */
function palavraGuardada(palavra) {
	
	const caminho = path.join(PASTA_PALAVRAS, `${palavra.toLowerCase()}.json`);
	if (!fs.existsSync(caminho)) {
		debug(`Palavra "${palavra}" não encontrada no dicionário.`);
		return false;
	}

	debug(`Palavra "${palavra}" encontrada no dicionário.`);
	return true;
}

/**
 * @brief Elimina o ficheiro de uma palavra.
 * @param {string} palavra Palavra a eliminar.
 */
function eliminarPalavra(palavra) {

	const caminho = path.join(PASTA_PALAVRAS, `${palavra.toLowerCase()}.json`);
	if (fs.existsSync(caminho)) {
		fs.unlinkSync(caminho);
		log(`🗑️ Palavra "${palavra}" eliminada.`);
	}
	
	else warn(`Palavra "${palavra}" não existe.`);
}

/**
 * @brief Converte o conteúdo limpo do Wiktionary para texto formatado.
 * @param {object} dados Objeto com campos como classe, plural, acentuacao, definicoes.
 * @returns {string} Texto formatado para exibição.
 */
function converterDadosParaTexto(dados, mostrarPalavra = false) {

	let linhas = [];

	if (dados.palavra && mostrarPalavra)
		linhas.push(`• Palavra: ${dados.palavra}`);

	if (dados.ipa) linhas.push(`• IPA: ${dados.ipa}`);
	if (dados.lusofonema) linhas.push(`• Lusofonema: ${dados.lusofonema}`);

	if (dados.classe) linhas.push(`• Classe: ${dados.classe}`);
	if (dados.plural) linhas.push(`• Plural: "${dados.plural}"`);
	if (dados.acentuacao) linhas.push(`• Acentuação: ${dados.acentuacao}`);

	if (dados.definicao.length > 0) {
		linhas.push("• Definições:");
		dados.definicao.forEach((def, i) => {
			linhas.push(`   ${i + 1}. ${def}`);
		});
	}

	if (dados.etimologia) linhas.push(`• Etimologia: ${dados.etimologia}`);

	return linhas.join("\n");
}

module.exports = { guardarPalavra, lerPalavra, eliminarPalavra,
				   converterDadosParaTexto, palavraGuardada,
				   copiarTemplateJSON };
