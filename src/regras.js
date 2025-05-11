/* ----------------------------------------------------------------------------
 * File:     regras.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

/**
 * @brief Regras de conversão fonética para ortografia Luzofonema.
 * Cada regra é aplicada sequencialmente para transformar uma palavra
 * baseada na sua forma ortográfica ou fonética.
 */
const luzofonemaRules = [

	// /z/ é sempre "z"
	{ pattern: /(?<=[aeiou])s(?=[aeiou])/gi, replacement: "z" },

	// /s/ é sempre "s"
	{ pattern: /ç/gi, replacement: "s" },
	{ pattern: /ss/gi, replacement: "s" },
	{ pattern: /c(?=[e,i])/gi, replacement: "s" },

	// /k/ é sempre "c"
	{ pattern: /qu(?=[ei])/gi, replacement: "c" },
	{ pattern: /q(?=u[ao])/gi, replacement: "c" },
	{ pattern: /k/gi, replacement: "c" },

	// /ʃ/ é sempre "x"
	{ pattern: /ch/gi, replacement: "x" },

	// /ʒ/ é sempre "j"
	{ pattern: /g(?=[eiy])/gi, replacement: "j" },

	// Remover "u" não pronunciado (ex: "guerra" → "gerra")
	{ pattern: /(?<=[g])u(?=[e,i])/gi, replacement: "" },

	// Queda do "h" se não for antecedido por "l" ou "n"
	{ pattern: /(?<![ln])h/gi, replacement: "" },

	// Som nasal com "m" passar para som nasal com "n"
	{ pattern: /(?<=[aeiou])m(?=[ pb])/gi, replacement: "n" },

	// Regras especiais para o "x" com base no IPA:
	// "x" → "ç" se for pronunciado como /ks/
	{ pattern: /x/gi, ipaPattern: "ks", replacement: "ç" },

	// "x" → "z" se for pronunciado como /z/
	{ pattern: /(?<=[aeiou])x(?=[aeiou])/gi, ipaPattern: "z", replacement: "z" },

	// "x" → "s" se for pronunciado como /s/
	{ pattern: /(?<=[aeiouáé])x(?=[aeiouãõ])/gi, ipaPattern: "s", replacement: "s" },

	// "ex" → "eis" se for pronunciado como /ɐjʃ/
	{ pattern: /ex/gi, ipaPattern: "ɐjʃ", replacement: "eis" },
 { pattern: /iam/gi, replacement: "íão" }
];

/**
 * @brief Aplica as regras do Luzofonema à string fornecida.
 * 
 * @param {string} texto - A palavra ou fonema a converter.
 * @param {string} ipa - A transcrição fonética IPA da palavra.
 * @return <string> Palavra convertida.
 */
function aplicarLuzofonema(palavra, ipa) {
	let resultado = palavra;

	// Aplicar regras especiais para "x" baseado no IPA
	for (const { pattern, ipaPattern, replacement } of luzofonemaRules) {
		// Verificar se o padrão IPA corresponde
		if (ipaPattern && ipa.includes(ipaPattern)) {
			resultado = resultado.replace(pattern, replacement);
		}
		// Aplicar regras normais
		else if (!ipaPattern) {
			resultado = resultado.replace(pattern, replacement);
		}
	}

	return resultado;
}

module.exports = { aplicarLuzofonema, luzofonemaRules };
