import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import Round2LoginPage from "./pages/Round2LoginPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/round2" element={<Round2LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}
