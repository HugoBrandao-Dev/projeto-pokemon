<template>
  <header id="cabecalho" class="centralizar espacar">
      <LoginComponent 
        v-show="showLoginScreen" 
        @closeWindow="showLoginScreen = false"
        @logged="logged" />
      <AlertComponent @alert="setAlert($event)"/>
      <h1>Projeto Pokemon</h1>
      <ul class="coins" v-if="setCoinsInfo">
        <li v-for="coin in itemsCoins" :key="coin.name" class="coin" :title="coin.name.replace('-', ' ')">
          <img :src="coin.iconLink">
          <span>
            {{ player.items.coins[coin.name] }}
          </span>
        </li>
        <li>
          <button type="button" id="btn-buy" class="btn" @click="showShoppingWindow">
            <img src="https://img.icons8.com/color/32/null/pokebag.png"/>
          </button>
        </li>
      </ul>
      <div class="login">
        <router-link id="btn-account" v-show="user.hasUser" to="/account">Minha Conta</router-link>
        <button class="btn btn-login" @click="actionUserButton">
          <img :src="iconUser"/>
        </button>
      </div>
  </header>
</template>

<script>
  // Componentes
  import LoginComponent from './LoginComponent'
  import AlertComponent from './AlertComponent'

  // Bibliotecas
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
        myWindows: {},
        user: {
          hasUser: false,
          info: {
            login: ''
          }
        },
        showLoginScreen: false
      }
    },
    components: {
      LoginComponent,
      AlertComponent
    },
    props: {
      player: Object,
      itemsCoins: Array
    },
    async created() {
      this.jogador = this.player

      await this.validateToken()

      this.$emit('user', { user: this.user })
    },
    computed: {
      iconUser() {
        if (this.user.hasUser) {
          return 'https://img.icons8.com/bubbles/50/null/logout-rounded.png'
        }
        return 'https://img.icons8.com/bubbles/50/null/login-rounded-right.png'
      },
      setCoinsInfo() {
        if (this.user.hasUser) {
          this.$emit('hasUser')
          return true
        }
        return false
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
      // Verifica se já existe um token (usuário logado).
      async validateToken() {
        try {
          if (localStorage.getItem('PokemonUserToken')) {
            let resToken = await axios_database.get('/validate', this.getAuth())
            if (resToken.data.errorField) {
              console.log(resToken.data.msg)
            } else {
              this.user.hasUser = true
            }
          }
        } catch (error) {
          console.error(error)
        }
      },
      showShoppingWindow() {
        this.$emit('showShoppingWindow')
      },
      setAlert($event) {
        this.myWindow = $event.myWindow
      },
      logged() {
        this.user.hasUser = true
        this.showLoginScreen = false

        alert('Logado com sucesso!')
      },
      logout() {
        axios.get('http://localhost:4000/logout')
          .then(() => {
            localStorage.removeItem('PokemonUserToken')
            this.user.hasUser = false
          })
          .catch(error => {
            console.log(error)
          })
      },
      actionUserButton() {
        if (this.user.hasUser) {
          this.myWindow.type = 'error'
          this.myWindow.title = 'Sair'
          this.myWindow.content.push('Deseja realmente sair?')
          this.myWindow.response.execFunction = this.logout
        } else {
          this.showLoginScreen = true
        }
      }
    }
  }
</script>

<style scopted>
  #cabecalho {
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .coins, .login {
    display: flex;
    align-items: center;
  }

  .login #btn-account {
    margin-right: 20px;
    color: #fff;
  }

  .coins .coin {
    display: flex;
    align-items: center;
    font-size: 9pt;
  }

  #cabecalho #btn-buy {
    margin-left: 10px;
    padding: 2px;
    background-color: #47476b;
    border: none;
    border-bottom: 2px solid #47476b
  }

  #cabecalho #btn-buy:hover {
    border-bottom: 2px solid #fff;
  }

  .login .user-name {
    font-size: 10pt;
    margin: 20px;
  }

  .login .btn-login {
    margin-right: 0;
    border: none;
    background-color: #47476b;
    padding: 0;
  }
</style>