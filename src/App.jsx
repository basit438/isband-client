import './App.css'
import Home from './pages/Home'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Layout from './pages/Layout'
import Productlist from './pages/Productlist'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import { AuthProvider } from './context/AuthContext'
import CreateProduct from './pages/CreateProduct'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import About from './pages/About'
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
        },
        {
          path : "/create-product",
          element : <CreateProduct/>
        },
        {
          path : "/Wishlist",
          element : <Wishlist/>
        },
        {
          path : "/checkout",
          element : <Checkout/>
        },
        {
          path : "contact",
          element : <Contact/>
        },
        {
          path : "blog",
          element : <Blog/>
        },
        {
          path : "about",
          element : <About/>
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
