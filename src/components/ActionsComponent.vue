<template>
  <section id="acoes" class="espacar centralizar">
    <div class="centralizar" v-if="statusPartida.emAndamento">
      <button id="btn-atacar" type="button" class="btn" @click="atacarNormal">
        Ataque
        <img src="https://img.icons8.com/ios-glyphs/30/000000/sword.png" />
      </button>
      <div class="special-attacks">
        <button 
          v-for="special in this.jogador.pokemon.info.special_attacks" 
          :key="special.name"
          @click="atacarEspecial"
          type="button" 
          class="btn btn-especial">
            {{ special.name }}
          <img src="https://img.icons8.com/dusk/30/000000/sword.png" />
        </button>
      </div>
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
      O cálculo do sucesso de acerto do golpe leva em consideração as velocidades dos pokemons.
      */
      getHitSuccessfully(origin, target) {
        let speedOrigin = origin.pokemon.base_status.speed
        let speedTarget = target.pokemon.base_status.speed
        let isHitted = false

        let speedDifference = Math.round(speedOrigin - speedTarget)
        let randomNumber = this.getValorRandom(1,100)

        // Quando os speeds dos dois pokemons são iguais, a chance de acerto do hit é de 50%.
        if (speedDifference == 0) {
          isHitted = randomNumber >= 50
        } else if (speedDifference > 0) {

          // Quando o agressor é mais RÁPIDO, MAS MENOS DE 2x, o alvo tem 75% de ser atingido.
          if (speedDifference * 2 < speedTarget) {
            isHitted = randomNumber < 75

          // Quando o agressor é mais RÁPIDO, E MAIS DE 2x, o alvo tem 95% de ser atingido.
          } else {
            isHitted = randomNumber < 95
          }
        } else {

          // Quando o agressor é mais LENTO, MAS MENOS DE 2x, o alvo tem 25% de ser atingido.
          if (Math.abs(speedDifference) * 2 < speedOrigin) {
            isHitted = randomNumber > 75

          // Quando o agressor é mais LENTO, E MAIS MENOS DE 2x, o alvo tem 5% de ser atingido.
          } else {
            isHitted = randomNumber > 95
          }
        }
        return isHitted
      },
      // taxCritical é o valor máximo do intervalo para ser considerado um DANO CRÍTICO
      // taxHigh é o valor máximo do intervalo para ser considerador um DANO ALTO
      getDamage(attack = 1, taxCritical = 5, taxHigh = 25) {
        // Número randômico para o tipo de dano, uma chance (%) para acontecer um tipo de dano.
        let baseNumber = this.getValorRandom(1, 100)
        let min = 0
        let max = 0
        let logDamage = {damage: 0, type: ''}

        // Parâmetros para DANO CRÍTICO
        if (baseNumber <= taxCritical) {

          // O menor valor será 75% do valor do ataque.
          min = 0.76

          // O maior valor possível será 100% do valor do ataque.
          max = attack

          logDamage.type = 'crítico'

        // Parâmetros para DANO ALTO
        } else if (baseNumber > taxCritical && baseNumber <= taxHigh) {

          // O menor valor será 50% do valor do ataque.
          min = 0.26

          // O maior valor possível será 75% do valor do ataque.
          max = attack * 0.75

          logDamage.type = 'alto'

        // Parâmetros para DANO NORMAL
        } else {

          // O menor valor será 1% do valor do ataque
          min = 0.1

          // O maior valor possível será 50% do valor do ataque
          max = attack * 0.25
        }

        logDamage.damage = this.getValorRandom((attack * min), max)
        return logDamage
      },
      reducedDamage(pokemon, target) {
        let damage = 0
        /*
        Quanto o ataque representa (%) na defesa do alvo. 
        Por exemplo:
        Atacante tem ATAQUE de 40
        Alvo tem DEFESA de 50
        40 é 80% da defesa.
        Ou seja, o DANO FINAL SERÁ REDUZIDO EM 20%.
        */
        let representativePercentage = (pokemon.attack * 100) / target.defense

        let attack = this.getDamage(pokemon.attack).damage

        // O dano é redurizo, com base na diferença porcentual entre ataque do atacante e defesa do alvo.
        damage = (attack * representativePercentage) / 100

        return damage
      },
      giveDamage(pokemon, target) {
        let logDamage = { damage: 0, type: ''}

        // Se o atacante tiver um attack menor que a defesa do alvo, então seu dano é reduzido.
        if (pokemon.base_status.attack < target.defense) {
          logDamage.damage = Math.round(this.reducedDamage(pokemon.base_status, target.base_status))
        } else {
          let log = this.getDamage(pokemon.base_status.attack)
          logDamage.damage = Math.round(log.damage)
          logDamage.type = log.type
        }
        if (target.life - logDamage.damage <= 0) {
          target.life = 0
        } else {
          target.life -= logDamage.damage
        }
        return logDamage
      },
      atacarNormal() {
        let logDanoDoJogador = this.giveDamage(this.jogador.pokemon, this.monstro.pokemon)
        this.setAcao(logDanoDoJogador.type, 'monstro', logDanoDoJogador.damage)
        this.verificarVencedor()

        let logDanoDoMonstro = this.giveDamage(this.monstro.pokemon, this.jogador.pokemon)
        this.setAcao(logDanoDoMonstro.type, 'jogador', logDanoDoMonstro.damage)
        this.verificarVencedor()
      },
      atacarEspecial() {
        let danoDoJogador = this.vezJogadorAtacar(true)
        this.setAcao('dano', 'monstro', danoDoJogador)

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
            let withType = `O ${ destino } recebeu ${ valor } de dano [${ tipo.toUpperCase() }].`
            let noType = `O ${ destino } recebeu ${ valor } de dano.`
            mensagem = tipo ?  withType : noType
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
      /*
        A capacidade de recuperação é baseada na experiencia do Pokemon
      */
      setMinMaxRecovery() {
        this.jogador.cura.capacidadeMinima = Math.round(this.jogador.experience / 10)
        this.jogador.cura.capacidadeMaxima = Math.round((this.jogador.experience / 10) * 2)
      },
      setIniciarPartida() {
        this.jogador = this.player
        this.monstro = this.npc
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
        if (this.jogador.pokemon.life == 0 && this.monstro.pokemon.life == 0) {
          this.setFinalizarPartida('empatou', 'Houve empate!!')
        } else if (this.jogador.pokemon.life == 0) {
          this.setFinalizarPartida('perdeu', 'Você perdeu :(')
        } else if (this.monstro.pokemon.life == 0) {
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

<style scoped>
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

  .btn-especial {
    background-color: #3399ff;
    border-color: #3399ff;
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

  #acoes {
    margin-top: 20px;
    box-shadow: 0px 0px 5px #ffffff;
    width: 100%;
  }
  
  #acoes div {
    display: flex;
    align-items: flex-start;
  }
  
  #acoes .btn:last-child {
    margin-right: 0px;
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