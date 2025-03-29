import React, { useState } from 'react'
import { LuEye, LuEyeClosed } from "react-icons/lu";
import image from "../assets/test.png"
import { Link, useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import axios from "axios"
import SideBar from "../components/SideBar"
import { useAuth } from '../utils/AuthContext'
import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
  const nav = useNavigate()
  const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setIsAuthenticated } = useAuth()
  const login = useGoogleLogin({
    onSuccess: async (TokenResponse) => {
      try {
        const response = await axios.post(`http://localhost:${import.meta.env.VITE_PORT}/api/auth/google`, {
          token: TokenResponse.access_token
        })
        localStorage.setItem("token", response.data.token)
        setIsAuthenticated(true)
        notyf.success("Logged in successfully with Google!")
        nav("/main")
      } catch (error) {
        console.error("Google login error:", error)
        notyf.error("Google login failed. Please try again.")
      }
    },
    onError: () => {
      notyf.error("Google login was cancelled or failed.")
    }
  })

  const handleLogin = async (e) => {
    e.preventDefault()

    // Check if all fields are filled
    if (!email || !password) return notyf.error("All fields are required. Please fill them in.")

    // Check if email is valid
    if (!email.includes("@")) return notyf.error("Please enter a valid email address.")

    // Checking if password is valid
    if (password.length < 8 || password.length > 20) return notyf.error("Your password must be between 8 and 20 characters long.")

    try {
      const response = await axios.post(`http://localhost:${import.meta.env.VITE_PORT}/api/auth/`, {
        email,
        password
      })
      console.log(response.data)
      localStorage.setItem("token", response.data.token)
      setIsAuthenticated(true)
      notyf.success("Login successful! Redirecting...")
      nav("/main")
    } catch (error) {
      console.error("Login error:", error)
      if (error.response.status === 401) return notyf.error("Invalid email or password. Please try again.")
      notyf.error("Something went wrong. Please try again later.")
    }
  }

  return (
    <div className='bg-gray-200 min-h-screen flex flex-col'>
      <SideBar />
      <div className='flex flex-grow items-center justify-center'>
        <div className='lg:bg-gray-50 bg-gray-200 flex flex-row rounded-2xl lg:shadow-2xl max-w-4xl p-5 items-center'>

          {/* inputs & buttons */}
          <div className='md:w-1/2 px-16'>
            <h2 className='text-2xl font-bold text-blue-900'>Login</h2>
            <p className='text-sm mt-4 text-blue-900'>If you are already a member, easily log in.</p>

            {/* inputs */}
            <form onSubmit={handleLogin} className='flex flex-col gap-4'>
              <input onChange={(e) => { setEmail(e.target.value) }} className='p-2 mt-4 rounded-xl bg-white border-1 border-blue-500' type="email" placeholder='Email' />
              <span className='relative'>
                <input onChange={(e) => { setPassword(e.target.value) }} className='p-2 mt-4 rounded-xl bg-white w-full border-1 border-blue-500' type={isPasswordVisible ? "text" : "password"} placeholder='Password' />
                <button onClick={() => { !isPasswordVisible ? setIsPasswordVisible(true) : setIsPasswordVisible(false) }} className='absolute top-1/2 right-3' type="button">
                  {isPasswordVisible ? <LuEyeClosed className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300' /> :
                    <LuEye className='text-gray-400 cursor-pointer active:text-black active:scale-115 duration-300' />}
                </button>
              </span>
              <button type='submit' className='bg-blue-900 rounded-xl text-white py-2 w-full mt-5 cursor-pointer hover:scale-105 active:scale-95 duration-300'>Login</button>
            </form>


            {/* Seperator */}
            <div className='my-5 grid grid-cols-3 items-center text-gray-500'>
              <hr className='border-gray-500' />
              <p className='text-center text-sm'>OR</p>
              <hr className='border-gray-500' />
            </div>

            {/* Login with Google */}
            <button onClick={() => login()} className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-white text-gray-800 font-semibold hover:scale-105 active:scale-95 duration-300 cursor-pointer border border-gray-300">
              <img src="google-icon.svg" className="w-5 h-5" alt="google" />
              Continue with Google
            </button>

            {/* Register */}
            <div className='mt-5 text-sm flex justify-between items-center'>
              <p>Don't have an account...</p>
              <Link to={"/register"} className='py-2 px-5 bg-blue-900 text-white rounded-xl cursor-pointer hover:scale-110 active:scale-95 duration-300'>Register</Link>
            </div>

            {/* Reset Password */}
            <div className='mt-5 text-sm flex justify-between items-center'>
              <p>Forgot your password?</p>
              <Link to="/reset" className='py-2 px-5 bg-white rounded-xl cursor-pointer hover:scale-110 active:scale-95 duration-300  border border-gray-200'>Reset</Link>
            </div>
          </div>

          {/* img */}
          <div className='w-1/2 md:block hidden'>
            <img className='rounded-2xl max-w-full' src={image} />
          </div>
        </div>
      </div>
    </div >
  )
}
