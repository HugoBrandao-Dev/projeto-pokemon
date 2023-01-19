<template>
  <div id="app">
    <HeaderComponent />
    <section id="jogadores">
      <PokemonComponent :user="jogador" />
      <PokemonComponent :user="monstro" />
    </section>
    <MatchComponent @match="statusMatch($event)" />
    <!-- 
    <ActionsComponent 
      @clearLog="clearArrays" 
      @setAbilities="setSpecialAbilities($event)"
      :player="jogador" 
      :npc="monstro" 
      :statusMatch="match" 
      :logActions="log" /> -->
    <LogsComponent @logActions="logActions($event)" />
  </div>
</template>

<script>
  // Componentes
  import HeaderComponent from './components/HeaderComponent'
  import PokemonComponent from './components/PokemonComponent'
  import MatchComponent from './components/MatchComponent'
  // import ActionsComponent from './components/ActionsComponent'
  import LogsComponent from './components/LogsComponent'

  // Bibliotecas
  import axios from 'axios'

  export default {
    name: 'App',
    data() {
      return {
        jogador: {},
        monstro: {},
        match: {},
        log: []
      }
    },
    components: {
      HeaderComponent,
      PokemonComponent,
      MatchComponent,
      LogsComponent,
    },
    created() {
      axios.get(`https://pokeapi.co/api/v2/pokemon/3`)
        .then(resPlayer => {
          axios.get(`https://pokeapi.co/api/v2/pokemon/23`)
            .then(resNPC => {
              let pokemonPlayer = resPlayer.data
              this.jogador = {
                name: 'Jogador',
                pokemon: {
                  life: pokemonPlayer.stats[0].base_stat,
                  base_status: {
                    hp: pokemonPlayer.stats[0].base_stat,
                    attack: pokemonPlayer.stats[1].base_stat,
                    special_attack: pokemonPlayer.stats[3].base_stat,
                    defense: pokemonPlayer.stats[2].base_stat,
                    special_defense: pokemonPlayer.stats[4].base_stat,
                    speed: pokemonPlayer.stats[5].base_stat,
                    experience: pokemonPlayer.base_experience
                  },
                  info: {
                    picture: pokemonPlayer.sprites.back_default,
                    specie: pokemonPlayer.species.name,
                    special_attacks: []
                  }
                }
              }

              let pokemonNPC = resNPC.data
              this.monstro = {
                name: 'Monstro',
                pokemon: {
                  life: pokemonNPC.stats[0].base_stat,
                  base_status: {
                    hp: pokemonNPC.stats[0].base_stat,
                    attack: pokemonNPC.stats[1].base_stat,
                    special_attack: pokemonNPC.stats[3].base_stat,
                    defense: pokemonNPC.stats[2].base_stat,
                    special_defense: pokemonNPC.stats[4].base_stat,
                    speed: pokemonNPC.stats[5].base_stat,
                    experience: pokemonNPC.base_experience
                  },
                  info: {
                    picture: pokemonNPC.sprites.front_default,
                    specie: pokemonNPC.species.name,
                    special_attacks: []
                  }
                }
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(error => {
          console.log(error)
        })
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
        this.jogador.ataque.especiais.splice(0)
      },
      setSpecialAbilities($event) {
        let abilities = $event.abilities
        abilities.forEach(abilityInfo => {
          let ability = abilityInfo.ability
          axios.get(ability.url)
            .then(res => {
              this.jogador.ataque.especiais.push({
                name: ability.name.split('-').join(' '),
                effect: res.data.effect_entries[1].short_effect,
                power: Math.round(this.jogador.ataque.normal.maximo * 1.5)
              })
            })
            .catch(error => {
              console.log(error)
            })
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

  /* Individuais */

  .personagem {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 45%;
  }

  .personagem h2, .personagem small {
    text-transform: capitalize;
  }

  .personagem h2 {
    font-size: 14pt;
  }

  .personagem small {
    font-size: 10pt;
  }

  .caixa-vida {
    border: 3px dotted #d9d9d9;
    width: 100%;
    height: 40px;
    margin: 10px 0px;
  }

  .vida {
    height: 100%;
    width: 100%;
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
