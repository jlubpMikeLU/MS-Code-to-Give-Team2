
  # Modern Dashboard App Mockup (Community)

  This is a code bundle for Modern Dashboard App Mockup (Community). The original project is available at https://www.figma.com/design/3brcdrKfrmiHZ7ZvPaKRjw/Modern-Dashboard-App-Mockup--Community-.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
## Ngrok setup (mobile testing over HTTPS)

1. Ensure Vite binds to all interfaces. We set this in `vite.config.ts`:
   - server.host = true, server.port = 5173
2. Start the dev server:
   - `npm run dev -- --host`
3. Run tunnels in two shells:
   - `ngrok http 5173` (frontend)
   - `ngrok http 3000` (backend)
4. Set `.env.local` with backend tunnel (same URL for all):
```
VITE_API_SAMPLE_BASE_URL=https://<BACKEND_TUNNEL>
VITE_API_STS_BASE_URL=https://<BACKEND_TUNNEL>
VITE_API_TTS_BASE_URL=https://<BACKEND_TUNNEL>
VITE_API_KEY=
```
5. Export `ALLOWED_ORIGINS` for Flask (include your frontend tunnel):
```
export ALLOWED_ORIGINS="http://localhost:5173,http://127.0.0.1:5173,https://<FRONTEND_TUNNEL>"
```
6. Start backend:
```
(cd backend && python3 webApp.py)
```
7. Open the frontend tunnel URL on your phone.
  