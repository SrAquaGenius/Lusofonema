/* ----------------------------------------------------------------------------
 * File:     ipa.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { debug } = require("./debug");

function corrigirIPA(ipa) {

	// Correções específicas para Português Europeu

	debug("IPA original:", ipa);

	ipa = ipa.replace(/\u200d/g, ""); // remove ZWJ (zero width joiner)

	// Ajustar outros sons/caracteres
	ipa = ipa.replace(/ɑ/g, "a");
	ipa = ipa.replace(/ɨ/g, "ə");
	ipa = ipa.replace(/ɪ/g, "j");
	ipa = ipa.replace(/ʊ/g, "w");
	ipa = ipa.replace(/ʊ̃/g, "w");
	ipa = ipa.replace(/w$/g, "u");
	ipa = ipa.replace(/ɾə/g, "ɾ");
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

	// Ajustar alguns ditongos
	ipa = ipa.replace(/eɪ/g, "ɐj");
	ipa = ipa.replace(/au/g, "aw");

	
	// Remove marcas fonéticas e espaços
	ipa = ipa.replace(/\s/g, "").replace(/[ˌ]/g, "");
	
	// Corrigir posição do acento tónico
	ipa = ipa.replace(/([^aeiouɐɛəɔwɐ̃ẽĩõũˈˌ\s\/])ˈ([aeiouɐɛəɔwɐ̃ẽĩõũ])/gi, "ˈ$1$2");

	// Substitui C-"w"-C por C-"u"-C
	ipa = ipa.replace(/([^aeiouɐɛəɔɐ̃ẽĩõũˈ̃])w([^aeiouɐɛəɔɐ̃ẽĩõũˈ̃])/g, "$1u$2");

	// Remover caracteres indesejados
	const ipaArray = ipa.split("");
	const ipaResult = [];
	for (const c in ipaArray) {

		debug("Char: ", ipaArray[c], ipaArray[c].charCodeAt(0));

		if (ipaArray[c].charCodeAt(0) <= "ˈ".charCodeAt(0) ||
			ipaArray[c].charCodeAt(0) == 771) {
			ipaResult.push(ipaArray[c]);
		}
	}

	return "/" + ipaResult.join("") + "/";
}

module.exports = { corrigirIPA };
