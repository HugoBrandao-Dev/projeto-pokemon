<template>
  <div id="shopping">
    <form method="POST" @submit="shopping" class="form-shopping">
      <div class="form-header">
        <h1 class="espacar">Compras</h1>
        <button type="button" class="btn btn-close-window" @click="closeShoppingWindow()">
          <img src="https://img.icons8.com/dotty/32/null/close-window.png"/>
        </button>
      </div>
      <fieldset>
        <h2>Frutas</h2>
        <div class="fruits">
          <label v-for="fruit in items_shopping.fruits" :key="fruit.item" class="item-field">
            <ul class="price">
              <li>Preço:</li>
              <li>
                <img :src="fruit.required | assembleIconUrl">
                {{ fruit.amount }}
              </li>
            </ul>
            <div class="price-input">
              <img :src="fruit.item | assembleIconUrl">
              <input type="number" min="0" v-model="form.fields.fruits[fruit.item]">
            </div>
          </label>
        </div>
        
        <h2>Pokebolas</h2>
        <div class="balls">
          <label v-for="ball in items_shopping.balls" :key="ball.item" class="item-field">
            <ul class="price">
              <li>Preço:</li>
              <li>
                <img :src="ball.required | assembleIconUrl">
                {{ ball.amount }}
              </li>
            </ul>
            <div class="price-input">
              <img :src="ball.item | assembleIconUrl">
              <input type="number" min="0" v-model="form.fields.balls[ball.item]">
            </div>
          </label>
        </div>

        <div class="access-action">
          <button type="button" class="btn btn-cancel" @click="closeShoppingWindow()">Cancelar</button>
          <button type="submit" class="btn btn-buy">Comprar</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script>
  import axios from 'axios'

  /*
  Instância do axios, para atender, diretamente, as requisições feitas para o localhost do back-end.
  */
  const axios_database = axios.create({
    baseURL: 'http://localhost:4000'
  })

  export default {
    data() {
      return {
        form: {
          fields: {
            fruits: {
              'jaboca-berry': 0,
              'razz-berry': 0,
              'bluk-berry': 0
            },
            balls: {
              'poke-ball': 0,
              'great-ball': 0,
              'ultra-ball': 0,
              'master-ball': 0
            }
          }
        },
        items_shopping: {
          fruits: [
            {
              item: 'jaboca-berry',
              required: 'copper-coin',
              amount: 5
            },
            {
              item: 'razz-berry',
              required: 'silver-coin',
              amount: 1
            },
            {
              item: 'bluk-berry',
              required: 'gold-coin',
              amount: 1
            }
          ],
          balls: [
            {
              item: 'poke-ball',
              required: 'copper-coin',
              amount: 20
            },
            {
              item: 'great-ball',
              required: 'copper-coin',
              amount: 50
            },
            {
              item: 'ultra-ball',
              required: 'silver-coin',
              amount: 10
            },
            {
              item: 'master-ball',
              required: 'gold-coin',
              amount: 2
            }
          ]
        }
      }
    },
    filters: {
      assembleIconUrl(item) {
        if (item.indexOf('coin') >= 0) {
          let formatedName = `relic-${ item.slice(0, item.indexOf('-')) }`
          return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${ formatedName }.png`
        }
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${ item }.png`
      }
    },
    methods: {
      getAuth() {
        return {
          headers: {
            common: {
              Authorization: `Bearer ${ localStorage.getItem('PokemonUserToken') }`
            }
          }
        }
      },
      // Faz a atualização para nova quantidade de frutas.
      async saveFruitsAmounts() {
        try {
          let resFruits = await axios_database.get('/user/fruits', this.getAuth())

          // Pega a quantidade de frutas que o usuário já tem.
          let jaboca_berry = resFruits.data.find(item => item.item == 'jaboca-berry').amount
          let razz_berry = resFruits.data.find(item => item.item == 'razz-berry').amount
          let bluk_berry = resFruits.data.find(item => item.item == 'bluk-berry').amount

          // Atualiza a quantidade somando os valores do formulário e a quantidade que o usuário já possui.
          let newFruitsValues = {
            'jaboca-berry': `${ parseInt(this.form.fields.fruits['jaboca-berry']) + jaboca_berry }`,
            'razz-berry': `${ parseInt(this.form.fields.fruits['razz-berry']) + razz_berry }`,
            'bluk-berry': `${ parseInt(this.form.fields.fruits['bluk-berry']) + bluk_berry }`
          }

          let resFruitsSetted = await axios_database.post('/user/fruits/update', {
            'jaboca-berry': newFruitsValues['jaboca-berry'],
            'razz-berry': newFruitsValues['razz-berry'],
            'bluk-berry': newFruitsValues['bluk-berry']
          },this.getAuth())

          if (resFruitsSetted.data.errorField) {
            console.log(resFruitsSetted.data.msg)
          }
        } catch (error) {
          console.error(error)
        }
      },
      // Faz a atualização para nova quantidade de pokebolas.
      async saveBallsAmounts() {
        try {
          let resBalls = await axios_database.get('/user/balls', this.getAuth())

          // Pega a quantidade de frutas que o usuário já tem.
          let poke_ball = resBalls.data.find(item => item.item == 'poke-ball').amount
          let great_ball = resBalls.data.find(item => item.item == 'great-ball').amount
          let ultra_ball = resBalls.data.find(item => item.item == 'ultra-ball').amount
          let master_ball = resBalls.data.find(item => item.item == 'master-ball').amount

          // Atualiza a quantidade somando os valores do formulário e a quantidade que o usuário já possui.
          let newBallsValues = {
            'poke-ball': `${ parseInt(this.form.fields.balls['poke-ball']) + poke_ball }`,
            'great-ball': `${ parseInt(this.form.fields.balls['great-ball']) + great_ball }`,
            'ultra-ball': `${ parseInt(this.form.fields.balls['ultra-ball']) + ultra_ball }`,
            'master-ball': `${ parseInt(this.form.fields.balls['master-ball']) + master_ball }`
          }

          let resBallsSetted = await axios_database.post('/user/balls/update', {
            'poke-ball': newBallsValues['poke-ball'],
            'great-ball': newBallsValues['great-ball'],
            'ultra-ball': newBallsValues['ultra-ball'],
            'master-ball': newBallsValues['master-ball']
          },this.getAuth())

          if (resBallsSetted.data.errorField) {
            console.log(resBallsSetted.data.msg)
          }
        } catch (error) {
          console.error(error)
        }
      },
      async canBuy(coins) {
        try {
          let resCoins = await axios_database.get('/user/coins', this.getAuth())

          // Pega as quantidades atuais de coins do usuário.
          let copper_coin = resCoins.data.find(item => item.item == 'copper-coin').amount
          let silver_coin = resCoins.data.find(item => item.item == 'silver-coin').amount
          let gold_coin = resCoins.data.find(item => item.item == 'gold-coin').amount

          // Verifica se as quantidades que ele possui de cada moeda é maior que o necessário para comprar.
          let is_copper_coin_OK = copper_coin - coins['copper-coin'] >= 0
          let is_silver_coin_OK = silver_coin - coins['silver-coin'] >= 0
          let is_gold_coin_OK = gold_coin - coins['gold-coin'] >= 0

          if (is_copper_coin_OK && is_silver_coin_OK && is_gold_coin_OK) {
            return true
          }

          return false
        } catch (error) {
          console.log(error)
        }
      },
      async saveCoinsAmounts(coins) {
        try {
          let resCoins = await axios_database.get('/user/coins', this.getAuth())

          // Pega as quantidades atuais de coins do usuário.
          let copper_coin = parseInt(resCoins.data.find(item => item.item == 'copper-coin').amount)
          let silver_coin = parseInt(resCoins.data.find(item => item.item == 'silver-coin').amount)
          let gold_coin = parseInt(resCoins.data.find(item => item.item == 'gold-coin').amount)

          // Novos valores para as moedas.
          let newCoinsValues = {
            'copper-coin': `${ copper_coin - coins['copper-coin'] }`,
            'silver-coin': `${ silver_coin - coins['silver-coin'] }`,
            'gold-coin': `${ gold_coin - coins['gold-coin'] }`,
          }

          let resCoinsSetteds = await axios_database.post('/user/coins/update', newCoinsValues, this.getAuth())

          if (resCoinsSetteds.data.errorField) {
            console.log(resCoinsSetteds.data.msg)
          }
        } catch (error) {
          console.error(error)
        }
      },
      resetFields() {
        for (let type of Object.keys(this.form.fields)) {
          for (let field of Object.keys(this.form.fields[type])) {
            this.form.fields[type][field] = 0
          }
        }
      },
      findPrice(itemType, itemName) {
        return this.items_shopping[itemType].find(fruit => fruit.item == itemName)
      },
      async buy(coins) {
        try {
          if (await this.canBuy(coins)) {
            await this.saveFruitsAmounts()
            await this.saveBallsAmounts()
            await this.saveCoinsAmounts(coins)
            alert('Dados enviados.')
          } else {
            alert('Você não tem coin suficientes.')
          }
        } catch (error) {
          console.error(error)
        }
      },
      // Busca os items que serão vendidos na loja
      shopping($event) {
        $event.preventDefault()

        let coinsCount = {
          'copper-coin': 0,
          'silver-coin': 0,
          'gold-coin': 0
        }

        // Pega os valores das moedas que serão gastas em frutas
        for (let fruit of Object.keys(this.form.fields.fruits)) {
          let item = this.findPrice('fruits', fruit)
          coinsCount[item.required] += this.form.fields.fruits[fruit] * item.amount
        }

        // Pega os valores das moedas que serão gastas em pokebolas
        for (let ball of Object.keys(this.form.fields.balls)) {
          let item = this.findPrice('balls', ball)
          coinsCount[item.required] += this.form.fields.balls[ball] * item.amount
        }

        this.buy(coinsCount)
      },
      closeShoppingWindow() {
        this.$emit('closeShoppingWindow')
      }
    }
  }
</script>
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

  .form-shopping .price {
    padding: 3px;
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