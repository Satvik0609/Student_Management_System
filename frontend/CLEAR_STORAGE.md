# How to Clear Storage and See Login Page

If you're stuck on the dashboard and can't see the login page, follow these steps:

## Method 1: Browser Console (Recommended)

1. Open your browser's Developer Tools (Press `F12` or `Ctrl+Shift+I`)
2. Go to the **Console** tab
3. Type and press Enter:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

## Method 2: Browser DevTools

1. Open Developer Tools (`F12`)
2. Go to the **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click on **Local Storage** in the left sidebar
4. Click on your site URL (`http://localhost:3000`)
5. Right-click and select **Clear** or delete the `token` key manually
6. Refresh the page

## Method 3: Incognito/Private Window

1. Open a new Incognito/Private window
2. Navigate to `http://localhost:3000`
3. You should see the login page

## Method 4: Clear All Browser Data

1. Open browser settings
2. Clear browsing data
3. Select "Cookies and other site data" and "Cached images and files"
4. Clear data
5. Refresh the page

## Why This Happens

The app stores your authentication token in localStorage. If you have an old or invalid token, the app might try to use it and get stuck. Clearing the storage forces the app to start fresh and show the login page.

