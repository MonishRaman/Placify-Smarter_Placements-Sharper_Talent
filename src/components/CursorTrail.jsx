"use client"

import { useEffect, useState, useRef } from "react"

const TrailPoint = {
  x: 0,
  y: 0,
  id: 0,
  timestamp: 0,
}

const Bubble = {
  x: 0,
  y: 0,
  id: 0,
  timestamp: 0,
  vx: 0,
  vy: 0,
  size: 0,
  life: 0,
}

const smoothStep = (t) => t * t * (3 - 2 * t)
const lerp = (start, end, factor) => start + (end - start) * factor
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

export default function CursorTrail() {
  const [trail, setTrail] = useState([])
  const [bubbles, setBubbles] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [animationFrame, setAnimationFrame] = useState(0)
  const pointIdRef = useRef(0)
  const bubbleIdRef = useRef(0)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const smoothMousePos = useRef({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const targetX = e.clientX
    const targetY = e.clientY

    // Use higher lerp factor for snappier movement
    smoothMousePos.current.x = lerp(smoothMousePos.current.x, targetX, CURSOR_LERP_FACTOR)
    smoothMousePos.current.y = lerp(smoothMousePos.current.y, targetY, CURSOR_LERP_FACTOR)

    const newPoint = {
      x: smoothMousePos.current.x,
      y: smoothMousePos.current.y,
      id: pointIdRef.current++,
      timestamp: Date.now(),
    }

    setTrail((prev) => {
      const filtered = prev.filter((pt) => Date.now() - pt.timestamp < 1500)
      return [newPoint, ...filtered].slice(0, 22)
    })

    if (Math.random() < 0.2) {
      const newBubble = {
        x: smoothMousePos.current.x + (Math.random() - 0.5) * 30,
        y: smoothMousePos.current.y + (Math.random() - 0.5) * 30,
        id: bubbleIdRef.current++,
        timestamp: Date.now(),
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2.5 - 0.8,
        size: Math.random() * 12 + 10,
        life: Math.random() * 2500 + 2000,
      }

      setBubbles((prev) => {
        const filtered = prev.filter((bubble) => Date.now() - bubble.timestamp < bubble.life)
        return [newBubble, ...filtered].slice(0, 20)
      })
    }

    lastMousePos.current = { x: targetX, y: targetY }
  }

  const handleMouseEnter = () => setIsVisible(true)
  const handleMouseLeave = () => setIsVisible(false)

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      * {
        cursor: none !important;
      }
      button, a, input[type="submit"], input[type="button"], 
      [role="button"], .clickable, 
      *[style*="cursor: pointer"] {
        cursor: pointer !important;
      }
    `
    document.head.appendChild(style)

    let rafId
    let lastUpdate = Date.now()
    const animate = () => {
      // Throttle animation frame updates for performance
      const now = Date.now()
      if (now - lastUpdate > 24) {
        setAnimationFrame((prev) => prev + 1)
        lastUpdate = now
      }
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            x: bubble.x + bubble.vx,
            y: bubble.y + bubble.vy,
            vy: bubble.vy - 0.02, // gravity effect
          }))
          .filter((bubble) => Date.now() - bubble.timestamp < bubble.life),
      )
    
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    const checkDarkMode = () => {
      const theme = document.documentElement.getAttribute("data-theme")
      const isDark =
        theme === "dark" ||
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(isDark)
    }

    checkDarkMode()

    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    })

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", checkDarkMode)

    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    const cleanupInterval = setInterval(() => {
      setTrail((prev) => prev.filter((pt) => Date.now() - pt.timestamp < 1500))
      setBubbles((prev) => prev.filter((bubble) => Date.now() - bubble.timestamp < bubble.life))
    }, 250)

    return () => {
      document.head.removeChild(style)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      observer.disconnect()
      mediaQuery.removeEventListener("change", checkDarkMode)
      clearInterval(cleanupInterval)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (!isVisible || trail.length === 0) return null

  return (
    <div className="fixed pointer-events-none top-0 left-0 w-full h-full" style={{ zIndex: 999999 }}>
      {bubbles.map((bubble) => {
        const age = (Date.now() - bubble.timestamp) / bubble.life
        const opacity = Math.max(0, (1 - age) * 0.6)
        const scale = 1 - age * 0.3
        const shimmer = Math.sin(animationFrame * 0.1 + bubble.id * 0.5) * 0.2 + 0.8

        const bubbleColor = isDarkMode ? { r: 200, g: 220, b: 255 } : { r: 150, g: 180, b: 255 }

        return (
          <div
            key={`bubble-${bubble.id}`}
            className="absolute rounded-full"
            style={{
              left: bubble.x - bubble.size / 2,
              top: bubble.y - bubble.size / 2,
              width: bubble.size * scale,
              height: bubble.size * scale,
              background: `radial-gradient(circle at 30% 30%, 
                rgba(255, 255, 255, ${opacity * 0.8}) 0%, 
                rgba(${bubbleColor.r}, ${bubbleColor.g}, ${bubbleColor.b}, ${opacity * 0.4}) 30%, 
                rgba(${bubbleColor.r}, ${bubbleColor.g}, ${bubbleColor.b}, ${opacity * 0.2}) 60%, 
                rgba(${bubbleColor.r}, ${bubbleColor.g}, ${bubbleColor.b}, ${opacity * 0.1}) 80%, 
                transparent 100%)`,
              boxShadow: `
                0 0 ${bubble.size * 0.5}px rgba(${bubbleColor.r}, ${bubbleColor.g}, ${bubbleColor.b}, ${opacity * 0.6}),
                0 0 ${bubble.size * 1.2}px rgba(${bubbleColor.r}, ${bubbleColor.g}, ${bubbleColor.b}, ${opacity * 0.3}),
                inset 0 0 ${bubble.size * 0.2}px rgba(255, 255, 255, ${opacity * 0.7})`,
              opacity: opacity * shimmer,
              transform: `scale(${scale})`,
              border: `1px solid rgba(255, 255, 255, ${opacity * 0.3})`,
            }}
          />
        )
      })}

      {trail.map((point, index) => {
        const progress = index / Math.max(trail.length - 1, 1)
        const age = (Date.now() - point.timestamp) / 1500

        const smoothProgress = easeOutQuart(progress)
        const smoothAge = easeOutQuart(age)
        const opacity = Math.max(0.15, Math.min(1, (1 - smoothProgress * 0.6) * (1 - smoothAge * 0.7)))

        const baseSize = 24
        const sizeProgress = easeOutQuart(progress)
        const ageProgress = easeOutQuart(age)
        const size = Math.max(6, baseSize * (1 - sizeProgress * 0.65) * (1 - ageProgress * 0.4))

        const bubbleScale = 1 + Math.sin(animationFrame * 0.06 + index * 0.4) * 0.03

        const colorSchemes = isDarkMode
          ? [
              { r: 139, g: 92, b: 246 }, // Purple
              { r: 59, g: 130, b: 246 }, // Blue
              { r: 16, g: 185, b: 129 }, // Emerald
              { r: 245, g: 158, b: 11 }, // Amber
              { r: 236, g: 72, b: 153 }, // Pink
              { r: 34, g: 197, b: 94 }, // Green
            ]
          : [
              { r: 124, g: 58, b: 237 }, // Purple
              { r: 37, g: 99, b: 235 }, // Blue
              { r: 5, g: 150, b: 105 }, // Emerald
              { r: 217, g: 119, b: 6 }, // Amber
              { r: 219, g: 39, b: 119 }, // Pink
              { r: 22, g: 163, b: 74 }, // Green
            ]

        const color = colorSchemes[index % colorSchemes.length]
        const isHead = index < 7
        const pulseIntensity = isHead ? 1 + Math.sin(animationFrame * 0.04 + index * 0.6) * 0.04 : 1
        const smoothness = Math.min(1, easeOutQuart(opacity * 1.2))

        return (
          <div
            key={point.id}
            className="absolute rounded-full transition-all duration-200 ease-out"
            style={{
              left: point.x - size / 2,
              top: point.y - size / 2,
              width: size,
              height: size,
              background: `radial-gradient(circle at 30% 30%, 
                rgba(255, 255, 255, ${opacity * 0.6}) 0%, 
                rgba(${color.r}, ${color.g}, ${color.b}, ${opacity}) 10%, 
                rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.9}) 30%, 
                rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.6}) 60%, 
                rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.2}) 85%, 
                transparent 100%)`,
              boxShadow: `
                0 0 ${size * 0.8}px rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.8}),
                0 0 ${size * 1.6}px rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.6}),
                0 0 ${size * 3}px rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.4}),
                0 0 ${size * 5}px rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.15}),
                inset 0 0 ${size * 0.2}px rgba(255, 255, 255, ${opacity * 0.5})`,
              transform: `scale(${smoothness * pulseIntensity * bubbleScale})`,
              filter: `blur(${smoothProgress * 0.05}px)`,
              opacity: opacity,
            }}
          />
        )
      })}

      {trail.slice(0, 6).map((point, index) => {
        const sparkleSize = 3 + Math.sin(animationFrame * 0.06 + index * 1.1) * 0.6
        const sparkleOpacity = (Math.sin(animationFrame * 0.08 + index * 1.5) * 0.2 + 0.4) * (1 - index * 0.15)
        const color = isDarkMode ? { r: 255, g: 255, b: 255 } : { r: 220, g: 220, b: 255 }

        return (
          <div
            key={`sparkle-${point.id}`}
            className="absolute rounded-full"
            style={{
              left: point.x - sparkleSize / 2 + Math.sin(animationFrame * 0.03 + index) * 1.5,
              top: point.y - sparkleSize / 2 + Math.cos(animationFrame * 0.03 + index) * 1.5,
              width: sparkleSize,
              height: sparkleSize,
              background: `radial-gradient(circle, 
                rgba(${color.r}, ${color.g}, ${color.b}, ${sparkleOpacity}) 0%, 
                rgba(${color.r}, ${color.g}, ${color.b}, ${sparkleOpacity * 0.7}) 40%,
                transparent 70%)`,
              boxShadow: `0 0 ${sparkleSize * 2}px rgba(${color.r}, ${color.g}, ${color.b}, ${sparkleOpacity})`,
              opacity: sparkleOpacity,
            }}
          />
        )
      })}
    </div>
  )
}

// Increase lerp factor for faster cursor response
const CURSOR_LERP_FACTOR = 0.5