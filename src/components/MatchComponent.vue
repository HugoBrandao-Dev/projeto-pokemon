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
</style>