import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login'
import AuthGuard from './AuthGuard'
import isLoggedIn from './hooks/auth'
import ArticleAdmin from './pages/ArticleAdmin'
import Unauthorized from './pages/Unauthorized'

function App() {
  const loggedIn = isLoggedIn();

  return (
    <div className='bg-background'>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={
            <AuthGuard loggedIn={loggedIn} >
              <ArticleAdmin />
            </AuthGuard>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
