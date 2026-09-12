// CAREERQUEST AI - Canvas Particle & Parallax Background

(function() {
  function initParticlesCanvas() {
    const canvas = document.getElementById('bgParticlesCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      canvas.style.display = 'none';
      return;
    }

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const isMobile = width < 768;
    const particleCount = isMobile ? 25 : 60; // Reduced on mobile for performance

    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(255, 42, 42, ' : 'rgba(255, 107, 53, ',
        alpha: Math.random() * 0.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FF2A2A';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    // Subtle 3D Card Tilt Mouse Parallax listener
    if (!isMobile) {
      document.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;

        document.querySelectorAll('.card-tilt').forEach(card => {
          card.style.transform = `perspective(1000px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) translateY(-2px)`;
        });
      });
    }
  }

  window.CQ_PARTICLES = {
    initParticlesCanvas
  };
})();
