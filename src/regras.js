/* ----------------------------------------------------------------------------
* File:     regras.js
* Authors:  SrAqua
* ------------------------------------------------------------------------- */

const { debug } = require("./debug");
const { aplicarTonicidade } = require('./tonicidade');
const { separarSilabas, marcarHiatos } = require('./silabas');

/**
 * @brief Cada regra corresponde a:
 * - `pattern`: expressão regular sobre a forma escrita da palavra
 * - `ipaPattern`: som IPA esperado na mesma posição
 * - `out`: substituição na ortografia
 * - `advance`: (opcional) número extra de avanços a fazer no índice da palavra
 */
const rules = [ 

	// ========================== SONS CONSOANTÍCOS ===========================

	// ---------------------- Consoantes Oclusivas (C-O) ----------------------
	{ pattern: /p/gi,	ipaPattern: "p", out: "p" },				// Pato
	{ pattern: /b/gi,	ipaPattern: "b", out: "b" },				// Bola
	{ pattern: /t/gi,	ipaPattern: "t", out: "t" },				// Teto
	{ pattern: /d/gi,	ipaPattern: "d", out: "d" },				// Dado
	{ pattern: /k/gi,	ipaPattern: "k", out: "c" },				// Casa
	{ pattern: /qu(?=[ei])/gi,
						ipaPattern: "k", out: "c", advance: 1 },	// Queijo
	{ pattern: /q(?=u[ao])/gi, ipaPattern: "k", out: "c" },			// Quanto
	{ pattern: /g/gi,	ipaPattern: "g", out: "g" },				// Gato

	// --------------------- Consoantes Fricativas (C-F) ----------------------
	{ pattern: /f/gi,	ipaPattern: "f", out: "f" },				// Faca
	{ pattern: /v/gi,	ipaPattern: "v", out: "v" },				// Vaca
	{ pattern: /s/gi,	ipaPattern: "s", out: "s" },				// Sapo
	{ pattern: /s/gi,	ipaPattern: "ʃ", out: "s" },				// Cesta
	{ pattern: /ss/gi,	ipaPattern: "s", out: "s" },				// Massa
	{ pattern: /c(?=[e,i])/gi, ipaPattern: "s", out: "s" },			// Cinema
	{ pattern: /ç/gi,	ipaPattern: "s", out: "s" },				// Lição
	{ pattern: /z/gi,	ipaPattern: "ʃ", out: "s" },				// Fiz
	{ pattern: /(?<=[aeiouáéíóú])x(?=[aeiouáéíóúãõ])/gi,
						ipaPattern: "s", out: "s" },				// Máximo
	{ pattern: /z/gi,	ipaPattern: "z", out: "z" },				// Zero
	{ pattern: /(?<=[aeiouáéíóúãõ])s(?=[aeiouáéíóúãõ])/gi, 
						ipaPattern: "z", out: "z" },				// Casa
	{ pattern: /(?<=[aeiouáéíóú])x(?=[aeiouáéíóú])/gi,
						ipaPattern: "z", out: "z" },				// Exame
	{ pattern: /x/gi,	ipaPattern: "ʃ", out: "x" },				// Bruxa
	{ pattern: /ch/gi,	ipaPattern: "ʃ", out: "x" },				// Chave
	{ pattern: /ex/gi, 	ipaPattern: "ɐjʃ", out: "eis" },			// Texto
	{ pattern: /j/gi,	ipaPattern: "ʒ", out: "j" },				// Jogo
	{ pattern: /g(?=[eiyéí])/gi, ipaPattern: "ʒ", out: "j" },		// Gente

	// -------------- Par Consoantal Oclusivo-Fricativo (PC-OF) ---------------
	{ pattern: /x/gi,	ipaPattern: "ks", out: "ç" },				// Fluxo

	// ----------------------- Consoantes Nasais (C-N) ------------------------
	{ pattern: /m/gi,	ipaPattern: "m", out: "m" },				// Mão
	{ pattern: /n/gi,	ipaPattern: "n", out: "n" },				// Nuvem
	{ pattern: /nh/gi,	ipaPattern: "ɲ", out: "nh", advance: 1 },	// Manhã
	{ pattern: /(?<=[aeiou])m(?=[ pb])/gi,
						ipaPattern: "n", out: "n" },				// Campo

	// ---------------------- Consoantes Laterais (C-L) -----------------------
	{ pattern: /l/gi,	ipaPattern: "l", out: "l" },				// Lata
	{ pattern: /lh/gi,	ipaPattern: "ʎ",  out: "lh", advance: 1 },	// Milho

	// ---------------------- Consoantes Vibrantes (C-V) ----------------------
	{ pattern: /r/gi,	ipaPattern: "ɾ", out: "r" },				// Raro
	{ pattern: /rr/gi,	ipaPattern: "ʁ", out: "rr", advance: 1 },	// Raro


	// ============================ SONS VOCÁLICOS ============================

	// --------------------------- Semivogais (SV) ----------------------------
	{ pattern: /i/gi,	ipaPattern: "j", out: "i" },				// Pai
	{ pattern: /u/gi,	ipaPattern: "w", out: "u" },				// Quadro

	// -------------------------- Vogais Orais (V-O) --------------------------
	{ pattern: /[aá](?![iu])/gi, ipaPattern: "a",  out: "á" },		// Pá
	{ pattern: /a/gi,	ipaPattern: "ɐ",  out: "a" },				// Cama
	{ pattern: /[eé]/gi, ipaPattern: "ɛ",  out: "é" },				// Pé
	{ pattern: /[eê]/gi, ipaPattern: "e",  out: "ê" },				// Mesa
	{ pattern: /e/gi,	ipaPattern: "ə",  out: "e" },				// Sede
	{ pattern: /[ií]/gi, ipaPattern: "i",  out: "i" },				// Vida
	{ pattern: /[oó]/gi, ipaPattern: "ɔ",  out: "ó" },				// Pó
	{ pattern: /o/gi,	ipaPattern: "o",  out: "o" },				// Ovo
	{ pattern: /o/gi,	ipaPattern: "u",  out: "u" },				// Conto
	{ pattern: /[uú]/gi, ipaPattern: "u", out: "u" },				// Luz

	// ------------------------- Vogais Nasais (V-N) --------------------------
	{ pattern: /an/gi,	ipaPattern: "ɐ̃", out: "an", advance: 1 },	// Manta
	{ pattern: /â/gi,	ipaPattern: "ɐ̃", out: "an", advance: 1 },	// Constância
	{ pattern: /en/gi,	ipaPattern: "ẽ", out: "en", advance: 1 },	// Quente
	{ pattern: /in/gi,	ipaPattern: "ĩ", out: "in", advance: 1 },	// Fim
	{ pattern: /on/gi,	ipaPattern: "õ", out: "on", advance: 1 },	// Bom
	{ pattern: /un/gi,	ipaPattern: "ũ", out: "un", advance: 1 },	// Um


	// =============================== DITONGOS ===============================

	// ---------------------------- Ditongos Orais ----------------------------
	{ pattern: /ai/gi,		ipaPattern: "aj", out: "ai" },			// Pai
	{ pattern: /au/gi,		ipaPattern: "aw", out: "au" },			// Pau
	{ pattern: /ei/gi,		ipaPattern: "ɐj", out: "ei" },			// Sei
	{ pattern: /(éu|eu)/gi, ipaPattern: "ɛw", out: "éu" },			// Céu
	{ pattern: /eu/gi,		ipaPattern: "ew", out: "eu" },			// Meu
	{ pattern: /iu/gi,		ipaPattern: "iw", out: "iu" },			// Piu
	{ pattern: /(ói|oi)/gi, ipaPattern: "ɔj", out: "ói" },			// Dói
	{ pattern: /oi/gi,		ipaPattern: "oj", out: "oi" },			// Foi
	{ pattern: /ou/gi,		ipaPattern: "ow", out: "ou" },			// Sou
	{ pattern: /ui/gi,		ipaPattern: "uj", out: "ui" },			// Fui

	// ----------------------- Ditongos Orais Estáveis ------------------------
	{ pattern: /ua/gi, ipaPattern: "wɐ", out: "ua" },				// Quadro
	{ pattern: /ue/gi, ipaPattern: "we", out: "ue" },				// Aguentar
	{ pattern: /ui/gi, ipaPattern: "wi", out: "ui" },				// Arguido
	{ pattern: /uo/gi, ipaPattern: "wɔ", out: "uo" },				// Quota

	// --------------------------- Ditongos Nasais ----------------------------
	{ pattern: /ão/gi, ipaPattern: "ɐ̃w", out: "ão" },				// Pão
	{ pattern: /ãe/gi, ipaPattern: "ɐ̃j", out: "ãe" },				// Mãe
	{ pattern: /õe/gi, ipaPattern: "õj", out: "õe" },				// Visões


	// ============================= LETRAS MUDAS =============================

	{ pattern: /(?<=[g])u(?=[e,i])/gi, ipaPattern: "",  out: "" },	// Guerra
	{ pattern: /(?<![ln])h/gi, ipaPattern: "",  out: "" },			// Hiena
];


/**
 * @brief Aplica as regras do Lusofonema sílaba a sílaba, com base em dados.
 * @param {object} dados Objeto com campos 'palavra' e 'ipa'.
 * @returns {string} Representação em Lusofonema.
 */
function aplicarLusofonemaPorSilaba(dados) {

	debug(dados);

	if (!dados.palavra || !dados.ipa) return "";

	const silabas = dados.palavra.split(".");
	const silabasIPA = dados.ipa.replace(/[\/]/g, "").split(".");

	debug(silabas);
	debug(silabasIPA);

	if (silabas.length !== silabasIPA.length) {
		error("Número de sílabas não coincide com o IPA. Fallback para modo linear.");
		return aplicarLusofonema(dados.palavra.replace(/\./g, ""), dados.ipa);
	}

	const resultado = [];

	for (let i = 0; i < silabas.length; i++) {
		const silaba = silabas[i];
		const silabaIPA = silabasIPA[i];
		const lusofonemaSilaba = aplicarRegrasASilaba(silaba, silabaIPA);
		resultado.push(lusofonemaSilaba);
	}

	return aplicarTonicidade(resultado);
}

/**
 * @brief Aplica regras fonéticas a uma sílaba da palavra e do IPA.
 * @param {string} silaba Ortografia da sílaba.
 * @param {string} ipa Transcrição IPA da sílaba.
 * @returns {string} Lusofonema da sílaba.
 */
function aplicarRegrasASilaba(silaba, ipa) {

	debug(silaba, ipa);

	const letras = silaba.split("");
	const sons = Array.from(
		new Intl.Segmenter("pt", { granularity: "grapheme" }).segment(ipa),
		s => s.segment
	);

	let wIndex = 0;
	let iIndex = 0;
	const res = [];

	while (wIndex < letras.length && iIndex < sons.length) {
		const letra = letras[wIndex];
		const som = sons[iIndex];
		let novaLetra = letra;

		let regraAplicada = false;

		for (const { pattern, ipaPattern, out, advance } of rules) {
			if (!pattern.test(letra)) continue;
			if (ipaPattern && !new RegExp(ipaPattern).test(som)) continue;

			novaLetra = out;
			wIndex += (advance ?? 0);
			regraAplicada = true;
			break;
		}

		res.push(novaLetra);
		wIndex++;
		iIndex++;
	}

	return res.join("");
}

/**
 * @brief Aplica as regras do Luzofonema à string fornecida.
 * A substituição é feita apenas se o caractere da palavra coincidir com o som no IPA.
 *
 * @param {string} palavra - A palavra original.
 * @param {string} ipa - A transcrição fonética IPA da palavra.
 * @return {string} Palavra convertida.
 */
function aplicarLusofonema(palavraOriginal, ipaOriginal) {

	debug(palavraOriginal, ipaOriginal);

	const resArray = [];
	const word = palavraOriginal;
	const wordArray = palavraOriginal.split("");
	const ipa = ipaOriginal.slice(1, -1).normalize("NFD");

	const segmenter = new Intl.Segmenter('pt', {granularity: 'grapheme'});
	const ipaArray = Array.from(segmenter.segment(ipa), s => s.segment);

	debug(ipaArray);

	let wIndex = 0;
	let iIndex = 0;

	while (wIndex < wordArray.length && iIndex < ipaArray.length) {

		const letra = wordArray[wIndex] || "";
		const som = ipaArray[iIndex] || "";

		const wordContext = word.slice(Math.max(0, wIndex - 2), wIndex + 3);
		const ipaContext = ipa.slice(Math.max(0, iIndex - 2), iIndex + 3);

		let novaLetra = letra;

		debug(wIndex, letra, wordContext, iIndex, som, ipaContext);

		// Lidar com acento tónico ˈ
		if (som === "ˈ") {
			resArray.push("ˈ");
			iIndex++;
			continue;
		}

		// Ignorar marcadores ou símbolos não alfabéticos
		if (letra.charCodeAt(0) > "ˈ".charCodeAt(0)) {
			wIndex++;
			continue;
		}
		if (som.charCodeAt(0) > "ˈ".charCodeAt(0)) {
			iIndex++;
			continue;
		}


		let regraAplicada = false;

		for (const { pattern, ipaPattern, out, advance } of rules) {
			const wordRegex = new RegExp(pattern, "i");
			const ipaRegex = new RegExp(ipaPattern, "i");

			//debug("wRegex: ", wordRegex, "iRegex: ", ipaRegex);
			//debug("Rule: ", pattern, ipaPattern, out);

			if (!wordContext.match(wordRegex)) continue;
			if (ipaPattern && !ipaRegex.test(ipaContext)) continue;
			if (!(ipaContext.match(ipaRegex)?.includes(som))) continue;

			debug("✔️ Regra aplicada:", pattern, ipaPattern, out);

			novaLetra = out;
			resArray.push(novaLetra);

			const passo = (advance ?? 0) + 1;
			wIndex += passo;
			iIndex++;
			regraAplicada = true;
			break;
		}

		if (!regraAplicada) {
			debug("Nenhuma regra aplicada");
			resArray.push(novaLetra);
			wIndex++;
			iIndex++;
		}

		debug("🔡 resArray parcial:", resArray.join(""));
	}

	let silabas = separarSilabas(resArray.join(""));
	silabas = marcarHiatos(silabas);

	return aplicarTonicidade(silabas);
}

module.exports = { aplicarLusofonema, aplicarLusofonemaPorSilaba };
