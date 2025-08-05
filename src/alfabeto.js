/* ----------------------------------------------------------------------------
 * File:     alfabeto.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { log, clear, debug } = require("./debug");


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
		{ letra: "M", nome: "éme", som: "/m/" },
		{ letra: "N", nome: "éne", som: "/n/" },
		{ letra: "O", nome: "ó", som: "/ɔ/ ou /o/" },
		{ letra: "P", nome: "pê", som: "/p/" },
		{ letra: "R", nome: "érre", som: "/ʁ/ ou /ɾ/" },
		{ letra: "S", nome: "ése", som: "/s/" },
		{ letra: "T", nome: "tê", som: "/t/" },
		{ letra: "U", nome: "u", som: "/u/ ou /w/" },
		{ letra: "V", nome: "vê", som: "/v/" },
		{ letra: "X", nome: "xis", som: "/ʃ/" },
		{ letra: "Ç", nome: "csi", som: "/ks/" },
		{ letra: "Z", nome: "zê", som: "/z/" },
	];

	clear();
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
		{ som: "/ẽ/ ", tipo: "V-N", palavra: "Bem" },
		{ som: "/ĩ/ ", tipo: "V-N", palavra: "Fim" },
		{ som: "/õ/ ", tipo: "V-N", palavra: "Bom" },
		{ som: "/ũ/ ", tipo: "V-N", palavra: "Um" },
	];

	clear();
	log("\n🔡 Lista de Sons do Alfabeto Fonético:\n");
	log("Consoantes:\t\t\tVogais:");
	log("- Oclusiva :\tC-O\t\t- Semivogal :\t\tSV");	
	log("- Fricativa :\tC-F\t\t- Vogal Oral :\t\tV-O");	
	log("- Nasal :\tC-N\t\t- Vogal Nasal :\t\tV-N");	
	log("- Lateral :\tC-L");	
	log("- Vibrante :\tC-V");


	const consoantes = alfabeto.filter(e => e.tipo.startsWith("C"));
	const vogais = alfabeto.filter(e => e.tipo.startsWith("V") || e.tipo === "SV");

	const max = Math.max(consoantes.length, vogais.length);
	debug("Max: ", max);

	log("\nSom | Tipo | Palavra".padEnd(33) + "Som | Tipo | Palavra");
	log("--------------------".padEnd(32) + "--------------------");

	for (let i = 0; i < max; i++) {
		const c = consoantes[i];
		const v = vogais[i];

		const linhaC = `${c.som.padEnd(4)}| ${c.tipo.padEnd(5)}| ${c.palavra.padEnd(19)}`
		const linhaV = v ? `${v.som.padEnd(4)}| ${v.tipo.padEnd(5)}| ${v.palavra}`
						 : "";

		log(`${linhaC}${linhaV}`);
	}

	if (callback) callback();
}


module.exports = { mostrarAlfabetoLusofonema, mostrarSonsIPA };
