/* ============================================================
   NAVBAR MOBILE – FIX
============================================================ */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
    // deschide/închide meniul
    navToggle.addEventListener("click", () => {
        mainNav.classList.toggle("open");
        navToggle.classList.toggle("active"); // se potrivește cu CSS-ul tău
    });

    // când apeși pe un link, închidem meniul pe mobil
    const navLinks = mainNav.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove("open");
                navToggle.classList.remove("active");
            }
        });
    });
}

/* ============================================================
   SCROLL REVEAL ANIMATIONS
============================================================ */
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
    revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
            el.classList.add("visible");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* ============================================================
   EMAIL JS CONTACT FORM
============================================================ */
if (typeof emailjs !== "undefined") {
    emailjs.init("rifnckMBE_mNi7VpZ"); // public key
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        emailjs
            .sendForm("service_ru3iykd", "template_m4msnqs", this)
            .then(() => {
                const overlay = document.getElementById("contactSuccessOverlay");
                const sound = document.getElementById("contactSuccessSound");

                if (overlay) {
                    // forțăm reflow ca animația bifei să ruleze de fiecare dată
                    overlay.classList.remove("show");
                    void overlay.offsetWidth;
                    overlay.classList.add("show");
                }

                if (sound) {
                    try {
                        sound.currentTime = 0;
                        sound.play();
                    } catch (err) {
                        console.warn("Nu s-a putut reda sunetul de succes:", err);
                    }
                }
            })
            .catch(() => {
                alert("A apărut o eroare. Reîncearcă.");
            });
    });
}

/// ====================================
// CONTACT OVERLAY CLOSER
// ====================================
const closeOverlayBtn = document.getElementById("closeContactOverlay");
const contactOverlay = document.getElementById("contactSuccessOverlay");

if (closeOverlayBtn && contactOverlay) {
    closeOverlayBtn.addEventListener("click", () => {
        contactOverlay.classList.remove("show");

        // RESET FORMULAR
        const form = document.getElementById("contactForm");
        if (form) form.reset();
    });

    // închide overlay-ul dacă utilizatorul dă click pe fundal
    contactOverlay.addEventListener("click", (e) => {
        if (e.target === contactOverlay) {
            contactOverlay.classList.remove("show");

            // RESET FORMULAR
            const form = document.getElementById("contactForm");
            if (form) form.reset();
        }
    });
}

/* ============================================================
   FOOTER YEAR AUTO
============================================================ */
const yearSpan = document.getElementById("yearSpan");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

/* ============================================================
   LIGHTBOX – GALERIE + MEDIA ZOOM + ZOOM-ON-CLICK
============================================================ */

const lightbox = document.getElementById("lightbox");
const lightboxInner = lightbox ? lightbox.querySelector(".lightbox-inner") : null;
const lightboxImg = document.getElementById("lightboxImage");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxCounter = document.getElementById("lightboxCounter");

let galleryImages = [];
let currentIndex = 0;
let isZoomed = false;
let isLightboxOpen = false; // important pentru blocarea gesturilor pe mobil

/* 1. SELECTĂM IMAGINILE DIN GALERIE + CELE CU .media-zoom */
function loadZoomableImages() {
    const nodeList = document.querySelectorAll(".gallery-item img, .media-zoom");
    galleryImages = Array.from(nodeList);

    galleryImages.forEach((img, index) => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => openLightbox(index));
    });
}

/* 2. DESCHIDERE LIGHTBOX */
function openLightbox(index) {
    if (!galleryImages.length || !lightbox || !lightboxImg) return;

    currentIndex = index;
    resetZoom();
    updateLightbox();

    lightbox.classList.add("open");
    document.body.classList.add("no-scroll"); // blocăm scroll-ul paginii
    isLightboxOpen = true;
}

/* 3. ÎNCHIDERE LIGHTBOX (DOAR PE X) */
function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    document.body.classList.remove("no-scroll");
    resetZoom();
    isLightboxOpen = false;
}

/* 4. RESET ZOOM LA DESCHIDERE / ÎNCHIDERE / SCHIMBARE IMAGINE */
function resetZoom() {
    isZoomed = false;
    if (lightboxInner) {
        lightboxInner.classList.remove("zoomed");
    }
    if (lightboxImg) {
        lightboxImg.style.transform = "";
        lightboxImg.style.cursor = "zoom-in";
    }
}

/* 5. TOGGLE ZOOM PE CLICK PE IMAGINE */
if (lightboxImg && lightboxInner) {
    lightboxImg.addEventListener("click", (e) => {
        e.stopPropagation(); // să nu închidă lightbox-ul când dai click pe poză
        toggleZoom();
    });
}

function toggleZoom() {
    if (!lightboxInner || !lightboxImg) return;

    if (!isZoomed) {
        isZoomed = true;
        lightboxInner.classList.add("zoomed");
        lightboxImg.style.cursor = "zoom-out";
    } else {
        resetZoom();
    }
}

/* 6. EVENIMENTE – BUTOANE, FUNDAL, TASTATURĂ */

// Închidere doar pe X, conform cerinței
if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}

// NU mai închidem la click pe fundal – comentat intenționat
// if (lightbox) {
//     lightbox.addEventListener("click", (e) => {
//         if (e.target === lightbox) {
//             closeLightbox();
//         }
//     });
// }

if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
        if (!galleryImages.length) return;
        const n = galleryImages.length;
        currentIndex = (currentIndex - 1 + n) % n;
        resetZoom();
        updateLightbox();
    });
}

if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
        if (!galleryImages.length) return;
        const n = galleryImages.length;
        currentIndex = (currentIndex + 1) % n;
        resetZoom();
        updateLightbox();
    });
}

// ESC, săgeți stânga/dreapta
document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft" && lightboxPrev) lightboxPrev.click();
    if (e.key === "ArrowRight" && lightboxNext) lightboxNext.click();
});

/* 7. ACTUALIZARE IMAGINE ȘI CONTOR */
function updateLightbox() {
    if (!galleryImages.length || !lightboxImg || !lightboxCounter) return;

    const img = galleryImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
}

/* ============================================================
   CAROUSEL EVENIMENTE – loop infinit cu 3 carduri
============================================================ */

function initEventsCarousel() {
    const track = document.getElementById("eventsTrack");
    const slides = track ? Array.from(track.querySelectorAll(".event-slide")) : [];
    const btnPrev = document.getElementById("eventsPrev");
    const btnNext = document.getElementById("eventsNext");

    if (!track || slides.length === 0 || !btnPrev || !btnNext) return;

    // marcăm săgețile cu o clasă comună pentru tratamentul pe mobil
    btnPrev.classList.add("events-arrow");
    btnNext.classList.add("events-arrow");

    let current = 0; // indexul cardului din mijloc

    function render() {
        const n = slides.length;
        const center = current;
        const right = (current + 1) % n;
        const left = (current - 1 + n) % n;

        slides.forEach((slide, i) => {
            slide.classList.remove("is-center", "is-left", "is-right");

            if (i === center) slide.classList.add("is-center");
            else if (i === right) slide.classList.add("is-right");
            else if (i === left) slide.classList.add("is-left");
        });
    }

    btnNext.addEventListener("click", () => {
        current = (current + 1) % slides.length;
        render();
    });

    btnPrev.addEventListener("click", () => {
        current = (current - 1 + slides.length) % slides.length;
        render();
    });

    render();
}

/* ============================================================
   INIT DOMCONTENTLOADED
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    if (lightbox && lightboxImg) {
        loadZoomableImages();
    }
    initEventsCarousel();
    // Scroll lin pentru link-urile interne din pagină
const internalLinks = document.querySelectorAll('a[href^="#"]');

internalLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // ignoră doar "#" gol
        if (!href || href === '#') return;

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (!targetElement) return;

        e.preventDefault();

        // înălțimea header-ului fix (ajustează dacă e nevoie)
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;

        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - 12; // mic spațiu de respiro

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

});

/* ============================================================
   BLOCARE DOUBLE-TAP ZOOM & SCROLL (CONDIȚIONAT)
============================================================ */

// Blochează:
//  - double-tap zoom când lightbox-ul este deschis
//  - double-tap zoom pe săgețile de la evenimente / lightbox
let lastTouchEndGlobal = 0;

document.addEventListener(
    "touchend",
    function (event) {
        const now = Date.now();
        const delta = now - lastTouchEndGlobal;

        if (delta > 0 && delta < 300) {
            const target = event.target;

            const isOnArrow =
                target.closest &&
                target.closest(
                    "#eventsPrev, #eventsNext, .events-arrow, .lightbox-arrow, #lightboxPrev, #lightboxNext"
                );

            if (isLightboxOpen || isOnArrow) {
                event.preventDefault(); // blocăm zoom-ul la double-tap
            }
        }

        lastTouchEndGlobal = now;
    },
    { passive: false }
);

// Blochează scroll-ul de pagină când lightbox-ul este deschis
document.addEventListener(
    "touchmove",
    function (event) {
        if (isLightboxOpen) {
            event.preventDefault();
        }
    },
    { passive: false }
);

/* ============================================================
   DEBUG
============================================================ */
console.log("pgpr1.js loaded with lightbox + carousel + mobile protections.");
// Funcție pentru eliminarea diacriticelor
function normalizeText(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// Funcție de fuzzy matching (match tolerant la greșeli mici)
function fuzzyMatch(input, target) {
    input = normalizeText(input);
    target = normalizeText(target);

    if (target.includes(input)) return true; // match normal

    // Permite greșeli de 1-2 litere
    let mismatches = 0;
    let i = 0, j = 0;

    while (i < input.length && j < target.length) {
        if (input[i] !== target[j]) {
            mismatches++;
            if (mismatches > 2) return false;
            i++; // ignorăm o literă
        } else {
            i++;
            j++;
        }
    }

    return true;
}

// Filtrare carduri
document.getElementById("churchSearch").addEventListener("input", function () {
    const query = this.value.trim();
    const cards = document.querySelectorAll(".church-card");

    cards.forEach(card => {
        const text = card.innerText;
        const match = fuzzyMatch(query, text);

        card.style.display = match ? "block" : "none";
    });
});
