# 🔧 Troubleshooting Guide

## ❌ Häufige Probleme und Lösungen

### Browser-Extension Konflikte

**Problem:** `SyntaxError: Failed to parse selector`
```
content-scripts.js:1 Uncaught (in promise) SyntaxError: Failed to parse selector " ##body:has-text("login")", invalid pseudo-class :has-text().
```

**✅ Lösung:** 
- Dieser Fehler kommt von Browser-Extensions (Adblocker, Privacy-Tools)
- **NICHT** von Ihrem OSINT-Tool
- Wird automatisch ignoriert und beeinträchtigt die Funktionalität nicht
- Ihre Website funktioniert normal weiter

**Temporäre Fixes:**
```bash
# Option 1: Extensions temporär deaktivieren
Chrome: chrome://extensions/ > Toggle off problematic extensions

# Option 2: Incognito-Modus verwenden
Strg+Shift+N (Windows) / Cmd+Shift+N (Mac)

# Option 3: Anderer Browser testen
Firefox, Safari, Edge
```

---

### GitHub Pages nicht erreichbar

**Problem:** 404 - Repository existiert, aber Seite nicht verfügbar

**✅ Diagnose:**
```bash
# 1. Prüfe Repository-Struktur
ls docs/index.html  # Muss existieren

# 2. Prüfe GitHub Pages Settings
Settings > Pages > Source: "Deploy from a branch"
Branch: "main" (oder "master")
Folder: "/ (root)" oder "/docs"
```

**✅ Lösungen:**
```bash
# Lösung 1: Korrekte Ordnerstruktur
user_finder/
├── docs/
│   └── index.html ✅ Hier muss die Datei sein

# Lösung 2: Branch überprüfen
git branch  # Aktueller Branch
git push origin main  # Auf main Branch pushen

# Lösung 3: GitHub Actions prüfen
Repository > Actions > Neueste Workflow > Logs prüfen
```

---

### CSS/JavaScript lädt nicht

**Problem:** Styling oder Funktionen fehlen

**✅ Lösungen:**
```html
<!-- 1. Inline-Styles verwenden (aktuelle Lösung) -->
<style>
/* Alle Styles bereits inline eingebettet */
</style>

<!-- 2. Relative Pfade prüfen -->
<!-- ✅ Korrekt -->
<link rel="stylesheet" href="./style.css">
<!-- ❌ Falsch -->
<link rel="stylesheet" href="/style.css">

<!-- 3. Cache leeren -->
Strg+F5 (Windows) / Cmd+Shift+R (Mac)
```

---

### GitHub Actions Fehler

**Problem:** Deployment schlägt fehl

**✅ Häufige Ursachen:**
```yaml
# 1. Falsche Berechtigungen
permissions:
  contents: read
  pages: write
  id-token: write ✅

# 2. Fehlende index.html
- name: Check files
  run: ls -la docs/  # Muss index.html zeigen

# 3. Falscher Upload-Pfad
uses: actions/upload-pages-artifact@v1
with:
  path: docs/  ✅ Nicht docs/index.html
```

**✅ Debug-Schritte:**
```bash
# 1. Action-Logs prüfen
Repository > Actions > Failed Workflow > Job anklicken

# 2. Lokale Struktur validieren
ls -la docs/index.html
wc -l docs/index.html  # Sollte ~1000+ Zeilen haben

# 3. Permissions prüfen
Repository > Settings > Actions > General
Workflow permissions: "Read and write permissions" ✅
```

---

### Custom Domain Probleme

**Problem:** Custom Domain zeigt 404 oder DNS-Fehler

**✅ DNS-Konfiguration:**
```bash
# Für Subdomain (www.example.com)
Type: CNAME
Name: www
Value: yourusername.github.io

# Für Apex Domain (example.com)
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

**✅ GitHub Settings:**
```bash
# 1. CNAME file erstellen
echo "yourdomain.com" > docs/CNAME
git add docs/CNAME && git commit -m "Add CNAME" && git push

# 2. GitHub Pages Settings
Settings > Pages > Custom domain: yourdomain.com
☑️ Enforce HTTPS (nach DNS-Propagation)
```

---

### Performance Probleme

**Problem:** Seite lädt langsam

**✅ Optimierungen:**
```html
<!-- 1. Bilder komprimieren -->
<!-- Tools: tinypng.com, squoosh.app -->

<!-- 2. CDN für externe Resources -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

<!-- 3. Lazy Loading -->
<img src="image.jpg" loading="lazy" alt="description">
```

**✅ Performance-Check:**
```bash
# Tools zur Analyse:
# - Google PageSpeed Insights
# - GTmetrix
# - WebPageTest

# Erwartete Werte:
First Contentful Paint: < 2s
Largest Contentful Paint: < 4s
Cumulative Layout Shift: < 0.1
```

---

### Browser-Kompatibilität

**Problem:** Funktioniert nicht in allen Browsern

**✅ Unterstützte Browser:**
```
✅ Chrome 80+
✅ Firefox 75+
✅ Safari 13+
✅ Edge 80+
❌ Internet Explorer (nicht unterstützt)
```

**✅ Fallbacks:**
```css
/* CSS Grid Fallback */
.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    /* Fallback für ältere Browser */
    display: flex;
    flex-wrap: wrap;
}

/* Backdrop-filter Fallback */
.glassmorphism {
    backdrop-filter: blur(10px);
    /* Fallback */
    background: rgba(0, 0, 0, 0.8);
}
```

---

### Security Warnings

**Problem:** Browser zeigt Sicherheitswarnungen

**✅ Content Security Policy:**
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

**✅ HTTPS Enforcement:**
```bash
# GitHub Pages automatisch HTTPS
Settings > Pages > ☑️ Enforce HTTPS

# Custom Domain
# Warten auf Let's Encrypt Zertifikat (24-48h)
```

---

### Mobile Probleme

**Problem:** Nicht responsive oder Touch-Probleme

**✅ Mobile Optimierungen:**
```css
/* Viewport Meta Tag */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* Touch-friendly Buttons */
.btn {
    min-height: 44px;
    min-width: 44px;
    padding: 12px 24px;
}

/* Responsive Breakpoints */
@media (max-width: 768px) {
    .container { margin: 10px; }
    .grid { grid-template-columns: 1fr; }
}
```

---

## 📊 Monitoring & Debugging

### Development Tools
```bash
# Browser DevTools
F12 > Console (für JavaScript-Fehler)
F12 > Network (für Load-Probleme)
F12 > Lighthouse (für Performance)

# GitHub Monitoring
Repository > Insights > Traffic
Repository > Settings > Pages (Status)
```

### Logs analysieren
```bash
# GitHub Actions Logs
Actions > Workflow > Job Details > Expanded Steps

# Browser Console
Rechtsklick > Inspect > Console Tab
Filtern nach Errors/Warnings
```

---

## 🚑 Notfall-Fixes

### Quick Recovery
```bash
# 1. Repository in funktionierten Zustand zurücksetzen
git log --oneline  # Letzten funktionierenden Commit finden
git reset --hard COMMIT_HASH
git push --force-with-lease origin main

# 2. Neue Deployment erzwingen
git commit --allow-empty -m "Force redeploy"
git push origin main

# 3. GitHub Pages neu aktivieren
Settings > Pages > Source: None > Save
Settings > Pages > Source: Deploy from branch > Save
```

### Backup-Lösung
```bash
# Lokale Kopie als Backup
cp docs/index.html backup-$(date +%Y%m%d).html

# Alternative Hosting
# - Vercel: vercel.com
# - Netlify: netlify.com  
# - Firebase Hosting: firebase.google.com
```

---

## 📞 Support Ressourcen

### GitHub Pages Dokumentation
- [GitHub Pages Basics](https://docs.github.com/en/pages)
- [Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [GitHub Actions](https://docs.github.com/en/actions)

### Community Support
- [GitHub Community Forum](https://github.community/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/github-pages)

### Direct Support
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/yourusername/user_finder/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/user_finder/discussions)

---

**✅ 90% aller Probleme werden durch diese Lösungen behoben!**
