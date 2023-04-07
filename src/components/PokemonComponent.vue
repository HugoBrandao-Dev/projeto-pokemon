<template>
  <div class="personagem espacar">
    <h2>{{ player.name }}</h2>
    <div class="pokemon" :class="{'npc-display': player.name == 'NPC', 'no-pokemon': !player.pokemon.info.specie}">
      <div class="pokemon-infos">
        <ul v-show="player.pokemon.info.specie">
          <li class="info" v-for="status in Object.keys(player.pokemon.base_status)" :key="status">
            <strong>{{ status | formatStatus }}:</strong>
            <p class="pokemon-info">
              <span class="pokemon-base-status">
                {{ player.pokemon.base_status[status] }}
              </span>
              <span 
                v-if="player.pokemon.plus_status && player.name == 'Player'"
                title="Aumento devido a experiência." 
                class="pokemon-plus-status">
                +{{ player.pokemon.plus_status[status] }}
              </span>
            </p>
          </li>
        </ul>
      </div>
      <div class="pokemon-desc">
        <div v-show="player.pokemon.info.specie">
          <ul class="types">
            <li v-for="type in player.pokemon.info.types" :key="type.type" class="type" :class="type.type">
              <img :src="type.url" :title="type.type">
            </li>
          </ul>
          <small>
            {{ player.pokemon.info.specie }} - Exp.{{ calcExperience(player.pokemon) }}
          </small>
        </div>
        <img :src="player.pokemon.info.picture | hasPicture" :title="player.pokemon.info.specie" class="pokemon-img" />
      </div>
    </div>
    <div class="caixa-vida">
      <div class="vida" :style="getVidaJogador"></div>
    </div>
    <div>{{ getVidaJogador.width }}</div>
    <div class="items" v-show="player.pokemon.info.specie">
      <ul class="balls">
        <li v-for="ball in items.ballsLinks" :key="ball.name" class="ball">
          <button @click="throwPokeball(ball.name)" class="btn" :disabled="!canCatchPokemon">
            <span v-if="player.items.balls[ball.name] <= 99">
              {{ player.items.balls[ball.name] }}
            </span>
            <span v-else>99+</span>
            <img :src="ball.iconLink" :title="ball.name.replace('-', ' ')" :class="{ 'img-disabled': !canCatchPokemon }">
          </button>
        </li>
      </ul>
      <ul class="fruits">
        <li v-for="fruit in items.fruitsLinks" :key="fruit.name" class="fruit">
          <button @click="heal(fruit.name)" class="btn" :disabled="!canUseFruits">
            <span v-if="player.items.fruits[fruit.name] <= 99">
              {{ player.items.fruits[fruit.name] }}
            </span>
            <span v-else>99+</span>
            <img :src="fruit.iconLink" :title="fruit.name.replace('-', ' ')" :class="{ 'img-disabled': !canUseFruits }">
          </button>
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
  export default {
    data() {
      return {
        player: {
          name: 'Player',
          items: {
            balls: {
            'poke-ball': null,
            'great-ball': null,
            'ultra-ball': null,
            'master-ball': null
            },
            fruits: {
              'jaboca-berry': null,
              'razz-berry': null,
              'bluk-berry': null
            },
            coins: {
              'copper-coin': null,
              'silver-coin': null,
              'gold-coin': null
            }
          },
          pokemon: {
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
              id: null,
              specie: '',
              types: [],
              base_experience: 0,
              chain_id: 0,
              /*
              1: Pokemon base;
              2: segunda evolução;
              3: terceira evolução.
              */
              evolution_id: 1,
              picture: 'https://img.icons8.com/dotty/96/ffffff/user.png',
              special_attacks: []
            },
          },
        }
      }
    },
    props: {
      items: {
        type: Object,
        default: () => ({})
      },
      match: Object
    },
    created() {
      this.$emit('player', { player: this.player })
    },
    computed: {
      getVidaJogador() {
        let life = this.player.pokemon.life
        let base_hp = this.player.pokemon.base_status.hp + this.player.pokemon.plus_status.hp
        let percentageLife = Math.round(life * 100 / base_hp)
        return {
          width: `${ percentageLife }%`,
          backgroundColor: this.getCorBarra( percentageLife )
        }
      },
      canCatchPokemon() {
        if (!this.match.emAndamento && this.match.status == 'ganhou') {
            if (!this.match.capture.captured && this.match.capture.attempts <= 3) {
              return true
            }
        }
        return false
      },
      canUseFruits() {
        if (this.match.emAndamento) {
          return true
        }
        return false
      }
    },
    filters: {
      formatStatus(status) {
        return status.split('_').join(' ')
      },
      hasPicture(picture) {
        if (picture) {
          return picture
        } else {
          return 'https://img.icons8.com/color/96/000000/cookie-monster.png'
        }
      }
    },
    methods: {
      calcExperience(pokemon) {
        if (pokemon.info.experience_plus) {
          return pokemon.info.base_experience + pokemon.info.experience_plus
        }
        return pokemon.info.base_experience
      },
      getCorBarra(vida) {
        if (vida > 60) {
          return '#33cc33'
        } else if (vida > 30) {
          return '#e6e600'
        } else {
          return '#ff471a'
        }
      },
      heal(fruit = 'jaboca-berry') {
        if (this.player.items.fruits[fruit] > 0) {
          if (this.player.pokemon.life !== 0 && this.player.pokemon.life !== this.player.pokemon.base_status.hp) {
            this.player.items.fruits[fruit]--
            let maxLife = this.player.pokemon.base_status.hp + this.player.pokemon.plus_status.hp

            switch(fruit) {
              case 'jaboca-berry':
                if (this.player.pokemon.life + 10 > maxLife) {
                  this.player.pokemon.life = maxLife
                } else {
                  this.player.pokemon.life += 10
                }
                break
              case 'razz-berry':
                if (this.player.pokemon.life + 20 > maxLife) {
                  this.player.pokemon.life = maxLife
                } else {
                  this.player.pokemon.life += 20
                }
                break
              default:
                this.player.pokemon.life = maxLife
            }
          }
        }
      },
      throwPokeball(ball) {
        if (this.player.items.balls[ball] > 0) {
          this.player.items.balls[ball]--
          this.$emit('thrownPokeball', { ball })
        }
      }
    }
  }
</script>

<style scoped>
  /* Individuais */

  .personagem {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 45%;
  }

  .personagem h2 {
    font-size: 14pt;
    margin-bottom: 40px;
    text-transform: capitalize;
  }

  .personagem .pokemon {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: auto center;
  }

  .personagem .no-pokemon {
    justify-content: center;
  }

  .npc-display {
    flex-direction: row-reverse;
  }

  .pokemon-infos .info {
    text-transform: capitalize;
    font-size: 8pt;
  }

  .personagem .pokemon-info {
    font-weight: bolder;
    margin-bottom: 5px;
  }

  .personagem .pokemon-info:last-child {
    margin-bottom: 0;
  }

  .pokemon-infos .pokemon-info .pokemon-plus-status {
    padding: 2px 4px;
    border-radius: 4px;
    background-color: #00cc00;
  }

  .personagem .pokemon .pokemon-desc {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-transform: capitalize;
  }

  .pokemon .pokemon-desc .pokemon-img {
    height: 96px;
    width: 96px;
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

    transition-property: width;
    transition-duration: 0.3s;
    transition-timing-function: ease-out;
    transition-delay: 0.1s;
  }

  .balls, .fruits {
    margin-top: 10px;
    display: flex;
  }

  .balls .ball, .fruits .fruit {
    border: 1px solid #fff;
    margin-right: 15px;
    position: relative;
    display: flex;
  }

  .balls .ball button:disabled {
    background-color: #e6e6e6;
    border-color: #d9d9d9;
  }

  .fruits .fruit button:disabled {
    background-color: #e6e6e6;
    border-color: #d9d9d9;
  }

  .balls .ball, .fruits .fruit {
    border: none;
  }

  .fruits .fruit .btn, .balls .ball .btn {
    padding: 0;
    margin-right: 0px;
  }

  .fruits .fruit .btn {
    background-color: #e6e600;
    border-color: #e6e600;
  }

  .balls .ball .btn {
    background-color: #3399ff;
    border-color: #3399ff;
  }

  .balls .ball .btn {
    background-color: #3399ff;
    border-color: #3399ff;
  }

  .balls .ball:last-child, .fruits .fruit:last-child {
    margin-right: 0px;
  }

  .balls .ball span, .fruits .fruit span {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #3399ff;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    font-size: 8px;
    position: absolute;
    left: 22px;
    top: -6px;
  }

  .balls .ball span {
    color: #3399ff;
    background-color: #fff;
  }
</style>