export default function({store, redirect, route}) {
  if(route.path.toLowerCase() === '/cart') {
    return redirect('/?cart=true')
  }
}