<template>
  <div class="personagem espacar">
    <h2>{{ user.name }}</h2>
    <small v-show="user.pokemon.info.specie">
      {{ user.pokemon.info.specie }} - Exp.{{ user.pokemon.base_status.experience }}
    </small>
    <img :src="user.pokemon.info.picture" :title="user.pokemon.info.specie" />
    <div class="caixa-vida">
      <div class="vida" :style="getVidaJogador"></div>
    </div>
    <div>{{ getVidaJogador.width }}</div>
  </div>
</template>

<script>
  export default {
    props: {
      user: Object
    },
    computed: {
      getVidaJogador() {
        let life = this.user.pokemon.life
        let base_hp = this.user.pokemon.base_status.hp
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

<style>
  
</style>