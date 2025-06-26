/* ----------------------------------------------------------------------------
 * File:     wiktionary.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { debug, warn, error } = require("./debug");


/**
 * @brief Busca dados da palavra no Wiktionary.
 * @param {string} palavra Palavra a procurar.
 * @returns {true|false} Booleano que indica se os dados foram bem preenchidos.
 */
async function buscarDadosWiktionary(palavra, dados) {

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
			return false;
		}

		const conteudo = page.revisions[0].content;
		debug("Conteúdo bruto da página:");
		debug(conteudo);

		const conteudoLimpo = limparConteudo(conteudo);
		// debug("Conteúdo limpo:");
		// debug(conteudoLimpo);

		converterConteudoParaDados(conteudoLimpo, dados);
		// debug("Dados:");
		// debug(dados);

		return true;
	}
	catch (erro) {
		error("Erro ao buscar definição: ", erro);
		return null;
	}
}

const titulosParaRemover = [
	"={{-pt-}}=",
	"===Portugal===",
];

const blocosParaApagar = [
	"==Ver também==",
	"===Sinônimos===",
	"={{-es-}}=",
	"={{-gl-}}=",
	"={{-lad-}}=",
	"={{-an-}}=",
	"={{-ca-}}=",
	"={{-co-}}=",
	"={{-it-}}=",
	"={{-mwl-}}=",
	"={{-nap-}}=",
	"={{-val-}}=",
	"={{-vec-}}=",
	"===Tradução===",
	"==Anagramas==",
	"===Aumentativos===",
	"===Diminutivos===",
	"===Expressões==="
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
		
		debug(`Linha ${i} s/D: "${linha}", ${linha.length}`);

		// Verifica se estamos dentro de bloco de tabela {| ... |}
		if (apagarTabela) {

			if (linha.includes("|}")) {
				// debug(`Fim do bloco de tabela detectado na linha ${i}: "${linha}"`);
				apagarTabela = false;
				continue;
			}
			
			// debug(`Ignorar linha dentro de tabela: "${linha}"`);
			continue;
		}

		// Verifica se inicia bloco de tabela
		if (linha.startsWith("{|")) {
			// debug(`Início de bloco de tabela a apagar na linha ${i}: "${linha}"`);
			apagarTabela = true;
			continue;
		}

		if (apagarBloco) {

			// Verifica se encontrou novo título do mesmo nível
			if (linha.startsWith("=")) {
				const imp = importanciaTitulo(linha);
				// debug(`Título encontrado dentro de bloco: "${linha}" (importância ${imp})`);

				if (imp <= importanciaBloco) {
					// debug(`Fim do bloco a apagar. Parar remoção de bloco.`);
					apagarBloco = false;
					importanciaBloco = 0;
					i--; // Reprocessar esta linha fora do bloco
					continue;
				}
			}

			// debug(`Ignorar linha dentro de bloco: "${linha}"`);
			continue;
		}

		// Verifica se a linha é um título a remover
		if (titulosParaRemover.includes(linha)) {
			// debug(`Título para remover (linha única): "${linha}"`);
			continue;
		}

		// Verifica se a linha inicia um bloco a apagar
		if (blocosParaApagar.includes(linha)) {
			apagarBloco = true;
			importanciaBloco = importanciaTitulo(linha);
			// debug(`Início de bloco a apagar: "${linha}" (importância ${importanciaBloco})`);
			continue;
		}

		// Apagar frase de exemplo das definições
		if (linha.startsWith("#*")) {
			// debug(`Linha exemplo de definição a apagar: "${linha}"`);
			continue;
		}

		// debug(`Linha mantida`);
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
		// debug(`Título inválido: "${titulo}"`);
		return 0;
	}

	const esquerda = match[1].length;
	const direita = match[3].length;

	// debug(`Título: "${titulo}" (${esquerda}, ${direita})`);

	return Math.min(esquerda, direita);
}

/**
 * @brief Extrai campos úteis do conteúdo limpo do Wiktionary e devolve como JSON.
 * @param {string[]} conteudo Array de linhas de texto limpo do Wiktionary.
 * @returns {object} Objeto com campos como classe, plural, acentuacao e definicao.
 */
function converterConteudoParaDados(conteudo, dados) {

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

		// Acentuação + Palavra + Sílabas
		const mAcento = linha.match(/\{\{(proparoxítona|paroxítona|oxítona)\|([^\}]+)\}\}/);
		if (mAcento) {
			const tipo = mAcento[1];
			const silabas = mAcento[2].split("|").map(s => s.trim());

			let idxTonica = -1;
			if (tipo === "proparoxítona") {
				dados.acentuacao = "esdrúxula";
				idxTonica = silabas.length - 3;
			}
			else if (tipo === "paroxítona") {
				dados.acentuacao = "grave";
				idxTonica = silabas.length - 2;
			}
			else if (tipo === "oxítona") {
				dados.acentuacao = "aguda";
				idxTonica = silabas.length - 1;
			}

			// Inserir o marcador ˈ na sílaba tónica
			if (idxTonica >= 0 && idxTonica < silabas.length) {
				silabas[idxTonica] = "ˈ" + silabas[idxTonica];
			}

			// Palavra reconstruída com pontos
			dados.palavra = silabas.join(".");
			dados.silabas = silabas.length;
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
		if (/^#(?![:*])/.test(linha)) {
			dados.definicao.push(limparLinhaDefinicao(linha));
		}
	}
}

/**
 * @brief Limpa uma linha de definição do Wiktionary.
 * @param {string} linha Linha com marcações de definição.
 * @returns {string} Definição simplificada.
 */
function limparLinhaDefinicao(linha) {

	// debug(linha);

	return linha
		.replace(/^#+\s*/, "")				// Remove símbolos de lista
		.replace(/\[\[([^\|\]]+)\|([^\]]+)\]\]/g, "$2")	// Remove links
		.replace(/\[\[(.*?)\]\]/g, "$1")	// Remove ligações internas
		.replace(/\{\{[^}]+\}\}/g, "")		// Remove templates
		.replace(/\s+/g, " ")				// Espaços duplos
		.trim();
}


module.exports = { buscarDadosWiktionary };
