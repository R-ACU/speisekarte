# Speisekarte 2 — Ristorante Giovanni R

Digitale Speisekarte für **Ristorante Giovanni R** (giovannir-menu.de), Laatzen.
Statische Website, kein Framework, reines Vanilla JS + HTML + CSS.

---

## Datenquelle

**Alle Menüinhalte** leben ausschließlich in:
```
giovanni_r_menu.json
```
HTML ist nur ein Template — niemals Menüdaten direkt in HTML schreiben.

---

## JSON-Struktur

```json
{
  "restaurant": "Giovanni R – Cucine Italiane",
  "allergen_legende": { "additive": {...}, "allergen": {...} },
  "kategorien": {
    "antipasti": [ { Gericht }, ... ],
    "insalata":  { "gerichte": [ ... ] },
    "zuppe":     [ ... ],
    "bruschette":{ "gerichte": [ ... ] },
    "pizze":     { "gerichte": [ ... ] },
    "fisch":     [ ... ],
    "fleischgerichte": { "gerichte": [ ... ] },
    "empfehlungen":    { "gerichte": [ ... ] },   // Empfehlungsmenü
    "mittagstisch":    { "gerichte": [ ... ] },   // nur 11–14 Uhr sichtbar
    "dessert":   [ ... ]
  }
}
```

> Manche Kategorien sind direkte Arrays, andere haben ein `gerichte`-Array — beides kommt vor.

### Gericht-Objekt

```json
{
  "nr": 42,
  "name": "Tagliatelle al Tartufo",
  "beschreibung": "Frische Pasta mit Trüffel & Parmesan",
  "preis": 18.5,
  "preis_klein": 12.0,          // optional: kleine Portion
  "tags": ["vegetarisch"],      // optional: "vegan", "vegetarisch", "neu"
  "allergen_codes": ["G", "C"], // Kürzel aus allergen_legende
  "translations": {
    "en": { "name": "...", "beschreibung": "..." },
    "it": { "name": "...", "beschreibung": "..." },
    "zh": { "name": "...", "beschreibung": "..." }
  }
}
```

---

## Empfehlungsmenü

Pfad im JSON: `kategorien.empfehlungen.gerichte`

Wenn der User sagt „pass das Empfehlungsmenü an" → nur dort ändern.

---

## Typische Aufgaben

| Aufgabe | Was tun |
|---|---|
| Gericht hinzufügen | Objekt in die richtige Kategorie im JSON einfügen |
| Preis ändern | `preis` / `preis_klein` im JSON anpassen |
| Gericht entfernen | Objekt aus dem Array löschen |
| Neue Empfehlung | In `empfehlungen.gerichte` einfügen |
| Übersetzung ergänzen | `translations.en/it/zh` im Gericht-Objekt befüllen |
| Allergen hinzufügen | Kürzel zu `allergen_codes` hinzufügen |
| Tag setzen | `"neu"`, `"vegetarisch"` oder `"vegan"` zu `tags` hinzufügen |

---

## HTML / JS

- [index.html](index.html) — Hauptseite, rendert Speisekarte dynamisch
- [giovanni_getraenke.html](giovanni_getraenke.html) — Getränkekarte (separates HTML)
- JS ist inline in `index.html` — keine externen JS-Dateien

### Render-Funktionen (in index.html)
- `renderMenuItem()` — Standard-Gerichte
- `renderPizzaCard()` — Pizzen (Grid)
- `renderEmpfehlungItem()` — Empfehlungen
- `renderMittagCard()` — Mittagstisch
- `renderDessertCard()` — Desserts

DOM-Elemente binden via `data-category="kategorienname"`.

---

## Mehrsprachigkeit

4 Sprachen: **DE** (default), **EN**, **IT**, **ZH**
- UI-Strings: `UI`-Objekt in `index.html`
- Gerichtsnamen/-beschreibungen: `translations`-Feld im JSON
- Sprache wird im `localStorage` gespeichert

---

## Design-System (style.css)

```css
--cream: #f5f0e8;       /* Hintergrund */
--gold: #b8932a;        /* Akzentfarbe */
--rust: #8b3a1e;        /* Sekundär-Akzent */
--ink: #1a1410;         /* Text */
--sage: #5a6b4a;        /* Alternativ */
```

Schriften: EB Garamond, Playfair Display, Cormorant Garamond (via [fonts.css](fonts.css))

---

## Deployment

- Hosting: Vercel (`vercel.json`)
- Domain: giovannir-menu.de
