# Bryllupsnettside – Kaja & Lars Halvor

En statisk nettside på norsk. Åpne `index.html` i nettleseren, eller legg hele mappen på et vanlig webhotell. Det trengs ingen byggeverktøy eller database.

## Bytt ut video og kort

- **Video:** Erstatt `assets/invitasjon-plassholder.mp4` med en ferdig, lydløs video i stående 9:16-format. Behold filnavnet, eller oppdater `src` på `<video id="intro-video">` i `index.html`. Introen går videre når videoen slutter; tidsnødløsningen er satt til 5,5 sekunder i `assets/site.js`, så juster den hvis sluttvideoen varer lenger.
- **Kortforside:** Erstatt `assets/kort-forside.jpg` med det ferdige kortbildet. Dette brukes både når kortet åpnes og som tydelig merket eksempelbilde i «Om oss». Når dere får et eget bilde av dere, endre bildefilen i «Om oss»-seksjonen i `index.html` og fjern eksempelmerkingen.
- **Kortets innside:** Tekst og utseende ligger i `.card-inside` i `index.html` og `assets/style.css`. Her kan en ferdig bakside eller innside settes inn som bilde hvis ønskelig.

Introen vises én gang per nettleserprofil og lagres med `localStorage`. Knappen «Spill av invitasjonen på nytt» finnes i venstremenyen på desktop og nederst på siden på mobil. Åpne siden i et privat vindu for å prøve førstegangsbesøket igjen.

## Før siden deles med gjestene

Sjekk fredag og mulig søndag, resten av lørdagsprogrammet, kleskode, meny, overnatting og transport. Sett inn «Om oss»-tekst og bilde, Kajas kontaktinformasjon og endelig svarfrist. Sjekk også at Google Forms-skjemaet er åpent for svar.

De to kartlenkene og RSVP-lenken ligger i `index.html`. Aksentfargene ligger øverst i `assets/style.css`.
