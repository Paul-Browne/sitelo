# Rendering the episodes

Turns an episode into an MP4 you can upload: a narrated screencast of an
editor, a terminal and a browser. It isn't a screen recording. Everything
shown is drawn from real runs of the episode:

- `capture.js` runs the episode's commands for real (`npm install`, the dev
  server, the build, preview), keeps what they printed, and screenshots the
  real pages in headless Chrome.
- `episodes/<episode>/episode.js` is the script: each line of narration,
  and what happens on screen under it (typing into a file, running a
  command, clicking a link).
- `render.js` speaks the narration with Kokoro (see below), draws every frame on
  `stage/` in headless Chrome, and encodes it with ffmpeg.

## Use

Needs Google Chrome and Node 22. Developed on macOS.

```bash
npm install
node capture.js 01-setup
node render.js 01-setup
```

Output goes to `out/01-setup/`:

| File | What it is |
| --- | --- |
| `01-setup.mp4` | 2560×1440, 30 fps, H.264 + AAC |
| `01-setup.srt` | captions, to upload alongside the video |
| `youtube.txt` | title, description and chapters |
| `thumbnail.png` | 1280×720, the title card |

Re-run `capture.js` whenever sitelo or the episode's code changes. A render
on its own takes several minutes; to check a moment without rendering it
all, write stills at given times:

```bash
node render.js 01-setup --stills 30,95.5
```

`--draft` renders at 960×540, and `--from`/`--to` (seconds) render part of
the episode.

## The voice

Narration is spoken by [Kokoro](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX),
an open-source (Apache-2.0) model that runs locally through `kokoro-js`. The
first render downloads the model (326 MB) into `node_modules`; after that
nothing leaves the machine. Each line is cached by voice and wording, so a
re-render only speaks lines that changed.

The default voice is `af_heart`. To hear the others side by side:

```bash
node samples.js
```

That writes one clip per voice to `out/voice-samples/`. Render with a
different one using `VOICE`, and set the pace with `SPEED` (default 1):

```bash
VOICE=am_michael SPEED=1.05 node render.js 01-setup
```

`VOICE=say:Daniel` uses macOS `say` instead (`RATE` sets its words per
minute).

Words the voice would say wrong are respelled in `PRONOUNCE` in
`lib/voice.js`. For example, sitelo is written "Sit-el-oh" there, because
spelled plainly it comes out as "site-low". Captions keep the real
spelling.

To narrate it yourself, read along with `01-setup.srt`. Each caption sits
where its line plays, so a recording that follows them can replace
`narration.wav`.
