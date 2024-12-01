import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import LogInPage from "./pages/auth/LogInPage.jsx";

function App() {
  return (
    <div>
      {/* Simple Navigation Bar */}
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
          <li><Link to="/login">Log In</Link></li>
        </ul>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
      </Routes>
    </div>
  );
}

export default App;
