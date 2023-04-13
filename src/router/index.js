import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/HomeComponent.vue'
import Account from '../components/AccountComponent.vue'

import axios from 'axios'

function AdminAuth(to, from, next ) {
  if(localStorage.getItem('PokemonUserToken')) {
    let auth = {
      headers: {
        Authorization: `Bearer ${ localStorage.getItem('PokemonUserToken') }`
      }
    }

    // Faz a validação do token passado
    axios.get('http://localhost:4000/validate', auth)
      .then(res => {
        if (res.data.errorField) {
          console.log(res.data.msg)
          next('/')
        } else {
          next()
        }
      })
      .catch(error => {
        console.log(error)
        next('/')
      })
  } else {
    console.log('Login necessário.')
    // Caso não seja encontrado o token, o usuário será redirecionado para a tela de login.
    next('/')
  }
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    beforeEnter: AdminAuth
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router