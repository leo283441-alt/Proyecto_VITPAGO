/* ==========================================================================
   VITPAGO FRONTEND SCRIPT - PDF INTERACTIVE EDITION (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. MOBILE/DESKTOP LEFT SIDE DRAWER
       ========================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const closeDrawer = document.getElementById('close-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const openMenu = () => {
        mobileDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevents background scroll
    };

    const closeMenu = () => {
        mobileDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
    }
    
    if (closeDrawer) {
        closeDrawer.addEventListener('click', closeMenu);
    }
    
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeMenu);
    }

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    /* ==========================================
       2. REAL-TIME PAYMENT CENTERS GRID FILTER
       ========================================== */
    const searchInput = document.getElementById('payment-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const paymentCards = document.querySelectorAll('.payment-card-pdf');
    const emptyState = document.getElementById('empty-state-search');
    const paymentGrid = document.getElementById('payment-grid');

    let currentCategory = 'todos';
    let searchQuery = '';

    // Normalizes text by converting to lowercase and stripping accents
    const normalizeText = (text) => {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    const filterPaymentCenters = () => {
        let visibleCount = 0;
        
        paymentCards.forEach(card => {
            const name = normalizeText(card.getAttribute('data-name') || '');
            const category = card.getAttribute('data-category') || '';
            
            const matchesSearch = name.includes(searchQuery);
            const matchesCategory = currentCategory === 'todos' || category === currentCategory;
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Toggle empty search notice
        if (visibleCount === 0) {
            if (emptyState) emptyState.style.display = 'flex';
            if (paymentGrid) paymentGrid.style.display = 'none';
        } else {
            if (emptyState) emptyState.style.display = 'none';
            if (paymentGrid) paymentGrid.style.display = 'grid';
        }
    };

    // Debounce helper to optimize search input performance
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            searchQuery = normalizeText(e.target.value);
            filterPaymentCenters();
        }, 150));
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentCategory = btn.getAttribute('data-category') || 'todos';
            filterPaymentCenters();
        });
    });

    /* ==========================================
       3. FAQ ACCORDION INTERACTIVITY
       ========================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close other items for a clean accordion collapse
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
            });
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================
       4. AJAX CONTACT FORM INTEGRATION
       ========================================== */
    const contactForm = document.getElementById('landing-contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const btnSubmit = document.getElementById('btn-submit-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (formFeedback) {
                formFeedback.className = 'form-feedback hidden';
            }
            
            const captchaChecked = document.getElementById('captcha-check').checked;
            if (!captchaChecked) {
                showFeedback('Por favor, marca la casilla No soy un robot.', false);
                return;
            }
            
            const btnText = btnSubmit.querySelector('.btn-text');
            const btnSpinner = btnSubmit.querySelector('.btn-spinner');
            
            btnSubmit.disabled = true;
            if (btnText) btnText.style.opacity = '0.5';
            if (btnSpinner) btnSpinner.classList.remove('hidden');
            
            const formData = new FormData(contactForm);
            const dataObj = {};
            formData.forEach((value, key) => {
                dataObj[key] = value;
            });
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': dataObj['csrfmiddlewaretoken'] || ''
                    },
                    body: JSON.stringify(dataObj)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    showFeedback(result.message, true);
                    contactForm.reset();
                    document.getElementById('captcha-check').checked = false;
                } else {
                    showFeedback(result.message || 'Ocurrió un error al enviar el mensaje.', false);
                }
            } catch (err) {
                showFeedback('Error de conexión. Inténtalo de nuevo más tarde.', false);
                console.error(err);
            } finally {
                btnSubmit.disabled = false;
                if (btnText) btnText.style.opacity = '1';
                if (btnSpinner) btnSpinner.classList.add('hidden');
            }
        });
    }

    const showFeedback = (msg, isSuccess) => {
        if (!formFeedback) return;
        
        formFeedback.classList.remove('hidden');
        const feedbackText = formFeedback.querySelector('.feedback-text');
        const feedbackIcon = formFeedback.querySelector('.feedback-icon');
        
        if (feedbackText) feedbackText.textContent = msg;
        
        if (isSuccess) {
            formFeedback.className = 'form-feedback success';
            if (feedbackIcon) feedbackIcon.textContent = '✓';
        } else {
            formFeedback.className = 'form-feedback error';
            if (feedbackIcon) feedbackIcon.textContent = '✕';
        }
        
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    /* ==========================================
       5. INTERACTIVE FLOATING ASSISTANT CHAT
       ========================================== */
    const chatToggle = document.getElementById('chat-toggle-btn');
    const chatPanel = document.getElementById('chat-panel');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatBody = document.getElementById('chat-body');
    const unreadDot = chatToggle ? chatToggle.querySelector('.unread-dot') : null;

    if (chatToggle && chatPanel) {
        chatToggle.addEventListener('click', () => {
            chatPanel.classList.toggle('open');
            if (unreadDot) unreadDot.style.display = 'none';
            
            if (chatPanel.classList.contains('open') && chatInput) {
                chatInput.focus();
            }
        });

        if (closeChat) {
            closeChat.addEventListener('click', () => {
                chatPanel.classList.remove('open');
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendUserMessage();
                }
            });
        }

        if (chatSend) {
            chatSend.addEventListener('click', sendUserMessage);
        }
    }

    function sendUserMessage() {
        if (!chatInput || !chatBody) return;
        const text = chatInput.value.trim();
        if (!text) return;
        
        appendChatMessage(text, 'sent');
        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;
        
        setTimeout(() => {
            const reply = getSimulatedReply(text);
            appendChatMessage(reply, 'received');
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000);
    }

    function appendChatMessage(text, type) {
        if (!chatBody) return;
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg msg-${type}`;
        
        const pText = document.createElement('p');
        pText.textContent = text;
        
        const spanTime = document.createElement('span');
        spanTime.className = 'msg-time';
        spanTime.textContent = timeStr;
        
        msgDiv.appendChild(pText);
        msgDiv.appendChild(spanTime);
        chatBody.appendChild(msgDiv);
    }

    function getSimulatedReply(query) {
        const text = normalizeText(query);
        
        if (text.includes('hola') || text.includes('buenos dias') || text.includes('buenas tardes')) {
            return '¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte hoy con respecto a tu pago en VITPAGO?';
        }
        if (text.includes('cip') || text.includes('codigo')) {
            return 'El código CIP es un código único de 8 dígitos. Puedes pagarlo en efectivo a través de cualquier agente o mediante banca móvil.';
        }
        if (text.includes('comision') || text.includes('cobrar') || text.includes('costo')) {
            return '¡Pagar con VITPAGO no tiene comisión para el comprador! Pagas exactamente el valor de tu compra.';
        }
        if (text.includes('banco') || text.includes('donde pagar') || text.includes('agente')) {
            return 'Puedes pagar en agentes BCP, BBVA, Interbank, Scotiabank, agentes KasNet, Tambo y cajas autorizadas a nivel nacional.';
        }
        
        return 'Para asistirte mejor, por favor envíanos un mensaje detallado a través del Formulario de Contacto o comunícate con nuestro servicio técnico. ¡Estamos a tu servicio!';
    }

});
