"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/Authcontext"
import { Link } from "react-router-dom"
import Timer from "./Timer"
import "../style/CollaborativeCapsuleTree.css"
import api from "../api/config"

const CollaborativeCapsuleTree = () => {
  const { token } = useContext(AuthContext)
  const [collabCapsules, setCollabCapsules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCollaborativeCapsules = async () => {
      try {
        setLoading(true)
        const res = await api.get("/api/capsules")
        const capsulesData = res.data?.collaborative || res.data?.filter((c) => c.type === "collaborative") || []
        setCollabCapsules(capsulesData)
      } catch (error) {
        console.error("Error fetching collaborative capsules:", error.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchCollaborativeCapsules()
  }, [token])

  if (loading) {
    return (
      <div className="collab-capsule-tree">
        <h2>Collaborative Capsules</h2>
        <div className="loading-container" style={{ height: "300px" }}>
          <div className="loading-spinner"></div>
          <p>Loading your collaborative capsules...</p>
        </div>
      </div>
    )
  }

  if (collabCapsules.length === 0) {
    return (
      <div className="collab-capsule-tree">
        <h2>Collaborative Capsules</h2>
        <div className="empty-state">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
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
          <h3>No Collaborative Capsules Yet</h3>
          <p>Create a collaborative capsule to share memories with friends and family.</p>
          <a href="/create-collaborative-capsule" className="create-button">
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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Create Collaborative Capsule
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="collab-capsule-tree">
      <h2>Collaborative Capsules</h2>
      {collabCapsules.map((capsule) => {
        const currentTime = new Date()
        const capsuleLockTime = capsule.lockDate ? new Date(capsule.lockDate) : null
        const isCapsuleLocked = capsuleLockTime ? capsuleLockTime > currentTime : false

        return (
          <div key={capsule._id} className="collab-capsule">
            <div className="capsule-header">
              <Link to={`/capsules/${capsule._id}`} className="capsule-title-link">
                <h3>{capsule.title || "Untitled Capsule"}</h3>
              </Link>

              {isCapsuleLocked && (
                <div className="capsule-lock-status">
                  <Timer targetDate={capsule.lockDate} />
                </div>
              )}

              <div className="capsule-details">
                <p className="capsule-members">
                  <strong>Members:</strong>{" "}
                  {capsule.memberDetails && capsule.memberDetails.length > 0
                    ? capsule.memberDetails.map((m) => `${m.name} (${m.email})`).join(", ")
                    : capsule.members && capsule.members.length > 0
                      ? capsule.members.map((member) => member.email || "Unknown Email").join(", ")
                      : "No members found"}
                </p>

                <div className="capsule-entries">
                  <h4>Memory Entries ({capsule.entries?.length || 0})</h4>
                  {capsule.entries && capsule.entries.length > 0 ? (
                    capsule.entries.map((entry) => {
                      const isEntryLocked = entry.lockDate && new Date(entry.lockDate) > currentTime
                      return (
                        <div key={entry._id} className="entry-summary">
                          {isEntryLocked ? (
                            <Timer targetDate={entry.lockDate} />
                          ) : (
                            <span className="unlocked-label">Unlocked</span>
                          )}
                          <span className="entry-author">
                            Added by {entry.createdBy?.email || entry.createdBy || "Unknown"}
                          </span>
                        </div>
                      )
                    })
                  ) : (
                    <p>No memory entries added by members</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CollaborativeCapsuleTree

