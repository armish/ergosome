source "https://rubygems.org"

gem "jekyll", "~> 4.3.0"
gem "csv"
gem "base64"
gem "jekyll-paginate"
gem "jekyll-feed"
gem "jekyll-seo-tag"
gem "jekyll-sitemap"
gem "webrick", "~> 1.8"

# GitHub Pages plugins
group :jekyll_plugins do
  gem "jekyll-github-metadata"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1", :install_if => Gem.win_platform?

# Lock concurrent-ruby to avoid compatibility issues
gem "concurrent-ruby", "~> 1.0"