export const state = () => ({
  menuVisible: false
})

export const mutations = {
  openMenu(state) {
    state.menuVisible = true
  },

  closeMenu(state) {
    state.menuVisible = false
  },

  toggleShowMenu(state) {
    state.menuVisible = !state.menuVisible
  },

  disableMenu(state) {
    state.menuVisible = false
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
