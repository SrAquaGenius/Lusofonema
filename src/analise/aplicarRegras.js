/* ----------------------------------------------------------------------------
 * File:     aplicarRegras.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { aplicarTonicidade } = require('./tonicidade');
const { separarSilabas, marcarHiatos } = require('./silabas');
const { regras } = require("./regras");

const { debug, error, warn } = require("../utils/utils");


/**
 * @brief Aplica as regras do Lusofonema sílaba a sílaba, com base em dados.
 * @param {object} dados Objeto com campos 'palavra' e 'ipa'.
 * @returns {string} Representação em Lusofonema.
 */
function aplicarLusofonemaPorSilaba(dados) {

	debug("Dados:", dados);

	if (!dados.palavra && !dados.ipa) {
		error("Dados fornecido não contêm nem palavra nem IPA");
		return "";
	}

	if (!dados.ipa) {
		dados.ipa = gerarIPA(dados.palavra);
	}

	const silabas = dados.palavra.split(".");
	const silabasIPA = dados.ipa.normalize("NFC").replace(/[\/]/g, "")
							.trim().split(".");

	debug(silabas);
	debug(silabasIPA);

	if (silabas.length !== silabasIPA.length) {
		warn("Número de sílabas não coincide com o IPA. Fallback para modo linear.");
		return aplicarLusofonemaLinear(dados.palavra.replace(/\./g, ""), dados.ipa);
	}

	const resultado = [];

	for (let i = 0; i < silabas.length; i++) {
		const silaba = silabas[i];
		const silabaIPA = silabasIPA[i];
		const lusofonemaSilaba = (i === silabas.length - 1)
			? aplicarRegrasASilaba(silaba, silabaIPA, true)
			: aplicarRegrasASilaba(silaba, silabaIPA);
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
function aplicarRegrasASilaba(silaba, ipa, isLast = false) {

	debug(`Sílaba: '${silaba}', IPA: '${ipa}'${isLast ? " (last)" : ""}`);

	const letras = silaba.split("");
	const sons = Array.from(
		new Intl.Segmenter("pt", { granularity: "grapheme" })
		.segment(ipa.normalize("NFD")),
		s => s.segment
	);

	debug(`Letras: [${letras}] (${letras.length})`);
	debug(`Sons: [${sons}] (${sons.length})`);

	let wIndex = 0;
	let iIndex = 0;
	const res = [];

	const ultimaLetra = letras[letras.length - 1];
	let idxMax = Math.max(letras.length, sons.length);
	
	while (wIndex < letras.length && iIndex < sons.length) {
		
		let idxMin = Math.min(wIndex, iIndex);
		let size = idxMax - idxMin;

		while (size > 0) {

			debug(`Size = ${size}, idxMin = ${idxMin}, idxMax = ${idxMax}`);

			const wContext = letras.slice(wIndex, wIndex + size).join('');
			const iContext = sons.slice(iIndex, iIndex + size).join('');
			let novaLetra = wContext;

			let regraAplicada = false;

			debug(`Word Context: '${wContext}', IPA Context: '${iContext}'`);

			for (const { reg, ipaReg, out, inc, lastRule } of regras) {

				// Se o contexto e a regra não corresponderem, pula a regra
				if (!reg.test(wContext)) continue;

				// Se tiver regra de IPA mas o contexto IPA e a regra IPA não
				// corresponderem, pula a regra
				if (ipaReg && !ipaReg.test(iContext)) continue;

				// Se for uma lastRule mas nem é a última sílaba nem o
				// contexto contem a última letra, pula a regra
				if ((!isLast || !wContext.includes(ultimaLetra)) && lastRule)
					continue;

				debug("Regra detetada: ", reg, ipaReg, out, inc ?? 0);

				regraAplicada = true;
				novaLetra = out;
				wIndex += (inc ?? 0);
				break;
			}

			if (regraAplicada) {
				res.push(novaLetra);
				break;
			}

			size--;
		}

		wIndex++;
		iIndex++;
	}

	debug(res);

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
function aplicarLusofonemaLinear(palavraOriginal, ipaOriginal) {

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

		for (const { reg, ipaReg, out, inc } of regras) {
			const wordRegex = new RegExp(reg, "i");
			const ipaReg = new RegExp(ipaReg, "i");

			//debug("wRegex: ", wordRegex, "iRegex: ", ipaReg);
			//debug("Rule: ", reg, ipaReg, out);

			if (!wordContext.match(wordRegex)) continue;
			if (ipaReg && !ipaReg.test(ipaContext)) continue;
			if (!(ipaContext.match(ipaReg)?.includes(som))) continue;

			debug("✔️ Regra aplicada:", reg, ipaReg, out);

			novaLetra = out;
			resArray.push(novaLetra);

			const passo = (inc ?? 0) + 1;
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


module.exports = { aplicarLusofonemaLinear, aplicarLusofonemaPorSilaba,
					aplicarRegrasASilaba
 };
