// Shared site behavior: injected header/nav, projects dropdown,
// "read more" bio truncation (people page), lazy images, card reveal.

// Arms the JS-only CSS (card entrance animation) — see styles.scss
document.documentElement.classList.add("js");

// Apply a manually-chosen theme before first paint (falls back to the
// OS preference via the prefers-color-scheme CSS when nothing is stored)
try {
    var storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
        document.documentElement.dataset.theme = storedTheme;
    }
} catch (e) { /* private mode */ }

// Inline nav icons (Unicons line set, https://github.com/Iconscout/unicons,
// Apache-2.0) — replaces the render-blocking icon-font CDN.
var NAV_ICONS = {
    "home": ["M21.66,10.25l-9-8a1,1,0,0,0-1.32,0l-9,8a1,1,0,0,0-.27,1.11A1,1,0,0,0,3,12H4v9a1,1,0,0,0,1,1H19a1,1,0,0,0,1-1V12h1a1,1,0,0,0,.93-.64A1,1,0,0,0,21.66,10.25ZM13,20H11V17a1,1,0,0,1,2,0Zm5,0H15V17a3,3,0,0,0-6,0v3H6V12H18ZM5.63,10,12,4.34,18.37,10Z"],
    "drill": ["M19,4H9A1,1,0,0,0,8,5V7H3A1,1,0,0,0,3,9H8v4a1,1,0,0,0,2,0V12h4v7a1,1,0,0,0,1,1h2a3,3,0,0,0,3-3V11.82A3,3,0,0,0,22,9V7A3,3,0,0,0,19,4ZM18,17a1,1,0,0,1-1,1H16V12h2Zm2-8a1,1,0,0,1-1,1H10V6h6V7a1,1,0,0,0,2,0V6h1a1,1,0,0,1,1,1Z"],
    "users-alt": ["M12.3,12.22A4.92,4.92,0,0,0,14,8.5a5,5,0,0,0-10,0,4.92,4.92,0,0,0,1.7,3.72A8,8,0,0,0,1,19.5a1,1,0,0,0,2,0,6,6,0,0,1,12,0,1,1,0,0,0,2,0A8,8,0,0,0,12.3,12.22ZM9,11.5a3,3,0,1,1,3-3A3,3,0,0,1,9,11.5Zm9.74.32A5,5,0,0,0,15,3.5a1,1,0,0,0,0,2,3,3,0,0,1,3,3,3,3,0,0,1-1.5,2.59,1,1,0,0,0-.5.84,1,1,0,0,0,.45.86l.39.26.13.07a7,7,0,0,1,4,6.38,1,1,0,0,0,2,0A9,9,0,0,0,18.74,11.82Z"],
    "file-alt": ["M9,10h1a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Zm0,2a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2ZM20,8.94a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19.32.32,0,0,0-.09,0A.88.88,0,0,0,13.05,2H7A3,3,0,0,0,4,5V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V9S20,9,20,8.94ZM14,5.41,16.59,8H15a1,1,0,0,1-1-1ZM18,19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V5A1,1,0,0,1,7,4h5V7a3,3,0,0,0,3,3h3Zm-3-3H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2Z"],
    "book": ["M15,6H9A1,1,0,0,0,8,7v4a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V7A1,1,0,0,0,15,6Zm-1,4H10V8h4Zm3-8H5A1,1,0,0,0,4,3V21a1,1,0,0,0,1,1H17a3,3,0,0,0,3-3V5A3,3,0,0,0,17,2Zm1,17a1,1,0,0,1-1,1H6V4H17a1,1,0,0,1,1,1Z"],
    "pen": ["M22,7.24a1,1,0,0,0-.29-.71L17.47,2.29A1,1,0,0,0,16.76,2a1,1,0,0,0-.71.29L13.22,5.12h0L2.29,16.05a1,1,0,0,0-.29.71V21a1,1,0,0,0,1,1H7.24A1,1,0,0,0,8,21.71L18.87,10.78h0L21.71,8a1.19,1.19,0,0,0,.22-.33,1,1,0,0,0,0-.24.7.7,0,0,0,0-.14ZM6.83,20H4V17.17l9.93-9.93,2.83,2.83ZM18.17,8.66,15.34,5.83l1.42-1.41,2.82,2.82Z"],
    "ellipsis-h": ["M12,10a2,2,0,1,0,2,2A2,2,0,0,0,12,10ZM5,10a2,2,0,1,0,2,2A2,2,0,0,0,5,10Zm14,0a2,2,0,1,0,2,2A2,2,0,0,0,19,10Z"],
    "moon": ["M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"],
    "sun": ["M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"],
    "flask": ["M20.11,17.49,15,8.73V4h1a1,1,0,0,0,0-2H8A1,1,0,0,0,8,4H9V8.73L3.89,17.49A3,3,0,0,0,6.48,22h11a3,3,0,0,0,2.59-4.51Zm-9.25-8A1,1,0,0,0,11,9V4h2V9a1,1,0,0,0,.14.5L14,11H10Zm7.52,10a1,1,0,0,1-.86.5h-11a1,1,0,0,1-.86-.5,1,1,0,0,1,0-1L8.83,13h6.35l3.2,5.5A1,1,0,0,1,18.38,19.5ZM10,15a1,1,0,1,0,1,1A1,1,0,0,0,10,15Zm4,1a1,1,0,1,0,1,1A1,1,0,0,0,14,16Z"],
    "info-circle": ["M12,2A10,10,0,1,0,22,12,10.01114,10.01114,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.00917,8.00917,0,0,1,12,20Zm0-8.5a1,1,0,0,0-1,1v3a1,1,0,0,0,2,0v-3A1,1,0,0,0,12,11.5Zm0-4a1.25,1.25,0,1,0,1.25,1.25A1.25,1.25,0,0,0,12,7.5Z"],
    "envelope": ["M19,4H5A3,3,0,0,0,2,7V17a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm-.41,2-5.88,5.88a1,1,0,0,1-1.42,0L5.41,6ZM20,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V7.41l5.88,5.88a3,3,0,0,0,4.24,0L20,7.41Z"]
};

function navIcon(name) {
    var paths = NAV_ICONS[name].map(function (d) { return '<path d="' + d + '"/>'; }).join("");
    return '<svg class="nav-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor">' + paths + '</svg>';
}

function headerGenerator() {
    var header = document.getElementsByTagName("header")[0];

    // Skip link for keyboard users, first focusable element on the page
    var main = document.querySelector("main");
    if (main && !main.id) main.id = "main-content";
    var skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#" + (main ? main.id : "main-content");
    skip.textContent = "skip to content";
    document.body.insertBefore(skip, document.body.firstChild);

    // The site is served from the domain root, so absolute paths work from
    // every page regardless of nesting depth.
    header.innerHTML =
    `<p class="site-title"><a href="/" aria-label="TIILT Lab home">technological innovations for inclusive learning &amp; teaching</a></p>
    <nav aria-label="Main Navigation">
        <ul>
            <li>
                <div class="nav-dropdown">
                    <a href="/projects/" class="nav-dropdown__link">projects
                        ${navIcon("drill")}
                    </a>
                    <button type="button" class="nav-dropdown__toggle" aria-haspopup="true" aria-expanded="false" aria-controls="projects-menu" aria-label="Toggle projects menu">
                      <span aria-hidden="true">▼</span>
                    </button>
                    <div class="nav-dropdown__menu" id="projects-menu">
                        <a href="/projects/">all projects</a>
                        <a href="/projects/blinc/">blinc</a>
                        <a href="/projects/sportsense/">sportsense</a>
                        <a href="/projects/sportsensefordata/">sportsense for data</a>
                        <a href="/playground/">playground</a>
                    </div>
                </div>
            </li>
            <li>
                <a href="/people/">people
                    ${navIcon("users-alt")}
                </a>
            </li>
            <li>
                <a href="/papers/">research
                    ${navIcon("flask")}
                </a>
            </li>
            <li>
                <a href="/classes/">classes
                    ${navIcon("book")}
                </a>
            </li>
            <li>
                <a href="/blog/">news
                    ${navIcon("pen")}
                </a>
            </li>
            <li>
                <a href="/contact/">contact
                    ${navIcon("envelope")}</a>
            </li>
            <li>
                <button type="button" class="theme-toggle" aria-label="Switch to dark mode">
                    ${navIcon("moon")}
                </button>
            </li>
        </ul>
    </nav>`

    markCurrentPage();
    initDropdowns();
    initThemeToggle();
    footerGenerator();
}

function footerGenerator() {
    if (document.querySelector(".site-footer")) return;
    var footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML =
    `<p>tiilt lab &middot; Northwestern University &middot; Mudd 3104</p>
    <p>
        <a href="mailto:tiiltlab@gmail.com">tiiltlab@gmail.com</a>
        &middot; <a href="https://twitter.com/tiiltlab">twitter</a>
        &middot; <a href="https://github.com/tiilt-lab">github</a>
        &middot; <a href="/feed.xml">rss</a>
    </p>
    <p>&copy; ${new Date().getFullYear()} TIILT Lab</p>`;
    document.body.appendChild(footer);
}

// Highlight the nav link(s) matching the current URL path.
function markCurrentPage() {
    var pageSegments = window.location.pathname
        .split("/")
        .filter(function (s) { return s !== "" && s !== "index.html"; });

    Array.from(document.querySelectorAll("header nav a")).forEach(function (link) {
        var linkSegments = new URL(link.href, window.location.origin).pathname
            .split("/")
            .filter(function (s) { return s !== "" && s !== "index.html"; });

        var isCurrent = linkSegments.length === 0
            ? pageSegments.length === 0
            : subset(linkSegments, pageSegments);

        if (isCurrent) {
            link.classList.add("current-page");
            link.setAttribute("aria-current", "page");
        }
    });
}

function subset(l1, l2) {
    if (l1.length == 0) {
        return false
    }
    return l1.every(i => l2.includes(i))
}

function initDropdowns() {
    var dropdowns = Array.from(document.querySelectorAll(".nav-dropdown"));

    function closeAll(except) {
        dropdowns.forEach(function (d) {
            if (d === except) return;
            d.classList.remove("open");
            d.querySelector(".nav-dropdown__toggle").setAttribute("aria-expanded", "false");
        });
    }

    dropdowns.forEach(function (dropdown) {
        var toggleBtn = dropdown.querySelector(".nav-dropdown__toggle");
        toggleBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            closeAll(dropdown); // only one menu open at a time
            dropdown.classList.toggle("open");
            toggleBtn.setAttribute("aria-expanded", dropdown.classList.contains("open"));
        });
    });
    document.addEventListener("click", function () { closeAll(null); });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeAll(null);
    });
}

// Manual light/dark override; the choice persists in localStorage and the
// impact charts listen for the change to re-render with the other ramp.
function initThemeToggle() {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;

    function currentTheme() {
        return document.documentElement.dataset.theme ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }

    function paint() {
        var dark = currentTheme() === "dark";
        btn.innerHTML = navIcon(dark ? "sun" : "moon");
        btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
        btn.setAttribute("aria-pressed", String(dark));
    }

    btn.addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem("theme", next); } catch (e) { /* private mode */ }
        paint();
        document.documentElement.dispatchEvent(new CustomEvent("themechange"));
    });
    paint();
}

// On mobile the nav sits at the bottom of the screen, so dropdown menus
// open upward ("dropup") instead of downward.
function changeDropdown() {
    var mobile = window.innerWidth <= 640;
    Array.from(document.querySelectorAll(".nav-dropdown")).forEach(function (dropdown) {
        dropdown.classList.toggle("dropup", mobile);
        var arrow = dropdown.querySelector(".nav-dropdown__toggle span");
        if (arrow) arrow.textContent = mobile ? "▲" : "▼";
    });
}

headerGenerator();
changeDropdown();

// Let the logo's circuit traces draw themselves in (see logo.scss)
requestAnimationFrame(function () {
    requestAnimationFrame(function () {
        Array.from(document.querySelectorAll(".big-logo")).forEach(function (logo) {
            logo.classList.add("drawn");
        });
    });
});

window.addEventListener("resize", changeDropdown);
window.addEventListener("orientationchange", changeDropdown);

function contractText(button) {
    const p_Sibling = button.closest('.textblock').querySelector('p');

    const textContracted = p_Sibling.classList.toggle("contracted_text");
    button.textContent = textContracted ? "read more" : "read less";
    button.setAttribute("aria-expanded", String(!textContracted));
}

function addReadMoreButtons() {
    const paragraphs = document.querySelectorAll("article:not(.leaders) > .people-group section p");

    // Apply clamp to all paragraphs first
    paragraphs.forEach((para) => {
        para.classList.add('contracted_text');
    });

    // Wait for reflow, then check which are truncated
    requestAnimationFrame(() => {
        paragraphs.forEach((para) => {
            if (para.scrollHeight > para.clientHeight) {
                const button = document.createElement("button");
                button.textContent = "read more";
                button.setAttribute("aria-expanded", "false");
                button.addEventListener('click', () => contractText(button));
                para.after(button);
            }
        });
        wrapCardFooters();
    });
}

function wrapCardFooters() {
    const cards = document.querySelectorAll(".people-group .textblock");
    cards.forEach(card => {
        const footer = document.createElement("div");
        footer.classList.add("card-actions");

        const buttons = card.querySelectorAll(":scope > button");
        const links = card.querySelectorAll(":scope > a");

        if (buttons.length === 0 && links.length === 0) return;

        buttons.forEach(btn => footer.appendChild(btn));
        links.forEach(link => footer.appendChild(link));
        card.appendChild(footer);
    });
}

// Runs immediately: this script sits at the end of <body>, so the DOM is
// parsed. (This used to hang on window.onload, which waits for every
// YouTube iframe — leaving iframe-heavy pages invisible until then.)
(() => {
    if (location.pathname.includes("people")) {
        addReadMoreButtons();
    }

    if (typeof LazyLoad !== 'undefined') {
        const myLazyLoad = new LazyLoad({
            elements_selector: ".lazy"
        });
    }

    // Animate textblocks into view with staggered delays
    var cards = document.querySelectorAll('.textblock');
    if (cards.length > 0 && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        cards.forEach(function(card) { observer.observe(card); });
    } else {
        // Fallback: show all immediately
        cards.forEach(function(card) { card.classList.add('visible'); });
    }

    // Safety net: never leave a card hidden if the observer doesn't fire
    setTimeout(function () {
        cards.forEach(function (card) { card.classList.add('visible'); });
    }, 1500);

})();
