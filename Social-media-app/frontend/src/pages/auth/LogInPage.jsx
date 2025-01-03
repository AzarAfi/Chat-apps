import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import { FaUser } from "react-icons/fa";
import {  MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../constant/url";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";


const LogInPage = () => { 
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const queryClient = useQueryClient()
  const { mutate:logIn, isPending, isError, error } = useMutation({
    mutationFn: async ({  username, password }) => {
      try {
        const res = await fetch(`${baseURL}/api/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({username, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("login successfully")

      // rediract the home page
      queryClient.invalidateQueries(
        {
          queryKey:["authUser"]
        }
      )
    },
  });

 

  const handleSubmit = (e) => {
    e.preventDefault();
    logIn(formData)
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <Logo className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <Logo className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>

          {/* Username Field */}
          <label className="input input-bordered rounded flex items-center gap-2">
          <FaUser />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
              required
            />
          </label>

          {/* Password Field */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              required
            />
          </label>

          {/* Submit Button */}
          <button className="btn rounded-full btn-primary text-white">
          {isPending ? <LoadingSpinner/> : "LogIn"}
          </button>

          {/* Error Message */}
          {isError && <p className="text-red-500">{error.message || "An error occurred"}</p>}
        </form>

        {/* Sign-up Redirect */}
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
