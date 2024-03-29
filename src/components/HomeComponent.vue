<template>
  <div>
    <AlertComponent
      @alert="setAlert($event)"
      @selectedPokemon="selectedPokemon($event)"
      @matchCanceled="cancelMatch()" />
    <ShoppingComponent
      @closeShoppingWindow="windows.showShoppingScreen = false"
      @refreshAmounts="refreshAmounts"
      v-show="windows.showShoppingScreen" />
    <div id="main" :class="{'selecting-pokemon': selectingPokemon}" >
      <HeaderComponent
        @user="setUser($event)"
        @hasUser="getCoinsInfos()"
        @showShoppingWindow="windows.showShoppingScreen = !windows.showShoppingScreen"
        @userLogout="cancelMatch"
        :itemsCoins="items.coinsLinks"
        :player="jogador"
        :match="match" />
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
        @refreshAmounts="refreshAmounts"
        @increaseExp="increaseExp"
        :user="user"
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
  import AlertComponent from '../components/AlertComponent'
  import ShoppingComponent from '../components/ShoppingComponent'
  import HeaderComponent from '../components/HeaderComponent'
  import PokemonComponent from '../components/PokemonComponent'
  import MatchComponent from '../components/MatchComponent'
  import ActionsComponent from '../components/ActionsComponent'
  import LogsComponent from '../components/LogsComponent'

  // Bibliotecas
  import axios from 'axios'

  /*
  Instância do axios, para atender, diretamente, as requisições feitas para o localhost do back-end.
  */
  const axios_database = axios.create({
    baseURL: 'http://localhost:4000'
  })

  export default {
    name: 'App',
    data() {
      return {
        user: {},
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
          fruitsLinks: [],
          coinsLinks: []
        },
        windows: {
          showShoppingScreen: false
        }
      }
    },
    components: {
      AlertComponent,
      ShoppingComponent,
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
      getAuth() {
        return {
          headers: {
            common: {
              Authorization: `Bearer ${ localStorage.getItem('PokemonUserToken') }`
            }
          }
        }
      },
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
      setUser($event) {
        this.user = $event.user
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
        try {
          let special_attacks = []
          for (let abilityInfo of abilities) {
            let responseEffect = await axios.get(abilityInfo.ability.url)
            let effect = ''
            if (responseEffect.data.effect_entries.length) {
              let effectArray = responseEffect.data.effect_entries.filter(effectItem => {
                return effectItem.language.name == 'en'
              })
              effect = effectArray[0].short_effect
            }
            
            special_attacks.push({
              name: abilityInfo.ability.name,
              effect
            })
          }

          player.pokemon.info.special_attacks = special_attacks
        } catch (error) {
          console.log(error)
        }
      },
      // Cadastra um novo pokemon, quando sua captura ocorreu com sucesso.
      async addPokemon(ball_type) {
        try {
          let resCatched = await axios_database.post('/capture', {
            specie: `${ this.monstro.pokemon.info.specie }`,
            chain_id: `${ this.monstro.pokemon.info.chain_id }`,
            evolution_id: `${ this.monstro.pokemon.info.evolution_id }`,
            experience_plus: '0',
            ball_id: `${ ball_type }`,
            battles: '0',
            battles_won: '0'
          }, this.getAuth())

          if (resCatched.data.errorField) {
            console.log(resCatched.data.msg)
          }
        } catch (error) {
          console.log(error)
        }
      },
      async getAllEvolutions(chain_id) {
        try {
          let responseChain = await axios.get(`https://pokeapi.co/api/v2/evolution-chain/${ chain_id }/`)
            // Pega a forma base
            let evolutions = [
              {
                species: [responseChain.data.chain.species.name]
              }
            ]
            
            // Pega a(s) primeira(s) evolução(ões)
            let lengthEvolution_2 = responseChain.data.chain.evolves_to.length
            if (lengthEvolution_2) {
              let pokemons_2 = { species: [] }
              for (let specie of responseChain.data.chain.evolves_to) {
                pokemons_2.species.push(specie.species.name)
              }
              evolutions.push(pokemons_2)
              
              // Pega a(s) segunda(s) evolução(ões)
              let lengthEvolution_3 = responseChain.data.chain.evolves_to[0].evolves_to.length
              if (lengthEvolution_3) {
                let pokemons_3 = { species: [] }
                for (let specie of responseChain.data.chain.evolves_to[0].evolves_to) {
                  pokemons_3.species.push(specie.species.name)
                }
                evolutions.push(pokemons_3)
              }
            }

          for (let evolution of evolutions) {
            let responsePokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${ evolution.species[0] }`)
            evolution.base_experience = responsePokemon.data.base_experience
          }

          return evolutions
        } catch (error) {
          console.log(error)
        }
      },
      async canAlreadyEvolve(evolutions) {
        try {
          let canEvolve = false

          // evolution representa a evolução, mas também a próxima, já que o array de começa de 0.
          let indexNextEvolution = this.jogador.pokemon.info.evolution_id

          let resPokemon = await axios_database.get(`/user/pokemon/${ this.jogador.pokemon.info.id }`, this.getAuth())

          // Verifica se tem próxima evolução
          if (evolutions[indexNextEvolution]) {
            // Tem o descemento para pegar o pokemon na sua evolução atual
            let base_experience = evolutions[indexNextEvolution - 1].base_experience
            let experience_plus = resPokemon.data.experience_plus
            let playerExperience = base_experience + experience_plus

            let experienceNextEvolution = evolutions[indexNextEvolution].base_experience

            // Verifica se tem experiência necessária para evoluir.
            if (playerExperience >= experienceNextEvolution) {
              canEvolve = true
            } else {
              canEvolve = false
            }
          } else {
            canEvolve = false
          }

          return canEvolve
        } catch (error) {
          console.error(error)
        }
      },
      async setEvolve() {
        try {
          let resPokemon = await axios_database.get(`/user/pokemon/${ this.jogador.pokemon.info.id }`, this.getAuth())

          if (resPokemon.data.errorField) {
            console.log(resPokemon.data.msg)
          } else {
            try {
              let { id, chain_id, evolution_id, experience_plus } = resPokemon.data

              let evolutions = await this.getAllEvolutions(chain_id)

              // evolution representa a evolução, mas também a próxima, já que o array de começa de 0.
              let nextEvolve = evolution_id

              let maxIndex = evolutions[nextEvolve].species.length - 1

              // Pega o index de um pokemon da próxima evolução, caso seja um array.
              let indexNextSpecie = this.getRandom(0, maxIndex)
              let nextEvolveSpecie = evolutions[nextEvolve].species[indexNextSpecie]

              // Pega a base_experience da próxima evolução, para o cálculo da experience_plus.
              let expNextEvolution = evolutions[nextEvolve].base_experience

              // A nova experience_plus, terá como base o base_experience da práxima evolução.
              let newPlusExperience = (experience_plus + this.jogador.pokemon.info.base_experience) - expNextEvolution

              let resNextEvolve = await axios.get(`https://pokeapi.co/api/v2/pokemon/${ nextEvolveSpecie }`)

              let resEvolve = await axios_database.post('/upgradePokemon', {
                id: `${ id }`,
                specie: resNextEvolve.data.species.name,
                evolution_id: `${ ++evolution_id }`,
                experience_plus: `${ newPlusExperience }`
              }, this.getAuth())

              if (resEvolve.data.errorField) {
                console.log(resEvolve.data.msg)
              }
            } catch (error) {
              console.error(error)
            }
          }
        } catch (error) {
          console.log(error)
        }
      },
      async refreshAmounts() {
        try {
          let resFruits = await axios_database.get('/user/fruits',this.getAuth())
          if (resFruits.data.errorField) {
            console.log(resFruits.data.msg)
          } else {
            for (let itemList of resFruits.data) {
              this.jogador.items.fruits[itemList.item] = itemList.amount
            }
          }

          let resBalls = await axios_database.get('/user/balls',this.getAuth())
          if (resBalls.data.errorField) {
            console.log(resBalls.data.msg)
          } else {
            for (let itemList of resBalls.data) {
              this.jogador.items.balls[itemList.item] = itemList.amount
            }
          }

          let resCoins = await axios_database.get('/user/coins',this.getAuth())
          if (resCoins.data.errorField) {
            console.log(resCoins.data.msg)
          } else {
            for (let itemList of resCoins.data) {
              this.jogador.items.coins[itemList.item] = itemList.amount
            }
          }
        } catch (error) {
          console.log(error)
        }
      },
      // Aumenta o Experience do pokemon do jogador, caso ele vença a batalha
      // experienceRate: taxa de aumento da experienca (%);
      // max: valor máximo do aumento da experiencia (%).
      async increaseExp(experienceRate = 10, max = experienceRate + 5) {
        try {
          let rate = this.getRandom(experienceRate, max)
          let rateFormated = rate / 100
          let expMonster = this.monstro.pokemon.info.base_experience
          let earned = Math.round(expMonster * rateFormated)
          
          let resPokemonInfo = await axios_database.get(`/user/pokemon/${ this.jogador.pokemon.info.id }`, this.getAuth())

          let { specie, experience_plus, evolution_id, chain_id } = resPokemonInfo.data
          let newExp = parseInt(experience_plus) + earned

          await axios_database.post('/upgradePokemon', {
            id: `${ this.jogador.pokemon.info.id }`,
            specie,
            evolution_id: `${ evolution_id }`,
            experience_plus: `${ newExp }`,
          }, this.getAuth())

          let allEvolutions = await this.getAllEvolutions(chain_id)

          let canEvolve = await this.canAlreadyEvolve(allEvolutions)

          if (canEvolve) {
            this.setEvolve()
          }

          this.refreshAmounts()
        } catch (error) {
          console.error(error)
        }
      },
      async saveBallsAmounts() {
        try {
          let resBalls = await axios_database.post('/user/balls/update', {
            'poke-ball': `${ this.jogador.items.balls['poke-ball'] }`,
            'great-ball': `${ this.jogador.items.balls['great-ball'] }`,
            'ultra-ball': `${ this.jogador.items.balls['ultra-ball'] }`,
            'master-ball': `${ this.jogador.items.balls['master-ball'] }`
          }, this.getAuth())
          if (resBalls.data.errorField) {
            console.error(resBalls.data.msg)
          }
        } catch (error) {
          console.error(error)
        }
      },
      catchPokemon($event) {
        let type_item = null
        this.saveBallsAmounts()
        let rate = this.getRandom(1, 100)
        let specieUpper = this.monstro.pokemon.info.specie.toUpperCase()

        switch ($event.ball) {
          case 'poke-ball':
            type_item = 1
            rate *= 1
            break
          case 'great-ball':
            type_item = 2
            rate *= 1.5
            break
          case 'ultra-ball':
            type_item = 3
            rate *= 2
            break
          default:
            type_item = 4
            rate *= 100
        }

        let successfully = false

        switch (this.monstro.pokemon.info.evolution_id) {
          case 1:
            if (rate > 50) {
              successfully = true
            }
            break
          case 2:
            if (rate > 75) {
              successfully = true
            }
            break
          default:
            if (rate > 90) {
              successfully = true
            }
        }

        if (successfully) {
          this.match.capture.captured = true
          this.setMessage('info', 'Capturado!', [`${ specieUpper } foi capturado(a) com sucesso!`])
          this.addPokemon(type_item)
        } else {
          this.match.capture.attempts++
          this.setMessage('alert', 'Escapou!', [`O(a) ${ specieUpper } escapou da ${ $event.ball }.`])
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
      async getCoinsIcons() {
        let coins = ['relic-copper', 'relic-silver', 'relic-gold']

        for (let coin of coins) {
          try {
            let response = await axios.get(`https://pokeapi.co/api/v2/item/${ coin }`)
            this.items.coinsLinks.push({
              name: `${ coin.split('-')[1] }-coin`,
              iconLink: response.data.sprites.default
            })
          }
          catch (error) {
            console.log(error)
          }
        }
      },
      async getCoinsAmounts() {
        try {
          let resCoins = await axios_database.get('/user/coins', this.getAuth())
          if (resCoins.data.errorField) {
            console.log(resCoins.data.msg)
          } else {
            resCoins.data.map(coin => {
              this.jogador.items.coins[coin.item] = coin.amount
            })
          }
        } catch (error) {
          console.log(error)
        }
      },
      async getCoinsInfos() {
        try {
          if (this.items.coinsLinks.length === 0) {
            this.items.coinsLinks = []
            await this.getCoinsIcons()
          }
          await this.getCoinsAmounts()
        } catch (error) {
          console.log(error)
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
      setTypes(pokemon, types) {
        pokemon.info.types = []
        for (let item of types) {
          pokemon.info.types.push({
            type: item.type.name,
            url: null
          })
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
            case 'dark':
              style = 'sf-regular-filled'
              icon = 'bright-moon'
              break
            default:
              // Adicionar icones para fairy, steel.
              icon = 'question-mark'
          }
          item.url = `https://img.icons8.com/${ style }/${ size }/${ color }/${ icon }.png`
        })
      },
      // Setta todos os valores do status base do pokemon.
      setBaseStatus(arrayOfStatusFromAPI, player) {
        for (let status of arrayOfStatusFromAPI) {
          let statusName = status.stat.name.split('-').join('_')
          player.pokemon.base_status[statusName] = status.base_stat
        }
      },
      /*
      Método de redifine o plus_status, baseado na experiencia do pokemon (quanto mais batalha, 
      mais forte)
      */
      async setPlusStatus(pokemon) {
        try {
          let specie = pokemon.info.specie
          let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${ specie }`)
          let baseExp = response.data.base_experience

          if (pokemon.info.experience_plus) {
            let totalExperience = pokemon.info.experience_plus + response.data.base_experience

            let percentageDif = 1 - (((baseExp * 100) / totalExperience) / 100)
            
            for (let status of Object.keys(pokemon.plus_status)) {
              pokemon.plus_status[status] = Math.round(pokemon.base_status[status] * percentageDif)
            }
          } else {
            for (let status of Object.keys(pokemon.base_status)) {
              pokemon.plus_status[status] = 0
            }
          }
        } catch (error) {
          console.log(error)
        }
      },
      // min é o menor valor da chain a ser procurada (todo pokemon e suas evoluções tem sua chain)
      // max é o maior valor da chain a ser procurada (todo pokemon e suas evoluções tem sua chain)
      async setPokemon(player, pokemon = {}, selectionType = 'random') {
        try {
          let resPokemon = null
          if (selectionType == 'random') {
            pokemon.info.chain_id = pokemon.info.chain_id || this.getRandom(...this.configurations.limitsChains)

            let pokemons = await this.getAllEvolutions(pokemon.info.chain_id)

            let indexEvolution = pokemon.info.evolution_id - 1

            if (pokemons[indexEvolution]) {
              let maxIndex = pokemons[indexEvolution].species.length - 1
              let indexSpecie = this.getRandom(0, maxIndex)
              let specie = pokemons[indexEvolution].species[indexSpecie]
              resPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${ specie }`)
              
              player.pokemon.info.specie = resPokemon.data.species.name
              player.pokemon.info.evolution_id = pokemon.info.evolution_id
              player.pokemon.info.picture = resPokemon.data.sprites.front_default
              player.pokemon.info.chain_id = pokemon.info.chain_id
              player.pokemon.life = resPokemon.data.stats[0].base_stat
            } else {
              if (pokemon.info.evolution_id && pokemon.info.evolution_id > 0) {
                console.log(`OPS!! O pokemon ${ pokemons[0].species[0] } não tem a ${ pokemon.info.evolution_id }ª evolução.`)
                
                // Caso não haja a forma/evolução sorteada, se busca a forma/evolução anterior.
                pokemon.info.evolution_id--
                await this.setPokemon(player, pokemon)
              }
            }
          } else {
            resPokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${ pokemon.info.specie }`)
            let resPokemonDB = await axios_database.get(`/user/pokemon/${ pokemon.info.id }`, this.getAuth())


            player.pokemon.info.picture = resPokemon.data.sprites.back_default

            if (resPokemonDB.data.experience_plus) {
              player.pokemon.life = resPokemon.data.stats[0].base_stat + pokemon.plus_status.hp
            } else {
              player.pokemon.life = resPokemon.data.stats[0].base_stat
            }

            for (let item of Object.keys(resPokemonDB.data)) {
              player.pokemon.info[item] = resPokemonDB.data[item]
            }
          }

          player.pokemon.info.base_experience = resPokemon.data.base_experience
          await this.setBaseStatus(resPokemon.data.stats, player)
          await this.setPlusStatus(player.pokemon)
          await this.setTypes(player.pokemon, resPokemon.data.types)
          await this.setTypeImageLink(player.pokemon)
          await this.setSpecialAbilities(player, resPokemon.data.abilities)
          player.pokemon.life = player.pokemon.base_status.hp + player.pokemon.plus_status.hp
        } catch (error) {
          console.log(error)
        }
      },
      resetStatus(player) {
        player.items.balls = {
          'poke-ball': 150,
          'great-ball': 10,
          'ultra-ball': 800,
          'master-ball': 2
        }
        player.items.fruits = {
          'jaboca-berry': 10, 
          'razz-berry': 5, 
          'bluk-berry': 1
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
          plus_status: {
            hp: 0,
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
            evolution: 1,
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
        this.match.vencedores.treinador = ''
        this.match.vencedores.pokemon = ''
        this.clearArrays()
      },
      async selectedPokemon($event) {
        let selected = $event.pokemon

        try {
          let responsePokemons = await axios_database.get('/user/pokemons', this.getAuth())
          let pokemonsJogador = responsePokemons.data

          // Executará quando o jogador já tiver um pokemon.
          if (pokemonsJogador.length) {
            try {
              let pokemon = {
                info: selected.info,
                plus_status: {},
                base_status: {}
              }
              await this.setPokemon(this.jogador, pokemon, 'selected')
            } catch (error) {
              console.error(error)
            }

          // Executará quando o jogador ainda não tem um pokemon.
          } else {
            try {
              let resPokemon = await axios_database.post('/capture', {
                specie: `${ selected.info.specie }`,
                chain_id: `${ selected.info.chain_id }`,
                evolution_id: `${ selected.info.evolution_id }`,
                experience_plus: '0',
                battles: '0',
                battles_won: '0'
              }, this.getAuth())
              selected.info.id = resPokemon.data
              await this.setPokemon(this.jogador, selected, 'selected')
            } catch (error) {
              console.error(error)
            }
          }
          try {

            // Setta as quantidades das pokebolas que o usuário tem.
            let resBalls = await axios_database.get('/user/balls', this.getAuth())
            resBalls.data.map(ball => {
              this.jogador.items.balls[ball.item] = ball.amount
            })

            // Setta as quantidades das frutas que o usuário tem.
            let resFruits = await axios_database.get('/user/fruits', this.getAuth())
            resFruits.data.map(fruit => {
              this.jogador.items.fruits[fruit.item] = fruit.amount
            })
          } catch (error) {
            console.error(error)
          }
          // this.jogador.pokemon.info.experience = selected.info.experience
          selected.info = {}
          this.match.emAndamento = true
          this.match.selecionarPokemon = false
        } catch (error) {
          console.error(error)
        }
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
        let responsePokemons = null

        try {
          responsePokemons = await axios_database.get('/user/pokemons', this.getAuth())
          let pokemonsJogador = responsePokemons.data

          // Se o jogador já tiver pokemon, aparecerá na lista.
          if (pokemonsJogador.length) {
            let pokemons = []
            for (let info of pokemonsJogador) {
              let pokemon = { info }
              try {
                let responsePokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${ info.specie }`)
                pokemon.info.base_experience = responsePokemon.data.base_experience
                pokemon.info.pictureId = responsePokemon.data.id
                this.setTypes(pokemon, responsePokemon.data.types)
                this.setTypeImageLink(pokemon)
                pokemons.push(pokemon)
              } catch (error) {
                console.error(error)
              }
            }
            this.setMessage('info', 'Selecione seu pokemon:', pokemons)

          // Caso contrário, será mostrada uma lista de pokemons que poderá escolher como inicial.
          } else {
            let pokemonsWithInfos = []
            responsePokemons = await axios_database.get('/pokemonsForBeginners', this.getAuth())
            let pokemonsForBeginner = responsePokemons.data

            for (let pokemonDB of pokemonsForBeginner) {
              let pokemon = { info: {}, plus_status: {} }
              try {
                let responsePokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${ pokemonDB.specie }`)
                pokemon.info.specie = responsePokemon.data.species.name
                pokemon.info.base_experience = responsePokemon.data.base_experience
                pokemon.info.experience_plus = 0
                let responseSpecie = await axios.get(responsePokemon.data.species.url)
                pokemon.info.chain_id = this.getChainId(responseSpecie.data.evolution_chain.url)
                pokemon.info.evolution_id = 1
                pokemon.info.special_attacks = []
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
                console.error(error)
              }

              pokemonsWithInfos.push(pokemon)
            }

            this.setMessage('info', 'Escolha seu primeiro pokemon:', pokemonsWithInfos)
          }

          try {
            // Configurações das escolha do pokemon do NPC.
            let pokemon = {
              info: {
                evolution_id: this.getLevel(1,2),
                chain_id: null
              }
            }

            // NPC
            await this.setPokemon(this.monstro, pokemon)
            this.match.capture.captured = false
            this.match.capture.attempts = 1

            if (this.items.ballsLinks.length === 0) {
              this.items.ballsLinks = []
              this.getBallsIcons()
            }
            if (this.items.fruitsLinks.length === 0) {
              this.items.fruitsLinks = []
              this.getFruitsIcons()
            }
          } catch (error) {
            console.error(error)
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
</script>
<style scoped></style>