<template>
  <div id="account" class="espacar">
    <div class="account-header">
      <router-link to="/" title="Home">
        <img src="https://img.icons8.com/dusk/32/null/home--v1.png"/>
      </router-link>
      <h1>Conta</h1>
      <button id="btn-delete" class="btn">Deletar conta</button>
    </div>
    <hr class="hr-hor">
    <article class="infos-update">
      <section class="infos">
        <h2>Informações</h2>
        <div>
          <p class="info">
            <strong>Nome: </strong>
            <span>{{ userInfo.full_name }}</span>
          </p>
          <p class="info">
            <strong>Data de nascimento: </strong>
            <span>{{ userInfo.born_date }}</span>
          </p>
          <p class="info">
            <strong>Email: </strong>
            <span>{{ userInfo.email }}</span>
          </p>
        </div>
        <button id="btn-change" class="btn" @click="changeInfo = true">Mudar</button>
      </section>
      <hr class="hr-ver" v-show="changeInfo">
      <section class="update" v-show="changeInfo">
        <form @submit="update" class="form-update">
          <legend><h2>Atualização</h2></legend>
          <fieldset>
            <p>
              <label>Nome:</label>
              <input type="text" v-model="form.update.iptName.value" name="iptName" placeholder="Nome completo">
              <small class="error-message">{{ form.update.iptName.errorMessage }}</small>
            </p>

            <p>
              <label>Email:</label>
              <input type="email" v-model="form.update.iptEmail.value" name="iptEmail" placeholder="seu_email@exemplo.com">
              <small class="error-message">{{ form.update.iptEmail.errorMessage }}</small>
            </p>
            
            <p>
              <label>Data de nascimento:</label>
              <input type="date" v-model="form.update.iptBornDate.value" name="iptBornDate">
              <small class="error-message">{{ form.update.iptBornDate.errorMessage }}</small>
            </p>

            <p>
              <label>Senha:</label>
              <input type="password" v-model="form.update.iptPassword.value" name="iptPassword">
              <small class="error-message">{{ form.update.iptPassword.errorMessage }}</small>
            </p>

            <p>
              <label>Sua senha novamente:</label>
              <input type="password" v-model="form.update.iptConfirmationPassword.value" name="iptConfirmationPassword">
              <small class="error-message">{{ form.update.iptConfirmationPassword.errorMessage }}</small>
            </p>

            <div class="access-action">
              <button id="btn-update" type="submit" class="btn">Atualizar</button>
            </div>
          </fieldset>
        </form>
      </section>
    </article>
  </div>
</template>
<script>
  import axios from 'axios'
  import validator from 'validator'

  const axios_database = axios.create({
    baseURL: 'http://localhost:4000'
  })

  export default {
    data() {
      return {
        changeInfo: false,
        userInfo: {
          full_name: '',
          born_date: '',
          email: ''
        },
        form: {
          update: {
            iptName: {
              value: '',
              errorMessage: ''
            },
            iptEmail: {
              value: '',
              errorMessage: ''
            },
            iptBornDate: {
              value: '',
              errorMessage: ''
            },
            iptPassword: {
              value: '',
              errorMessage: ''
            },
            iptConfirmationPassword: {
              value: '',
              errorMessage: ''
            }
          },
          acceptableCharactersPassword: '.@#%&*!@_',
          acceptableCharactersName: ' -\''
        }
      }
    },
    created() {
      this.getUserInfos()
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
      /*
      Função que faz o tratamento da data de nascimento, já que retorna do BD com horário e outras 
      informações desnecessárias.
      */
      getBornDateFormated(born_date) {
        return born_date.split('T')[0]
      },
      async getUserInfos() {
        try {
          let resUser = await axios_database.get('/user/info', this.getAuth())

          let { full_name, born_date, email } = resUser.data

          born_date = this.getBornDateFormated(born_date)

          this.userInfo = { full_name, born_date, email }
        } catch (error) {
          console.error(error)
        }
      },
      resetFields() {
        this.form.update.iptName.value = ''
        this.form.update.iptEmail.value = ''
        this.form.update.iptBornDate.value = ''
        this.form.update.iptPassword.value = ''
        this.form.update.iptConfirmationPassword.value = ''
      },
      update($event) {
        $event.preventDefault()

        let areFormFieldsCorrect = true

        this.form.update.iptName.errorMessage = !validator.isAlpha(this.form.update.iptName.value, ['pt-BR'], {
          ignore: this.form.acceptableCharactersName
        }) ? 'Nome inválido.' : ''

        this.form.update.iptEmail.errorMessage = !validator.isEmail(this.form.update.iptEmail.value) ? 'Email inválido' : ''

        this.form.update.iptBornDate.errorMessage = !validator.isDate(this.form.update.iptBornDate.value) ? 'Data de nascimento inválida' : ''

        this.form.update.iptPassword.errorMessage = !validator.isAlphanumeric(this.form.update.iptPassword.value, ['pt-BR'], {
          ignore: this.form.acceptableCharactersPassword
        }) ? 'Senha inválida' : ''

        this.form.update.iptConfirmationPassword.errorMessage = !validator.equals(this.form.update.iptPassword.value, this.form.update.iptConfirmationPassword.value) ? 'Senha de confirmação não confere.' : ''

        for (let field of Object.keys(this.form.update)) {
          if (this.form.update[field].errorMessage.length != 0) {
            areFormFieldsCorrect = false
          }
        }

        if (areFormFieldsCorrect) {
          axios_database.post('/user/update', {
            full_name: this.form.update.iptName.value,
            born_date: this.form.update.iptBornDate.value,
            email: this.form.update.iptEmail.value,
            user_password: this.form.update.iptPassword.value
          }, this.getAuth()).then(response => {
              if (response.data.errorField) {
                console.log(response.data.errorField)
                this.form.update[response.data.errorField].errorMessage = response.data.msg
              } else {
                this.resetFields()
                localStorage.removeItem('PokemonUserToken')
                this.$router.push('/')
                alert('Informações atualizadas com sucesso.')
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
  .btn {
    margin-right: 0;
  }

  /* CABEÇALHO */
  #account {
    width: 100%;
  }

  #account .account-header {
    width: 100%;
    margin-right: 0;
    display: flex;
    justify-content: space-between;
  }

  #account #btn-delete {
    background-color: #ff3333;
    border-color: #ff3333;
  }

  #account .hr-hor {
    margin: 20px 0;
    border: none;
    width: 25%;
    height: 3px;
    background-color: #66ff66;
  }

  /* ARTICLE */
  .infos-update {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }

  .infos-update section {
    width: 35%;
  }

  /* Informações */
  .infos-update .infos h2, .infos-update .infos .info, .infos-update .update h2, .form-update p {
    margin-bottom: 10px;
  }

  .hr-ver {
    margin: 0 20px;
    border: none;
    width: 3px;
    height: 300px;
    background-color: #66ff66;
  }

  .infos-update .infos #btn-change {
    background-color: #3399ff;
    border-color: #3399ff;
    color: #fff;
  }

  /* Formulário de atualização */
  .update .form-update fieldset {
    border: none;
  }

  .form-update p input {
    width: 100%;
    padding: 5px 10px;
    background-color: #47476b;
    color: #fff;
    border-color: white;
    outline: none;
  }

  .form-update p input:focus {
    box-shadow: 0 0 2px #fff;
  }

  .form-update .access-action {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .form-update .access-action #btn-update {
    margin-right: 0;
    background-color: #e6e600;
    border-color: #e6e600;
    color: #47476b;
  }

  .form-update fieldset .error-message {
    align-self: flex-start;
    font-size: 9px;
    color: #ee6666;
    font-weight: bolder;
  }
</style>