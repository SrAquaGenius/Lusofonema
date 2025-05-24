/* ----------------------------------------------------------------------------
* File:     regras.js
* Authors:  SrAqua
* ------------------------------------------------------------------------- */

/**
 * @brief Cada regra corresponde a:
 * - `pattern`: expressão regular sobre a forma escrita da palavra
 * - `ipaPattern`: som IPA esperado na mesma posição
 * - `replacement`: substituição na ortografia
 * - `advance`: (opcional) número extra de avanços a fazer no índice da palavra
 */
const luzofonemaRules = [

	// ==================== SIBILANTES ====================
	{ pattern: /(?<=[aeiou])s(?=[aeiou])/gi, ipaPattern: "z", replacement: "z" },
	{ pattern: /ç/gi, ipaPattern: "s", replacement: "s" },
	{ pattern: /ss/gi, ipaPattern: "s", replacement: "s" },
	{ pattern: /c(?=[e,i])/gi, ipaPattern: "s", replacement: "s" },
	{ pattern: /ch/gi, ipaPattern: "ʃ", replacement: "x" },
	{ pattern: /x/gi, ipaPattern: "ks", replacement: "ç" },
	{ pattern: /(?<=[aeiouáéíóú])x(?=[aeiouáéíóú])/gi, ipaPattern: "z", replacement: "z" },
	{ pattern: /(?<=[aeiouáéíóú])x(?=[aeiouáéíóúãõ])/gi, ipaPattern: "s", replacement: "s" },
	{ pattern: /ex/gi, ipaPattern: "ɐjʃ", replacement: "eis" },
	
	// ==================== OCLUSIVAS =====================
	{ pattern: /g(?=[eiyéí])/gi, ipaPattern: "ʒ", replacement: "j" },
	{ pattern: /qu(?=[ei])/gi, ipaPattern: "k", replacement: "c" },
	{ pattern: /q(?=u[ao])/gi, ipaPattern: "k", replacement: "c" },
	{ pattern: /k/gi, ipaPattern: "k", replacement: "c" },
	{ pattern: /rr/gi, ipaPattern: "ʁ",  replacement: "rr", advance: 1 },
	
	// =================== LETRAS MUDAS ===================
	{ pattern: /(?<=[g])u(?=[e,i])/gi, ipaPattern: "",  replacement: "" },
	{ pattern: /(?<![ln])h/gi, ipaPattern: "",  replacement: "" },

	// ==================== NASALIZAÇÃO ====================
	{ pattern: /lh/gi, ipaPattern: "ʎ",  replacement: "lh", advance: 1 },
	{ pattern: /nh/gi, ipaPattern: "ɲ",  replacement: "nh", advance: 1 },
	{ pattern: /(?<=[aeiou])m(?=[ pb])/gi, ipaPattern: "n", replacement: "n" },

	// ==================== SONS VOCÁLICOS ====================
	// SEMIVOGAIS
	{ pattern: /i/gi, ipaPattern: "j", replacement: "i" },
	{ pattern: /u/gi, ipaPattern: "w", replacement: "u" },

	// VOGAIS
	{ pattern: /[aá]/gi, ipaPattern: "a",  replacement: "á" },
	{ pattern: /a/gi,    ipaPattern: "ɐ",  replacement: "a" },
	{ pattern: /[eé]/gi, ipaPattern: "ɛ",  replacement: "é" },
	{ pattern: /[eê]/gi, ipaPattern: "e",  replacement: "ê" },
	{ pattern: /e/gi,    ipaPattern: "ə",  replacement: "e" },
	{ pattern: /i/gi,    ipaPattern: "i",  replacement: "i" },
	{ pattern: /[oó]/gi, ipaPattern: "ɔ",  replacement: "ó" },
	{ pattern: /o/gi,    ipaPattern: "o",  replacement: "o" },
	{ pattern: /o/gi,    ipaPattern: "u",  replacement: "u" },
	{ pattern: /u/gi,    ipaPattern: "u",  replacement: "u" },
];


const mapaGrave = {
	a: "à", á: "ǎ",
	e: "è", é: "ě",
	i: "ì",
	o: "ò", ó: "ǒ",
	u: "ù",
};



const sonsIgnorados = new Set(["ˈ", ".", "̃"]);
function ignorarSom(som, index) {
	index++;
	return sonsIgnorados.has(som);
}


/**
 * @brief Aplica as regras do Luzofonema à string fornecida.
 * A substituição é feita apenas se o caractere da palavra coincidir com o som no IPA.
 *
 * @param {string} palavra - A palavra original.
 * @param {string} ipa - A transcrição fonética IPA da palavra.
 * @return {string} Palavra convertida.
 */
function aplicarLuzofonema(palavra, ipa) {

	const resultado = [];
	const wordArray = palavra.split(""); // array de caracteres
	const ipaArray = ipa.split("").slice(1, ipa.length - 1); // array de símbolos IPA

	let tIndex = ipaArray.indexOf("ˈ"); // indíce do caracter tónico "ˈ"
	console.log(tIndex);

	const maxIndex = Math.max(wordArray.length, ipaArray.length);
	let wIndex = 0;
	let iIndex = 0;
	let tonica = false;

	while (wIndex < maxIndex && iIndex < maxIndex) {

		const letra = wordArray[wIndex] || "";
		const som = ipaArray[iIndex] || "";
		const contexto = palavra.slice(Math.max(0, wIndex - 2), wIndex + 3);

		let novaLetra = letra;

		console.log(wIndex, letra, letra.charCodeAt(0), iIndex, som, som.charCodeAt(0), contexto);

		if (ignorarSom(som)) continue;

		for (const { pattern, ipaPattern, replacement, advance } of luzofonemaRules) {
			const re = new RegExp(pattern, "i");
			if (!contexto.match(re)) continue;
			if (ipaPattern && (som != ipaPattern)) continue;

			console.log(pattern, ipaPattern, replacement, advance);

			novaLetra = replacement;

			// Aplica acento grave se esta é a vogal tónica
			if (iIndex >= tIndex && /[aeiouáéíóú]/i.test(letra) && !tonica) {
				novaLetra = mapaGrave[novaLetra] || novaLetra;
				tonica = true;
			}

			wIndex += advance ?? 0;
			break;
		}

		if (novaLetra != "") iIndex++;

		resultado.push(novaLetra);
		console.log(resultado.join(""));
		wIndex++;
	}

	return resultado.join("");
}

module.exports = { aplicarLuzofonema };
