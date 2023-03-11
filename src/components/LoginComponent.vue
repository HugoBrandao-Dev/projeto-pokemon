<template>
  <div id="access-screen">
    <form method="POST" @submit="login" v-if="form.type == 'login'" class="form-login">
      <div class="form-header">
        <h1 class="espacar">Acessar</h1>
        <button type="button" class="btn btn-close-window" @click="closeWindow()">
          <img src="https://img.icons8.com/dotty/32/null/close-window.png"/>
        </button>
      </div>
      <fieldset>
        <label>
          <img src="https://img.icons8.com/pastel-glyph/32/666666/user-male-circle.png">
          <input type="email" name="iptLogin" v-model="form.login.iptLogin" placeholder="seu_email@exemplo.com">
        </label>
        <label>
          <img src="https://img.icons8.com/material-sharp/32/666666/password1.png"/>
          <input type="password" name="iptPassword" v-model="form.login.iptPassword">
        </label>

        <div class="access-action">
          <button class="btn">Login</button>
          <a class="btn" @click="form.type = 'register'">Cadastrar</a>
        </div>
      </fieldset>
    </form>
    <form method="POST" @submit="register" v-else-if="form.type == 'register'" class="form-register">
      <div class="form-header">
        <h1 class="espacar">Cadastrar</h1>
        <button type="button" class="btn btn-close-window" @click="closeWindow()">
          <img src="https://img.icons8.com/dotty/32/null/close-window.png"/>
        </button>
      </div>
      <fieldset>
        <label>Nome:</label>
        <input type="text" v-model="form.register.iptName" name="iptName" placeholder="Nome completo">

        <label>Email:</label>
        <input type="email" v-model="form.register.iptEmail" name="iptEmail" placeholder="seu_email@exemplo.com">

        <label>Data de nascimento:</label>
        <input type="date" v-model="form.register.iptBornDate" name="iptBornDate">

        <label>Senha:</label>
        <input type="password" v-model="form.register.iptPassword" name="iptPassword">

        <label>Sua senha novamente:</label>
        <input type="password" v-model="form.register.iptConfirmationPassword" name="iptConfirmationPassword">

        <div class="access-action">
          <button class="btn">Cadastrar</button>
          <button class="btn" @click="form.type = 'login'">Cancelar</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script>
  
  export default {
    data() {
      return {
        form: {
          type: 'login',
          login: {
            iptLogin: null,
            iptPassword: null
          },
          register: {
            iptName: null,
            iptEmail: null,
            iptBornDate: null,
            iptPassword: null,
            iptConfirmationPassword: null
          }
        }
      }
    },
    methods: {
      resetFields() {
        // Reset da tela de login
        this.form.login.iptLogin = null
        this.form.login.iptPassword = null

        // Reset da tela de cadastro
        this.form.register.iptName = null
        this.form.register.iptEmail = null
        this.form.register.iptBornDate = null
        this.form.register.iptPassword = null
        this.form.register.iptConfirmationPassword = null
      },
      closeWindow() {
        this.$emit('closeWindow')
        this.resetFields()
        this.form.type = 'login'
      },
      login($event) {
        console.log(`
          login: ${ this.form.login.iptLogin }
          password: ${ this.form.login.iptPassword }
        `)
        $event.preventDefault()
      },
      register($event) {
        console.log(`
          Name: ${ this.form.register.iptName }
          Email: ${ this.form.register.iptEmail }
          BornDate: ${ this.form.register.iptBornDate }
          Password: ${ this.form.register.iptPassword }
          ConfirmationPassword: ${ this.form.register.iptConfirmationPassword }
        `)
        $event.preventDefault()
      }
    }
  }
</script>
<style scoped>
  #access-screen {
    width: 40%;
    margin: 0 30%;
    background-color: #ffffff;
    color: #333333;
    top: 100px;
    position: absolute;
  }

  #access-screen .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #66ff66;
  }

  #access-screen .form-header .btn-close-window {
    border: none;
    padding: 0;
    background-color: #66ff66;
  }

  #access-screen fieldset {
    display: flex;
    flex-direction: column;

    border: none;
    padding: 25px;
  }

  #access-screen input {
    margin-left: 5px;
    width: calc(100% - (32px + 5px));
    padding: 5px 10px;
    border: none;
    border-bottom: solid 3px #666666;
    margin-bottom: 20px;
    outline: none;
  }

  #access-screen .access-action {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Formulário de login */

  .form-login .access-action .btn {
    margin-right: 0;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    background-color: #3399ff;
    border-color: #3399ff;
    width: 100%;
  }

  .form-login .access-action .btn:last-child {
    background-color: #ffffff;
    color: #3399ff;
    border-style: solid;
    border-top-style: dotted;
    border-right-style: dotted;
  }

  /* Formulário de cadastro */

  #access-screen .form-register .access-action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .form-register .access-action .btn:first-child {
    background-color: #3399ff;
    border-color: #3399ff;
  }

  .form-register .access-action .btn:last-child {
    background-color: #ff3333;
    border-color: #ff3333;
  }
</style>