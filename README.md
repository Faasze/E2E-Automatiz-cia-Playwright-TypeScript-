# E-shop E2E testy – Playwright + TypeScript

E2E testy pre demo e-shop [automationexercise.com](https://automationexercise.com):
- **pozitívny tok:** vyhľadanie produktu → pridanie do košíka → overenie názvu, ceny a množstva v košíku
- **negatívny tok:** vyhľadanie neexistujúceho produktu → žiadne výsledky, košík zostane prázdny

Oba testy bežia na 5 platformách: **Chromium, Firefox, WebKit (Safari), mobil Android (Pixel 7) a iPhone 14**, spolu 10 behov.

## Spustenie

```bash
npm ci
npx playwright install

npm test              # všetky testy na všetkých platformách
npx playwright test --project=mobile-safari   # len jedna platforma
npm run report        # HTML report
npx playwright test --ui   # interaktívny režim
```

**CI:** GitHub Actions (`.github/workflows/e2e.yml`) sa spúšťa pri pushi, pri pull requeste aj ručne. HTML report sa ukladá ako artefakt behu a zverejňuje sa aj na GitHub Pages.

## Prístup

- **Page Object Model + komponenty:** selektory sú len v `src/pages` a `src/components`, takže pri zmene UI sa opravuje jedno miesto.
- **Fixtures** (`src/fixtures/test.ts`) dávajú testom hotové page objekty a odstraňujú opakovanie setupu v každom teste.
- **Testovacie dáta** sú v `test-data/products.json`. Z každého záznamu vznikne samostatný test, takže ďalší produkt znamená nový riadok v JSON, bez zmeny kódu.
- **Prehliadače a mobil** sú len projekty v `playwright.config.ts`. Tie isté testy bežia všade bez duplikovania kódu.

## Výzvy a rozhodnutia

- **Výber e-shopu:** reálne obchody majú ochranu proti botom a často menia sortiment. Preto som zvolil stránku určenú na cvičenie automatizácie.
- **Reklamy** na stránke náhodne prekrývali tlačidlá. Blokujem ich na úrovni siete, aby testy boli stabilné.
- **Nestabilná demo stránka:** e-shop občas vráti „heavy load“, HTTP 503 alebo Cloudflare 520. Test vtedy zlyhá s hláškou `ENVIRONMENT ISSUE`, takže je hneď vidieť, že nejde o chybu produktu. Neúspešný test sa zopakuje (lokálne 1×, v CI 2×) a report ho označí ako *flaky*. Navigácia nečaká na úplné načítanie obrázkov a skriptov tretích strán (`domcontentloaded`), na prvky čakajú asserty.
- **Pomalý server pri paralelných testoch:** pri veľa súbežných prehliadačoch demo stránka nestíhala. Obmedzil som počet workerov a pri pridaní do košíka test čaká na odpoveď servera, nie len na zobrazenie okna.
- **Pomalé CI:** inštalácia prehliadačov (`--with-deps`) trvala pri Firefoxe/WebKite až ~9 min. CI preto beží v oficiálnom Docker obraze Playwright s predinštalovanými prehliadačmi. Verzia `@playwright/test` je zafixovaná, aby sedela s obrazom.
- **Vyhľadávanie vráti viac produktov:** test vyberá produkt podľa presného názvu, nie prvý výsledok v zozname.

Pri tvorbe som použil AI asistenta (Claude Code). Výsledky som overil spustením testov a kontrolou, že test pri nesprávnych dátach naozaj zlyhá.
