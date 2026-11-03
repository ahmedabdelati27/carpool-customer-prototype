#!/usr/bin/env node
// Rebuilds index.html and src/component.js from the canvas file (Main.dc.html).
// Usage: node scripts/sync-from-canvas.js path/to/Main.dc.html
const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src) { console.error('usage: node scripts/sync-from-canvas.js Main.dc.html'); process.exit(1); }
const root = path.join(__dirname, '..');
const html = fs.readFileSync(src, 'utf8');

// Canvas asset URLs → files in assets/
const ASSETS = {
  efc9d69f2d7f0940627d28ec045179e8: 'assets/driver-avatar.png',
  '987a28c94ed756b55f579097f81334a6': 'assets/car.webp',
  '56835504c593a79d0d4c0df6719e5cf4': 'assets/city-madinah.jpg',
  '563b767426935bd5461dc8545c9000bc': 'assets/city-makkah.jpg',
  a5ff5879f690cc413fe5029aea15d42f: 'assets/city-jeddah.jpg',
  '2291f9ae6b76b5eca28c795e16a1e7b4': 'assets/city-dammam.webp',
  b4a29a1cb302440ae95d80b14024c3c4: 'assets/ios-home-screen.png',
  '91ae7e6604a00fd034e05e5842051816': 'assets/onboarding-bg.png',
  d1fb32a55e3cf091aaedf597b2b4932d: 'assets/onboarding-phone.png'
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
<meta name="theme-color" content="#007AFF">
<title>تطبيق التوصيل بين المدن · نموذج العميل</title>
<link rel="icon" href="assets/app-icon.svg" type="image/svg+xml">
<!-- Add to Home Screen: opens full screen with its own icon -->
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="assets/pwa/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="العميل">
${helmet.trim()}
<style>
/* thmanyah sans, the design font (files in /fonts). IBM Plex Sans Arabic stays as the fallback. */
@font-face{font-family:"thmanyah sans";src:url("fonts/thmanyahsans-Light.otf") format("opentype");font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:"thmanyah sans";src:url("fonts/thmanyahsans-Regular.otf") format("opentype");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"thmanyah sans";src:url("fonts/thmanyahsans-Medium.otf") format("opentype");font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:"thmanyah sans";src:url("fonts/thmanyahsans-Bold.otf") format("opentype");font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:"thmanyah sans";src:url("fonts/thmanyahsans-Black.otf") format("opentype");font-weight:900;font-style:normal;font-display:swap}
/* thmanyah serif display for the big headings (.ttl, with "salt"). Whole woff2 files, not subset, so the OpenType features stay. */
@font-face{font-family:"thmanyah serif display";src:url("fonts/thmanyahserifdisplay-Light.woff2") format("woff2");font-weight:300;font-style:normal;font-display:swap}
@font-face{font-family:"thmanyah serif display";src:url("fonts/thmanyahserifdisplay-Regular.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:"thmanyah serif display";src:url("fonts/thmanyahserifdisplay-Medium.woff2") format("woff2");font-weight:500;font-style:normal;font-display:swap}
@font-face{font-family:"thmanyah serif display";src:url("fonts/thmanyahserifdisplay-Bold.woff2") format("woff2");font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:"thmanyah serif display";src:url("fonts/thmanyahserifdisplay-Black.woff2") format("woff2");font-weight:900;font-style:normal;font-display:swap}
html,body{height:100%}
body{margin:0;background:#E9EDF3;display:flex;align-items:center;justify-content:center;overflow:hidden}
#stage{position:relative;width:375px;height:812px;flex-shrink:0;transform-origin:center center}
#device{width:375px;height:812px;overflow:hidden;border-radius:44px;background:#FFFFFF;box-shadow:0 30px 80px rgba(18,18,18,0.18),0 0 0 10px #121212}
body.phone{background:#FFFFFF}
body.phone #device{border-radius:0;box-shadow:none}
/* Opened from the home screen: fill the screen, and hide the drawn status bar (the phone shows its real one). */
body.standalone{background:#FFFFFF}
body.standalone #device{border-radius:0;box-shadow:none}
body.standalone #device > .app{height:100%!important}
body.standalone #device div:has(> svg[viewBox="9 0 375 60"]){display:none}
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
  // The black icon on the launcher opens the driver app, which lives in driver/ on the same site.
  window.DRIVER_APP_URL = 'driver/';
  // ?preset=<state> opens a specific screen; the default starts on the iPhone home screen.
  var PRESETS = ${JSON.stringify(presets)};
  var q = new URLSearchParams(location.search);
  var preset = PRESETS.indexOf(q.get('preset')) !== -1 ? q.get('preset') : 'live';
  var brand = q.get('brand') === 'accessible' ? 'accessible' : 'original';
  var stage = document.getElementById('stage');
  var device = document.getElementById('device');
  var standalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
  document.body.classList.toggle('standalone', standalone);
  function fit() {
    if (standalone) {
      // full width; the height follows the screen instead of the fixed 812
      var s = window.innerWidth / 375, h = Math.round(window.innerHeight / s) + 'px';
      stage.style.height = h; device.style.height = h;
      stage.style.transform = 'scale(' + s + ')';
      return;
    }
    var phone = window.innerWidth < 500;
    document.body.classList.toggle('phone', phone);
    var scale = phone
      ? Math.min(window.innerWidth / 375, window.innerHeight / 812)
      : Math.min(1, (window.innerHeight - 48) / 812, (window.innerWidth - 48) / 375);
    stage.style.transform = 'scale(' + scale + ')';
  }
  window.addEventListener('resize', fit);
  fit();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js').catch(function () {});
  DCLite.mount(document.getElementById('device'), document.getElementById('app-template').content, Component, { preset: preset, brandColor: brand });
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), page);
console.log('index.html + src/component.js written (' + presets.length + ' presets)');
