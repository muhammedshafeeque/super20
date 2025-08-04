
import './App.css'

import { Routes, Route } from 'react-router-dom'
import { ROUTES } from './Constants/Routes'
import Login from './Pages/Auh/Login/Login'
import Home from './Pages/Home/Home'
import { Layout } from './Components/Layout/Layout'
import { useAuth } from './Context/AuthContext'
import UserRoles from './Pages/Auh/UserRoles/UserRoles'

function App() {
  const { user } = useAuth();
        
  return (
    <>
      <Routes>
        {user ? (
          <Route path="/*" element={
            <Layout >
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.USER_ROLES} element={<UserRoles />} />
              </Routes>
            </Layout>
          } />
        ) : (
          <>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path="/" element={<Login />} />
          </>
        )}
      </Routes>
    </>
  )
}

export default App
