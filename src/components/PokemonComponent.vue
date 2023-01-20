<template>
  <div class="personagem espacar">
    <h2>{{ player.name }}</h2>
    <small v-show="player.pokemon.info.specie">
      {{ player.pokemon.info.specie }} - Exp.{{ player.pokemon.base_status.experience }}
    </small>
    <img :src="player.pokemon.info.picture" :title="player.pokemon.info.specie" />
    <div class="caixa-vida">
      <div class="vida" :style="getVidaJogador"></div>
    </div>
    <div>{{ getVidaJogador.width }}</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        player: {
          name: 'Player',
          pokemon: {
            life: 100,
            base_status: {
              hp: 100,
              attack: 0,
              special_attack: 0,
              defence: 0,
              special_defence: 0,
              speed: 0,
              experience: 0,
            },
            info: {
              specie: '',
              picture: 'https://img.icons8.com/dotty/80/000000/user.png',
              special_attacks: []
            },
          },
        }
      }
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
</style>