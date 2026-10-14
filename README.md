# OATH project page

Project page for **OATH: Object-Agnostic Tracking for Dexterous Hands, Enabling Rapid Physics-based Retargeting**.

Plain HTML and CSS, no build step: `index.html`, `assets/css/site.css`, `assets/js/site.js`, figures in `assets/img/`, videos in `assets/video/`.

## Preview locally

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Math

Every symbol and equation is real TeX, typeset to inline SVG so it matches the paper and the page needs no math library.
The source sits in each `<span class="m" data-tex="...">`; after editing one (or adding one, ending with `<!--/m-->`),
re-typeset them all:

```sh
cd tools && npm install && node render-math.mjs
```

## Sending it as one file

```sh
python3 tools/bundle.py      # writes oath-website.html (about 40 MB, videos embedded)
```

The result opens with a double-click, with no server and no repo needed. It is too large for most email
attachments; share it through Slack or Google Drive.

## Publishing

Every push to `main` runs the **Deploy site** workflow, which enables GitHub Pages on first run and publishes the site. The repository must be public first (Settings → General → Danger Zone); the org does not allow private Pages. The workflow can also be run by hand from the Actions tab.

The page is then served at `https://multiplylabs.github.io/oath/`. For a custom domain, add a `CNAME` file containing the domain and point a DNS `CNAME` record at `multiplylabs.github.io`.

## Videos

Encode as H.264 MP4 with metadata stripped, 1280 px wide, under about 20 MB each:

```sh
ffmpeg -i in.mov -map 0:v:0 -map_metadata -1 -vf "scale=1280:-2" -c:v libx264 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an assets/video/name.mp4
ffmpeg -ss 1 -i assets/video/name.mp4 -frames:v 1 -q:v 3 assets/video/name.jpg   # poster
```

`hero_loop.mp4` is the muted background behind the title: the grasp and lift of each hardware clip, cut together.
