# iOS Simulator Verification (CLI)

Steps for verifying the app on iOS simulator without manual interaction.

## Commands That Work

```bash
# Take a screenshot
xcrun simctl io booted screenshot /tmp/filename.png

# Deep link to a specific route (Expo Go dev mode)
xcrun simctl openurl booted "exp://<local-ip>:8081/--/chat/test-123"

# Start the app on simulator
npx expo start --ios
```

## Commands That Do NOT Work

- `xcrun simctl io booted tap` — does not exist as a subcommand
- AppleScript `click at {x, y}` — coordinates don't map reliably to the simulator device screen due to title bar offset and device screen scaling

## Recommended Verification Flow

1. Start app: `npx expo start --ios` (wait ~30s for bundle)
2. Screenshot the initial screen: `xcrun simctl io booted screenshot /tmp/screen.png`
3. Deep link to verify specific routes: `xcrun simctl openurl booted "exp://<local-ip>:8081/--/<route>"`
4. Screenshot again to confirm the route rendered

## Notes

- Simulator window position/size can be queried via AppleScript but the coordinate mapping to device pixels is unreliable
- iPhone 16 Pro renders at 1206x2622 (3x) but the Simulator window scales it (e.g., 456x972)
- For interactive button-tap testing, prefer verifying on web (`curl` the rendered HTML) or use deep linking to confirm each screen renders
