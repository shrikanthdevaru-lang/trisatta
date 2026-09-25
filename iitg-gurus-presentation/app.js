import { gurusData } from './gurus_data.js';

// DOM Elements
const gurusGrid = document.getElementById('gurus-grid');
const modalOverlay = document.getElementById('guru-modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal');
const exploreBtn = document.getElementById('explore-btn');

// Render Guru Cards
function renderGurus() {
    gurusData.forEach((guru, index) => {
        const card = document.createElement('div');
        card.className = 'guru-card glass-card';
        // Add a slight stagger delay variable for GSAP
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="guru-number">${String(index + 1).padStart(2, '0')}</div>
            <div class="guru-era">${guru.era}</div>
            <h3 class="guru-name">${guru.name}</h3>
            <div class="guru-domain">${guru.vidyaSthana}</div>
        `;
        
        card.addEventListener('click', () => openModal(guru));
        gurusGrid.appendChild(card);
    });
}

// Open Modal
function openModal(guru) {
    // Generate Works HTML
    const worksHtml = guru.works.map(work => `<li>${work}</li>`).join('');
    
    // Inject content
    modalBody.innerHTML = `
        <h2 class="modal-name">${guru.name}</h2>
        <div class="modal-era">${guru.era} &bull; ${guru.vidyaSthana}</div>
        
        <div class="modal-section">
            <h3>Life & Context</h3>
            <p>${guru.details.lifeContext}</p>
        </div>
        
        <div class="modal-section">
            <h3>Key Contributions</h3>
            <p>${guru.details.keyContributions}</p>
        </div>
        
        <div class="modal-section">
            <h3>Legacy</h3>
            <p>${guru.details.legacy}</p>
        </div>
        
        <div class="modal-section">
            <h3>Complete Works</h3>
            <ul class="works-list">
                ${worksHtml}
            </ul>
        </div>
    `;
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close Modal
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Event Listeners for Modal
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Scroll to Grid Action
exploreBtn.addEventListener('click', () => {
    document.getElementById('gurus-section').scrollIntoView({ behavior: 'smooth' });
});

// GSAP Animations Initialization
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Animation
    const heroTl = gsap.timeline();
    heroTl.to('.hero-title', { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.2 })
          .to('.hero-desc', { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.6")
          .to('.explore-btn', { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.6");

    // Grid Scroll Animation
    gsap.from('.section-header', {
        scrollTrigger: {
            trigger: '.gurus-section',
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    // Cards Stagger Animation
    // We select all generated cards
    const cards = gsap.utils.toArray('.guru-card');
    
    cards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: (i % 3) * 0.1 // Create a staggered effect per row roughly
        });
    });
}

// Generate Stars for Cosmic Background
function createStars() {
    const container = document.getElementById('stars-container');
    const numStars = 100;
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 3 + 1; // 1px to 4px
        
        star.style.position = 'absolute';
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        star.style.borderRadius = '50%';
        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;
        
        // Twinkle effect setup
        star.style.opacity = Math.random();
        
        container.appendChild(star);
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    renderGurus();
    // Use a slight timeout to ensure DOM elements are fully injected before GSAP processes them
    setTimeout(initAnimations, 100);
});
