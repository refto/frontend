export default function({ $axios, store, route, redirect }) {
  $axios.onRequest((config) => {
    config.headers.common['X-Client'] = 'refto.dev Vue Client'

    if (store.state.auth) {
      config.headers.common.Authorization = 'Bearer ' + store.state.auth.token
    }
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)

    if (code === 401) {
      store.commit('setAuth', null)

      if (route.name !== '/') {
        redirect('/')
      }
    }
  })
}
