// Shared site behavior: injected header/nav, projects dropdown,
// "read more" bio truncation (people page), lazy images, card reveal.

// Arms the JS-only CSS (card entrance animation) — see styles.scss
document.documentElement.classList.add("js");

function headerGenerator() {
    var header = document.getElementsByTagName("header")[0];
    // The site is served from the domain root, so absolute paths work from
    // every page regardless of nesting depth.
    header.innerHTML =
    `<p class="site-title">technological innovations for inclusive learning &amp; teaching</p>
    <nav aria-label="Main Navigation">
        <ul>
            <li>
                <a href="/">
                    home
                    <i class='uil uil-home' aria-hidden="true"></i>
                </a>
            </li>
            <li>
                <div class="nav-dropdown">
                    <a href="/projects/" class="nav-dropdown__link">projects
                        <i class='uil uil-drill' aria-hidden="true"></i>
                    </a>
                    <button type="button" class="nav-dropdown__toggle" aria-haspopup="true" aria-expanded="false" aria-controls="projects-menu" aria-label="Toggle projects menu">
                      <span aria-hidden="true">▼</span>
                    </button>
                    <div class="nav-dropdown__menu" id="projects-menu">
                        <a href="/projects/blinc/">blinc</a>
                        <a href="/projects/sportsense/">sportsense</a>
                        <a href="/projects/sportsensefordata/">sportsense for data</a>
                    </div>
                </div>
            </li>
            <li>
                <a href="/people/">people
                    <i class='uil uil-users-alt' aria-hidden="true"></i>
                </a>
            </li>
            <li>
                <a href="/papers/">papers
                    <i class='uil uil-file-alt' aria-hidden="true"></i>
                </a>
            </li>
            <li>
                <a href="/classes/">classes
                    <i class='uil uil-book' aria-hidden="true"></i>
                </a>
            </li>
            <li>
                <a href="/blog/">blog
                    <i class='uil uil-pen' aria-hidden="true"></i>
                </a>
            </li>
            <li>
                <a href="/contact/">contact
                    <i class='uil uil-envelope' aria-hidden="true"></i></a>
            </li>
        </ul>
    </nav>`

    markCurrentPage();
    initDropdown();
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

function initDropdown() {
    var toggleBtn = document.querySelector(".nav-dropdown__toggle");
    if (!toggleBtn) return;

    function closeDropdown() {
        var dropdown = document.querySelector(".nav-dropdown");
        if (dropdown) {
            dropdown.classList.remove("open");
            toggleBtn.setAttribute("aria-expanded", "false");
        }
    }

    toggleBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var dropdown = toggleBtn.closest(".nav-dropdown");
        dropdown.classList.toggle("open");
        toggleBtn.setAttribute("aria-expanded", dropdown.classList.contains("open"));
    });
    document.addEventListener("click", closeDropdown);
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeDropdown();
    });
}

// On mobile the nav sits at the bottom of the screen, so the projects
// dropdown opens upward ("dropup") instead of downward.
function changeDropdown() {
    var dropdown = document.querySelector(".nav-dropdown");
    var arrow = document.querySelector(".nav-dropdown__toggle span");
    if (!dropdown || !arrow) return;

    var mobile = window.innerWidth <= 640;
    dropdown.classList.toggle("dropup", mobile);
    arrow.textContent = mobile ? "▲" : "▼";
}

headerGenerator();
changeDropdown();

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

window.onload = () => {
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

};
