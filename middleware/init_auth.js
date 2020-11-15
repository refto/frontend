// this a dirty hack
// to load auth creds from localstorage to vue store only once and before auth check
// idk how to do better
// @todo

let authLoaded = false

export default ({ store }) => {
  if (authLoaded) {
    return
  }

  store.commit('initAuth')
  authLoaded = true
}
