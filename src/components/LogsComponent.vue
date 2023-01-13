<template>
  <section id="logs">
    <p v-for="(log) in logAcoes" class="log-acao" :class="log.destino" :key="log.id">{{ log.mensagem }}</p>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        logAcoes: []
      }
    }
  }
</script>

<style scoped>
  
</style>