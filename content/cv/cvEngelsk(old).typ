#set page(margin: (top: 0.5in, rest: 0.75in))
#set text(font: "Times New Roman", size: 11pt)
#set par(leading: 0.4em)
#show link: underline
#show link: set text(blue)

// Header with name and contact info
#align(center)[
  #text(size: 18pt, weight: "bold")[Lars Halvor Hansen]
  #v(0.05em)
Oslo, Norway | #link("https://www.linkedin.com/in/larshalvorhansen/")[LinkedIn] | 908 09 670 | #link("mailto:larshalvorhansen1@gmail.com")[larshalvorhansen1\@gmail.com] | #link("https://github.com/Larshalvorhansen")[Github]
]

#v(0.2em)

// Education Section
#box(width: 100%)[
  #text(weight: "bold", size: 12pt)[EDUCATION]
  #box(width: 1fr, inset: (bottom: 4pt))[#line(length: 100%)]
]

#v(-0.1em)

#grid(columns: (1fr, auto), [*NTNU | Electronic System Design and Innovation Master*], [*Trondheim*])
#grid(columns: (1fr, auto), [_Specialization in Space Systems_], [_June 2027_])
#grid(columns: (1fr, auto), [*NTNU | Economics - Bachelor's Degree*], [_June 2026_])

#v(0.15em)

// Experience Section
#box(width: 100%)[
  #text(weight: "bold", size: 12pt)[EXPERIANCE]
  #box(width: 1fr, inset: (bottom: 4pt))[#line(length: 100%)]
]

#v(-0.1em)

#grid(columns: (1fr, auto), [*Sony Semiconductor Europe* | *Digital Design Intern*], [_June–Aug 2024_])
- Developed Python/YAML to SystemVerilog UVM translation tool, automated verification processes

#grid(columns: (1fr, auto), [*Disruptive Technologies* | *Embedded Intern*], [_June–Aug 2023_])
- Designed IoT sensor hub with Nordic nRF9160 and ZephyrRTOS, achieved significant power reduction
- Developed cloud connectivity solution proof of concept for next generation product

#grid(columns: (1fr, auto), [*Orbit NTNU* | *Systems Engineer and Electronics Engineer*], [_Sep 2022–Jun 2024_])
- Designed STM32-based OnBoard Computer PCB for BioSat CubeSat mission
- Developed power budget analysis for 7+ subsystems

#grid(columns: (1fr, auto), [*NTNU* | *Teaching Assistant in Introduction to Electronics*], [_Aug–Jun 2023_])
- Supported students by providing technical guidance during lab sessions and lectures

#grid(columns: (1fr, auto), [*ShiftHyperloop* | *Battery Systems Engineer*], [_Sep 2021–Jul 2022_])
- Designed high-voltage battery enclosure (200V+) with integrated BMS
- Engineered EMI shielding and thermal management for competition-grade hyperloop pod

#grid(columns: (1fr, auto), [*Ungdomsakademiet* | *Private Tutor*], [_Jan 2019–Jun 2020_])
- Private tutoring in mathematics, science and English with measurable grade improvements

#v(0.15em)

// Skills Section
#box(width: 100%)[
  #text(weight: "bold", size: 12pt)[SKILLS]
  #box(width: 1fr, inset: (bottom: 4pt))[#line(length: 100%)]
]

#v(-0.1em)

*Programming:* Python, C++, SQL

*Software & Tools*
- Engineering Design (CAD/EDA): Altium Designer, KiCAD, SolidWorks
- DevOps & Development: Git & GitHub, Vim, nix
- Technical Writing & Documentation: Typst, LaTeX, MSOfficeSuite, GoogleDocs

*Languages:* Norwegian fluent, English fluent, Basic Spanish

#v(0.15em)

// Interests Section
#box(width: 100%)[
  #text(weight: "bold", size: 12pt)[PROJECTS]
  #box(width: 1fr, inset: (bottom: 4pt))[#line(length: 100%)]
]

#v(-0.1em)

*Economic Articles* (2023–present): Publishing analytical articles on macroeconomics and market trends | #link("https://halvorhansen.no/economicoutlook")[halvorhansen.no/economicoutlook]

*LambdaSim Project* (Jul 2024–present): Modeling relationships between economic factors using stochastic simulation methods and autonomous agent modeling | #link("https://halvorhansen.no/lambdasim")[halvorhansen.no/lambdasim]

#v(0.15em)

// References Section
#box(width: 100%)[
  #text(weight: "bold", size: 12pt)[REFERANCES]
  #box(width: 1fr, inset: (bottom: 4pt))[#line(length: 100%)]
]

#v(-0.1em)

#grid(
  columns: (1fr, 1fr),
  column-gutter: 20pt,
  
  [
    *Håvard Mellbye*, \
    Employer, Disruptive Technologies \
    #link("mailto:havard.mellbye@disruptive-technologies.com") \
    +47 99 32 64 52
  ],
  [
    *Jarle Steinberg*, \
    Systems Engineer at ESA, Paris \
    #link("mailto:jarle.steinberg@orbitntnu.com") \
    +47 94 13 07 39
  ]
)
