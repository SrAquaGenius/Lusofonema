/* ----------------------------------------------------------------------------
 * File:     silabas.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

/**
 * Separa uma palavra em sílabas de forma heurística (não exata).
 * Regras básicas:
 * - Preferência por CV, CVC, V, VC
 * - Evita ditongos crescentes e decrescentes
 * - Heurística básica para lidar com encontros consonantais e hiatos
 */
function separarSilabas(palavra) {
	const vogais = 'aeiouáéíóúâêôãõà';
	const semivogais = ['i', 'u'];
	const silabas = [];
	let atual = '';

	for (let i = 0; i < palavra.length; i++) {
		const char = palavra[i];

		// Se encontrar o marcador de separação silábica "ˈ"
		if (char === 'ˈ') {
			// Se já tiver sílaba acumulada, finaliza-a
			if (atual) {
				silabas.push(atual);
				atual = '';
			}
			// Começa nova sílaba com 'ˈ'
			atual += char;
			continue;
		}

		atual += char;

		const prox = palavra[i + 1] || '';
		const prox2 = palavra[i + 2] || '';

		const ehVogal = vogais.includes(char.toLowerCase());
		const ehProxVogal = vogais.includes(prox.toLowerCase());
		const ehHiato = ehVogal && ehProxVogal &&
			!(semivogais.includes(char.toLowerCase()) ||
			semivogais.includes(prox.toLowerCase()));

		// Hiato: separa entre duas vogais distintas
		if (ehHiato) {
			silabas.push(atual);
			atual = '';
			continue;
		}

		// Se a sílaba termina com consoante antes de vogal, divide
		if (!vogais.includes(char.toLowerCase()) &&
			vogais.includes(prox.toLowerCase()) &&
			atual.length > 1) {
			silabas.push(atual.slice(0, -1));
			atual = atual.slice(-1);
		}
	}

	if (atual) silabas.push(atual);
	return silabas;
}

/**
 * Reinsere 'h' entre vogais separadas (hiatos), p.ex. 'criança' → 'crihansa'.
 * Se a sílaba tônica começa com 'ˈ' e há hiato, insere 'ˈh' antes da vogal da próxima sílaba.
 */
function marcarHiatosComH(palavra) {
	const silabas = separarSilabas(palavra);
	let resultado = silabas[0] || '';

	const vogais = 'aeiouáéíóúâêôãõà';

	for (let i = 1; i < silabas.length; i++) {
		const ultimaSilaba = silabas[i - 1];
		let silabaAtual = silabas[i];

		// Último caractere da sílaba anterior (ignorando 'ˈ' que só aparece no início)
		const ultimaChar = ultimaSilaba[ultimaSilaba.length - 1].toLowerCase();

		// Primeiro caractere da sílaba atual, que pode ser 'ˈ'
		// Se tiver 'ˈ' no início, a vogal relevante está no índice 1, caso contrário índice 0
		let primeiraChar = silabaAtual[0];
		if (primeiraChar === 'ˈ') {
			primeiraChar = silabaAtual[1] || ''; // segundo caractere
		}
		primeiraChar = primeiraChar.toLowerCase();

		if (vogais.includes(ultimaChar) && vogais.includes(primeiraChar)) {
			if (silabaAtual.startsWith('ˈ')) {
				// Insere 'h' após 'ˈ'
				silabaAtual = 'ˈh' + silabaAtual.slice(1);
			} else {
				silabaAtual = 'h' + silabaAtual;
			}
		}
		resultado += silabaAtual;
	}

	return resultado;
}


module.exports = { separarSilabas, marcarHiatosComH };
