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
            const isEditShortcut = event.ctrlKey && event.altKey && event.key.toLowerCase() === "e";
            if (!isEditShortcut || event.repeat) return;

            event.preventDefault();
            closeMobileNav();
            openAuthModal();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeAuthModal();
        });
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
                    setStatus("Editorul se deschide in pasul urmator.");
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
    }

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
})();
