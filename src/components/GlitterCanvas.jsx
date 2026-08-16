import React, { useEffect, useRef } from 'react';

/**
 * Interactive Golden Glitter & Liquid Shimmer Background
 * Renders tiny shimmering golden dust particles and sparkling stars
 */
export default function GlitterCanvas({ isDark = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create 45 tiny golden sparkle particles
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.4 - 0.1, // Gently floating upward
        opacity: Math.random() * 0.7 + 0.2,
        opacitySpeed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
        isStar: Math.random() > 0.6,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacitySpeed;
        p.rotation += p.rotationSpeed;

        if (p.opacity > 0.85 || p.opacity < 0.15) {
          p.opacitySpeed = -p.opacitySpeed;
        }

        // Wrap around screen
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.opacity));

        if (p.isStar) {
          // Draw 4-point golden sparkle star
          const starSize = p.size * 2.5;
          const goldColor = isDark ? '#fbbf24' : '#d97706';
          
          ctx.strokeStyle = goldColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -starSize);
          ctx.lineTo(0, starSize);
          ctx.moveTo(-starSize, 0);
          ctx.lineTo(starSize, 0);
          ctx.stroke();

          // Central glow
          ctx.fillStyle = isDark ? 'rgba(251, 191, 36, 0.8)' : 'rgba(245, 158, 11, 0.9)';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Soft golden circular shimmer orb
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
          if (isDark) {
            gradient.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
            gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.4)');
            gradient.addColorStop(1, 'rgba(217, 119, 6, 0)');
          } else {
            gradient.addColorStop(0, 'rgba(245, 158, 11, 0.85)');
            gradient.addColorStop(0.5, 'rgba(217, 119, 6, 0.35)');
            gradient.addColorStop(1, 'rgba(180, 83, 9, 0)');
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: isDark ? 0.45 : 0.75 }}
    />
  );
}
