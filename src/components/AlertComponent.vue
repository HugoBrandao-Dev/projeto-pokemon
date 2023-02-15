<template>
  <div id="window">
    <h1 class="title espacar" :class="myWindow.type">{{ myWindow.title }}</h1>
    <div class="message espacar">
      <p v-for="(msg, index) in myWindow.content" :key="index">
        {{ msg }}
      </p>
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
        myWindow: {
          type: 'info',
          title: 'Título',
          content: [`Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`]
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

  .info {
    background-color: #3399ff;
  }
</style>