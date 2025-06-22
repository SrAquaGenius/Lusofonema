/* ----------------------------------------------------------------------------
 * File:     alfabeto.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { log } = require("./debug");


/**
 * @brief Mostra o alfabeto do sistema Lusofonema, com cada letra,
 *        o seu nome comum em português e a representação fonética
 *        esperada (som IPA ou equivalente simplificado).
 *        Imprime os dados no terminal em formato de tabela simples.
 * @param {function} callback Função a executar após mostrar o alfabeto.
 *                            Pode ser usada para retornar ao menu.
 * @returns {void} Não retorna valor; apenas imprime e chama o callback.
 */
function mostrarAlfabetoLusofonema(callback) {
	const alfabeto = [
		{ letra: "A", nome: "á", som: "/a/ ou /ɐ/" },
		{ letra: "B", nome: "bê", som: "/b/" },
		{ letra: "C", nome: "cê", som: "/k/" },
		{ letra: "D", nome: "dê", som: "/d/" },
		{ letra: "E", nome: "é", som: "/ɛ/, /e/ ou /ə/" },
		{ letra: "F", nome: "éfe", som: "/f/" },
		{ letra: "G", nome: "gê", som: "/g/" },
		{ letra: "H", nome: "agá", som: "(mudo)" },
		{ letra: "I", nome: "i", som: "/i/ ou /j/" },
		{ letra: "J", nome: "jota", som: "/ʒ/" },
		{ letra: "L", nome: "éle", som: "/l/ ou /ɫ/" },
		{ letra: "M", nome: "ême", som: "/m/" },
		{ letra: "N", nome: "êne", som: "/n/" },
		{ letra: "O", nome: "ó", som: "/ɔ/ ou /o/" },
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

	log("\n🔡 Alfabeto Lusofonema:\n");
	log("Letra | Nome | Som");
	log("-------------------------------");
	alfabeto.forEach(({ letra, nome, som }) => {
		log(` ${letra.padEnd(5)}| ${nome.padEnd(5)}| ${som}`);
	});
	log("");

	if (callback) callback();
}

/**
 * @brief Mostra os sons usados no alfabeto fonético (IPA), organizados
 *        por tipo articulatório: consoantes, vogais, semivogais, etc.
 *        Para cada som, mostra também um exemplo de palavra onde ocorre.
 *        Tipos:
 *        - C-O: Consoante Oclusiva
 *        - C-F: Consoante Fricativa
 *        - C-N: Consoante Nasal
 *        - C-L: Consoante Lateral
 *        - C-V: Consoante Vibrante
 *        - SV : Semivogal
 *        - V-O: Vogal Oral
 *        - V-N: Vogal Nasal
 * @param {function} callback Função a executar após mostrar os sons.
 *                            Pode ser usada para retornar ao menu.
 * @returns {void} Não retorna valor; apenas imprime e chama o callback.
 */
function mostrarSonsIPA(callback) {
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

	log("\n🔡 Lista de Sons do Alfabeto Fonético:\n");
	log("(Legenda):");
	log("- Consoante Oclusiva :\tC-O");	
	log("- Consoante Fricativa :\tC-F");	
	log("- Consoante Nasal :\tC-N");	
	log("- Consoante Lateral :\tC-L");	
	log("- Consoante Vibrante :\tC-V");	
	log("- Semivogal :\t\tSV");	
	log("- Vogal Oral :\t\tV-O");	
	log("- Vogal Nasal :\t\tV-N");	
	
	log("\nSom | Tipo | Palavra exemplo");
	log("----------------------------");
	alfabeto.forEach(({ tipo, som, palavra }) => {
		log(`${som.padEnd(4)}| ${tipo.padEnd(5)}| ${palavra.padEnd(15)}`);
	});
	log("");

	if (callback) callback();
}


module.exports = { mostrarAlfabetoLusofonema, mostrarSonsIPA };
