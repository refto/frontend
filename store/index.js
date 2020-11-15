export const state = () => {
  return {
    auth: null,
  }
}

export const mutations = {
  initAuth(state) {
    if (process.browser && localStorage.getItem('auth')) {
      state.auth = JSON.parse(localStorage.getItem('auth'))
    }
  },

  setAuth(state, auth) {
    state.auth = auth
    localStorage.setItem('auth', JSON.stringify(auth))
  },
}

export const getters = {}
export const actions = {}
