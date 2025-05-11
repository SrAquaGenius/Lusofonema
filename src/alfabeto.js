/* ----------------------------------------------------------------------------
 * File:     alfabeto.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

function mostrarAlfabeto(callback) {
	const alfabeto = [
		{ letra: "A", nome: "á", som: "/a/ ou /ɐ/" },
		{ letra: "B", nome: "bê", som: "/b/" },
		{ letra: "C", nome: "cê", som: "/k/" },
		{ letra: "D", nome: "dê", som: "/d/" },
		{ letra: "E", nome: "é", som: "/ɛ/, /e/ ou /ə/" },
		{ letra: "F", nome: "éfe", som: "/f/" },
		{ letra: "G", nome: "gê", som: "/g/" },
		{ letra: "H", nome: "agá", som: "(mudo)" },
		{ letra: "I", nome: "i", som: "/i/" },
		{ letra: "J", nome: "jota", som: "/ʒ/" },
		{ letra: "L", nome: "éle", som: "/l/" },
		{ letra: "M", nome: "ême", som: "/m/" },
		{ letra: "N", nome: "êne", som: "/n/" },
		{ letra: "O", nome: "ó", som: "/o/ ou /ɔ/" },
		{ letra: "P", nome: "pê", som: "/p/" },
		{ letra: "R", nome: "érre", som: "/ʁ/ ou /ɾ/" },
		{ letra: "S", nome: "ésse", som: "/s/" },
		{ letra: "T", nome: "tê", som: "/t/" },
		{ letra: "U", nome: "u", som: "/u/ ou /w/" },
		{ letra: "V", nome: "vê", som: "/v/" },
		{ letra: "X", nome: "xis", som: "/ʃ/" },
		{ letra: "Ç", nome: "csi", som: "/ks/" },
		{ letra: "Z", nome: "zê", som: "/z/" },
	];

	console.log("\n🔡 Alfabeto Luzofonema:\n");
	console.log("Letra | Nome         | Som");
	console.log("-------------------------------");
	alfabeto.forEach(({ letra, nome, som }) => {
		console.log(`${letra.padEnd(6)}| ${nome.padEnd(12)}| ${som}`);
	});
	console.log("");

	if (callback) callback();
}

module.exports = { mostrarAlfabeto };
