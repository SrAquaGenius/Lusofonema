/* ----------------------------------------------------------------------------
 * File:     wiktionary.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");

const { debug, log, warn, error } = require("./debug");


/**
 * @brief Busca dados da palavra no Wiktionary.
 * @param {string} palavra Palavra a procurar.
 * @returns {Promise<object|null>} Objeto com campos como ipa, definicao, classe, plural.
 */
async function buscarDadosWiktionary(palavra) {

	palavra = palavra.trim().toLowerCase();
	debug("Palavra normalizada:", palavra);

	const url = `https://pt.wiktionary.org/w/api.php?action=query&titles=${
		encodeURIComponent(palavra)
	}&prop=revisions&rvprop=content&format=json&formatversion=2`;

	debug("URL construído:", url);

	try {
		const res = await fetch(url);
		debug("Resposta HTTP:", res.status);

		const json = await res.json();
		const pages = json.query.pages;

		// Verifica se há páginas válidas com revisões
		const page = pages.find(p => p.revisions && p.revisions.length > 0);
		if (!page) {
			warn("Definição não encontrada no Wiktionary.\n");
			return null;
		}

		const conteudo = page.revisions[0].content;
		debug("Conteúdo bruto da página:");
		debug(conteudo);

		const conteudoLimpo = limparConteudo(conteudo);
		debug("Conteúdo limpo:");
		debug(conteudoLimpo);

		const dados = converterConteudoParaDados(conteudoLimpo);
		debug("Dados:");
		debug(dados);

		const textoLimpo = converterDadosParaTexto(dados);
		log(`\n📚 Definição de "${palavra}:"`);
		log(textoLimpo);
		return dados;
	}
	catch (erro) {
		error("Erro ao buscar definição:", erro);
		return null;
	}
}

const titulosParaRemover = [
	"={{-pt-}}=",
	"===Portugal===",
];

const blocosParaApagar = [
	"==Ver também==",
	"={{-es-}}=",
	"={{-gl-}}=",
	"={{-lad-}}=",
	"===Tradução===",
];

/**
 * @brief Limpa e estrutura o conteúdo bruto do Wiktionary.
 * @param {string} conteudo Texto Wikitext da página.
 * @returns {object} JSON com campos estruturados como classe, plural, acentuacao, definicoes.
 */
function limparConteudo(textoBruto) {

	const linhas = textoBruto.split("\n");
	let apagarBloco = false;
	let apagarTabela = false;
	let importanciaBloco = 0;
	const resultado = [];

	for (let i = 0; i < linhas.length; i++) {

		const linhaOriginal = linhas[i];
		const linha = linhaOriginal.trim();

		if (linha.length === 0) continue;
		
		debug(`Linha ${i}: "${linha}", ${linha.length}`);

		// Verifica se estamos dentro de bloco de tabela {| ... |}
		if (apagarTabela) {

			if (linha.includes("|}")) {
				debug(`Fim do bloco de tabela detectado na linha ${i}: "${linha}"`);
				apagarTabela = false;
				continue;
			}
			
			debug(`Ignorar linha dentro de tabela: "${linha}"`);
			continue;
		}

		// Verifica se inicia bloco de tabela
		if (linha.startsWith("{|")) {
			debug(`Início de bloco de tabela a apagar na linha ${i}: "${linha}"`);
			apagarTabela = true;
			continue;
		}

		if (apagarBloco) {

			// Verifica se encontrou novo título do mesmo nível
			if (linha.startsWith("=")) {
				const imp = importanciaTitulo(linha);
				debug(`Título encontrado dentro de bloco: "${linha}" (importância ${imp})`);

				if (imp <= importanciaBloco) {
					debug(`Fim do bloco a apagar. Parar remoção de bloco.`);
					apagarBloco = false;
					importanciaBloco = 0;
					i--; // Reprocessar esta linha fora do bloco
					continue;
				}
			}

			debug(`Ignorar linha dentro de bloco: "${linha}"`);
			continue;
		}

		// Verifica se a linha é um título a remover
		if (titulosParaRemover.includes(linha)) {
			debug(`Título para remover (linha única): "${linha}"`);
			continue;
		}

		// Verifica se a linha inicia um bloco a apagar
		if (blocosParaApagar.includes(linha)) {
			apagarBloco = true;
			importanciaBloco = importanciaTitulo(linha);
			debug(`Início de bloco a apagar: "${linha}" (importância ${importanciaBloco})`);
			continue;
		}

		// Apagar frase de exemplo das definições
		if (linha.startsWith("#*")) {
			debug(`Linha exemplo de definição a apagar: "${linha}"`);
			continue;
		}

		debug(`Linha mantida`);
		resultado.push(linhaOriginal);
	}

	resultado.push("\n");
	return resultado;
}

/**
 * @brief Calcula a importância de um título baseado no número de
 *        sinais de igual ('=') à esquerda e à direita.
 * @param {string} titulo Título do Wiktionary (ex: "== Substantivo ==")
 * @param {boolean} debug Se verdadeiro, imprime informação detalhada.
 * @returns {number} Nível de importância (1, 2, 3...) ou 0 se não for título.
 */
function importanciaTitulo(titulo) {

	const match = titulo.match(/^(\=+)\s*(.*?)\s*(=+)$/);
	if (!match) {
		debug(`Título inválido: "${titulo}"`);
		return 0;
	}

	const esquerda = match[1].length;
	const direita = match[3].length;

	debug(`Título: "${titulo}" (${esquerda}, ${direita})`);

	return Math.min(esquerda, direita);
}

/**
 * @brief Extrai campos úteis do conteúdo limpo do Wiktionary e devolve como JSON.
 * @param {string[]} conteudo Array de linhas de texto limpo do Wiktionary.
 * @returns {object} Objeto com campos como classe, plural, acentuacao e definicao.
 */
function converterConteudoParaDados(conteudo) {

	const dados = copiarTemplateJSON();

	let modo = null;

	for (const linha of conteudo) {
		// Identificar secções principais
		if (/^==\s*Substantivo\s*==$/i.test(linha)) {
			dados.classe = "substantivo";
			modo = "substantivo";
			continue;
		}
		if (/^==\s*Verbo\s*==$/i.test(linha)) {
			dados.classe = "verbo";
			modo = "verbo";
			continue;
		}
		if (/^==.*==$/i.test(linha)) {
			modo = null;
			continue;
		}

		// Género (masculino/feminino)
		if (/\{\{gramática\|f\}\}/.test(linha)) dados.classe += " feminino";
		if (/\{\{gramática\|m\}\}/.test(linha)) dados.classe += " masculino";

		// Acentuação
		if (/\{\{(proparoxítona)/.test(linha)) {
			dados.acentuacao = "esdrúxula";
			continue;
		}
		if (/\{\{(paroxítona)/.test(linha)) {
			dados.acentuacao = "grave";
			continue;
		}
		if (/\{\{(oxítona)/.test(linha)) {
			dados.acentuacao = "aguda";
			continue;
		}

		// Plural e singular
		if (/\{\{flex\.pt\|[^}]*\}\}/.test(linha)) {
			const m = linha.match(/(?:fp|mp)=([^|}]+)/);
			if (m) dados.plural = m[1].trim();

			const n = linha.match(/(?:fs|ms)=([^|}]+)/);
			if (n) dados.palavra = n[1].trim();
		}

		// IPA
		if (/\{\{AFI\|\/.*\/\}\}/.test(linha)) {
			const m = linha.match(/\{\{AFI\|(.+?)\}\}/);
			if (m) dados.ipa = m[1].trim();
		}

		// Definições numeradas
		if (/^#/.test(linha)) {
			dados.definicao.push(limparLinhaDefinicao(linha));
		}
	}

	return dados;
}

/**
 * @brief Cria uma cópia do template JSON usado para palavras.
 *        Lê o ficheiro './palavras/template.json' e devolve um novo objeto.
 * @returns {object|null} Objeto com os campos do template ou null em caso de erro.
 */
function copiarTemplateJSON() {
	try {
		const conteudo = fs.readFileSync("./palavras/template.json", "utf8");
		const template = JSON.parse(conteudo);
		return { ...template }; // cópia independente
	}
	catch (erro) {
		error("Erro ao copiar template JSON:", erro.message);
		return null;
	}
}

/**
 * @brief Limpa uma linha de definição do Wiktionary.
 * @param {string} linha Linha com marcações de definição.
 * @returns {string} Definição simplificada.
 */
function limparLinhaDefinicao(linha) {

	debug(linha);

	return linha
		.replace(/^#+\s*/, "")				// Remove símbolos de lista
		.replace(/\[\[([^\|\]]+)\|([^\]]+)\]\]/g, "$2")	// Remove links
		.replace(/\[\[(.*?)\]\]/g, "$1")	// Remove ligações internas
		.replace(/\{\{[^}]+\}\}/g, "")		// Remove templates
		.replace(/\s+/g, " ")				// Espaços duplos
		.trim();
}

/**
 * @brief Converte o conteúdo limpo do Wiktionary para texto formatado.
 * @param {object} dados Objeto com campos como classe, plural, acentuacao, definicoes.
 * @returns {string} Texto formatado para exibição.
 */
function converterDadosParaTexto(dados) {

	let linhas = [];

	// if (dados.palavra) linhas.push(`• Palavra: ${dados.palavra}`);
	if (dados.ipa) linhas.push(`• IPA: ${dados.ipa}`);
	if (dados.lusofonema) linhas.push(`• Lusofonema: ${dados.lusofonema}`);

	if (dados.classe) linhas.push(`• Classe: ${dados.classe}`);
	if (dados.acentuacao) linhas.push(`• Acentuação: ${dados.acentuacao}`);
	if (dados.plural) linhas.push(`• Plural: "${dados.plural}"`);

	linhas.push("• Definições:");
	if (dados.definicao.length > 0) {
		dados.definicao.forEach((def, i) => {
			linhas.push(`   ${i + 1}. ${def}`);
		});
	}

	if (dados.etimologia) linhas.push(`• Etimologia: "${dados.etimologia}"`);

	return linhas.join("\n");
}






















/**
 * @brief  Obtém a definição duma palavra no Wiktionary (pt.wiktionary.org)
 * @param {readline.Interface} rl Interface readline para input do utilizador
 * @param {function} callback Função a invocar após a resposta
 * @returns {Promise<void>} Mostra definição ou erro e invoca callback
 */
async function buscarDefinicaoWiktionary(rl, callback) {
	debug("Início de buscarDefinicaoWiktionary.");

	rl.question("🔎 Que palavra queres procurar no Wiktionary? ", 
				async (input) => {
		const palavra = input.trim().toLowerCase();
		debug("Palavra normalizada:", palavra);

		const url = `https://pt.wiktionary.org/w/api.php?action=query&titles=${
			encodeURIComponent(palavra)
		}&prop=revisions&rvprop=content&format=json&formatversion=2`;

		debug("URL construído:", url);

		try {
			const res = await fetch(url);
			debug("Resposta HTTP:", res.status);

			const json = await res.json();
			debug("JSON recebido");

			const page = json.query.pages[0].revisions[0].content;
			debug(page);

			if (page) {
				const textoLimpo = extrairDefinicaoPrincipal(page);
				console.log(`\n📚 Definição de "${palavra}:"`);
				console.log(textoLimpo);
			}
			else console.log("❌ Definição não encontrada no Wiktionary.\n");
		}
		catch (erro) {
			console.error("⚠️ Erro ao buscar definição:", erro);
			debug("Erro capturado:", erro);
		}
		finally {
			debug("Fim de buscarDefinicaoWiktionary.");
			callback();
		}
	});
}

/**
 * @brief Extrai a definição principal do texto bruto do Wiktionary,
 *        removendo títulos específicos e blocos de conteúdo associados,
 *        conforme a importância dos títulos.
 * @param {string} textoBruto Texto completo retornado pelo Wiktionary.
 * @returns {string} Texto filtrado, contendo apenas a definição principal.
 */
function extrairDefinicaoPrincipal(textoBruto) {

	const linhas = textoBruto.split("\n");
	let apagarBloco = false;
	let apagarTabela = false;
	let importanciaBloco = 0;
	const resultado = [];

	for (let i = 0; i < linhas.length; i++) {

		const linhaOriginal = linhas[i];
		const linha = linhaOriginal.trim();

		if (linha.length === 0) continue;
		
		debug(`Linha ${i}: "${linha}", ${linha.length}`);

		// Verifica se estamos dentro de bloco de tabela {| ... |}
		if (apagarTabela) {

			if (linha.includes("|}")) {
				debug(`Fim do bloco de tabela detectado na linha ${i}: "${linha}"`);
				apagarTabela = false;
				continue;
			}
			
			debug(`Ignorar linha dentro de tabela: "${linha}"`);
			continue;
		}

		// Verifica se inicia bloco de tabela
		if (linha.startsWith("{|")) {
			debug(`Início de bloco de tabela a apagar na linha ${i}: "${linha}"`);
			apagarTabela = true;
			continue;
		}

		if (apagarBloco) {

			// Verifica se encontrou novo título do mesmo nível
			if (linha.startsWith("=")) {
				const imp = importanciaTitulo(linha);
				debug(`Título encontrado dentro de bloco: "${linha}" (importância ${imp})`);

				if (imp <= importanciaBloco) {
					debug(`Fim do bloco a apagar. Parar remoção de bloco.`);
					apagarBloco = false;
					importanciaBloco = 0;
					i--; // Reprocessar esta linha fora do bloco
					continue;
				}
			}

			debug(`Ignorar linha dentro de bloco: "${linha}"`);
			continue;
		}

		// Verifica se a linha é um título a remover
		if (titulosParaRemover.includes(linha)) {
			debug(`Título para remover (linha única): "${linha}"`);
			continue;
		}

		// Verifica se a linha inicia um bloco a apagar
		if (blocosParaApagar.includes(linha)) {
			apagarBloco = true;
			importanciaBloco = importanciaTitulo(linha);
			debug(`Início de bloco a apagar: "${linha}" (importância ${importanciaBloco})`);
			continue;
		}

		// Apagar frase de exemplo das definições
		if (linha.startsWith("#*")) {
			debug(`Linha exemplo de definição a apagar: "${linha}"`);
			continue;
		}

		debug(`Linha mantida`);
		resultado.push(linhaOriginal);
	}

	debug("Resultado pós limpeza:");
	debug(resultado.join("\n"));

	resultado.push("\n");

	const estado = {};
	return resultado.map(linha => limparLinhaWiki(linha, estado)).join("\n");
}


/**
 * @brief Calcula a importância de um título baseado no número de
 *        sinais de igual ('=') à esquerda e à direita.
 * @param {string} titulo Título do Wiktionary (ex: "== Substantivo ==")
 * @param {boolean} debug Se verdadeiro, imprime informação detalhada.
 * @returns {number} Nível de importância (1, 2, 3...) ou 0 se não for título.
 */
function importanciaTitulo(titulo) {

	const match = titulo.match(/^(\=+)\s*(.*?)\s*(=+)$/);
	if (!match) {
		debug(`Título inválido: "${titulo}"`);
		return 0;
	}

	const esquerda = match[1].length;
	const direita = match[3].length;

	debug(`Título: "${titulo}" (${esquerda}, ${direita})`);

	return Math.min(esquerda, direita);
}

/**
 * @brief Limpa marcações wiki como {{...}}, [[...]], e bullets.
 * @param {string} linha Linha do Wiktionary a limpar.
 * @returns {string} Linha limpa e mais legível.
 */
function limparLinhaWiki(linha, estado = {}) {

	if (linha.includes("{{gramática|m")) {
		return estado.tipo ? `📌 ${estado.tipo} Masculino` : `📌 Masculino`;
	}
	if (linha.includes("{{gramática|f")) {
		return estado.tipo ? `📌 ${estado.tipo} Feminino` : `📌 Feminino`;
	}

	if (linha.startsWith("{{paroxítona|")) {
		const silabas = linha.match(/{{paroxítona\|([^}]+)}}/);
		if (silabas) {
			const partes = silabas[1].split("|").map((s, i, arr) =>
				i === arr.length - 2 ? `(${s})` : s
			);
			return `Paroxítona: "${partes.join(".")}"`;
		}
	}

	if (linha.startsWith("{{flex.pt|")) {
		const pluralMatch = linha.match(/mp=([^|}]+)/);
		if (pluralMatch) {
			return `Plural: "${pluralMatch[1]}"`;
		}
	}

	// Comportamento por omissão
	return linha
		.replace(/{{AFI\|(.*?)}}/g, "$1")
		.replace(/{{escopo\|pt\|(.*?)}}/g, "($1)")
		.replace(/{{(.*?)\|pt}}/g, (_, palavra) =>
			palavra.charAt(0).toUpperCase() + palavra.slice(1)
		)
		.replace(/^=+(.*?)=+$/, "\n📌 $1")
		.replace(/{{.*?}}/g, "")
		.replace(/\[\[(.*?)\]\]/g, "$1")
		.replace(/^#+/, "•")
		.replace(/\*/, "•")
		.replace(/\s{2,}/g, " ")
		.trim();
}

module.exports = { buscarDefinicaoWiktionary, buscarDadosWiktionary };
