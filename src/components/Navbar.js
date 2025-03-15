"use client"

import { Link } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/Authcontext"
import "../style/NavBar.css"

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <span className="logo-text">Capsule</span>
            <span className="logo-dot"></span>
          </Link>
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${menuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className={`navbar-right ${menuOpen ? "active" : ""}`}>
          {user ? (
            <>
              <div className="user-welcome">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user.name}</span>
              </div>
              <div className="nav-links">
                <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/capsules" className="nav-link" onClick={() => setMenuOpen(false)}>
                  My Capsules
                </Link>
              </div>
              <button className="logout-button" onClick={logout}>
                <span>Logout</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link login-link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="register-button" onClick={() => setMenuOpen(false)}>
                Register
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

