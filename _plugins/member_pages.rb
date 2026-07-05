# Generates a profile page at /people/<slug>/ for every active lab member,
# with their publications auto-matched from _data/papers.yml.
#
# Runs during `bundle exec jekyll build` (the deploy workflow); GitHub Pages'
# restricted plugin list doesn't apply because we build the site ourselves.
module TIILT
  def self.deburr(str)
    str.to_s.unicode_normalize(:nfd).gsub(/\p{Mn}/, "")
  end

  # Match citations like "Worsley, M." / "Lee, S. P." for a member name.
  # Surname + first initial keeps same-surname coauthors apart (Allyson Lee
  # vs Sarah Priscilla Lee). Rare surnames listed below match surname-only,
  # which also tolerates initial typos in older citations.
  SURNAME_ONLY = %w[worsley puthipiroj kshirsagar quiterio bodon eze].freeze

  def self.papers_for(member_name, papers)
    parts = deburr(member_name).strip.split(/\s+/)
    surname = parts.last.downcase
    initial = parts.first[0].downcase
    papers.select do |p|
      citation = deburr(p["citation"]).downcase
      if SURNAME_ONLY.include?(surname)
        citation.match?(/#{Regexp.escape(surname)},/)
      else
        citation.match?(/#{Regexp.escape(surname)},\s*#{Regexp.escape(initial)}/)
      end
    end
  end

  class MemberPageGenerator < Jekyll::Generator
    safe false
    priority :normal

    def generate(site)
      members = site.data.dig("people", "members") || []
      papers = (site.data.dig("papers", "papers") || []).sort_by { |p| -p["year"].to_i }
      members.each do |member|
        next unless member["status"] == "active"
        slug = Jekyll::Utils.slugify(member["name"])
        site.pages << MemberPage.new(site, member, slug, TIILT.papers_for(member["name"], papers))
      end
    end
  end

  class MemberPage < Jekyll::PageWithoutAFile
    def initialize(site, member, slug, papers)
      @site = site
      @base = site.source
      @dir = "people/#{slug}"
      @name = "index.html"
      process(@name)
      self.data = {
        "layout" => "member",
        "title" => member["name"],
        "member" => member,
        "member_papers" => papers,
        "permalink" => "/people/#{slug}/",
      }
    end
  end
end
