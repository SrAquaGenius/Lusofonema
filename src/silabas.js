/* ----------------------------------------------------------------------------
 * File:     silabas.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { debug } = require("./debug");

const vogais = 'aeiouáéíóúâêôãõà';
const semivogais = 'iu';

/**
 * @brief Separa uma palavra em sílabas de forma heurística (não exata).
 *        Usa padrões como CV, CVC, V, VC e evita ditongos e outros encontros.
 * @param {string} palavra Palavra a ser separada em sílabas.
 * @returns {string[]} Lista de sílabas resultantes da separação.
 */
function separarSilabas(palavra) {

	const silabas = [];
	let atual = '';
	let i = 0;

	while (i < palavra.length) {

		const prev = palavra[i - 1] || '';
		const char = palavra[i];
		const next = palavra[i + 1] || '';
		const next2 = palavra[i + 2] || '';

		const isV = (c) => vogais.includes(c.toLowerCase());
		const isC = (c) => !isV(c) && c !== 'ˈ';

		debug("i:", i, "char:", char, "atual:", atual);

		// Caso encontre marcador de tonicidade
		if (char === 'ˈ') {
			if (atual !== '') silabas.push(atual);
			atual = 'ˈ';
			i++;
			continue;
		}

		atual += char;

		// Detecção de hiato: duas vogais fortes consecutivas
		if (
			isV(char) && isV(next) &&
			!semivogais.includes(char.toLowerCase()) &&
			!semivogais.includes(next.toLowerCase())
		) {
			silabas.push(atual);
			atual = '';
			i++;
			continue;
		}

		// V–rr–V → "rr" inicia nova sílaba
		if (
			char.toLowerCase() === 'r' &&
			next.toLowerCase() === 'r' &&
			isV(next2)
		) {
			silabas.push(atual.slice(0, -1)); // tudo antes do primeiro 'r'
			atual = 'rr';
			i += 2;
			continue;
		}

		// V–r–V → "r" inicia nova sílaba
		if (isV(prev) && char.toLowerCase() === 'r' && isV(next)) {
			silabas.push(atual.slice(0, -1)); // até antes do 'r'
			atual = char;
			i++;
			continue;
		}

		// V–r ou V–r–C → "r" termina a sílaba anterior
		if (isV(prev) && char.toLowerCase() === 'r' &&
			(!next || isC(next))) {
			silabas.push(atual);
			atual = '';
			i++;
			continue;
		}

		// C–r–V → "r" continua a sílaba
		// nada a fazer — continua

		// Regra genérica: após V–C–V → corta depois da vogal
		if (isV(char) && isC(next) && isV(next2)) {
			silabas.push(atual);
			atual = '';
			i++;
			continue;
		}

		i++;
	}

	if (atual) silabas.push(atual);

	// debug("Sílabas:", silabas);
	return silabas;
}


/**
 * @brief Insere 'h' entre vogais consecutivas de sílabas distintas (hiatos).
 *        Marca com 'ˈh' se o hiato iniciar a sílaba tônica.
 * @param {string} palavra Palavra com sílabas separadas e marca de tonicidade.
 * @returns {string} Palavra com 'h' inserido entre vogais em hiato.
 */
function marcarHiatosComH(palavra) {

	const silabas = separarSilabas(palavra);
	debug("Sílabas: ", silabas);

	let resultado = silabas[0] || '';

	for (let i = 1; i < silabas.length; i++) {

		const lastSilaba = silabas[i - 1];
		let silaba = silabas[i];

		debug("Sílaba anterior: ", lastSilaba, ", Sílaba atual: ", silaba);

		// Último caractere da sílaba anterior
		const lastChar = lastSilaba[lastSilaba.length - 1].toLowerCase();

		// Primeiro caractere da sílaba atual, que pode ser 'ˈ'
		// Se tiver 'ˈ' no início, a vogal relevante está no índice 1
		let char = (silaba[0] === 'ˈ') ? silaba[1] : silaba[0];
		char = char.toLowerCase();

		if (vogais.includes(lastChar) && vogais.includes(char)) {

			if (silaba.startsWith('ˈ')) { silaba = 'ˈh' + silaba.slice(1); }
			else silaba = 'h' + silaba;
		}

		resultado += silaba;
	}

	return resultado;
}


module.exports = { separarSilabas, marcarHiatosComH };
