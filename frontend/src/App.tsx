import { BrowserRouter, Route, Routes } from "react-router"
import { Management } from "./pages/Management"
import { ArticleEdit } from "./pages/ArticleEdit"
import { ArticleOverview } from "./pages/ArticleOverview"
import { Analytics } from "./pages/Analytics"
import ChangePassword from "./pages/ChangePassword"
import Login from "./pages/Login"
import Test from "./pages/Test"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="new-article" element={<ArticleEdit />} />
        <Route path="edit/:id" element={<ArticleEdit />} />
        <Route path="login" element={<Login />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="/" element={<ProtectedRoute> <Management /> </ProtectedRoute>}>
          <Route index element={<ArticleOverview />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        <Route path="test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
