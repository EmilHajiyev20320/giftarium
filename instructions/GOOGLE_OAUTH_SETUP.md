# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your GiftBoxApp.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "GiftBoxApp")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to **APIs & Services** > **Library**
2. Search for "Google+ API" or "People API"
3. Click on it and click **Enable**

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** (unless you have a Google Workspace account)
3. Click **Create**
4. Fill in the required information:
   - **App name**: GiftBoxApp (or your app name)
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **Save and Continue**
6. On **Scopes** page, click **Save and Continue** (no need to add scopes for basic auth)
7. On **Test users** page (if in testing mode), you can add test emails, then click **Save and Continue**
8. Review and go back to dashboard

## Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen first (follow Step 3)
4. Choose **Application type**: **Web application**
5. Enter a **Name** (e.g., "GiftBoxApp Web Client")
6. **Authorized JavaScript origins**:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
7. **Authorized redirect URIs**:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
8. Click **Create**
9. **Copy the Client ID and Client Secret** (you'll need these for your `.env` file)

## Step 5: Add Credentials to Your .env File

Create or update your `.env` file in the root of your project:

```env
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

**Important**: 
- Never commit your `.env` file to git (it should already be in `.gitignore`)
- Replace the placeholder values with your actual credentials from Step 4

## Step 6: Restart Your Development Server

After adding the environment variables:

```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm run dev
```

## Common Issues and Solutions

### Error 401: invalid_client

This error means Google cannot find your OAuth client. Check:

1. **Environment variables are set correctly**
   - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are in your `.env` file
   - Make sure there are no extra spaces or quotes around the values
   - Restart your development server after adding them

2. **Redirect URI matches exactly**
   - The redirect URI in Google Cloud Console must match exactly: `http://localhost:3000/api/auth/callback/google`
   - Check for typos, http vs https, trailing slashes

3. **OAuth consent screen is configured**
   - Make sure you've completed the OAuth consent screen setup
   - If in testing mode, add your email as a test user

4. **Client ID format**
   - Should look like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
   - Make sure you copied the entire Client ID

### Testing Mode Limitations

If your app is in "Testing" mode:
- Only test users you add can sign in
- You need to add user emails in **OAuth consent screen** > **Test users**
- To allow anyone to sign in, you need to publish your app (requires verification for sensitive scopes)

### For Production

When deploying to production:

1. Add your production domain to **Authorized JavaScript origins**
2. Add your production callback URL to **Authorized redirect URIs**
3. Update your production environment variables
4. Consider publishing your OAuth consent screen if you want public access

## Verification Checklist

- [ ] Google Cloud project created
- [ ] Google+ API or People API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created (Web application type)
- [ ] Authorized redirect URI added: `http://localhost:3000/api/auth/callback/google`
- [ ] Client ID and Secret added to `.env` file
- [ ] Development server restarted
- [ ] Can see "Sign in with Google" button on login/register pages

## Need Help?

If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify your `.env` file is in the project root
3. Make sure you're using the correct redirect URI format
4. Try creating new OAuth credentials if the old ones aren't working

