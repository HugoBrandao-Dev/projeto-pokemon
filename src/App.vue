<template>
  <main id="app">
    <section id="jogadores">
      <PlayerComponent @playerStatus="playerStatus($event)" />
      <NPCComponent @npcStatus="npcStatus($event)" />
    </section>
    <MatchComponent @match="statusMatch($event)" />
    <ActionsComponent :player="jogador" :npc="monstro" :statusMatch="match" />
    <LogsComponent />
  </main>
</template>

<script>
  // Componentes
  import PlayerComponent from './components/PlayerComponent'
  import NPCComponent from './components/NPCComponent'
  import MatchComponent from './components/MatchComponent'
  import ActionsComponent from './components/ActionsComponent'
  import LogsComponent from './components/LogsComponent'

  export default {
    name: 'App',
    data() {
      return {
        jogador: {},
        monstro: {},
        match: {}
      }
    },
    components: {
      PlayerComponent,
      NPCComponent,
      MatchComponent,
      ActionsComponent,
      LogsComponent
    },
    methods: {
      playerStatus($event) {
        this.jogador = $event.jogador
      },
      npcStatus($event) {
        this.monstro = $event.monstro
      },
      statusMatch($event) {
        this.match = $event.status
      }
    }
  }
</script>

<style>
  /* Reset */
  * {
    font-family: 'Orbitron', sans-serif;
    font-weight: normal;
    font-size: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  h1, h2 {
    font-weight: bold;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  .centralizar {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .espacar {
    padding: 10px;
  }

  /* ############### CORPO ############### */

  #app {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Seções */

  #jogadores, #acoes, #logs {
    box-shadow: 0px 0px 5px #595959;
    width: 100%;
  }

  #acoes, #logs, #mensagem-resultado {
    margin-top: 20px;
  }

  #jogadores {
    display: flex;
    justify-content: space-between;
  }

  /* Individuais */

  .personagem {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 45%;
  }

  .personagem h2 {
    font-size: 0px;
  }

  .caixa-vida {
    border: 3px dotted #d9d9d9;
    width: 100%;
    height: 40px;
    margin: 10px 0px;
  }

  .vida {
    height: 100%;
    width: 100%;
  }

  /* Log da batalha */

  .log-acao {
    margin: 5px 0px;
    text-align: center;
  }

  .monstro {
    padding: 10px;
    width: 100%;
    background-color: #33cc33;
    color: #fff;
  }

  .jogador {
    padding: 10px;
    width: 100%;
    background-color: #ff3333;
    color: #fff;
  }

  /* Botões */

  .btn {
    padding: 8px 10px;
    font-weight: bold;
    margin-right: 20px;
    border: 3px outset;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    outline: none;
  }

  #btn-atacar {
    background-color: #ff3333;
    border-color: #ff3333;
  }

  #btn-especial {
    background-color: #3399ff;
    border-color: #3399ff;
  }

  #btn-curar {
    background-color: #ffff66;
    border-color: #ffff66;
    color: black;
  }

  #btn-desistir {
    background-color: #404040;
    border-color: #404040;
  }

  #btn-iniciar {
    background-color: #33cc33;
    color: #fff;
    border-color: #33cc33;
  }

  /* Status da partida */

  .desistiu {
    background-color: #404040;
    box-shadow: 0 0 10px #404040;
    color: #fff;
  }

  .ganhou {
    background-color: #33cc33;
    box-shadow: 0 0 10px #33cc33;
    color: #fff;
  }

  .perdeu {
    background-color: #ff3333;
    box-shadow: 0 0 10px #ff3333;
    color: #fff;
  }
</style>
