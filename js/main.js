        

        const getAssetPath = (path) => {
            const isSubPage = window.location.pathname.includes('/html/');
            return isSubPage ? '../' + path : path;
        };

        let currentLang = localStorage.getItem('dr_altomoor_lang') || 'en';
        let currentFilter = 'all';
        let currentSearchQuery = '';
        let filteredCertificates = CERTIFICATES_DATA;
        let currentModalIndex = 0;

        // Modal DOM Elements
        const modal = document.getElementById('cert-modal');
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalCategory = document.getElementById('modal-category-badge');
        const modalYear = document.getElementById('modal-year-badge');
        const modalIssuer = document.getElementById('modal-issuer');
        const modalVenue = document.getElementById('modal-venue');
        const modalCredits = document.getElementById('modal-credits');
        const modalDesc = document.getElementById('modal-desc');
        const modalDownload = document.getElementById('modal-download-btn');
        const modalClose = document.getElementById('modal-close-btn');
        const modalPrev = document.getElementById('modal-prev-btn');
        const modalNext = document.getElementById('modal-next-btn');
        const modalIndexIndicator = document.getElementById('modal-index-indicator');

        function openCertModal(index) {
            if (!filteredCertificates || filteredCertificates.length === 0) {
                filteredCertificates = CERTIFICATES_DATA;
            }
            currentModalIndex = index;
            updateModalContent();
            modal.style.display = 'flex';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeCertModal() {
            modal.style.display = 'none';
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function updateModalContent() {
            if (!filteredCertificates || filteredCertificates.length === 0) return;
            const cert = filteredCertificates[currentModalIndex];
            if (!cert) return;

            const isAr = currentLang === 'ar';
            modalImg.src = getAssetPath(cert.image);
            modalTitle.textContent = isAr ? cert.title_ar : cert.title_en;
            modalCategory.textContent = isAr ? cert.category_ar : cert.category_en;
            modalYear.textContent = cert.year;
            modalIssuer.textContent = isAr ? cert.issuer_ar : cert.issuer_en;
            modalVenue.textContent = `${isAr ? cert.venue_ar : cert.venue_en} (${isAr ? cert.date_ar : cert.date_en})`;
            modalCredits.textContent = isAr ? cert.credits_ar : cert.credits_en;
            modalDesc.textContent = isAr ? cert.desc_ar : cert.desc_en;
            modalDownload.href = getAssetPath(cert.image);
            modalIndexIndicator.textContent = `${currentModalIndex + 1} / ${filteredCertificates.length}`;
        }

        if (modalClose) modalClose.onclick = closeCertModal;
        if (modal) {
            modal.onclick = (e) => {
                if (e.target === modal) closeCertModal();
            };
        }

        if (modalPrev) {
            modalPrev.onclick = (e) => {
                e.stopPropagation();
                if (currentModalIndex > 0) {
                    currentModalIndex--;
                } else {
                    currentModalIndex = filteredCertificates.length - 1;
                }
                updateModalContent();
            };
        }

        if (modalNext) {
            modalNext.onclick = (e) => {
                e.stopPropagation();
                if (currentModalIndex < filteredCertificates.length - 1) {
                    currentModalIndex++;
                } else {
                    currentModalIndex = 0;
                }
                updateModalContent();
            };
        }

        window.addEventListener('keydown', (e) => {
            if (modal.style.display === 'flex') {
                if (e.key === 'Escape') closeCertModal();
                if (e.key === 'ArrowRight') {
                    if (currentLang === 'ar') modalPrev.click();
                    else modalNext.click();
                }
                if (e.key === 'ArrowLeft') {
                    if (currentLang === 'ar') modalNext.click();
                    else modalPrev.click();
                }
            }
        });

        // Render Certificates Grid
        const certsGrid = document.getElementById('certificates-grid');
        const noResults = document.getElementById('no-cert-results');
        const certCountBadge = document.getElementById('cert-count-badge');
        const searchInput = document.getElementById('cert-search-input');
        const filterTabs = document.querySelectorAll('#cert-filter-tabs .filter-tab');

        function renderCertificates() {
            if (!certsGrid) return;
            filteredCertificates = CERTIFICATES_DATA.filter(item => {
                const matchesCategory = (currentFilter === 'all') || (item.category === currentFilter);
                const searchLower = currentSearchQuery.toLowerCase();
                const textPool = `${item.title_ar} ${item.title_en} ${item.issuer_ar} ${item.issuer_en} ${item.desc_ar} ${item.desc_en} ${item.year} ${item.credits_ar} ${item.credits_en}`.toLowerCase();
                const matchesSearch = !currentSearchQuery || textPool.includes(searchLower);
                return matchesCategory && matchesSearch;
            });

            const isAr = currentLang === 'ar';
            certCountBadge.textContent = isAr 
                ? `${filteredCertificates.length} وثيقة وشهادة` 
                : `${filteredCertificates.length} Certificates & Docs`;

            certsGrid.innerHTML = '';
            if (filteredCertificates.length === 0) {
                noResults.classList.remove('hidden');
                return;
            }
            noResults.classList.add('hidden');

            filteredCertificates.forEach((item, index) => {
                const title = isAr ? item.title_ar : item.title_en;
                const issuer = isAr ? item.issuer_ar : item.issuer_en;
                const category = isAr ? item.category_ar : item.category_en;
                const credits = isAr ? item.credits_ar : item.credits_en;

                const card = document.createElement('div');
                card.className = 'relative rounded-3xl overflow-hidden cursor-pointer group flex flex-col shadow-lg border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-900 w-[calc(50%-12px)] sm:w-[calc(50%-20px)] lg:w-[calc(25%-20px)] m-1.5 sm:m-2.5 shrink-0';
                card.onclick = () => openCertModal(index);

                card.innerHTML = `
                    <div class="relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-950 overflow-hidden shrink-0">
                        <img src="${getAssetPath(item.image)}" alt="${title}" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" loading="lazy">
                        <div class="absolute inset-0 bg-gradient-to-t from-navyDark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span class="bg-royalBlue text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                                <i class="fa-solid fa-expand"></i>
                                ${isAr ? 'عرض الشهادة بالكامل' : 'View Full Certificate'}
                            </span>
                        </div>
                        <span class="absolute top-2.5 right-2.5 rtl:right-2.5 rtl:left-auto ltr:left-2.5 ltr:right-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-navyDark dark:text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow">
                            ${item.year}
                        </span>
                    </div>
                    <div class="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 text-center w-full">
                        <div class="w-full">
                            <span class="text-[10px] font-bold text-royalBlue dark:text-softCyan uppercase tracking-wide block mb-1">
                                ${category}
                            </span>
                            <h3 class="text-xs sm:text-sm font-extrabold text-navyDark dark:text-white line-clamp-2 leading-snug">
                                ${title}
                            </h3>
                        </div>
                        <div class="pt-2 w-full border-t border-slate-200 dark:border-slate-700/70 flex flex-wrap items-center justify-center gap-1.5 text-[10px] sm:text-[11px]">
                            <span class="text-graytext dark:text-slate-400 truncate max-w-full font-medium">
                                ${issuer}
                            </span>
                            <span class="text-emeraldBadge font-extrabold shrink-0">
                                ${credits.split('(')[0].trim()}
                            </span>
                        </div>
                    </div>
                `;
                certsGrid.appendChild(card);
            });
        }
        // Filter Tabs
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                filterTabs.forEach(t => {
                    t.classList.remove('active', 'bg-navyDark', 'text-white');
                    t.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-dark', 'dark:text-slate-200');
                });
                tab.classList.add('active', 'bg-navyDark', 'text-white');
                tab.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-dark', 'dark:text-slate-200');
                currentFilter = tab.getAttribute('data-filter');
                renderCertificates();
            });
        });

        // Search Input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearchQuery = e.target.value.trim();
                renderCertificates();
            });
        }

        // Language Switch
        const scalpelBtn = document.getElementById('scalpel-lang-btn');
        const scalpelBlade = scalpelBtn.querySelector('.scalpel-blade-indicator');

        function applyLanguage(lang) {
            currentLang = lang;
            localStorage.setItem('dr_altomoor_lang', lang);

            if (lang === 'en') {
                document.documentElement.lang = 'en';
                document.documentElement.dir = 'ltr';
                if (scalpelBlade) scalpelBlade.classList.add('en-active');
                if (searchInput) searchInput.placeholder = 'Search by name, issuer or topic...';
            } else {
                document.documentElement.lang = 'ar';
                document.documentElement.dir = 'rtl';
                if (scalpelBlade) scalpelBlade.classList.remove('en-active');
                if (searchInput) searchInput.placeholder = 'ابحث بالاسم أو الجهة أو الموضوع...';
            }
            if (typeof renderCertificates === 'function') renderCertificates();
            if (modal && modal.style.display === 'flex' && typeof updateModalContent === 'function') {
                updateModalContent();
            }
        }

        if (scalpelBtn) {
            scalpelBtn.addEventListener('click', () => {
                const nextLang = currentLang === 'ar' ? 'en' : 'ar';
                applyLanguage(nextLang);
            });
        }

        // Theme Switch
        const themeBtn = document.getElementById('theme-toggle-btn');
        const themeIcon = document.getElementById('theme-icon');
        const savedTheme = localStorage.getItem('dr_altomoor_theme') || 'dark';

        function applyTheme(theme) {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('dr_altomoor_theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('dr_altomoor_theme', 'light');
            }
        }

        themeBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            applyTheme(isDark ? 'light' : 'dark');
        });

        // Navbar Scroll & Mobile Menu
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('shadow-xl', 'py-1');
                navbar.classList.remove('py-2');
            } else {
                navbar.classList.remove('shadow-xl', 'py-1');
                navbar.classList.add('py-2');
            }
        });

        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileBtn && mobileMenu) {
            // Close mobile menu on link click
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('opacity-100', 'scale-100', 'translate-y-0', 'visible');
                    mobileMenu.classList.add('opacity-0', 'scale-95', '-translate-y-4', 'invisible');
                });
            });
            mobileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = mobileMenu.classList.contains('opacity-100');
                if (isOpen) {
                    mobileMenu.classList.remove('opacity-100', 'scale-100', 'translate-y-0', 'visible');
                    mobileMenu.classList.add('opacity-0', 'scale-95', '-translate-y-4', 'invisible');
                } else {
                    mobileMenu.classList.remove('opacity-0', 'scale-95', '-translate-y-4', 'invisible');
                    mobileMenu.classList.add('opacity-100', 'scale-100', 'translate-y-0', 'visible', 'flex');
                }
            });

            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target) && mobileMenu.classList.contains('opacity-100')) {
                    mobileMenu.classList.remove('opacity-100', 'scale-100', 'translate-y-0', 'visible');
                    mobileMenu.classList.add('opacity-0', 'scale-95', '-translate-y-4', 'invisible');
                }
            });
        }

        // Background Particles Canvas
        const canvas = document.getElementById('medical-particles-bg');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let particles = [];
            let mouse = { x: null, y: null, radius: 140 };

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2.5 + 1;
                    this.vx = (Math.random() - 0.5) * 0.6;
                    this.vy = (Math.random() - 0.5) * 0.6;
                    this.color = Math.random() > 0.5 ? '#4274D9' : '#95CCDD';
                }
                draw() {
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
                }
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
                }
            }

            function initParticles() {
                particles = [];
                const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 70);
                for (let i = 0; i < count; i++) particles.push(new Particle());
            }

            function connectParticles() {
                const isDark = document.documentElement.classList.contains('dark');
                const maxDistance = 120;
                for (let a = 0; a < particles.length; a++) {
                    for (let b = a; b < particles.length; b++) {
                        const dx = particles[a].x - particles[b].x;
                        const dy = particles[a].y - particles[b].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < maxDistance) {
                            ctx.beginPath();
                            ctx.strokeStyle = isDark ? `rgba(149, 204, 221, ${1 - distance/maxDistance})` : `rgba(66, 116, 217, ${0.4 - (distance/maxDistance)*0.4})`;
                            ctx.lineWidth = 1;
                            ctx.moveTo(particles[a].x, particles[a].y);
                            ctx.lineTo(particles[b].x, particles[b].y);
                            ctx.stroke();
                        }
                    }
                }
            }

            function animateCanvas() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < particles.length; i++) {
                    particles[i].draw();
                    particles[i].update();
                }
                connectParticles();
                requestAnimationFrame(animateCanvas);
            }

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                initParticles();
            }

            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();
            animateCanvas();
        }

        // Initialize theme & language
        applyTheme(savedTheme);
        applyLanguage(currentLang);
