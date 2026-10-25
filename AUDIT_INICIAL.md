# Auditoria inicial — Assistent Beques NESE/NEAE 2026–2027

## Abast
Revisió estàtica inicial de l'estructura, el flux de la interfície, els scripts de prova i la documentació del repositori. Aquesta nota no equival a una auditoria normativa completa ni a una prova exhaustiva en navegador.

## Incidències funcionals observades
1. **«Consulta ràpida» duplica «Nou expedient».** En `app.js`, les dues accions inicialitzen l'estat i obrin el mateix assistent de set passos. L'etiqueta promet un recorregut diferent que no existeix en la implementació observada.
2. **Les proves automatitzades no cobreixen tota la interfície.** `TEST_V7.js` comprova càlculs percentuals aïllats. `TEST_V8.js` combina comprovacions basades en patrons del codi d'annexos amb càlculs; no executa el flux complet de l'aplicació.
3. **Els casos QA necessiten execució real.** `QA_CASES.md` documenta escenaris útils, però la seua existència no demostra que s'hagen executat satisfactòriament en el navegador.
4. **Cal una validació normativa separada.** Les proves de programari no acrediten que els criteris siguen conformes amb la convocatòria i les instruccions oficials vigents per al curs 2026–2027.

## Documentació i estructura
- L'aplicació utilitza diversos fitxers JavaScript i CSS; la descripció antiga del README que la limitava a tres fitxers i recomanava crear un repositori nou ja no descrivia adequadament el projecte existent.
- L'ordre de càrrega dels scripts en `index.html` és rellevant per les dependències entre `rules.js`, `annex.js` i `app.js`.
- `PRIVACITAT.md` documenta un funcionament sense servidor ni base de dades pròpia i l'emmagatzematge del cas en la memòria de la pàgina. Cal mantindre aquesta precaució i no pujar dades identificatives.

## Prioritats de correcció
1. Definir què ha de fer exactament «Consulta ràpida» i implementar un recorregut diferenciat, o bé canviar-ne l'etiqueta perquè no prometa una funció inexistent.
2. Executar els casos de `QA_CASES.md` en navegador i registrar resultat, passos i incidències.
3. Afegir proves d'integració per a les decisions principals i per als botons d'annexos; evitar considerar suficients les comprovacions basades només en expressions regulars.
4. Verificar cada regla de decisió amb la convocatòria i les instruccions oficials 2026–2027, registrant la font i l'apartat corresponent.
5. Mantindre la documentació sincronitzada amb el codi real.

## Límits d'aquesta revisió
No s'ha declarat cap regla com a jurídicament validada. No s'ha d'utilitzar aquesta nota com a certificació de compliment normatiu. Les correccions documentals proposades no substitueixen la prova manual ni la revisió professional de les regles.
