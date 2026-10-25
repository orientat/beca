# Assistent Beques NESE/NEAE 2026–2027

Aplicació web estàtica en HTML, CSS i JavaScript per donar suport a la revisió d'expedients de beques NESE/NEAE del curs 2026–2027.

## Principis de disseny i privacitat
- No necessita servidor, compte ni base de dades pròpia.
- Les dades del cas es mantenen en la memòria de la pàgina mentre està oberta.
- No introduïsques dades identificatives reals de l'alumnat en el repositori ni en incidències públiques.
- Les regles han de ser explícites i revisables.
- L'aplicació és un suport de treball: no substitueix la convocatòria oficial, les instruccions vigents ni el criteri professional.

## Estructura del projecte
- `index.html`: estructura de la interfície i vistes.
- `styles.css`: presentació i disseny adaptable.
- `rules.js`: regles de decisió i càlcul.
- `annex.js`: funcionalitats relacionades amb annexos.
- `app.js`: fluxos, estat i renderització de l'aplicació.
- `QA_CASES.md`: casos de prova documentats.
- `TEST_V7.js` i `TEST_V8.js`: comprovacions automatitzades parcials.
- `PRIVACITAT.md`: notes de privacitat.
- `CHANGELOG_V8.md` i `README_AUDIT.txt`: historial i notes de revisió.

## Execució i publicació
L'aplicació està pensada per executar-se com a web estàtica i publicar-se, per exemple, amb GitHub Pages. Els scripts s'han de carregar en l'ordre establit en `index.html`, perquè `app.js` depén dels mòduls de regles i annexos.

## Estat de validació
La cobertura de proves automatitzades és parcial: les comprovacions existents no demostren per si soles que tots els recorreguts de la interfície funcionen correctament. Cal executar els casos de `QA_CASES.md` en el navegador i revisar la normativa oficial aplicable a la convocatòria 2026–2027 abans d'utilitzar l'eina en expedients reals.

## Precaucions
- No considerar una regla validada normativament només perquè passe una prova de codi.
- No utilitzar dades personals reals en proves, captures o incidències públiques.
- Registrar i corregir els defectes funcionals abans de donar l'eina per finalitzada.
