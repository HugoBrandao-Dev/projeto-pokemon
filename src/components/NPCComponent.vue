<template>
  <div class="personagem espacar">
    <h2>Monstro</h2>
    <small v-show="monstro.specie">{{ monstro.specie }} - Exp.{{ monstro.experience }}</small>
    <img :src="monstro.picture" :title="monstro.specie" />
    <div class="caixa-vida">
      <div class="vida" :style="getVidaMonstro"></div>
    </div>
    <div>{{ getVidaMonstro.width }}</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        monstro: {
          vida: 100,
          picture: 'https://img.icons8.com/dotty/80/000000/monster-face.png',
          experience: 0,
          ataque: {
            minimo: 5,
            maximo: 15
          }
        }
      }
    },
    created() {
      this.$emit("npcStatus", { monstro: this.monstro })
    },
    computed: {
      getVidaMonstro() {
        return {
          width: `${this.monstro.vida}%`,
          backgroundColor: this.getCorBarra(this.monstro.vida)
        }
      },
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