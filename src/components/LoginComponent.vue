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
          <input type="email" name="iptLogin" v-model="form.login.iptLogin.value" placeholder="seu_email@exemplo.com">
          <small class="error-message">{{ form.login.iptLogin.errorMessage }}</small>
        </label>
        <label>
          <img src="https://img.icons8.com/material-sharp/32/666666/password1.png"/>
          <input type="password" name="iptPassword" v-model="form.login.iptPassword.value">
          <small class="error-message">{{ form.login.iptPassword.errorMessage }}</small>
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
        <input type="text" v-model="form.register.iptName.value" name="iptName" placeholder="Nome completo">
        <small class="error-message">{{ form.register.iptName.errorMessage }}</small>

        <label>Email:</label>
        <input type="email" v-model="form.register.iptEmail.value" name="iptEmail" placeholder="seu_email@exemplo.com">
        <small class="error-message">{{ form.register.iptEmail.errorMessage }}</small>

        <label>Data de nascimento:</label>
        <input type="date" v-model="form.register.iptBornDate.value" name="iptBornDate">
        <small class="error-message">{{ form.register.iptBornDate.errorMessage }}</small>

        <label>Senha:</label>
        <input type="password" v-model="form.register.iptPassword.value" name="iptPassword">
        <small class="error-message">{{ form.register.iptPassword.errorMessage }}</small>

        <label>Sua senha novamente:</label>
        <input type="password" v-model="form.register.iptConfirmationPassword.value" name="iptConfirmationPassword">
        <small class="error-message">{{ form.register.iptConfirmationPassword.errorMessage }}</small>

        <div class="access-action">
          <button class="btn">Cadastrar</button>
          <button class="btn" @click="form.type = 'login'">Cancelar</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script>
  import validator from 'validator'
  import axios from 'axios'
  
  const axios_database = axios.create({
    baseURL: 'http://localhost:4000'
  })

  export default {
    data() {
      return {
        form: {
          type: 'login',
          login: {
            iptLogin: {
              value: null,
              errorMessage: ''
            },
            iptPassword: {
              value: null,
              errorMessage: ''
            }
          },
          register: {
            iptName: {
              value: null,
              errorMessage: ''
            },
            iptEmail: {
              value: null,
              errorMessage: ''
            },
            iptBornDate: {
              value: null,
              errorMessage: ''
            },
            iptPassword: {
              value: null,
              errorMessage: ''
            },
            iptConfirmationPassword: {
              value: null,
              errorMessage: ''
            }
          },
          acceptableCharactersPassword: '.@#%&*!@_',
          acceptableCharactersName: ' -\''
        }
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
      resetFormFields() {
        // Reset da tela de login
        for (let field of Object.keys(this.form.login)) {
          this.form.login[field].value = ''
          this.form.login[field].errorMessage = ''
        }

        // Reset da tela de cadastro
        for (let field of Object.keys(this.form.register)) {
          this.form.register[field].value = ''
          this.form.register[field].errorMessage = ''
        }
      },
      closeWindow() {
        this.$emit('closeWindow')
        this.resetFormFields()
        this.form.type = 'login'
      },
      login($event) {
        $event.preventDefault()

        let areFormFieldsCorrect = true

        this.form.login.iptLogin.errorMessage = !validator.isEmail(this.form.login.iptLogin.value) ? 'Login inválido' : ''

        this.form.login.iptPassword.errorMessage = !validator.isAlphanumeric(this.form.login.iptPassword.value, ['pt-BR'], {
          ignore: this.form.acceptableCharactersPassword
        }) ? 'Password inválida.' : ''

        for (let field of Object.keys(this.form.login)) {
          if (this.form.login[field].errorMessage.length != 0) {
            areFormFieldsCorrect = false
          }
        }

        if (areFormFieldsCorrect) {
          axios_database.post('/login', {
            email: this.form.login.iptLogin.value,
            user_password: this.form.login.iptPassword.value
          }).then(response => {
              if (response.data.errorField) {
                this.form.login[response.data.errorField].errorMessage = response.data.msg
              } else {
                localStorage.setItem('PokemonUserToken', response.data.token)
                this.$emit('logged')
                this.resetFormFields()
              }
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          alert('Erro no login :(')
        }
      },
      async registred() {
        try {
          let resLogin = await axios_database.post('/login', {
            email: this.form.register.iptEmail.value,
            user_password: this.form.register.iptPassword.value
          })

          if (resLogin.data.token) {
            this.$emit('logged')

            localStorage.setItem('PokemonUserToken', resLogin.data.token)

            try {
              await axios_database.post('/user/balls', {
                'poke-ball': '6',
                'great-ball': '2',
                'ultra-ball': '0',
                'master-ball': '0'
              }, this.getAuth())

              await axios_database.post('/user/fruits', {
                'jaboca-berry': '10',
                'razz-berry': '5',
                'bluk-berry': '1'
              }, this.getAuth())
            } catch (error) {
              console.error(error)
            }
          }
        } catch (error) {
          console.error(error)
        }
      },
      register($event) {
        $event.preventDefault()

        let areFormFieldsCorrect = true

        this.form.register.iptName.errorMessage = !validator.isAlpha(this.form.register.iptName.value, ['pt-BR'], {
          ignore: this.form.acceptableCharactersName
        }) ? 'Nome inválido.' : ''

        this.form.register.iptEmail.errorMessage = !validator.isEmail(this.form.register.iptEmail.value) ? 'Email inválido' : ''

        this.form.register.iptBornDate.errorMessage = !validator.isDate(this.form.register.iptBornDate.value) ? 'Data de nascimento inválida' : ''

        this.form.register.iptPassword.errorMessage = !validator.isAlphanumeric(this.form.register.iptPassword.value, ['pt-BR'], {
          ignore: this.form.acceptableCharactersPassword
        }) ? 'Senha inválida' : ''

        this.form.register.iptConfirmationPassword.errorMessage = !validator.equals(this.form.register.iptPassword.value, this.form.register.iptConfirmationPassword.value) ? 'Senha de confirmação não confere.' : ''

        for (let field of Object.keys(this.form.register)) {
          if (this.form.register[field].errorMessage.length != 0) {
            areFormFieldsCorrect = false
          }
        }

        if (areFormFieldsCorrect) {
          axios_database.post('/register', {
            full_name: this.form.register.iptName.value,
            born_date: this.form.register.iptBornDate.value,
            email: this.form.register.iptEmail.value,
            user_password: this.form.register.iptPassword.value
          }).then(response => {
              if (response.data.errorField) {
                this.form.register[response.data.errorField].errorMessage = response.data.msg
              } else {
                this.registred()
                // alert('Usuário cadastrado com sucesso.')
                this.resetFormFields()
              }
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          alert('Erro no cadastro do usuário.')
        }
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
    border-bottom: solid 2px #666666;
    outline: none;
  }

  #access-screen input:focus {
    border-bottom-width: 3px;
  }

  #access-screen .access-action {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .form-login fieldset .error-message, .form-register fieldset .error-message {
    align-self: flex-start;
    font-size: 9px;
    color: #ee6666;
    font-weight: bolder;
  }

  /* Formulário de login */

  .form-login fieldset label {
    margin-bottom: 20px;

    display: flex;
    flex-wrap: wrap;
  }

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

  .form-register fieldset .error-message {
    margin-bottom: 20px;
  }

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