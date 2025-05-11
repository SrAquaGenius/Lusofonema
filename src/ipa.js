/* ----------------------------------------------------------------------------
 * File:     ipa.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

function corrigirIPA(palavra, ipa) {

	// Correções específicas baseadas na Infopédia (Português Europeu)
	// if (palavra === "texto")    		{ return "/ˈtɐjʃtu/"; }
	// if (palavra === "extraordinário")	{ return "/ɐjʃtrɐɔrdiˈnarju/"; }

	// Corrigir sons nasais

	ipa = ipa.replace(/aŋ/g, "ɐ̃‍");
	ipa = ipa.replace(/eiŋ/g, "ẽ");
	ipa = ipa.replace(/e‍ɪŋ/g, "ẽ");
	// ipa = ipa.replace(/e‍ɪ/g, "ẽ");
	ipa = ipa.replace(/iŋ/g, "ĩ");
	ipa = ipa.replace(/oŋ/g, "õ");
	ipa = ipa.replace(/uŋ/g, "ũ");
	ipa = ipa.replace(/ŋ/g, "");
	ipa = ipa.replace(/ʊ̃/g, "w̃");
	ipa = ipa.replace(/ɐ̃‍w̃/g, "ɐ̃‍w");

	// Ajustar alguns sons vocálicos
	ipa = ipa.replace(/ɨ/g, "ə");
	ipa = ipa.replace(/ʊ/g, "u");
	// ipa = ipa.replace(/ɪ/g, "j");

	// Ajustar outros caracteres
	ipa = ipa.replace(/ɾə/g, "r");
	ipa = ipa.replace(/ɾ/g, "r");
	ipa = ipa.replace(/ɹ/g, "r");

	ipa = ipa.replace(/al(?=[pbtdkgfvszʃʒmnɲlrɾɫʎ])/g, "aɫ");
	ipa = ipa.replace(/el(?=[pbtdkgfvszʃʒmnɲlrɾɫʎ])/g, "eɫ");
	ipa = ipa.replace(/il(?=[pbtdkgfvszʃʒmnɲlrɾɫʎ])/g, "iɫ");
	ipa = ipa.replace(/ol(?=[pbtdkgfvszʃʒmnɲlrɾɫʎ])/g, "oɫ");
	ipa = ipa.replace(/ul(?=[pbtdkgfvszʃʒmnɲlrɾɫʎ])/g, "uɫ");
	ipa = ipa.replace(/al(?=\/?$)/g, "aɫ");
	ipa = ipa.replace(/el(?=\/?$)/g, "eɫ");
	ipa = ipa.replace(/il(?=\/?$)/g, "iɫ");
	ipa = ipa.replace(/ol(?=\/?$)/g, "oɫ");
	ipa = ipa.replace(/ul(?=\/?$)/g, "uɫ");

	// Limpeza final: remove marcas fonéticas e espaços
	ipa = ipa.replace(/\s/g, "").replace(/[ˌ]/g, "");
	
	// Corrigir posição do acento tónico
	ipa = ipa.replace(/([^\sˈˌ\/])ˈ([^\sˈˌ\/])/g, "ˈ$1$2");
	// ipa = ipa.replace(/ˈ/g, "'");

	return ipa = "/" + ipa + "/";
}

module.exports = { corrigirIPA };
