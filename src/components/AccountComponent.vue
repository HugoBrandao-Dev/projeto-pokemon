<template>
  <div id="account">
    <h1>Conta</h1>
    <hr class="hr-hor">
    <article class="infos-update">
      <section class="infos">
        <h2>Informações</h2>
        <div>
          <p class="info">
            <strong>Nome: </strong>
            <span>Dinorá de Oliveira</span>
          </p>
          <p class="info">
            <strong>Data de nascimento: </strong>
            <span>1985-01-10</span>
          </p>
          <p class="info">
            <strong>Email: </strong>
            <span>dinora_oli@hotmail.com</span>
          </p>
        </div>
        <button id="btn-change" class="btn">Mudar</button>
      </section>
      <hr class="hr-ver">
      <section class="update">
        <form>
          <legend><h2>Atualização</h2></legend>
          <fieldset>
            <p>
              <label>Nome:</label>
              <input type="text" name="iptName" placeholder="Nome completo">
            </p>

            <p>
              <label>Email:</label>
              <input type="email" name="iptEmail" placeholder="seu_email@exemplo.com">
            </p>
            
            <p>
              <label>Data de nascimento:</label>
              <input type="date" name="iptBornDate">
            </p>

            <p>
              <label>Senha:</label>
              <input type="password" name="iptPassword">
            </p>

            <p>
              <label>Sua senha novamente:</label>
              <input type="password" name="iptConfirmationPassword">
            </p>

            <div class="access-action">
              <button id="btn-update" class="btn">Atualizar</button>
            </div>
          </fieldset>
        </form>
      </section>
    </article>
  </div>
</template>
<script></script>
<style scoped>
  /* CABEÇALHO */
  #account {
    padding: 20px 0;
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
  .infos-update .infos h2, .infos-update .infos .info, .infos-update .update h2{
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
  .update form fieldset {
    border: none;
  }

  form p input {
    width: 100%;
    padding: 5px 10px;
    background-color: #47476b;
    color: #fff;
    border-color: white;
    margin-bottom: 20px;
    outline: none;
  }

  form p input:focus {
    box-shadow: 0 0 2px #fff;
  }

  form .access-action {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  form .access-action #btn-update {
    margin-right: 0;
    background-color: #e6e600;
    border-color: #e6e600;
    color: #47476b;
  }
</style>