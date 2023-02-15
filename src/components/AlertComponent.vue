<template>
  <div id="window">
    <h1 class="title espacar" :class="myWindow.type">{{ myWindow.title }}</h1>
    <div class="message espacar">
       {{ myWindow.content[0] }}
    </div>
    <div class="buttons espacar">
      <button class="btn btn-red">Cancelar</button>
      <button class="btn btn-blue">OK</button>      
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pokemon: '',
        myWindow: {
          type: 'info',
          title: 'Título',
          content: [
            `qwersadfasfqwersfsdfasklfqwoeriiuoqwerdsfkjopaioew rqwerjqwoerjfdfsd`
          ]
        }
      }
    }
  }
</script>

<style scoped>
  #window {
    position: absolute;
    background-color: #fff;
    width: 70%;
    top: 50px;
    display: flex;
    flex-direction: column;
  }

  #window hr {
    margin: 0 auto;
    width: 50%;
  }

  #window .buttons {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .message {
    color: #47476b;
  }

  .btn-red {
    background-color: #ff3333;
    border-color: #ff3333;
  }
  .btn-blue {
    background-color: #3399ff;
    border-color: #3399ff;
  }

  /* TIPOS DE MENSAGEM */

  .info {
    background-color: #3399ff;
  }

  .error {
    background-color: #ff3333;
  }

  .alert {
    background-color: #e6e600;
  }
</style>