import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Main from './pages/Main'
import AuthGuard from './AuthGuard'
import isLoggedIn from './hooks/auth'

function App() {
  const loggedIn = isLoggedIn();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AuthGuard loggedIn={loggedIn} >
              <Main />
            </AuthGuard>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/bad" element={<div>bad</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
