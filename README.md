# Projeto Pokemon

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Descrição
Projeto de __portifólio__ criado com base em outro pequeno projeto, desenvolvido no __Curso Vue JS 2 - O Guia Completo (incl. Vue Router e Vuex)__, disponível na plataforma Udemy, chamado "O Matador de Monstros" (segundo projeto do curso).

O projeto base não pode ser visualizado, já que está como privado no meu GitHub, uma vez que não o terminei o curso.

## Objetivo 
Tem por finalidade testar minhas habilidades com as tecnologias de desenvolvimento __BACK-END__, apesar de conter várias refatorações e novas implementações na parte de front-end, também.

## Tecnologias
### Framework(s)
* Vue JS 2: Framework JavaScript, usado desde o projeto base.

### Outra(s)
* Axios: Cliente HTTP, para consumo de API, neste caso da API do pokémon, a __"PokéAPI"__.
* Icons8: Software de design gráfico, para a uso de icones e imagens. Utilizei o plano free.
* Validator: Biblioteca para validação de campos de formulários.
<a target="_blank" href="https://icons8.com/icon/16cSlppPLXYA/name">Name icon by Icons8</a>

## Observações
Alguns pokemons não tem foto de costas de alguma de suas evoluções (back_default), sendo 
renderizado a figura de um monstro no lugar. Por exemplo:
* Annihilape - segunda evolução de Monkey;
* Kleavor - uma das possíveis evoluções do Scyther;

Os botões de __ataques especiais__ não tem funcionalidade ainda, já que os efeitos que eles tem estão
de forma descritiva, sendo necessário representar seus efeitos no status (base e plus), seja para o pokemon do jogador ou para o pokemon do NPC, isso para cada um do ataques especiais de cada um dos pokemons.

Uma vez que não foi utilizado frameworks/bibliotecas para estilo, e sim CSS puro, é necessário implementar breakpoints para melhor responsividade.

## Bugs

* Se clicar em cancelar, na tela de seleção de pokemon, depois de já ter clicado em iniciar partida, está selecionando e renderizando o pokemon do NPC;
* Quando um alert é exibido, os botões da "tela de fundo" continuam ativos.

## Possíveis melhorias futuras

* Criar um baú, onde o jogador possa colocar pokemons que não quer utilizar, para esvaziar a tela de seleção de pokemons;
* Criar mecanismo que o último pokemon selecionado seja o padrão na tela de seleção.