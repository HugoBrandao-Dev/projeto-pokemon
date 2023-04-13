import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../App.vue'

/*
import axios from 'axios'

function AdminAuth(to, from, next ) {
  if(localStorage.getItem('PokemonUserToken')) {
    let req = {
      headers: {
        Authorization: `Bearer ${ localStorage.getItem('PokemonUserToken') }`
      }
    }

    // Faz a validação do token passado
    axios.post('http://localhost:4000/validate',{}, req)
      .then(res => {
        console.log(res)
        next()
      })
      .catch(error => {
        console.log(error)
        next('/')
      })

    // Prossegue com a requisição, caso encontre o token no localStorage
    next()
  } else {
    console.log('Token não encontrado.')
    // Caso não seja encontrado o token, o usuário será redirecionado para a tela de login.
    next('/')
  }
}
*/

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router