"use client"

import { useState, useEffect } from "react"
import "../style/Timer.css"

const Timer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [isUnlocked, setIsUnlocked] = useState(+new Date(targetDate) <= +new Date())

  useEffect(() => {
    if (isUnlocked) return

    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft()
      setTimeLeft(updatedTimeLeft)

      // Check if timer has expired
      if (Object.keys(updatedTimeLeft).length === 0) {
        setIsUnlocked(true)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, isUnlocked])

  if (isUnlocked) {
    return (
      <div className="timer-unlocked">
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
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
        <span>Unlocked</span>
      </div>
    )
  }

  return (
    <div className="timer-container">
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
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      <span>Locked for</span>
      <div className="timer-units">
        {Object.keys(timeLeft).map(
          (interval) =>
            timeLeft[interval] > 0 && (
              <div key={interval} className="timer-unit">
                <span className="timer-value">{timeLeft[interval]}</span>
                <span className="timer-label">{interval}</span>
              </div>
            ),
        )}
      </div>
    </div>
  )
}

export default Timer

