# Hosting Guide - Ramadan Iftaar Calendar

This guide explains how to upload your code to GitHub and deploy it for the world to see using Vercel (the best platform for Next.js apps).

## Part 1: Push Code to GitHub

1.  **Create a Repository on GitHub**
    *   Go to [github.com/new](https://github.com/new).
    *   Name it `ramadan-iftaar-calendar`.
    *   Keep it **Public** (or Private if you prefer).
    *   **Do not** initialize with README, .gitignore, or License (we have these locally).
    *   Click **Create repository**.

2.  **Connect Local Code**
    *   Copy the URL of your new repository (e.g., `https://github.com/YOUR_USERNAME/ramadan-iftaar-calendar.git`).
    *   Run the following commands in your terminal (I have already initialized git and committed your code locally):

    ```bash
    git remote add origin <PASTE_YOUR_REPO_URL_HERE>
    git branch -M main
    git push -u origin main
    ```

## Part 2: Deploy to Vercel (Recommended)

1.  Go to [vercel.com](https://vercel.com) and sign up/login with GitHub.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your `ramadan-iftaar-calendar` repository from the list.
4.  **Configure Project**:
    *   Framework Preset: `Next.js` (Auto-detected).
    *   **Environment Variables**: You need to set up a production database.
        *   *Note*: Since we used SQLite (a local file database), it **will not work** accurately on Vercel serverless functions (data will vanish on each deployment).
        *   **Recommendation**: Switch to **Vercel Postgres** or **NeonDB** (free tier).
        *   Update your `DATABASE_URL` in the Vercel Environment Variables section.
5.  Click **Deploy**.

### Important Note on Database (SQLite vs Postgres)
Currently, this app uses `SQLite`, which stores data in a local file (`dev.db`). This is great for development but **bad for hosting** because cloud hosting platforms (like Vercel) are "ephemeral" — they wipe local files when the server restarts or deploys.

### Step 2: Set up the Database (Vercel Postgres)
1.  Go to your **Project Dashboard** on Vercel (not the docs).
2.  Click on the **Storage** tab at the top of the page.
3.  Click **Connect Store**.
4.  Select **Postgres** (Vercel Postgres) -> **Continue**.
5.  Accept the terms and click **Create**.
6.  Once created, click **Connect Project** if asked.
7.  Vercel will automatically add the `POSTGRES_URL` and other variables to your project's Environment Variables.

### Step 3: Update Code for Postgres
1.  In your code editor, open `prisma/schema.prisma`.
2.  Change `provider` from `"sqlite"` to `"postgresql"`.
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("POSTGRES_PRISMA_URL") // Vercel specific URL
      directUrl = env("POSTGRES_URL_NON_POOLING") // Direct connection
    }
    ```
3.  Run `npx prisma generate` locally.
4.  Commit these changes and push to GitHub:
    ```bash
    git add .
    git commit -m "Switch to Postgres"
    git push
    ```
5.  Vercel will detect the push and redeploy.

## Option 2: Railway (Recommended for Ease of Use)

Railway is often easier than Vercel for apps with databases because it sets up the database and connects it for you automatically.

### Phase 1: Prepare Your Code (The Switch to Postgres)
Since Railway uses a real server database (Postgres), we need to tell Prisma to use it instead of the local file.

1.  **Edit `prisma/schema.prisma`**:
    *   Change `provider = "sqlite"` to `provider = "postgresql"`.
    *   Ensure the url is `env("DATABASE_URL")`.
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```
    *   *Note*: Once you save this, your local `npm run dev` might complain because it can't find a Postgres DB. That's okay, we are doing this for the server.

2.  **Push to GitHub**:
    *   Save the file.
    *   Run these commands in your terminal:
    ```bash
    git add .
    git commit -m "Configure for Railway Postgres"
    git push
    ```

### Phase 2: Deploy on Railway
1.  **Sign Up**: Go to [railway.app](https://railway.app/) and login with **GitHub**.
2.  **Create Project**: Click **+ New Project** > **Deploy from GitHub repo**.
3.  **Select Repo**: Choose `ramadan-iftaar-calendar`.
4.  **Add Database**:
    *   Once the project is created, right-click on the blank canvas (or click "New").
    *   Select **Database** > **Postgres**.
    *   Railway will deploy a Postgres database for you.
5.  **Connect Database to App**:
    *   Click on your specific *Repo Name* block on the canvas (the app deployment).
    *   Go to the **Variables** tab.
    *   Click **New Variable** > **Add Information** (or Reference).
    *   Select `DATABASE_URL` from the list (it references the Postgres DB you just made).
6.  **Add Auth Variables**:
    *   Still in the **Variables** tab, add these:
    *   `NEXTAUTH_SECRET`: Generate a random string (e.g. run `openssl rand -base64 32` or just mash your keyboard with random characters).
    *   `NEXTAUTH_URL`: The URL Railway gives you (you can find it in the **Settings** tab -> **Domains**). It usually looks like `https://project-name.up.railway.app`.
7.  **Deploy**:
    *   Railway should automatically redeploy when variables change. If not, click **Redeploy**.
    *   The build logs will show it initializing.

### Phase 3: Setup the Database Schema
When the app deploys for the first time, the database is empty. You need to push your schema structure to it.

1.  **Install Railway CLI** (Optional but easiest):
    *   `npm i -g @railway/cli`
    *   `railway login`
    *   `railway link` (select your project)
    *   `railway run npx prisma migrate deploy`
2.  **OR via Build Command**:
    *   In Railway -> App Settings -> Build -> Build Command.
    *   Change it to: `npx prisma generate && npx prisma migrate deploy && next build`
    *   This ensures the database is always updated when you deploy.

## Option 3: VPS (Advanced - Keep SQLite)
If you want to keep using SQLite (the local file), you cannot use Vercel or Railway easily. You need a Virtual Private Server (VPS) like **DigitalOcean**, **Hetzner**, or **AWS EC2**.
- **Pros**: Cheaper, full control, can use SQLite.
- **Cons**: You have to manage the server, security, and updates yourself.
- **Tools**: You can use [Coolify.io](https://coolify.io/) to make this easier (like a self-hosted Vercel).
