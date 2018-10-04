import Vue from 'vue';
import 'es6-promise/auto';
import Vuex from 'vuex';

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {},
  strict: debug
})
