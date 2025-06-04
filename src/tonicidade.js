/* ----------------------------------------------------------------------------
 * File:     tonicidade.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { debug } = require("./debug");
const { separarSilabas } = require("./silabas");

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
 * @brief Aplica acento tónico à vogal mais proeminente da sílaba marcada 
 *        com ˈ, segundo critérios gráficos e fonológicos.
 *        Utiliza um mapa de prioridades para distinguir entre vogais e 
 *        combinações mais marcadas.
 * @param {string[]} silabas Array de sílabas, uma delas com caracter 'ˈ'.
 * @returns {string} Palavra reconstruída com a tonicidade aplicada.
 */
function aplicarTonicidade(silabas) {

	debug(silabas);

	const indexTonica = silabas.findIndex(s => s.startsWith("ˈ"));
	if (indexTonica === -1) return silabas.join("");

	let silaba = silabas[indexTonica];
	const chars = silaba.split("");
	const candidatos = [];

	for (let i = 0; i < chars.length; i++) {
		const c = chars[i];
		if (vogais.includes(c.toLowerCase())) {
			const prox = chars[i + 1] || "";
			const p = prioridade(c, prox);
			candidatos.push({ index: i, letra: c, prox, prioridade: p });
		}
	}

	if (candidatos.length === 0) {
		// Remove o ˈ se não há candidato
		silabas[indexTonica] = silaba.replace("ˈ", "");
		return silabas.join("");
	}

	// Escolhe a vogal com maior prioridade (desempata pelo índice)
	const tonica = candidatos.reduce((a, b) =>
		b.prioridade > a.prioridade ? b : a
	);

	// Aplica acento na vogal
	const i = tonica.index;
	const tChar = tonica.letra;
	const temTilde = vogaisTildes.test(tChar);
	const temFlexo = vogaisFlexas.test(tChar);
	const temAgudo = vogaisAgudas.test(tChar);
	const temAcento = temTilde || temFlexo || temAgudo;

	if (!temAcento) {
		chars[i] = mapaGrave[tChar] || tChar;
	} else if (temAgudo &&
		candidatos.filter(c => vogaisAgudas.test(c.letra)).length > 1) {
		// Se houver mais de um acento agudo, converte este para caron
		chars[i] = mapaGrave[tChar] || tChar;
	}

	// Reconstrói sílaba sem ˈ e com vogal acentuada
	silabas[indexTonica] = chars.filter(c => c !== "ˈ").join("");

	return silabas.join("");
}


module.exports = { aplicarTonicidade };
