import Vue from 'vue'
import Vuex from 'vuex'
import management from './modules/management'
import user from './modules/user'

Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    management,
    user
  }
})