<template>
  <section v-show="logAcoes.length != 0" id="logs" class="espacar">
    <ul class="log-acoes">
      <li v-for="(log) in logAcoes" class="log-acao" :class="log.destino" :key="log.id">
        {{ log.mensagem }}
      </li>
    </ul>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        logAcoes: []
      }
    },
    created() {
      this.$emit("logActions", { logAcoes: this.logAcoes })
    }
  }
</script>

<style scoped>

  /* Log da batalha */
  
  #logs {
    box-shadow: 0px 0px 5px #ffffff;
    width: 100%;
    margin-top: 20px;
  }

  .log-acao {
    margin: 5px 0px;
    text-align: center;
  }

  .monstro {
    padding: 10px;
    width: 100%;
    background-color: #33cc33;
    color: #fff;
  }

  .jogador {
    padding: 10px;
    width: 100%;
    background-color: #ff3333;
    color: #fff;
  }
</style>