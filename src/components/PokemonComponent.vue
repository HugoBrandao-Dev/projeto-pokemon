<template>
  <div class="personagem espacar">
    <h2>{{ player.name }}</h2>
    <div class="pokemon" :class="{'npc-display': player.name == 'NPC', 'no-pokemon': !player.pokemon.info.specie}">
      <div class="pokemon-infos">
        <ul v-show="player.pokemon.info.specie">
          <li>HP:
            <span class="pokemon-info">
              {{ player.pokemon.base_status.hp }}
            </span>
          </li>
          <li>Ata.:
            <span class="pokemon-info">
              {{ player.pokemon.base_status.attack }}
            </span>
          </li>
          <li>Def.:
            <span class="pokemon-info">
              {{ player.pokemon.base_status.defense }}
            </span>
          </li>
          <li>Esp. Ata.:
            <span class="pokemon-info">
              {{ player.pokemon.base_status.special_attack }}
            </span>
          </li>
          <li>Esp. Def.:
            <span class="pokemon-info">
              {{ player.pokemon.base_status.special_defense }}
            </span>
          </li>
        </ul>
        <small >
          
        </small>
      </div>
      <div class="pokemon-desc">
        <small v-show="player.pokemon.info.specie">
          {{ player.pokemon.info.specie }} - Exp.{{ player.pokemon.base_status.experience }}
        </small>
        <img :src="player.pokemon.info.picture" :title="player.pokemon.info.specie" />
      </div>
    </div>
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
              defense: 0,
              special_defense: 0,
              speed: 0,
              experience: 0,
            },
            info: {
              specie: '',
              picture: 'https://img.icons8.com/dotty/96/ffffff/user.png',
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
    list-style: none;
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
  }
</style>