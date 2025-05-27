/* ----------------------------------------------------------------------------
* File:     regras.js
* Authors:  SrAqua
* ------------------------------------------------------------------------- */

const { debug } = require("./debug");

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

	// ======================= DITONGOS =======================
	// Ditongos Orais
	{ pattern: /ai/gi,		ipaPattern: "aj", replacement: "ai" },
	{ pattern: /au/gi,		ipaPattern: "aw", replacement: "au" },
	{ pattern: /ei/gi,		ipaPattern: "ɐj", replacement: "ei" },
	{ pattern: /(éu|eu)/gi, ipaPattern: "ɛw", replacement: "éu" },
	{ pattern: /eu/gi,		ipaPattern: "ew", replacement: "eu" },
	{ pattern: /iu/gi,		ipaPattern: "iw", replacement: "iu" },
	{ pattern: /(ói|oi)/gi, ipaPattern: "ɔj", replacement: "ói" },
	{ pattern: /oi/gi,		ipaPattern: "oj", replacement: "oi" },
	{ pattern: /ou/gi,		ipaPattern: "ow", replacement: "ou" },
	{ pattern: /ui/gi,		ipaPattern: "uj", replacement: "ui" },

	// Ditongos Orais Estáveis
	{ pattern: /ua/gi,		ipaPattern: "wɐ", replacement: "ua" },
	{ pattern: /ue/gi,		ipaPattern: "we", replacement: "ue" },
	{ pattern: /ui/gi,		ipaPattern: "wi", replacement: "ui" },
	{ pattern: /uo/gi,		ipaPattern: "wɔ", replacement: "uo" },

	// Ditongos Nasais
	{ pattern: /ão/gi, ipaPattern: "ɐ̃w", replacement: "ão" },
	{ pattern: /ãe/gi, ipaPattern: "ɐ̃j", replacement: "ãe" },
	{ pattern: /õe/gi, ipaPattern: "õj", replacement: "õe" },


	// ==================== SONS VOCÁLICOS ====================
	// SEMIVOGAIS
	{ pattern: /i/gi, ipaPattern: "j", replacement: "i" },
	{ pattern: /u/gi, ipaPattern: "w", replacement: "u" },

	// VOGAIS
	{ pattern: /[aá](?![iu])/gi, ipaPattern: "a",  replacement: "á" },
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
	i: "ì", í: "ǐ",
	o: "ò", ó: "ǒ",
	u: "ù", ú: "ǔ",
};

const vogaisAgudas = /[áéíóú]/i;
const vogaisCarons = /[ǎěǐǒǔ]/i;
const vogaisFlexas = /[âêô]/i;
const vogaisTildes = /[ãõ]/i;

/**
 * Aplica acento tónico grave (ou caron) à vogal tónica indicada pelo marcador ˈ.
 * Só aplica acento se nenhuma vogal já estiver acentuada (aguda ou caron).
 */
function aplicarTonicidade(palavra) {
	const chars = palavra.split("");
	const tIndex = chars.indexOf("ˈ");
	if (tIndex === -1) return palavra; // sem marcador, retorna como está

	// Estatísticas
	let agudos = 0;
	let temTilde = false;
	let temFlexo = false;

	for (const c of chars) {
		if (vogaisAgudas.test(c)) agudos++;
		if (vogaisTildes.test(c)) temTilde = true;
		if (vogaisFlexas.test(c)) temFlexo = true;
	}

	// Procura vogal tónica
	let tonicaIndex = -1;
	for (let i = tIndex + 1; i < chars.length; i++) {
		if ("aeiouáéíóúâêôãõ".includes(chars[i].toLowerCase())) {
			tonicaIndex = i;
			break;
		}
	}
	if (tonicaIndex === -1) return palavra.replace("ˈ", ""); // sem vogal depois de ˈ

	const letraTonica = chars[tonicaIndex];

	// Caso 1: mistura de acentos (e tónica é til ou circunflexo) → não fazer nada
	if ((temTilde || temFlexo) && (vogaisTildes.test(letraTonica) || vogaisFlexas.test(letraTonica))) {
		return palavra.replace("ˈ", "");
	}

	// Caso 2: só um agudo → manter como está
	if (agudos === 1 && vogaisAgudas.test(letraTonica)) {
		return palavra.replace("ˈ", "");
	}

	// Caso 3: vários agudos → transformar agudo tónico em caron
	if (agudos > 1 && vogaisAgudas.test(letraTonica)) {
		chars[tonicaIndex] = mapaGrave[letraTonica] || letraTonica;
		return chars.filter(c => c !== "ˈ").join("");
	}

	// Caso 4: sem acento visível → aplicar acento grave na vogal tónica
	if (agudos === 0 && !temTilde && !temFlexo) {
		chars[tonicaIndex] = mapaGrave[letraTonica] || letraTonica;
	}

	// Remove o marcador ˈ e retorna
	return chars.filter(c => c !== "ˈ").join("");
}


/**
 * @brief Aplica as regras do Luzofonema à string fornecida.
 * A substituição é feita apenas se o caractere da palavra coincidir com o som no IPA.
 *
 * @param {string} palavra - A palavra original.
 * @param {string} ipa - A transcrição fonética IPA da palavra.
 * @return {string} Palavra convertida.
 */
function aplicarLuzofonema(palavraOriginal, ipaOriginal) {

	debug(palavraOriginal, ipaOriginal);

	const resultado = [];
	const word = palavraOriginal;
	const wordArray = palavraOriginal.split("");
	const ipa = ipaOriginal.slice(1, -1); // tira barras indicadores de IPA
	const ipaArray = ipa.split("");

	let wIndex = 0;
	let iIndex = 0;

	while (wIndex < wordArray.length && iIndex < ipaArray.length) {

		const letra = wordArray[wIndex] || "";
		const som = ipaArray[iIndex] || "";

		const wordContext = word.slice(Math.max(0, wIndex - 2), wIndex + 3);
		const ipaContext = ipa.slice(Math.max(0, wIndex - 2), wIndex + 3);

		let novaLetra = letra;

		debug(wIndex, letra, wordContext, iIndex, som, ipaContext);

		// Ignorar marcadores ou símbolos não alfabéticos (ex: ˈ)
		if (letra.charCodeAt(0) > "ˈ".charCodeAt(0)) {
			wIndex++;
			continue;
		}
		if (som.charCodeAt(0) > "ˈ".charCodeAt(0)) {
			iIndex++;
			continue;
		}

		// Lidar com acento tónico ˈ
		if (som === "ˈ") {
			resultado.push("ˈ");
			iIndex++;
			continue;
		}

		let regraAplicada = false;

		for (const { pattern, ipaPattern, replacement, advance } of luzofonemaRules) {
			const wordRegex = new RegExp(pattern, "i");
			const ipaRegex = new RegExp(ipaPattern, "i");

			debug(wordRegex, ipaRegex, pattern, ipaPattern, replacement);

			if (!wordContext.match(wordRegex)) continue;
				
			if (ipaPattern && som !== ipaPattern) continue;

			debug("✔️ Regra aplicada:", pattern, ipaPattern, replacement);

			novaLetra = replacement;
			resultado.push(novaLetra);

			const passo = (advance ?? 0) + 1;
			wIndex += passo;
			iIndex += passo;
			regraAplicada = true;
			break;
		}

		if (!regraAplicada) {
			// nenhuma regra aplicada, copia a letra como está
			resultado.push(novaLetra);
			wIndex++;
			iIndex++;
		}

		debug("🔡 Resultado parcial:", resultado.join(""));
	}

	return aplicarTonicidade(resultado.join(""));
}

module.exports = { aplicarLuzofonema };
