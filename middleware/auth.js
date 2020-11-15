const protectedRoutes = [

]

export default function({ store, route, redirect }) {
  if (!protectedRoutes.includes(route.name)) return

  if (!store.state.auth) {
    return redirect('/')
  }
}
