# Focus Grove

A genuinely lightweight desktop Pomodoro timer, made with Tauri and vanilla web UI.

It includes automatic day/night appearance based on local time, a native always-on-top pin, adjustable focus/break lengths, and two gentle visual motivators: **Grove** grows a tree as a session advances, while **Halloween** builds a playful haunted scene and reveals a harmless "Boo!" on completion.

## Screenshot

<p align="center">
  <img src="docs/images/focus-grove.png" alt="Focus Grove desktop timer in its light Grove theme" width="360" />
</p>

The tree starts as a seedling and grows in four stages as the focus session progresses. Switch to the Halloween theme in **Settings** for the alternate haunted scene and completion surprise.

## Run locally

Install Node.js and Rust, then:

```bash
npm install
npm run dev
```

Create a native Windows installer with `npm run build`.

## Verification

The app source is syntax-checked with `npm run check`; the Tauri desktop binary is built with `npx tauri build --no-bundle` (or `npm run build` when generating bundles).
