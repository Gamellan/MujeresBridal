# Configuration Guide

## Admin Panel Setup

### 1. GitHub Token for Data Persistence

To enable data synchronization across devices, you need to set up a GitHub personal access token:

1. **Generate a Token:**
   - Go to https://github.com/settings/tokens/new
   - Name: `MujeresBridalToken`
   - Select scope: `repo` (full control of private repositories)
   - Copy the token

2. **Add to Configuration:**
   - Copy `src/admin-config.example.js` to `src/admin-config.js`
   - Replace the `GITHUB_TOKEN` value with your token:
   ```javascript
   export const GITHUB_TOKEN = "your_token_here";
   ```

3. **Security Note:**
   - `src/admin-config.js` is in `.gitignore` and should NEVER be committed to GitHub
   - Keep your token secret!

### 2. Admin Credentials

Default admin password is: `Mujeresbridalpass2026!`

Change it in `src/admin-config.js`:
```javascript
export const ADMIN_PASSWORD = "your_secure_password";
```

### 3. How Data Persistence Works

- When you make changes in the admin panel, data is saved to:
  1. **IndexedDB** (local browser storage - instant)
  2. **GitHub** (via API - automatic sync)

- When anyone loads the site, the app:
  1. Loads fresh data from GitHub
  2. Falls back to local catalog if GitHub is unavailable

### 4. Deploying to Production (Netlify)

For Netlify to work with GitHub sync:

1. **Set Environment Variables in Netlify:**
   - Go to Netlify → Site settings → Build & deploy → Environment
   - Add:
     - `GITHUB_TOKEN` = your token
     - `GITHUB_REPO` = `Gamellan/MujeresBridal`
     - `GITHUB_BRANCH` = `main`

2. **Update Code to Read from Environment:**
   The app should be updated to read tokens from `process.env` or Netlify secrets instead of the config file.

### 5. Testing Locally

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run watch        # Watch for catalog changes
npm run generate     # Generate catalog data
```

### 6. Troubleshooting

**Data not syncing to GitHub:**
- Check browser console (F12) for error messages
- Verify token is correct
- Verify GitHub repo name and branch are correct

**Can't access admin panel:**
- Ensure `src/admin-config.js` exists with correct password
- Clear browser cache and reload

**Images not showing:**
- Images are stored as base64 in the database
- Large images may cause performance issues
- Consider optimizing image size before upload
