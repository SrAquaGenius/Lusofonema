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
	{ pattern: /a/gi, ipaPattern: "a",  replacement: "á" },
	{ pattern: /a/gi, ipaPattern: "ɐ",  replacement: "a" },
	{ pattern: /e/gi, ipaPattern: "ɛ",  replacement: "é" },
	{ pattern: /o/gi, ipaPattern: "ɔ",  replacement: "ó" },
];


const sonsIgnorados = new Set(["ˈ", ".", "̃"]);
function ignorarSom(som) {
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

	const maxIndex = Math.max(wordArray.length, ipaArray.length);
	let wIndex = 0;
	let iIndex = 0;

	while (wIndex < maxIndex && iIndex < maxIndex) {

		const letra = wordArray[wIndex] || "";
		const som = ipaArray[iIndex] || "";
		const contexto = palavra.slice(Math.max(0, wIndex - 2), wIndex + 3);

		let novaLetra = letra;

		console.log(wIndex, letra, letra.charCodeAt(0), iIndex, som, som.charCodeAt(0), contexto);

		if (ignorarSom(som)) {
			iIndex++;
			continue;
		}

		if (letra == som) {
			wIndex++;
			iIndex++;
			resultado.push(novaLetra);
			console.log(resultado.join(""));
			continue;
		}

		for (const { pattern, ipaPattern, replacement, advance } of luzofonemaRules) {
			const re = new RegExp(pattern, "i");
			if (!contexto.match(re)) continue;
			if (ipaPattern && (som != ipaPattern)) continue;

			console.log(pattern, ipaPattern, replacement, advance);

			novaLetra = replacement;
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

module.exports = { aplicarLuzofonema, luzofonemaRules };
