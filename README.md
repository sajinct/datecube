# DateCube website

A static, responsive product website using the supplied `branding/final_logo.svg` and real prototype photograph. The deployable website is in `dist/`.

Preview: serve `dist` with a local HTTP server. No installation or build is required.

Content reflects the manually verified prototype. Launch date, price and ordering details are not yet announced, so the website uses coming-soon messaging. The contact section links to info@datecube.in and the official Instagram, Facebook and YouTube profiles. No payment or email collection is enabled.

Update the launch section and buying FAQ in `dist/index.html` when commercial details are confirmed. Assets and styling are in `dist/assets` and `dist/styles.css`.

The provided logo is preserved unchanged. Google Fonts is optional; local system fonts are the fallback. No first-party analytics scripts are included. YouTube thumbnails contact YouTube; privacy-enhanced players load only when a visitor presses play. Instagram uses a local photo-backed card linking directly to the reel because its embed did not render reliably during preview.

## Featured media

The Watch section features the supplied YouTube explainer `RcQNokpmEH8`. The social gallery is a curated snapshot verified on 28 September 2026, not an automatically refreshing feed: Instagram reel `DdyWDK3CrW8`, YouTube Short `RHaJAy7auMQ`, and Facebook cover photo `122108807835482644`. Direct source links remain available if embeds are blocked or require sign-in. Update these entries in `dist/index.html` as new uploads are selected.

The two additional local images are optimized JPEG versions of the supplied `datecube.png` introduction artwork and `branding/datecube-facebook-cover.png`. The introduction artwork is labeled as prototype imagery rather than claimed to be a published post. The Facebook cover was visually checked against the published upload. Original files are preserved.

## Search and AI discovery

The complete product description, FAQs, contact details and navigation are in static HTML and can be read without executing JavaScript. `index.html` includes canonical metadata, social image previews and JSON-LD describing the organization, website and page. Schema and summaries must stay consistent with visible content.

`robots.txt` allows all crawlers, including search and AI crawlers (and training crawlers), and advertises `sitemap.xml`. The sitemap lists the canonical page only; section anchors are not separate pages. Update `lastmod` when substantive page content changes.

`llms.txt` is an optional factual Markdown summary for tools that choose to use it. It is not a ranking signal or a requirement for Google AI features. Keep its product and launch facts synchronized with the page. No prices, offers, ratings, reviews or release dates are claimed while the product is in development; add commercial structured data only when verified details are published.

After publication, the site owner can verify the domain in Google Search Console and Bing Webmaster Tools and submit `https://datecube.in/sitemap.xml`. Verification requires access to those accounts or DNS; no verification tokens are included here. Crawl permission and valid metadata do not guarantee indexing, ranking or AI citations.

Run `node scripts/check-seo.cjs` to check metadata, structured-data references, local assets, sitemap and crawler files before publishing.

## Deployment

GitHub Actions publishes `dist/` to GitHub Pages after each push to `main`. The custom domain is `datecube.in`. The repository settings must use GitHub Actions as the Pages source.

DNS for the root domain requires four A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, and 185.199.111.153. The `www` CNAME points to `sajinct.github.io`. Preserve mail and unrelated DNS records. Enable HTTPS enforcement once GitHub issues the certificate.
