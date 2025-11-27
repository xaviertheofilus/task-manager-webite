# 🚀 DEPLOYMENT GUIDE - VERCEL

Panduan lengkap deployment Task Manager ke Vercel agar HRD bisa login dan mencoba aplikasi.

---

## 📋 Prerequisites

- ✅ Akun GitHub (gratis)
- ✅ Akun Vercel (gratis) - [vercel.com](https://vercel.com)
- ✅ Repository GitHub sudah dibuat

---

## 🔧 STEP 1: Persiapan Project

### 1.1 Pastikan File Penting Ada

Cek file-file ini sudah ada:
- ✅ `package.json`
- ✅ `next.config.js`
- ✅ `.gitignore`
- ✅ `README.md`
- ✅ `.env.example`

### 1.2 Buat Vercel Configuration

File sudah dibuat otomatis: `vercel.json`

---

## 📤 STEP 2: Push ke GitHub

### 2.1 Initialize Git (jika belum)

```bash
git init
git add .
git commit -m "Initial commit: Task Manager Application"
```

### 2.2 Create GitHub Repository

1. Buka [github.com/new](https://github.com/new)
2. Isi detail repository:
   - **Repository name**: `task-management-web`
   - **Description**: Modern task management application with AI insights
   - **Visibility**: Public (atau Private)
   - ❌ JANGAN centang "Initialize with README" (sudah ada)
3. Klik **"Create repository"**

### 2.3 Push Code ke GitHub

Setelah repository dibuat, jalankan:

```bash
git remote add origin https://github.com/USERNAME/task-management-web.git
git branch -M main
git push -u origin main
```

**Replace `USERNAME`** dengan username GitHub Anda!

---

## 🌐 STEP 3: Deploy ke Vercel

### 3.1 Buat Akun Vercel

1. Buka [vercel.com/signup](https://vercel.com/signup)
2. Pilih **"Continue with GitHub"**
3. Authorize Vercel untuk akses GitHub
4. Selesaikan setup akun

### 3.2 Import Project

1. Di Vercel Dashboard, klik **"Add New Project"**
2. Klik **"Import Git Repository"**
3. Pilih repository: **`task-management-web`**
4. Klik **"Import"**

### 3.3 Configure Project

Di halaman konfigurasi:

**Framework Preset**: Next.js (auto-detected) ✅

**Root Directory**: `./` (default) ✅

**Build and Output Settings**:
- Build Command: `npm run build` (default) ✅
- Output Directory: `.next` (default) ✅
- Install Command: `npm install` (default) ✅

**Environment Variables**: 
⚠️ **PENTING! Tambahkan ini:**

```
NEXT_PUBLIC_APP_NAME=Task Manager
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_INSIGHTS=true
```

**Optional (untuk AI features):**
```
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

### 3.4 Deploy!

1. Klik **"Deploy"**
2. Tunggu proses build (2-3 menit)
3. ✅ Deploy berhasil!

---

## 🎉 STEP 4: Akses Aplikasi

### 4.1 URL Production

Vercel akan memberikan URL:
```
https://task-management-web-xyz123.vercel.app
```

**Atau custom domain:**
```
https://your-custom-domain.vercel.app
```

### 4.2 Test Login

1. Buka URL production
2. Klik **"Login"**
3. Masukkan kredensial:
   - **Email**: `hrd@company.com` (atau email apa saja)
   - **Password**: `hrdtest123` (min 6 karakter)
4. Klik **"Sign In"** atau **"Use Demo Credentials"**
5. ✅ Berhasil masuk ke Dashboard!

---

## 👥 STEP 5: Share dengan HRD

### 5.1 Buat Panduan untuk HRD

Kirim email dengan informasi ini:

```
Subject: Task Manager Application - Ready for Testing

Hi Team,

Task Manager sudah berhasil di-deploy dan siap untuk dicoba!

📍 URL Aplikasi:
https://task-management-web-xyz123.vercel.app

🔐 Cara Login:
1. Buka URL di atas
2. Masukkan email Anda (format valid, contoh: nama@company.com)
3. Masukkan password (minimal 6 karakter, contoh: testing123)
4. Klik "Sign In"

✨ Fitur yang Bisa Dicoba:
- ✅ Buat task baru (Create Task)
- ✅ Edit dan hapus task
- ✅ Kanban board dengan drag & drop
- ✅ AI Insights & Analytics
- ✅ Timeline view
- ✅ Generate PDF reports

📱 Device Support:
- Desktop (Chrome, Edge, Firefox, Safari)
- Tablet
- Mobile

⚠️ Note:
- Ini adalah DEMO version
- Data disimpan di browser (localStorage)
- Bisa login dengan email & password apa saja (min 6 chars)

Silakan dicoba dan berikan feedback!

Best regards,
[Your Name]
```

### 5.2 Custom Demo Accounts (Optional)

Untuk memberikan pengalaman lebih baik, bisa setup:

**Demo HRD Account:**
- Email: `hrd@demo.com`
- Password: `hrd123456`

**Demo Manager Account:**
- Email: `manager@demo.com`
- Password: `manager123`

---

## 🔄 STEP 6: Update & Re-deploy

Setiap kali ada perubahan code:

### 6.1 Push Changes

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### 6.2 Auto Deploy

- ✅ Vercel **otomatis** deploy setiap push ke `main`
- ✅ Build baru dalam 2-3 menit
- ✅ URL tetap sama

### 6.3 Rollback (jika error)

Di Vercel Dashboard:
1. Klik project name
2. Tab **"Deployments"**
3. Pilih deployment yang bagus
4. Klik **"..."** > **"Promote to Production"**

---

## 🎨 STEP 7: Custom Domain (Optional)

### 7.1 Tambah Custom Domain

1. Di Vercel Dashboard, buka project
2. Tab **"Settings"** > **"Domains"**
3. Klik **"Add"**
4. Masukkan domain: `taskmanager.company.com`
5. Follow instruksi DNS configuration

### 7.2 Update Environment Variable

```
NEXT_PUBLIC_APP_URL=https://taskmanager.company.com
```

Redeploy untuk apply perubahan.

---

## 🔒 STEP 8: Security Checklist (Production)

Sebelum production real:

### ⚠️ Development (Current):
- ❌ Demo authentication (accept any email/password)
- ❌ localStorage only (no database)
- ❌ No password hashing
- ⚠️ OK untuk DEMO & TESTING

### ✅ Production (Recommended):
- ✅ Real authentication (NextAuth.js)
- ✅ Database (Supabase, MongoDB, PostgreSQL)
- ✅ Password hashing (bcrypt)
- ✅ Environment variables secured
- ✅ HTTPS (auto by Vercel)
- ✅ Rate limiting
- ✅ CSRF protection

---

## 📊 STEP 9: Monitor Deployment

### 9.1 Vercel Analytics

Di Dashboard:
- **Deployments**: Status semua deploy
- **Analytics**: Page views, visitors
- **Logs**: Real-time logs
- **Performance**: Speed metrics

### 9.2 Check Build Status

Jika build error:
1. Cek **Build Logs**
2. Fix error di local
3. Push lagi
4. Auto redeploy

---

## 🐛 Troubleshooting

### Build Failed

**Error**: `Module not found`
```bash
# Solution: Install dependencies
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

**Error**: `TypeScript errors`
```bash
# Solution: Fix types
npm run type-check
# Fix errors, then push
```

### Runtime Error

**Error**: `ERR_CONNECTION_REFUSED`
- ✅ Wait 2-3 minutes for deployment
- ✅ Check Vercel status page
- ✅ Clear browser cache

**Error**: `Loading stuck`
- ✅ Refresh page (Ctrl+F5)
- ✅ Wait 3 seconds, click "Close"
- ✅ Clear localStorage (F12 > Application > Storage)

### Environment Variables Not Working

1. Vercel Dashboard > Project > Settings > Environment Variables
2. Add/Edit variables
3. **IMPORTANT**: Redeploy project!
   - Tab Deployments
   - Click "..." on latest
   - "Redeploy"

---

## ✅ Checklist Deployment

Sebelum share ke HRD:

- [ ] ✅ Code di-push ke GitHub
- [ ] ✅ Vercel connected ke repo
- [ ] ✅ Environment variables set
- [ ] ✅ Build successful (no errors)
- [ ] ✅ URL production accessible
- [ ] ✅ Login works (test dengan beberapa email)
- [ ] ✅ Create task works
- [ ] ✅ AI features works (Insights page)
- [ ] ✅ Mobile responsive (test di HP)
- [ ] ✅ PDF download works
- [ ] ✅ Timeline & charts render correctly

---

## 📞 Support

Jika ada masalah saat deploy:

1. **Check Vercel Logs**: Dashboard > Deployments > Click deployment > Logs
2. **Check GitHub Actions**: Repo > Actions tab
3. **Vercel Support**: [vercel.com/support](https://vercel.com/support)
4. **Documentation**: [vercel.com/docs](https://vercel.com/docs)

---

## 🎯 Quick Start Commands

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy to Vercel (automatic after setup)
# Just push to main branch!

# 3. Check deployment
# Visit: https://your-project.vercel.app
```

---

## 🌟 Success!

Aplikasi sudah live dan bisa diakses HRD! 🎉

**Production URL**: `https://task-management-web.vercel.app`

**Login**: Any email + password (min 6 chars)

**Selamat! Project berhasil di-deploy!** 🚀

---

*Last Updated: November 28, 2025*
