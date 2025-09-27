import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login'
import AuthGuard from './AuthGuard'
import isLoggedIn from './hooks/auth'
import ArticleAdmin from './pages/ArticleAdmin'

// const queryClient = new QueryClient();

function App() {
  const loggedIn = isLoggedIn();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AuthGuard loggedIn={loggedIn} >
              <ArticleAdmin />
            </AuthGuard>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/bad" element={<div>bad</div>} />
        </Routes>
      </BrowserRouter>
      {/* <QueryClientProvider client={queryClient}>
      </QueryClientProvider> */}
    </div>
  )
}

export default App
