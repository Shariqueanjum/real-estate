import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from  './pages/Home'
import Profile from './pages/Profile'
import About from  './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import { Outlet } from 'react-router-dom'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'

const App = () => {
  return (
   <BrowserRouter>
      
      <Header />
     
     <Routes>
          <Route path="/"         element={ <Home />  }   />
          <Route path="/sign-in"  element={ <SignIn />} />
          <Route path="/sign-up"  element={ <SignUp />} />
          <Route path="/about"  element={ <About />}   />
          <Route
             path="/profile"
             element={
                <PrivateRoute component={Profile} /> 
             }
          />

          <Route
             path="/create-listing"
             element={
                <PrivateRoute component={CreateListing} /> 
             }
          />

          <Route 
             path='/update-listing/:id'
             element={
                <PrivateRoute component={UpdateListing} />
             }
          
          />

         

     </Routes>
   
   </BrowserRouter>
  )
}

export default App
