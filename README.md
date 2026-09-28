# DateCube website

A static, responsive product website using the supplied `branding/final_logo.svg` and real prototype photograph. The deployable website is in `dist/`.

Preview: serve `dist` with a local HTTP server. No installation or build is required.

Content reflects the manually verified prototype. Launch date, price and ordering details are not yet announced, so the website uses coming-soon messaging. The contact section links to info@datecube.in and the official Instagram, Facebook and YouTube profiles. No payment or email collection is enabled.

Update the launch section and buying FAQ in `dist/index.html` when commercial details are confirmed. Assets and styling are in `dist/assets` and `dist/styles.css`.

The provided logo is preserved unchanged. Google Fonts is optional; local system fonts are the fallback. No first-party analytics scripts are included. YouTube thumbnails contact YouTube; privacy-enhanced players load only when a visitor presses play.

## Automatically refreshed Shorts

The separate Watch section keeps the YouTube explainer `RcQNokpmEH8`. The social showcase contains only YouTube Shorts from DateCube's channel `UCxKhHtCzsjSlOpVoyMFo-0g`.

The existing GitHub Pages workflow refreshes the newest five public Shorts on pushes, manual runs and an hourly schedule (17 minutes past the hour). It reads the channel's Shorts tab using yt-dlp, without downloading videos, cookies or API keys. It preserves YouTube's newest-first order, removes duplicates, and shows fewer cards when fewer than five Shorts exist. It does not classify ordinary videos as Shorts by their duration. Titles are HTML-escaped and IDs/source URLs are validated before rendering.

The generated cards are written into static HTML between the SHORTS markers before deployment, so they work without a browser-side API or JavaScript feed request. If retrieval or validation fails, the deployment stops and the previous published site remains online; GitHub Actions records the failure. The scheduled output is deployed without committing generated changes to the repository.

To refresh locally: install `yt-dlp`, then run `python scripts/refresh-shorts.py`. Run `python -m unittest discover -s scripts -p 'test_*.py'` to check selection, limits, failure handling and escaping, followed by `node scripts/check-seo.cjs`.

Activation requires publishing the workflow to the default branch. GitHub may delay scheduled runs and automatically disables scheduled workflows in public repositories after 60 days without repository activity; re-enable the workflow in Actions if needed. See https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule. The public YouTube reader can need updates when YouTube changes; the workflow installs the current yt-dlp release each run. This is an hourly refresh, not an instant upload webhook.

## Search and AI discovery

The complete product description, FAQs, contact details and navigation are in static HTML and can be read without executing JavaScript. `index.html` includes canonical metadata, social image previews and JSON-LD describing the organization, website and page. Schema and summaries must stay consistent with visible content.

`robots.txt` allows all crawlers, including search and AI crawlers (and training crawlers), and advertises `sitemap.xml`. The sitemap lists the canonical page only; section anchors are not separate pages. Update `lastmod` when substantive page content changes.

`llms.txt` is an optional factual Markdown summary for tools that choose to use it. It is not a ranking signal or a requirement for Google AI features. Keep its product and launch facts synchronized with the page. No prices, offers, ratings, reviews or release dates are claimed while the product is in development; add commercial structured data only when verified details are published.

After publication, the site owner can verify the domain in Google Search Console and Bing Webmaster Tools and submit `https://datecube.in/sitemap.xml`. Verification requires access to those accounts or DNS; no verification tokens are included here. Crawl permission and valid metadata do not guarantee indexing, ranking or AI citations.

Run `node scripts/check-seo.cjs` to check metadata, structured-data references, local assets, sitemap and crawler files before publishing.

## Deployment

GitHub Actions publishes `dist/` to GitHub Pages after each push to `main`. The custom domain is `datecube.in`. The repository settings must use GitHub Actions as the Pages source.

DNS for the root domain requires four A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, and 185.199.111.153. The `www` CNAME points to `sajinct.github.io`. Preserve mail and unrelated DNS records. Enable HTTPS enforcement once GitHub issues the certificate.
