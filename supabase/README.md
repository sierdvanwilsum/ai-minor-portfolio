# Supabase activeren

De website gebruikt Supabase Auth voor de login, Postgres voor de inhoud en Storage voor uploads. Je publishable key kan gegevens benaderen, maar mag geen tabellen of beheerders aanmaken. Daarvoor zijn eenmalig deze stappen in je eigen Supabase-dashboard nodig.

## 1. Database aanmaken

Open je Supabase-project → **SQL Editor** → **New query**. Kopieer de volledige inhoud van `supabase/migrations/001_portfolio.sql`, plak deze en klik **Run**. Dit maakt twee tabellen, toegangsregels en de mediabucket. Bestaande portfolio-inhoud wordt niet overschreven.

## 2. Jouw adminaccount aanmaken

Open **Authentication → Users → Add user → Create new user**. Gebruik **Sierdvanwilsum@gmail.com** en stel zelf een sterk wachtwoord in. Zet **Auto Confirm User** aan. Bewaar het wachtwoord zelf; voeg het niet toe aan code of `.env.local`. `6666` wordt niet als ingebouwd toegangscode gebruikt. De adminpagina gebruikt echte Supabase-authenticatie.

Voor dit persoonlijke portfolio kun je onder **Authentication → Sign In / Providers** nieuwe openbare registraties uitschakelen. De website biedt zelf geen registratie aan. Een andere ingelogde gebruiker krijgt ook geen beheerdersrechten.

## 3. Beheerdersrechten geven

Open opnieuw de SQL Editor. Plak `supabase/002_make_admin.sql` en klik **Run**. Alleen het bevestigde account met het hierboven opgegeven e-mailadres krijgt schrijfrechten. De rechten worden opgeslagen op het vaste gebruikers-ID, niet op een door de browser opgegeven rol.

## 4. Inloggen en de bestaande inhoud overnemen

Controleer `.env.local` en herstart zo nodig `npm run dev` na het wijzigen van de configuratie. Klik op **Admin** bovenaan de website (op mobiel in het menu), of open **http://localhost:5173/admin**. Log in met het wachtwoord van je zojuist aangemaakte Supabase-gebruiker. Klik op **Opslaan en publiceren** om de bestaande portfolio-inhoud eenmalig in de lege database te zetten.

Je kunt daarna profiel, contact, teksten, ervaring, projecten, voortgang en sprints aanpassen via de formulieren. Bij een afbeelding of document kun je een bestaand pad invullen of een bestand uploaden. Opslaan publiceert de hele inhoud; bezoekers zien deze na het laden of verversen van de pagina. Er is geen aparte concept/publicatie-workflow.

Uploads staan direct in een openbare bucket; upload dus alleen bestanden die je wilt delen. Een upload wordt pas aan de pagina gekoppeld na **Opslaan en publiceren**. Verwijderen uit een formulier verwijdert alleen de verwijzing, niet het originele bestand. Ongebruikte uploads kun je later via Supabase Storage opruimen.

## Fouten en herstel

- Bij een ontbrekende koppeling of een onbereikbare database blijft de publieke website de oorspronkelijke lokale inhoud tonen. `/admin` toont de verbindingsfout en blokkeert opslaan totdat de database weer bereikbaar is.
- Een mislukte opslag laat je invoer in het formulier staan. Vernieuw de pagina dan niet voordat je belangrijke wijzigingen hebt overgenomen.
- Als twee tabbladen tegelijk wijzigen, wordt een verouderde versie niet over een nieuwe heen geschreven. Laad de opgeslagen versie opnieuw en verwerk je wijzigingen opnieuw.
- Een login is niet voldoende: je gebruikers-ID moet in `portfolio_admins` staan. Die tabel kan niet via de website worden aangepast.
- Geef alleen gepubliceerde informatie op: de inhoud van `portfolio_content` is openbaar leesbaar. Wachtwoorden staan uitsluitend in Supabase Auth.
- Voor een vergeten wachtwoord kun je je account in het Supabase-dashboard beheren. De website heeft nog geen wachtwoordherstelpagina.

## Hosting

Voeg in Vercel ook `VITE_SUPABASE_URL` en `VITE_SUPABASE_PUBLISHABLE_KEY` toe onder Environment Variables en voer een nieuwe deployment uit. Gebruik nooit een secret- of service_role-key in `VITE_`-variabelen. `.env.local` blijft buiten Git.

## Controle

`npm run check:supabase` controleert de verbinding zonder sleutels te printen. `npm run test:e2e` bevat browsercontroles met nagebootste API-antwoorden; dit bewijst niet dat de rechten van jouw online database goed staan. Zodra de SQL-stappen zijn uitgevoerd moeten de echte rechten apart worden gecontroleerd.

De tabellen bevatten één versie van de volledige website-inhoud als JSON. Dit houdt de bestaande sprintstructuur intact en maakt een atomische opslag mogelijk. De oorspronkelijke TypeScript-data blijft als terugval en begininhoud bestaan; na publicatie beheer je inhoud via `/admin`.
