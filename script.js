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
