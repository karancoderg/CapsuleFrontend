"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/Authcontext"
import Timer from "./Timer"
import "../style/PersonalCapsuleTree.css"
import api from "../api/config"

const PersonalCapsuleTree = () => {
  const { token } = useContext(AuthContext)
  const [capsules, setCapsules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPersonalCapsules = async () => {
      try {
        setLoading(true)
        const res = await api.get("/api/capsules")

        if (res.data.personal) {
          setCapsules(res.data.personal)
        } else {
          setCapsules(res.data.filter((c) => c.type === "personal"))
        }
      } catch (error) {
        console.error("Error fetching personal capsules:", error.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchPersonalCapsules()
  }, [token])

  // Group capsules by creation date
  const groupedCapsules = capsules.reduce((acc, capsule) => {
    const dateKey = new Date(capsule.createdAt).toLocaleDateString()
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(capsule)
    return acc
  }, {})

  // Count locked and unlocked capsules
  let lockedCount = 0
  let unlockedCount = 0
  capsules.forEach((capsule) => {
    if (capsule.lockDate && new Date(capsule.lockDate) > new Date()) {
      lockedCount++
    } else {
      unlockedCount++
    }
  })

  if (loading) {
    return (
      <div className="personal-capsule-tree">
        <h2>Personal Capsules</h2>
        <div className="loading-container" style={{ height: "300px" }}>
          <div className="loading-spinner"></div>
          <p>Loading your capsules...</p>
        </div>
      </div>
    )
  }

  if (capsules.length === 0) {
    return (
      <div className="personal-capsule-tree">
        <h2>Personal Capsules</h2>
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
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <h3>No Personal Capsules Yet</h3>
          <p>Create your first personal time capsule to preserve your memories.</p>
          <a href="/create-personal-capsule" className="create-button">
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
            Create Capsule
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="personal-capsule-tree">
      <h2>Personal Capsules</h2>
      <div className="tree-summary">
        <p data-count={lockedCount}>Locked</p>
        <p data-count={unlockedCount}>Unlocked</p>
        <p data-count={capsules.length}>Total</p>
      </div>
      <div className="tree-container">
        {Object.keys(groupedCapsules).map((dateKey) => (
          <div key={dateKey} className="tree-branch">
            <h3 className="tree-date">{dateKey}</h3>
            <ul>
              {groupedCapsules[dateKey].map((capsule) => {
                const isLocked = capsule.lockDate && new Date(capsule.lockDate) > new Date()
                return (
                  <li key={capsule._id} className="tree-leaf">
                    <div className="capsule-node">
                      <span className="capsule-title">{capsule.title}</span>
                      {isLocked ? (
                        <Timer targetDate={capsule.lockDate} />
                      ) : (
                        <div className="capsule-content">
                          <span className="unlocked-label">Unlocked</span>
                          {/* Display description if available */}
                          {capsule.description && capsule.description.trim().length > 0 && (
                            <p className="capsule-description">{capsule.description}</p>
                          )}
                          {/* Render media if available */}
                          {capsule.media && capsule.media.length > 0 && (
                            <div className="media-container">
                              {capsule.media.map((mediaItem, index) => {
                                let mediaUrl = ""
                                let mediaType = ""
                                // Handle both string and object formats
                                if (typeof mediaItem === "string") {
                                  mediaUrl = mediaItem
                                  // Simple detection based on extension (case insensitive)
                                  if (mediaUrl.toLowerCase().endsWith(".mp4")) {
                                    mediaType = "video/mp4"
                                  } else if (mediaUrl.toLowerCase().endsWith(".webm")) {
                                    mediaType = "video/webm"
                                  } else if (mediaUrl.toLowerCase().endsWith(".mp3")) {
                                    mediaType = "audio/mpeg"
                                  } else {
                                    mediaType = "image/jpeg"
                                  }
                                } else if (typeof mediaItem === "object" && mediaItem.url) {
                                  mediaUrl = mediaItem.url
                                  mediaType = mediaItem.type || "image/jpeg"
                                }

                                if (mediaType.startsWith("video/")) {
                                  return (
                                    <video key={index} controls className="capsule-media">
                                      <source src={mediaUrl} type={mediaType} />
                                      Your browser does not support the video tag.
                                    </video>
                                  )
                                } else if (mediaType.startsWith("audio/")) {
                                  return (
                                    <audio key={index} controls className="capsule-media">
                                      <source src={mediaUrl} type={mediaType} />
                                      Your browser does not support the audio element.
                                    </audio>
                                  )
                                } else {
                                  return (
                                    <img
                                      key={index}
                                      src={mediaUrl || "/placeholder.svg"}
                                      alt="capsule media"
                                      className="capsule-media"
                                    />
                                  )
                                }
                              })}
                            </div>
                          )}
                          {/* Always display text content below media */}
                          <p className="capsule-text">
                            {capsule.content && capsule.content.trim().length > 0 ? capsule.content : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PersonalCapsuleTree

