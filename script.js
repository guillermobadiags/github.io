// JavaScript for Allzone Truth Website
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Animated Counter
    animateCounters();
    
    // Sticky Navigation
    handleStickyNav();
    
    // Smooth Scrolling
    initSmoothScrolling();
    
    // Intersection Observer for animations
    initIntersectionObserver();
    
    // Initialize share functionality
    initShareButtons();
    
    // Load additional data
    loadTestimonials();
});

// Animated Counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Animation speed
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-count');
        const isEuro = counter.classList.contains('euro');
        let current = 0;
        const increment = target / speed;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                if (isEuro) {
                    counter.textContent = formatEuro(Math.ceil(current));
                } else {
                    counter.textContent = formatNumber(Math.ceil(current));
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (isEuro) {
                    counter.textContent = formatEuro(target);
                } else {
                    counter.textContent = formatNumber(target);
                }
            }
        };
        
        updateCounter();
    };
    
    // Observe when counters come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Format number with thousand separators
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Format euro amounts
function formatEuro(num) {
    return formatNumber(num) + '€';
}

// Sticky Navigation
function handleStickyNav() {
    const nav = document.getElementById('mainNav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });
}

// Intersection Observer for animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card').forEach(card => {
        observer.observe(card);
    });
    
    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
}

// Share functionality
function shareWarning() {
    const shareData = {
        title: 'ALERTA: Allzone España - 1.197 Denuncias Oficiales',
        text: '⚠️ IMPORTANTE: Allzone.es acumula 1.197 denuncias ante la OCU. FACUA solicita su cierre inmediato. Más de 3 millones de euros retenidos. NO COMPRES.',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Compartido exitosamente'))
            .catch((error) => console.log('Error compartiendo:', error));
    } else {
        // Fallback: Copy to clipboard
        const textToCopy = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Información copiada al portapapeles');
        });
    }
}

// Report case functionality
function reportCase() {
    // Create modal with reporting options
    const modal = document.createElement('div');
    modal.className = 'report-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Reporta tu Caso</h2>
            <p>Selecciona dónde quieres reportar tu caso:</p>
            <div class="report-options">
                <a href="https://www.ocu.org/reclamar" target="_blank" class="report-option">
                    <span class="material-icons">account_balance</span>
                    <span>OCU - Organización de Consumidores</span>
                </a>
                <a href="https://www.facua.org/denunciar" target="_blank" class="report-option">
                    <span class="material-icons">gavel</span>
                    <span>FACUA - Consumidores en Acción</span>
                </a>
                <a href="tel:091" class="report-option">
                    <span class="material-icons">local_police</span>
                    <span>Policía Nacional: 091</span>
                </a>
                <a href="tel:062" class="report-option">
                    <span class="material-icons">security</span>
                    <span>Guardia Civil: 062</span>
                </a>
            </div>
            <p class="modal-note">
                <strong>Importante:</strong> Documenta todo (emails, capturas, justificantes de pago) antes de denunciar.
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').onclick = () => {
        modal.remove();
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Load additional testimonials dynamically
function loadTestimonials() {
    // Additional testimonials data
    const additionalTestimonials = [
        {
            amount: "1.250€",
            status: "DENUNCIA POLICIAL",
            text: "MacBook Pro pagado en enero. Nunca llegó. He presentado denuncia en Policía Nacional.",
            author: "Roberto L.",
            location: "Sevilla",
            date: "Agosto 2025"
        },
        {
            amount: "567€",
            status: "4 MESES ESPERANDO",
            text: "iPad comprado para mi hijo. Solo excusas y más excusas. Es una vergüenza.",
            author: "María P.",
            location: "Bilbao",
            date: "Julio 2025"
        },
        {
            amount: "890€",
            status: "SIN RESPUESTA",
            text: "Ni producto ni dinero. El teléfono no existe. Los emails son bots. ESTAFA TOTAL.",
            author: "Francisco M.",
            location: "Zaragoza",
            date: "Junio 2025"
        }
    ];
    
    // Could implement dynamic loading here if needed
}

// Initialize share buttons
function initShareButtons() {
    // Twitter/X share
    const twitterShare = () => {
        const text = "⚠️ ALERTA: Allzone.es acumula 1.197 denuncias ante la OCU. FACUA solicita su cierre. NO COMPRES. Más info:";
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank', 'width=550,height=420');
    };
    
    // Facebook share
    const facebookShare = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank', 'width=550,height=420');
    };
    
    // WhatsApp share
    const whatsappShare = () => {
        const text = "⚠️ IMPORTANTE sobre Allzone.es: 1.197 denuncias oficiales ante la OCU. Más de 3 millones de euros retenidos. NO COMPRES. Info completa:";
        const url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`;
        window.open(url, '_blank');
    };
    
    // Make functions globally available
    window.twitterShare = twitterShare;
    window.facebookShare = facebookShare;
    window.whatsappShare = whatsappShare;
}

// Add modal styles dynamically
const modalStyles = `
    .report-modal {
        display: flex;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s;
    }
    
    .modal-content {
        background-color: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        position: relative;
        animation: slideUp 0.3s;
    }
    
    .close-modal {
        position: absolute;
        right: 1rem;
        top: 1rem;
        font-size: 2rem;
        cursor: pointer;
        color: #757575;
        transition: color 0.3s;
    }
    
    .close-modal:hover {
        color: #212121;
    }
    
    .report-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1.5rem 0;
    }
    
    .report-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f5f5f5;
        border-radius: 8px;
        text-decoration: none;
        color: #212121;
        transition: all 0.3s;
    }
    
    .report-option:hover {
        background: #e0e0e0;
        transform: translateX(5px);
    }
    
    .modal-note {
        background: #fff3e0;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #ff9800;
    }
    
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #323232;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s;
        z-index: 10000;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);

// Track page visibility for analytics
let timeOnPage = 0;
let startTime = Date.now();

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        timeOnPage += Date.now() - startTime;
    } else {
        startTime = Date.now();
    }
});

// Log warning in console
console.log('%c⚠️ ADVERTENCIA', 'color: red; font-size: 30px; font-weight: bold;');
console.log('%cAllzone.es está siendo investigado por fraude masivo', 'color: red; font-size: 16px;');
console.log('%c1.197 denuncias oficiales ante la OCU', 'color: orange; font-size: 14px;');
console.log('%cNO COMPRES en allzone.es', 'color: red; font-size: 20px; font-weight: bold');

// Performance optimization: Lazy load images if any
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}