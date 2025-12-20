const animatedElements = document.querySelectorAll(
  '.animate-up, .animate-left, .animate-right'
);

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        if (el.hasAttribute('data-stagger')) {
          const siblings = [...el.parentElement.children]
            .filter(child =>
              child.hasAttribute('data-stagger') &&
              child.classList.contains(el.classList[0])
            );

          const index = siblings.indexOf(el);
          el.style.transitionDelay = `${index * 80}ms`;
        }

        el.classList.add('show');
        observer.unobserve(el);
      }
    });
  },
  { threshold: 0.2 }
);

animatedElements.forEach(el => observer.observe(el));


const statNumbers = document.querySelectorAll('.stat-number');

const runNumberAnimation = (el) => {
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (isNaN(target)) return;

  let current = 0;
  const duration = 800; 
  const frameRate = 30;
  const totalFrames = Math.round(duration / (1000 / frameRate));
  let frame = 0;

  const counter = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    current = Math.floor(target * progress);

    el.textContent = current;

    if (frame >= totalFrames) {
      el.textContent = target + '+';
      clearInterval(counter);
    }
  }, 1000 / frameRate);
};

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runNumberAnimation(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

statNumbers.forEach(num => statsObserver.observe(num));

document.addEventListener("DOMContentLoaded", () => {
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});

/* Theme Toggle */
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtnMobile = document.getElementById("themeToggle");
  const toggleBtnDesktop = document.getElementById("themeToggleDesktop");
  const iconMobile = toggleBtnMobile.querySelector("i");
  const iconDesktop = toggleBtnDesktop.querySelector("i");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    iconMobile.classList.replace("fa-moon", "fa-sun");
    iconDesktop.classList.replace("fa-moon", "fa-sun");
  }

  const toggleTheme = (iconToAnimate) => {
    iconToAnimate.classList.add("rotate");

    setTimeout(() => {
      document.body.classList.toggle("light-theme");
      const isLight = document.body.classList.contains("light-theme");

      iconMobile.classList.toggle("fa-moon", !isLight);
      iconMobile.classList.toggle("fa-sun", isLight);
      iconDesktop.classList.toggle("fa-moon", !isLight);
      iconDesktop.classList.toggle("fa-sun", isLight);

      localStorage.setItem("theme", isLight ? "light" : "dark");

      iconToAnimate.classList.remove("rotate");
    }, 150);
  };

  toggleBtnMobile.addEventListener("click", () => toggleTheme(iconMobile));
  toggleBtnDesktop.addEventListener("click", () => toggleTheme(iconDesktop));
});
