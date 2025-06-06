/* ----------------------------------------------------------------------------
 * File:     tonicidade.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { debug } = require("./debug");

const mapaGrave = {
	a: "à", á: "ǎ",
	e: "è", é: "ě",
	i: "ì", í: "ǐ",
	o: "ò", ó: "ǒ",
	u: "ù", ú: "ǔ",
};

const vogais = "aeiouáéíóúàèìòùâêôãõǎěǐǒǔ";
const vogaisAgudas = /[áéíóú]/i;
const vogaisCarons = /[ǎěǐǒǔ]/i;
const vogaisTildes = /[ãõ]/i;
const vogaisFlexas = /[âêô]/i;

/**
 * Atribui uma prioridade a uma vogal consoante os critérios fonológicos.
 */
function prioridade(centro, prox) {

	// Acentuações
	if (vogaisCarons.test(centro)) return 110;
	if (vogaisFlexas.test(centro)) return 100;
	if (vogaisTildes.test(centro)) return 100;
	if (vogaisAgudas.test(centro)) return 90;

	const par = centro + (prox || "");

	// Combinações fonológicas
	if (/[aeiou][aeiou][n]/i.test(par)) return 80;		// ditongo + nasal
	if (/[aeiou][aeiou][r]/i.test(par)) return 70;		// ditongo + vibrante
	if (/[aeiou][aeiou][l]/i.test(par)) return 60;		// ditongo + lateral
	if (/[aeiou][aeiou]/i.test(par)) return 50;			// ditongo
	if (/[aeiou][r]/i.test(par)) return 40;				// vibrante
	if (/[aeiou][n]/i.test(par)) return 30;				// nasal
	if (/[aeiou][l]/i.test(par)) return 20;				// lateral

	return 10; // sem marca distintiva
}


/**
 * @brief Aplica a tonicidade a uma palavra silabificada, respeitando
 *        regras de prioridade vocálica e evitando sobreposição desnecessária.
 * @param {string[]} silabas Lista de sílabas (uma contém o marcador 'ˈ')
 * @returns {string} Palavra com acento aplicado corretamente (se necessário)
 */
function aplicarTonicidade(silabas) {
	debug("Sílabas recebidas:", silabas);

	const indexTonica = silabas.findIndex(s => s.startsWith("ˈ"));
	if (indexTonica === -1) {
		debug("Nenhuma sílaba tónica encontrada.");
		return silabas.join("");
	}

	const prioridadesPorSilaba = silabas.map(s => calcularPrioridadeSilaba(s));
	debug("Prioridade máxima por sílaba:", prioridadesPorSilaba);

	const silaba = silabas[indexTonica];
	const chars = silaba.split("");
	const candidatos = encontrarCandidatos(chars);
	debug("Candidatos à tonicidade:", candidatos);

	if (candidatos.length === 0) {
		silabas[indexTonica] = removerMarcaTonica(silaba);
		debug("Sem candidatos. A remover ˈ.");
		return silabas.join("");
	}

	const tonica = candidatos.reduce((a, b) => b.prioridade > a.prioridade ? b : a);
	const prioridadeTonica = prioridadesPorSilaba[indexTonica];
	const maxUltimas3 = Math.max(...prioridadesPorSilaba.slice(-3));

	if (prioridadeTonica > maxUltimas3) {
		silabas[indexTonica] = removerMarcaTonica(silaba);
		debug("Tónica já tem maior prioridade. A remover ˈ.");
		return silabas.join("");
	}

	const novaSilaba = aplicarAcento(chars, tonica);
	silabas[indexTonica] = novaSilaba;
	const resultado = silabas.join("");
	debug("Resultado final:", resultado);
	return resultado;
}


/**
 * @brief Calcula a prioridade máxima de uma sílaba com base nas suas vogais.
 * @param {string} silaba A sílaba a avaliar.
 * @returns {number} Prioridade mais alta entre vogais da sílaba.
 */
function calcularPrioridadeSilaba(silaba) {
	const letras = silaba.replace("ˈ", "").split("");
	let maior = -1;
	for (let i = 0; i < letras.length; i++) {
		if (vogais.includes(letras[i].toLowerCase())) {
			const prox = letras[i + 1] || "";
			const p = prioridade(letras[i], prox);
			if (p > maior) maior = p;
		}
	}
	return maior;
}


/**
 * @brief Encontra as vogais candidatas à tonicidade numa sílaba.
 * @param {string[]} chars Array de caracteres da sílaba.
 * @returns {Object[]} Lista de objetos com índice, letra e prioridade.
 */
function encontrarCandidatos(chars) {
	return chars.flatMap((c, i) => {
		if (vogais.includes(c.toLowerCase())) {
			const prox = chars[i + 1] || "";
			return [{ index: i, letra: c, prox, prioridade: prioridade(c, prox) }];
		}
		return [];
	});
}


/**
 * @brief Remove o marcador ˈ de uma sílaba.
 * @param {string} silaba A sílaba com marcador.
 * @returns {string} Sílaba sem marcador.
 */
function removerMarcaTonica(silaba) {
	return silaba.replace("ˈ", "");
}


/**
 * @brief Aplica o acento adequado à vogal tónica numa sílaba.
 * @param {string[]} chars Array de caracteres da sílaba.
 * @param {Object} tonica Informação sobre a vogal a acentuar.
 * @returns {string} Sílaba reconstruída com acento.
 */
function aplicarAcento(chars, tonica) {

	const { index: i, letra: tChar } = tonica;
	const temTilde = vogaisTildes.test(tChar);
	const temFlexo = vogaisFlexas.test(tChar);
	const temAgudo = vogaisAgudas.test(tChar);
	const temAcento = temTilde || temFlexo || temAgudo;

	if (!temAcento) {
		debug(`Aplicar grave a '${tChar}':`, mapaGrave[tChar] || tChar);
		chars[i] = mapaGrave[tChar] || tChar;
	}

	else if (temAgudo &&
			 chars.filter(c => vogaisAgudas.test(c)).length > 1) {
		debug(`Converter agudo '${tChar}' para grave:`, mapaGrave[tChar] || tChar);
		chars[i] = mapaGrave[tChar] || tChar;
	}

	return chars.filter(c => c !== "ˈ").join("");
}


module.exports = { aplicarTonicidade };
