import './App.css'
import Home from './pages/Home'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Layout from './pages/Layout'
import Productlist from './pages/productlist'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import { AuthProvider } from './context/AuthContext'
function App() {

  const router = createBrowserRouter([
    {
      path:'/',
      element:<Layout/>,
      children: [
        {
          path:'/',
          element:<Home/>
        },
        {
          path:'/productlist',
          element:<Productlist/>
        },
        {
          path :'/productdetail/:id',
          element:<ProductDetail/>
        },
        {
          path : "/cart",
          element : <Cart/>
        },
        {
          path : "/login",
          element : <Login/>
        },
        {
          path : "/register",
          element : <Register/>
        },
        {
          path : "/profile",
          element : <Profile/>
        }
      ]
    }
  ])

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
