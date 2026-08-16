// Golden Armor Foundation - Accessible JavaScript

// Particle Network Background - White/Gray Theme
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.particleCount = 60;
        this.connectionDistance = 180;
        this.mouseRadius = 200;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this));
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections - subtle white lines
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw and update particles
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(network) {
        this.network = network;
        this.x = Math.random() * network.canvas.width;
        this.y = Math.random() * network.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
        this.baseRadius = this.radius;
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x < 0 || this.x > this.network.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.network.canvas.height) this.vy *= -1;
        
        // Keep in bounds
        this.x = Math.max(0, Math.min(this.x, this.network.canvas.width));
        this.y = Math.max(0, Math.min(this.y, this.network.canvas.height));
        
        // Mouse interaction
        if (this.network.mouse.x && this.network.mouse.y) {
            const dx = this.network.mouse.x - this.x;
            const dy = this.network.mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.network.mouseRadius) {
                const force = (this.network.mouseRadius - distance) / this.network.mouseRadius;
                this.radius = this.baseRadius + force * 2;
                this.opacity = Math.min(1, this.opacity + force * 0.3);
            } else {
                this.radius = this.baseRadius;
                this.opacity = Math.max(0.3, this.opacity - 0.02);
            }
        }
    }
    
    draw() {
        // Subtle glow
        const gradient = this.network.ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 4
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.network.ctx.beginPath();
        this.network.ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
        this.network.ctx.fillStyle = gradient;
        this.network.ctx.fill();
        
        // Core particle - white
        this.network.ctx.beginPath();
        this.network.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.network.ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        this.network.ctx.fill();
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Particle Network
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        new ParticleNetwork(canvas);
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const spans = this.querySelectorAll('span');
            
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
    
    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Counter animation
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(start));
            }
        }, 16);
    };
    
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return '$' + (num / 1000000).toFixed(0) + 'M+';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K+';
        }
        return num + '+';
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const impactNumbers = entry.target.querySelectorAll('.impact-number');
                impactNumbers.forEach(stat => {
                    const text = stat.textContent;
                    let value;
                    
                    if (text.includes('K')) {
                        value = parseInt(text) * 1000;
                    } else if (text.includes('M')) {
                        value = parseInt(text.replace('$', '')) * 1000000;
                    } else {
                        value = parseInt(text);
                    }
                    
                    if (!isNaN(value)) {
                        stat.textContent = '0';
                        animateCounter(stat, value);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const impactGrid = document.querySelector('.impact-grid');
    if (impactGrid) {
        statsObserver.observe(impactGrid);
    }
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('#name').value;
            const email = this.querySelector('#email').value;
            const subject = this.querySelector('#subject').value;
            const message = this.querySelector('#message').value;
            
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Accessible notification system
    const showNotification = (message, type = 'info') => {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
                <span class="notification-message">${message}</span>
            </div>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Style the notification - black and white
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '16px 24px',
            borderRadius: '12px',
            backgroundColor: type === 'success' ? '#FFFFFF' : type === 'error' ? '#333333' : '#1a1a1a',
            color: type === 'success' ? '#000000' : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            zIndex: '9999',
            animation: 'slideInRight 0.3s ease',
            maxWidth: '400px',
            border: `1px solid ${type === 'success' ? '#000000' : '#404040'}`,
            fontFamily: "'Inter', sans-serif"
        });
        
        const content = notification.querySelector('.notification-content');
        Object.assign(content.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        });
        
        const icon = notification.querySelector('.notification-icon');
        Object.assign(icon.style, {
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: type === 'success' ? '#000000' : '#FFFFFF',
            color: type === 'success' ? '#FFFFFF' : '#000000',
            borderRadius: '50%',
            fontSize: '14px',
            fontWeight: 'bold',
            flexShrink: '0'
        });
        
        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: type === 'success' ? '#000000' : '#FFFFFF',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
            lineHeight: '1',
            opacity: '0.7',
            transition: 'opacity 0.2s',
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        
        closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.7');
        
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Focus the close button for accessibility
        closeBtn.focus();
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    };
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(0,0,0,0.2);
            border-radius: 50%;
            border-top-color: #000000;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .nav-links a.active {
            color: #FFFFFF !important;
            background: rgba(255,255,255,0.1);
        }
    `;
    document.head.appendChild(style);
    
    // Tilt effect on cards (subtle)
    document.querySelectorAll('.program-card, .impact-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
