import { createStore } from 'vuex';

export default createStore({
  state: {
    level: 10,
  },
  getters: {
    getLevel(state) {
      return state.level;
    },
  },
  mutations: {
    SET_LEVEL(state, val) {
      state.level = val;
    },
  },
  actions: {},
  modules: {},
});
