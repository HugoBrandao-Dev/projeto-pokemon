<template>
  <div id="access-screen">
    <form method="POST" v-if="form.type == 'login'" class="form-login">
      <h1 class="espacar">Acessar</h1>
      <fieldset>
        <label>
          <img src="https://img.icons8.com/pastel-glyph/32/666666/user-male-circle.png">
          <input type="email" name="iptLogin" placeholder="seu_email@exemplo.com">
        </label>
        <label>
          <img src="https://img.icons8.com/material-sharp/32/666666/password1.png"/>
          <input type="password" name="iptPassword">
        </label>

        <div class="access-action">
          <button class="btn">Login</button>
          <button class="btn">Cadastrar</button>
        </div>
      </fieldset>
    </form>
    <form method="POST" v-else-if="form.type == 'register'" class="form-register">
      <h1 class="espacar">Cadastrar</h1>
      <fieldset>
        <label>Nome:</label>
        <input type="text" name="iptName" placeholder="Nome completo">

        <label>Email:</label>
        <input type="email" name="iptEmail" placeholder="seu_email@exemplo.com">

        <label>Data de nascimento:</label>
        <input type="date" name="iptBornDate">

        <label>Senha:</label>
        <input type="password" name="iptPassword">

        <label>Sua senha novamente:</label>
        <input type="password" name="iptConfirmationPassword">

        <div class="access-action">
          <button class="btn">Cadastrar</button>
          <button class="btn">Cancelar</button>
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
          type: 'login'
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

  #access-screen h1 {
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

  #access-screen .form-login .btn {
    margin-right: 0;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    background-color: #3399ff;
    border-color: #3399ff;
    width: 100%;
  }

  #access-screen .form-login .btn:last-child {
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