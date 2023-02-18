<template>
  <div id="window" v-show="myWindow.type">
    <h1 class="title espacar" :class="myWindow.type">{{ myWindow.title }}</h1>
    <div class="message espacar">
      <div v-if="typeof myWindow.content[0] != 'object'">
        <p v-for="(msg, index) in myWindow.content" :key="index">
          {{ msg }}
        </p>
        <div class="buttons espacar">
          <button class="btn btn-red" @click="setResponse('cancel')">Cancelar</button>
          <button class="btn btn-blue" @click="setResponse('ok')">OK</button>      
        </div>
      </div>
      <div v-else>
        <p class="selected-pokemon">
          <strong>Pokemon selecionado: </strong><span>{{ pokemon.info.specie }}</span>
        </p>

        <div class="pokemons">
          <label v-for="item in myWindow.content" :key="item.id" class="pokemon">
            <input type="radio" :value="item" v-model="pokemon">
            <img class="ball-type" :src="item.info.ball | assembleBallLink">
            <figure>
                <img :src="item.info.pictureId | assemblePokemonImageLink">
                <figcaption class="pokemon-desc">{{ item.info.specie }} | Exp. {{ item.info.experience }}</figcaption>
            </figure>
          </label>
        </div>
        <div class="buttons espacar">
          <button class="btn btn-red" @click="cancelMatch()">Cancelar</button>
          <button class="btn btn-blue" @click="selectPokemon()">OK</button>      
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pokemon: { info: {} },
        myWindow: {
          type: '',
          title: '',
          content: [],
          response: {
            optionSelected: '',
            execFunction: null
          },
        }
      }
    },
    created() {
      this.$emit('alert', { myWindow: this.myWindow })
    },
    filters: {
      assembleBallLink(ball) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${ ball }.png`
      },
      assemblePokemonImageLink(id) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${ id }.png`
      }
    },
    methods: {
      resetMyWindow() {
        // Reseta a janela, para que ela desapareca.
        this.myWindow.type = ''
        this.myWindow.title = ''
        this.myWindow.content = []
        this.myWindow.response.optionSelected = ''
      },
      cancelMatch() {
        this.$emit('matchCanceled')
        this.resetMyWindow()
      },
      selectPokemon() {
        this.resetMyWindow()

        if (this.pokemon.specie) {
          this.$emit('selectedPokemon', { chain: this.pokemon.chain, level: this.pokemon.evolution })
        }
      },
      setResponse(response) {
        this.myWindow.response.optionSelected = response
        if (response == 'ok') {
          /*
          Executará uma função somente quando tiver alguma função que foi passada. A função a ser
          executada deve conter valores padrões previamente definidos para seus argumentos.
          */ 
          if (this.myWindow.response.execFunction) {
            this.myWindow.response.execFunction()
          }
        }
        this.resetMyWindow()
      }
    }
  }
</script>

<style scoped>
  #window {
    position: absolute;
    z-index: 2;
    background-color: #fff;
    width: 70%;
    top: 50px;
    left: 15%; /* (100% - width) / 2 = 15% */
    display: flex;
    flex-direction: column;
  }

  #window .title, #window .message, #window .buttons {
    width: 100%;
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

  .selected-pokemon {
    margin-bottom: 10px;
  }

  .selected-pokemon span {
    text-transform: capitalize;
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

  /* POKEMONS */

  .pokemons {
    max-height: 312px;
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    grid-gap: 2rem;
    justify-content: space-between;
  }

  .pokemon input {
    visibility: hidden;
    width: 0;
    height: 0;
  }

  .pokemon {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f2f2f2;
    padding: 5px;
  }

  .pokemon:last-child {
    margin-right: 0px;
  }

  .pokemon .ball-type {
    align-self: flex-end;
  }

  .pokemon figure {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pokemon figcaption {
    font-size: 8pt;
    padding: 3px 6px;
    border-radius: 12px;
    background-color: #3399ff;
    color: #fff;
  }

</style>