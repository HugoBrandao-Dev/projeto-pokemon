<template>
  <header id="cabecalho" class="centralizar espacar">
      <LoginComponent />
      <h1>Projeto Pokemon</h1>
      <div class="login">
        <small v-show="user.hasUser" class="user-name">{{ user.info.login }}</small>
        <button class="btn btn-login">
          <img :src="iconUser"/>
        </button>
      </div>
  </header>
</template>

<script>
  import LoginComponent from './LoginComponent'

  export default {
    data() {
      return {
        user: {
          hasUser: false,
          info: {
            login: ''
          }
        }
      }
    },
    components: {
      LoginComponent
    },
    computed: {
      iconUser() {
        if (this.user.hasUser) {
          return 'https://img.icons8.com/pastel-glyph/32/00cc99/user-male-circle.png'
        }
        return 'https://img.icons8.com/pastel-glyph/32/ff3333/user-male-circle.png'
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

  .login {
    display: flex;
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