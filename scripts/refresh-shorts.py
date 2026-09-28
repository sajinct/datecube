"""Render the latest five entries from DateCube's public Shorts tab (no video downloads)."""
import html
import re
from pathlib import Path
from urllib.parse import urlparse

CHANNEL_ID = "UCxKhHtCzsjSlOpVoyMFo-0g"
SHORTS_URL = f"https://www.youtube.com/channel/{CHANNEL_ID}/shorts"
START = "<!-- SHORTS:START -->"
END = "<!-- SHORTS:END -->"
PAGE = Path(__file__).resolve().parents[1] / "dist" / "index.html"


def select_thumbnail(entry):
    candidates = []
    for image in entry.get("thumbnails") or []:
        url = image.get("url", "")
        parsed = urlparse(url)
        width, height = image.get("width"), image.get("height")
        if (parsed.scheme != "https" or parsed.hostname != "i.ytimg.com"
                or not parsed.path.startswith(f"/vi/{entry['id']}/")
                or not isinstance(width, (int, float))
                or not isinstance(height, (int, float)) or min(width, height) <= 0):
            continue
        # Prefer portrait covers, then the most useful pixels after a 9:16 crop.
        usable_width = min(width, height * 9 / 16)
        candidates.append((height > width, usable_width, url, width, height))
    if candidates:
        _, _, url, width, height = max(candidates)
        return {"url": url, "width": int(width), "height": int(height)}
    return {"url": f"https://i.ytimg.com/vi/{entry['id']}/maxresdefault.jpg",
            "width": 1280, "height": 720}


def select_shorts(info):
    # The Shorts tab is newest-first. Do not guess Shorts from video duration.
    if info.get("channel_id") != CHANNEL_ID:
        raise ValueError("Unexpected or missing channel identity")
    result, seen = [], set()
    for entry in info.get("entries") or []:
        if not isinstance(entry, dict):
            continue
        video_id, title = entry.get("id", ""), entry.get("title", "")
        if not re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id):
            continue
        if entry.get("url") != f"https://www.youtube.com/shorts/{video_id}":
            continue
        if video_id in seen or not isinstance(title, str) or not title.strip():
            continue
        seen.add(video_id)
        result.append((video_id, title.strip(), select_thumbnail(entry)))
        if len(result) == 5:
            break
    if not result:
        raise ValueError("No verified Shorts returned; keeping the existing site")
    return result


def render_cards(shorts):
    cards = []
    for video_id, title, thumbnail in shorts:
        safe_title = html.escape(title, quote=True)
        cover_url = html.escape(thumbnail["url"], quote=True)
        url = f"https://www.youtube.com/shorts/{video_id}"
        cards.append(f'''          <article class="social-card">
            <div class="social-card-heading"><img src="assets/icons/youtube.svg" width="22" height="22" alt=""><span>YOUTUBE SHORT</span><span>@datecube</span></div>
            <div class="short-frame video-frame"><a class="video-launch" href="{url}" data-embed="https://www.youtube-nocookie.com/embed/{video_id}?autoplay=1&amp;rel=0" data-video-title="{safe_title}" aria-label="Play {safe_title}"><img src="{cover_url}" data-fallback-src="https://i.ytimg.com/vi/{video_id}/hqdefault.jpg" width="{thumbnail['width']}" height="{thumbnail['height']}" loading="lazy" alt="{safe_title}"><span class="video-play" aria-hidden="true">▶</span><span class="video-label">PLAY SHORT</span></a></div>
            <div class="social-card-copy"><h3>{safe_title}</h3><a href="{url}" target="_blank" rel="noopener noreferrer">Watch on YouTube <span aria-hidden="true">↗</span></a></div>
          </article>''')
    return "\n".join(cards)


def update_page(page, shorts):
    if page.count(START) != 1 or page.count(END) != 1:
        raise ValueError("Missing or duplicate Shorts section markers")
    before, remainder = page.split(START)
    _, after = remainder.split(END)
    return before + START + "\n" + render_cards(shorts) + "\n        " + END + after


def main():
    from yt_dlp import YoutubeDL
    with YoutubeDL({
        "extract_flat": True, "skip_download": True, "playlistend": 10,
        "socket_timeout": 25, "retries": 2, "extractor_retries": 2,
        "quiet": True, "ignoreerrors": False,
    }) as client:
        info = client.extract_info(SHORTS_URL, download=False)
    shorts = select_shorts(info)
    updated = update_page(PAGE.read_text(encoding="utf-8"), shorts)
    # Write only after retrieval, validation and rendering all succeed.
    temporary = PAGE.with_suffix(".tmp")
    temporary.write_text(updated, encoding="utf-8")
    temporary.replace(PAGE)
    print(f"Refreshed {len(shorts)} recent YouTube Short(s).")


if __name__ == "__main__":
    main()
