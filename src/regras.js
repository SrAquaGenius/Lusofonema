/* ----------------------------------------------------------------------------
* File:     regras.js
* Authors:  SrAqua
* ------------------------------------------------------------------------- */


/**
 * @brief Cada regra corresponde a:
 * - `reg`: expressão regular sobre a forma escrita da palavra
 * - `ipaReg`: som IPA esperado na mesma posição
 * - `out`: substituição na ortografia
 * - `adv`: (opcional) número extra de avanços a fazer no índice da palavra
 */
const regras = [ 

	// ========================== SONS CONSOANTÍCOS ===========================

	// ---------------------- Consoantes Oclusivas (C-O) ----------------------
	{ reg: /p/gi,	ipaReg: "p",	out: "p" },				// Pato
	{ reg: /b/gi,	ipaReg: "b",	out: "b" },				// Bola
	{ reg: /t/gi,	ipaReg: "t",	out: "t" },				// Teto
	{ reg: /d/gi,	ipaReg: "d",	out: "d" },				// Dado
	{ reg: /g/gi,	ipaReg: "g",	out: "g" },				// Gato
	{ reg: /c/gi,	ipaReg: "k",	out: "c" },				// Casa
	{ reg: /k/gi,	ipaReg: "k",	out: "c" },				// Kilo → Cilo
	{ reg: /qu(?=[ei])/gi,
					ipaReg: "k",	out: "c",	adv: 1 },	// Queijo → Ceijo
	{ reg: /q(?=u[ao])/gi,
					ipaReg: "k",	out: "c" },				// Quanto → Cuanto

	// --------------------- Consoantes Fricativas (C-F) ----------------------
	{ reg: /f/gi,	ipaReg: "f",	out: "f" },				// Faca
	{ reg: /v/gi,	ipaReg: "v",	out: "v" },				// Vaca
	{ reg: /s/gi,	ipaReg: "s",	out: "s" },				// Sapo
	{ reg: /s/gi,	ipaReg: "ʃ",	out: "s" },				// Cesta
	{ reg: /ss/gi,	ipaReg: "s",	out: "s" },				// Massa → Masa
	{ reg: /ce/gi,	ipaReg: "s",	out: "se" },			// Cedo → Sedo
	{ reg: /ci/gi,	ipaReg: "s",	out: "si" },			// Cinema → Sinema
	{ reg: /ç/gi,	ipaReg: "s",	out: "s" },				// Lição → Lisão
	{ reg: /z/gi,	ipaReg: "ʃ",	out: "s" },				// Fiz → Fis
	{ reg: /(?<=[aeiouáéíóú])x(?=[aeiouáéíóúãõ])/gi,
					ipaReg: "s",	out: "s" },				// Máximo → Másimo
	{ reg: /z/gi,	ipaReg: "z",	out: "z" },				// Zero
	{ reg: /(?<=[aeiouáéíóúãõ])s(?=[aeiouáéíóúãõ])/gi,
					ipaReg: "z",	out: "z" },				// Casa → Caza
	{ reg: /(?<=[aeiouáéíóú])x(?=[aeiouáéíóú])/gi,
					ipaReg: "z",	out: "z" },				// Exame → Ezame
	{ reg: /x/gi,	ipaReg: "ʃ",	out: "x" },				// Bruxa
	{ reg: /ch/gi,	ipaReg: "ʃ",	out: "x" },				// Chave → Xave
	{ reg: /ex/gi,	ipaReg: "ɐjʃ",	out: "eis" },			// Texto → Teisto
	{ reg: /j/gi,	ipaReg: "ʒ",	out: "j" },				// Jogo
	{ reg: /g(?=[eiyéíèìêîĩẽ])/gi,
					ipaReg: "ʒ",	out: "j" },				// Girafa → Jirafa

	// -------------- Par Consoantal Oclusivo-Fricativo (PC-OF) ---------------
	{ reg: /x/gi,	ipaReg: "ks",	out: "ç" },				// Fluxo → Fluço

	// ----------------------- Consoantes Nasais (C-N) ------------------------
	{ reg: /m/gi,	ipaReg: "m",	out: "m" },				// Mão
	{ reg: /n/gi,	ipaReg: "n",	out: "n" },				// Nuvem
	{ reg: /nh/gi,	ipaReg: "ɲ",	out: "nh",	adv: 1 },	// Manhã

	// ---------------------- Consoantes Laterais (C-L) -----------------------
	{ reg: /l/gi,	ipaReg: "l",	out: "l" },				// Lata
	{ reg: /lh/gi,	ipaReg: "ʎ",	out: "lh",	adv: 1 },	// Milho

	// ---------------------- Consoantes Vibrantes (C-V) ----------------------
	{ reg: /r/gi,	ipaReg: "ɾ",	out: "r" },				// Paro
	{ reg: /r/gi,	ipaReg: "ʁ",	out: "r" },				// Rato
	{ reg: /rr/gi,	ipaReg: "ʁ",	out: "rr",	adv: 1 },	// Carro


	// ============================= LETRAS MUDAS =============================

	{ reg: /(?<=[g])u(?=[e,i])/gi,	ipaReg: "",	out: "" },		// Guito → Gito
	{ reg: /(?<![ln])h/gi,			ipaReg: "",	out: "" },		// Hiena - Iena


	// =============================== DITONGOS ===============================
	
	// ---------------------------- Ditongos Orais ----------------------------
	{ reg: /ai/gi,	ipaReg: "aj",	out: "ai",	adv: 1 },		// Pai
	{ reg: /au/gi,	ipaReg: "aw",	out: "au",	adv: 1 },		// Pau
	{ reg: /ei/gi,	ipaReg: "ɐj",	out: "ei",	adv: 1 },		// Sei
	{ reg: /(éu|eu)/gi,
					ipaReg: "ɛw",	out: "éu",	adv: 1 },		// Céu
	{ reg: /eu/gi,	ipaReg: "ew",	out: "eu",	adv: 1 },		// Meu
	{ reg: /iu/gi,	ipaReg: "iw",	out: "iu",	adv: 1 },		// Piu
	{ reg: /(ói|oi)/gi,
					ipaReg: "ɔj",	out: "ói",	adv: 1 },		// Dói
	{ reg: /oi/gi,	ipaReg: "oj",	out: "oi",	adv: 1 },		// Foi
	{ reg: /ou/gi,	ipaReg: "ow",	out: "ou",	adv: 1 },		// Sou
	{ reg: /ui/gi,	ipaReg: "uj",	out: "ui",	adv: 1 },		// Fui
	
	// ----------------------- Ditongos Orais Estáveis ------------------------
	{ reg: /ua/gi,	ipaReg: "wɐ",	out: "ua",	adv: 1 },		// Quadro
	{ reg: /ue/gi,	ipaReg: "we",	out: "ue",	adv: 1 },		// Aguentar
	{ reg: /ui/gi,	ipaReg: "wi",	out: "ui",	adv: 1 },		// Arguido
	{ reg: /uo/gi,	ipaReg: "wɔ",	out: "uo",	adv: 1 },		// Quota
	
	// --------------------------- Ditongos Nasais ----------------------------
	{ reg: /ão/gi,	ipaReg: "ɐ̃w",	out: "ão",	adv: 1 },		// Pão
	{ reg: /ãe/gi,	ipaReg: "ɐ̃j",	out: "ãe",	adv: 1 },		// Mãe
	{ reg: /õe/gi,	ipaReg: "õj",	out: "õe",	adv: 1 },		// Visões
	{ reg: /am/gi,	ipaReg: "ɐ̃w",	out: "ão",	adv: 1 , l: 0 },	// Cantam → Càntão


	// ============================ SONS VOCÁLICOS ============================

	// --------------------------- Semivogais (SV) ----------------------------
	{ reg: /i/gi,	ipaReg: "j",	out: "i" },				// Pai
	{ reg: /u/gi,	ipaReg: "w",	out: "u" },				// Quadro

	// ------------------------- Vogais Nasais (V-N) --------------------------
	{ reg: /an/gi,	ipaReg: "ɐ̃",	out: "an",	adv: 1 },		// Manta
	{ reg: /am/gi,	ipaReg: "ɐ̃",	out: "an",	adv: 1 },		// Campo → Canpo
	{ reg: /en/gi,	ipaReg: "ẽ",	out: "en",	adv: 1 },		// Quente
	{ reg: /em/gi,	ipaReg: "ẽ",	out: "en",	adv: 1 },		// Bem → Ben
	{ reg: /in/gi,	ipaReg: "ĩ",	out: "in",	adv: 1 },		// Finta
	{ reg: /im/gi,	ipaReg: "ĩ",	out: "in",	adv: 1 },		// Fim → Fin
	{ reg: /on/gi,	ipaReg: "õ",	out: "on",	adv: 1 },		// Contar
	{ reg: /om/gi,	ipaReg: "õ",	out: "on",	adv: 1 },		// Bom → Bon
	{ reg: /un/gi,	ipaReg: "ũ",	out: "un",	adv: 1 },		// Fundo
	{ reg: /um/gi,	ipaReg: "ũ",	out: "un",	adv: 1 },		// Um → Un
	
	// -------------------------- Vogais Orais (V-O) --------------------------
	{ reg: /[aá](?![iu])/gi,	ipaReg: "a",	out: "á" },		// Pá
	{ reg: /[aâ]/gi,			ipaReg: "ɐ",	out: "a" },		// Cama
	{ reg: /[eé]/gi,			ipaReg: "ɛ",	out: "é" },		// Pé
	{ reg: /[eê]/gi,			ipaReg: "e",	out: "e" },		// Mesa
	{ reg: /e/gi,				ipaReg: "ə",	out: "e" },		// Sede
	{ reg: /[ií]/gi,			ipaReg: "i",	out: "i" },		// Vida
	{ reg: /[oó]/gi,			ipaReg: "ɔ",	out: "ó" },		// Pó
	{ reg: /o/gi,				ipaReg: "o",	out: "o" },		// Ovo
	{ reg: /o/gi,				ipaReg: "u",	out: "u" },		// Conto
	{ reg: /[uú]/gi,			ipaReg: "u",	out: "u" },		// Luz
];


module.exports = { regras };
