# Portfolio — Sierd van Wilsum

Een persoonlijke portfolio in React, TypeScript en Vite. De homepage is bedoeld voor recruiters; `/ai-minor` is een aparte pagina met leeruitkomsten en acht sprints. De inhoud is in het Nederlands. Bezoekers hebben geen account nodig. Met Supabase en `/admin` kun je de inhoud beheren. Zonder verbinding blijft de oorspronkelijke lokale inhoud beschikbaar.

**Admin activeren:** volg [de Supabase-handleiding](supabase/README.md) voor de tabellen en je beheerdersaccount. Na de eerste publicatie beheer je de live inhoud via `/admin`; de databestanden hieronder zijn dan alleen de begininhoud en terugval.

## 1. Lokaal starten in Visual Studio Code

1. Open deze projectmap in Visual Studio Code via **File → Open Folder**.
2. Open **Terminal → New Terminal**.
3. Je hebt Node.js nodig: versie 20.19 of hoger (of een recente LTS-versie). Controleer met `node --version`.
4. Voer eenmalig `npm install` uit om de benodigde pakketten te installeren.
5. Voer `npm run dev` uit.
6. Open het lokale adres dat de terminal toont, meestal **http://127.0.0.1:5173**.

Laat de terminal open zolang je aan de website werkt. Een opgeslagen wijziging zie je meestal direct in je browser. Stop de server met **Ctrl + C**.

Op deze Mac is Node al via nvm geïnstalleerd. Als de terminal `command not found: node` meldt, voer dan eerst uit:

```sh
source ~/.nvm/nvm.sh
nvm use 20
```

## 2. Persoonlijke foto's

Alle aangeleverde foto's zijn toegevoegd aan het project, inclusief het nieuwe portret en de twee voetbalfoto's. Stuur bij volgende wijzigingen je foto's in de chat met een korte omschrijving van wat erbij hoort; wanneer de bijlagen als originele bestanden beschikbaar zijn, kan ik ze voor je plaatsen en koppelen. Je hoeft dan zelf geen code aan te passen.

De huidige indeling:

| Map / bestand | Gebruik |
| --- | --- |
| `public/images/events/surfana-opbouw.jpg` | Foto 1: opbouw bij Surfana, onder 'Meer foto's' |
| `public/images/projects/surfana.jpg` | Foto 2: groepsactiviteit bij Surfana |
| `public/images/profile/sierd.jpg` | Portret tijdens je Protest-stage, onder 'Meer foto’s' bij Protest |
| `public/images/projects/protest.jpg` | Foto 4: fotoshoot tijdens je Protest-stage |
| `public/images/projects/protest-kantoor.jpg` | Foto 5: kantoor bij Protest, onder 'Meer foto's' |
| `public/images/projects/lofi-diner.jpg` | Foto 6: je eigen georganiseerde diner bij LOFI |
| `public/images/personal/festival.jpg` | Foto 7: festivals en vrije tijd bij 'Over mij' |
| `public/images/profile/sierd-portret.png` | Nieuw portret bovenaan de homepage |
| `public/images/football/bfc-wedstrijd.jpg` | Wedstrijdfoto bij de BFC-ervaring |
| `public/images/football/bfc-team.jpeg` | Teamfoto bij de BFC-ervaring |
| `public/images/events/` | Overige eventfoto's |
| `public/images/football/` | Voetbalfoto's |
| `public/images/travel/` | Reisfoto's |

Je kunt deze foto's ook zelf vervangen door een ander bestand op hetzelfde pad te zetten en de pagina te herladen. Gebruik de werkelijke bestandsextensie: een `.png` hernoemen naar `.jpg` verandert het bestandsformaat niet. Pas indien nodig het pad aan in `src/data/portfolio.ts`. De extra projectfoto's staan daar in `photos`. De projectfoto's zijn aanklikbaar om het volledige origineel in een nieuw tabblad te bekijken.

Andere foto's verschijnen pas nadat je hun pad toevoegt aan de data of een component. Gebruik bijvoorbeeld `/images/projects/protest.jpg`: **zonder `public`**. Let op hoofdletters; online zijn `Foto.jpg` en `foto.jpg` verschillende bestanden. Gebruik liefst korte bestandsnamen zonder spaties en webvriendelijke JPG, PNG of WebP. Ontbrekende foto's tonen een rustige placeholder, nooit een verzonnen foto.

## 3. Foto's en screenshots van sprints

De mappen staan klaar van `public/images/minor/sprint-1/` tot en met `public/images/minor/sprint-8/`.

Voeg in `src/data/sprints.ts` bij de juiste showcase bijvoorbeeld toe:

```ts
images: [
  {
    src: '/images/minor/sprint-1/onderzoek.png',
    alt: 'Screenshot van mijn onderzoek naar AI in eventproductie',
    caption: 'Optioneel onderschrift',
  },
],
```

Je kunt meerdere objecten tussen de vierkante haken plaatsen. `alt` beschrijft wat er echt op de afbeelding staat, voor bezoekers die de afbeelding niet kunnen zien. Verwijder `caption` als een onderschrift niet nodig is.

## 4. PDF's en documenten

Plaats bestanden in `public/documents/sprint-1/` tot en met `public/documents/sprint-8/`. Voeg daarna bij de showcase toe:

```ts
documents: [
  { label: 'Open PDF', url: '/documents/sprint-1/onderzoek.pdf' },
],
```

Documenten en externe links openen in een nieuw tabblad. De browser bepaalt of een bepaald bestand wordt getoond of gedownload. Voeg alleen een link toe als het bestand daadwerkelijk bestaat. Alles in `public/` is na publicatie openbaar.

## 5. Een showcase toevoegen of wijzigen

Alle sprints staan in **`src/data/sprints.ts`**. Er is één herbruikbare weergave; je hoeft geen componenten te bouwen voor nieuwe inhoud.

Zoek de juiste sprint en voeg een object toe aan `showcases: [ ... ]`. Bijvoorbeeld:

```ts
{
  id: 'mijn-unieke-showcase',
  type: 'Onderzoek',
  title: 'Vul hier je echte titel in',
  description: 'Een korte omschrijving van wat je hebt gedaan.',
  body: ['Een eerste alinea.', 'Een tweede alinea.'],
  // Optioneel: date: '2026-09-24',
  images: [],
  documents: [],
  links: [],
  tools: [],
  learningOutcomes: [],
  // Optioneel: conclusion: 'Je conclusie',
  // Optioneel: reflection: 'Je persoonlijke reflectie',
},
```

Gebruik een unieke `id`. Mogelijke types zijn `Research Story`, `User Story`, `Learn Story`, `Project`, `Onderzoek`, `Prototype`, `Bewijs` en `Reflectie`. Een datum gebruikt de vorm `JJJJ-MM-DD`.

Een externe link voeg je toe als `links: [{ label: 'Bekijk onderzoek', url: 'https://jouw-echte-url.nl' }]`. Bij `tools` vul je bijvoorbeeld `['ChatGPT', 'NotebookLM']` in. Bij leeruitkomsten gebruik je bijvoorbeeld `['LU1', 'LU4', 'LU5']`.

Sprint 1 bevat de drie aangeleverde verhalen. De LU-koppeling staat op sprintniveau; de onderzoeksshowcase gebruikt LU1, LU4 en LU5. Controleer die koppeling bij je uiteindelijke bewijsmateriaal. Voor de andere twee showcases zijn individuele koppelingen nog leeg. Sprint 2 bevat voorlopige onderwerpen zonder behaalde resultaten. Sprints 3–8 hebben nog geen inhoud.

Een sprintstatus is `Afgerond`, `In uitvoering` of `Nog niet gestart`. Pas die alleen aan als dit klopt. Alle sprints zijn bij normaal openen van de minorpagina gesloten. Een directe link zoals `/ai-minor#sprint-1` opent bewust de betreffende sprint. Je kunt meerdere sprints tegelijk openen.

## 6. LU-voortgang aanpassen

Open **`src/data/learningOutcomes.ts`**. Verander bijvoorbeeld:

```ts
{ id: 'LU1', title: 'AI-impact op toekomstige beroepspraktijk', completed: 1, total: 2 }
```

naar `completed: 2`. De teller en voortgangsbalk veranderen automatisch. `total` is het vereiste aantal. De beginwaarden zijn 1/2, 0/4, 0/2, 1/4 en 1/6.

De LU-voortgang is een apart overzicht van behaalde onderdelen. Showcases toevoegen of een sprint afronden verhoogt de teller niet automatisch; zo ontstaan geen onbedoelde claims over behaalde leeruitkomsten.

## 7. Persoonlijke inhoud en contact

Open **`src/data/portfolio.ts`** om je portretpad, ervaring, projecten en contactinformatie aan te passen. Er staan maximaal vier projecten op de homepage.

Je e-mail, LinkedIn en CV zijn ingevuld bij `profile`:

```ts
email: 'Sierdvanwilsum@gmail.com',
linkedin: 'https://www.linkedin.com/in/sierd-van-wilsum-9378b1240/',
cv: '/documents/cv-sierd-van-wilsum.pdf',
```

Lege gegevens tonen een duidelijk label zoals 'E-mailadres volgt', zonder een kapotte knop. Periodes en projectjaren zijn nog leeg en worden verborgen zolang deze niet bekend zijn. Vul die later bij `period` en `year` in. De praktijkprojecten zijn gebaseerd op je opgegeven werkzaamheden; voeg later specifieke projecten of resultaten toe wanneer je die wilt delen.

Je CV staat in `public/documents/cv-sierd-van-wilsum.pdf` en opent via de contactsectie in een nieuw tabblad. De voetbalfoto’s staan bij BFC in de ervaringssectie.

De teksten van de homepage staan in `src/pages/Home.tsx`. Kleuren, typografie en schermformaten staan in `src/styles.css`. Lettertypen worden via Google Fonts geladen; zonder internet gebruikt de site systeemlettertypen.

## 8. Controleren

```sh
npm run build
```

Dit controleert TypeScript en bouwt de publiceerbare website in `dist/`. Preview die build met `npm run preview`.

```sh
npm run test:e2e
```

De browsertests controleren vijf schermbreedtes, navigatie, sprints, voortgang, toetsenbordbediening en placeholders. Hiervoor is Google Chrome nodig. De test start indien nodig zelf de lokale Vite-server. Screenshots bij fouten staan in `test-results/`.

## 9. Later naar GitHub en Vercel

1. Controleer de website met `npm run build` en vul de ontbrekende persoonlijke gegevens aan.
2. Open het **Source Control**-paneel van VS Code en kies **Initialize Repository**.
3. Maak een eerste commit. `node_modules`, `dist` en lokale `.env`-bestanden worden door `.gitignore` uitgesloten.
4. Kies **Publish to GitHub**, meld je aan en kies of je repository openbaar of privé wordt.
5. Maak bij Vercel een nieuw project en importeer die GitHub-repository.
6. Kies **Vite** als framework, `npm run build` als build command en `dist` als output directory. Gebruik Node 20.19+ of een recentere LTS-versie.
7. Klik op **Deploy**. Latere commits naar je hoofdbranch kunnen automatisch een nieuwe versie publiceren.

`vercel.json` zorgt dat `/ai-minor` en `/admin` ook direct te openen en te herladen is. Op andere hosting moet je deze route eveneens naar `index.html` laten wijzen. GitHub Pages heeft hiervoor extra configuratie nodig; GitHub als broncodeopslag met Vercel als hosting is de eenvoudigste route.

## 10. Supabase en admin

De koppeling is gebouwd. Vul `VITE_SUPABASE_URL` en `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local` in. Herstart de ontwikkelserver na configuratiewijzigingen. Dit bestand wordt niet opgeslagen in Git.

Voer eenmalig de stappen in [supabase/README.md](supabase/README.md) uit om de tabellen, toegangsregels en je beheerdersaccount aan te maken. Een publishable key kan dit niet zelf uitvoeren.

Open daarna **http://localhost:5173/admin**. Hier beheer je profiel, contact, teksten, ervaring, projecten, LU-voortgang, sprints, showcases en uploads. De eerste keer neem je de huidige website over met **Opslaan en publiceren**. De knoppen om op te slaan zijn pas beschikbaar als de database bereikbaar is en je beheerdersrechten zijn gecontroleerd.

Wijzigingen zijn direct openbaar na opslaan; er zijn geen privéconcepten. Alleen jouw aangewezen Supabase-account heeft schrijfrechten. De code bevat geen wachtwoord of vaste pincode. Zet nooit een secret- of service_role-key in browsercode. `VITE_`-variabelen zijn zichtbaar in de gepubliceerde website.

Controleer de verbinding met `npm run check:supabase`. Voeg dezelfde twee configuratievariabelen toe in Vercel en deploy opnieuw om de online site te verbinden.

## Mapstructuur

```text
src/
  admin/            Formulieren voor inhoud en uploads
  lib/              Supabase-client, gegevensvalidatie en opslag
  components/       Herbruikbare navigatie, foto's, dashboard en showcases
  data/             Persoonlijke inhoud, sprints, leeruitkomsten en types
  pages/            Homepage en aparte minorpagina
  App.tsx           Paginakeuze en algemene indeling
  styles.css        Vormgeving en mobiele weergave
public/
  images/           Eigen foto's en screenshots
  documents/        CV en bewijsstukken per sprint
supabase/           SQL-bestanden en installatiehandleiding
tests/              Browsertests (met een nagebootste Supabase-verbinding)
```
