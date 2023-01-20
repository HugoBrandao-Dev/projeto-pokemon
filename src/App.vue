<template>
  <div id="app">
    <HeaderComponent />
    <section id="jogadores">
      <PokemonComponent @player="setPokemonPlayer($event)" />
      <PokemonComponent @player="setPokemonNPC($event)" />
    </section>
    <MatchComponent @match="statusMatch($event)" />
    
    <ActionsComponent 
      @clearLog="clearArrays" 
      @generatePokemons="getPokemons"
      @setAbilities="setSpecialAbilities($event)"
      :player="jogador" 
      :npc="monstro" 
      :statusMatch="match" 
      :logActions="log" />
    <LogsComponent @logActions="logActions($event)" />
  </div>
</template>

<script>
  // Componentes
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
        jogador: {
          data: 123
        },
        monstro: {
          data: 321
        },
        match: {},
        log: []
      }
    },
    components: {
      HeaderComponent,
      PokemonComponent,
      ActionsComponent,
      MatchComponent,
      LogsComponent,
    },
    methods: {
      playerStatus($event) {
        this.jogador = $event.jogador
      },
      npcStatus($event) {
        this.monstro = $event.monstro
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
      setSpecialAbilities(player, abilities) {
        abilities.forEach(abilityInfo => {
          let ability = abilityInfo.ability
          axios.get(ability.url)
            .then(res => {
              player.pokemon.info.special_attacks.push({
                name: ability.name.split('-').join(' '),
                effect: res.data.effect_entries[1].short_effect,
              })
            })
            .catch(error => {
              console.log(error)
            })
        })
      },
      getValorRandom(min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min)
      },
      setPokemonPlayer($event) {
        this.jogador = $event.player
      },
      setPokemonNPC($event) {
        this.monstro = $event.player
      },
      getPokemons() {
        let pokemonPlayer1 = this.getValorRandom(1,151)
        let pokemonPlayer2 = this.getValorRandom(1,151)

        axios.get(`https://pokeapi.co/api/v2/pokemon/${ pokemonPlayer1 }`)
          .then(resPlayer => {
            axios.get(`https://pokeapi.co/api/v2/pokemon/${ pokemonPlayer2 }`)
              .then(resNPC => {

                /* ################ Player ################ */
                let pokemonPlayer = resPlayer.data
                this.jogador.name = 'Jogador'
                this.jogador.pokemon.life = pokemonPlayer.stats[0].base_stat
                this.jogador.pokemon.base_status.hp = pokemonPlayer.stats[0].base_stat
                this.jogador.pokemon.base_status.attack = pokemonPlayer.stats[1].base_stat
                this.jogador.pokemon.base_status.special_attack = pokemonPlayer.stats[3].base_stat
                this.jogador.pokemon.base_status.defense = pokemonPlayer.stats[2].base_stat
                this.jogador.pokemon.base_status.special_defense = pokemonPlayer.stats[4].base_stat
                this.jogador.pokemon.base_status.speed = pokemonPlayer.stats[5].base_stat
                this.jogador.pokemon.base_status.experience = pokemonPlayer.base_experience
                this.jogador.pokemon.info.picture = pokemonPlayer.sprites.back_default
                this.jogador.pokemon.info.specie = pokemonPlayer.species.name
                this.setSpecialAbilities(this.jogador, pokemonPlayer.abilities)

                /* ################ NPC ################ */
                let pokemonNPC = resNPC.data
                this.monstro.name = 'NPC'
                this.monstro.pokemon.life = pokemonNPC.stats[0].base_stat
                this.monstro.pokemon.base_status.hp = pokemonNPC.stats[0].base_stat
                this.monstro.pokemon.base_status.attack = pokemonNPC.stats[1].base_stat
                this.monstro.pokemon.base_status.special_attack = pokemonNPC.stats[3].base_stat
                this.monstro.pokemon.base_status.defense = pokemonNPC.stats[2].base_stat
                this.monstro.pokemon.base_status.special_defense = pokemonNPC.stats[4].base_stat
                this.monstro.pokemon.base_status.speed = pokemonNPC.stats[5].base_stat
                this.monstro.pokemon.base_status.experience = pokemonNPC.base_experience
                this.monstro.pokemon.info.picture = pokemonNPC.sprites.front_default
                this.monstro.pokemon.info.specie = pokemonNPC.species.name
                this.setSpecialAbilities(this.monstro, pokemonNPC.abilities)
              })
              .catch(error => {
                console.log(error)
              })
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
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

  h1, h2 {
    font-weight: bold;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  .centralizar {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .espacar {
    padding: 10px;
  }

  /* ############### CORPO ############### */

  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Seções */

  #jogadores, #acoes, #logs {
    box-shadow: 0px 0px 5px #595959;
    width: 100%;
  }

  #acoes, #logs, #mensagem-resultado {
    margin-top: 20px;
  }

  #jogadores {
    display: flex;
    justify-content: space-between;
  }

  /* Log da batalha */

  .log-acao {
    margin: 5px 0px;
    text-align: center;
  }

  .monstro {
    padding: 10px;
    width: 100%;
    background-color: #33cc33;
    color: #fff;
  }

  .jogador {
    padding: 10px;
    width: 100%;
    background-color: #ff3333;
    color: #fff;
  }

  /* Botões */

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

  #btn-atacar {
    background-color: #ff3333;
    border-color: #ff3333;
  }

  .btn-especial {
    background-color: #3399ff;
    border-color: #3399ff;
  }

  #btn-curar {
    background-color: #ffff66;
    border-color: #ffff66;
    color: black;
  }

  #btn-desistir {
    background-color: #404040;
    border-color: #404040;
  }

  #btn-iniciar {
    background-color: #33cc33;
    color: #fff;
    border-color: #33cc33;
  }

  /* Status da partida */

  .desistiu {
    background-color: #404040;
    box-shadow: 0 0 10px #404040;
    color: #fff;
  }

  .ganhou {
    background-color: #33cc33;
    box-shadow: 0 0 10px #33cc33;
    color: #fff;
  }

  .perdeu {
    background-color: #ff3333;
    box-shadow: 0 0 10px #ff3333;
    color: #fff;
  }
</style>
