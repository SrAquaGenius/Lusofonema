/* ----------------------------------------------------------------------------
 * File:     alfabeto.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

function mostrarAlfabetoLuzofonema(callback) {
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
		{ letra: "L", nome: "éle", som: "/l/ ou /ɫ/" },
		{ letra: "M", nome: "ême", som: "/m/" },
		{ letra: "N", nome: "êne", som: "/n/" },
		{ letra: "O", nome: "ó", som: "/ɔ/ ou /o/" },
		{ letra: "P", nome: "pê", som: "/p/" },
		{ letra: "R", nome: "érre", som: "/ʁ/, /ɾ/ ou /ɹ/" },
		{ letra: "S", nome: "ésse", som: "/s/" },
		{ letra: "T", nome: "tê", som: "/t/" },
		{ letra: "U", nome: "u", som: "/u/ ou /w/" },
		{ letra: "V", nome: "vê", som: "/v/" },
		{ letra: "X", nome: "xis", som: "/ʃ/" },
		{ letra: "Ç", nome: "csi", som: "/ks/" },
		{ letra: "Z", nome: "zê", som: "/z/" },
	];

	console.log("\n🔡 Alfabeto Luzofonema:\n");
	console.log("Letra | Nome | Som");
	console.log("-------------------------------");
	alfabeto.forEach(({ letra, nome, som }) => {
		console.log(` ${letra.padEnd(5)}| ${nome.padEnd(5)}| ${som}`);
	});
	console.log("");

	if (callback) callback();
}

function mostrarAlfabetoIPA(callback) {
	const alfabeto = [
		{ som: "/p/", tipo: "C-O", palavra: "Pato" },
		{ som: "/b/", tipo: "C-O", palavra: "Bola" },
		{ som: "/t/", tipo: "C-O", palavra: "Teto" },
		{ som: "/d/", tipo: "C-O", palavra: "Dado" },
		{ som: "/k/", tipo: "C-O", palavra: "Casa" },
		{ som: "/g/", tipo: "C-O", palavra: "Gato" },
		{ som: "/f/", tipo: "C-F", palavra: "Faca" },
		{ som: "/v/", tipo: "C-F", palavra: "Vaca" },
		{ som: "/s/", tipo: "C-F", palavra: "Sapo" },
		{ som: "/z/", tipo: "C-F", palavra: "Zero" },
		{ som: "/ʃ/", tipo: "C-F", palavra: "Chave" },
		{ som: "/ʒ/", tipo: "C-F", palavra: "Jogo" },
		{ som: "/m/", tipo: "C-N", palavra: "Mão" },
		{ som: "/n/", tipo: "C-N", palavra: "Nuvem" },
		{ som: "/ɲ/", tipo: "C-N", palavra: "Manhã" },
		{ som: "/l/", tipo: "C-L", palavra: "Lata" },
		{ som: "/ʎ/", tipo: "C-L", palavra: "Milho" },
		{ som: "/ɾ/", tipo: "C-V", palavra: "Raro" },
		{ som: "/ʁ/", tipo: "C-V", palavra: "Raro" },
		{ som: "/j/", tipo: "SV", palavra: "Pai" },
		{ som: "/w/", tipo: "SV", palavra: "Quadro" },
		{ som: "/a/", tipo: "V-O", palavra: "Pá" },
		{ som: "/ɐ/", tipo: "V-O", palavra: "Cama" },
		{ som: "/ɛ/", tipo: "V-O", palavra: "Pé" },
		{ som: "/e/", tipo: "V-O", palavra: "Mesa" },
		{ som: "/ə/", tipo: "V-O", palavra: "Sede" },
		{ som: "/i/", tipo: "V-O", palavra: "Vida"},
		{ som: "/ɔ/", tipo: "V-O", palavra: "Pó"},
		{ som: "/o/", tipo: "V-O", palavra: "Ovo"},
		{ som: "/u/", tipo: "V-O", palavra: "Luz"},
		{ som: "/ɐ̃/ ", tipo: "V-N", palavra: "Mãe" },
		{ som: "/ẽ/", tipo: "V-N", palavra: "Bem" },
		{ som: "/ĩ/", tipo: "V-N", palavra: "Fim" },
		{ som: "/õ/", tipo: "V-N", palavra: "Bom" },
		{ som: "/ũ/", tipo: "V-N", palavra: "Um" },
	];

	console.log("\n🔡 Lista de Sons do Alfabeto Fonético:\n");
	console.log("(Legenda):");
	console.log("- Consoante Oclusiva :\tC-O");	
	console.log("- Consoante Fricativa :\tC-F");	
	console.log("- Consoante Nasal :\tC-N");	
	console.log("- Consoante Lateral :\tC-L");	
	console.log("- Consoante Vibrante :\tC-V");	
	console.log("- Semivogal :\t\tSV");	
	console.log("- Vogal Oral :\t\tV-O");	
	console.log("- Vogal Nasal :\t\tV-N");	
	
	console.log("\nSom | Tipo | Palavra exemplo");
	console.log("----------------------------");
	alfabeto.forEach(({ tipo, som, palavra }) => {
		console.log(`${som.padEnd(4)}| ${tipo.padEnd(5)}| ${palavra.padEnd(15)}`);
	});
	console.log("");

	if (callback) callback();
}

module.exports = { mostrarAlfabetoLuzofonema, mostrarAlfabetoIPA };
