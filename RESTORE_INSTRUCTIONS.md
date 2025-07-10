# 🔄 WIEDERHERSTELLUNGS-ANWEISUNGEN

Falls etwas schief geht, folgen Sie diesen Schritten:

## 🎯 SCHNELLE WIEDERHERSTELLUNG:

### 1. Hauptdateien prüfen:
```bash
# Diese Dateien sollten diese Inhalte haben:
src/pages/Trade4meLanding.tsx - Mit WebinarBookingModal Import + Partner Login Link
src/components/AdminPartnerManagement.tsx - Mit window.confirm()
src/components/TutorialManagement.tsx - Mit window.confirm()
src/components/MarketingMaterialManagement.tsx - Mit handleDeleteMaterial()
src/components/WebinarManagement.tsx - Mit window.confirm()
src/components/ConsultationManagement.tsx - Mit window.confirm()
```

### 2. Wichtige Features checken:
- ✅ FREE Education Webinar Button auf Trade4me Landing
- ✅ Partner Login Link im Footer (rot, führt zu /login)
- ✅ Alle Papierkorb Buttons im Admin Dashboard
- ✅ Keine schwarzen Bildschirme
- ✅ Modal Systeme funktionieren

### 3. Falls Probleme auftreten:

#### Problem: Schwarzer Bildschirm
**Lösung:** Console-Logs in `src/main.tsx` prüfen

#### Problem: Webinar Button fehlt  
**Lösung:** `WebinarBookingModal` Import in Trade4meLanding.tsx prüfen

#### Problem: Partner Login Link fehlt
**Lösung:** Footer in Trade4meLanding.tsx prüfen - sollte roten Link zu /login haben

#### Problem: Papierkorb funktioniert nicht
**Lösung:** `window.confirm()` statt `confirm()` verwenden

#### Problem: Modal öffnet nicht
**Lösung:** State Management und Event Handler prüfen

## 🔧 NOTFALL-KOMMANDOS:

```bash
# Development Server neu starten
npm run dev

# Dependencies neu installieren
npm install

# Cache leeren
rm -rf node_modules/.vite
npm run dev
```

## 📞 SUPPORT:
Bei kritischen Problemen: Zurück zu dieser stabilen Version!

### Backup-Dateien:
- `BACKUP_VERSION_STABLE.md` - Vollständige Dokumentation
- `RESTORE_INSTRUCTIONS.md` - Diese Anweisungen

---
**Letzte stabile Version:** Aktuelle Version mit Partner Login Link
**Backup Datum:** 2025-01-15