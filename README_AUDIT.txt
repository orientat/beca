ASSISTENT BEQUES NESE 2026-2027 — V7
AUDITORIA ANNEX IV ↔ ANNEX VI

Canvis V5.12
- Annex VI ampliat amb identificació del professional/servei: nom, registre/col·legiació, NIF, professió/especialitat, centre/gabinet i CIF si escau.
- Annex VI incorpora servei certificat, import mensual, memòria, hores setmanals, duració i declaració responsable de qualificació quan correspon.
- Annex VI incorpora control sobre si el servei es prestarà efectivament; si no es prestarà, l’assistent obliga a deixar constància que cal comunicar-ho a la unitat de beques.
- Annex VI compara, quan existeix la revisió guardada de l’Annex IV, servei, hores setmanals i duració.
- Annex IV reforça els requisits de reeducació: insuficiència de recursos del centre i inviabilitat de matriculació, a més d’Inspecció, memòria, qualificació i resta de comprovacions.
- Annex IV obliga a confirmar la revisió quantitativa, narrativa, coherència amb Annex II/III i preparació per a la signatura de l’orientació.
- Corregit un error de l’àmbit de la variable de reeducació en el resum final de l’Annex IV.

Responsabilitats
- Annex IV: orientació educativa; es prepara per a la signatura de l’orientació.
- Annex V: Inspecció, només en reeducació pedagògica/del llenguatge.
- Annex VI: professional/reeducador, gabinet o centre prestador; es prepara per a la seua signatura.

Proves executades
- Annex VI vàlid: completat.
- Annex VI amb hores diferents de l’Annex IV: bloquejat.
- Annex IV amb cobertura del 100 %: alerta crítica.
- Annex IV sense acreditar insuficiència del centre: bloquejat.
- Annex IV sense acreditar inviabilitat de matriculació: bloquejat.
- Annex VI amb servei que no es prestarà: alerta/bloqueig documental.
- node --check: OK.

NO pujar encara a GitHub. Aquesta és una versió de desenvolupament/prova.

ACTUALITZACIÓ V5.13 — CALCULADORA ANNEX IV
- PT i AL es tracten com a conceptes diferents i NO se sumen.
- La cobertura de reeducació pedagògica es calcula separadament a partir de PT real del centre.
- La cobertura de reeducació del llenguatge es calcula separadament a partir d'AL real del centre.
- El nombre de sessions/setmana i els minuts reals per sessió són dades introduïdes per l'orientació.
- No s'assumeix que totes les sessions duren 45 minuts; 45 és només el valor inicial de la calculadora i es pot modificar.
- El càlcul és: sessions/setmana × minuts/sessió = minuts/setmana del centre; després minuts/60 = hores; i hores del centre / hores necessàries × 100.
- No es fa cap suma PT+AL per obtindre un percentatge únic.
- La cobertura del 100 % o superior activa l'alerta crítica prevista per al circuit de reeducació externa.
- La normativa i les instruccions oficials prevalen sobre qualsevol valor predeterminat de la calculadora.

V6 — AUDITORIA TRANSVERSAL I CORRECCIÓ IV ↔ VI
- PT i AL mantenen sempre circuits de càlcul independents; no es genera cap percentatge global PT+AL.
- Annex IV: les hores necessàries es guarden separadament per reeducació pedagògica, reeducació del llenguatge i programa AACC.
- Annex IV: la cobertura es calcula amb sessions reals × minuts reals de PT o AL, i es compara només amb la necessitat del mateix tipus.
- Annex IV: la validació del 100 % es fa per separat per PT i AL.
- Annex VI: les hores setmanals del servei es demanen separadament per pedagogia, llenguatge i AACC.
- Annex VI: la comprovació de coherència amb Annex IV compara cada servei amb la seua pròpia necessitat horària.
- Annex IV i VI: en un cas amb pedagogia + llenguatge, els dos serveis poden coexistir en un únic Annex VI quan els presta el mateix professional/servei, però les hores es mantenen separades.
- Annex IV: el programa específic d’AACC també té un camp propi d’hores setmanals necessàries.
- La numeració pública d’aquesta versió és V6. Les versions següents seran V7, V8...


V7 — QA transversal
- Afegida bateria de casos simulats a QA_CASES.md.
- Afegides proves matemàtiques TEST_V7.js per verificar que PT i AL es calculen sempre per separat.
- Casos de prova: pedagògica parcial, llenguatge parcial, doble servei, cobertura 100 %, AACC, discrepància IV↔VI i manca d’acreditació de recursos.
