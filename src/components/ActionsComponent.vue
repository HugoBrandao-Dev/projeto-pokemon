<template>
  <section id="acoes" class="espacar centralizar">
    <div class="centralizar" v-if="statusPartida.emAndamento">
      <button id="btn-atacar" type="button" class="btn" @click="atacarNormal">Ataque<img
          src="https://img.icons8.com/ios-glyphs/30/000000/sword.png" /></button>
      <button id="btn-especial" type="button" class="btn" @click="atacarEspecial">Ataque especial<img
          src="https://img.icons8.com/dusk/30/000000/sword.png" /></button>
      <button id="btn-curar" type="button" class="btn" @click="curarJogador">Curar<img
          src="https://img.icons8.com/ios-glyphs/30/000000/hand-with-a-pill.png" /></button>
      <button id="btn-desistir" type="button" class="btn" @click="desistir">Desistir</button>
    </div>
    <div v-else>
      <button id="btn-iniciar" type="button" class="btn" @click="iniciar">Iniciar nova partida</button>
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
        }
      }
    },
    methods: {
      vezJogadorAtacar(especial) {
        if (this.jogador.vida != 0) {
          let minimo = 0
          let maximo = 0
          if (especial) {
            minimo = this.jogador.ataque.especial.minimo
            maximo = this.jogador.ataque.especial.maximo
          } else {
            minimo = this.jogador.ataque.normal.minimo
            maximo = this.jogador.ataque.normal.maximo
          }

          // O monstro perde vida baseada no valor máximo e minimo de ataque do jogador
          let forcaAtaque = this.getValorRandom(minimo, maximo)

          if ((this.monstro.vida - forcaAtaque) < 0) {
            this.monstro.vida = 0
          } else {
            this.monstro.vida -= forcaAtaque
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
          let minimo = this.monstro.ataque.minimo
          let maximo = this.monstro.ataque.maximo

          // O jogador perde vida baseada no valor máximo e minimo de ataque do monstro
          let forcaAtaque = this.getValorRandom(minimo, maximo)

          if ((this.jogador.vida - forcaAtaque) < 0) {
            this.jogador.vida = 0
          } else {
            this.jogador.vida -= forcaAtaque
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
        this.verificarVencedor
      },
      atacarEspecial() {
        let danoDoJogador = this.vezJogadorAtacar(true)
        this.setAcao('dano', 'monstro', danoDoJogador)

        let danoDoMonstro = this.vezMonstroAtacar()
        this.setAcao('dano', 'jogador', danoDoMonstro)
        this.verificarVencedor
      },
      curarJogador() {
        let curaDoJogador = this.vezJogadorCurar()
        this.setAcao('cura', 'jogador', curaDoJogador)

        let danoDoMonstro = this.vezMonstroAtacar()
        this.setAcao('dano', 'jogador', danoDoMonstro)
        this.verificarVencedor
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
  
</style>