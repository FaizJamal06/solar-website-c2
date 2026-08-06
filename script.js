    // ===== PRELOADER =====
    window.addEventListener('load', function() {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('loaded');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      }
    });

    // ===== INITIALIZE AOS =====
    document.addEventListener('DOMContentLoaded', function () {
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: window.innerWidth < 768 ? 10 : 60,
        disable: false
      });
      
      function refreshAOS() {
        AOS.refresh();
        // NOTE: Do NOT call ScrollTrigger.refresh() here.
        // AOS and ScrollTrigger are independent systems. Coupling them
        // causes refresh cascades that corrupt pin-spacer dimensions.
      }

      if (document.readyState === 'complete') {
        refreshAOS();
      } else {
        window.addEventListener('load', refreshAOS);
      }

      // ===== SERVICE CARD SPOTLIGHT GLOW =====
      document.querySelectorAll('.service-card').forEach(card => {
        function handleMove(clientX, clientY) {
          const rect = card.getBoundingClientRect();
          const x = ((clientX - rect.left) / rect.width) * 100;
          const y = ((clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--mx', `${x}%`);
          card.style.setProperty('--my', `${y}%`);
        }
        card.addEventListener('mousemove', function (e) {
          handleMove(e.clientX, e.clientY);
        });
        card.addEventListener('touchmove', function (e) {
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        });
      });

      // ===== PRODUCT CARD 3D TILT =====
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const maxTilt = isMobile ? 4 : 8; // gentler tilt on mobile

      document.querySelectorAll('.product-card').forEach(card => {
        function handleMove(clientX, clientY) {
          const rect = card.getBoundingClientRect();
          const x = clientX - rect.left - rect.width / 2;
          const y = clientY - rect.top - rect.height / 2;
          const rotateX = -(y / (rect.height / 2)) * maxTilt;
          const rotateY = (x / (rect.width / 2)) * maxTilt;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        }
        card.addEventListener('mousemove', function (e) {
          handleMove(e.clientX, e.clientY);
        });
        // On mobile: use touchmove without blocking scroll
        card.addEventListener('touchmove', function (e) {
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        card.addEventListener('mouseleave', function () {
          card.style.transform = '';
        });
        card.addEventListener('touchend', function () {
          card.style.transform = '';
        });
      });

      // ===== PUMP CHECKLIST TOUCH ACTIVATION (MOBILE) =====
      document.querySelectorAll('.pump-check-item').forEach(item => {
        item.addEventListener('touchstart', function () {
          // Remove active from siblings
          document.querySelectorAll('.pump-check-item').forEach(i => i.classList.remove('touch-active'));
          this.classList.add('touch-active');
        }, { passive: true });
      });
      // Clear touch-active when tapping outside
      document.addEventListener('touchstart', function (e) {
        if (!e.target.closest('.pump-check-item')) {
          document.querySelectorAll('.pump-check-item').forEach(i => i.classList.remove('touch-active'));
        }
      }, { passive: true });

      // ===== TIMELINE PROCESS LINE DRAWING =====
      const connector = document.querySelector('.process-connector');
      const stepsContainer = document.querySelector('.process-steps');
      if (connector && stepsContainer) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              connector.classList.add('revealed');
            }
          });
        }, { threshold: 0.1 });
        observer.observe(stepsContainer);
      }

      // ===== WIPE IMAGE REVEALS =====
      // NOTE: This observer must unobserve after first intersection.
      // Without unobserve, every reverse scroll through the process section
      // fires ScrollTrigger.refresh() for each step (4 rapid calls),
      // corrupting the services section pin-spacer dimensions.
      const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target.querySelector('.clip-reveal-img');
            if (img) {
              img.classList.add('revealed');
            }
            // Only observe once — prevents repeated refresh calls on reverse scroll
            imgObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      document.querySelectorAll('.process-step').forEach(step => {
        imgObserver.observe(step);
      });
    });

    // ===== SCROLL PROGRESS BAR =====
    const scrollProgress = document.getElementById('scrollProgress');

    // ===== NAVBAR SCROLL EFFECT & PARALLAX =====
    const navbar = document.getElementById('navbar');
    const hero = document.getElementById('hero');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;

      // Update Scroll Progress
      if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (currentScroll / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
      }

      if (currentScroll > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Parallax effect on Hero background
      if (hero) {
        hero.style.backgroundPositionY = `${currentScroll * 0.45}px`;
      }

      lastScroll = currentScroll;
    }, { passive: true });

    // ===== MOBILE MENU =====
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburgerBtn.addEventListener('click', function () {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    mobileMenuClose.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // ===== STATS COUNTER =====
    const statsGrid = document.getElementById('statsGrid');
    let statsAnimated = false;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animateCounter(el, target, duration, prefix, suffix) {
      const startTime = performance.now();
      prefix = prefix || '';
      suffix = suffix || '';

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = Math.floor(eased * target);

        const prefixHtml = prefix ? `<span class="stat-prefix">${prefix}</span>` : '';
        const suffixHtml = suffix ? `<span class="stat-suffix">${suffix}</span>` : '';

        el.innerHTML = prefixHtml + current.toLocaleString('en-IN') + suffixHtml;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.innerHTML = prefixHtml + target.toLocaleString('en-IN') + suffixHtml;
        }
      }

      requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          const statNumbers = document.querySelectorAll('.stat-number');
          statNumbers.forEach(function (el, index) {
            const target = parseInt(el.dataset.target);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            setTimeout(function () {
              animateCounter(el, target, 2000, prefix, suffix);
            }, index * 150);
          });

          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    if (statsGrid) {
      statsObserver.observe(statsGrid);
    }

    // ===== SAVINGS CALCULATOR =====
    const calcBill = document.getElementById('calcBill');
    const billError = document.getElementById('billError');
    const propertyPills = document.querySelectorAll('#propertyPills .pill-btn');
    const calcSubmit = document.getElementById('calcSubmit');
    const calcResult = document.getElementById('calcResult');

    let selectedPropertyType = 'residential';

    // Property type toggle
    propertyPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        propertyPills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        selectedPropertyType = pill.dataset.value;
      });
    });

    // Clear error on input
    calcBill.addEventListener('input', function () {
      if (calcBill.classList.contains('error')) {
        calcBill.classList.remove('error');
        billError.classList.remove('show');
      }
    });

    function formatINR(num) {
      return '\u20B9' + Math.round(num).toLocaleString('en-IN');
    }

    calcSubmit.addEventListener('click', function () {
      const billVal = parseFloat(calcBill.value);

      // Validation
      if (isNaN(billVal) || billVal < 100 || billVal > 500000) {
        calcBill.classList.add('error');
        billError.classList.add('show');
        calcResult.classList.remove('show');
        calcResult.classList.remove('active');
        return;
      }

      calcBill.classList.remove('error');
      billError.classList.remove('show');

      const isResidential = selectedPropertyType === 'residential';
      const TARIFF = 8;
      const UNITS_PER_KW = 120;
      const COST_PER_KW = 55000;
      const SELF_CONSUMPTION = 0.80;

      // STEP 1: Monthly units consumed
      const monthlyUnits = billVal / TARIFF;

      // STEP 2: Required system size (round up to nearest 0.5 kW)
      let rawSize = monthlyUnits / UNITS_PER_KW;
      let systemSize = Math.ceil(rawSize * 2) / 2;
      const cap = isResidential ? 10 : 100;
      systemSize = Math.min(systemSize, cap);
      if (systemSize < 0.5) systemSize = 0.5;

      // STEP 3: Monthly solar generation & units saved
      const monthlyGeneration = systemSize * UNITS_PER_KW;
      const monthlyUnitsSaved = monthlyUnits * SELF_CONSUMPTION;

      // STEP 4: Monthly savings
      const monthlySavings = monthlyUnitsSaved * TARIFF;
      const newMonthlyBill = Math.max(0, billVal - monthlySavings);

      // STEP 5: Annual savings
      const annualSavings = monthlySavings * 12;

      // STEP 6: System cost
      const totalCost = systemSize * COST_PER_KW;

      // STEP 7: PM Surya Ghar subsidy (residential only)
      let subsidy = 0;
      if (isResidential) {
        if (systemSize >= 3) subsidy = 78000;
        else if (systemSize >= 2) subsidy = 60000;
        else subsidy = 30000;
      }

      // STEP 8: Net cost
      const netCost = totalCost - subsidy;

      // STEP 9: Payback period
      const paybackYears = annualSavings > 0 ? (netCost / annualSavings).toFixed(1) : '—';

      // STEP 10: 25-year lifetime savings
      const lifetimeSavings = annualSavings * 25;

      // Update DOM
      document.getElementById('resultSize').textContent = systemSize + ' kW';
      document.getElementById('resultMonthlySavings').textContent = formatINR(monthlySavings);
      document.getElementById('resultNewBill').textContent = formatINR(newMonthlyBill);
      document.getElementById('resultCost').textContent = formatINR(totalCost);
      document.getElementById('resultSubsidy').textContent = formatINR(subsidy);
      document.getElementById('resultNetCost').textContent = formatINR(netCost);
      document.getElementById('resultPayback').textContent = paybackYears + ' yrs';
      document.getElementById('resultLifetime').textContent = formatINR(lifetimeSavings);

      // Reset contact button state
      const quoteBtn = document.getElementById('calcQuoteBtn');
      const contactSuccess = document.getElementById('calcContactSuccess');
      if (quoteBtn && contactSuccess) {
        quoteBtn.style.display = 'block';
        contactSuccess.classList.remove('show');
      }

      calcResult.classList.add('show');
      calcResult.classList.add('active');
    });

    // Inline contact success for calculator
    const calcQuoteBtn = document.getElementById('calcQuoteBtn');
    const calcContactSuccess = document.getElementById('calcContactSuccess');
    if (calcQuoteBtn && calcContactSuccess) {
      calcQuoteBtn.addEventListener('click', function () {
        calcQuoteBtn.style.display = 'none';
        calcContactSuccess.classList.add('show');
      });
    }

    // ===== HERO QUOTE FORM =====
    const heroQuoteForm = document.getElementById('heroQuoteForm');
    const heroSuccessMsg = document.getElementById('heroSuccessMsg');

    if (heroQuoteForm) {
      heroQuoteForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        const name = document.getElementById('heroName');
        const phone = document.getElementById('heroPhone');
        const pin = document.getElementById('heroPin');
        const product = document.getElementById('heroProduct');

        [name, phone, pin, product].forEach(function (field) {
          field.classList.remove('error');
        });

        if (!name.value.trim() || name.value.trim().length < 2) {
          name.classList.add('error');
          isValid = false;
        }

        if (!phone.value.trim() || phone.value.trim().length !== 10) {
          phone.classList.add('error');
          isValid = false;
        }

        if (!pin.value.trim() || pin.value.trim().length !== 6) {
          pin.classList.add('error');
          isValid = false;
        }

        if (!product.value) {
          product.classList.add('error');
          isValid = false;
        }

        if (isValid) {
          heroQuoteForm.style.display = 'none';
          heroSuccessMsg.style.display = 'block';
        }
      });
    }

    ['heroPhone', 'heroPin'].forEach(function (id) {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener('input', function (e) {
          e.target.value = e.target.value.replace(/\D/g, '');
        });
      }
    });

    // ===== LEAD FORM =====
    const leadForm = document.getElementById('leadForm');
    const leadBillPills = document.querySelectorAll('#leadBillPills .pill-btn');
    const leadSuccess = document.getElementById('leadSuccess');
    let leadSelectedBill = null;

    leadBillPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        leadBillPills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        leadSelectedBill = parseInt(pill.dataset.value);
      });
    });

    // Restrict numeric inputs
    ['leadPhone', 'leadPin'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\D/g, '');
      });
    });

    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('leadName');
      const phone = document.getElementById('leadPhone');
      const pin = document.getElementById('leadPin');
      const terms = document.getElementById('leadTerms');

      [name, phone, pin].forEach(function (field) {
        field.classList.remove('error');
      });

      if (!name.value.trim() || name.value.trim().length < 2) {
        name.classList.add('error');
        isValid = false;
      }

      if (!phone.value.trim() || phone.value.trim().length !== 10) {
        phone.classList.add('error');
        isValid = false;
      }

      if (!pin.value.trim() || pin.value.trim().length !== 6) {
        pin.classList.add('error');
        isValid = false;
      }

      if (!terms.checked) {
        isValid = false;
        terms.parentElement.style.animation = 'shake 0.4s ease';
        setTimeout(function () {
          terms.parentElement.style.animation = '';
        }, 400);
      }

      if (isValid) {
        leadForm.style.display = 'none';
        leadSuccess.classList.add('show');
      }
    });

    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach(function (faq) {
          faq.classList.remove('active');
        });

        // Open clicked if it was closed
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });

    // ===== TESTIMONIAL AUTO-SCROLL =====
    const testimonialsScroll = document.getElementById('testimonialsScroll');
    let testimonialIndex = 0;

    function autoScrollTestimonials() {
      const cards = testimonialsScroll.querySelectorAll('.testimonial-card');
      if (cards.length === 0) return;

      testimonialIndex = (testimonialIndex + 1) % cards.length;
      const cardWidth = cards[0].offsetWidth + 20; // including gap

      testimonialsScroll.scrollTo({
        left: testimonialIndex * cardWidth,
        behavior: 'smooth'
      });
    }

    setInterval(autoScrollTestimonials, 4000);

    // ===== MOBILE STICKY FORM =====
    const mobileStickyForm = document.getElementById('mobileStickyForm');
    const closeStickyForm = document.getElementById('closeStickyForm');
    const stickySubmit = document.getElementById('stickySubmit');
    let stickyShown = false;

    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 300 && !stickyShown && !sessionStorage.getItem('stickyClosed')) {
        stickyShown = true;
        mobileStickyForm.classList.add('show');
      }
    }, { passive: true });

    closeStickyForm.addEventListener('click', function () {
      mobileStickyForm.classList.remove('show');
      sessionStorage.setItem('stickyClosed', 'true');
    });

    stickySubmit.addEventListener('click', function () {
      const sName = document.getElementById('stickyName').value.trim();
      const sPhone = document.getElementById('stickyPhone').value.trim();
      const sPin = document.getElementById('stickyPin').value.trim();

      if (sName && sPhone.length === 10 && sPin.length === 6) {
        mobileStickyForm.innerHTML = '<div style="padding:16px;text-align:center;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 8px;display:block;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><p style="font-size:14px;color:var(--navy);font-weight:600;">Submitted! We\'ll call you within 2 hours.</p></div>';
        setTimeout(function () {
          mobileStickyForm.classList.remove('show');
        }, 3000);
      } else {
        mobileStickyForm.querySelectorAll('.form-input').forEach(function (input) {
          if (!input.value.trim()) {
            input.style.borderColor = '#EF4444';
            setTimeout(function () { input.style.borderColor = ''; }, 2000);
          }
        });
      }
    });

    ['stickyPhone', 'stickyPin'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\D/g, '');
      });
    });

    // ===== GSAP + ScrollTrigger =====
    gsap.registerPlugin(ScrollTrigger);

    // ===== 3D STICKY CARD STACK (GSAP + ScrollTrigger) FOR SERVICES =====

    function initServicesCardStack() {
      const container = document.getElementById('servicesCardsContainer');
      const wrapper = document.getElementById('servicesCardsWrapper');
      if (!container || !wrapper) return;

      const cards = wrapper.querySelectorAll('.services-card');
      const totalCards = cards.length;
      if (totalCards < 2) return;

      // 1. Clean up existing instance if re-initializing to prevent duplicate pin spacers (huge whitespace bug)
      const existing = ScrollTrigger.getById('servicesScrollTrigger');
      if (existing) {
        existing.kill();
      }

      // Define 3D card states
      const STATES = {
        past: {
          y: -250,
          z: -100,
          rotationX: -45,
          scale: 0.9,
          opacity: 0
        },
        present: {
          y: 0,
          z: 0,
          rotationX: 0,
          scale: 1,
          opacity: 1
        },
        future: {
          y: 40,
          z: -80
        }
      };

      // Set initial card positions
      cards.forEach((card, i) => {
        const scaleOffset = 1 - (i * 0.04);
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          y: i === 0 ? STATES.present.y : STATES.future.y * i,
          z: i === 0 ? STATES.present.z : -80 * i,
          rotationX: i === 0 ? STATES.present.rotationX : 0,
          scale: scaleOffset,
          opacity: 1,
          zIndex: i === 0 ? totalCards + 1 : totalCards - i
        });
      });

      // 2. Create a formal timeline mapped to the scroll progress (fixes reverse scroll and state persistence)
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'servicesScrollTrigger',
          trigger: container,
          start: 'top top',
          // Reduce scroll distance so the user doesn't have to swipe/scroll as much (especially on mobile)
          end: () => '+=' + (window.innerHeight * (totalCards * 0.6)),
          pin: true,
          scrub: 1, // Smooth scrubbing natively managed by GSAP
          anticipatePin: 1 // Smooth pin transition on reverse scroll (prevents visual jump)
        }
      });

      // For each scroll segment (one per card transitioning out)
      for (let i = 0; i < totalCards - 1; i++) {
        // We use absolute timeline labels (0, 1, 2) to sync animations
        const time = i;

        // A. The active card (i) moves to the PAST
        tl.to(cards[i], {
          y: STATES.past.y,
          z: STATES.past.z,
          rotationX: STATES.past.rotationX,
          scale: STATES.past.scale,
          opacity: STATES.past.opacity,
          zIndex: i,
          ease: "power2.inOut"
        }, time);

        // B. The next card (i+1) moves to the PRESENT
        tl.to(cards[i + 1], {
          y: STATES.present.y,
          z: STATES.present.z,
          rotationX: STATES.present.rotationX,
          scale: STATES.present.scale,
          opacity: STATES.present.opacity,
          zIndex: totalCards + 1,
          ease: "power2.inOut"
        }, time);

        // C. Any future cards (i+2 and beyond) shift forward
        for (let j = i + 2; j < totalCards; j++) {
          const futureDepth = j - (i + 1);
          tl.to(cards[j], {
            y: STATES.future.y * futureDepth,
            z: -80 * futureDepth,
            scale: 1 - (futureDepth * 0.04),
            zIndex: totalCards - futureDepth,
            ease: "power2.inOut"
          }, time);
        }
      }
    }

    // Initialize GSAP properly, ensuring it runs even if load event already fired
    function runGSAPInit() {
      initServicesCardStack();

      // Single delayed refresh after layout has fully stabilized.
      // Uses rAF + setTimeout to guarantee all painting/layout is complete.
      // This replaces the old ResizeObserver (which caused a feedback loop:
      //   refresh → body height change → ResizeObserver → refresh → ...)
      // and the old global image load listener (which fired refresh for
      //   every image on the page, including during reverse scrolling).
      requestAnimationFrame(() => {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 300);
      });

      // Handle genuine viewport changes (window resize, orientation change)
      // with a proper 500ms debounce — safe because resize events don't
      // create a feedback loop (refresh doesn't fire a resize event).
      let windowResizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(windowResizeTimer);
        windowResizeTimer = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 500);
      });
    }

    if (document.readyState === 'complete') {
      runGSAPInit();
    } else {
      window.addEventListener('load', runGSAPInit);
    }



