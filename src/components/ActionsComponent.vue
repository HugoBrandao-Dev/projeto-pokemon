<template>
  <section id="acoes" class="espacar centralizar">
    <AlertComponent @alert="setAlert($event)" />
    <div class="centralizar" v-if="statusPartida.emAndamento">
      <button id="btn-atacar" type="button" class="btn" @click="atacarNormal">
        Ataque
        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/sword.png" />
      </button>
      <div class="special-attacks">
        <button 
          v-for="special in this.jogador.pokemon.info.special_attacks" 
          :key="special.name"
          @click="atacarEspecial"
          type="button" 
          class="btn btn-especial"
          :title="special.effect">
            {{ special.name | formatSpecialAttackName }}
          <img src="https://img.icons8.com/dusk/30/000000/sword.png" />
        </button>
      </div>
      <button id="btn-desistir" type="button" class="btn" @click="desistir">
        Desistir
        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/exit.png" />
      </button>
    </div>
    <div v-else>
      <button v-if="user.hasUser" type="button" class="btn btn-iniciar" :disabled="!startable" @click="iniciar">
        Iniciar nova partida
      </button>
      <button v-else type="button" class="btn btn-iniciar-wait" :disabled="!startable">
        Faça login...
      </button>
    </div>
  </section>
</template>

<script>
  import AlertComponent from './AlertComponent'
  import axios from 'axios'

  const axios_database = axios.create({
    baseURL: 'http://localhost:4000'
  })

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
        logAcoes: [],
        myWindow: {}
      }
    },
    components: {
      AlertComponent
    },
    props: {
      user: Object,
      player: Object,
      npc: Object,
      statusMatch: Object,
      logActions: Array,
      startable: Boolean,
    },
    filters: {
      formatSpecialAttackName(name) {
        return name.split('-').join(' ')
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
      setAlert($event) {
        this.myWindow = $event.myWindow
      },
      setStatusPartida(emAndamento = false, mostrarResultado = false, status = '', mensagem = '', treinVencedor, pokeVencedor) {
        this.statusPartida.emAndamento = emAndamento
        this.statusPartida.mostrarResultado = mostrarResultado
        this.statusPartida.status = status
        this.statusPartida.mensagem = mensagem
        this.statusPartida.vencedores.treinador = treinVencedor
        this.statusPartida.vencedores.pokemon = pokeVencedor
      },
      setMyWindow(type, title, content, execFunction) {
        this.myWindow.type = type
        this.myWindow.title = title
        this.myWindow.content = content
        this.myWindow.response.execFunction = execFunction
      },
      /*
      O cálculo do sucesso de acerto do golpe leva em consideração as velocidades dos pokemons.
      */
      getHitSuccessfully(pokemon, target) {
        let pokemonTotalSpeed = pokemon.base_status.speed + pokemon.plus_status.speed
        let targetTotalSpeed = target.base_status.speed + target.plus_status.speed
        let isHitted = false

        let speedDifference = Math.round(pokemonTotalSpeed - targetTotalSpeed)
        let randomNumber = this.getValorRandom(1,100)

        // Quando os speeds dos dois pokemons são iguais, a chance de acerto do hit é de 50%.
        if (speedDifference == 0) {
          isHitted = randomNumber >= 50
        } else if (speedDifference > 0) {

          // Quando o agressor é mais RÁPIDO, MAS MENOS DE 2x, o alvo tem 75% de ser atingido.
          if (speedDifference * 2 < targetTotalSpeed) {
            isHitted = randomNumber < 75

          // Quando o agressor é mais RÁPIDO, E MAIS DE 2x, o alvo tem 95% de ser atingido.
          } else {
            isHitted = randomNumber < 95
          }
        } else {

          // Quando o agressor é mais LENTO, MAS MENOS DE 2x, o alvo tem 25% de ser atingido.
          if (Math.abs(speedDifference) * 2 < pokemonTotalSpeed) {
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
        let representativePercentage = (pokemon.base_status.attack * 100) / target.base_status.defense

        let attack = this.getDamage(pokemon.base_status.attack).damage

        // O dano é redurizo, com base na diferença porcentual entre ataque do atacante e defesa do alvo.
        damage = (attack * representativePercentage) / 100

        return damage
      },
      giveDamage(pokemon, target) {
        let logDamage = { damage: 0, type: ''}
        let attackTotal = pokemon.base_status.attack + pokemon.plus_status.attack
        let defenseTotal = target.base_status.defense + target.plus_status.defense

        // Se o atacante tiver um attack menor que a defesa do alvo, então seu dano é reduzido.
        if (attackTotal < defenseTotal) {
          logDamage.damage = Math.round(this.reducedDamage(pokemon, target))
        } else {
          let log = this.getDamage(attackTotal)
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
        if (this.getHitSuccessfully(this.jogador.pokemon, this.monstro.pokemon)) {
          let logDanoDoJogador = this.giveDamage(this.jogador.pokemon, this.monstro.pokemon)
          this.setAcao(logDanoDoJogador.type, 'monstro', logDanoDoJogador.damage)
        } else {
          this.setAcao('desviou', 'monstro', 0)
        }

        if (this.getHitSuccessfully(this.monstro.pokemon, this.jogador.pokemon)) {
          let logDanoDoMonstro = this.giveDamage(this.monstro.pokemon, this.jogador.pokemon)
          this.setAcao(logDanoDoMonstro.type, 'jogador', logDanoDoMonstro.damage)
        } else {
          this.setAcao('desviou', 'jogador', 0)
        }
        
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
        let mensagem = ''
        let pokemonDestino = this[destino].pokemon.info.specie
        let pokemonDestinoUpper = pokemonDestino.toUpperCase()

        if (valor != 0) {          
          if (tipo == 'cura') {
            mensagem = `Você curou ${valor}.`
          } else {
            let withType = `O ${ pokemonDestinoUpper } recebeu ${ valor } de dano [${ tipo.toUpperCase() }].`
            let noType = `O ${ pokemonDestinoUpper } recebeu ${ valor } de dano.`
            mensagem = tipo ?  withType : noType
          }
        } else {
          mensagem = `O(a) ${ pokemonDestinoUpper } desviou.`
        }
        this.logAcoes.unshift({
          id: `${destino}${Date.now()}${tipo}`,
          destino,
          tipo,
          mensagem
        })
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
        this.setStatusPartida(true, false, '', '', '', '')
      },
      async saveFruitsAmounts() {
        try {
          let resFruits = await axios_database.post('/user/fruits/update', {
            'jaboca-berry': `${ this.jogador.items.fruits['jaboca-berry'] }`,
            'razz-berry': `${ this.jogador.items.fruits['razz-berry'] }`,
            'bluk-berry': `${ this.jogador.items.fruits['bluk-berry'] }`
          }, this.getAuth())
          if (resFruits.data.errorField) {
            console.error(resFruits.data.msg)
          }
        } catch (error) {
          console.error(error)
        }
      },
      async saveBattleStatus() {
        try {
          let resPokemon = await axios_database.get(`/user/pokemon/${ this.jogador.pokemon.info.id }`, this.getAuth())
          if (resPokemon.data.errorField) {
            console.log(resPokemon.data.msg)
          }

          let { id, specie, evolution_id, experience_plus, battles, battles_won } = resPokemon.data

          let resPokemonUpdated = await axios_database.post('/upgradePokemon', {
            id: `${ id }`,
            specie: `${ specie }`,
            evolution_id: `${ evolution_id }`,
            experience_plus: `${ experience_plus }`,
            battles: `${ ++battles }`,
            battles_won: `${ this.statusPartida.status == 'ganhou' ? ++battles_won : battles_won }`,
          }, this.getAuth())

          if (resPokemonUpdated.data.errorField) {
            console.log(resPokemon.data.msg)
          }

        } catch (error) {
          console.error(error)
        }
      },
      setFinalizarPartida(status = 'desistiu', mensagem = 'Você desistiu', treinVencedor, pokeVencedor) {
        this.saveFruitsAmounts()
        this.setStatusPartida(false, true, status, mensagem, treinVencedor, pokeVencedor)
        this.saveBattleStatus()
        this.logAcoes = []
      },
      async getFruitsDrop() {
        let dropFruits = []
        // [5 - 7] são valores hardcoded do valor dos IDs das frutas no BD.
        for (let cont = 5; cont <= 7; cont++) {
          let resFruit = await axios_database.get(`/fruits/dropRate/${ cont }`, this.getAuth())
          let { rate, amount } = resFruit.data
          dropFruits.push({ rate, amount })
        }

        return dropFruits
      },
      async saveDropFruits(fruitsInfo) {
        let drops = []

        for (let info of fruitsInfo) {
          drops.push({
            dropped: Math.random() <= info.rate,
            amount: this.getValorRandom(1, info.amount)
          })
        }

        let content = [
          drops[0].dropped ? `${ drops[0].amount } x Jaboca Berry` : '',
          drops[1].dropped ? `${ drops[1].amount } x Razz Berry` : '',
          drops[2].dropped ? `${ drops[2].amount } x Bluk Berry` : ''
        ]

        this.setMyWindow('info', 'Drops', content, null)

        let jaboca_berry = this.jogador.items.fruits['jaboca-berry']
        let razz_berry = this.jogador.items.fruits['razz-berry']
        let bluk_berry = this.jogador.items.fruits['bluk-berry']

        await axios_database.post('/user/fruits/update', {
          'jaboca-berry': `${ drops[0].dropped ? jaboca_berry + drops[0].amount : jaboca_berry }`,
          'razz-berry': `${ drops[1].dropped ? razz_berry + drops[1].amount : razz_berry }`,
          'bluk-berry': `${ drops[2].dropped ? bluk_berry + drops[2].amount : bluk_berry }`
        }, this.getAuth())
      },
      async getCoinsDrop() {
        let dropCoins = []
        // [8 - 10] são valores hardcoded do valor dos IDs das moedas no BD.
        for (let cont = 8; cont <= 10; cont++) {
          let resCoin = await axios_database.get(`/coins/dropRate/${ cont }`, this.getAuth())
          let { rate, amount } = resCoin.data
          dropCoins.push({ rate, amount })
        }

        return dropCoins
      },
      async verificarVencedor() {
        if (this.jogador.pokemon.life == 0 && this.monstro.pokemon.life == 0) {
          this.setFinalizarPartida('empatou', 'Houve empate!', 'n/a', 'n/a')
        } else if (this.jogador.pokemon.life == 0) {
          this.setFinalizarPartida('perdeu', 'Você perdeu :(', this.monstro.name, this.monstro.pokemon.info.specie)
        } else if (this.monstro.pokemon.life == 0) {
          this.setFinalizarPartida('ganhou', "Você venceu! \\o/", this.jogador.name, this.jogador.pokemon.info.specie)
          let infoFruitDrops = await this.getFruitsDrop()
          let infoCoinDrops = await this.getCoinsDrop()
          console.log(infoCoinDrops)
          this.saveDropFruits(infoFruitDrops)
          this.$emit('increaseExp')
        }
      },
      desistir() {
        this.setMyWindow('error', 'Deseja realmente sair?', [], this.setFinalizarPartida)
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

  .btn-iniciar {
    background-color: #33cc33;
    color: #fff;
    border-color: #33cc33;
  }

  .btn-iniciar-wait {
    border-style: solid;
    background-color: #47476b;
    color: #33cc33;
  }

  #btn-iniciar:disabled {
    background-color: #b3b3b3;
    border-color: #b3b3b3;
    cursor: wait;
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