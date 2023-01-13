<template>
  <div class="personagem espacar">
    <h2>Jogador<img src="https://img.icons8.com/dotty/80/000000/user.png" /></h2>
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
        jogador: {
          vida: 100,
          ataque: {
            normal: {
              minimo: 5,
              maximo: 10
            },
            especial: {
              minimo: 10,
              maximo: 20
            }
          },
          cura: {
            capacidadeMinima: 10,
            capacidadeMaxima: 20
          }
        }
      }
    },
    created() {
      this.$emit("playerStatus", { jogador: this.jogador })
    },
    computed: {
      getVidaJogador() {
        return {
          width: `${this.jogador.vida}%`,
          backgroundColor: this.getCorBarra(this.jogador.vida)
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