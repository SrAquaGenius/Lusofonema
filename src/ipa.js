/* ----------------------------------------------------------------------------
 * File:     ipa.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

function corrigirIPA(ipa) {

	// Correções específicas para Português Europeu

	ipa = ipa.replace(/\u200d/g, ""); // remove ZWJ (zero width joiner)

	// Ajustar outros sons/caracteres
	ipa = ipa.replace(/ɑ/g, "a");
	ipa = ipa.replace(/ɨ/g, "ə");
	ipa = ipa.replace(/ɪ/g, "j");
	ipa = ipa.replace(/ʊ/g, "u");
	ipa = ipa.replace(/ɾə/g, "ɾ");
	ipa = ipa.replace(/ɡ/g, "g");

	// Corrigir sons nasais
	ipa = ipa.replace(/aŋ/g, "ɐ̃‍");
	ipa = ipa.replace(/eiŋ/g, "ẽ");
	ipa = ipa.replace(/e‍ɪŋ/g, "ẽ");
	ipa = ipa.replace(/iŋ/g, "ĩ");
	ipa = ipa.replace(/oŋ/g, "õ");
	ipa = ipa.replace(/uŋ/g, "ũ");
	ipa = ipa.replace(/ŋ/g, "");
	ipa = ipa.replace(/ʊ̃/g, "w̃");
	ipa = ipa.replace(/ɐ̃‍w̃/g, "ɐ̃‍w");
	ipa = ipa.replace(/ɐ̃‍m/g, "ɐ̃‍");

	// Ajustar alguns ditongos
	ipa = ipa.replace(/eɪ/g, "ɐj");
	ipa = ipa.replace(/au/g, "aw");

	// Remove marcas fonéticas e espaços
	ipa = ipa.replace(/\s/g, "").replace(/[ˌ]/g, "");
	
	// Corrigir posição do acento tónico
	ipa = ipa.replace(/([^\sˈˌ\/])ˈ([^\sˈˌ\/])/g, "ˈ$1$2");

	// Remover caracteres indesejados
	const ipaArray = ipa.split("");
	const ipaResult = [];
	for (const c in ipaArray) {
		if (ipaArray[c].charCodeAt(0) <= "ˈ".charCodeAt(0)) {
			ipaResult.push(ipaArray[c]);
		}
	}

	return "/" + ipaResult.join("") + "/";
}

module.exports = { corrigirIPA };
