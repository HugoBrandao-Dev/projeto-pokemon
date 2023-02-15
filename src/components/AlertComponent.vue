<template>
  <div id="window">
    <h1 class="title espacar" :class="myWindow.type">{{ myWindow.title }}</h1>
    <div class="message espacar">
      <div v-if="typeof myWindow.content[0] == 'string'">
        <p v-for="(msg, index) in myWindow.content" :key="index">
          {{ msg }}
        </p>
      </div>
      <div v-else>
        <strong>Pokemon selecionado: {{ pokemon }}</strong>
        <div v-for="(item, index) in myWindow.content" :key="index" class="pokemons-list">
          <figure>
            <label>
              <input type="radio" :value="item.pokemon" v-model="pokemon">
              <img :src="item.img">
              <figcaption>{{ item.pokemon }}</figcaption>
            </label>
          </figure>
        </div>
      </div>
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
            {
              pokemon: 'tobias',
              img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
            },
            {
              pokemon: 'dinorá',
              img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png'
            },
            {
              pokemon: 'josias',
              img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png'
            },
            {
              pokemon: 'doralice',
              img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'
            },
            {
              pokemon: 'jeremias',
              img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png'
            },{
              pokemon: 'uiarapuru',
              img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png'
            },{
              pokemon: 'ubirajara',
              img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png'
            }
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