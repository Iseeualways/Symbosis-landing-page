
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


(() => {
    const track   = document.querySelector(".company-track");
    const wrapper = document.querySelector(".company-wrapper");
    const btnL    = document.querySelector(".arrow-left");
    const btnR    = document.querySelector(".arrow-right");
    const dotsEl  = document.getElementById("dots");

    const logos   = [...document.querySelectorAll(".company-logo")];
    const INTERVAL= 2500;   // ms between auto-slides
    const GAP_REM = parseFloat(getComputedStyle(track).gap) || 48; // gap in px

    let currentIndex = 0;
    let timer = null;
    let paused = false;

    /* ── Compute visible count based on wrapper width ── */
    function visibleCount() {
      const w = wrapper.offsetWidth;
      const cardW = logos[0].offsetWidth + GAP_REM;
      return Math.max(1, Math.floor(w / cardW));
    }

    /* ── Max index ───────────────────────────────────── */
    function maxIndex() {
      return Math.max(0, logos.length - visibleCount());
    }

    /* ── Move to index ───────────────────────────────── */
    function goTo(idx) {
      idx = Math.max(0, Math.min(idx, maxIndex()));
      currentIndex = idx;

      const cardW = logos[0].offsetWidth + GAP_REM;
      track.style.transform = `translateX(-${cardW * currentIndex}px)`;

      btnL.disabled = currentIndex === 0;
      btnR.disabled = currentIndex >= maxIndex();

      updateDots();
    }

    /* ── Build dots ──────────────────────────────────── */
    function buildDots() {
      dotsEl.innerHTML = "";
      const total = maxIndex() + 1;
      for (let i = 0; i < total; i++) {
        const d = document.createElement("button");
        d.className = "dot" + (i === 0 ? " active" : "");
        d.setAttribute("aria-label", `Go to slide ${i + 1}`);
        d.addEventListener("click", () => goTo(i));
        dotsEl.appendChild(d);
      }
    }

    function updateDots() {
      [...dotsEl.querySelectorAll(".dot")].forEach((d, i) =>
        d.classList.toggle("active", i === currentIndex)
      );
    }

    /* ── Auto-play ───────────────────────────────────── */
    function startTimer() {
      clearInterval(timer);
      timer = setInterval(() => {
        if (paused) return;
        if (currentIndex >= maxIndex()) goTo(0);
        else goTo(currentIndex + 1);
      }, INTERVAL);
    }

    /* ── Pause on hover ──────────────────────────────── */
    wrapper.addEventListener("mouseenter", () => paused = true);
    wrapper.addEventListener("mouseleave", () => paused = false);

    /* ── Arrow buttons ───────────────────────────────── */
    btnL.addEventListener("click", () => { goTo(currentIndex - 1); });
    btnR.addEventListener("click", () => { goTo(currentIndex + 1); });

    /* ── Touch / swipe support ───────────────────────── */
    let touchStartX = 0;
    wrapper.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; paused = true;  }, { passive: true });
    wrapper.addEventListener("touchend",   e => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 40) dx > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
      paused = false;
    });

    /* ── Rebuild on resize ───────────────────────────── */
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildDots();
        goTo(Math.min(currentIndex, maxIndex()));
      }, 200);
    });

    /* ── Init ────────────────────────────────────────── */
    buildDots();
    goTo(0);
    startTimer();
  })();