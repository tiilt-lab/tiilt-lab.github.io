// Publications explorer: filter by lab member / free text, per-entry BibTeX.
(function () {
    var papers = Array.from(document.querySelectorAll(".window__paper"));
    var sections = Array.from(document.querySelectorAll("main.papers section[data-year]"));
    var searchBox = document.getElementById("paper-search");
    var clearBtn = document.getElementById("paper-clear");
    var countEl = document.getElementById("paper-count");
    var pillsEl = document.getElementById("member-pills");

    function deburr(s) {
        return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    }

    // Mirrors _plugins/member_pages.rb: rare surnames match surname-only
    // (tolerates initial typos); common surnames need the first initial to
    // separate members from same-surname coauthors (Allyson vs Sarah Lee).
    var SURNAME_ONLY = ["worsley", "puthipiroj", "kshirsagar", "quiterio", "bodon", "eze"];
    function matchToken(name) {
        var parts = name.trim().split(/\s+/);
        var surname = deburr(parts[parts.length - 1]);
        var initial = deburr(parts[0][0]);
        return SURNAME_ONLY.indexOf(surname) !== -1 ? surname + "," : surname + ", " + initial;
    }

    var activeMember = null;

    (window.LAB_MEMBERS || []).forEach(function (name) {
        var token = matchToken(name);
        var hasAny = papers.some(function (p) {
            return deburr(p.dataset.citation).indexOf(token) !== -1;
        });
        if (!hasAny) return;
        var pill = document.createElement("button");
        pill.type = "button";
        pill.className = "member-pill";
        pill.textContent = name.toLowerCase();
        pill.dataset.token = token;
        pill.setAttribute("aria-pressed", "false");
        pill.addEventListener("click", function () {
            activeMember = activeMember === token ? null : token;
            Array.from(pillsEl.children).forEach(function (b) {
                var on = b.dataset.token === activeMember;
                b.classList.toggle("member-pill--on", on);
                b.setAttribute("aria-pressed", String(on));
            });
            applyFilters();
        });
        pillsEl.appendChild(pill);
    });

    function applyFilters() {
        var q = deburr(searchBox.value.trim());
        var visible = 0;
        papers.forEach(function (p) {
            var c = deburr(p.dataset.citation);
            var ok = (!q || c.indexOf(q) !== -1) &&
                     (!activeMember || c.indexOf(activeMember) !== -1);
            p.hidden = !ok;
            if (ok) visible++;
        });
        sections.forEach(function (s) {
            s.hidden = !s.querySelector(".window__paper:not([hidden])");
        });
        var filtering = q || activeMember;
        clearBtn.hidden = !filtering;
        countEl.textContent = filtering
            ? visible + " of " + papers.length + " publications"
            : "";
    }

    searchBox.addEventListener("input", applyFilters);
    clearBtn.addEventListener("click", function () {
        searchBox.value = "";
        activeMember = null;
        Array.from(pillsEl.children).forEach(function (b) {
            b.classList.remove("member-pill--on");
            b.setAttribute("aria-pressed", "false");
        });
        applyFilters();
    });

    // BibTeX buttons for entries with a DOI, via Crossref content negotiation
    papers.forEach(function (p) {
        var doiUrl = p.dataset.doi;
        if (!doiUrl) return;
        var doi = doiUrl.replace(/^https?:\/\/(dx\.)?doi\.org\//, "");
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "bibtex-btn";
        btn.textContent = "BibTeX";
        btn.addEventListener("click", function () {
            btn.textContent = "…";
            fetch("https://api.crossref.org/works/" + encodeURIComponent(doi) +
                  "/transform/application/x-bibtex")
                .then(function (r) {
                    if (!r.ok) throw new Error(r.status);
                    return r.text();
                })
                .then(function (bib) {
                    return navigator.clipboard.writeText(bib.trim());
                })
                .then(function () {
                    btn.textContent = "copied!";
                    setTimeout(function () { btn.textContent = "BibTeX"; }, 1600);
                })
                .catch(function () {
                    btn.textContent = "BibTeX";
                    window.open(doiUrl, "_blank"); // graceful fallback
                });
        });
        p.appendChild(btn);
    });
})();
