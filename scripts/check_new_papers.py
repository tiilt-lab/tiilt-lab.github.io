#!/usr/bin/env python3
"""Check Crossref and Semantic Scholar for recent Marcelo Worsley publications
that aren't in _data/papers.yml yet. Prints a markdown report of candidates
(empty output = nothing new). Run by .github/workflows/papers-watch.yml.
"""
import json
import re
import sys
import urllib.parse
import urllib.request
from datetime import date

import yaml

UA = {"User-Agent": "tiilt-website-papers-watch (mailto:tiiltlab@gmail.com)"}
SINCE_YEAR = date.today().year - 1


def fetch(url):
    try:
        with urllib.request.urlopen(
            urllib.request.Request(url, headers=UA), timeout=30
        ) as r:
            return json.load(r)
    except Exception as e:  # network hiccups shouldn't fail the whole run
        print(f"<!-- fetch failed: {url}: {e} -->", file=sys.stderr)
        return None


def norm(s):
    return re.sub(r"[^a-z0-9]+", "", s.lower())


def known_set():
    data = yaml.safe_load(open("_data/papers.yml"))
    blob = norm(" ".join(p.get("citation", "") + " " + (p.get("doi") or "") for p in data["papers"]))
    return blob


def crossref_candidates():
    url = (
        "https://api.crossref.org/works?"
        + urllib.parse.urlencode(
            {
                "query.author": "Marcelo Worsley",
                "filter": f"from-pub-date:{SINCE_YEAR}-01-01",
                "rows": "100",
                "select": "DOI,title,author,container-title,issued",
            }
        )
    )
    data = fetch(url)
    if not data:
        return []
    out = []
    for item in data.get("message", {}).get("items", []):
        authors = item.get("author", [])
        if not any(
            a.get("family", "").lower() == "worsley"
            and a.get("given", "").lower().startswith("marcelo")
            for a in authors
        ):
            continue
        title = (item.get("title") or [""])[0]
        if not title:
            continue
        year = (item.get("issued", {}).get("date-parts") or [[None]])[0][0]
        venue = (item.get("container-title") or [""])[0]
        out.append(
            {
                "title": title,
                "year": year,
                "venue": venue,
                "doi": item.get("DOI", ""),
                "source": "Crossref",
            }
        )
    return out


def semantic_scholar_candidates():
    search = fetch(
        "https://api.semanticscholar.org/graph/v1/author/search?"
        + urllib.parse.urlencode({"query": "Marcelo Worsley", "fields": "name,affiliations"})
    )
    if not search:
        return []
    out = []
    for author in search.get("data", [])[:3]:
        papers = fetch(
            f"https://api.semanticscholar.org/graph/v1/author/{author['authorId']}/papers?"
            + urllib.parse.urlencode(
                {"fields": "title,year,venue,externalIds", "limit": "100"}
            )
        )
        if not papers:
            continue
        for p in papers.get("data", []):
            if not p.get("year") or p["year"] < SINCE_YEAR:
                continue
            doi = (p.get("externalIds") or {}).get("DOI", "")
            out.append(
                {
                    "title": p.get("title", ""),
                    "year": p.get("year"),
                    "venue": p.get("venue", ""),
                    "doi": doi,
                    "source": "Semantic Scholar",
                }
            )
    return out


def main():
    known = known_set()
    seen_titles = set()
    fresh = []
    for cand in crossref_candidates() + semantic_scholar_candidates():
        t = norm(cand["title"])
        if not t or t in seen_titles:
            continue
        seen_titles.add(t)
        doi_known = cand["doi"] and norm(cand["doi"]) in known
        title_known = t[:60] in known
        if doi_known or title_known:
            continue
        fresh.append(cand)

    if not fresh:
        return
    print(f"The quarterly publications check found {len(fresh)} paper(s) that may be missing from `_data/papers.yml`:\n")
    for c in sorted(fresh, key=lambda x: -(x["year"] or 0)):
        doi = f" — [doi:{c['doi']}](https://doi.org/{c['doi']})" if c["doi"] else ""
        print(f"- **{c['title']}** ({c['year']}, {c['venue'] or 'venue unknown'}){doi} _[{c['source']}]_")
    print("\nVerify each before adding — author-name search can surface false positives.")


if __name__ == "__main__":
    main()
