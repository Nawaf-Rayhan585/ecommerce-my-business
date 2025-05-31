import React, { useState, useEffect, useRef } from 'react'
import banner1 from '../../assets/images/banner1.png'
import banner2 from '../../assets/images/banner2.png'
import '../../assets/css/slider.css'

const images = [banner1, banner2]

const Slider = () => {
  const [current, setCurrent] = useState(0)
  const timeoutRef = useRef(null)

  // Auto-slide every 4 seconds
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearTimeout(timeoutRef.current)
  }, [current])

  const goToSlide = (idx) => setCurrent(idx)

  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length)
  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length)

  return (
    <div className="slider-container">
      <div className="slider-image-wrapper">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Banner ${idx + 1}`}
            className={`slider-image${idx === current ? ' active' : ''}`}
            style={{ opacity: idx === current ? 1 : 0, zIndex: idx === current ? 2 : 1 }}
          />
        ))}
        <button className="slider-arrow left" onClick={prevSlide} aria-label="Previous Slide">&#10094;</button>
        <button className="slider-arrow right" onClick={nextSlide} aria-label="Next Slide">&#10095;</button>
      </div>
      <div className="slider-dots">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`slider-dot${idx === current ? ' active' : ''}`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slider
