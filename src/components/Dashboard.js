"use client"

import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/Authcontext"
import { Link } from "react-router-dom"
import "../style/Dashboard.css"
import api from "../api/config"

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    personalCount: 0,
    collaborativeCount: 0,
    totalEntries: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        setLoading(true)
        // Fetch capsules to count them
        const res = await api.get("/api/capsules")

        const personalCapsules = res.data.filter((c) => c.type === "personal")
        const collaborativeCapsules = res.data.filter((c) => c.type === "collaborative")

        // Count total entries across all capsules
        const allEntries = res.data.reduce((total, capsule) => {
          return total + (capsule.entries?.length || 0)
        }, 0)

        setStats({
          personalCount: personalCapsules.length,
          collaborativeCount: collaborativeCapsules.length,
          totalEntries: allEntries,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (!user) {
    return (
      <div className="dashboard-container">
        <h2>Welcome to Capsule</h2>
        <p>Please log in to view your dashboard.</p>
        <div className="dashboard-actions">
          <Link to="/login" className="dashboard-button">
            Login
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="welcome-message">
        <h2>Welcome, {user.name}</h2>
        <p>Capture and preserve your memories in time capsules.</p>
      </div>

      {!loading && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.personalCount}</div>
            <div className="stat-label">Personal Capsules</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.collaborativeCount}</div>
            <div className="stat-label">Collaborative Capsules</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalEntries}</div>
            <div className="stat-label">Total Memories</div>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Create Capsule</h3>
          <div className="dashboard-card-content">
            <Link to="/create-personal-capsule" className="dashboard-button">
              Personal Capsule
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </Link>
            <Link to="/create-collaborative-capsule" className="dashboard-button">
              Collaborative Capsule
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>View Capsules</h3>
          <div className="dashboard-card-content">
            <Link to="/view-personal-capsules" className="dashboard-button">
              Personal Capsules
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </Link>
            <Link to="/view-collaborative-capsules" className="dashboard-button">
              Collaborative Capsules
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

