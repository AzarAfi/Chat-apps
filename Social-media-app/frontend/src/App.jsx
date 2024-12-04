import { Routes, Route, Link, Navigate } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import LogInPage from "./pages/auth/LogInPage.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import RightPanel from "./components/common/RightPanal.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import {Toaster} from "react-hot-toast"
import { useQuery } from "@tanstack/react-query";
import { baseURL } from "./constant/url.js";
import LoadingSpinner from "../src/components/common/LoadingSpinner.jsx";

function App() {
  const { data:authUser,isLoading } = useQuery({
    queryKey:["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`${baseURL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          
        });

        const data = await res.json();
        if(data.error){
          return null
        }
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong"); 
        }
      
        console.log("authuser",data)
        return data;

        
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
   retry:false
  }
);
console.log(authUser)

  if(isLoading){
    return(
      <div className="flex justify-center items-center w-screen h-screen">
        <LoadingSpinner size="xl"/>
      </div>
    )
  }

  
  return (
    <div className="flex max-w-10xl mx-auto">
 
        {authUser&&<Sidebar/>}

      {/* Routes */}
      <Routes>
        <Route path="/" element={authUser?<HomePage />:<Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser?<SignUpPage />:<Navigate to="/"/>} />
        <Route path="/login" element={!authUser?<LogInPage />:<Navigate to="/"/>} />
        <Route path="/notification" element={authUser?<NotificationPage/>:<Navigate to="/login"/>}/>
        {/* <Route path="/profile:username" element={authUser&&<ProfilePage/>}/> */}
      </Routes>
         {authUser&&<RightPanel/>}
    <Toaster/>
    </div>
  );
}

export default App;
