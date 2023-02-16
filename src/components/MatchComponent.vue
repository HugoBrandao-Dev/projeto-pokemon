<template>
  <section id="mensagem-resultado" class="espacar centralizar" :class="statusPartida.status" v-if="statusPartida.mostrarResultado">
    <h2>{{ statusPartida.mensagem }}</h2>
  </section>
</template>
<script>
  export default {
    data() {
      return {
        statusPartida: {
          emAndamento: false,
          selecionarPokemon: false,
          mostrarResultado: false,
          status: '',
          mensagem: ''
        },
      }
    },
    created() {
      this.$emit("match", { status: this.statusPartida })
    },
  }
</script>
<style>
  .centralizar {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .espacar {
    padding: 10px;
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

  .empatou {
    background-color: #ffcc00;
    box-shadow: 0 0 10px #ffcc00;
    color: #fff;
  }
</style>