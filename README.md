# DateCube website

A static, responsive product website using the supplied `branding/final_logo.svg` and real prototype photograph. The deployable website is in `dist/`.

Preview: serve `dist` with a local HTTP server. No installation or build is required.

Content reflects the manually verified prototype. Launch date, price, ordering details and exact social account URLs were not provided, so the website uses honest coming-soon messaging. No payment or email collection is enabled.

Update the launch section and buying FAQ in `dist/index.html` when commercial details are confirmed. Assets and styling are in `dist/assets` and `dist/styles.css`.

The provided logo is preserved unchanged. Google Fonts is optional; local system fonts are the fallback. No tracking scripts are included.

## Deployment

GitHub Actions publishes `dist/` to GitHub Pages after each push to `main`. The custom domain is `datecube.in`. The repository settings must use GitHub Actions as the Pages source.

DNS for the root domain requires four A records: 185.199.108.153, 185.199.109.153, 185.199.110.153, and 185.199.111.153. The `www` CNAME points to `sajinct.github.io`. Preserve mail and unrelated DNS records. Enable HTTPS enforcement once GitHub issues the certificate.
