"use client"

import { useContext } from "react"
import { AuthContext } from "../context/Authcontext"
import { Link } from "react-router-dom"
import "../style/Dashboard.css"

const Dashboard = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="dashboard-container">
      <h2>Memory Capsule Dashboard</h2>
      {user ? (
        <>
          <p>
            Welcome back, <strong>{user.name}</strong>! Create or view your memory capsules below.
          </p>

          <div className="dashboard-options">
            <div className="create-capsule-option">
              <h3>Create New Capsule</h3>
              <div className="button-group">
                <Link to="/create-personal-capsule">
                  <button>Personal Capsule</button>
                </Link>
                <Link to="/create-collaborative-capsule">
                  <button>Collaborative Capsule</button>
                </Link>
              </div>
            </div>

            <div className="view-capsules-option">
              <h3>View Your Capsules</h3>
              <div className="button-group">
                <Link to="/view-personal-capsules">
                  <button>Personal Capsules</button>
                </Link>
                <Link to="/view-collaborative-capsules">
                  <button>Collaborative Capsules</button>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="login-prompt">
          <p>Please log in to view your dashboard and access your memory capsules.</p>
          <div className="button-group">
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

