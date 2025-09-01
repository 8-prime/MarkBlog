import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login'
import Main from './pages/Main'
import AuthGuard from './AuthGuard'

function App() {
  const [count, setCount] = useState(0)


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <AuthGuard>
            <Main />
          </AuthGuard>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/bad" element={<div>bad</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
