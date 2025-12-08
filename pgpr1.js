/* ============================================================
   NAVBAR MOBILE
============================================================ */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
        mainNav.classList.toggle("open");
        navToggle.classList.toggle("open");
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
    const sound   = document.getElementById("contactSuccessSound");

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
const contactOverlay  = document.getElementById("contactSuccessOverlay");

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

const lightbox        = document.getElementById("lightbox");
const lightboxInner   = lightbox ? lightbox.querySelector(".lightbox-inner") : null;
const lightboxImg     = document.getElementById("lightboxImage");
const lightboxPrev    = document.getElementById("lightboxPrev");
const lightboxNext    = document.getElementById("lightboxNext");
const lightboxClose   = document.getElementById("lightboxClose");
const lightboxCounter = document.getElementById("lightboxCounter");

let galleryImages = [];
let currentIndex = 0;
let isZoomed = false;

/* 1. SELECTĂM IMAGINILE DIN GALERIE + CELE CU .media-zoom */
function loadZoomableImages() {
    const nodeList = document.querySelectorAll(".gallery-item img, .media-zoom");
    galleryImages = Array.from(nodeList);

    galleryImages.forEach((img, index) => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => openLightbox(index));
    });
}

if (lightbox && lightboxImg) {
    loadZoomableImages();
}

/* 2. DESCHIDERE LIGHTBOX */
function openLightbox(index) {
    if (!galleryImages.length || !lightbox || !lightboxImg) return;

    currentIndex = index;
    resetZoom();
    updateLightbox();

    lightbox.classList.add("open");
    document.body.classList.add("no-scroll"); // blocăm scroll-ul paginii
}

/* 3. ÎNCHIDERE LIGHTBOX */
function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.classList.remove("no-scroll");
    resetZoom();
}

/* 4. RESET ZOOM LA DESCHIDERE / ÎNCHIDERE / SCHIMBARE IMAGINE */
function resetZoom() {
    isZoomed = false;
    lightboxInner.classList.remove("zoomed");
    lightboxImg.style.transform = "";
    lightboxImg.style.cursor = "zoom-in";
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

if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}

// click pe fundal închide lightbox-ul
if (lightbox) {
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
        if (!galleryImages.length) return;
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        resetZoom();
        updateLightbox();
    });
}

if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
        if (!galleryImages.length) return;
        currentIndex = (currentIndex + 1) % galleryImages.length;
        resetZoom();
        updateLightbox();
    });
}

// ESC, săgeți stânga/dreapta
document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft" && lightboxPrev)  lightboxPrev.click();
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
   DEBUG
============================================================ */
console.log("pgpr1.js loaded with lightbox zoom-on-click.");

/* ============================================================
   CAROUSEL EVENIMENTE – loop infinit cu 3 carduri
============================================================ */

function initEventsCarousel() {
    const track = document.getElementById("eventsTrack");
    const slides = track ? Array.from(track.querySelectorAll(".event-slide")) : [];
    const btnPrev = document.getElementById("eventsPrev");
    const btnNext = document.getElementById("eventsNext");

    if (!track || slides.length === 0 || !btnPrev || !btnNext) return;

    let currentIndex = 0;

    function updateSlides() {
        const n = slides.length;
        if (n === 0) return;

        const prevIndex = (currentIndex - 1 + n) % n;
        const nextIndex = (currentIndex + 1) % n;

        slides.forEach((slide, i) => {
            slide.classList.remove("is-center", "is-left", "is-right");

            if (i === currentIndex) {
                slide.classList.add("is-center");
            } else if (i === prevIndex) {
                slide.classList.add("is-left");
            } else if (i === nextIndex) {
                slide.classList.add("is-right");
            }
        });
    }

    btnPrev.addEventListener("click", () => {
        const n = slides.length;
        currentIndex = (currentIndex - 1 + n) % n;
        updateSlides();
    });

    btnNext.addEventListener("click", () => {
        const n = slides.length;
        currentIndex = (currentIndex + 1) % n;
        updateSlides();
    });

    // inițializare
    updateSlides();
}

document.addEventListener("DOMContentLoaded", initEventsCarousel);

/* ============================================================
   CAROUSEL EVENIMENTE – loop infinit cu 3 carduri
============================================================ */

function initEventsCarousel() {
    const track = document.getElementById("eventsTrack");
    const slides = Array.from(track.querySelectorAll(".event-slide"));
    const btnPrev = document.getElementById("eventsPrev");
    const btnNext = document.getElementById("eventsNext");

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

document.addEventListener("DOMContentLoaded", initEventsCarousel);
