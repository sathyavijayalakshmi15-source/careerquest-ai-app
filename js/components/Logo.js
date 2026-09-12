// CAREERQUEST AI - Unified C+Q 3D Logo Component

(function() {
  function renderLogo(options = {}) {
    const { size = "medium", showText = true, animated = true } = options;
    
    let width = 42;
    let height = 42;
    if (size === "large") { width = 64; height = 64; }
    if (size === "small") { width = 32; height = 32; }

    const svgLogo = `
      <div class="logo-symbol-wrapper ${animated ? 'logo-3d-tilt' : ''}" style="width: ${width}px; height: ${height}px;">
        <svg class="cq-logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cqRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FF4D4D" />
              <stop offset="50%" stop-color="#FF2A2A" />
              <stop offset="100%" stop-color="#B30000" />
            </linearGradient>
            <linearGradient id="cqDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2A2C3E" />
              <stop offset="100%" stop-color="#0B0C10" />
            </linearGradient>
            <filter id="cqGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Outer glowing ambient aura -->
          <circle cx="50" cy="50" r="42" stroke="url(#cqRedGrad)" stroke-width="1.5" opacity="0.4" stroke-dasharray="6 4" />

          <!-- Combined C + Q Symbol -->
          <!-- Inner C Arc -->
          <path d="M 45 22 C 30 22 20 34 20 50 C 20 66 30 78 45 78" 
                stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" />

          <!-- Outer Q Ring merged with C -->
          <circle cx="54" cy="50" r="26" stroke="url(#cqRedGrad)" stroke-width="9" filter="url(#cqGlow)" />

          <!-- Q Tail extending naturally DOWNWARD toward lower-right -->
          <path d="M 64 60 L 82 82" 
                stroke="url(#cqRedGrad)" stroke-width="10" stroke-linecap="round" filter="url(#cqGlow)" />

          <!-- Accent core dot inside Q -->
          <circle cx="54" cy="50" r="5" fill="#FF4D4D" />
        </svg>
      </div>
    `;

    if (!showText) return svgLogo;

    return `
      <div class="brand-logo-container">
        ${svgLogo}
        <div class="brand-logo-text">
          <span class="brand-title">CAREERQUEST <span class="text-red-glow">AI</span></span>
          <span class="brand-subtitle">BEYOND THE STREAM</span>
        </div>
      </div>
    `;
  }

  window.CQ_LOGO = {
    renderLogo
  };
})();
