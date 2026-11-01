# Carpool app · interactive prototype (customer + driver)

Clickable prototype of an intercity carpooling service in Saudi Arabia (Arabic, RTL, iPhone 375×812). One link opens an iPhone home screen with two app icons in the dock:

- **Blue icon: customer app.** Splash, then onboarding.
  1. Search for a route, pick a date and a trip.
  2. Log in with a phone number, book seats and pay.
  3. Follow the booking: status, chat with the driver, cancel and refund, report a no-show, rate the driver.
  4. Use account, settings and support.
- **Black icon: driver app** (in `driver/`). Splash, then login.
  1. Sign up and activate the account (personal documents, vehicle, review).
  2. Publish a trip.
  3. Run a trip step by step with passenger attendance.
  4. Follow earnings and transactions, ratings, notifications and the account.

## Try it

### Customer app

| Step | Value |
|---|---|
| Registered user | `0501234567` (shows sample bookings in every state) |
| New user | any number starting with `055` (goes to "complete your profile") |
| OTP | `1234` correct · `0000` expired · anything else wrong |
| Payment | mada or Apple Pay succeed · "credit card" fails on purpose |

### Driver app

| Number | Account |
|---|---|
| `0501234567` | Approved driver with sample trips, bookings and earnings |
| `055…` | New driver → sign up → activation steps |
| `056…` | Activation under review (buttons simulate the admin's decision) |
| `057…` | Activation rejected with a reason |
| `058…` | Suspended account |

The OTP is the same as in the customer app. Today's trip TR-3101 can be run end to end. «لم يحضر» unlocks after the 15-minute grace period, and there is a demo button to skip it.

### Opening a specific screen

- Customer app: add `?preset=<name>`, for example `?preset=home-user` or `?preset=bk-detail-enroute`.
- Driver app: same parameter on `driver/`, for example `driver/?preset=run-attendance` or `driver/?preset=earnings`.

Each app lists its presets in its `index.html` (`PRESETS`). Add `&brand=accessible` to use the darker blue (#0062CC), which passes 4.5:1 contrast for small text.

All names, cars, plates, prices and times are sample data.

## Run locally

It is a static site with no build step:

```bash
npx serve .
```

## How it is built

Both apps were designed in Claude's design canvas (`Main.dc.html`, one per app). A script turns each canvas file into a static page:

- `index.html` holds the screen template, the styles and the boot code.
- `src/component.js` holds the prototype's state, sample data and handlers.
- `src/dc-lite.js` is a small runtime that renders the template and re-renders on every state change. It uses [morphdom](https://github.com/patrick-steele-idem/morphdom) (MIT, vendored in `vendor/`).

The driver app has its own copy of these files under `driver/`.

To update the site after editing a canvas:

```bash
node scripts/sync-from-canvas.js path/to/customer/Main.dc.html
```

```bash
node driver/scripts/sync-from-canvas.js path/to/driver/Main.dc.html
```

## Notes

- Font: the design uses thmanyah sans, loaded from `fonts/` (Light 300, Regular 400, Medium 500, Bold 700, Black 900). IBM Plex Sans Arabic from Google Fonts stays as the fallback.
- Images:
  - The city photos, the iPhone home-screen mockup, the onboarding artwork, the car photo and the earnings card artwork were supplied by the designer for prototype use.
  - Check their usage rights before using them in production.
