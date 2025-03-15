"use client"

import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/Authcontext"
import { useNavigate, useLocation, Link } from "react-router-dom"
import "../style/Login.css"
import api from "../api/config"

const Login = () => {
  const { login, user, setUserAndToken } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showOtpForm, setShowOtpForm] = useState(false)
  const [otp, setOtp] = useState("")
  const [loginMethod, setLoginMethod] = useState("password") // "password" or "otp"
  const [redirectMessage, setRedirectMessage] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  // Check for redirect parameters
  useEffect(() => {
    // Check for redirect in query params
    const params = new URLSearchParams(location.search)
    const redirectPath = params.get("redirect")

    // Check for message in location state
    const message = location.state?.message

    if (message) {
      setRedirectMessage(message)
    } else {
      // Clear any previous redirect message if there's no message in the state
      setRedirectMessage("")
    }

    // Store the redirect path in session storage
    if (redirectPath) {
      sessionStorage.setItem("redirectAfterLogin", redirectPath)
    }
  }, [location])

  // If user is already logged in, redirect to Dashboard or the redirect path
  useEffect(() => {
    if (user) {
      const redirectPath = sessionStorage.getItem("redirectAfterLogin")
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin")
        navigate(redirectPath)
      } else {
        navigate("/")
      }
    }
  }, [user, navigate])

  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    if (isSubmitting) return // Prevent multiple submissions

    setIsSubmitting(true)
    setError("")

    try {
      // Convert email to lowercase before sending
      const userData = { email: email.toLowerCase(), password }
      const data = await login(userData)

      // Redirect will be handled by the useEffect above
    } catch (error) {
      setError(error.response?.data?.message || "Login failed")
      console.error("Login error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestOTP = async (e) => {
    e.preventDefault()
    if (isSubmitting) return // Prevent multiple submissions

    setIsSubmitting(true)
    setError("")

    try {
      const response = await api.post("/api/auth/request-login-otp", {
        email: email.toLowerCase(),
      })

      setShowOtpForm(true)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP")
      console.error("OTP request error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpLogin = async (e) => {
    e.preventDefault()
    if (isSubmitting) return // Prevent multiple submissions

    setIsSubmitting(true)
    setError("")

    try {
      const response = await api.post("/api/auth/login-with-otp", {
        email: email.toLowerCase(),
        otp,
      })

      // Get token and user data from response
      const { token, user } = response.data

      // Set user and token in context
      setUserAndToken(user, token)

      // Redirect will be handled by the useEffect above
    } catch (error) {
      setError(error.response?.data?.message || "Login failed")
      console.error("OTP login error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleLoginMethod = () => {
    setLoginMethod(loginMethod === "password" ? "otp" : "password")
    setShowOtpForm(false)
    setError("")
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        {redirectMessage && <div className="redirect-message">{redirectMessage}</div>}

        {error && <div className="error-message">{error}</div>}

        <div className="login-method-toggle">
          <button
            className={loginMethod === "password" ? "active" : ""}
            onClick={() => setLoginMethod("password")}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Password
          </button>
          <button className={loginMethod === "otp" ? "active" : ""} onClick={() => setLoginMethod("otp")} type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            OTP
          </button>
        </div>

        {loginMethod === "password" ? (
          <form onSubmit={handlePasswordLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  type="email"
                  id="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type="password"
                  id="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`login-button ${isSubmitting ? "submitting" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                </>
              )}
            </button>
          </form>
        ) : !showOtpForm ? (
          <form onSubmit={handleRequestOTP} className="login-form">
            <div className="form-group">
              <label htmlFor="email-otp">Email</label>
              <div className="input-with-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  type="email"
                  id="email-otp"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`login-button ${isSubmitting ? "submitting" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13"></path>
                    <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                  </svg>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpLogin} className="login-form">
            <p className="otp-message">Please enter the verification code sent to {email}</p>
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <div className="input-with-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter code"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  className="otp-input"
                  maxLength="6"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`login-button ${isSubmitting ? "submitting" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Login
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </>
              )}
            </button>
          </form>
        )}

        <div className="login-footer">
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
          <div className="register-prompt">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

