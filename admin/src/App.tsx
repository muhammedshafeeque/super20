
import './App.css'

import { Routes, Route } from 'react-router-dom'
import { ROUTES } from './Constants/Routes'
import { lazy, Suspense } from 'react';

const Login = lazy(() => import('./Pages/Auh/Login/Login'));
const Home = lazy(() => import('./Pages/Home/Home'));

const UserRoles = lazy(() => import('./Pages/Auh/UserRoles/UserRoles'));
import { useAuth } from './Context/AuthContext';
import { Layout } from './Components/Layout/Layout';

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
