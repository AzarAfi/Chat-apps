import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import LogInPage from "./pages/auth/LogInPage.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanal.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import {Toaster} from "react-hot-toast"

function App() {
  return (
    <div className="flex max-w-10xl mx-auto">
 
    <Sidebar/>
      {/* Routes */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/notification" element={<NotificationPage/>} />
      </Routes>
    <RightPanel/>
    <Toaster/>
    </div>
  );
}

export default App;
