# V8 — Correccions d'auditoria

## Correccions aplicades
- Navegació de l'assistent d'annexos: el botó Continuar/Finalitzar utilitza la mateixa llista de passos visibles que renderitza la pantalla. Això evita que l'Annex IV intente avançar segons la longitud dels passos ocults.
- Annex III: si s'indica que només correspon el subsidi fix de 400 €, ara és obligatori seleccionar exclusivament «No procedeix cap de les anteriors». També queda bloquejada la selecció buida, que abans podia passar sense l'avís específic.
- Es manté el bloqueig existent de l'Annex IV quan no s'ha seleccionat cap servei.
- Es mantenen els càlculs independents de PT i AL; no se sumen.

## Proves
- `node --check annex.js`
- `node --check app.js`
- `node --check rules.js`
- `node TEST_V8.js`

## Límits de la verificació
Les proves de regressió comproven el defecte de navegació a nivell de codi, la regla de subsidi fix i els càlculs de cobertura. Encara cal una prova manual de la interfície completa i una validació normativa específica de totes les regles de l'Annex III abans de considerar aquesta versió definitiva.
