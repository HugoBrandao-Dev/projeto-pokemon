<template>
  <section id="acoes" class="espacar centralizar">
    <div class="centralizar" v-if="statusPartida.emAndamento">
      <button id="btn-atacar" type="button" class="btn" @click="atacarNormal">
        Ataque
        <img src="https://img.icons8.com/ios-glyphs/30/000000/sword.png" />
      </button>
      <!-- <div class="special-attacks">
        <button 
          v-for="special in this.jogador.ataque.especiais" 
          :key="special.name"
          @click="atacarEspecial"
          type="button" 
          class="btn btn-especial">
            {{ special.name }}
          <img src="https://img.icons8.com/dusk/30/000000/sword.png" />
        </button>
      </div> -->
      <button id="btn-curar" type="button" class="btn" @click="curarJogador">
        Curar
        <img src="https://img.icons8.com/ios-glyphs/30/000000/hand-with-a-pill.png" />
      </button>
      <button id="btn-desistir" type="button" class="btn" @click="desistir">
        Desistir
      </button>
    </div>
    <div v-else>
      <button id="btn-iniciar" type="button" class="btn" @click="iniciar">
        Iniciar nova partida
      </button>
    </div>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        statusPartida: {
          emAndamento: false,
          mostrarResultado: false,
          status: '',
          mensagem: ''
        },
        jogador: {},
        monstro: {},
        logAcoes: []
      }
    },
    props: {
      player: Object,
      npc: Object,
      statusMatch: Object,
      logActions: Array
    },
    methods: {
      /*
        Calcula quanto um dano representa em % da vida de quem recebe esse dano, tendo como
        base a experiencia que cada pokemon possui.
      */
      getPercentageDamage(exp, damage) {
        return (damage * 100 / exp)
      },
      vezJogadorAtacar(especial) {
        if (this.jogador.vida != 0) {
          let minimo = 0
          let maximo = 0
          let forcaAtaque = 0
          if (especial) {
            forcaAtaque = this.jogador.ataque.especiais[0].power
          } else {
            minimo = this.jogador.ataque.normal.minimo
            maximo = this.jogador.ataque.normal.maximo
            forcaAtaque = this.getValorRandom(minimo, maximo)
          }

          let percentageDamage = Math.round(this.getPercentageDamage(this.monstro.experience, forcaAtaque))

          if ((this.monstro.vida - percentageDamage) < 0) {
            this.monstro.vida = 0
          } else {
            this.monstro.vida -= percentageDamage
          }
          return forcaAtaque
        }
        return 0
      },
      vezJogadorCurar() {
        if (this.jogador.vida != 0) {
          let capMinima = this.jogador.cura.capacidadeMinima
          let capMaxima = this.jogador.cura.capacidadeMaxima

          let forcaCura = this.getValorRandom(capMinima, capMaxima)

          if (this.jogador.vida + forcaCura >= 100) {
            this.jogador.vida = 100
          } else {
            this.jogador.vida += forcaCura
          }
          return forcaCura
        }
        return 0
      },
      vezMonstroAtacar() {
        if (this.monstro.vida != 0) {
          let minimo = this.monstro.ataque.normal.minimo
          let maximo = this.monstro.ataque.normal.maximo

          // O jogador perde vida baseada no valor máximo e minimo de ataque do monstro
          let forcaAtaque = this.getValorRandom(minimo, maximo)

          let percentageDamage = Math.round(this.getPercentageDamage(this.jogador.experience, forcaAtaque))

          if ((this.jogador.vida - percentageDamage) < 0) {
            this.jogador.vida = 0
          } else {
            this.jogador.vida -= percentageDamage
          }
          return forcaAtaque
        }
        return 0
      },
      atacarNormal() {
        let danoDoJogador = this.vezJogadorAtacar(false)
        this.setAcao('dano', 'monstro', danoDoJogador)

        let danoDoMonstro = this.vezMonstroAtacar()
        this.setAcao('dano', 'jogador', danoDoMonstro)
        this.verificarVencedor()
      },
      atacarEspecial() {
        let danoDoJogador = this.vezJogadorAtacar(true)
        this.setAcao('dano', 'monstro', danoDoJogador)

        let danoDoMonstro = this.vezMonstroAtacar()
        this.setAcao('dano', 'jogador', danoDoMonstro)
        this.verificarVencedor()
      },
      curarJogador() {
        let curaDoJogador = this.vezJogadorCurar()
        this.setAcao('cura', 'jogador', curaDoJogador)

        let danoDoMonstro = this.vezMonstroAtacar()
        this.setAcao('dano', 'jogador', danoDoMonstro)
        this.verificarVencedor()
      },
      setAcao(tipo, destino, valor) {
        if (valor != 0) {
          let mensagem = ''
          if (tipo == 'cura') {
            mensagem = `Você curou ${valor}.`
          } else {
            mensagem = `O ${destino} recebeu ${valor} de dano.`
          }
          this.logAcoes.unshift({
            id: `${destino}${Date.now()}${tipo}`,
            destino,
            tipo,
            mensagem
          })
        }
      },
      getValorRandom(min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min)
      },
      // Define o limite máximo e mínimo de ataque, tanto o jogador quanto do NPC.
      setMinMaxAttack() {

        /* ######### Jogador attack config ######### */

        let playerAttackMin = Math.round(this.jogador.experience / 10)
        let playerAttackMax = Math.round((this.jogador.experience / 10) * 2)

        // Normal attack
        this.jogador.ataque.normal.minimo = playerAttackMin
        this.jogador.ataque.normal.maximo = playerAttackMax

        /* ######### NPC attack config ######### */

        let npcAttackMin = Math.round(this.monstro.experience / 10)
        let npcAttackMax = Math.round((this.monstro.experience / 10) * 2)

        // Normal attack
        this.monstro.ataque.normal.minimo = npcAttackMin
        this.monstro.ataque.normal.maximo = npcAttackMax
      },
      /*
        A capacidade de recuperação é baseada na experiencia do Pokemon
      */
      setMinMaxRecovery() {
        this.jogador.cura.capacidadeMinima = Math.round(this.jogador.experience / 10)
        this.jogador.cura.capacidadeMaxima = Math.round((this.jogador.experience / 10) * 2)
      },
      setIniciarPartida() {
        this.statusPartida = this.statusMatch
        this.$emit("clearLog")
        this.$emit("generatePokemons")
        this.logAcoes = this.logActions
        this.statusPartida.emAndamento = true
        this.statusPartida.mensagem = ''
        this.statusPartida.mostrarResultado = false
        this.statusPartida.status = ''
      },
      setFinalizarPartida(status, mensagem) {
        this.statusPartida.emAndamento = false
        this.statusPartida.mensagem = mensagem
        this.statusPartida.mostrarResultado = true
        this.statusPartida.status = status
        this.logAcoes = []
      },
      verificarVencedor() {
        if (this.jogador.vida == 0) {
          this.setFinalizarPartida('perdeu', 'Você perdeu :(')
        } else if (this.monstro.vida == 0) {
          this.setFinalizarPartida('ganhou', "Você venceu !! \\o/")
        }
      },
      desistir() {
        if (confirm('Deseja realmente DESISTIR da partida?')) {
          this.setFinalizarPartida('desistiu', 'Você desistiu')
        }
      },
      iniciar() {
        this.setIniciarPartida()
      }
    }
  }
</script>

<style>
  #acoes div {
    align-items: flex-start;
  }
  #acoes div, #acoes div .special-attacks {
    display: flex;
  }
  #acoes div .special-attacks {
    flex-direction: column;
  }
  .btn-especial {
    margin-bottom: 5px;
    text-transform: capitalize;
    width: 200px;
    display: flex;
    justify-content: space-between;
  }
  .btn-especial:last-child {
    margin-bottom: 0px;
  }
</style>