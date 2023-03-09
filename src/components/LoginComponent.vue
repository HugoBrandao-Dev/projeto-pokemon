<template>
  <div id="access-screen">
    <form method="POST">
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
          <a href="#">Cadastrar</a>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script>
  
  export default {
    data() {
      return {

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

  #access-screen .access-action .btn {
    margin-right: 0;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    background-color: #3399ff;
    border-color: #3399ff;
    width: 100%;
  }
</style>