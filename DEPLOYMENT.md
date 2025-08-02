# 🚀 Deployment Guide - GitHub Pages

## Quick Start (5 Minuten Setup)

### 1. Repository erstellen

```bash
# Option A: Neues Repository auf GitHub
# 1. Gehe zu github.com und erstelle ein neues Repository
# 2. Name: user_finder (oder beliebiger Name)
# 3. Public (für kostenlose GitHub Pages)
# 4. Initialize with README ✅

# Option B: Lokales Repository push
git init
git add .
git commit -m "Initial commit: OSINT Username Finder"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/user_finder.git
git push -u origin main
```

### 2. GitHub Pages aktivieren

1. **Repository Settings öffnen**
   - Gehe zu deinem Repository
   - Klick auf **"Settings"** Tab

2. **Pages konfigurieren**
   - Scroll zu **"Pages"** im Seitenmenü
   - **Source:** "Deploy from a branch"
   - **Branch:** "main" (oder "master")
   - **Folder:** "/ (root)" oder "/docs"
   - Klick **"Save"**

3. **Warten auf Deployment**
   - GitHub Actions startet automatisch
   - Nach 2-5 Minuten ist die Website live
   - URL: `https://YOURUSERNAME.github.io/user_finder/`

### 3. Erste Nutzung

✅ **Fertig!** Ihre OSINT Website ist jetzt live verfügbar unter:
```
https://YOURUSERNAME.github.io/user_finder/
```

## Erweiterte Konfiguration

### Custom Domain (Optional)

1. **Domain vorbereiten**
```bash
# Erstelle CNAME file
echo "yourdomain.com" > docs/CNAME
git add docs/CNAME
git commit -m "Add custom domain"
git push
```

2. **DNS-Einstellungen**
```
# Bei deinem Domain-Provider
Type: CNAME
Name: www (oder subdomain)
Value: YOURUSERNAME.github.io
```

3. **GitHub Settings**
   - Settings > Pages > Custom domain
   - Domain eingeben: `yourdomain.com`
   - ✅ Enforce HTTPS

### Automatisches Deployment

Die GitHub Action (`.github/workflows/deploy.yml`) deployed automatisch bei:
- ✅ Push auf main branch
- ✅ Pull Request merge
- ✅ Manual trigger

**Workflow Status prüfen:**
- Repository > Actions tab
- Grüner Haken = Erfolgreich deployed
- Roter X = Fehler (siehe Logs)

## Troubleshooting

### ❌ Website nicht erreichbar

**Lösung 1: Pages Einstellungen prüfen**
```
Settings > Pages > Source = "Deploy from a branch"
Branch = "main" oder "master"
```

**Lösung 2: Index.html Pfad prüfen**
```bash
# Für docs/ folder deployment
ls docs/index.html  # Muss existieren

# Für root deployment  
ls index.html       # Muss existieren
```

**Lösung 3: Action Logs prüfen**
```
Repository > Actions > Latest workflow > View logs
```

### ❌ 404 Fehler

**Lösung:** Prüfe Datei-Struktur
```bash
# Korrekte Struktur für docs/ deployment:
user_finder/
├── docs/
│   └── index.html ✅
├── .github/
│   └── workflows/
│       └── deploy.yml ✅
└── README.md

# Korrekte Struktur für root deployment:
user_finder/
├── index.html ✅ (copy from docs/)
├── .github/workflows/deploy.yml ✅
└── README.md
```

### ❌ CSS/JS nicht geladen

**Lösung:** Relative Pfade verwenden
```html
<!-- ✅ Korrekt -->
<link rel="stylesheet" href="./style.css">
<script src="./script.js"></script>

<!-- ❌ Falsch -->
<link rel="stylesheet" href="/style.css">
<script src="/script.js"></script>
```

### ❌ GitHub Action fehlgeschlagen

**Häufige Ursachen:**
```yaml
# 1. Falsche Berechtigungen
permissions:
  contents: read
  pages: write
  id-token: write ✅

# 2. Falscher Pfad
- name: Upload artifact
  uses: actions/upload-pages-artifact@v1
  with:
    path: docs/  ✅ (nicht docs/index.html)

# 3. Fehlende index.html
ls docs/index.html  # Muss existieren
```

## Performance Optimierung

### 1. Bildoptimierung
```bash
# Bilder komprimieren (falls verwendet)
# Online tools: tinypng.com, squoosh.app
```

### 2. Code Minification
```bash
# CSS/JS minifizieren für Production
# Online tools: minifier.org
```

### 3. CDN Integration
```html
<!-- Externe Libraries über CDN -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
```

## Security Best Practices

### 1. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

### 2. HTTPS Enforcement
```
Settings > Pages > ✅ Enforce HTTPS
```

### 3. Sensitive Data
```bash
# ❌ Niemals committen:
# - API Keys
# - Passwords  
# - Private Tokens

# ✅ Stattdessen:
# - Environment Variables
# - GitHub Secrets
# - Client-side only operations
```

## Monitoring & Analytics

### 1. Google Analytics (Optional)
```html
<!-- In docs/index.html einfügen -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### 2. GitHub Insights
```
Repository > Insights > Traffic
- Page views
- Unique visitors
- Referring sites
```

## Backup & Versioning

### 1. Release Tags
```bash
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0
```

### 2. Branch Protection
```
Settings > Branches > Add rule
- Require pull request reviews
- Require status checks
```

## Support

🐛 **Issues:** [GitHub Issues](https://github.com/YOURUSERNAME/user_finder/issues)
💬 **Discussions:** [GitHub Discussions](https://github.com/YOURUSERNAME/user_finder/discussions)
📧 **Contact:** your.email@example.com

---

**✅ Erfolg! Ihre OSINT Website ist jetzt professionell deployed!**
