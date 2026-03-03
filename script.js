      
        window.addEventListener('scroll', function () {
            const scrollY = window.scrollY;
            document.getElementById('navbar').classList.toggle('scrolled', scrollY > 60);
            document.getElementById('backTop').classList.toggle('show', scrollY > 400);

            // Reveal
            document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function (el) {
                if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('visible');
            });

            // Steps popup
            document.querySelectorAll('.step-item').forEach(function (el) {
                if (el.getBoundingClientRect().top < window.innerHeight - 60) {
                    var delay = parseInt(el.dataset.delay) || 0;
                    setTimeout(function () { el.classList.add('pop'); }, delay);
                }
            });

     
            var snap = document.getElementById('snapshot');
            if (snap && snap.getBoundingClientRect().top < window.innerHeight - 100 && !snap.dataset.counted) {
                snap.dataset.counted = '1';
                setTimeout(animateCounters, 300);
            }
        }, { passive: true });

   
        function animateCounters() {
            document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
                var target = parseFloat(el.dataset.target);
                var suffix = el.dataset.suffix;
                var isDecimal = target % 1 !== 0;
                var start = 0, duration = 1800, step = 16;
                var increment = target / (duration / step);
                var timer = setInterval(function () {
                    start += increment;
                    if (start >= target) { start = target; clearInterval(timer); }
                    el.textContent = (isDecimal ? start.toFixed(1) : Math.floor(start)) + suffix;
                }, step);
            });
        }


  
        function toggleFaq(idx) {
            var item = document.getElementById('faq-' + idx);
            var ans = document.getElementById('faq-a-' + idx);
            var wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(function (el) {
                el.classList.remove('open');
                el.querySelector('.faq-a').style.maxHeight = '0';
                el.querySelector('.faq-toggle').innerHTML = '<i class="bi bi-plus"></i>';
            });
            if (!wasOpen) {
                item.classList.add('open');
                ans.style.maxHeight = ans.scrollHeight + 'px';
                item.querySelector('.faq-toggle').innerHTML = '<i class="bi bi-x"></i>';
            }
        }




        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function (el) {
                if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('visible');
            });
        });
  
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.carousel-slide');
        const next = document.querySelector('.next');
        const prev = document.querySelector('.prev');

        let index = 0;

        function getVisibleSlides() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }

        function updateCarousel() {
            const visible = getVisibleSlides();
            const slideWidth = slides[0].offsetWidth + 25; // including gap
            track.style.transform = `translateX(-${index * slideWidth}px)`;
        }

        next.addEventListener('click', () => {
            const visible = getVisibleSlides();
            if (index < slides.length - visible) {
                index++;
            } else {
                index = 0;
            }
            updateCarousel();
        });

        prev.addEventListener('click', () => {
            if (index > 0) {
                index--;
            } else {
                index = slides.length - getVisibleSlides();
            }
            updateCarousel();
        });

        window.addEventListener('resize', updateCarousel);
