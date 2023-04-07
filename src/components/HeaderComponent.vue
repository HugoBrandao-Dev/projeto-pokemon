<template>
  <header id="cabecalho" class="centralizar espacar">
      <LoginComponent 
        v-show="showLoginScreen" 
        @closeWindow="showLoginScreen = false"
        @logged="logged" />
      <AlertComponent @alert="setAlert($event)"/>
      <h1>Projeto Pokemon</h1>
      <ul class="coins" v-if="itemsIcons.coinsLinks.length">
        <li v-for="coin in itemsIcons.coinsLinks" :key="coin.name" class="coin" :title="coin.name.replace('-', ' ')">
          <img :src="coin.iconLink">
          <span>
            {{ itemsAmount.coins[coin.name] }}
          </span>
        </li>
      </ul>
      <div class="login">
        <small v-show="user.hasUser" class="user-name">{{ user.info.login }}</small>
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
    created() {
      // Verifica se já existe um token (usuário logado).
      if (localStorage.getItem('PokemonUserToken')) {
        this.user.hasUser = true
      }

      this.$emit('user', { user: this.user })
    },
    components: {
      LoginComponent,
      AlertComponent
    },
    props: {
      itemsIcons: Object,
      itemsAmount: Object
    },
    computed: {
      iconUser() {
        if (this.user.hasUser) {
          return 'https://img.icons8.com/pastel-glyph/32/00cc99/user-male-circle.png'
        }
        return 'https://img.icons8.com/pastel-glyph/32/ff3333/user-male-circle.png'
      }
    },
    methods: {
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
  }

  .coins .coin {
    display: flex;
    align-items: center;
    font-size: 9pt;
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