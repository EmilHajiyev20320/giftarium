# Fix OneDrive File Locking Issues

The `.next` folder should NOT be synced to OneDrive as it causes file locking issues during development.

## Solution 1: Exclude .next from OneDrive (Recommended)

1. Right-click on the `.next` folder in File Explorer
2. Select "OneDrive" → "Free up space" or "Always keep on this device" → "Free up space"
3. This will stop OneDrive from syncing this folder

## Solution 2: Move Project Outside OneDrive

Move your project to a location outside OneDrive (e.g., `C:\Projects\GiftBoxApp`)

## Solution 3: Configure OneDrive to Exclude .next

1. Open OneDrive settings
2. Go to "Sync and backup" → "Advanced settings"
3. Add `.next` to the exclusion list

## Temporary Fix

If you need a quick fix, you can:
1. Stop the dev server (Ctrl+C)
2. Delete the `.next` folder
3. Restart the dev server

The `.next` folder is already in `.gitignore` so it won't be committed to git.

