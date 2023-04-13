<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
</script>

<style>
  /* Reset */
  * {
    font-family: 'Orbitron', sans-serif;
    font-weight: normal;
    font-size: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #47476b;
    color: #ffffff;
  }

  h1, h2 {
    font-weight: bold;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  ul li {
    list-style: none;
  }

  strong {
    font-weight: bolder;
  }

  .img-disabled {
    filter: grayscale(100%);
  }

  .centralizar {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .espacar {
    padding: 10px;
  }

  .btn {
    padding: 8px 10px;
    font-weight: bold;
    margin-right: 20px;
    border: 3px outset;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    outline: none;
  }

  /* ############### CORPO ############### */

  #app #main, #account {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Seções */

  #jogadores {
    box-shadow: 0px 0px 5px #ffffff;
    width: 100%;
  }

  #mensagem-resultado {
    margin-top: 20px;
  }

  #jogadores {
    display: flex;
    justify-content: space-between;
  }

  /* ALERTA DE SELEÇÃO DE POKEMON */

  .selecting-pokemon {
    filter: blur(3px);
  }

  /* TIPOS DOS POKEMONS */

  .types {
    display: flex;
    margin-bottom: 10px;
  }

  .type {
    border: ridge 2px #ffffff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .type img {
    height: 16px;
  }

  .normal {
    background-color: #996600;
  }

  .fighting {
    background-color: #cc6600;
  }
  
  .grass {
    background-color: #33cc33;
  }
  
  .poison {
    background-color: #6600ff;
  }
  
  .ground {
    background-color: #3e3202;
  }
  
  .rock {
    background-color: #a6a6a6;
  }
  
  .bug {
    background-color: #008000;
  }
  
  .ghost {
    background-color: #4d4d4d;
  }
  
  .electric {
    background-color: #e6e600;
  }
  
  .fire {
    background-color: #ff0000;
  }
  
  .dragon {
    background-color: #cc3300;
  }
  
  .water {
    background-color: #3366ff;
  }
  
  .psychic {
    background-color: #9900cc;
  }
  
  .ice {
    background-color: #00ccff;
  }
  
  .flying {
    background-color: #669999;
  }
  
  .fairy {
    background-color: #ff0066;
  }

  .steel {
    background-color: #666666;
  }

  .dark {
    background-color: #262626;
  }
</style>
