// Golden Armor Foundation - JavaScript with White Background & Blue Theme

// Particle Network Background - Blue on White
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.particleCount = 50;
        this.connectionDistance = 180;
        this.mouseRadius = 180;
        
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
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
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
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
        this.baseRadius = this.radius;
        this.opacity = Math.random() * 0.4 + 0.2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > this.network.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.network.canvas.height) this.vy *= -1;
        
        this.x = Math.max(0, Math.min(this.x, this.network.canvas.width));
        this.y = Math.max(0, Math.min(this.y, this.network.canvas.height));
        
        if (this.network.mouse.x && this.network.mouse.y) {
            const dx = this.network.mouse.x - this.x;
            const dy = this.network.mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.network.mouseRadius) {
                const force = (this.network.mouseRadius - distance) / this.network.mouseRadius;
                this.radius = this.baseRadius + force * 2;
                this.opacity = Math.min(0.8, this.opacity + force * 0.2);
            } else {
                this.radius = this.baseRadius;
                this.opacity = Math.max(0.2, this.opacity - 0.01);
            }
        }
    }
    
    draw() {
        // Subtle blue glow
        const gradient = this.network.ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, `rgba(37, 99, 235, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
        
        this.network.ctx.beginPath();
        this.network.ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        this.network.ctx.fillStyle = gradient;
        this.network.ctx.fill();
        
        // Core particle - blue
        this.network.ctx.beginPath();
        this.network.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.network.ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`;
        this.network.ctx.fill();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        new ParticleNetwork(canvas);
    }
    
    // Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.pageYOffset > 50);
    });
    
    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const spans = this.querySelectorAll('span');
            const isActive = navLinks.classList.contains('active');
            
            spans[0].style.transform = isActive ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            spans[1].style.opacity = isActive ? '0' : '1';
            spans[2].style.transform = isActive ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
            
            this.setAttribute('aria-expanded', isActive);
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelectorAll('span').forEach((span, i) => {
                    span.style.transform = 'none';
                    if (i === 1) span.style.opacity = '1';
                });
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
    
    // Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
    
    // Active Nav
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
                });
            }
        });
    });
    
    // Counter Animation
    const formatNumber = (num) => {
        if (num >= 1000000) return '$' + (num / 1000000).toFixed(0) + 'M+';
        if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
        return num + '+';
    };
    
    const animateCounter = (element, target) => {
        let start = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(start));
            }
        }, 40);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.impact-number').forEach(stat => {
                    const text = stat.textContent;
                    let value = text.includes('K') ? parseInt(text) * 1000 :
                               text.includes('M') ? parseInt(text.replace('$', '')) * 1000000 :
                               parseInt(text);
                    
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
    if (impactGrid) statsObserver.observe(impactGrid);
    
    // Form
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
                showNotification('Message sent successfully!', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Notification
    const showNotification = (message, type = 'info') => {
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        
        const bgColor = type === 'success' ? '#2563EB' : '#475569';
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.2); border-radius: 50%; font-size: 14px; font-weight: bold;">${type === 'success' ? '✓' : '✕'}</span>
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Close" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 8px;">&times;</button>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '16px 24px',
            borderRadius: '12px',
            backgroundColor: bgColor,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            boxShadow: '0 10px 40px rgba(37, 99, 235, 0.3)',
            zIndex: '9999',
            animation: 'slideInRight 0.3s ease',
            maxWidth: '400px',
            fontFamily: "'Inter', sans-serif"
        });
        
        document.body.appendChild(notification);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    };
    
    // Add animation styles
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
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .nav-links a.active { color: #2563EB !important; background: rgba(37, 99, 235, 0.08); }
    `;
    document.head.appendChild(style);
    
    // Card tilt
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
});
