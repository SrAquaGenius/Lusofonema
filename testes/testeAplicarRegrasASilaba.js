/* ----------------------------------------------------------------------------
 * File:     testeAplicarRegrasASilaba.js
 * Authors:  SrAqua
 * ------------------------------------------------------------------------- */

const { aplicarRegrasASilaba } = require('../src/aplicarRegras');
const { mudarDebug } = require("../src/debug");

mudarDebug();
const resultado1 = aplicarRegrasASilaba('cam', 'kɐ̃');
console.log("Resultado 1:", resultado1);

const resultado2 = aplicarRegrasASilaba('sem', 'sẽ');
console.log("Resultado 2:", resultado2);

const resultado3 = aplicarRegrasASilaba('tam', 'tɐ̃w', true);
console.log("Resultado 3:", resultado3);
