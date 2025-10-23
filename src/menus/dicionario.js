/* ----------------------------------------------------------------------------
 * File:     menus/dicionario.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const fs = require("fs");
const path = require("path");

const { error, log, clear, debug } = require("../utils/utils");

const MAX_PALAVRAS_A_MOSTRAR = 15;


/**
 * @brief Mostra o resumo do dicionário: número total de palavras e exemplos.
 */
function mostrarResumoDicionario() {

	clear();

	const pasta = path.join(__dirname, "..", "..", "palavras");
	debug(pasta);
	if (!fs.existsSync(pasta)) {
		error("Pasta ./palavras não encontrada.");
		return;
	}

	const ficheiros = fs.readdirSync(pasta)
		.filter(nome => nome.endsWith(".json"))
		.sort();

	const total = ficheiros.length;
	log(`📚 O dicionário contém ${total} palavra${total === 1 ? "" : "s"}.`);

	// Selecionar o máximo de palavras aleatórias definidar
	const exemplos = ficheiros
		.sort(() => Math.random() - 0.5) // embaralhar
		.slice(0, MAX_PALAVRAS_A_MOSTRAR);

	if (exemplos.length > 0) {
		log("\nAlgumas palavras no dicionário:");
		for (const ficheiro of exemplos) {
			const caminho = path.join(pasta, ficheiro);
			try {
				const conteudo = fs.readFileSync(caminho, "utf8");
				const dados = JSON.parse(conteudo);
				const palavra = dados.palavra || ficheiro.replace(".json", "");
				const ipa = dados.ipa || "—";
				const lusofonema = dados.lusofonema || "—";
				log(`• ${palavra} → ${ipa} → ${lusofonema}`);
			} catch (e) {
				error(`Erro a ler '${ficheiro}':`, e.message);
			}
		}
	}

	if (total > MAX_PALAVRAS_A_MOSTRAR){
		log("...");
	}
}


module.exports = { mostrarResumoDicionario };
