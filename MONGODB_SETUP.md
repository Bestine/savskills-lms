# MongoDB Atlas Setup Guide

## Quick Setup (5 minutes)

MongoDB Atlas is a free cloud database service that's perfect for the Savskill platform.

### Step 1: Create Account

1. Visit **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with:
   - Email address
   - OR Google/GitHub account

### Step 2: Create Free Cluster

1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select:
   - **Provider:** AWS (recommended)
   - **Region:** Closest to your location
   - **Cluster Name:** `savskill-cluster` (or any name)
4. Click **"Create"**
5. Wait 1-3 minutes for cluster creation

### Step 3: Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set:
   - **Username:** `savskill_admin`
   - **Password:** Generate strong password (save it!)
5. **Database User Privileges:** Select "Read and write to any database"
6. Click **"Add User"**

### Step 4: Allow Network Access

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - Or add your specific IP for security
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://savskill_admin:<password>@savskill-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>`** with your actual password

### Step 6: Update Your .env File

1. Open `backend/.env`
2. Update the `MONGODB_URI` line:
   ```env
   MONGODB_URI=mongodb+srv://savskill_admin:YOUR_PASSWORD@savskill-cluster.xxxxx.mongodb.net/savskill?retryWrites=true&w=majority
   ```
   
   Note: Add `/savskill` before the `?` to specify database name

### Step 7: Restart Server

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
cd backend
npm start
```

You should see:
```
✓ MongoDB connected successfully
✓ Server running on port 5000
```

### Step 8: Seed Tribes (Optional)

To add the four tribes to your database, you can create a seed script or manually add them through MongoDB Atlas:

1. In Atlas, click **"Collections"**
2. Click **"Create Database"** → Name: `savskill`
3. Create collection: `tribes`
4. Click **"Insert Document"** and add each tribe

**Sample Tribe Document:**
```json
{
  "name": "The Visionaries",
  "tribeId": "visionaries",
  "description": "Strategic thinkers focused on big-picture leadership and innovation.",
  "color": "#6366f1",
  "members": [],
  "messages": [],
  "resources": [
    {
      "title": "Vision Board Template",
      "type": "Document"
    },
    {
      "title": "5-Year Planning Guide",
      "type": "PDF"
    }
  ]
}
```

Repeat for the other 3 tribes:
- **The Connectors** (`connectors`) - color: `#06b6d4`
- **The Mediators** (`mediators`) - color: `#8b5cf6`
- **The Achievers** (`achievers`) - color: `#f59e0b`

---

## Troubleshooting

**Issue: Connection timeout**
- Check Network Access settings
- Verify IP is whitelisted
- Check firewall settings

**Issue: Authentication failed**
- Double-check password (no spaces)
- Ensure password is URL-encoded if it contains special characters
- Verify username is correct

**Issue: Database not found**
- Make sure `/savskill` is in connection string
- Database will be created automatically on first write

---

## Benefits of MongoDB Atlas

✅ **Free tier:** 512 MB storage  
✅ **Global deployment:** Low latency worldwide  
✅ **Automatic backups:** Point-in-time recovery  
✅ **Easy scaling:** Upgrade when needed  
✅ **Monitoring:** Built-in performance metrics  
✅ **Security:** Encrypted connections by default  

---

## Next: OpenAI API Key

After MongoDB is set up, add your OpenAI key for AI bot features:

1. Visit **https://platform.openai.com/api-keys**
2. Create account or sign in
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-...`)
5. Add to `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
6. Restart server

**Cost:** OpenAI charges per token (~$0.002 per 1K tokens)
- Budget: Set usage limits in OpenAI dashboard
- Free tier: $5 credit for new accounts

---

You're all set! Your Savskill platform will now have full database functionality and AI-powered conversations. 🚀
