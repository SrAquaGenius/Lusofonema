/* ----------------------------------------------------------------------------
 * File:     ipa.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { execSync } = require('child_process');

const { debug } = require("../utils/utils");


function gerarIPA(palavra) {

	const word = palavra.replace("ˈ", "").replace(".", "").trim();
	debug("Palavra limpa:", word);

	let ipa = execSync(`espeak-ng -v pt --ipa=3 -q "${word}" 2>/dev/null`)
			  .toString().trim();

	debug("IPA gerado:", ipa);

	ipa = corrigirIPA(ipa, false);
	if (word != palavra) ipa = atualizarMarcasIPA(palavra, ipa);

	return adicionarSlash(ipa);
}

function corrigirIPA(ipa, addSlash = true) {

	// Correções específicas para Português Europeu

	debug("IPA palavra:", ipa);

	ipa = ipa.replace(/\u200d/g, ""); // remove ZWJ (zero width joiner)

	// Ajustar outros sons/caracteres
	ipa = ipa.replace(/ɾə/g, "ɾ");
	ipa = ipa.replace(/ɑ/g, "a");
	ipa = ipa.replace(/ɨ/g, "ə");
	ipa = ipa.replace(/ɪ/g, "j");
	ipa = ipa.replace(/ʊ/g, "w");
	ipa = ipa.replace(/ʊ̃/g, "w");
	ipa = ipa.replace(/w$/g, "u");
	ipa = ipa.replace(/ɹ/g, "ɾ");
	ipa = ipa.replace(/ɡ/g, "g");

	// Corrigir sons nasais
	ipa = ipa.replace(/aŋ/g, "ɐ̃‍");
	ipa = ipa.replace(/eiŋ/g, "ẽ");
	ipa = ipa.replace(/eɪŋ/g, "ẽ");
	ipa = ipa.replace(/iŋ/g, "ĩ");
	ipa = ipa.replace(/oŋ/g, "õ");
	ipa = ipa.replace(/uŋ/g, "ũ");
	ipa = ipa.replace(/ŋ/g, "");
	ipa = ipa.replace(/ɐ̃w̃/g, "ɐ̃w");
	ipa = ipa.replace(/ɐ̃m/g, "ɐ̃‍");
	ipa = ipa.replace(/en/g, "ẽ");

	// Ajustar alguns ditongos
	ipa = ipa.replace(/eɪ/g, "ɐj");
	ipa = ipa.replace(/au/g, "aw");

	
	// Remove marcas fonéticas e espaços
	ipa = ipa.replace(/\s/g, "").replace(/[ˌ]/g, "");
	
	// Mover ˈ para antes de dígrafos consonantais
	ipa = ipa.replace(/(f|p|t|c|g|b|d|v)(l|ɾ)ˈ([aeiouɐɛəɔwɐ̃ẽĩõũ])/gi, "ˈ$1$2$3");

	// Corrigir posição do acento tónico
	ipa = ipa.replace(/([^aeiouɐɛəɔwɐ̃ẽĩõũˈˌ\s\/])ˈ([aeiouɐɛəɔwɐ̃ẽĩõũ])/gi, "ˈ$1$2");

	// Substitui C-"w"-C por C-"u"-C
	ipa = ipa.replace(/([^aeiouɐɛəɔɐ̃ẽĩõũˈ̃])w([^aeiouɐɛəɔɐ̃ẽĩõũˈ̃])/g, "$1u$2");

	debug("IPA final:", ipa);

	return addSlash ? adicionarSlash(ipa) : ipa;
}

/**
 * @brief Restaura marcas de tonicidade e divisão silábica no IPA gerado.
 * @param {string} palavra Palavra original.
 * @param {string} ipa IPA gerado limpo, sem marcas adicionais.
 * @returns {string} IPA atualizado com as marcas originais, caso existam.
 */
function atualizarMarcasIPA(palavra, ipa) {

	debug(`Palavra original: ${palavra}, IPA: ${ipa}`);

	// Se o palavra não tem marcas, retorna o IPA tal como está
	if (!palavra.includes("ˈ") && !palavra.includes(".")) {
		return ipa;
	}

	let res = ipa;

	// Restaurar marca de tonicidade na posição equivalente
	if (palavra.includes("ˈ") && !ipa.includes("ˈ")) {
		const posTonica = palavra.indexOf("ˈ");
		// Inserir na mesma posição relativa
		res = res.slice(0, posTonica) + "ˈ" + res.slice(posTonica);
	}

	// Restaurar pontos de divisão silábica
	if (palavra.includes(".")) {
		let idxOriginal = 0;
		let idxResultado = 0;
		let restaurado = "";
		while (idxOriginal < palavra.length && idxResultado < res.length) {
			if (palavra[idxOriginal] === ".") {
				restaurado += ".";
				idxOriginal++;
				continue;
			}
			restaurado += res[idxResultado];
			idxOriginal++;
			idxResultado++;
		}
		// Caso ainda sobre parte do IPA
		if (idxResultado < res.length) {
			restaurado += res.slice(idxResultado);
		}
		res = restaurado;
	}

	return res;
}

function adicionarSlash(ipa) {
	if (ipa[0] === "/") return ipa;
	return "/" + ipa + "/";
}


module.exports = { gerarIPA, corrigirIPA };
