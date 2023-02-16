<template>
  <div id="window" v-show="myWindow.type">
    <h1 class="title espacar" :class="myWindow.type">{{ myWindow.title }}</h1>
    <div class="message espacar">
      <div v-if="typeof myWindow.content[0] == 'string'">
        <p v-for="(msg, index) in myWindow.content" :key="index">
          {{ msg }}
        </p>
      </div>
      <div v-else>
        <p class="selected-pokemon">
          <strong>Pokemon selecionado: </strong><span>{{ pokemon.specie }}</span>
        </p>

        <div class="pokemons">
          <label v-for="(item, index) in myWindow.content" :key="index" class="pokemon">
            <figure>
                <input type="radio" :value="item" v-model="pokemon">
                <img :src="item.img">
                <figcaption class="pokemon-desc">{{ item.specie }} | Exp. {{ item.exp }}</figcaption>
            </figure>
          </label>
        </div>
      </div>
    </div>
    <div class="buttons espacar">
      <button class="btn btn-red">Cancelar</button>
      <button class="btn btn-blue" @click="selectPokemon()">OK</button>      
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pokemon: { },
        myWindow: {
          type: '',
          title: '',
          content: []
        }
      }
    },
    created() {
      this.$emit('alert', { myWindow: this.myWindow })
    },
    methods: {
      selectPokemon() {
        // Reseta a janela, para que ela desapareca.
        this.myWindow.type = ''
        this.myWindow.title = ''
        this.myWindow.content = []
        
        if (this.pokemon.specie) {
          this.$emit('selectedPokemon', { chain: this.pokemon.chain, level: this.pokemon.level })
        } else {
          alert('Selecione um pokemon')
        }
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
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    grid-gap: 2rem; /* 3 */
    justify-content: space-between;
  }

  .pokemon input {
    visibility: hidden;
    width: 0;
  }

  .pokemon {
    background-color: #f2f2f2;
    padding: 5px;
  }

  .pokemon:last-child {
    margin-right: 0px;
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