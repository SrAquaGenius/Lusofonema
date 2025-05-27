# Luzófunêma

**Luzófunêma**, lê-se _/luzɔfuˈnemɐ/_, é um projeto linguístico experimental que visa criar uma ortografia alternativa para o português europeu, baseada diretamente na forma como a língua é falada.
Utilizando a transcrição fonética IPA como ponto de partida, o projeto converte palavras para uma representação fonética simplificada e mais intuitiva para os falantes.

## Objetivos

* Criar uma "língua ortofônica" baseada no português europeu.
* Tornar a pronúncia do português mais acessível através de uma grafia fonética consistente.
* Permitir experimentação linguística com uma nova forma de escrita.
* Inspirar outros a explorarem as extenção das respetivas línguas.

## Como funciona

1. As palavras são convertidas em transcrição fonética IPA usando `espeak-ng`.
2. Aplica-se uma camada de correções manuais para refletir mais precisamente a pronúncia em português europeu.
3. Utilizam-se regras fonéticas para converter o IPA numa ortografia fonética simplificada.
4. Os resultados podem, depois, ser guardados no ficheiro `dicionario.tsv`.

## Estrutura do projeto

```
.
├── README.md
├── dicionario.tsv
├── package.json
├── package-lock.json
├── corpus/...				# textos em português em xml para buscar palavras
└── src
	├── alfabeto.js			# Mostra o alfabeto fonético Luzofonema
	├── ipa.js				# Corrige a transcrição IPA de espeak-ng
	├── luzofonema.js		# Menu principal
	├── mostrar.js	 		# Mostra palavras convertidas
	├── regras.js			# Regras de conversão fonética
	└── verificar.js		# Verifica e adiciona novas palavras ao dicionário
```

## Como usar

1. Clona o repositório:

```bash
git clone https://github.com/teu-utilizador/luzofonema.git
cd luzofonema
```

2. Instala as dependências:

```bash
npm install
```

3. Executa o script principal:

```bash
node src/luzofonema.js
```

## Dependências

* [espeak-ng](https://github.com/espeak-ng/espeak-ng) (deve estar instalado no sistema)
* Node.js

## Licença

[MIT](LICENSE)

---

Desenvolvido com amor pela fonética do português europeu. \:portugal:
