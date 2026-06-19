// --- State Definitions ---
const STATES = {
    INITIAL: 'INITIAL',
    DETECTED: 'DETECTED',
    ATTACHING: 'ATTACHING',
    LOADING: 'LOADING',
    FINISHED: 'FINISHED'
};
let currentState = STATES.INITIAL;
let autoDetectTimer = null;
// --- DOM Elements ---
const launcherWindow = document.getElementById('launcherWindow');
const watermarkGroup = document.getElementById('watermarkGroup');
const watermark = document.getElementById('watermark');
const initialStatus = document.getElementById('initialStatus');
const instanceCard = document.getElementById('instanceCard');
const loadingWrapper = document.getElementById('loadingWrapper');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.querySelector('.progress-container');
const minecraftBg = document.querySelector('.minecraft-bg');
const hudStateText = document.getElementById('currentState');
const attachBtnDemo = document.getElementById('attachBtnDemo');
// --- Canvas and Particle Setup ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId = null;
function resizeCanvas() {
    canvas.width = launcherWindow.clientWidth;
    canvas.height = launcherWindow.clientHeight - 32; // Excluding the title bar height
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial call
class Particle {
    constructor(x, y, isGreen = false) {
        this.x = x;
        this.y = y;
        
        // Random velocity drifting outwards
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 3.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - (0.3 + Math.random() * 1.2); // Drift upwards slightly
        
        // Color
        this.isGreen = isGreen;
        this.color = isGreen 
            ? `rgba(16, 185, 129, ${0.7 + Math.random() * 0.3})` // Emerald Green Accent
            : `rgba(255, 255, 255, ${0.8 + Math.random() * 0.2})`; // Pure White
            
        // Size & Lifetime
        this.size = isGreen ? 1 + Math.random() * 2 : 2 + Math.random() * 3;
        this.maxLife = 35 + Math.random() * 30; // Frames of life
        this.life = this.maxLife;
        this.decay = 0.95 + Math.random() * 0.03;
        this.alpha = 1.0;
        this.blur = isGreen ? 1 : 2 + Math.random() * 2;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        
        this.life--;
        this.alpha = this.life / this.maxLife;
        this.size *= 0.97;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = this.isGreen ? '#10b981' : '#ffffff';
        ctx.shadowBlur = this.blur;
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
// Particle Loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles = particles.filter(p => {
        p.update();
        p.draw();
        return p.life > 0;
    });
    if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animateParticles);
    } else {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}
function spawnLogoDissolveParticles() {
    const rect = watermark.getBoundingClientRect();
    const launcherRect = launcherWindow.getBoundingClientRect();
    
    // Relative coordinates of logo inside the content area (shifted down by titlebar 32px)
    const logoCenterX = (rect.left - launcherRect.left) + (rect.width / 2);
    const logoCenterY = (rect.top - launcherRect.top - 32) + (rect.height / 2);
    
    particles = [];
    
    // Spawn particles to simulate text dissolve
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle(logoCenterX + (Math.random() - 0.5) * 120, logoCenterY + (Math.random() - 0.5) * 30, false));
    }
    for (let i = 0; i < 35; i++) {
        particles.push(new Particle(logoCenterX + (Math.random() - 0.5) * 140, logoCenterY + (Math.random() - 0.5) * 35, true));
    }
    if (!animationFrameId) {
        animateParticles();
    }
}
// --- State Transitions ---
function updateHUD(state) {
    currentState = state;
    hudStateText.textContent = state;
    
    if (state === STATES.DETECTED) {
        attachBtnDemo.disabled = false;
    } else {
        attachBtnDemo.disabled = true;
    }
}
function triggerDetection() {
    if (currentState !== STATES.INITIAL) return;
    
    updateHUD(STATES.DETECTED);
    
    // Fade out initial status text
    initialStatus.classList.add('hidden');
    
    // Move logo group upwards
    watermarkGroup.classList.add('detected');
    
    // Animate Instance Card in
    setTimeout(() => {
        instanceCard.classList.add('visible');
    }, 150);
}
function triggerAttach() {
    if (currentState !== STATES.DETECTED) return;
    
    updateHUD(STATES.ATTACHING);
    
    // Stage 1: Card slightly shrinks
    instanceCard.classList.add('clicked');
    
    setTimeout(() => {
        // Stage 2: Watermark group exits (dissolves with particles)
        watermarkGroup.classList.add('dissolve-state');
        spawnLogoDissolveParticles();
        
        // Stage 3: Card exits (slides down, fades out)
        setTimeout(() => {
            instanceCard.classList.remove('visible');
            instanceCard.classList.add('exit');
        }, 150);
        
        // Transition to Loading Screen
        setTimeout(() => {
            startLoading();
        }, 600);
        
    }, 150);
}
function startLoading() {
    updateHUD(STATES.LOADING);
    
    // Show loading wrapper
    loadingWrapper.classList.add('visible');
    
    let progress = 0;
    progressBar.style.width = '0%';
    
    function updateProgress() {
        if (progress >= 100) {
            progress = 100;
            progressBar.style.width = '100%';
            setTimeout(completeLoading, 200);
            return;
        }
        
        // Easing progress animation
        const increment = (100 - progress) * 0.04 + 0.3;
        progress += increment + (Math.random() * 0.4);
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        requestAnimationFrame(updateProgress);
    }
    
    setTimeout(updateProgress, 300);
}
function completeLoading() {
    // Inward collapse of loading progress container
    progressContainer.classList.add('collapse-inward');
    
    // Fade out text label
    const label = document.querySelector('.loading-label');
    label.style.transition = 'opacity 0.4s ease';
    label.style.opacity = '0';
    
    // Final exit transition: Launcher UI slides away
    setTimeout(() => {
        loadingWrapper.classList.remove('visible');
        
        setTimeout(() => {
            launcherWindow.classList.add('hidden');
            
            // Show background Minecraft fully loaded
            minecraftBg.classList.add('active');
            updateHUD(STATES.FINISHED);
        }, 300);
        
    }, 500);
}
function resetDemo() {
    if (autoDetectTimer) clearTimeout(autoDetectTimer);
    
    // Clear particles
    particles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // Reset Classes
    watermarkGroup.className = 'watermark-group';
    initialStatus.className = 'initial-status';
    instanceCard.className = 'instance-card';
    loadingWrapper.className = 'loading-wrapper';
    progressBar.style.width = '0%';
    progressContainer.className = 'progress-container';
    launcherWindow.classList.remove('hidden');
    minecraftBg.classList.remove('active');
    
    const label = document.querySelector('.loading-label');
    label.style.opacity = '1';
    
    updateHUD(STATES.INITIAL);
    
    // Trigger auto-detect after 2 seconds on reset
    autoDetectTimer = setTimeout(triggerDetection, 2000);
}
// Window decoration actions
function minimizeWindow() {
    launcherWindow.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s';
    launcherWindow.style.transform = 'scale(0.85) translateY(80px)';
    launcherWindow.style.opacity = '0.3';
    
    setTimeout(() => {
        launcherWindow.style.transform = '';
        launcherWindow.style.opacity = '1';
    }, 1500);
}
function closeWindow() {
    launcherWindow.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s';
    launcherWindow.style.transform = 'scale(0.95) translateY(15px)';
    launcherWindow.style.opacity = '0';
    
    setTimeout(() => {
        launcherWindow.style.transform = '';
        launcherWindow.style.opacity = '1';
    }, 2000);
}
// --- Autoplay Simulation on Page Load ---
window.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    autoDetectTimer = setTimeout(triggerDetection, 2000);
});
