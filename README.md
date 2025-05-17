# Luzofonema

**Luzofonema** é um projeto linguístico-experimental que visa criar uma ortografia alternativa para o português europeu, baseada diretamente na forma como a língua é falada. Utilizando a transcrição fonética IPA como ponto de partida, o projeto converte palavras para uma representação fonética simplificada e mais intuitiva.

## Objetivos

* Criar uma "língua ortofônica" baseada no português europeu.
* Tornar a pronúncia do português mais acessível através de uma grafia fonética consistente.
* Permitir experimentação linguística e/ou artística com uma nova forma de escrita.
* Possibilitar colaboração na correção e evolução das regras fonéticas.

## Como funciona

1. As palavras são convertidas em transcrição fonética IPA usando `espeak-ng`.
2. Aplica-se uma camada de correções manuais para refletir mais precisamente a pronúncia em português europeu.
3. Utilizam-se regras fonéticas para converter o IPA numa ortografia fonética simplificada (o Luzofonema).
4. Os resultados são guardados num ficheiro `dicionario.tsv`.

## Estrutura do projeto

```
.
├── dicionario.tsv
├── package.json
├── package-lock.json
└── src
    ├── alfabeto.js        # Mostra o alfabeto fonético Luzofonema
    ├── ipa.js             # Corrige a transcrição IPA de espeak-ng
    ├── luzofonema.js      # Menu principal
    ├── mostrar.js         # Mostra palavras convertidas
    ├── regras.js          # Regras de conversão fonética
    └── verificar.js       # Verifica e adiciona novas palavras ao dicionário
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

## Contribuição

No futuro, o projeto pode evoluir para uma plataforma de **anotação colaborativa**. Por agora, apenas o autor está a introduzir palavras manualmente. Sugestões, ideias ou correcções são bem-vindas via pull request ou issue.

## Licença

[MIT](LICENSE)

---

Desenvolvido com amor pela fonética do português europeu. \:portugal:
