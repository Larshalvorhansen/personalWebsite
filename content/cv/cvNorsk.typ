#set page(margin: (top: 0.5in, rest: 0.75in))
#set text(font: "Times New Roman", size: 11pt)
#set par(leading: 0.4em)
#show link: underline
#show link: set text(blue)

// Header med navn og kontaktinfo
#align(center)[
  #text(size: 18pt, weight: "bold")[Lars Halvor Hansen]
  #v(0.05em)
Oslo, Norge | #link("https://www.linkedin.com/in/larshalvorhansen/")[LinkedIn] | 908 09 670 | #link("mailto:larshalvorhansen1@gmail.com")[larshalvorhansen1\@gmail.com] | #link("https://github.com/Larshalvorhansen")[Github]
]

#v(0.2em)

// Utdanning
#box(width: 100%)[
  #text(weight: "bold", size: 12pt)[UTDANNING]
  #box(width: 1fr, inset: (bottom: 4pt))[#line(length: 100%)]
]

#v(-0.1em)

#grid(columns: (1fr, auto), [*NTNU | Mastergrad i Elektronisk systemdesign og innovasjon*])
#grid(columns: (1fr, auto), [_Spesialisering i romsystemer_], [_Juni 2027_])
#grid(columns: (1fr, auto), [*NTNU | Bachelorgrad i Samfunnsøkonomi*], [_Juni 2026_])

#v(0.15em)

// Erfaring
#box(width: 100%)[
  #text(weight: "bold", size: 12pt)[ERFARING]
  #box(width: 1fr, inset: (bottom: 4pt))[#line(length: 100%)]
]

#v(-0.1em)

#grid(columns: (1fr, auto), [*Sony Semiconductor Europe* | *Digitaldesign-praktikant*], [_Juni–Aug 2024_])
- Utviklet oversettelsesverktøy fra Python/YAML til SystemVerilog UVM, automatiserte verifiseringsprosesser

#grid(columns: (1fr, auto), [*Disruptive Technologies* | *Embedded-praktikant*], [_Juni–Aug 2023_])
- Designet IoT-sensorhub med Nordic nRF9160 og ZephyrRTOS, oppnådde betydelig strømreduksjon
- Utviklet konseptbevis for skyoppkoblingsløsning for neste generasjons produkt

#grid(columns: (1fr, auto), [*Orbit NTNU* | *Systemingeniør og elektroingeniør*], [_Sep 2022–Juni 2024_])
- Designet STM32-basert kretskort (PCB) for OnBoard Computer til BioSat CubeSat-oppdraget
- Utviklet strømbudsjettanalyse for over 7 delsystemer

#grid(columns: (1fr, auto), [*NTNU* | *Læringsassistent i Innføring i elektronikk*], [_Aug–Juni 2023_])
- Støttet studenter med teknisk veiledning under labøkter og forelesninger

#grid(columns: (1fr, auto), [*ShiftHyperloop* | *Batterisystemingeniør*], [_Sep 2021–Juli 2022_])
- Designet kapsling for høyspenningsbatteri (200V+) med integrert BMS
- Utviklet EMI-skjerming og termisk styring for "hyperloop pod" i konkurranseklasse

#grid(columns: (1fr, auto), [*Ungdomsakademiet* | *Privatlærer*], [_Jan 2019–Juni 2020_])
- Privatundervisning i matematikk, naturfag og engelsk med målbare karakterforbedringer

#v(0.15em)

// Ferdigheter
#box(width: 100%)[
  #text(weight: "bold", size: 12pt)[FERDIGHETER]
  #box(width: 1fr, inset: (bottom: 4pt))[#line(length: 100%)]
]

#v(-0.1em)

*Programmering:* Python, C++, SQL

*Programvare og verktøy*
- Teknisk design (CAD/EDA): Altium Designer, KiCAD, SolidWorks
- DevOps og utvikling: Git & GitHub, Vim, nix
- Dokumentasjon: Typst, LaTeX, MSOfficeSuite, GoogleDocs

*Språk:* Norsk flytende, Engelsk flytende, Grunnleggende spansk

#v(0.15em)

// Prosjekter
#box(width: 100%)[
  #text(weight: "bold", size: 12pt)[PROSJEKTER]
  #box(width: 1fr, inset: (bottom: 4pt))[#line(length: 100%)]
]

#v(-0.1em)

*Økonomiske artikler* (2023–nå): Publiserer analytiske artikler om makroøkonomi og markedstrender | #link("https://halvorhansen.no/economicoutlook")[halvorhansen.no/economicoutlook]

*LambdaSim-prosjektet* (Juli 2024–nå): Modellering av sammenhenger mellom økonomiske faktorer ved bruk av stokastiske simuleringsmetoder og autonom agentmodellering | #link("https://halvorhansen.no/lambdasim")[halvorhansen.no/lambdasim]

#v(0.15em)

// Referanser
#box(width: 100%)[
  #text(weight: "bold", size: 12pt)[REFERANSER]
  #box(width: 1fr, inset: (bottom: 4pt))[#line(length: 100%)]
]

#v(-0.1em)

#grid(
  columns: (1fr, 1fr),
  column-gutter: 20pt,
  
  [
    *Håvard Mellbye*, \
    Arbeidsgiver, Disruptive Technologies \
    #link("mailto:havard.mellbye@disruptive-technologies.com") \
    +47 99 32 64 52
  ],
  [
    *Jarle Steinberg*, \
    Systemingeniør ved ESA, Paris \
    #link("mailto:jarle.steinberg@orbitntnu.com") \
    +47 94 13 07 39
  ]
)
