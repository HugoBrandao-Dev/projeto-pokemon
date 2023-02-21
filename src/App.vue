<template>
  <div id="app">
    <AlertComponent
      @alert="setAlert($event)"
      @selectedPokemon="selectedPokemon($event)"
      @matchCanceled="cancelMatch()" />
    <div id="main" :class="{'selecting-pokemon': selectingPokemon}" >
      <HeaderComponent />
      <section id="jogadores">
        <PokemonComponent 
          @player="setPokemonPlayer($event)"
          @thrownPokeball="catchPokemon($event)"
          :items="items"
          :match="match" />
        <PokemonComponent 
          @player="setPokemonNPC($event)"
          :match="match" />
      </section>
      <MatchComponent @match="statusMatch($event)" />
      
      <ActionsComponent 
        @clearLog="clearArrays" 
        @generatePokemons="setPokemons"
        @setAbilities="setSpecialAbilities($event)"
        :player="jogador" 
        :npc="monstro" 
        :statusMatch="match" 
        :logActions="log" 
        :startable="configurations.canStart" />
      <LogsComponent @logActions="logActions($event)" />
    </div>
  </div>
</template>

<script>
  // Componentes
  import AlertComponent from './components/AlertComponent'
  import HeaderComponent from './components/HeaderComponent'
  import PokemonComponent from './components/PokemonComponent'
  import MatchComponent from './components/MatchComponent'
  import ActionsComponent from './components/ActionsComponent'
  import LogsComponent from './components/LogsComponent'

  // Bibliotecas
  import axios from 'axios'

  export default {
    name: 'App',
    data() {
      return {
        DATABASE_FAKE: {
          pokemonsOptionsForBeginners: ['bulbasaur', 'charmander', 'pichu', 'squirtle'],
          pokemonsJogador: [
          /*
            {
              info: {
                id: 0,
                specie: 'bulbasaur',
                experience: 123,
                chain: 1,
                evolution: 1,
                ball: 'poke-ball',
                pictureId: 1
              },
              plus_status: {
                hp: 0,
                attack: 0,
                special_attack: 0,
                defense: 0,
                special_defense: 0,
                speed: 0,
              }
            }
            */
          ]
        },
        jogador: {},
        monstro: {},
        configurations: {
          canStart: false,
          generation: {
            id: 1
          },
          limitsChains: []
        },
        match: {},
        myWindow: {},
        log: [],
        items: {
          ballsLinks: [],
          fruitsLinks: []
        }
      }
    },
    components: {
      AlertComponent,
      HeaderComponent,
      PokemonComponent,
      ActionsComponent,
      MatchComponent,
      LogsComponent,
    },
    created() {
       let pokemonsIDsInterval = this.getPokemonsIDsInterval(this.configurations.generation.id)
       this.setPokemonsChainsInterval(...pokemonsIDsInterval)
    },
    computed: {
      selectingPokemon() {
        return this.match.selecionarPokemon && this.match.emAndamento
      }
    },
    methods: {
      getPokemonsIDsInterval(generation) {
        let min = 0
        let max = 0

        switch(generation) {
            case 1:
              min = 1
              max = 151
              break
            case 2:
              min = 152
              max = 251
              break
            case 3:
              min = 252
              max = 386
              break
            case 4:
              min = 387
              max = 493
              break
            default:
              min = 494
              max = 649
          }

          return [min, max]
      },
      /*
        Buscará a cadeia evolutiva de cada espécie de pokemon e guardará os IDs máximo e mínimo.
        Uma cadeia evolutiva de um pokemon corresponde a um mesmo ID de chain.
      */
      async setPokemonsChainsInterval(minPokemonID = 1, maxPokemonID = 78) {
          let chains = { min: 0, max: 0 }

          for (let cont = minPokemonID; cont <= maxPokemonID; cont++) {
            let response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${ cont }/`)
            try {
              let link = response.data.evolution_chain.url
              let arrayLink = link.split('/')
              let idSpecie = parseInt(arrayLink[arrayLink.length - 2])
              if (chains.min == 0 && chains.max == 0) {
                chains.min = idSpecie
                chains.max = idSpecie
              } else if (idSpecie < chains.min) {
                chains.min = idSpecie
              } else if (idSpecie > chains.max) {
                chains.max = idSpecie
              }
            } catch (error) {
              console.log(error)
            }
          }

          this.configurations.limitsChains.push(chains.min)
          this.configurations.limitsChains.push(chains.max)
          this.configurations.canStart = true
      },
      setAlert($event) {
        this.myWindow = $event.myWindow
      },
      statusMatch($event) {
        this.match = $event.status
      },
      logActions($event) {
        this.log = $event.logAcoes
      },
      clearArrays() {
        this.log.splice(0)
        this.jogador.pokemon.info.special_attacks.splice(0)
      },
      async setSpecialAbilities(player, abilities) {
        abilities.forEach(abilityInfo => {
          let ability = abilityInfo.ability
          axios.get(ability.url)
            .then(res => {
              player.pokemon.info.special_attacks.push({
                name: ability.name.split('-').join(' '),
                effect: res.data.effect_entries[1].short_effect || '',
              })
            })
            .catch(error => {
              console.log(error)
            })
        })
      },
      // Cadastra um novo pokemon, quando sua captura ocorreu com sucesso.
      addPokemon(ball) {
        let newPokemon = {
          info: {
            id: function() {
              this.DATABASE_FAKE.pokemonsJogador.reduce((actual, next) => {
                return Math.max(actual, next)
              })
            },
            specie: this.monstro.pokemon.info.specie,
            experience: this.monstro.pokemon.info.experience,
            chain: this.monstro.pokemon.info.chain,
            types: this.monstro.pokemon.info.types,
            evolution: this.monstro.pokemon.info.evolution,
            ball,
            pictureId: this.getPictureId(this.monstro.pokemon.info.picture)
          },
          plus_status: {
            hp: 0,
            attack: 0,
            special_attack: 0,
            defense: 0,
            special_defense: 0,
            speed: 0,
          }
        }
        this.DATABASE_FAKE.pokemonsJogador.push(newPokemon)
      },
      catchPokemon($event) {
        let rate = this.getRandom(1, 100)
        let successfully = false

        switch ($event.ball) {
          case 'poke-ball':
            rate *= 1
            break
          case 'great-ball':
            rate *= 1.5
            break
          case 'ultra-ball':
            rate *= 2
            break
          default:
            rate *= 100
        }

        switch (this.monstro.pokemon.info.evolution) {
          case 1:
            if (rate > 50) {
              this.setMessage('info', 'Sucesso!', [`${ this.monstro.pokemon.info.specie.toUpperCase() } foi capturado(a) com sucesso!`])
              successfully = true
            } else {
              this.setMessage('alert', 'Fugiu!', [`Infelizmente, o(a) ${ this.monstro.pokemon.info.specie.toUpperCase() } fugiu.`])
            }
            break
          case 2:
            if (rate > 75) {
              this.setMessage('info', 'Sucesso!', [`${ this.monstro.pokemon.info.specie.toUpperCase() } foi capturado(a) com sucesso!`])
              successfully = true
            } else {
              this.setMessage('alert', 'Fugiu!', [`Infelizmente, o(a) ${ this.monstro.pokemon.info.specie.toUpperCase() } fugiu.`])
            }
            break
          default:
            if (rate > 90) {
              this.setMessage('info', 'Sucesso!', [`${ this.monstro.pokemon.info.specie.toUpperCase() } foi capturado(a) com sucesso!`])
              successfully = true
            } else {
              this.setMessage('alert', 'Fugiu!', [`Infelizmente, o(a) ${ this.monstro.pokemon.info.specie.toUpperCase() } fugiu.`])
            }
        }

        if (successfully) {
          this.addPokemon($event.ball)
        }
      },
      setMessage(type, title, content) {
        this.myWindow.type = type
        this.myWindow.title = title
        this.myWindow.content = content
      },
      setPokemonPlayer($event) {
        this.jogador = $event.player
      },
      setPokemonNPC($event) {
        this.monstro = $event.player
        this.monstro.name = 'NPC'
      },
      async getBallsIcons() {
        let balls = ['poke-ball', 'great-ball', 'ultra-ball', 'master-ball']

        for (let ball of balls) {
          try {
            let response = await axios.get(`https://pokeapi.co/api/v2/item/${ ball }`)
            this.items.ballsLinks.push({
              name: ball,
              iconLink: response.data.sprites.default
            })
          }
          catch(error) {
            console.log(error)
          }
        }
      },
      async getFruitsIcons() {
        let fruits = ['jaboca-berry', 'razz-berry', 'bluk-berry']

        for (let fruit of fruits) {
          try {
            let response = await axios.get(`https://pokeapi.co/api/v2/item/${ fruit }`)
            this.items.fruitsLinks.push({
              name: fruit,
              iconLink: response.data.sprites.default
            })
          }
          catch (error) {
            console.log(error)
          }
        }
        
      },
      getRandom(min, max) {
        return Math.round(Math.random() * (max - min) + min)
      },
      // rateHigh chance (%) mínima para sair a terceira evolução do pokemon;
      // rateMiddle chance (%) mínima para sair a segunda evolução do pokemon;
      getLevel(rateHigh = 25, rateMiddle = 50) {
        let myRandom = this.getRandom(1, 100)
        
        if (myRandom <= rateHigh) {
          return 3
        } else if (myRandom <= rateMiddle) {
          return 2
        } else {
          return 1
        }
      },
      setTypeImageLink(pokemon) {
        pokemon.info.types.forEach(item => {
          let style = 'ios-filled' // valor padrão
          let icon = ''
          let size = '16' // valor padrão
          let color = 'ffffff' // valor padrão
          switch (item.type) {
            case 'normal':
              icon = 'scary-hand'
              break
            case 'fighting':
              icon = 'action'
              break
            case 'flying':
              icon = 'wing'
              break
            case 'poison':
              style = 'fluency-systems-filled'
              icon = 'poison'
              break
            case 'ground':
              style = 'glyph-neue'
              icon = 'earth-element'
              break
            case 'rock':
              style = 'ios-glyphs'
              icon = 'rock'
              break
            case 'bug':
              icon = 'insect'
              break
            case 'ghost':
              icon = 'ghost'
              break
            case 'fire':
              style = 'glyph-neue'
              icon = 'fire-element'
              break
            case 'water':
              icon = 'ocean-wave'
              break
            case 'grass':
              style = 'windows'
              icon = 'grass'
              break
            case 'electric':
              style = 'fluency-systems-filled'
              icon = 'lightning-bolt'
              break
            case 'psychic':
              icon = 'millenium-eye'
              break
            case 'ice':
              style = 'external-goofy-solid-kerismaker'
              icon = 'external-Snow-Flake-weather-goofy-solid-kerismaker'
              break
            case 'dragon':
              style = 'glyph-neue'
              icon = 'dragon'
              break
            case 'fairy':
              style = 'external-others-pike-picture'
              icon = 'external-Fairy-magic-others-pike-picture-3'
              break
            case 'steel':
              icon = 'steel-i-beam'
              break
            default:
              // Adicionar icones para fairy, steel.
              icon = 'question-mark'
          }
          item.url = `https://img.icons8.com/${ style }/${ size }/${ color }/${ icon }.png`
        })
      },
      // min é o menor valor da chain a ser procurada (todo pokemon e suas evoluções tem sua chain)
      // max é o maior valor da chain a ser procurada (todo pokemon e suas evoluções tem sua chain)
      async setPokemon(player, level = 1, min = 1, max = 78, selectedChainId = 0) {
        let chainId = selectedChainId || this.getRandom(min, max)
        
        axios.get(`https://pokeapi.co/api/v2/evolution-chain/${ chainId }/`)
          .then(res => {
          
            // Pega a forma base
            let pokemons = [res.data.chain.species.name]
            
            // Pega a(s) primeira(s) evolução(ões)
            let lengthEvolution_2 = res.data.chain.evolves_to.length
            if (lengthEvolution_2) {
              let position_2 = this.getRandom(0, lengthEvolution_2 - 1)
              let pokemon_2 = res.data.chain.evolves_to[position_2].species.name
              pokemons.push(pokemon_2)
              
              // Pega a(s) segunda(s) evolução(ões)
              let lengthEvolution_3 = res.data.chain.evolves_to[0].evolves_to.length
              if (lengthEvolution_3) {
                let position_3 = this.getRandom(0, lengthEvolution_3 - 1)
                let pokemon_3 = res.data.chain.evolves_to[position_2].evolves_to[position_3].species.name
                pokemons.push(pokemon_3)
              }
            }
            
            // Verifica se o pokemon tem a forma/evolução buscada.
            if (pokemons[level-1]) {
              let pokemonId = pokemons[level-1]
              axios.get(`https://pokeapi.co/api/v2/pokemon/${ pokemonId }`)
                .then(resPokemon => {
                  
                  // Importando os status base para o pokemon.
                  let pokemonInfo = resPokemon.data
                  player.pokemon.life = pokemonInfo.stats[0].base_stat
                  player.pokemon.base_status.hp = pokemonInfo.stats[0].base_stat
                  player.pokemon.base_status.attack = pokemonInfo.stats[1].base_stat
                  player.pokemon.base_status.special_attack = pokemonInfo.stats[3].base_stat
                  player.pokemon.base_status.defense = pokemonInfo.stats[2].base_stat
                  player.pokemon.base_status.special_defense = pokemonInfo.stats[4].base_stat
                  player.pokemon.base_status.speed = pokemonInfo.stats[5].base_stat
                  player.pokemon.info.experience = pokemonInfo.base_experience
                  player.pokemon.info.specie = pokemonInfo.species.name
                  player.pokemon.info.chain = chainId
                  player.pokemon.info.evolution = level
                  player.pokemon.info.types = []
                  for (let item of pokemonInfo.types) {
                    player.pokemon.info.types.push({
                      type: item.type.name,
                      url: null
                    })
                  }
                  this.setTypeImageLink(player.pokemon)
                  this.setSpecialAbilities(player, pokemonInfo.abilities)

                  // Configura a posição (foto) do pokemon, a depender de quem é o dono do pokemon (Player ou NPC)
                  if (player.name == 'Player') {
                    player.pokemon.info.picture = pokemonInfo.sprites.back_default
                  } else {
                    player.pokemon.info.picture = pokemonInfo.sprites.front_default
                  }
                })
                .catch(error => {
                  console.log(error)
                })
            } else {
              console.log(`OPS!! O pokemon ${ pokemons[0] } não tem a ${ level }ª evolução.`)
              
              // Caso não haja a forma/evolução sorteada, se busca a forma/evolução anterior.
              this.setPokemon(player, level-1, min, max, chainId)
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      resetStatus(player) {
        player.items = {
          balls: {
          'poke-ball': 150,
          'great-ball': 10,
          'ultra-ball': 800,
          'master-ball': 2
          },
          fruits: {
            'jaboca-berry': 10, 
            'razz-berry': 5, 
            'bluk-berry': 1
          }
        }
        player.pokemon = {
          life: 100,
          base_status: {
            hp: 100,
            attack: 0,
            special_attack: 0,
            defense: 0,
            special_defense: 0,
            speed: 0,
          },
          info: {
            specie: '',
            experience: 0,
            types: [],
            chain: 0,
            /*
            1: Pokemon base;
            2: segunda evolução;
            3: terceira evolução.
            */
            evolution: 0,
            picture: 'https://img.icons8.com/dotty/96/ffffff/user.png',
            special_attacks: []
          },
        }
      },
      cancelMatch() {
        this.resetStatus(this.jogador)
        this.resetStatus(this.monstro)

        this.match.emAndamento = false
        this.match.selecionarPokemon = false
        this.match.mostrarResultado = false
        this.match.status = ''
        this.match.mensagem = ''
      },
      selectedPokemon($event) {
        let pokemon = $event.pokemon
        let { chain, level } = pokemon.info
        this.setPokemon(this.jogador, level, ...this.configurations.limitsChains, chain)
        if (this.DATABASE_FAKE.pokemonsJogador.length == 0) {
          this.DATABASE_FAKE.pokemonsJogador.push(pokemon)
        }

        this.match.selecionarPokemon = false
      },
      // Separa somente o ID do link de uma chain de um pokemon
      getChainId(link) {
        let arrayLink = link.split('/')
        let id = parseInt(arrayLink[arrayLink.length - 2])
        return id
      },
      getPictureId(link) {
        let arrayLink = link.split('/')
        let lastItem = arrayLink[arrayLink.length - 1]
        let id = parseInt(lastItem.split('.')[0])
        return id
      },
      async setPokemons() {
        this.match.selecionarPokemon = true
        if (this.DATABASE_FAKE.pokemonsJogador.length == 0) {
          let pokemonsWithInfos = []
          for (let name of this.DATABASE_FAKE.pokemonsOptionsForBeginners) {
            let pokemon = { info: {}, plus_status: {} }
            try {
              let responsePokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${ name }`)
              pokemon.info.specie = responsePokemon.data.species.name
              pokemon.info.experience = responsePokemon.data.base_experience
              let responseSpecie = await axios.get(responsePokemon.data.species.url)
              pokemon.info.chain = this.getChainId(responseSpecie.data.evolution_chain.url)
              pokemon.info.evolution = 1
              pokemon.info.ball = 'poke-ball'
              pokemon.info.pictureId = responsePokemon.data.id
              pokemon.info.types = []
              for (let item of responsePokemon.data.types) {
                pokemon.info.types.push({
                  type: item.type.name,
                  url: null
                })
              }
              this.setTypeImageLink(pokemon)
            } catch (error) {
              console.log(error)
            }

            pokemonsWithInfos.push(pokemon)
          }

          this.setMessage('info', 'Escolha seu primeiro pokemon:', pokemonsWithInfos)
        } else {
          this.setMessage('info', 'Selecione seu pokemon:', this.DATABASE_FAKE.pokemonsJogador)
        }

        // Configurações das escolhas dos pokemons.
        let levelNPC = this.getLevel(1,2)

        this.monstro.pokemon.info.evolution = levelNPC

        // NPC
        this.setPokemon(this.monstro, levelNPC, ...this.configurations.limitsChains)

        if (this.items.ballsLinks.length === 0) {
          this.items.ballsLinks = []
          this.getBallsIcons()
        }
        if (this.items.fruitsLinks.length === 0) {
          this.items.fruitsLinks = []
          this.getFruitsIcons()
        }
      }
    }
  }
</script>

<style>
  /* Reset */
  * {
    font-family: 'Orbitron', sans-serif;
    font-weight: normal;
    font-size: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #47476b;
    color: #ffffff;
  }

  h1, h2 {
    font-weight: bold;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  ul li {
    list-style: none;
  }

  strong {
    font-weight: bolder;
  }

  .img-disabled {
    filter: grayscale(100%);
  }

  .centralizar {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .espacar {
    padding: 10px;
  }

  .btn {
    padding: 8px 10px;
    font-weight: bold;
    margin-right: 20px;
    border: 3px outset;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    outline: none;
  }

  /* ############### CORPO ############### */

  #app #main {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Seções */

  #jogadores {
    box-shadow: 0px 0px 5px #ffffff;
    width: 100%;
  }

  #mensagem-resultado {
    margin-top: 20px;
  }

  #jogadores {
    display: flex;
    justify-content: space-between;
  }

  /* ALERTA DE SELEÇÃO DE POKEMON */

  .selecting-pokemon {
    filter: blur(3px);
  }

  /* TIPOS DOS POKEMONS */

  .types {
    display: flex;
    margin-bottom: 10px;
  }

  .type {
    border: ridge 2px #ffffff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .type img {
    height: 16px;
  }

  .normal {
    background-color: #996600;
  }

  .fighting {
    background-color: #cc6600;
  }
  
  .grass {
    background-color: #33cc33;
  }
  
  .poison {
    background-color: #6600ff;
  }
  
  .ground {
    background-color: #3e3202;
  }
  
  .rock {
    background-color: #a6a6a6;
  }
  
  .insect {
    background-color: #008000;
  }
  
  .ghost {
    background-color: #262626;
  }
  
  .electric {
    background-color: #e6e600;
  }
  
  .fire {
    background-color: #ff0000;
  }
  
  .dragon {
    background-color: #cc3300;
  }
  
  .water {
    background-color: #3366ff;
  }
  
  .psychic {
    background-color: #9900cc;
  }
  
  .ice {
    background-color: #00ccff;
  }
  
  .flying {
    background-color: #669999;
  }
  
  .fairy {
    background-color: #ff0066;
  }

  .steel {
    background-color:  #666666;
  }

</style>
