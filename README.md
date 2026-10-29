# Carpool customer app · interactive prototype

Clickable prototype of the customer app for an intercity carpooling service in Saudi Arabia (Arabic, RTL, iPhone 375×812).

The flow starts on an iPhone home screen. From there:

1. Tap the app icon to see the splash, then onboarding.
2. Search for a route, pick a date and a trip.
3. Log in with a phone number, book seats and pay.
4. Follow the booking: status, chat with the driver, cancel and refund, report a no-show, rate the driver.
5. Use account, settings and support.

## Try it

| Step | Value |
|---|---|
| Registered user | `0501234567` (shows sample bookings in every state) |
| New user | any number starting with `055` (goes to "complete your profile") |
| OTP | `1234` correct · `0000` expired · anything else wrong |
| Payment | mada or Apple Pay succeed · "credit card" fails on purpose |

Open a specific screen with `?preset=<name>`, for example `?preset=home-user`, `?preset=bk-detail-enroute` or `?preset=settings`. The full list is in `index.html` (`PRESETS`).

Add `&brand=accessible` to use the darker blue (#0062CC), which passes 4.5:1 contrast for small text.

All names, cars, plates, prices and times are sample data.

## Run locally

It is a static site with no build step:

```bash
npx serve .
```

## How it is built

The screens were designed in Claude's design canvas (`Main.dc.html`). `scripts/sync-from-canvas.js` turns that file into this site:

- `index.html` holds the screen template, the styles and the boot code.
- `src/component.js` holds the prototype's state, sample data and handlers.
- `src/dc-lite.js` is a small runtime that renders the template and re-renders on every state change. It uses [morphdom](https://github.com/patrick-steele-idem/morphdom) (MIT, vendored in `vendor/`).

To update the site after editing the canvas:

```bash
node scripts/sync-from-canvas.js path/to/Main.dc.html
```

## Notes

- Font: the design uses thmanyah sans. Its license does not allow hosting the font files, so the site falls back to IBM Plex Sans Arabic from Google Fonts.
- Images:
  - The city photos, the iPhone home-screen mockup and the onboarding artwork were supplied by the designer for prototype use.
  - Check their usage rights before using them in production.
