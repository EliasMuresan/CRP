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
document.addEventListener("DOMContentLoaded", revealOnScroll);

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
const footerYear = document.getElementById("footerYear");
if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
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
    let btnPrev = document.getElementById("eventsPrev");
    let btnNext = document.getElementById("eventsNext");

    if (!track || !track.querySelector(".event-slide") || !btnPrev || !btnNext) return;

    const freshPrev = btnPrev.cloneNode(true);
    const freshNext = btnNext.cloneNode(true);
    btnPrev.replaceWith(freshPrev);
    btnNext.replaceWith(freshNext);
    btnPrev = freshPrev;
    btnNext = freshNext;

    // marcăm săgețile cu o clasă comună pentru tratamentul pe mobil
    btnPrev.classList.add("events-arrow");
    btnNext.classList.add("events-arrow");

    let current = 0; // indexul cardului din mijloc

    function getSlides() {
        return Array.from(track.querySelectorAll(".event-slide"));
    }

    function render() {
        const slides = getSlides();
        const n = slides.length;
        if (!n) return;
        if (current >= n) current = 0;

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
        const slides = getSlides();
        if (!slides.length) return;
        current = (current + 1) % slides.length;
        render();
    });

    btnPrev.addEventListener("click", () => {
        const slides = getSlides();
        if (!slides.length) return;
        current = (current - 1 + slides.length) % slides.length;
        render();
    });

    render();
}

let teamMarqueeFrame = null;
let teamMarqueeStates = [];

function stopTeamMarquee() {
    if (teamMarqueeFrame) {
        cancelAnimationFrame(teamMarqueeFrame);
        teamMarqueeFrame = null;
    }

    teamMarqueeStates.forEach((state) => {
        state.cleanup();
    });
    teamMarqueeStates = [];
}

function ensureTeamMarqueeWindow(grid) {
    if (grid.parentElement && grid.parentElement.classList.contains("team-marquee-window")) {
        return grid.parentElement;
    }

    const windowEl = document.createElement("div");
    windowEl.className = "team-marquee-window";
    grid.parentNode.insertBefore(windowEl, grid);
    windowEl.appendChild(grid);
    return windowEl;
}

function initTeamMarquee() {
    const section = document.getElementById("comitet");
    if (!section) return;

    stopTeamMarquee();

    section.querySelectorAll(".team-main-grid, .team-secondary-grid").forEach((grid) => {
        grid.querySelectorAll("[data-marquee-clone='true']").forEach((clone) => clone.remove());
        grid.classList.remove("is-marquee-ready");
        grid.style.removeProperty("--marquee-offset");

        const windowEl = ensureTeamMarqueeWindow(grid);
        windowEl.classList.remove("is-dragging");

        if (document.body.classList.contains("cms-editing")) return;

        const cards = Array.from(grid.children).filter((card) => !card.hasAttribute("data-marquee-clone"));
        if (!cards.length) return;

        for (let copy = 0; copy < 2; copy += 1) {
            cards.forEach((card) => {
                const clone = card.cloneNode(true);
                clone.setAttribute("aria-hidden", "true");
                clone.setAttribute("data-marquee-clone", "true");
                clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
                grid.appendChild(clone);
            });
        }

        grid.classList.add("is-marquee-ready");

        const first = grid.children[0];
        const firstClone = grid.children[cards.length];
        if (!first || !firstClone) return;

        const setWidth = firstClone.getBoundingClientRect().left - first.getBoundingClientRect().left;
        if (!setWidth || setWidth < 1) return;

        const state = {
            grid,
            windowEl,
            setWidth,
            offset: -setWidth / 2,
            speed: grid.classList.contains("team-main-grid") ? 0.026 : 0.034,
            dragging: false,
            lastPointerX: 0,
            lastTime: performance.now(),
            cleanupHandlers: []
        };

        function normalize() {
            while (state.offset >= 0) state.offset -= state.setWidth;
            while (state.offset < -state.setWidth) state.offset += state.setWidth;
        }

        function applyOffset() {
            normalize();
            state.grid.style.setProperty("--marquee-offset", `${state.offset}px`);
        }

        function onPointerDown(event) {
            if (event.button !== undefined && event.button !== 0) return;
            state.dragging = true;
            state.lastPointerX = event.clientX;
            state.windowEl.classList.add("is-dragging");
            try {
                state.windowEl.setPointerCapture(event.pointerId);
            } catch (error) {
                console.info("Nu pot captura pointerul pentru carousel.", error);
            }
        }

        function onPointerMove(event) {
            if (!state.dragging) return;
            state.offset += event.clientX - state.lastPointerX;
            state.lastPointerX = event.clientX;
            applyOffset();
        }

        function endDrag(event) {
            state.dragging = false;
            state.windowEl.classList.remove("is-dragging");
            if (event && event.pointerId !== undefined) {
                try {
                    state.windowEl.releasePointerCapture(event.pointerId);
                } catch (error) {
                    console.info("Pointerul carouselului a fost eliberat deja.", error);
                }
            }
        }

        windowEl.addEventListener("pointerdown", onPointerDown);
        windowEl.addEventListener("pointermove", onPointerMove);
        windowEl.addEventListener("pointerup", endDrag);
        windowEl.addEventListener("pointercancel", endDrag);
        windowEl.addEventListener("lostpointercapture", endDrag);

        state.cleanupHandlers.push(
            () => windowEl.removeEventListener("pointerdown", onPointerDown),
            () => windowEl.removeEventListener("pointermove", onPointerMove),
            () => windowEl.removeEventListener("pointerup", endDrag),
            () => windowEl.removeEventListener("pointercancel", endDrag),
            () => windowEl.removeEventListener("lostpointercapture", endDrag)
        );
        state.cleanup = () => {
            state.cleanupHandlers.forEach((cleanup) => cleanup());
            state.windowEl.classList.remove("is-dragging");
            state.grid.style.removeProperty("--marquee-offset");
        };

        applyOffset();
        teamMarqueeStates.push(state);
    });

    if (!teamMarqueeStates.length) return;

    function tick(time) {
        teamMarqueeStates.forEach((state) => {
            const elapsed = Math.min(64, time - state.lastTime);
            state.lastTime = time;
            if (!state.dragging) {
                state.offset += state.speed * elapsed;
                const normalized = (() => {
                    while (state.offset >= 0) state.offset -= state.setWidth;
                    while (state.offset < -state.setWidth) state.offset += state.setWidth;
                    return state.offset;
                })();
                state.grid.style.setProperty("--marquee-offset", `${normalized}px`);
            }
        });
        teamMarqueeFrame = requestAnimationFrame(tick);
    }

    teamMarqueeFrame = requestAnimationFrame(tick);
}

/* ============================================================
   INIT DOMCONTENTLOADED
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    if (lightbox && lightboxImg) {
        loadZoomableImages();
    }
    initEventsCarousel();
    initTeamMarquee();
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
const churchSearchInput = document.getElementById("churchSearch");
if (churchSearchInput) churchSearchInput.addEventListener("input", function () {
    const query = this.value.trim();
    const cards = document.querySelectorAll(".church-card");

    cards.forEach(card => {
        const text = card.innerText;
        const match = fuzzyMatch(query, text);

        card.style.display = match ? "block" : "none";
    });
});

/* ============================================================
   FIREBASE AUTH - LOGIN SIMPLU
============================================================ */
(function () {
    if (window.__crpAuthBooted) return;
    window.__crpAuthBooted = true;

    const EDITOR_EMAIL = "crparad@gmail.com";
    const firebaseConfig = {
        apiKey: "AIzaSyBg1mDwkKxepDb7FWB0_taSsFCtSR8ONVU",
        authDomain: "crparad-ed5c4.firebaseapp.com",
        projectId: "crparad-ed5c4",
        storageBucket: "crparad-ed5c4.firebasestorage.app",
        messagingSenderId: "906095766720",
        appId: "1:906095766720:web:7dff933fc2f57929455125",
        measurementId: "G-P53NDF8ZZ6"
    };

    window.CRP_AUTH = {
        user: null,
        canEdit: false,
        ready: false
    };

    function closeMobileNav() {
        const nav = document.getElementById("mainNav");
        const toggle = document.getElementById("navToggle");
        if (window.innerWidth <= 768) {
            if (nav) nav.classList.remove("open");
            if (toggle) toggle.classList.remove("active");
        }
    }

    function buildAuthUi() {
        if (document.getElementById("crpAuthModal")) return;

        const modal = document.createElement("div");
        modal.id = "crpAuthModal";
        modal.className = "auth-modal";
        modal.setAttribute("aria-hidden", "true");
        modal.innerHTML = `
            <div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="crpAuthTitle">
                <button class="auth-close" type="button" aria-label="Inchide">&times;</button>

                <div class="auth-login-view">
                    <p class="auth-kicker">Cont CRP Arad</p>
                    <h2 id="crpAuthTitle">Login</h2>
                    <p class="auth-muted">Intra cu email si parola.</p>

                    <form class="auth-login-form">
                        <label>
                            Email
                            <input type="email" name="email" autocomplete="username" required>
                        </label>
                        <label>
                            Parola
                            <input type="password" name="password" autocomplete="current-password" required>
                        </label>
                        <button class="btn primary auth-submit" type="submit">Intra in cont</button>
                    </form>

                    <p class="auth-status" role="status"></p>
                </div>

                <div class="auth-user-view" hidden>
                    <p class="auth-kicker">Conectat</p>
                    <h2 class="auth-user-name">Cont conectat</h2>
                    <p class="auth-user-email"></p>
                    <button class="btn primary auth-edit-button" type="button" hidden>Editeaza siteul</button>
                    <button class="auth-logout" type="button">Logout</button>
                    <p class="auth-status auth-user-status" role="status"></p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector(".auth-close").addEventListener("click", closeAuthModal);
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeAuthModal();
        });

        document.addEventListener("keydown", (event) => {
            const key = event.key.toLowerCase();
            const isEditShortcut =
                (event.ctrlKey && event.altKey && key === "e") ||
                (event.ctrlKey && event.shiftKey && key === "e");
            if (!isEditShortcut || event.repeat) return;

            event.preventDefault();
            closeMobileNav();
            openAuthModal();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeAuthModal();
        });

        const params = new URLSearchParams(window.location.search);
        if (params.get("login") === "1" || params.get("edit") === "1") {
            window.setTimeout(openAuthModal, 250);
        }
    }

    function openAuthModal() {
        const modal = document.getElementById("crpAuthModal");
        if (!modal) return;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("auth-modal-open");
        window.setTimeout(() => {
            const firstInput = modal.querySelector(".auth-login-form input");
            if (firstInput && !window.CRP_AUTH.user) firstInput.focus();
        }, 30);
    }

    function closeAuthModal() {
        const modal = document.getElementById("crpAuthModal");
        if (!modal) return;
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("auth-modal-open");
        setStatus("");
    }

    function setStatus(message, isError) {
        document.querySelectorAll(".auth-status").forEach((status) => {
            status.textContent = message || "";
            status.classList.toggle("is-error", Boolean(isError));
        });
    }

    function setAuthText(selector, value, root) {
        const node = (root || document).querySelector(selector);
        if (node && value !== undefined && value !== null) node.textContent = value;
    }

    function updateAuthUi(user) {
        const email = (user && user.email ? user.email : "").toLowerCase();
        const canEdit = email === EDITOR_EMAIL;

        window.CRP_AUTH.user = user || null;
        window.CRP_AUTH.canEdit = canEdit;
        window.CRP_AUTH.ready = true;

        document.body.classList.add("auth-ready");
        document.body.classList.toggle("is-authenticated", Boolean(user));
        document.body.classList.toggle("can-edit-site", canEdit);

        const modal = document.getElementById("crpAuthModal");
        if (modal) {
            const loginView = modal.querySelector(".auth-login-view");
            const userView = modal.querySelector(".auth-user-view");
            if (loginView) loginView.hidden = Boolean(user);
            if (userView) userView.hidden = !user;

            setAuthText(".auth-user-name", canEdit ? "Editare site" : "Cont conectat", modal);
            setAuthText(".auth-user-email", user ? user.email || "" : "", modal);

            const editButton = modal.querySelector(".auth-edit-button");
            if (editButton) editButton.hidden = !canEdit;
        }

        window.dispatchEvent(new CustomEvent("crp-auth-change", {
            detail: {
                user: user || null,
                canEdit
            }
        }));
    }

    async function bootFirebaseAuth() {
        buildAuthUi();

        try {
            const appModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
            const authModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");

            const app = appModule.initializeApp(firebaseConfig);
            const auth = authModule.getAuth(app);
            auth.languageCode = "ro";

            await authModule.setPersistence(auth, authModule.browserLocalPersistence);

            const loginForm = document.querySelector(".auth-login-form");
            if (loginForm) {
                loginForm.addEventListener("submit", async (event) => {
                    event.preventDefault();
                    const formData = new FormData(loginForm);
                    const email = String(formData.get("email") || "").trim();
                    const password = String(formData.get("password") || "");

                    setStatus("Se verifica...");
                    try {
                        const credential = await authModule.signInWithEmailAndPassword(auth, email, password);
                        const loggedEmail = (credential.user.email || "").toLowerCase();
                        if (loggedEmail !== EDITOR_EMAIL) {
                            await authModule.signOut(auth);
                            setStatus("Contul acesta nu are acces.", true);
                            return;
                        }
                        loginForm.reset();
                        closeAuthModal();
                    } catch (error) {
                        setStatus(authErrorMessage(error), true);
                    }
                });
            }

            const logoutButton = document.querySelector(".auth-logout");
            if (logoutButton) {
                logoutButton.addEventListener("click", async () => {
                    await authModule.signOut(auth);
                    closeAuthModal();
                });
            }

            const editButton = document.querySelector(".auth-edit-button");
            if (editButton) {
                editButton.addEventListener("click", () => {
                    closeAuthModal();
                    if (window.CRP_CMS && typeof window.CRP_CMS.open === "function") {
                        window.CRP_CMS.open();
                    }
                });
            }

            authModule.onAuthStateChanged(auth, updateAuthUi);
            window.CRP_FIREBASE_AUTH = auth;
        } catch (error) {
            console.warn("Firebase Auth could not start.", error);
            setStatus("Loginul nu este disponibil momentan.", true);
            updateAuthUi(null);
        }
    }

    function authErrorMessage(error) {
        const code = error && error.code ? error.code : "";
        if (code.includes("wrong-password") || code.includes("invalid-credential")) return "Emailul sau parola nu sunt corecte.";
        if (code.includes("user-not-found")) return "Nu exista cont cu acest email.";
        if (code.includes("too-many-requests")) return "Prea multe incercari. Incearca mai tarziu.";
        return "Autentificarea nu a reusit. Incearca din nou.";
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootFirebaseAuth, { once: true });
    } else {
        bootFirebaseAuth();
    }
})();

/* ============================================================
   INLINE CMS EDITOR
============================================================ */
(function () {
    if (window.__crpInlineCmsBooted) return;
    window.__crpInlineCmsBooted = true;

    const CONTENT_PATH = "content/site.json";
    const PAGE_TEXT_DIR = "content/page-text";
    const DRAFT_KEY = "crp-inline-cms-draft";
    const SAVE_ENDPOINT = window.CRP_CMS_SAVE_ENDPOINT || "https://crp-cms.crparad.workers.dev";
    const CMS_ASSET_VERSION = "inline-cms-10";
    const RESERVED_EVENT_PAGES = new Set([
        "index.html",
        "evenimente-arhivate.html",
        "arad.html",
        "caras.html",
        "conferinta1.html",
        "confiliala.html",
        "conftineret.html",
        "electoral.html",
        "hunedoara.html",
        "liceu.html",
        "marturisirea-de-credinta.html",
        "seminar1.html",
        "seminar2.html",
        "seminar3.html",
        "seminar4.html",
        "seminar5.html",
        "statut-organizare.html",
        "statut-slujitorului.html",
        "timis.html",
        "wikicom.html"
    ]);
    const pageName = window.location.pathname.split("/").pop() || "index.html";
    const isHomePage = pageName === "index.html";
    const pageSlug = slugifyFilePart(pageName.replace(/\.html?$/i, "") || "index");
    const pageTextPath = `${PAGE_TEXT_DIR}/${pageSlug}.json`;
    const activeContentPath = isHomePage ? CONTENT_PATH : pageTextPath;

    const state = {
        canEdit: false,
        editing: false,
        dirty: false,
        contentPath: activeContentPath,
        content: null,
        originalContent: null,
        fields: [],
        images: [],
        reorders: [],
        eventControls: [],
        pendingAssets: [],
        pendingFiles: [],
        assetCounter: 0,
        pageTextHasSaved: false
    };

    const preparedNodes = new WeakSet();
    let toolbar = null;
    let statusNode = null;

    function cloneContent(value) {
        return JSON.parse(JSON.stringify(value || {}));
    }

    function pathToString(path) {
        return path.join(".");
    }

    function getAtPath(source, path) {
        return path.reduce((current, key) => current && current[key], source);
    }

    function setAtPath(source, path, value) {
        let current = source;
        path.slice(0, -1).forEach((key) => {
            if (current[key] === undefined || current[key] === null) current[key] = {};
            current = current[key];
        });
        current[path[path.length - 1]] = value;
    }

    function normalizeEditableText(node) {
        return node.innerText
            .replace(/\u00a0/g, " ")
            .replace(/[ \t]+\n/g, "\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    function addField(fields, selector, path, label, root, options) {
        const node = (root || document).querySelector(selector);
        if (!node) return;
        fields.push({
            node,
            path,
            label,
            multiline: Boolean(options && options.multiline),
            anchor: Boolean(options && options.anchor)
        });
    }

    function addImage(images, node, host, path, label, kind) {
        if (!node || !host) return;
        images.push({
            node,
            host,
            path,
            label,
            kind: kind || "image",
            fieldId: pathToString(path)
        });
    }

    function addImageBySelector(images, selector, path, label, root) {
        const node = (root || document).querySelector(selector);
        if (!node) return;
        addImage(images, node, node.parentElement || node, path, label, "image");
    }

    function getPageTextRoot() {
        return document.querySelector("main") || document.body;
    }

    function isInsideSkippedArea(node) {
        const element = node.nodeType === 1 ? node : node.parentElement;
        if (!element) return true;

        return Boolean(element.closest([
            ".header",
            ".footer",
            ".site-footer",
            ".nav",
            ".auth-modal",
            ".cms-editor-bar",
            ".lightbox",
            "#lightbox",
            ".contact-success-overlay",
            "#contactSuccessOverlay",
            "script",
            "style",
            "noscript",
            "template",
            "svg",
            "canvas",
            "input",
            "textarea",
            "select"
        ].join(",")));
    }

    function splitTextSpacing(value) {
        const raw = String(value || "");
        const prefix = (raw.match(/^\s*/) || [""])[0];
        const suffix = (raw.match(/\s*$/) || [""])[0];
        return {
            prefix,
            suffix,
            text: raw.trim()
        };
    }

    function collectPageTextNodes() {
        const root = getPageTextRoot();
        if (!root || isHomePage) return [];

        const nodes = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                if (!node || !node.parentElement) return NodeFilter.FILTER_REJECT;
                if (isInsideSkippedArea(node)) return NodeFilter.FILTER_REJECT;

                const text = splitTextSpacing(node.nodeValue).text;
                if (!text) return NodeFilter.FILTER_REJECT;

                return NodeFilter.FILTER_ACCEPT;
            }
        });

        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }

        return nodes.map((node, index) => {
            const spacing = splitTextSpacing(node.nodeValue);
            return {
                node,
                key: `t${String(index + 1).padStart(4, "0")}`,
                text: spacing.text,
                prefix: spacing.prefix,
                suffix: spacing.suffix
            };
        });
    }

    function createPageTextContent() {
        const texts = {};
        collectPageTextNodes().forEach((record) => {
            texts[record.key] = record.text;
        });

        return {
            page: pageName,
            updatedAt: null,
            texts
        };
    }

    function normalizePageTextContent(data) {
        const base = createPageTextContent();
        const savedTexts = data && data.texts && typeof data.texts === "object" ? data.texts : {};

        Object.keys(base.texts).forEach((key) => {
            if (typeof savedTexts[key] === "string") {
                base.texts[key] = savedTexts[key];
            }
        });

        if (data && typeof data.updatedAt === "string") {
            base.updatedAt = data.updatedAt;
        }

        return base;
    }

    function applyPageTextContent(data) {
        if (isHomePage || !data || !data.texts) return;

        collectPageTextNodes().forEach((record) => {
            const value = data.texts[record.key];
            if (typeof value === "string") {
                record.node.nodeValue = `${record.prefix}${value}${record.suffix}`;
            }
        });
    }

    function collectPageTextFields() {
        return collectPageTextNodes().map((record) => {
            const wrapper = document.createElement("span");
            wrapper.textContent = record.text;
            record.node.parentNode.replaceChild(wrapper, record.node);

            return {
                node: wrapper,
                path: ["texts", record.key],
                label: `Text ${record.key.replace(/^t0*/, "")}`,
                wrapper: true,
                prefix: record.prefix,
                suffix: record.suffix
            };
        });
    }

    function collectFields() {
        const fields = [];

        addField(fields, ".hero-kicker", ["hero", "kicker"], "Hero: eticheta");
        addField(fields, ".hero h1", ["hero", "title"], "Hero: titlu");
        addField(fields, ".hero-subtitle", ["hero", "subtitle"], "Hero: descriere", document, { multiline: true });
        addField(fields, ".hero-actions .btn.primary", ["hero", "primaryButton", "label"], "Hero: buton principal", document, { anchor: true });
        addField(fields, ".hero-actions .btn.ghost", ["hero", "secondaryButton", "label"], "Hero: buton secundar", document, { anchor: true });

        addField(fields, "#despre .section-kicker", ["about", "kicker"], "Despre: eticheta");
        addField(fields, "#despre h2", ["about", "title"], "Despre: titlu");
        addField(fields, "#despre .section-intro", ["about", "intro"], "Despre: text", document, { multiline: true });
        document.querySelectorAll("#despre .checklist li").forEach((item, index) => {
            fields.push({ node: item, path: ["about", "items", index], label: `Despre: punct ${index + 1}` });
        });

        addField(fields, "#comitet .section-kicker", ["team", "kicker"], "Comitet: eticheta");
        addField(fields, "#comitet h2", ["team", "title"], "Comitet: titlu");
        addField(fields, "#comitet .section-intro", ["team", "intro"], "Comitet: descriere", document, { multiline: true });
        document.querySelectorAll("#comitet .team-main-grid > div:not([data-marquee-clone])").forEach((card, index) => {
            addField(fields, "h3", ["team", "main", index, "name"], `Lider principal ${index + 1}: nume`, card);
            addField(fields, ".team-role", ["team", "main", index, "role"], `Lider principal ${index + 1}: rol`, card);
        });
        document.querySelectorAll("#comitet .team-secondary-grid > div:not([data-marquee-clone])").forEach((card, index) => {
            addField(fields, "h3", ["team", "members", index, "name"], `Membru comitet ${index + 1}: nume`, card);
            addField(fields, ".team-role", ["team", "members", index, "role"], `Membru comitet ${index + 1}: rol`, card);
        });

        addField(fields, "#convingeri .conv-pill", ["beliefs", "pill"], "Convingeri: eticheta");
        addField(fields, "#convingeri .conv-title", ["beliefs", "title"], "Convingeri: titlu");
        addField(fields, "#convingeri .conv-subtitle", ["beliefs", "subtitle"], "Convingeri: descriere", document, { multiline: true });
        addField(fields, "#convingeri .conv-meta", ["beliefs", "meta"], "Convingeri: nota", document, { multiline: true });
        document.querySelectorAll("#convingeri .conv-grid .conv-card").forEach((card, index) => {
            addField(fields, "h3", ["beliefs", "cards", index, "title"], `Document ${index + 1}: titlu`, card);
        });

        addField(fields, "#judete .section-kicker", ["counties", "kicker"], "Judete: eticheta");
        addField(fields, "#judete h2", ["counties", "title"], "Judete: titlu");
        addField(fields, "#judete .section-intro", ["counties", "intro"], "Judete: descriere", document, { multiline: true });
        addField(fields, "#judete .judete-tagline span", ["counties", "tagline"], "Judete: titlu panou");
        document.querySelectorAll("#judete .judete-grid .judet-card").forEach((card, index) => {
            addField(fields, ".judet-name", ["counties", "cards", index, "name"], `Judet ${index + 1}: nume`, card);
            addField(fields, ".judet-sub", ["counties", "cards", index, "subtitle"], `Judet ${index + 1}: text`, card);
            addField(fields, ".judet-overlay p", ["counties", "cards", index, "overlay"], `Judet ${index + 1}: hover`, card, { multiline: true });
        });

        addField(fields, "#evenimente .section-kicker", ["eventsSection", "kicker"], "Evenimente: eticheta");
        addField(fields, "#evenimente h2", ["eventsSection", "title"], "Evenimente: titlu");
        addField(fields, "#evenimente .section-intro", ["eventsSection", "intro"], "Evenimente: descriere", document, { multiline: true });
        document.querySelectorAll("#eventsTrack .event-card").forEach((card, index) => {
            addField(fields, ".event-date", ["events", index, "date"], `Eveniment ${index + 1}: data`, card);
            addField(fields, ".event-title", ["events", index, "title"], `Eveniment ${index + 1}: titlu`, card);
            addField(fields, ".event-text", ["events", index, "text"], `Eveniment ${index + 1}: text`, card, { multiline: true });
        });

        addField(fields, "#seminarii .section-kicker", ["seminarsSection", "kicker"], "Seminarii: eticheta");
        addField(fields, "#seminarii h2", ["seminarsSection", "title"], "Seminarii: titlu");
        addField(fields, "#seminarii .section-intro", ["seminarsSection", "intro"], "Seminarii: descriere", document, { multiline: true });
        document.querySelectorAll("#seminarii .seminars-grid .seminar-card").forEach((card, index) => {
            addField(fields, "h3", ["seminars", index, "title"], `Seminar ${index + 1}: titlu`, card);
            addField(fields, "p", ["seminars", index, "text"], `Seminar ${index + 1}: text`, card, { multiline: true });
        });

        addField(fields, "#liceu .liceu-title", ["school", "title"], "Liceu: titlu");
        addField(fields, "#liceu .liceu-subtitle", ["school", "subtitle"], "Liceu: subtitlu");
        addField(fields, "#liceu .liceu-hover-overlay span", ["school", "hoverText"], "Liceu: hover");

        addField(fields, "#locatie .section-kicker", ["location", "kicker"], "Locatie: eticheta");
        addField(fields, "#locatie h2", ["location", "title"], "Locatie: titlu");
        addField(fields, "#locatie .section-intro", ["location", "intro"], "Locatie: descriere", document, { multiline: true });

        addField(fields, "#contact .section-kicker", ["contact", "kicker"], "Contact: eticheta");
        addField(fields, "#contact h2", ["contact", "title"], "Contact: titlu");
        addField(fields, "#contact .section-intro", ["contact", "intro"], "Contact: descriere", document, { multiline: true });
        addField(fields, "#contact .contact-pill", ["contact", "pill"], "Contact: eticheta card");
        addField(fields, "#contact .contact-title", ["contact", "heading"], "Contact: titlu card");
        addField(fields, "#contact .contact-text", ["contact", "text"], "Contact: text card", document, { multiline: true });
        addField(fields, "#contact .contact-details li:nth-child(1) span", ["contact", "address"], "Contact: adresa");
        addField(fields, "#contact .contact-details li:nth-child(2) a", ["contact", "email"], "Contact: email", document, { anchor: true });
        addField(fields, "#contact .contact-details li:nth-child(3) span", ["contact", "phone"], "Contact: telefon");
        document.querySelectorAll("#contact .contact-note").forEach((note) => {
            fields.push({ node: note, path: ["contact", "note"], label: "Contact: nota", multiline: true });
        });

        addField(fields, ".site-footer .footer-brand strong", ["footer", "brand"], "Footer: brand");
        addField(fields, ".site-footer .footer-sub", ["footer", "subtitle"], "Footer: subtitlu");
        addField(fields, ".site-footer .footer-brand p", ["footer", "text"], "Footer: text", document, { multiline: true });
        addField(fields, ".site-footer .footer-col:last-child p:nth-of-type(1)", ["footer", "address"], "Footer: adresa");
        addField(fields, ".site-footer .footer-col:last-child p:nth-of-type(2) a", ["footer", "email"], "Footer: email", document, { anchor: true });
        addField(fields, ".site-footer .footer-col:last-child p:nth-of-type(3)", ["footer", "phone"], "Footer: telefon");

        return fields;
    }

    function collectImages() {
        const images = [];
        addImage(
            images,
            document.querySelector(".hero-background"),
            document.querySelector(".band-hero"),
            ["hero", "backgroundImage"],
            "Hero: poza fundal",
            "background"
        );
        addImageBySelector(images, "#despre .about-photo img", ["about", "image"], "Despre: poza cladire");

        document.querySelectorAll("#comitet .team-main-grid > div:not([data-marquee-clone])").forEach((card, index) => {
            addImageBySelector(images, ".team-photo-main img", ["team", "main", index, "image"], `Lider principal ${index + 1}: poza`, card);
        });
        document.querySelectorAll("#comitet .team-secondary-grid > div:not([data-marquee-clone])").forEach((card, index) => {
            addImageBySelector(images, ".team-photo-secondary img", ["team", "members", index, "image"], `Membru comitet ${index + 1}: poza`, card);
        });
        document.querySelectorAll("#eventsTrack .event-card").forEach((card, index) => {
            addImageBySelector(images, ".event-image img", ["events", index, "image"], `Eveniment ${index + 1}: poza`, card);
        });
        addImageBySelector(images, "#liceu .liceu-img-wrapper img", ["school", "image"], "Liceu: poza");

        return images;
    }

    function teamGroupConfig(group) {
        if (group === "main") {
            return {
                key: "main",
                label: "liderii principali",
                selector: "#comitet .team-main-grid",
                cardSelector: ".team-card-main"
            };
        }

        return {
            key: "members",
            label: "membrii comitetului",
            selector: "#comitet .team-secondary-grid",
            cardSelector: ".team-card-secondary"
        };
    }

    function teamCards(grid, cardSelector) {
        return Array.from(grid.children).filter((node) => node.matches(cardSelector) && !node.hasAttribute("data-marquee-clone"));
    }

    function getGridInsertTarget(grid, cardSelector, x, y) {
        const cards = teamCards(grid, cardSelector).filter((card) => !card.classList.contains("is-dragging"));
        return cards.find((card) => {
            const rect = card.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const centerX = rect.left + rect.width / 2;
            return y < centerY || (y < rect.bottom && x < centerX);
        }) || null;
    }

    function refreshTeamEditorControls() {
        deactivateFields();
        activateFields();
    }

    function commitTeamOrder(group) {
        if (!state.editing || !state.content || !state.content.team) return;

        const config = teamGroupConfig(group);
        const grid = document.querySelector(config.selector);
        if (!grid) return;

        syncAllFields();

        const previous = Array.isArray(state.content.team[config.key]) ? state.content.team[config.key] : [];
        const cards = teamCards(grid, config.cardSelector);
        const next = cards.map((card) => previous[Number(card.dataset.cmsTeamIndex)]).filter(Boolean);

        if (next.length !== previous.length) return;

        state.content.team[config.key] = next;
        state.dirty = true;
        setStatus(`Ordinea pentru ${config.label} a fost schimbata. Apasa Salveaza.`);
        refreshTeamEditorControls();
    }

    function prepareTeamReorderGroup(group) {
        const config = teamGroupConfig(group);
        const grid = document.querySelector(config.selector);
        if (!grid || !state.content || !state.content.team || !Array.isArray(state.content.team[config.key])) return;

        let draggingCard = null;
        grid.classList.add("cms-reorder-grid");

        const onGridDragOver = (event) => {
            if (!draggingCard) return;
            event.preventDefault();
            const target = getGridInsertTarget(grid, config.cardSelector, event.clientX, event.clientY);
            if (!target) {
                grid.appendChild(draggingCard);
            } else if (target !== draggingCard) {
                grid.insertBefore(draggingCard, target);
            }
        };

        grid.addEventListener("dragover", onGridDragOver);
        state.reorders.push(() => {
            grid.removeEventListener("dragover", onGridDragOver);
            grid.classList.remove("cms-reorder-grid");
        });

        teamCards(grid, config.cardSelector).forEach((card, index) => {
            card.classList.add("cms-reorder-card");
            card.dataset.cmsTeamGroup = config.key;
            card.dataset.cmsTeamIndex = String(index);
            card.draggable = true;
            card.title = "Trage cardul ca sa schimbi ordinea";

            const onDragStart = (event) => {
                if (event.target.closest("[contenteditable='true'], .cms-image-control, a, button, input, textarea, select")) {
                    event.preventDefault();
                    return;
                }

                draggingCard = card;
                card.classList.add("is-dragging");
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", `${config.key}:${index}`);
            };

            const onDragEnd = () => {
                if (!draggingCard) return;
                card.classList.remove("is-dragging");
                draggingCard = null;
                commitTeamOrder(config.key);
            };

            card.addEventListener("dragstart", onDragStart);
            card.addEventListener("dragend", onDragEnd);

            state.reorders.push(() => {
                card.removeEventListener("dragstart", onDragStart);
                card.removeEventListener("dragend", onDragEnd);
                card.classList.remove("cms-reorder-card", "is-dragging");
                card.removeAttribute("draggable");
                card.removeAttribute("data-cms-team-group");
                card.removeAttribute("data-cms-team-index");
                card.removeAttribute("title");
            });
        });
    }

    function prepareTeamReorder() {
        if (!isHomePage) return;
        prepareTeamReorderGroup("main");
        prepareTeamReorderGroup("members");
    }

    function generateEventPageHtml(event) {
        const title = escapeCmsHtml(event.title || "Eveniment nou");
        const titleAttr = escapeCmsAttr(event.title || "Eveniment nou");
        const date = escapeCmsHtml(event.date || "DATA EVENIMENTULUI");
        const image = escapeCmsAttr(event.image || "images/placeholder.png");

        return `<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8" />
    <title>${title} - Comunitatea Regionala Penticostala Arad</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="pgpr1.css?v=${CMS_ASSET_VERSION}" />
</head>
<body class="page-transition-active">

<header class="header">
    <div class="header-container">
        <div class="logo-area">
            <a href="index.html#acasa" style="display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit;">
                <img src="images/logo1.png" class="site-logo" alt="CRP Arad">
                <div class="site-title">
                    <h1>Comunitatea Regionala</h1>
                    <span>PENTICOSTALA ARAD</span>
                </div>
            </a>
        </div>

        <nav id="mainNav" class="nav">
            <a href="index.html#acasa" class="nav-link">Acasa</a>
            <a href="index.html#despre" class="nav-link">Despre</a>
            <a href="index.html#comitet" class="nav-link">Comitet</a>
            <a href="index.html#convingeri" class="nav-link">Convingeri</a>
            <a href="index.html#judete" class="nav-link">Judete</a>
            <a href="index.html#evenimente" class="nav-link">Evenimente</a>
            <a href="index.html#seminarii" class="nav-link">Seminarii</a>
            <a href="index.html#liceu" class="nav-link">Liceu</a>
            <a href="index.html#locatie" class="nav-link">Locatie</a>
            <a href="index.html#contact" class="nav-link nav-btn">Contact</a>
        </nav>

        <button class="nav-toggle" id="navToggle" aria-label="Deschide meniul">
            <span></span>
            <span></span>
        </button>
    </div>
</header>

<section class="band band-light inner-hero">
    <div class="container inner-hero-layout reveal">
        <div>
            <p class="section-kicker">Eveniment</p>
            <h1 class="inner-hero-title">${title}</h1>
            <div class="inner-hero-meta">
                <p><strong>Data:</strong> ${date}</p>
                <p><strong>Locatie:</strong> Completeaza locatia evenimentului</p>
                <p><strong>Organizator:</strong> Comunitatea Regionala Penticostala Arad</p>
            </div>
        </div>

        <div class="inner-hero-photo">
            <img src="${image}" alt="${titleAttr}" />
        </div>
    </div>
</section>

<section class="band band-muted">
    <div class="container">
        <div class="event-L-wrapper">
            <aside class="event-L-aside">
                <div class="event-info-card-single">
                    <img src="${image}" class="event-L-photo-top media-zoom" alt="${titleAttr}">
                    <h3>Informatii esentiale</h3>
                    <ul class="event-detail-list">
                        <li><strong>Data:</strong> ${date}</li>
                        <li><strong>Locatie:</strong> Completeaza locatia evenimentului</li>
                        <li><strong>Organizator:</strong> Comunitatea Regionala Penticostala Arad</li>
                    </ul>
                </div>
            </aside>

            <article class="event-L-text">
                <h2>${title}</h2>
                <p>Scrie aici descrierea evenimentului. Acest text poate fi modificat direct din browser dupa ce te loghezi ca admin.</p>
                <p>Adauga detalii despre program, invitati, locatie si mesajul principal al evenimentului.</p>
            </article>
        </div>
    </div>
</section>

<section class="band band-light">
    <div class="container reveal">
        <div class="section-header">
            <p class="section-kicker">Galerie foto</p>
            <h2>Momente din eveniment</h2>
            <p class="section-intro">Adauga imagini reprezentative pentru acest eveniment.</p>
        </div>
        <div class="gallery-grid"></div>
    </div>
</section>

<div class="lightbox" id="lightbox">
    <div class="lightbox-inner">
        <button class="lightbox-close" id="lightboxClose">&times;</button>
        <button class="lightbox-nav lightbox-prev" id="lightboxPrev">&#10094;</button>
        <img id="lightboxImage" src="">
        <button class="lightbox-nav lightbox-next" id="lightboxNext">&#10095;</button>
        <div class="lightbox-counter" id="lightboxCounter"></div>
    </div>
</div>

<footer class="footer">
    <div class="footer-inner">
        &copy; <span id="yearSpan"></span> Comunitatea Regionala Penticostala Arad. Toate drepturile rezervate.
    </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script src="pgpr1.js?v=${CMS_ASSET_VERSION}"></script>
</body>
</html>
`;
    }

    function rerenderHomeEditor(message) {
        const wasEditing = state.editing;
        state.editing = false;
        deactivateFields();

        if (typeof window.CRP_RENDER_HOME === "function") {
            window.CRP_RENDER_HOME(state.content);
        }

        state.editing = wasEditing;
        if (wasEditing) {
            document.body.classList.add("cms-editing");
            activateFields();
            updateToolbar();
        }

        setStatus(message);
    }

    function archiveEvent(index) {
        if (!state.content || !Array.isArray(state.content.events)) return;

        const event = state.content.events[index];
        if (!event) return;

        const title = event.title || "acest eveniment";
        if (!window.confirm(`Arhivezi "${title}"? Evenimentul va disparea de pe prima pagina dupa salvare.`)) {
            return;
        }

        syncAllFields();

        const archived = Array.isArray(state.content.archivedEvents)
            ? state.content.archivedEvents.slice()
            : [];

        state.content.events = state.content.events.filter((_, itemIndex) => itemIndex !== index);
        state.content.archivedEvents = [{
            ...event,
            archivedAt: new Date().toISOString()
        }, ...archived];
        state.dirty = true;

        rerenderHomeEditor(`Evenimentul "${title}" a fost arhivat. Apasa Salveaza ca sa fie publicat.`);
    }

    function addEventPage() {
        if (!state.content) return;

        const title = (window.prompt("Cum se numeste evenimentul?") || "").trim();
        if (!title) return;

        syncAllFields();

        const href = createUniqueEventHref(title);
        const event = {
            date: "DATA EVENIMENTULUI",
            title,
            text: "Descriere scurta pentru eveniment.",
            image: "images/placeholder.png",
            imageAlt: title,
            href
        };

        const events = Array.isArray(state.content.events) ? state.content.events.slice() : [];
        state.content.events = [event, ...events];
        state.pendingFiles = state.pendingFiles.filter((file) => file.path !== href);
        state.pendingFiles.push({
            path: href,
            contentBase64: toBase64Unicode(generateEventPageHtml(event)),
            contentType: "text/html; charset=utf-8",
            kind: "eventPage",
            createOnly: true
        });
        state.dirty = true;

        rerenderHomeEditor(`Evenimentul "${title}" a fost adaugat. Pagina ${href} va fi creata cand apesi Salveaza.`);
    }

    function refreshPendingEventPages() {
        if (!state.pendingFiles.length || !state.content) return;

        const allEvents = [
            ...(Array.isArray(state.content.events) ? state.content.events : []),
            ...(Array.isArray(state.content.archivedEvents) ? state.content.archivedEvents : [])
        ];

        state.pendingFiles = state.pendingFiles.map((file) => {
            if (!file || file.kind !== "eventPage") return file;

            const event = allEvents.find((item) => item && item.href === file.path);
            if (!event) return file;

            return {
                ...file,
                contentBase64: toBase64Unicode(generateEventPageHtml(event))
            };
        });
    }

    function prepareEventManager() {
        if (!isHomePage || !state.content) return;

        const section = document.getElementById("evenimente");
        const header = section && section.querySelector(".section-header");
        if (header) {
            const tools = document.createElement("div");
            tools.className = "cms-event-editor-tools";

            const addButton = document.createElement("button");
            addButton.type = "button";
            addButton.className = "cms-event-add-button";
            addButton.textContent = "Adauga eveniment";
            addButton.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                addEventPage();
            });

            tools.appendChild(addButton);
            header.appendChild(tools);
            state.eventControls.push(() => tools.remove());
        }

        document.querySelectorAll("#eventsTrack .event-card").forEach((card, index) => {
            const archiveButton = document.createElement("button");
            archiveButton.type = "button";
            archiveButton.className = "cms-event-archive-button";
            archiveButton.textContent = "Arhiveaza";
            archiveButton.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                archiveEvent(index);
            });

            card.appendChild(archiveButton);
            state.eventControls.push(() => archiveButton.remove());
        });
    }

    function buildToolbar() {
        if (toolbar) return;

        toolbar = document.createElement("div");
        toolbar.className = "cms-editor-bar";
        toolbar.hidden = true;
        toolbar.innerHTML = `
            <div class="cms-editor-main">
                <strong>Editor site</strong>
                <span class="cms-editor-status" role="status"></span>
            </div>
            <div class="cms-editor-actions">
                <button class="cms-editor-button cms-start" type="button">Editeaza pagina</button>
                <button class="cms-editor-button cms-save" type="button" hidden>Salveaza</button>
                <button class="cms-editor-button cms-cancel" type="button" hidden>Renunta</button>
            </div>
        `;
        document.body.appendChild(toolbar);

        statusNode = toolbar.querySelector(".cms-editor-status");
        toolbar.querySelector(".cms-start").addEventListener("click", openEditor);
        toolbar.querySelector(".cms-save").addEventListener("click", saveChanges);
        toolbar.querySelector(".cms-cancel").addEventListener("click", cancelEditing);
    }

    function setStatus(message, isError) {
        if (!statusNode) return;
        statusNode.textContent = message || "";
        statusNode.classList.toggle("is-error", Boolean(isError));
    }

    function updateToolbar() {
        buildToolbar();
        toolbar.hidden = !state.canEdit;
        toolbar.classList.toggle("is-editing", state.editing);

        const startButton = toolbar.querySelector(".cms-start");
        const saveButton = toolbar.querySelector(".cms-save");
        const cancelButton = toolbar.querySelector(".cms-cancel");

        if (startButton) startButton.hidden = state.editing;
        if (saveButton) saveButton.hidden = !state.editing;
        if (cancelButton) cancelButton.hidden = !state.editing;
    }

    async function ensureContent() {
        if (state.content) {
            if (!isHomePage && !state.pageTextHasSaved && !state.editing) {
                state.content = createPageTextContent();
            }
            return state.content;
        }

        if (!isHomePage) {
            try {
                const response = await fetch(pageTextPath, { cache: "no-cache" });
                if (response.ok) {
                    state.content = normalizePageTextContent(await response.json());
                    state.pageTextHasSaved = true;
                    applyPageTextContent(state.content);
                    return state.content;
                }
            } catch (error) {
                console.info("Page text content is not available yet.", error);
            }

            state.content = createPageTextContent();
            state.pageTextHasSaved = false;
            return state.content;
        }

        if (window.CRP_SITE_CONTENT) {
            state.content = cloneContent(window.CRP_SITE_CONTENT);
            return state.content;
        }

        const response = await fetch(CONTENT_PATH, { cache: "no-cache" });
        if (!response.ok) throw new Error("Nu pot incarca fisierul de continut.");
        state.content = await response.json();
        return state.content;
    }

    function syncField(field) {
        const text = normalizeEditableText(field.node);
        setAtPath(state.content, field.path, text);
    }

    function syncAllFields() {
        state.fields.forEach(syncField);
    }

    function prepareField(field) {
        const node = field.node;
        node.dataset.cmsEditable = field.label;
        node.dataset.cmsPath = pathToString(field.path);
        node.contentEditable = "true";
        node.spellcheck = true;
        node.setAttribute("aria-label", `Editeaza ${field.label}`);

        const expectedValue = getAtPath(state.content, field.path);
        if (expectedValue !== undefined && expectedValue !== null && normalizeEditableText(node) === "") {
            node.textContent = expectedValue;
        }

        if (preparedNodes.has(node)) return;
        preparedNodes.add(node);

        node.addEventListener("input", () => {
            if (!state.editing) return;
            syncField(field);
            state.dirty = true;
            setStatus("Modificari nesalvate.");
        });

        node.addEventListener("keydown", (event) => {
            if (!state.editing) return;
            if (event.key === "Enter") {
                event.preventDefault();
                node.blur();
            }
        });

        if (field.anchor || node.closest("a")) {
            node.addEventListener("click", (event) => {
                if (!state.editing) return;
                event.preventDefault();
            });
        }
    }

    function getImageExtension(file) {
        const byName = (file.name || "").split(".").pop().toLowerCase();
        const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
        if (allowed.includes(byName)) return byName === "jpeg" ? "jpg" : byName;

        const byType = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp",
            "image/gif": "gif"
        };
        return byType[file.type] || "";
    }

    function slugifyFilePart(value) {
        return String(value || "poza")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 54) || "poza";
    }

    function slugifyEventPageTitle(value) {
        return String(value || "eveniment")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 58) || "eveniment";
    }

    function escapeCmsHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeCmsAttr(value) {
        return escapeCmsHtml(value).replace(/`/g, "&#096;");
    }

    function toBase64Unicode(text) {
        const bytes = new TextEncoder().encode(String(text || ""));
        let binary = "";
        const chunkSize = 0x8000;

        for (let index = 0; index < bytes.length; index += chunkSize) {
            const chunk = bytes.subarray(index, index + chunkSize);
            binary += String.fromCharCode.apply(null, Array.from(chunk));
        }

        return btoa(binary);
    }

    function usedEventHrefs() {
        const used = new Set(RESERVED_EVENT_PAGES);
        ["events", "archivedEvents"].forEach((key) => {
            if (Array.isArray(state.content && state.content[key])) {
                state.content[key].forEach((event) => {
                    if (event && typeof event.href === "string") used.add(event.href);
                });
            }
        });
        state.pendingFiles.forEach((file) => {
            if (file && file.path) used.add(file.path);
        });
        return used;
    }

    function createUniqueEventHref(title) {
        const base = slugifyEventPageTitle(title);
        const used = usedEventHrefs();
        let slug = base;
        let counter = 2;

        while (used.has(`${slug}.html`)) {
            slug = `${base}-${counter}`;
            counter += 1;
        }

        return `${slug}.html`;
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ""));
            reader.onerror = () => reject(new Error("Nu pot citi imaginea."));
            reader.readAsDataURL(file);
        });
    }

    function loadCropImage(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Nu pot incarca imaginea."));
            img.src = dataUrl;
        });
    }

    function canvasToDataUrl(canvas) {
        return canvas.toDataURL("image/jpeg", 0.88);
    }

    function getCropAspect(image) {
        const rect = (image.kind === "background" ? image.host : image.node).getBoundingClientRect();
        if (rect.width > 20 && rect.height > 20) return rect.width / rect.height;
        return image.kind === "background" ? 16 / 9 : 4 / 3;
    }

    function getCropOutputSize(image, aspect) {
        const longSide = image.kind === "background" ? 1920 : 1200;
        if (aspect >= 1) {
            return {
                width: longSide,
                height: Math.max(1, Math.round(longSide / aspect))
            };
        }

        return {
            width: Math.max(1, Math.round(longSide * aspect)),
            height: longSide
        };
    }

    function getCropStageSize(aspect) {
        const maxWidth = Math.min(window.innerWidth - 48, 860);
        const maxHeight = Math.min(window.innerHeight - 270, 560);
        let width = maxWidth;
        let height = width / aspect;

        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspect;
        }

        return {
            width: Math.max(260, Math.round(width)),
            height: Math.max(180, Math.round(height))
        };
    }

    function openCropModal(image, sourceDataUrl) {
        return loadCropImage(sourceDataUrl).then((sourceImage) => new Promise((resolve) => {
            const aspect = getCropAspect(image);
            const stage = getCropStageSize(aspect);
            const output = getCropOutputSize(image, aspect);
            const modal = document.createElement("div");
            modal.className = "cms-crop-modal";
            modal.innerHTML = `
                <div class="cms-crop-dialog" role="dialog" aria-modal="true" aria-label="Incadrare poza">
                    <div class="cms-crop-head">
                        <strong>Incadrare poza</strong>
                        <button class="cms-crop-close" type="button" aria-label="Inchide">&times;</button>
                    </div>
                    <canvas class="cms-crop-canvas" width="${stage.width}" height="${stage.height}"></canvas>
                    <div class="cms-crop-controls">
                        <label>
                            Zoom
                            <input class="cms-crop-zoom" type="range" min="1" max="3" step="0.01" value="1">
                        </label>
                        <div class="cms-crop-actions">
                            <button class="cms-editor-button cms-crop-cancel" type="button">Anuleaza</button>
                            <button class="cms-editor-button cms-save cms-crop-apply" type="button">Foloseste poza</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            document.body.classList.add("cms-crop-open");

            const canvas = modal.querySelector(".cms-crop-canvas");
            const ctx = canvas.getContext("2d");
            const zoomInput = modal.querySelector(".cms-crop-zoom");
            const naturalWidth = sourceImage.naturalWidth || sourceImage.width;
            const naturalHeight = sourceImage.naturalHeight || sourceImage.height;
            const baseScale = Math.max(stage.width / naturalWidth, stage.height / naturalHeight);
            const crop = {
                zoom: 1,
                offsetX: 0,
                offsetY: 0,
                dragging: false,
                lastX: 0,
                lastY: 0
            };

            function currentDraw() {
                const scale = baseScale * crop.zoom;
                const width = naturalWidth * scale;
                const height = naturalHeight * scale;
                return {
                    width,
                    height,
                    x: (stage.width - width) / 2 + crop.offsetX,
                    y: (stage.height - height) / 2 + crop.offsetY
                };
            }

            function constrainCrop() {
                const draw = currentDraw();
                const maxX = Math.max(0, (draw.width - stage.width) / 2);
                const maxY = Math.max(0, (draw.height - stage.height) / 2);
                crop.offsetX = Math.min(maxX, Math.max(-maxX, crop.offsetX));
                crop.offsetY = Math.min(maxY, Math.max(-maxY, crop.offsetY));
            }

            function renderCrop() {
                constrainCrop();
                const draw = currentDraw();
                ctx.clearRect(0, 0, stage.width, stage.height);
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, stage.width, stage.height);
                ctx.drawImage(sourceImage, draw.x, draw.y, draw.width, draw.height);
            }

            function cleanup(result) {
                modal.remove();
                document.body.classList.remove("cms-crop-open");
                resolve(result || null);
            }

            canvas.addEventListener("pointerdown", (event) => {
                crop.dragging = true;
                crop.lastX = event.clientX;
                crop.lastY = event.clientY;
                canvas.setPointerCapture(event.pointerId);
            });

            canvas.addEventListener("pointermove", (event) => {
                if (!crop.dragging) return;
                crop.offsetX += event.clientX - crop.lastX;
                crop.offsetY += event.clientY - crop.lastY;
                crop.lastX = event.clientX;
                crop.lastY = event.clientY;
                renderCrop();
            });

            canvas.addEventListener("pointerup", () => {
                crop.dragging = false;
            });
            canvas.addEventListener("pointercancel", () => {
                crop.dragging = false;
            });

            zoomInput.addEventListener("input", () => {
                crop.zoom = Number(zoomInput.value) || 1;
                renderCrop();
            });

            modal.querySelector(".cms-crop-close").addEventListener("click", () => cleanup(null));
            modal.querySelector(".cms-crop-cancel").addEventListener("click", () => cleanup(null));
            modal.addEventListener("click", (event) => {
                if (event.target === modal) cleanup(null);
            });
            modal.querySelector(".cms-crop-apply").addEventListener("click", () => {
                const draw = currentDraw();
                const outputCanvas = document.createElement("canvas");
                outputCanvas.width = output.width;
                outputCanvas.height = output.height;
                const outputCtx = outputCanvas.getContext("2d");
                const ratioX = output.width / stage.width;
                const ratioY = output.height / stage.height;

                outputCtx.fillStyle = "#fff";
                outputCtx.fillRect(0, 0, output.width, output.height);
                outputCtx.drawImage(
                    sourceImage,
                    draw.x * ratioX,
                    draw.y * ratioY,
                    draw.width * ratioX,
                    draw.height * ratioY
                );

                const dataUrl = canvasToDataUrl(outputCanvas);
                cleanup({
                    dataUrl,
                    contentBase64: dataUrl.split(",")[1] || "",
                    extension: "jpg",
                    contentType: "image/jpeg"
                });
            });

            renderCrop();
        }));
    }

    function applyImagePreview(image, source) {
        if (image.kind === "background") {
            image.node.style.backgroundImage = `url("${source}")`;
            return;
        }
        image.node.src = source;
    }

    async function handleImageFile(image, file) {
        if (!file) return;

        const extension = getImageExtension(file);
        if (!extension) {
            setStatus("Alege o imagine JPG, PNG, WebP sau GIF.", true);
            return;
        }

        const maxSize = 20 * 1024 * 1024;
        if (file.size > maxSize) {
            setStatus("Imaginea e prea mare. Foloseste o poza sub 20 MB.", true);
            return;
        }

        const dataUrl = await readFileAsDataUrl(file);
        const cropped = await openCropModal(image, dataUrl);
        if (!cropped) return;

        const contentBase64 = cropped.contentBase64;
        if (!contentBase64) {
            setStatus("Nu pot pregati imaginea pentru upload.", true);
            return;
        }

        state.assetCounter += 1;
        const stamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
        const name = slugifyFilePart(`${pathToString(image.path)}-${state.assetCounter}`);
        const assetPath = `images/cms/${stamp}-${name}.${cropped.extension}`;

        state.pendingAssets = state.pendingAssets.filter((asset) => asset.fieldId !== image.fieldId);
        state.pendingAssets.push({
            fieldId: image.fieldId,
            path: assetPath,
            contentBase64,
            contentType: cropped.contentType,
            originalName: file.name || `${name}.${cropped.extension}`
        });

        setAtPath(state.content, image.path, assetPath);
        applyImagePreview(image, cropped.dataUrl);
        state.dirty = true;
        setStatus("Poza a fost incadrata. Apasa Salveaza ca sa fie urcata in GitHub.");
    }

    function prepareImage(image) {
        image.node.dataset.cmsImage = image.label;
        image.host.classList.add("cms-image-host");

        const button = document.createElement("button");
        button.className = "cms-image-control";
        button.type = "button";
        button.textContent = "Schimba poza";
        button.setAttribute("aria-label", `Schimba ${image.label}`);
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/png,image/jpeg,image/webp,image/gif";
            input.hidden = true;
            input.addEventListener("change", () => {
                handleImageFile(image, input.files && input.files[0]).catch((error) => {
                    setStatus(error.message || "Nu pot schimba poza.", true);
                });
                input.remove();
            }, { once: true });
            document.body.appendChild(input);
            input.click();
        });

        image.control = button;
        image.host.appendChild(button);
    }

    function activateFields() {
        state.fields = isHomePage ? collectFields() : collectPageTextFields();
        state.fields.forEach(prepareField);
        state.images = isHomePage ? collectImages() : [];
        state.images.forEach(prepareImage);
        prepareTeamReorder();
        prepareEventManager();
        if (isHomePage && typeof initTeamMarquee === "function") initTeamMarquee();
    }

    function deactivateFields() {
        state.eventControls.forEach((cleanup) => cleanup());
        state.eventControls = [];

        state.reorders.forEach((cleanup) => cleanup());
        state.reorders = [];

        state.fields.forEach((field) => {
            field.node.removeAttribute("data-cms-editable");
            field.node.removeAttribute("data-cms-path");
            field.node.removeAttribute("contenteditable");
            field.node.removeAttribute("aria-label");
            if (field.wrapper) {
                const text = document.createTextNode(`${field.prefix || ""}${field.node.textContent || ""}${field.suffix || ""}`);
                field.node.replaceWith(text);
            }
        });
        state.images.forEach((image) => {
            image.node.removeAttribute("data-cms-image");
            if (image.control) image.control.remove();
            if (image.host) image.host.classList.remove("cms-image-host");
        });
        state.fields = [];
        state.images = [];
    }

    async function openEditor() {
        buildToolbar();
        if (!state.canEdit) {
            setStatus("Trebuie sa fii logat ca admin.", true);
            return;
        }

        try {
            await ensureContent();
        } catch (error) {
            setStatus(error.message || "Nu pot porni editorul.", true);
            return;
        }

        state.originalContent = cloneContent(state.content);
        state.editing = true;
        state.dirty = false;
        state.pendingAssets = [];
        state.pendingFiles = [];
        document.body.classList.add("cms-editing");
        activateFields();
        updateToolbar();
        setStatus(isHomePage ? "Click pe text sau pe Schimba poza si modifica direct in pagina." : "Click pe text si modifica direct in pagina.");
    }

    function cancelEditing() {
        if (!state.editing) return;
        state.editing = false;
        state.dirty = false;
        state.pendingAssets = [];
        state.pendingFiles = [];
        document.body.classList.remove("cms-editing");
        deactivateFields();
        state.content = cloneContent(state.originalContent);
        if (isHomePage && typeof window.CRP_RENDER_HOME === "function") {
            window.CRP_RENDER_HOME(state.content);
        } else if (!isHomePage) {
            applyPageTextContent(state.content);
        } else {
            window.location.reload();
            return;
        }
        updateToolbar();
        setStatus("Modificarile au fost anulate.");
    }

    async function saveChanges() {
        if (!state.editing) return;
        syncAllFields();
        refreshPendingEventPages();

        if (!state.dirty) {
            setStatus("Nu sunt modificari noi.");
            return;
        }

        if (!SAVE_ENDPOINT) {
            localStorage.setItem(DRAFT_KEY, JSON.stringify({
                savedAt: new Date().toISOString(),
                path: state.contentPath,
                content: state.content,
                pendingAssets: state.pendingAssets.map((asset) => ({
                    path: asset.path,
                    originalName: asset.originalName
                })),
                pendingFiles: state.pendingFiles.map((file) => ({
                    path: file.path,
                    contentType: file.contentType,
                    kind: file.kind
                }))
            }));
            state.originalContent = cloneContent(state.content);
            state.dirty = false;
            setStatus("Salvat local. Pentru publicare in GitHub trebuie conectat endpoint-ul.");
            return;
        }

        try {
            setStatus("Se salveaza in GitHub...");
            const auth = window.CRP_FIREBASE_AUTH;
            const user = auth && auth.currentUser;
            if (!user) throw new Error("Sesiunea de admin nu mai este activa.");

            const token = await user.getIdToken();
            if (!isHomePage) {
                state.content.page = pageName;
                state.content.updatedAt = new Date().toISOString();
            }
            const response = await fetch(SAVE_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    path: state.contentPath,
                    content: state.content,
                    assets: state.pendingAssets,
                    files: state.pendingFiles
                })
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || "Salvarea nu a reusit.");

            if (isHomePage) {
                window.CRP_SITE_CONTENT = cloneContent(state.content);
            }
            localStorage.removeItem(DRAFT_KEY);
            state.originalContent = cloneContent(state.content);
            state.dirty = false;
            state.pendingAssets = [];
            state.pendingFiles = [];
            if (!isHomePage) state.pageTextHasSaved = true;
            setStatus("Salvat in GitHub. Deploy-ul se actualizeaza automat.");
        } catch (error) {
            setStatus(error.message || "Salvarea nu a reusit.", true);
        }
    }

    window.addEventListener("crp-auth-change", (event) => {
        state.canEdit = Boolean(event.detail && event.detail.canEdit);
        if (!state.canEdit && state.editing) {
            state.editing = false;
            document.body.classList.remove("cms-editing");
            deactivateFields();
            if (isHomePage && typeof initTeamMarquee === "function") initTeamMarquee();
        }
        updateToolbar();
    });

    window.addEventListener("crp-content-loaded", (event) => {
        if (event.detail && event.detail.data) {
            state.content = cloneContent(event.detail.data);
            if (state.editing) {
                activateFields();
            }
        }
    });

    window.CRP_CMS = {
        open: openEditor,
        save: saveChanges,
        cancel: cancelEditing
    };

    function bootInlineCms() {
        buildToolbar();
        if (!isHomePage) {
            ensureContent().catch((error) => {
                console.info("Page text content is not ready.", error);
            });
        }
    }

    window.addEventListener("crp-page-dom-updated", () => {
        if (!isHomePage && state.content && state.pageTextHasSaved && !state.editing) {
            applyPageTextContent(state.content);
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootInlineCms, { once: true });
    } else {
        bootInlineCms();
    }
})();
/* ============================================================
   PAGES CMS CONTENT LOADER
============================================================ */
(function () {
    if (window.__crpPagesCmsBooted) return;
    window.__crpPagesCmsBooted = true;

    if (window.location.protocol === "file:") {
        console.info("Pages CMS content is inactive on file://. Use a local server for preview.");
        return;
    }

    const pageName = window.location.pathname.split("/").pop() || "index.html";

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/`/g, "&#096;");
    }

    function setText(selector, value, root) {
        const node = (root || document).querySelector(selector);
        if (node && value !== undefined && value !== null) node.textContent = value;
    }

    function setImage(img, src, alt) {
        if (!img) return;
        if (src) img.src = src;
        if (alt !== undefined && alt !== null) img.alt = alt;
    }

    function buttonHtml(button, className) {
        if (!button || !button.label || !button.url) return "";
        return `<a href="${escapeAttr(button.url)}" class="btn ${className}">${escapeHtml(button.label)}</a>`;
    }

    function loadJson(path) {
        return fetch(path, { cache: "no-cache" }).then((response) => {
            if (!response.ok) throw new Error(`Could not load ${path}`);
            return response.json();
        });
    }

    function cloneData(data) {
        return JSON.parse(JSON.stringify(data || {}));
    }

    function publishHomeContent(data) {
        window.CRP_SITE_CONTENT = cloneData(data);
        window.dispatchEvent(new CustomEvent("crp-content-loaded", {
            detail: {
                data: window.CRP_SITE_CONTENT
            }
        }));
    }

    function renderSectionHeader(section, data) {
        if (!section || !data) return;
        setText(".section-kicker", data.kicker, section);
        setText("h2", data.title, section);
        setText(".section-intro", data.intro, section);
    }

    function renderHero(hero) {
        if (!hero) return;
        setText(".hero-kicker", hero.kicker);
        setText(".hero h1", hero.title);
        setText(".hero-subtitle", hero.subtitle);

        const background = document.querySelector(".hero-background");
        if (background && hero.backgroundImage) {
            background.style.backgroundImage = `url("${hero.backgroundImage}")`;
        }

        const actions = document.querySelector(".hero-actions");
        if (actions) {
            actions.innerHTML = [
                buttonHtml(hero.primaryButton, "primary"),
                buttonHtml(hero.secondaryButton, "ghost")
            ].join("");
        }
    }

    function renderAbout(about) {
        const section = document.getElementById("despre");
        if (!section || !about) return;

        setText(".section-kicker", about.kicker, section);
        setText("h2", about.title, section);
        setText(".section-intro", about.intro, section);

        const list = section.querySelector(".checklist");
        if (list && Array.isArray(about.items)) {
            list.innerHTML = about.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
        }

        setImage(section.querySelector(".about-photo img"), about.image, about.imageAlt);
    }

    function personCard(person, main) {
        const cardClass = main ? "team-card-main" : "team-card-secondary";
        const photoClass = main ? "team-photo-main" : "team-photo-secondary";

        return `
            <div class="${cardClass}">
                <div class="${photoClass}">
                    <img src="${escapeAttr(person.image || "")}" alt="${escapeAttr(person.name || "")}" />
                </div>
                <h3>${escapeHtml(person.name)}</h3>
                <p class="team-role">${escapeHtml(person.role)}</p>
            </div>
        `;
    }

    function renderTeam(team) {
        const section = document.getElementById("comitet");
        if (!section || !team) return;

        renderSectionHeader(section, team);

        const mainGrid = section.querySelector(".team-main-grid");
        if (mainGrid && Array.isArray(team.main)) {
            mainGrid.innerHTML = team.main.map((person) => personCard(person, true)).join("");
        }

        const membersGrid = section.querySelector(".team-secondary-grid");
        if (membersGrid && Array.isArray(team.members)) {
            membersGrid.innerHTML = team.members.map((person) => personCard(person, false)).join("");
        }

        if (typeof initTeamMarquee === "function") initTeamMarquee();
    }

    function renderBeliefs(beliefs) {
        const section = document.getElementById("convingeri");
        if (!section || !beliefs) return;

        setText(".conv-pill", beliefs.pill, section);
        setText(".conv-title", beliefs.title, section);
        setText(".conv-subtitle", beliefs.subtitle, section);
        setText(".conv-meta", beliefs.meta, section);

        const grid = section.querySelector(".conv-grid");
        if (grid && Array.isArray(beliefs.cards)) {
            grid.innerHTML = beliefs.cards.map((card) => `
                <a href="${escapeAttr(card.href || "#")}" class="conv-card">
                    <h3>${escapeHtml(card.title)}</h3>
                </a>
            `).join("");
        }
    }

    function renderCounties(counties) {
        const section = document.getElementById("judete");
        if (!section || !counties) return;

        renderSectionHeader(section, counties);
        setText(".judete-tagline span", counties.tagline, section);

        const grid = section.querySelector(".judete-grid");
        if (grid && Array.isArray(counties.cards)) {
            grid.innerHTML = counties.cards.map((county) => `
                <a href="${escapeAttr(county.href || "#")}" class="judet-card judet-link">
                    <span class="judet-name">${escapeHtml(county.name)}</span>
                    <span class="judet-sub">${escapeHtml(county.subtitle)}</span>
                    <span class="judet-arrow">-></span>
                    <div class="judet-overlay">
                        <p>${escapeHtml(county.overlay)}</p>
                    </div>
                </a>
            `).join("");
        }
    }

    function renderEvents(sectionData, events) {
        const section = document.getElementById("evenimente");
        if (!section) return;

        renderSectionHeader(section, sectionData);

        const track = document.getElementById("eventsTrack");
        if (track && Array.isArray(events)) {
            track.innerHTML = events.map((event, index) => `
                <article class="event-slide" data-index="${index}">
                    <a href="${escapeAttr(event.href || "#")}" class="event-card-link">
                        <div class="event-card">
                            <div class="event-image">
                                <img src="${escapeAttr(event.image || "")}" alt="${escapeAttr(event.imageAlt || event.title || "")}">
                            </div>
                            <div class="event-body">
                                <p class="event-date">${escapeHtml(event.date)}</p>
                                <h3 class="event-title">${escapeHtml(event.title)}</h3>
                                <div class="event-divider"></div>
                                <p class="event-text">${escapeHtml(event.text)}</p>
                            </div>
                        </div>
                    </a>
                </article>
            `).join("");
        }
    }

    function renderArchivedEvents(data) {
        const section = document.getElementById("evenimenteArhivate");
        const grid = document.getElementById("archivedEventsGrid");
        if (!section || !grid) return;

        const events = Array.isArray(data && data.archivedEvents) ? data.archivedEvents : [];

        setText(".section-kicker", "ARHIVA", section);
        setText("h2", "Evenimente arhivate", section);
        setText(
            ".section-intro",
            `Evenimente mutate din pagina principala. Total arhivate: ${events.length}.`,
            section
        );

        if (!events.length) {
            grid.innerHTML = `<p class="archived-empty">Nu exista inca evenimente arhivate.</p>`;
        } else {
            grid.innerHTML = events.map((event) => `
                <a href="${escapeAttr(event.href || "#")}" class="archived-event-card">
                    <img src="${escapeAttr(event.image || "images/placeholder.png")}" alt="${escapeAttr(event.imageAlt || event.title || "")}">
                    <span class="event-date">${escapeHtml(event.date || "")}</span>
                    <strong>${escapeHtml(event.title || "Eveniment arhivat")}</strong>
                    <p>${escapeHtml(event.text || "")}</p>
                </a>
            `).join("");
        }

        if (typeof revealOnScroll === "function") revealOnScroll();
        window.dispatchEvent(new CustomEvent("crp-page-dom-updated"));
    }

    function renderSeminars(sectionData, seminars) {
        const section = document.getElementById("seminarii");
        if (!section) return;

        renderSectionHeader(section, sectionData);

        const grid = section.querySelector(".seminars-grid");
        if (grid && Array.isArray(seminars)) {
            grid.innerHTML = seminars.map((seminar) => `
                <a href="${escapeAttr(seminar.href || "#")}" class="seminar-card-link">
                    <div class="seminar-card">
                        <h3>${escapeHtml(seminar.title)}</h3>
                        <p>${escapeHtml(seminar.text)}</p>
                    </div>
                </a>
            `).join("");
        }
    }

    function renderSchool(school) {
        const section = document.getElementById("liceu");
        if (!section || !school) return;

        const link = section.querySelector(".liceu-card");
        if (link && school.href) link.href = school.href;
        setImage(section.querySelector(".liceu-img-wrapper img"), school.image, school.imageAlt);
        setText(".liceu-title", school.title, section);
        setText(".liceu-subtitle", school.subtitle, section);
        setText(".liceu-hover-overlay span", school.hoverText, section);
    }

    function renderLocation(location) {
        const section = document.getElementById("locatie");
        if (!section || !location) return;

        renderSectionHeader(section, location);

        const iframe = section.querySelector("iframe");
        if (iframe && location.mapEmbedUrl) iframe.src = location.mapEmbedUrl;
    }

    function renderContact(contact) {
        const section = document.getElementById("contact");
        if (!section || !contact) return;

        renderSectionHeader(section, contact);
        setText(".contact-pill", contact.pill, section);
        setText(".contact-title", contact.heading, section);
        setText(".contact-text", contact.text, section);

        const details = section.querySelector(".contact-details ul");
        if (details) {
            details.innerHTML = `
                <li><strong>Adresa:</strong><span>${escapeHtml(contact.address)}</span></li>
                <li><strong>Email:</strong><a href="mailto:${escapeAttr(contact.email)}">${escapeHtml(contact.email)}</a></li>
                <li><strong>Telefon:</strong><span>${escapeHtml(contact.phone)}</span></li>
            `;
        }

        section.querySelectorAll(".contact-note").forEach((node) => {
            node.textContent = contact.note || "";
        });
    }

    function renderFooter(footer) {
        const siteFooter = document.querySelector(".site-footer");
        if (!siteFooter || !footer) return;

        setText(".footer-brand strong", footer.brand, siteFooter);
        setText(".footer-sub", footer.subtitle, siteFooter);
        setText(".footer-brand p", footer.text, siteFooter);

        const contactColumn = siteFooter.querySelector(".footer-col:last-child");
        if (contactColumn) {
            contactColumn.innerHTML = `
                <h4>Contact</h4>
                <p>${escapeHtml(footer.address)}</p>
                <p><a href="mailto:${escapeAttr(footer.email)}">${escapeHtml(footer.email)}</a></p>
                <p>${escapeHtml(footer.phone)}</p>
            `;
        }
    }

    function renderHome(data) {
        renderHero(data.hero);
        renderAbout(data.about);
        renderTeam(data.team);
        renderBeliefs(data.beliefs);
        renderCounties(data.counties);
        renderEvents(data.eventsSection, data.events);
        renderSeminars(data.seminarsSection, data.seminars);
        renderSchool(data.school);
        renderLocation(data.location);
        renderContact(data.contact);
        renderFooter(data.footer);

        if (typeof initEventsCarousel === "function") initEventsCarousel();
        if (typeof revealOnScroll === "function") revealOnScroll();
        publishHomeContent(data);
    }

    function renderGallery(data) {
        if (!data) return;

        const grid = document.querySelector(".gallery-grid");
        const section = grid ? grid.closest("section") : null;
        if (!grid || !section) return;

        setText(".section-kicker", data.kicker, section);
        setText("h2", data.title, section);
        setText(".section-intro", data.intro, section);

        if (Array.isArray(data.images)) {
            grid.innerHTML = data.images.map((src) => `
                <div class="gallery-item">
                    <img src="${escapeAttr(src)}" loading="lazy" alt="${escapeAttr(data.title || "Imagine galerie")}">
                </div>
            `).join("");
        }

        if (typeof loadZoomableImages === "function") loadZoomableImages();
        if (typeof revealOnScroll === "function") revealOnScroll();
        window.dispatchEvent(new CustomEvent("crp-page-dom-updated"));
    }

    window.CRP_RENDER_HOME = renderHome;

    if (pageName === "index.html") {
        loadJson("content/site.json")
            .then(renderHome)
            .catch((error) => console.warn("Pages CMS homepage content is not available.", error));
    }

    if (pageName === "conferinta1.html") {
        loadJson("content/galleries/conferinta1.json")
            .then(renderGallery)
            .catch((error) => console.warn("Pages CMS gallery content is not available.", error));
    }

    if (pageName === "evenimente-arhivate.html") {
        loadJson("content/site.json")
            .then(renderArchivedEvents)
            .catch((error) => console.warn("Archived events content is not available.", error));
    }
})();
