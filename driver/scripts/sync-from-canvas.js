#!/usr/bin/env node
// Rebuilds the driver app (driver/index.html and driver/src/component.js) from the driver canvas file (Main.dc.html).
// Usage: node scripts/sync-from-canvas.js path/to/Main.dc.html
const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src) { console.error('usage: node scripts/sync-from-canvas.js Main.dc.html'); process.exit(1); }
const root = path.join(__dirname, '..');
const html = fs.readFileSync(src, 'utf8');

// Canvas asset URLs → files in assets/
const ASSETS = {
  '08994969f8e33a4166f03feaa54a4720': 'assets/vehicle.webp',
  '9f5c9f2fddd35f932c1a2c48542ebfd1': 'assets/earnings-texture.png',
  '50cf04a0e5930f1f103ffe25a308b504': 'assets/earnings-shape-blue.svg',
  bea54bfda6e3207e274f3d8fc422d554: 'assets/coins.svg'
};
const withAssets = (text) => text.replace(/\/_blob\/([0-9a-f]{32})/g, (m, id) => {
  if (!ASSETS[id]) throw new Error('unknown canvas asset ' + id);
  return ASSETS[id];
});

const xdc = html.slice(html.indexOf('<x-dc>') + 6, html.indexOf('</x-dc>'));
const helmet = xdc.slice(xdc.indexOf('<helmet>') + 8, xdc.indexOf('</helmet>'));
const template = xdc.slice(xdc.indexOf('</helmet>') + 9).trim();
const script = html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
const props = JSON.parse(html.match(/data-props='([^']*)'/)[1]);
const presets = props.preset.options;

fs.writeFileSync(path.join(root, 'src/component.js'),
  '// Generated from the canvas by scripts/sync-from-canvas.js — edit the canvas, then re-run.\n' + withAssets(script).trim() + '\n');

const page = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#121212">
<title>تطبيق السائق · نموذج تفاعلي</title>
<link rel="icon" href="assets/app-icon.svg" type="image/svg+xml">
${withAssets(helmet.trim())}
<style>
/* thmanyah sans, the design font (files in /fonts). IBM Plex Sans Arabic stays as the fallback. */
@font-face{font-family:"thmanyah sans";src:url("../fonts/thmanyahsans-Light.otf") format("opentype");font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:"thmanyah sans";src:url("../fonts/thmanyahsans-Regular.otf") format("opentype");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"thmanyah sans";src:url("../fonts/thmanyahsans-Medium.otf") format("opentype");font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:"thmanyah sans";src:url("../fonts/thmanyahsans-Bold.otf") format("opentype");font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:"thmanyah sans";src:url("../fonts/thmanyahsans-Black.otf") format("opentype");font-weight:900;font-style:normal;font-display:swap}
html,body{height:100%}
body{margin:0;background:#E9EDF3;display:flex;align-items:center;justify-content:center;overflow:hidden}
#stage{position:relative;width:375px;height:812px;flex-shrink:0;transform-origin:center center}
#device{width:375px;height:812px;overflow:hidden;border-radius:44px;background:#FFFFFF;box-shadow:0 30px 80px rgba(18,18,18,0.18),0 0 0 10px #121212}
body.phone{background:#FFFFFF}
body.phone #device{border-radius:0;box-shadow:none}
</style>
</head>
<body>
<div id="stage"><div id="device"></div></div>
<template id="app-template">
${withAssets(template)}
</template>
<script src="vendor/morphdom-umd.min.js"></script>
<script src="src/dc-lite.js"></script>
<script src="src/component.js"></script>
<script>
(function () {
  // ?preset=<state> opens a specific screen; the default starts on the iPhone home screen.
  var PRESETS = ${JSON.stringify(presets)};
  var q = new URLSearchParams(location.search);
  var preset = PRESETS.indexOf(q.get('preset')) !== -1 ? q.get('preset') : 'live';
  var brand = q.get('brand') === 'accessible' ? 'accessible' : 'original';
  var stage = document.getElementById('stage');
  function fit() {
    var phone = window.innerWidth < 500;
    document.body.classList.toggle('phone', phone);
    var scale = phone
      ? Math.min(window.innerWidth / 375, window.innerHeight / 812)
      : Math.min(1, (window.innerHeight - 48) / 812, (window.innerWidth - 48) / 375);
    stage.style.transform = 'scale(' + scale + ')';
  }
  window.addEventListener('resize', fit);
  fit();
  DCLite.mount(document.getElementById('device'), document.getElementById('app-template').content, Component, { preset: preset, brandColor: brand });
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), page);
console.log('index.html + src/component.js written (' + presets.length + ' presets)');
