<template>
  <div class="personagem espacar">
    <h2>{{ player.name }}</h2>
    <div class="pokemon" :class="{'npc-display': player.name == 'NPC', 'no-pokemon': !player.pokemon.info.specie}">
      <div class="pokemon-infos">
        <ul v-show="player.pokemon.info.specie">
          <li v-for="status in Object.keys(player.pokemon.base_status)" :key="status">
            {{ status | formatStatus }}:
            <span class="pokemon-info">
              {{ player.pokemon.base_status[status] }}
            </span>
          </li>
        </ul>
      </div>
      <div class="pokemon-desc">
        <small v-show="player.pokemon.info.specie">
          {{ player.pokemon.info.specie }} - Exp.{{ player.pokemon.info.experience }}
        </small>
        <img :src="player.pokemon.info.picture" :title="player.pokemon.info.specie" />
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
            'poke-ball': 150,
            'great-ball': 10,
            'ultra-ball': 800,
            'master-ball': 2
            },
            fruits: {
              'jaboca-berry': 10, 
              'razz-berry': 5, 
              'bluk-berry': 1
            },
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
            info: {
              specie: '',
              experience: 0,
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
        let base_hp = this.player.pokemon.base_status.hp
        let percentageLife = Math.round(life * 100 / base_hp)
        return {
          width: `${ percentageLife }%`,
          backgroundColor: this.getCorBarra( percentageLife )
        }
      },
      canCatchPokemon() {
        if (!this.match.emAndamento && this.match.status == 'ganhou') {
          return true
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
      }
    },
    methods: {
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
            switch(fruit) {
              case 'jaboca-berry':
                if (this.player.pokemon.life + 10 > this.player.pokemon.base_status.hp) {
                  this.player.pokemon.life = this.player.pokemon.base_status.hp
                } else {
                  this.player.pokemon.life += 10
                }
                break
              case 'razz-berry':
                if (this.player.pokemon.life + 20 > this.player.pokemon.base_status.hp) {
                  this.player.pokemon.life = this.player.pokemon.base_status.hp
                } else {
                  this.player.pokemon.life += 20
                }
                break
              default:
                this.player.pokemon.life = this.player.pokemon.base_status.hp
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

  .pokemon ul li {
    font-size: 8pt;
  }

  .personagem .pokemon-info {
    font-weight: bolder;
  }

  .personagem .pokemon .pokemon-desc {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pokemon .pokemon-desc img {
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