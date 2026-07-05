// Impact dashboard charts: publications-per-year columns and the member
// co-authorship heatmap. Plain SVG, colors from CSS custom properties so
// dark mode gets its own validated ramp (see impact.scss).
(function () {
    var data = window.IMPACT_DATA || {};
    var SVGNS = "http://www.w3.org/2000/svg";
    var tooltip = document.getElementById("chart-tooltip");

    function css(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function el(name, attrs, parent) {
        var node = document.createElementNS(SVGNS, name);
        for (var k in attrs) node.setAttribute(k, attrs[k]);
        if (parent) parent.appendChild(node);
        return node;
    }

    function showTip(evt, html) {
        tooltip.innerHTML = html;
        tooltip.hidden = false;
        var x = evt.clientX + 12, y = evt.clientY + 12;
        var r = tooltip.getBoundingClientRect();
        if (x + r.width > window.innerWidth - 8) x = evt.clientX - r.width - 12;
        tooltip.style.left = x + "px";
        tooltip.style.top = (y + window.scrollY) + "px";
    }
    function hideTip() { tooltip.hidden = true; }

    // ---------- Publications per year (column chart) ----------
    function yearsChart() {
        var host = document.getElementById("years-chart");
        if (!host) return;
        var counts = {};
        data.years.forEach(function (y) { counts[y] = (counts[y] || 0) + 1; });
        var years = Object.keys(counts).map(Number).sort(function (a, b) { return a - b; });
        var max = Math.max.apply(null, years.map(function (y) { return counts[y]; }));

        var W = 720, H = 260, PAD = { t: 18, r: 8, b: 26, l: 26 };
        var iw = W - PAD.l - PAD.r, ih = H - PAD.t - PAD.b;
        var svg = el("svg", { viewBox: "0 0 " + W + " " + H, width: "100%" }, host);
        var barColor = css("--chart-bar") || "#00958c";
        var ink = css("--muted-ink") || "#717171";
        var grid = css("--grid-line") || "#e4e4e4";

        // recessive horizontal gridlines at nice intervals
        var step = max > 12 ? 5 : 2;
        for (var g = step; g <= max; g += step) {
            var gy = PAD.t + ih - (g / max) * ih;
            el("line", { x1: PAD.l, x2: W - PAD.r, y1: gy, y2: gy, stroke: grid, "stroke-width": 1 }, svg);
            var lbl = el("text", { x: PAD.l - 6, y: gy + 3, "text-anchor": "end", "font-size": 10, fill: ink }, svg);
            lbl.textContent = g;
        }

        var bw = Math.min(28, (iw / years.length) - 4);
        var latest = years[years.length - 1];
        var maxYear = years.reduce(function (a, y) { return counts[y] > counts[a] ? y : a; }, years[0]);

        years.forEach(function (y, i) {
            var x = PAD.l + (i + 0.5) * (iw / years.length) - bw / 2;
            var h = (counts[y] / max) * ih;
            var top = PAD.t + ih - h;
            // 4px rounded data-end anchored to the baseline
            var path = "M" + x + "," + (PAD.t + ih) +
                " V" + (top + 4) + " Q" + x + "," + top + " " + (x + 4) + "," + top +
                " H" + (x + bw - 4) + " Q" + (x + bw) + "," + top + " " + (x + bw) + "," + (top + 4) +
                " V" + (PAD.t + ih) + " Z";
            var bar = el("path", { d: path, fill: barColor, tabindex: 0, role: "img",
                                   "aria-label": counts[y] + " publications in " + y }, svg);
            function tip(e) { showTip(e, "<b>" + y + "</b>: " + counts[y] + " publication" + (counts[y] > 1 ? "s" : "")); }
            bar.addEventListener("mousemove", tip);
            bar.addEventListener("mouseleave", hideTip);
            bar.addEventListener("focus", function () {
                var r = bar.getBoundingClientRect();
                showTip({ clientX: r.left + r.width / 2, clientY: r.top }, "<b>" + y + "</b>: " + counts[y]);
            });
            bar.addEventListener("blur", hideTip);

            // x labels every other year when crowded
            if (years.length <= 12 || i % 2 === (years.length % 2 === 0 ? 1 : 0)) {
                var xl = el("text", { x: x + bw / 2, y: H - 8, "text-anchor": "middle", "font-size": 10, fill: ink }, svg);
                xl.textContent = y;
            }
            // selective direct labels: the peak and the latest year only
            if (y === maxYear || y === latest) {
                var vl = el("text", { x: x + bw / 2, y: top - 5, "text-anchor": "middle", "font-size": 11,
                                      fill: css("--fg") || "#000", "font-weight": "bold" }, svg);
                vl.textContent = counts[y];
            }
        });

        var table = document.getElementById("years-table");
        table.innerHTML = "<caption>Publications per year</caption><tr><th scope='col'>year</th><th scope='col'>publications</th></tr>" +
            years.map(function (y) { return "<tr><td>" + y + "</td><td>" + counts[y] + "</td></tr>"; }).join("");
    }

    // ---------- Co-authorship heatmap ----------
    function deburr(s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
    var SURNAME_ONLY = ["worsley", "puthipiroj", "kshirsagar", "quiterio", "bodon", "eze"];
    function matcher(name) {
        var parts = name.trim().split(/\s+/);
        var surname = deburr(parts[parts.length - 1]);
        var initial = deburr(parts[0][0]);
        return SURNAME_ONLY.indexOf(surname) !== -1
            ? new RegExp(surname + ",")
            : new RegExp(surname + ",\\s*" + initial);
    }

    function coauthorChart() {
        var host = document.getElementById("coauthor-chart");
        if (!host) return;
        var members = data.members.slice();
        var res = members.map(function (m) { return matcher(m); });
        var cites = data.citations.map(deburr);

        // count co-authored papers per member pair; drop members with none
        var onPaper = members.map(function (_, i) {
            return cites.map(function (c) { return res[i].test(c); });
        });
        var pubCount = onPaper.map(function (row) {
            return row.reduce(function (a, b) { return a + (b ? 1 : 0); }, 0);
        });
        var keep = members.map(function (_, i) { return pubCount[i] > 0; });
        var idx = [];
        members.forEach(function (_, i) { if (keep[i]) idx.push(i); });
        // order by publication count so the busiest collaborators sit top-left
        idx.sort(function (a, b) { return pubCount[b] - pubCount[a]; });

        var n = idx.length;
        var counts = [];
        var maxPair = 1;
        for (var a = 0; a < n; a++) {
            counts.push([]);
            for (var b = 0; b < n; b++) {
                var c = 0;
                if (a !== b) {
                    for (var k = 0; k < cites.length; k++) {
                        if (onPaper[idx[a]][k] && onPaper[idx[b]][k]) c++;
                    }
                }
                counts[a].push(c);
                if (c > maxPair) maxPair = c;
            }
        }

        var ramp = [css("--heat-1"), css("--heat-2"), css("--heat-3"), css("--heat-4")];
        var surname = function (i) { return members[idx[i]].trim().split(/\s+/).pop(); };

        var CELL = 34, GAP = 2, LBL = 92;
        var W = LBL + n * (CELL + GAP), H = LBL + n * (CELL + GAP);
        var svg = el("svg", { viewBox: "0 0 " + W + " " + H, width: "100%", style: "max-width:" + W + "px" }, host);
        var ink = css("--muted-ink") || "#717171";

        for (var i = 0; i < n; i++) {
            var rl = el("text", { x: LBL - 6, y: LBL + i * (CELL + GAP) + CELL / 2 + 3,
                                  "text-anchor": "end", "font-size": 10, fill: ink }, svg);
            rl.textContent = surname(i);
            var clbl = el("text", { x: LBL + i * (CELL + GAP) + CELL / 2, y: LBL - 6,
                                    "font-size": 10, fill: ink,
                                    transform: "rotate(-45 " + (LBL + i * (CELL + GAP) + CELL / 2) + " " + (LBL - 6) + ")" }, svg);
            clbl.textContent = surname(i);
        }

        for (var r = 0; r < n; r++) {
            for (var c2 = 0; c2 < n; c2++) {
                if (c2 >= r) continue; // lower triangle only — the matrix is symmetric
                var v = counts[r][c2];
                var x = LBL + c2 * (CELL + GAP), y = LBL + r * (CELL + GAP);
                var fill = v === 0 ? (css("--cell-empty") || "#f2f2f2")
                    : ramp[Math.min(3, Math.floor((v / maxPair) * 4))];
                var cell = el("rect", { x: x, y: y, width: CELL, height: CELL, fill: fill,
                                        tabindex: v > 0 ? 0 : -1 }, svg);
                if (v > 0) {
                    var t = el("text", { x: x + CELL / 2, y: y + CELL / 2 + 3, "text-anchor": "middle",
                                         "font-size": 11, "font-weight": "bold",
                                         fill: v / maxPair > 0.5 ? "#fff" : (css("--fg") || "#000"),
                                         "pointer-events": "none" }, svg);
                    t.textContent = v;
                    (function (r_, c_, v_) {
                        var msg = "<b>" + surname(r_) + " &amp; " + surname(c_) + "</b>: " +
                                  v_ + " co-authored publication" + (v_ > 1 ? "s" : "");
                        cell.addEventListener("mousemove", function (e) { showTip(e, msg); });
                        cell.addEventListener("mouseleave", hideTip);
                        cell.setAttribute("role", "img");
                        cell.setAttribute("aria-label", surname(r_) + " and " + surname(c_) + ": " + v_ + " co-authored publications");
                    })(r, c2, v);
                }
            }
        }

        var table = document.getElementById("coauthor-table");
        var head = "<caption>Co-authored publications between current members</caption><tr><th scope='col'></th>" +
            idx.map(function (_, i) { return "<th scope='col'>" + surname(i) + "</th>"; }).join("") + "</tr>";
        var rows = idx.map(function (_, r2) {
            return "<tr><th scope='row'>" + surname(r2) + "</th>" +
                idx.map(function (_, c3) { return "<td>" + (r2 === c3 ? "—" : counts[r2][c3]) + "</td>"; }).join("") + "</tr>";
        }).join("");
        table.innerHTML = head + rows;
    }

    yearsChart();
    coauthorChart();
})();
