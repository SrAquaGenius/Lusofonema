/* ----------------------------------------------------------------------------
 * File:     silabas.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { debug } = require("./debug");

const vogais = 'aeiouáéíóúâêôãõà';
const semivogais = 'iu';

const regrasSeparacao = [

	// #1 | Caracter tónico ˈ liga-se à sílaba seguinte
	{
		nome: "Tónica",
		aplicar: (ctx, commit) => ctx.char === 'ˈ' && (() => {
			if (ctx.atual !== '') ctx.silabas.push(ctx.atual);
			ctx.atual = 'ˈ';
			ctx.i++;
			return commit();
		})(),
	},

	// #2 | Hiato: vogais fortes consecutivas
	{
		nome: "Hiato",
		aplicar: (ctx, commit) => ctx.isV(ctx.char) &&
			ctx.isV(ctx.next) &&
			!semivogais.includes(ctx.char.toLowerCase()) &&
			!semivogais.includes(ctx.next.toLowerCase()) &&
			(() => {
				ctx.silabas.push(ctx.atual);
				ctx.atual = '';
				ctx.i++;
				return commit();
			})(),
	},

	// #3 | V–rr–V → 'rr' inicia nova sílaba
	{
		nome: "V-rr-V",
		aplicar: (ctx, commit) => ctx.char.toLowerCase() === 'r' &&
			ctx.next.toLowerCase() === 'r' &&
			ctx.isV(ctx.next2) &&
			(() => {
				ctx.silabas.push(ctx.atual);
				ctx.atual = 'rr';
				ctx.i += 2;
				return commit();
			})(),
	},

	// #4 | V–r–V → 'r' inicia nova sílaba
	{
		nome: "V-r-V",
		aplicar: (ctx, commit) => ctx.isV(ctx.prev) &&
			ctx.char.toLowerCase() === 'r' &&
			ctx.isV(ctx.next) &&
			(() => {
				ctx.silabas.push(ctx.atual.slice(0, -1));
				ctx.atual = ctx.char;
				ctx.i++;
				return commit();
			})(),
	},

	// #5 | V–r ou V–r–C → 'r' termina sílaba
	{
		nome: "V-r",
		aplicar: (ctx, commit) => ctx.isV(ctx.prev) &&
			ctx.char.toLowerCase() === 'r' &&
			(!ctx.next || ctx.isC(ctx.next)) &&
			(() => {
				ctx.atual += ctx.char;
				ctx.silabas.push(ctx.atual);
				ctx.atual = '';
				ctx.i++;
				return commit();
			})(),
	},

	// #6 | V–C–V → corta após a vogal
	{
		nome: "V-C-V",
		aplicar: (ctx, commit) => ctx.isV(ctx.char) &&
			ctx.isC(ctx.next) &&
			ctx.isV(ctx.next2) &&
			(() => {
				ctx.silabas.push(ctx.atual);
				ctx.atual = '';
				ctx.i++;
				return commit();
			})(),
	},

	// #7 | V–n–C → nasal termina sílaba anterior, exceto se formar "nh"
	{
		nome: "V-n-C",
		aplicar: (ctx, commit) => ctx.isV(ctx.prev) &&
			ctx.char.toLowerCase() === 'n' &&
			ctx.isC(ctx.next) &&
			!'h'.includes(ctx.next.toLowerCase()) &&
			(() => {
				ctx.atual += ctx.char;
				ctx.silabas.push(ctx.atual);
				ctx.atual = '';
				ctx.i++;
				return commit();
			})(),
	},

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

	const isV = (c) => !!c && vogais.includes(c.toLowerCase());
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

		const aplicada = regrasSeparacao.some(({ nome, aplicar }) =>
			aplicar(contexto, () => {
				debug(`Regra '${nome}' aplicada em i=${i}`);
				i = contexto.i;
				atual = contexto.atual;
				return true;
			})
		);

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
