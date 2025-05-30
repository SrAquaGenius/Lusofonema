/* ----------------------------------------------------------------------------
 * File:     tonicidade.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

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
	if (vogaisCarons.test(centro)) return 100;
	if (vogaisFlexas.test(centro)) return 90;
	if (vogaisTildes.test(centro)) return 80;
	if (vogaisAgudas.test(centro)) return 70;

	const par = centro + (prox || "");

	// Combinações fonológicas (ditongos e sons consonânticos)
	if (/[aeiou][mn]/i.test(par)) return 60;            // nasal
	if (/[aeiou][rl]/i.test(par)) return 50;            // vibrante ou lateral
	if (/[aeiou][aeiou]/i.test(par)) return 40;         // ditongo simples
	if (/[mn]/i.test(prox)) return 30;                  // nasalidade isolada
	if (/[rl]/i.test(prox)) return 20;                  // vibrante/lateral isolada

	return 10; // sem marca distintiva
}

/**
 * Aplica acento tónico segundo os critérios gráficos e fonológicos.
 */
function aplicarTonicidade(palavra) {
	const chars = palavra.split("");
	const tIndex = chars.indexOf("ˈ");
	if (tIndex === -1) return palavra; // sem marcador

	// Coleta candidatas a sílaba tónica
	const candidatos = [];
	for (let i = tIndex + 1; i < chars.length; i++) {
		const c = chars[i];
		if (vogais.includes(c.toLowerCase())) {
			const prox = chars[i + 1] || "";
			const p = prioridade(c, prox);
			candidatos.push({ index: i, letra: c, prox, prioridade: p });
		}
	}

	if (candidatos.length === 0) return palavra.replace("ˈ", "");

	// Escolher a vogal com maior prioridade
	const tonica = candidatos.reduce((a, b) =>
		b.prioridade > a.prioridade ? b : a
	);

	// Aplicar acento (caso necessário)
	const tChar = tonica.letra;
	const i = tonica.index;
	const temTilde = vogaisTildes.test(tChar);
	const temFlexo = vogaisFlexas.test(tChar);
	const temAgudo = vogaisAgudas.test(tChar);
	const temAcento = temTilde || temFlexo || temAgudo;

	if (!temAcento) {
		chars[i] = mapaGrave[tChar] || tChar;
	} else if (temAgudo && candidatos.filter(c => vogaisAgudas.test(c.letra)).length > 1) {
		// Se houver múltiplos agudos → transforma o da sílaba tónica em caron
		chars[i] = mapaGrave[tChar] || tChar;
	}

	// Retira o marcador ˈ e retorna
	return chars.filter(c => c !== "ˈ").join("");
}

module.exports = { aplicarTonicidade };
