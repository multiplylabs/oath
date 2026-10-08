# OATH project page

Project page for **OATH: Object-Agnostic Tracking for Dexterous Hands, Enabling Rapid Physics-based Retargeting**.

Plain HTML and CSS, no build step: `index.html`, `assets/css/site.css`, `assets/js/site.js`, figures in `assets/img/`, videos in `assets/video/`.

## Preview locally

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Sending it as one file

```sh
python3 tools/bundle.py      # writes oath-website.html (about 40 MB, videos embedded)
```

The result opens with a double-click, with no server and no repo needed. It is too large for most email
attachments; share it through Slack or Google Drive.

## Publishing

The repository is private and GitHub Pages is not enabled yet. To publish:

1. Make the repository public (Settings → General → Danger Zone), or keep it private on a plan that allows private Pages.
2. Settings → Pages → Source: **GitHub Actions**.
3. Run the **Deploy site** workflow (Actions tab), or switch its trigger to `push` so every push to `main` deploys.

The page is then served at `https://ssigurdson.github.io/oath-website/`. For a custom domain, add a `CNAME` file containing the domain and point a DNS `CNAME` record at `ssigurdson.github.io`.

## Videos

Encode as H.264 MP4 with metadata stripped, 1280 px wide, under about 20 MB each:

```sh
ffmpeg -i in.mov -map 0:v:0 -map_metadata -1 -vf "scale=1280:-2" -c:v libx264 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart -an assets/video/name.mp4
ffmpeg -ss 1 -i assets/video/name.mp4 -frames:v 1 -q:v 3 assets/video/name.jpg   # poster
```

`hero_loop.mp4` is the muted background behind the title: the grasp and lift of each hardware clip, cut together.
