 // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(element => {
            observer.observe(element);
        });

        // Animate progress bars when in view
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.progress-fill');
                    progressBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 200);
                    });
                    progressObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const skillsSection = document.querySelector('#skills');
        if (skillsSection) {
            progressObserver.observe(skillsSection);
        }

        // Load locally edited projects and skills when an editor backup exists in this browser.
        try {
            const portfolio = JSON.parse(localStorage.getItem('sukumarPortfolioDataV1') || 'null');
            if (portfolio) {
                const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
                const safeUrl = value => { try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
                const skills = document.querySelector('.skills-container');
                if (skills && Array.isArray(portfolio.skills)) skills.innerHTML = portfolio.skills.map(skill => `<article class="skill-card"><div class="skill-icon">âœ³</div><h3>${esc(skill.name)}</h3><p>${esc(skill.description)}</p><div class="skill-level"><div class="progress-bar"><div class="progress-fill" style="width:${Math.max(0,Math.min(100,Number(skill.level)||0))}%"></div></div></div></article>`).join('');
                const projects = document.querySelector('.projects-grid');
                if (projects && Array.isArray(portfolio.projects)) projects.innerHTML = portfolio.projects.map(project => {
                    const tags = String(project.tech || '').split(',').map(tag => tag.trim()).filter(Boolean);
                    const repo = safeUrl(project.repo), demo = safeUrl(project.demo);
                    return `<article class="project-card"><div class="project-image">âœ³</div><div class="project-content"><p class="project-kicker">SELECTED PROJECT</p><h3>${esc(project.title)}</h3><p>${esc(project.description)}</p><div class="tech-tags">${tags.map(tag => `<span class="tech-tag">${esc(tag)}</span>`).join('')}</div><div class="project-links">${repo ? `<a href="${esc(repo)}" target="_blank" rel="noopener noreferrer">Repository â†—</a>` : ''}${demo ? `<a href="${esc(demo)}" target="_blank" rel="noopener noreferrer">Live demo â†—</a>` : ''}</div></div></article>`;
                }).join('');
            }
        } catch (error) { console.warn('Portfolio editor data could not be loaded.', error); }

        // Apply every editable profile field, while keeping older project/skill backups compatible.
        (() => {
            const base = window.PORTFOLIO_DEFAULTS;
            let saved = {};
            try { saved = JSON.parse(localStorage.getItem('sukumarPortfolioDataV1') || '{}') || {}; } catch {}
            const data = {
                ...base, ...saved,
                profile: { ...base.profile, ...(saved.profile || {}) },
                labels: { ...base.labels, ...(saved.labels || {}) },
                education: { ...base.education, ...(saved.education || {}) },
                contact: { ...base.contact, ...(saved.contact || {}) },
                stats: base.stats.map((item,i)=>({ ...item, ...((saved.stats || [])[i] || {}) })),
                skills: Array.isArray(saved.skills) ? saved.skills : base.skills,
                projects: Array.isArray(saved.projects) ? saved.projects : base.projects,
                introduction: base.introduction.map((item,i)=>({ ...item, ...((saved.introduction || [])[i] || {}) }))
            };
            window.sitePortfolio = data;
            const text = (selector,value) => { const node=document.querySelector(selector); if(node)node.textContent=value||''; };
            const safeLink = value => { try { const url=new URL(value); return ['https:','http:'].includes(url.protocol)?url.href:''; } catch { return ''; } };
            const safeMail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value||'')?value:'';
            const safePhone = value => /^[+\d().\-\s]{6,}$/.test(value||'')?value:'';
            const escape = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
            const p=data.profile,l=data.labels,e=data.education,c=data.contact;
            document.title=`${p.name} â€” Software Developer`;
            const descriptionMeta=document.querySelector('#site-description'); if(descriptionMeta)descriptionMeta.setAttribute('content',p.description);
            text('#profile-name',p.name); text('#intro-name',`${p.name}.`);
            text('#profile-role',p.role); text('#profile-tagline',p.tagline); text('#profile-availability',p.availability.toUpperCase());
            text('#profile-location-short',c.location.split(',')[0].toUpperCase());
            text('#about-heading',p.aboutHeading); text('#about-intro',p.aboutIntro); text('#about-focus',p.aboutFocus); text('#about-goal',p.aboutGoal);
            ['home','about','skills','education','projects','contact'].forEach((key,i)=>text(`#nav-${key}`,l[['navHome','navAbout','navSkills','navEducation','navProjects','navContact'][i]]));
            ['about','skills','education','projects','contact'].forEach(key=>text(`#title-${key}`,l[key]));
            text('#cta-work',l.viewWork); text('#cta-contact',l.contactCta); text('#footer-text',l.footer); text('#education-degree',e.degree);
            text('#education-institution',e.institution); text('#education-year',e.year); text('#education-completed',e.completed); text('#education-cgpa',e.cgpa);
            document.querySelectorAll('.stats .stat-card').forEach((card,i)=>{ const item=data.stats[i]||{}; textFrom(card,'.number',item.value); textFrom(card,'.label',item.label); });
            function textFrom(root,selector,value){const node=root.querySelector(selector);if(node)node.textContent=value||'';}
            const email=safeMail(c.email),phone=safePhone(c.phone);
            const emailNode=document.querySelector('#contact-email'); if(emailNode){emailNode.textContent=email;emailNode.href=email?`mailto:${email}`:'#';emailNode.closest('.contact-item').hidden=!email;}
            const phoneNode=document.querySelector('#contact-phone'); if(phoneNode){phoneNode.textContent=phone;phoneNode.href=phone?`tel:${phone.replace(/[^+\d]/g,'')}`:'#';phoneNode.closest('.contact-item').hidden=!phone;}
            text('#contact-location',c.location); text('#contact-email-label',l.email); text('#contact-phone-label',l.phone); text('#contact-location-label',l.location);
            const social=document.querySelectorAll('.social-links a');
            [[safeLink(c.linkedin),'LinkedIn','in'],[safeLink(c.github),'GitHub','GH'],[email?`mailto:${email}`:'','Email','@']].forEach(([url,title,label],i)=>{const node=social[i];if(node){node.hidden=!url;if(url)node.href=url;node.title=title;node.setAttribute('aria-label',title);node.textContent=label;}});
            const skillsNode=document.querySelector('.skills-container');
            if(skillsNode)skillsNode.innerHTML=data.skills.map(s=>`<article class="skill-card"><div class="skill-icon">âœ³</div><h3>${escape(s.name)}</h3><p>${escape(s.description)}</p><div class="skill-level"><div class="progress-bar"><div class="progress-fill" style="width:${Math.max(0,Math.min(100,Number(s.level)||0))}%"></div></div></div></article>`).join('');
            const projectsNode=document.querySelector('.projects-grid');
            if(projectsNode)projectsNode.innerHTML=data.projects.map(project=>{const tags=String(project.tech||'').split(',').map(tag=>tag.trim()).filter(Boolean),repo=safeLink(project.repo),demo=safeLink(project.demo);return `<article class="project-card"><div class="project-image">âœ³</div><div class="project-content"><p class="project-kicker">SELECTED PROJECT</p><h3>${escape(project.title)}</h3><p>${escape(project.description)}</p><div class="tech-tags">${tags.map(tag=>`<span class="tech-tag">${escape(tag)}</span>`).join('')}</div><div class="project-links">${repo?`<a href="${escape(repo)}" target="_blank" rel="noopener noreferrer">Repository â†—</a>`:''}${demo?`<a href="${escape(demo)}" target="_blank" rel="noopener noreferrer">Live demo â†—</a>`:''}</div></div></article>`;}).join('');
        })();
        document.querySelectorAll('.project-kicker').forEach(node => node.textContent=window.sitePortfolio.labels.projectKicker);
        document.querySelectorAll('.project-card').forEach((card,index)=>{
            const project=window.sitePortfolio.projects[index];
            if(!project||!project.image)return;
            try {
                const url=new URL(project.image);
                if(!['https:','http:'].includes(url.protocol))return;
                const image=document.createElement('img');image.src=url.href;image.alt=`${project.title} project preview`;image.loading='lazy';
                card.querySelector('.project-image').replaceChildren(image);
            } catch {}
        });

        // Add active nav state on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // 30 second illustrated introduction. Speech starts only after an intentional click,
        // because modern browsers block unsolicited audio.
        (() => {
            const overlay = document.querySelector('#intro-overlay');
            if (!overlay || sessionStorage.getItem('sukumarIntroSeen') === 'yes') return;
            const startButton = document.querySelector('#intro-start');
            const muteButton = document.querySelector('#intro-mute');
            const skipButton = document.querySelector('#intro-skip');
            const caption = document.querySelector('#intro-caption');
            const progress = document.querySelector('#intro-progress-fill');
            const hint = document.querySelector('#intro-hint');
            const figures = document.querySelectorAll('.intro-avatar, .hero-art img');
            const stillFrame = new URL('avatar-sukumar.png', document.baseURI).href;
            const talkFrame = new URL('avatar-sukumar-talk.png', document.baseURI).href;
            let stages = [
                { at: 0, text: 'Hi, Iâ€™m Sukumar Macha from Hyderabad, India. I enjoy building useful digital experiences.', voice: 'Iâ€™m Sukumar Macha from Hyderabad, India. I build useful digital experiences and solve practical problems.' },
                { at: 7.5, text: 'My toolkit includes Python, Java, web development and MySQL, with a growing interest in machine learning.', voice: 'My toolkit includes Python, Java, web development, MySQL, and a growing interest in machine learning.' },
                { at: 15, text: 'My projects include CNN based skin disease detection and a machine learning drug recommendation app.', voice: 'My projects explore C N N based skin disease detection and a machine learning drug recommendation app made with Streamlit.' },
                { at: 22.5, text: 'Iâ€™m studying engineering at Trinity College with an 8.30 CGPA. Thanks for visiting!', voice: 'Iâ€™m studying engineering at Trinity College with an eight point three zero C G P A. Explore my work and say hello.' }
            ];
            if (window.sitePortfolio?.introduction) stages = window.sitePortfolio.introduction.map((item,i)=>({at:i*7.5,text:item.caption,voice:item.voice}));
            let elapsed = 0, lastStage = -1, muted = false, running = false, timer = null, frameTimer = null;
            const voices = () => window.speechSynthesis ? speechSynthesis.getVoices() : [];
            function stopCharacterMotion() {
                if (frameTimer) clearInterval(frameTimer);
                frameTimer = null;
                figures.forEach(figure => { figure.src = stillFrame; });
                overlay.classList.remove('is-speaking');
            }
            function speak(stage) {
                if (!running || muted || !window.speechSynthesis) return;
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(stage.voice);
                utterance.lang = 'en-IN'; utterance.rate = 0.9; utterance.pitch = 0.9;
                utterance.onstart = () => {
                    stopCharacterMotion();
                    overlay.classList.add('is-speaking');
                    let talking = false;
                    frameTimer = setInterval(() => {
                        talking = !talking;
                        figures.forEach(figure => { figure.src = talking ? talkFrame : stillFrame; });
                    }, 700);
                };
                utterance.onend = stopCharacterMotion;
                utterance.onerror = stopCharacterMotion;
                const available = voices();
                utterance.voice = available.find(v => /en/i.test(v.lang) && /male|david|mark|daniel|rishi|aaron|guy|james|arjun|prabhat|hemant|ravi/i.test(v.name)) || available.find(v => /en-IN/i.test(v.lang)) || available.find(v => /en/i.test(v.lang)) || null;
                speechSynthesis.speak(utterance);
            }
            function closeIntro() {
                if (window.speechSynthesis) speechSynthesis.cancel();
                stopCharacterMotion();
                sessionStorage.setItem('sukumarIntroSeen', 'yes');
                overlay.classList.add('intro-closing');
                setTimeout(() => overlay.remove(), 450);
            }
            function tick() {
                elapsed += 0.1;
                progress.style.width = `${Math.min(100, elapsed / 30 * 100)}%`;
                const stageIndex = Math.min(stages.length - 1, Math.floor(elapsed / 7.5));
                if (stageIndex !== lastStage) {
                    lastStage = stageIndex;
                    caption.textContent = stages[stageIndex].text;
                    if (running) speak(stages[stageIndex]);
                }
                if (elapsed >= 30) { clearInterval(timer); closeIntro(); }
            }
            overlay.hidden = false;
            if (!window.speechSynthesis) {
                startButton.disabled = true;
                startButton.textContent = 'Voice not supported';
                hint.textContent = 'Captions will play; this browser does not provide speech playback.';
            }
            startButton.addEventListener('click', () => {
                if (running) return;
                running = true; lastStage = 0; startButton.disabled = true; startButton.textContent = 'âœ“  Voice introduction on';
                muteButton.disabled = false; hint.textContent = 'The introduction closes in 30 seconds';
                if (window.speechSynthesis && speechSynthesis.getVoices().length === 0) speechSynthesis.onvoiceschanged = () => { if (lastStage >= 0) speak(stages[lastStage]); };
                speak(stages[0]);
                timer = setInterval(tick, 100);
            });
            muteButton.addEventListener('click', () => {
                muted = !muted;
                muteButton.setAttribute('aria-pressed', String(muted));
                muteButton.textContent = muted ? 'ðŸ”‡  Voice muted' : 'ðŸ”Š  Mute voice';
                if (muted && window.speechSynthesis) speechSynthesis.cancel();
                else if (running) speak(stages[Math.max(0, lastStage)]);
            });
            skipButton.addEventListener('click', () => { if (timer) clearInterval(timer); closeIntro(); });
            document.addEventListener('keydown', event => { if (event.key === 'Escape' && !overlay.hidden) { if (timer) clearInterval(timer); closeIntro(); } });
        })();

