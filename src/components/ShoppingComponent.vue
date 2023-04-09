<template>
  <div id="shopping">
    <form method="POST" @submit="shopping" class="form-shopping">
      <div class="form-header">
        <h1 class="espacar">Compras</h1>
        <button type="button" class="btn btn-close-window" @click="closeWindow()">
          <img src="https://img.icons8.com/dotty/32/null/close-window.png"/>
        </button>
      </div>
      <fieldset>
        <h2>Frutas</h2>
        <div class="fruits">
          <label v-for="(ele, index) in 3" :key="index" class="item-field">
            <ul class="price">
              <li>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/relic-copper.png">
                200
              </li>
            </ul>
            <div class="price-input">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/jaboca-berry.png">
              <input type="number" name="iptFruit" min="0">
            </div>
          </label>
        </div>
        
        <h2>Pokebolas</h2>
        <div class="balls">
          <label v-for="(ele, index) in 4" :key="index" class="item-field">
            <ul class="price">
              <li>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/relic-gold.png">
                200
              </li>
            </ul>
            <div class="price-input">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png">
              <input type="number" name="iptBall" min="0">
            </div>
          </label>
        </div>

        <div class="access-action">
          <button class="btn btn-cancel" @click="form.type = 'login'">Cancelar</button>
          <button class="btn btn-buy">Comprar</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script></script>
<style scoped>
  #shopping {
    width: 40%;
    margin: 0 30%;
    background-color: #ffffff;
    color: #333333;
    top: 100px;
    position: absolute;
    z-index: 2;
  }

  #shopping fieldset {
    display: flex;
    flex-direction: column;

    border: none;
    padding: 25px;
  }

  /* CABEÇALHO DO FORMULÁRIO */

  #shopping .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #66ff66;
  }

  #shopping .form-header .btn-close-window {
    border: none;
    padding: 0;
    background-color: #66ff66;
  }

  /* CORPO DO FORMULÁRIO */

  #shopping fieldset h2 {
    font-size: 16pt;
    margin-bottom: 10px;
  }

  #shopping fieldset .fruits {
    margin-bottom: 10px;
  }

  #shopping .form-shopping .fruits, #shopping .form-shopping .balls {
    display: flex;
    width: 100%;
    justify-content: space-around;
  }

  .form-shopping .item-field {
    border: 2px solid #3399ff;
  }


  .form-shopping .price li {
    display: flex;
    align-items: center;

    font-size: 8pt;
  }  

  .form-shopping .price-input {
    display: flex;
    align-items: center;

    border-top: 2px solid #3399ff
  }

  .form-shopping .item-field input {
    width: 50px;
    outline: none;
    border: none;
  }

  /* BOTÕES DE AÇÃO DO FORMULÁRIO */
  #shopping .access-action {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .form-shopping .access-action .btn-buy {
    background-color: #3399ff;
    border-color: #3399ff;
  }

  .form-shopping .access-action .btn-cancel {
    background-color: #ff3333;
    border-color: #ff3333;
  }
</style>