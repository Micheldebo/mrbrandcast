document.addEventListener("DOMContentLoaded", function () {
  const loaderElement = document.querySelector(".loader");
  loaderElement.style.display = "flex";
});

window.onload = function () {
  gsap.registerPlugin(ScrollTrigger);

  const loaderElement = document.querySelector(".loader");

  gsap.to(".loader-container", { opacity: 1, duration: 1, onComplete: startLoaderAnimation });

  function startLoaderAnimation() {
    const loaderTl = gsap.timeline({
      onComplete: () => {
        gsap.to(".loader", {
          yPercent: -100,
          duration: 1,
          delay: 0.5,
          ease: "power2.inOut",
          onComplete: () => loaderElement.style.display = 'none'
        });
      }
    });

    document.querySelectorAll(".loader-wrap").forEach((wrap, index, array) => {
      const dot = wrap.querySelector(".loader-dot");
      const word = wrap.querySelector(".loader-word");

      loaderTl.add(() => {
        if (index > 0) {
          const prevWrap = array[index - 1];
          gsap.to(prevWrap.querySelector(".loader-dot"), { opacity: 0, duration: 0.05 });
          prevWrap.querySelector(".loader-word").classList.remove('active');
        }
        gsap.to(dot, { opacity: 1, duration: 0.25 });
        word.classList.add('active');
      }, index * 0.75);
    });

    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".animation-container",
        start: "top center",
        toggleActions: "play none none none"
      },
      repeat: -1,
      repeatDelay: 1
    });

    document.querySelectorAll(".animation-wrap").forEach((wrap, index, array) => {
      const dot = wrap.querySelector(".animation-dot");
      const word = wrap.querySelector(".animation-word");

      contentTl.add(() => {
        if (index > 0) {
          const prevWrap = array[index - 1];
          gsap.to(prevWrap.querySelector(".animation-dot"), { opacity: 0, duration: 0.1 });
          prevWrap.querySelector(".animation-word").classList.remove('active');
        } else if (index === 0 && array.length > 1) {
          const lastWrap = array[array.length - 1];
          gsap.to(lastWrap.querySelector(".animation-dot"), { opacity: 0, duration: 0.1 });
          lastWrap.querySelector(".animation-word").classList.remove('active');
        }
        gsap.to(dot, { opacity: 1, duration: 0.5 });
        word.classList.add("active");
      }, index * 1.5);
    });

    // Initialize Swiper
    const gallerySlider = new Swiper(".swiper.is-gallery", {
      loop: true,
      slidesPerView: 2,
      centeredSlides: true,
      speed: 800,
      grabCursor: true,
      parallax: true,
      navigation: {
        nextEl: '.button-right',
        prevEl: '.button-left'
      },
      breakpoints: {
        0: {
          slidesPerView: 1.25
        },
        640: {
          slidesPerView: 2
        }
      }
    });

    // Cursor follow animation
    const cursorElements = [
      { className: 'button-right', imageUrl: 'https://uploads-ssl.webflow.com/66670b09c8e02c494f933c31/6671500e5eb8c5e763159d40_arrow-right.svg' },
      { className: 'button-left', imageUrl: 'https://uploads-ssl.webflow.com/66670b09c8e02c494f933c31/6671500eae76b7dd1774e464_arrow-left.svg' }
    ];

    cursorElements.forEach(element => {
      const cursorImage = document.createElement('img');
      cursorImage.src = element.imageUrl;
      cursorImage.classList.add('cursor-image');
      document.body.appendChild(cursorImage);

      let targetX = 0, targetY = 0;

      document.addEventListener('mousemove', e => {
        targetX = e.clientX;
        targetY = e.clientY;
      });

      function updateCursor() {
        const currentX = parseInt(cursorImage.style.left) || 0;
        const currentY = parseInt(cursorImage.style.top) || 0;
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        cursorImage.style.left = (currentX + dx * 0.3) + 'px';
        cursorImage.style.top = (currentY + dy * 0.3) + 'px';
        requestAnimationFrame(updateCursor);
      }

      updateCursor();

      document.querySelectorAll(`.${element.className}`).forEach(el => {
        el.addEventListener('mouseenter', () => cursorImage.style.transform = 'translate(-50%, -50%) scale(1)');
        el.addEventListener('mouseleave', () => cursorImage.style.transform = 'translate(-50%, -50%) scale(0)');
      });
    });

    // Navigation menu animation
    document.querySelectorAll(".nav-wrap").forEach(navWrap => {
      const hamburgerEl = navWrap.querySelector(".button-menu.menu");
      const navLineEl = navWrap.querySelectorAll(".hamburger-line");
      const menuContainEl = navWrap.querySelector(".menu-contain");
      const flipItemEl = navWrap.querySelector(".hamburger-base");
      const menuWrapEl = navWrap.querySelector(".menu-wrapper");
      const menuBaseEl = navWrap.querySelector(".menu-base");
      const menuLinkEl = navWrap.querySelectorAll(".menu-link");

      const flipDuration = 0.6;

      function flip(forwards) {
        const state = Flip.getState(flipItemEl);
        if (forwards) {
          menuContainEl.appendChild(flipItemEl);
        } else {
          hamburgerEl.appendChild(flipItemEl);
        }
        Flip.from(state, { duration: flipDuration });
      }

      const tl = gsap.timeline({ paused: true });
      tl.set(menuWrapEl, { display: "flex" });
      tl.from(menuBaseEl, {
        opacity: 0,
        duration: flipDuration,
        ease: "none",
        onStart: () => flip(true)
      });
      tl.to(navLineEl[0], { y: 2, rotate: 45, duration: flipDuration }, "<");
      tl.to(navLineEl[1], { y: -2, rotate: -45, duration: flipDuration }, "<");
      tl.from(menuLinkEl, {
        opacity: 0,
        yPercent: 50,
        duration: 0.2,
        stagger: { amount: 0.2 },
        onReverseComplete: () => flip(false)
      });

      function openMenu(open) {
        if (!tl.isActive()) {
          if (open) {
            tl.play();
            hamburgerEl.classList.add("nav-open");
          } else {
            tl.reverse();
            hamburgerEl.classList.remove("nav-open");
          }
        }
      }

      hamburgerEl.addEventListener("click", () => {
        openMenu(!hamburgerEl.classList.contains("nav-open"));
      });

      menuBaseEl.addEventListener("mouseenter", () => openMenu(false));
      menuBaseEl.addEventListener("click", () => openMenu(false));

      document.addEventListener("keydown", e => {
        if (e.key === "Escape") openMenu(false);
      });
      menuLinkEl.forEach(link => {
        link.addEventListener("click", () => openMenu(false));
      });
    });

    // Scroll-triggered animations
    document.querySelectorAll(".scroll-wrap").forEach(scrollWrap => {
      const triggers = scrollWrap.querySelectorAll(".scroll-trigger");
      const items = scrollWrap.querySelectorAll(".scroll-item");

      triggers.forEach((trigger, index) => {
        const background = trigger.querySelector(".scroll-background");
        const item = items[index];

        let timelineSettings = {
          scrollTrigger: {
            trigger: trigger,
            start: index === 0 ? "top top" : "top bottom",
            end: index === items.length - 1 ? "bottom bottom" : "bottom top",
            scrub: true
          },
          defaults: { ease: "none" }
        };

        const tl = gsap.timeline(timelineSettings);
        tl.fromTo(item, { clipPath: index === 0 ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" : "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" });

        if (index > 0 && index < items.length - 1) {
          tl.to(item, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
        }

        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: trigger,
            start: "top top",
            end: "bottom top",
            scrub: true
          },
          defaults: { ease: "none" }
        });
        tl2.to(background, { yPercent: 50 });
      });
    });
  }
};

