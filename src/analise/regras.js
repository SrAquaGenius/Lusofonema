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

	// ========================== SIMBOLO TONICIDADE ==========================
	{ reg: /ˈ/,	ipaReg: /ˈ/, out: "ˈ" },

	// ========================== SONS CONSOANTÍCOS ===========================

	// ---------------------- Consoantes Oclusivas (C-O) ----------------------
	{ reg: /p/i,	ipaReg: /p/i,	out: "p" },				// Pato
	{ reg: /b/i,	ipaReg: /b/i,	out: "b" },				// Bola
	{ reg: /t/i,	ipaReg: /t/i,	out: "t" },				// Teto
	{ reg: /d/i,	ipaReg: /d/i,	out: "d" },				// Dado
	{ reg: /g/i,	ipaReg: /g/i,	out: "g" },				// Gato
	{ reg: /c/i,	ipaReg: /k/i,	out: "c" },				// Casa
	{ reg: /k/i,	ipaReg: /k/i,	out: "c" },				// Kilo → Cilo
	{ reg: /qu(?=[ei])/i,
					ipaReg: /k/i,	out: "c",	adv: 1 },	// Queijo → Ceijo
	{ reg: /q(?=u[ao])/i,
					ipaReg: /k/i,	out: "c" },				// Quanto → Cuanto

	// --------------------- Consoantes Fricativas (C-F) ----------------------
	{ reg: /f/i,	ipaReg: /f/i,	out: "f" },				// Faca
	{ reg: /v/i,	ipaReg: /v/i,	out: "v" },				// Vaca
	{ reg: /s/i,	ipaReg: /s/i,	out: "s" },				// Sapo
	{ reg: /s/i,	ipaReg: /ʃ/i,	out: "s" },				// Cesta
	{ reg: /ss/i,	ipaReg: /s/i,	out: "s" },				// Massa → Masa
	{ reg: /ce/i,	ipaReg: /s/i,	out: "se" },			// Cedo → Sedo
	{ reg: /ci/i,	ipaReg: /s/i,	out: "si" },			// Cinema → Sinema
	{ reg: /ç/i,	ipaReg: /s/i,	out: "s" },				// Lição → Lisão
	{ reg: /z/i,	ipaReg: /ʃ/i,	out: "s" },				// Fiz → Fis
	{ reg: /(?<=[aeiouáéíóú])x(?=[aeiouáéíóúãõ])/i,
					ipaReg: /s/i,	out: "s" },				// Máximo → Másimo
	{ reg: /z/i,	ipaReg: /z/i,	out: "z" },				// Zero
	{ reg: /(?<=[aeiouáéíóúãõ])s(?=[aeiouáéíóúãõ])/i,
					ipaReg: /z/i,	out: "z" },				// Casa → Caza
	{ reg: /s(?=[aeiouáéíóúãõ])/i,
					ipaReg: /z/i,	out: "z"}, 				// 's*'|'z*' → 'z*'
	{ reg: /(?<=[aeiouáéíóú])x(?=[aeiouáéíóú])/i,
					ipaReg: /z/i,	out: "z" },				// Exame → Ezame
	{ reg: /x(?=[aeiouáéíóúãõ])/i,
					ipaReg: /z/i,	out: "z" },				// 'x'|'z' → 'z'
	{ reg: /x/i,	ipaReg: /ʃ/i,	out: "x" },				// Bruxa
	{ reg: /ch/i,	ipaReg: /ʃ/i,	out: "x" },				// Chave → Xave
	{ reg: /ex/i,	ipaReg: /ɐjʃ/i,	out: "eis" },			// Texto → Teisto
	{ reg: /j/i,	ipaReg: /ʒ/i,	out: "j" },				// Jogo
	{ reg: /g(?=[eiyéíèìêîĩẽ])/i,
					ipaReg: /ʒ/i,	out: "j" },				// Girafa → Jirafa

	// -------------- Par Consoantal Oclusivo-Fricativo (PC-OF) ---------------
	{ reg: /x/i,	ipaReg: /ks/i,	out: "ç" },				// Fluxo → Fluço

	// ----------------------- Consoantes Nasais (C-N) ------------------------
	{ reg: /m/i,	ipaReg: /m/i,	out: "m" },				// Mão
	{ reg: /n/i,	ipaReg: /n/i,	out: "n" },				// Nuvem
	{ reg: /nh/i,	ipaReg: /ɲ/i,	out: "nh",	adv: 1 },	// Manhã

	// ---------------------- Consoantes Laterais (C-L) -----------------------
	{ reg: /l/i,	ipaReg: /l/i,	out: "l" },				// Lata
	{ reg: /lh/i,	ipaReg: /ʎ/i,	out: "lh",	adv: 1 },	// Milho

	// ---------------------- Consoantes Vibrantes (C-V) ----------------------
	{ reg: /r/i,	ipaReg: /ɾ/i,	out: "r" },				// Faro
	{ reg: /r/i,	ipaReg: /ʁ/i,	out: "r" },				// Rato
	{ reg: /rr/i,	ipaReg: /ʁ/i,	out: "rr",	adv: 1 },	// Carro


	// ============================= LETRAS MUDAS =============================

	{ reg: /(?<=[g])u(?=[e,i])/i,	out: "" },			// Guerra → Gerra
	{ reg: /(?<![ln])h/i,			out: "" },			// Hiena - Iena


	// =============================== DITONGOS ===============================
	
	// ---------------------------- Ditongos Orais ----------------------------
	{ reg: /ai/i,	ipaReg: /aj/i,	out: "ai",	adv: 1 },		// Pai
	{ reg: /au/i,	ipaReg: /aw/i,	out: "au",	adv: 1 },		// Pau
	{ reg: /ei/i,	ipaReg: /ɐj/i,	out: "ei",	adv: 1 },		// Sei
	{ reg: /(éu|eu)/i,
					ipaReg: /ɛw/i,	out: "éu",	adv: 1 },		// Céu
	{ reg: /eu/i,	ipaReg: /ew/i,	out: "eu",	adv: 1 },		// Meu
	{ reg: /iu/i,	ipaReg: /iw/i,	out: "iu",	adv: 1 },		// Piu
	{ reg: /(ói|oi)/i,
					ipaReg: /ɔj/i,	out: "ói",	adv: 1 },		// Dói
	{ reg: /oi/i,	ipaReg: /oj/i,	out: "oi",	adv: 1 },		// Foi
	{ reg: /ou/i,	ipaReg: /ow/i,	out: "ou",	adv: 1 },		// Sou
	{ reg: /ui/i,	ipaReg: /uj/i,	out: "ui",	adv: 1 },		// Fui
	
	// ----------------------- Ditongos Orais Estáveis ------------------------
	{ reg: /ua/i,	ipaReg: /wɐ/i,	out: "ua",	adv: 1 },		// Quadro
	{ reg: /ue/i,	ipaReg: /we/i,	out: "ue",	adv: 1 },		// Aguentar
	{ reg: /ui/i,	ipaReg: /wi/i,	out: "ui",	adv: 1 },		// Arguido
	{ reg: /uo/i,	ipaReg: /wɔ/i,	out: "uo",	adv: 1 },		// Quota
	
	// --------------------------- Ditongos Nasais ----------------------------
	{ reg: /ão/i,	ipaReg: /ɐ̃w/i,	out: "ão",	adv: 1 },		// Pão
	{ reg: /ãe/i,	ipaReg: /ɐ̃j/i,	out: "ãe",	adv: 1 },		// Mãe
	{ reg: /õe/i,	ipaReg: /õj/i,	out: "õe",	adv: 1 },		// Visões
	{ reg: /am/i,	ipaReg: /ɐ̃w/i,	out: "ão",	adv: 1 , l: 0 },	// Cantam → Càntão


	// ============================ SONS VOCÁLICOS ============================

	// --------------------------- Semivogais (SV) ----------------------------
	{ reg: /i/i,	ipaReg: /j/i,	out: "i" },				// Pai
	{ reg: /u/i,	ipaReg: /w/i,	out: "u" },				// Quadro

	// ------------------------- Vogais Nasais (V-N) --------------------------
	{ reg: /an/i,	ipaReg: /ɐ̃/i,	out: "an",	adv: 1 },		// Manta
	{ reg: /am/i,	ipaReg: /ɐ̃/i,	out: "an",	adv: 1 },		// Campo → Canpo
	{ reg: /en/i,	ipaReg: /ẽ/i,	out: "en",	adv: 1 },		// Quente
	{ reg: /em/i,	ipaReg: /ẽ/i,	out: "en",	adv: 1 },		// Bem → Ben
	{ reg: /in/i,	ipaReg: /ĩ/i,	out: "in",	adv: 1 },		// Finta
	{ reg: /im/i,	ipaReg: /ĩ/i,	out: "in",	adv: 1 },		// Fim → Fin
	{ reg: /on/i,	ipaReg: /õ/i,	out: "on",	adv: 1 },		// Contar
	{ reg: /om/i,	ipaReg: /õ/i,	out: "on",	adv: 1 },		// Bom → Bon
	{ reg: /un/i,	ipaReg: /ũ/i,	out: "un",	adv: 1 },		// Fundo
	{ reg: /um/i,	ipaReg: /ũ/i,	out: "un",	adv: 1 },		// Um → Un
	
	// -------------------------- Vogais Orais (V-O) --------------------------
	{ reg: /[aá](?![iu])/i,	ipaReg: /a/i,	out: "á" },		// Pá
	{ reg: /[aâ]/i,			ipaReg: /ɐ/i,	out: "a" },		// Cama
	{ reg: /[eé]/i,			ipaReg: /ɛ/i,	out: "é" },		// Pé
	{ reg: /[eê]/i,			ipaReg: /e/i,	out: "e" },		// Mesa
	{ reg: /e/i,			ipaReg: /ə/i,	out: "e" },		// Sede
	{ reg: /[ií]/i,			ipaReg: /i/i,	out: "i" },		// Vida
	{ reg: /[oó]/i,			ipaReg: /ɔ/i,	out: "ó" },		// Pó
	{ reg: /o/i,			ipaReg: /o/i,	out: "o" },		// Ovo
	{ reg: /o/i,			ipaReg: /u/i,	out: "u" },		// Conto
	{ reg: /[uú]/i,			ipaReg: /u/i,	out: "u" },		// Luz
]


module.exports = { regras };
