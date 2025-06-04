/* ----------------------------------------------------------------------------
 * File:     silabas.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { debug } = require("./debug");

const vogais = 'aeiouáéíóúâêôãõà';
const semivogais = 'iu';

const regrasSeparacao = [

	// Mantém ˈ junto da sílaba seguinte
	(ctx, commit) => ctx.char === 'ˈ' && (() => {
		if (ctx.atual !== '') ctx.silabas.push(ctx.atual);
		ctx.atual = 'ˈ';
		ctx.i++;
		return commit();
	})(),

	// Hiato: duas vogais fortes consecutivas
	(ctx, commit) => ctx.isV(ctx.char) && ctx.isV(ctx.next) &&
		!semivogais.includes(ctx.char.toLowerCase()) &&
		!semivogais.includes(ctx.next.toLowerCase()) &&
		(() => {
			ctx.silabas.push(ctx.atual);
			ctx.atual = '';
			ctx.i++;
			return commit();
		})(),

	// V–rr–V → "rr" inicia nova sílaba
	(ctx, commit) => ctx.char.toLowerCase() === 'r' &&
		ctx.next.toLowerCase() === 'r' &&
		ctx.isV(ctx.next2) &&
		(() => {
			// Divide a sílaba no ponto antes do 'rr'
			ctx.silabas.push(ctx.atual); // atual ainda não inclui o 'r'
			ctx.atual = 'rr';            // começa nova sílaba com rr
			ctx.i += 2;
			return commit();
		})(),

	// V–r–V → "r" inicia nova sílaba
	(ctx, commit) => ctx.isV(ctx.prev) &&
		ctx.char.toLowerCase() === 'r' &&
		ctx.isV(ctx.next) &&
		(() => {
			ctx.silabas.push(ctx.atual.slice(0, -1));
			ctx.atual = ctx.char;
			ctx.i++;
			return commit();
		})(),

	// V–r ou V–r–C → "r" termina a sílaba anterior
	(ctx, commit) => ctx.isV(ctx.prev) &&
		ctx.char.toLowerCase() === 'r' &&
		(!ctx.next || ctx.isC(ctx.next)) &&
		(() => {
			ctx.silabas.push(ctx.atual);
			ctx.atual = '';
			ctx.i++;
			return commit();
		})(),

	// V–C–V → corta após a vogal
	(ctx, commit) => ctx.isV(ctx.char) &&
		ctx.isC(ctx.next) &&
		ctx.isV(ctx.next2) &&
		(() => {
			ctx.silabas.push(ctx.atual);
			ctx.atual = '';
			ctx.i++;
			return commit();
		})(),
];


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

	const isV = (c) => vogais.includes(c?.toLowerCase?.());
	const isC = (c) => c && !isV(c) && c !== 'ˈ';

	debug("Início da separação de sílabas:", palavra);

	while (i < palavra.length) {
		const contexto = {
			palavra, silabas, i, atual,
			prev: palavra[i - 1] || '',
			char: palavra[i],
			next: palavra[i + 1] || '',
			next2: palavra[i + 2] || '',
			isV,
			isC
		};

		debug(`Caractere [${i}]: '${contexto.char}' | Atual: '${atual}'`);

		if (contexto.char) atual += contexto.char;

		const aplicada = regrasSeparacao.some((regra, idx) => regra(contexto, () => {
			debug(`Regra ${idx + 1} aplicada em i=${i}`);
			i = contexto.i;
			atual = contexto.atual;
			return true;
		}));

		if (!aplicada) {
			debug(`Nenhuma regra aplicada em i=${i}, avançar.`);
			i++;
		}
	}

	if (atual) silabas.push(atual);

	debug("Sílabas finais:", silabas);

	return silabas;
}


/**
 * @brief Insere 'h' entre vogais consecutivas de sílabas distintas (hiatos).
 *        Marca com 'ˈh' se o hiato iniciar a sílaba tônica.
 * @param {string[]} silabas Array de sílabas com possível marca de tonicidade.
 * @returns {string[]} Array com 'h' inserido onde houver hiato.
 */
function marcarHiatos(silabas) {

	const resultado = [silabas[0]];

	for (let i = 1; i < silabas.length; i++) {

		const anterior = silabas[i - 1];
		let atual = silabas[i];

		const ultimaLetra = anterior.slice(-1).toLowerCase();
		const primeiraLetra = atual[0] === 'ˈ' ? atual[1] : atual[0];
		const primeiraIsVogal = vogais.includes(primeiraLetra?.toLowerCase());
		const ultimaIsVogal = vogais.includes(ultimaLetra);

		if (ultimaIsVogal && primeiraIsVogal) {

			if (atual.startsWith('ˈ')) atual = 'ˈh' + atual.slice(1);			
			else atual = 'h' + atual;
		}

		resultado.push(atual);
	}

	return resultado;
}


module.exports = { separarSilabas, marcarHiatos };
