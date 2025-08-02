# 🕵️ OSINT Username Finder

Ein professionelles **Open Source Intelligence (OSINT)** Tool zur Suche von Benutzernamen und Profilen über das gesamte Internet.

## 🌟 Features

### 🎯 **Zwei Versionen verfügbar:**

#### 🔴 **Server Version** (Vollständige OSINT-Funktionalität)
- ✅ **Live-Verfügbarkeitsprüfung** von Profilen
- ✅ **Email-Validierung** mit Gravatar-Check
- ✅ **Telefonnummer-Suche** für Messaging-Apps
- ✅ **Cross-Reference-Analyse** mit Google-Integration
- ✅ **Data-Breach-Checking** für Sicherheitsanalyse
- ✅ **Username-Variationen** automatisch generiert
- ✅ **Confidence-Scoring** für Ergebnisse

#### 🟢 **GitHub Pages Version** (Statische Version)
- ✅ **Client-seitige Suche** ohne Server
- ✅ **Direkte Platform-Links** für 30+ Services
- ✅ **Kategorisierte Suche** nach Plattform-Typ
- ✅ **Responsive Design** für alle Geräte
- ✅ **Datenschutz-freundlich** - keine Server-Übertragung
- ✅ **Sofort verfügbar** über GitHub Pages

## 🚀 Live Demo

### GitHub Pages Version (Empfohlen für die meisten Nutzer)
**🌐 [Live Demo auf GitHub Pages](https://yourusername.github.io/user_finder/)**

### Server Version (Für erweiterte OSINT-Funktionen)
```bash
git clone https://github.com/yourusername/user_finder.git
cd user_finder
npm install
npm start
```

## 📱 Unterstützte Plattformen

### 👥 **Social Media**
- Instagram, TikTok, Twitter/X, Facebook, YouTube
- Snapchat, Pinterest, VKontakte, Weibo

### 💻 **Entwickler-Plattformen**
- GitHub, GitLab, Bitbucket
- Stack Overflow, HackerNews, Keybase

### 🎨 **Kreative Communities**
- DeviantArt, Behance, Dribbble, Flickr
- SoundCloud, Spotify, Last.fm, Vimeo

### 🎮 **Gaming**
- Steam, Twitch, Xbox Live, PlayStation

### 💼 **Professional Networks**
- LinkedIn, Xing, AngelList

### 💬 **Messaging & Communication**
- Telegram, WhatsApp, Signal, Discord, Skype

## 🛠️ Installation & Setup

### Für GitHub Pages Deployment:

1. **Repository forken oder klonen**
```bash
git clone https://github.com/yourusername/user_finder.git
cd user_finder
```

2. **GitHub Pages aktivieren**
   - Gehen Sie zu **Settings** > **Pages**
   - Source: **Deploy from a branch**
   - Branch: **main** / **docs**
   - Speichern

3. **Automatisches Deployment**
   - Die GitHub Action deployed automatisch bei jedem Push
   - Ihre Website ist verfügbar unter: `https://yourusername.github.io/user_finder/`

### Für lokale Server-Version:

1. **Dependencies installieren**
```bash
npm install express axios
```

2. **Server starten**
```bash
node server.js
```

3. **Website öffnen**
```
http://localhost:3000
```

## 🎨 Design Features

### ✨ **Dynamische Animationen**
- Bewegliche Farbverläufe
- Schwebende Partikel-Effekte
- Glasmorphismus mit Blur-Effekten
- Hover-Animationen mit 3D-Transformationen

### 📱 **Responsive Design**
- Mobile-First Ansatz
- Touch-optimierte Bedienelemente
- Adaptive Grid-Layouts
- Cross-Browser Kompatibilität

### 🎯 **Benutzerfreundlichkeit**
- Intuitive Kategorie-Auswahl
- Live-Feedback bei Eingaben
- Fortschrittsanzeigen
- Accessibility-optimiert

## 🔧 Konfiguration

### GitHub Pages Setup:

1. **Repository Settings**
   - Pages Source: `Deploy from a branch`
   - Branch: `main` (oder `master`)
   - Folder: `/ (root)` oder `/docs`

2. **Custom Domain (Optional)**
```
# Erstellen Sie eine CNAME-Datei im docs/ Ordner
echo "yourdomain.com" > docs/CNAME
```

3. **SSL/HTTPS**
   - Automatisch aktiviert durch GitHub Pages
   - ✅ Enforce HTTPS (empfohlen)

## 🛡️ Datenschutz & Sicherheit

### GitHub Pages Version:
- ✅ **Keine Server-Übertragung** - alle Suchen client-seitig
- ✅ **Keine Datensammlung** - Privacy by Design
- ✅ **HTTPS-verschlüsselt** durch GitHub
- ✅ **Open Source** - vollständig transparent

### Server Version:
- ⚠️ **Server-Logs** möglich
- ⚠️ **API-Aufrufe** zu externen Services
- ✅ **Keine Datenspeicherung** im Code

## 📊 Supported Use Cases

### 🔍 **OSINT-Investigationen**
- Profil-Recherche für Journalismus
- Cybersecurity-Investigations
- Social Engineering Assessment
- Digital Footprint Analyse

### 🎯 **Legitimierte Nutzung**
- ✅ Eigene Profile finden
- ✅ Öffentliche Informationen recherchieren
- ✅ Sicherheitsbewertungen
- ✅ Journalistische Recherche

### ❌ **Nicht geeignet für:**
- Stalking oder Harassment
- Illegale Überwachung
- Verletzung der Privatsphäre
- Unbefugte Datensammlung

## 🤝 Contributing

Beiträge sind willkommen! Bitte beachten Sie:

1. **Fork** das Repository
2. **Branch** erstellen für Features
3. **Pull Request** mit Beschreibung
4. **Code Review** abwarten

### Entwicklung:
```bash
# Development server
npm run dev

# Build für Production
npm run build

# Tests ausführen
npm test
```

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## ⚠️ Disclaimer

Dieses Tool ist für **legale OSINT-Recherche** und **Bildungszwecke** bestimmt. Nutzer sind selbst verantwortlich für die ethische und rechtskonforme Verwendung. Die Autoren übernehmen keine Haftung für Missbrauch.

## 🌟 Features Roadmap

### 🔮 **Geplante Features:**
- [ ] PWA (Progressive Web App) Support
- [ ] Dark/Light Mode Toggle
- [ ] Export-Funktionen (PDF, CSV)
- [ ] Browser-Extension
- [ ] Mobile App (React Native)
- [ ] API-Integration für mehr Plattformen

### 💡 **Feature Requests**
Haben Sie Ideen? [Erstellen Sie ein Issue](https://github.com/yourusername/user_finder/issues/new)!

## 📞 Support

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/yourusername/user_finder/issues)
- 💬 **Diskussionen:** [GitHub Discussions](https://github.com/yourusername/user_finder/discussions)
- 📧 **Kontakt:** your.email@example.com

---

**⭐ Wenn Ihnen dieses Projekt gefällt, geben Sie ihm einen Stern auf GitHub!**

Entwickelt mit ❤️ für die OSINT-Community
