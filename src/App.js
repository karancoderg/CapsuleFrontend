"use client"

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider, AuthContext } from "./context/Authcontext"
import { useContext, useEffect, useRef } from "react"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import Navbar from "./components/Navbar"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import PersonalCapsule from "./components/PersonalCapsule"
import CollaborativeCapsule from "./components/CollaborativeCapsule"
import CapsuleManager from "./components/CapsuleManager"
import CapsuleDetail from "./components/CapsuleDetail"
import PersonalCapsuleTree from "./components/PersonalCapsuleTree"
import CollaborativeCapsuleTree from "./components/CollaborativeCapsuleTree"
import ForgotPassword from "./components/forgot-password"
import ResetPassword from "./components/reset-password/[token]"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

// Loading component with animation
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading your capsules...</p>
  </div>
)

// Animated routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation()
  const nodeRef = useRef(null)

  return (
    <div className="route-container">
      <TransitionGroup component={null}>
        <CSSTransition 
          key={location.key} 
          classNames="page-transition" 
          timeout={300} 
          unmountOnExit
          nodeRef={nodeRef}
        >
          <div ref={nodeRef}>
            <Routes location={location}>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-personal-capsule"
                element={
                  <ProtectedRoute>
                    <PersonalCapsule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-collaborative-capsule"
                element={
                  <ProtectedRoute>
                    <CollaborativeCapsule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/capsules"
                element={
                  <ProtectedRoute>
                    <CapsuleManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/capsules/:capsuleId"
                element={
                  <ProtectedRoute>
                    <CapsuleDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/view-personal-capsules"
                element={
                  <ProtectedRoute>
                    <PersonalCapsuleTree />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/view-collaborative-capsules"
                element={
                  <ProtectedRoute>
                    <CollaborativeCapsuleTree />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

// Main app with routes
const AppRoutes = () => {
  const { loading } = useContext(AuthContext)
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <AnimatedRoutes />
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App

