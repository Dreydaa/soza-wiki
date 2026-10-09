@@ page decisions | I | 13 | Décisions et compromis | Chaque décision structurante, l'alternative écartée, la raison et le coût accepté.

| Décision | Alternative écartée | Pourquoi | Coût accepté |
| --- | --- | --- | --- |
| **QStash** pour planifier briefing et bilan | Crons Vercel | Le plan gratuit limite à 1 exécution par jour avec ±59 min d'imprécision ; QStash a une API qui permet de changer l'heure *depuis une conversation*, sans redéployer | Un service tiers de plus |
| **Webhook + file + worker** | Tout traiter dans le webhook | Un appel IA lent ne doit pas faire expirer ni rejouer le webhook | Plus de pièces mobiles |
| **Notion comme source de vérité, y compris la config** | Variables d'environnement, base dédiée | Changer l'heure du briefing et du bilan en conversation naturelle, sans toucher au déploiement | Latence et limites de l'API Notion |
| **Un bloc Notion par jour de shift** | Un évènement récurrent | L'API Notion ne gère pas la récurrence : un bloc unique s'afficherait comme un évènement continu | Beaucoup de pages créées |
| **Redis limité à l'éphémère** | Y mettre aussi l'état métier | Deux sources de vérité = divergences | Rien d'autre que du cache en Redis |
| **La pause dans Redis, pas dans Notion** | Nouvelle propriété Notion | Évite de modifier le schéma de la base de production pour un état transitoire ; expire seule 3 jours après la fin | Pas visible dans Notion |
| **Dashboard branché en dernier** | Interface d'abord | Ne pas construire une interface contre un backend mouvant : elle a tourné sur des données factices jusqu'à ce que le backend soit éprouvé | Un temps sans vraies données à l'écran |
| **Un seul fournisseur de modèle** | Garder deux fournisseurs « au cas où » | Code de branchement, dépendance et variables supprimés plutôt que laissés en jachère | Dépendance à Groq |
| **Pas de vidéo pour l'intro** | Export vidéo depuis Blender | Une vidéo qui bascule vers un canvas crée un raccord visible et n'est pas réactive | Intro codée à la main |
| **Rendu du ruban en three.js, pas depuis Blender** | Embarquer une scène Blender | Une scène Blender ne s'embarque pas comme fond d'une app Tauri ; l'équation paramétrique est plus légère et variable en temps réel | Blender ne sert qu'au prototypage |
| **Fenêtre verrouillée en 1440 ou 1920 de large** | Mise en page responsive complète | Une app de bureau n'a pas besoin d'un mode mobile ; la grille est mise à l'échelle | Pas d'usage sur petit écran |
| **Temps d'écran mesuré en Rust, gardé sur la machine** | L'envoyer à Notion ou au backend | Ce qu'on fait sur son ordinateur est une donnée sensible : elle n'a pas à quitter la machine, et un fichier local évite tout réseau | Visible seulement dans l'app, Windows uniquement |
| **Fermer la fenêtre la masque** | Quitter l'application | Le suivi et le démarrage automatique supposent une app qui reste vivante ; « Quitter » est explicite dans la zone de notification | L'app reste en mémoire |
| **Des tests sans aucun vrai service** | Tester contre les vrais Notion, Redis, Groq | Rapides (moins d'une seconde pour 263 tests), reproductibles, sans risque pour les vraies données ; tout appel réseau non prévu fait échouer le test | Un seul test (`test:live`), lancé à la main, valide les vraies APIs |

---

@@ page retraits | I | 14 | Ce qui a été retiré | Savoir retirer est autant une compétence que savoir ajouter : chaque retrait est daté et motivé.

Chaque retrait est daté et motivé dans l'état du projet (`docs/ai/STATUS.md`).

| Retiré | Date | Pourquoi et comment |
| --- | --- | --- |
| **Le « Proof of Work »** | 26/09/2026 | Preuve tangible d'une journée (lien, capture, export 3D, commit) : jugée trop lourde à l'usage, remplacée par un contrôle de cohérence conversationnel, puis supprimée. À reconsidérer en V2 seulement. |
| **Le streak** (compteur de jours consécutifs) | 30/09/2026 | Retiré *en entier*, pas seulement son affichage. La machinerie qui le justifiait (contrôle d'horaire, vérification de cohérence) est partie avec lui ; `record_progress` est redevenu un simple enregistrement ; la colonne a été supprimée de la base Notion de production plutôt que laissée morte. |
| **Le mode ACTIF/PAUSE et les deux personnalités** | 07/10/2026 | Un mode qui basculait le ton du modèle selon les horaires de travail. Retiré en entier : le module de détection, le type, le champ dans Notion et dans l'API, l'outil qui le pilotait, les composants du dashboard. L'utilisateur tenait sa cadence de travail : le mécanisme n'avait plus d'utilité pour lui, et un mécanisme inutilisé reste du code à maintenir et à tester. |
| **L'ancien dashboard plat et son code mort** | 07/10/2026 | 20 fichiers, repérés par une cartographie des imports à partir du point d'entrée plutôt qu'« à l'œil ». |
| **Les réglages de shift** | 08/10/2026 | Le code, la réponse de l'API, le type du dashboard et les colonnes Notion correspondantes, par un script de migration qui **simule d'abord** puis s'applique avec `--apply`. |
| **5 dépendances inutilisées** | 08/10/2026 | Le build du front reste identique à l'octet près. |
| **La dégradation visuelle de l'interface après un jalon manqué** | 08/10/2026 | Envisagée, puis abandonnée, hors V1 comme hors V2. Une décision explicite vaut mieux qu'une idée qui traîne dans la liste des « à faire ». |
| **Le second fournisseur de modèle** (Gemini), la refonte visuelle « éditoriale », le parallax du fond, une première version du fond en poussière à quatre couches, la mise en page mobile | 24/09 → 06/10/2026 | Essayés puis abandonnés. |

<span class="st st-repl">Retiré</span> Ne pas réintroduire le streak : c'est une décision de l'utilisateur.

---

@@ page bugs | I | 15 | Bugs et causes racines | Quinze bugs : symptôme, cause, correction, leçon.

Chaque entrée suit le même plan : **symptôme → cause → correction → leçon**.

## 1. QStash livrait vers une URL protégée

Les jobs échouaient en 401 silencieux et étaient retentés sans fin. **Cause** : ils visaient `VERCEL_URL`, l'URL propre à chaque déploiement, protégée par défaut par Vercel Deployment Protection. **Correction** : une URL fixe (`APP_URL`) pointant sur l'alias de production. *Leçon : la protection par défaut d'une plateforme est facile à oublier tant qu'on ne teste pas un vrai appel externe.*

## 2. Le décalage horaire invisible

La fenêtre « pause » (celle de l'ancien mode ACTIF/PAUSE, retiré depuis) se déclenchait avec 1 à 2 heures d'écart selon la saison. **Cause** : Vercel exécute en UTC ; `getHours()` et `toISOString()` donnaient l'heure UTC, pas celle de Paris. **Correction** : une conversion centralisée via `Intl` dans `lib/date.ts`, utilisée partout. *Leçon : ne jamais laisser chaque appelant refaire son propre calcul d'heure.*

## 3. Un `null` explicite qui fait échouer toute une action

Groq renvoie parfois `null` pour un paramètre optionnel. **Cause** : `.optional()` n'accepte que « absent ». **Correction** : `.nullish()`. *Leçon : une validation trop stricte sur la sortie d'un modèle fait échouer l'action de façon invisible au lieu de la rejeter proprement.*

## 4. Des secrets corrompus par un espace

La plupart des valeurs `.env` étaient écrites `CLE= valeur`. Sans effet en local, mais le secret poussé tel quel vers Vercel était invalide. **Correction** : retirer l'espace et repousser. *Leçon : la copie de secrets entre environnements mérite une vérification explicite.*

## 5. Un flux RSS qui dupliquait son titre

Le parsing positionnel des balises `<title>` lisait deux fois le titre du flux (répété dans un bloc `<image>`). **Correction** : isoler chaque titre à l'intérieur de sa balise `<item>`.

## 6. Un déploiement qui envoyait 1,8 Go

Le premier déploiement tentait d'envoyer `node_modules` et la cible de compilation Rust. **Correction** : un `.vercelignore`.

## 7. Le briefing qui tournait en boucle sur un ancien bilan

**Symptôme** : sans bilan la veille, le briefing du matin répétait le dernier bilan enregistré comme s'il datait d'hier. **Cause racine** : la requête renvoyait « le dernier bilan », quelle que soit sa date, et le texte envoyé au modèle disait « Hier : … ». Corriger le *prompt* n'aurait pas suffi : le modèle n'avait aucun moyen de savoir que cette information était périmée. **Correction** : la requête renvoie aussi la **date** du bilan ; le code décide si c'est « hier » ; sinon le modèle reçoit explicitement « Bilan d'hier : AUCUN, le dernier date du … » et doit le signaler. Le même correctif limite les rappels d'agenda aux 7 prochains jours avec une échéance écrite en toutes lettres, car un rendez-vous à trois semaines était présenté comme s'il avait lieu aujourd'hui. *Leçon : ne demandez pas à un modèle de déduire une absence ou une date relative ; calculez-la et donnez-lui le fait.*

## 8. Un correctif écrit n'est pas un correctif livré

Le lendemain du correctif ci-dessus, le briefing avait encore l'ancien comportement. **Cause** : les commits étaient sur une branche de travail, et la production se déploie depuis `main` ; la liste des déploiements montrait un dernier déploiement de production vieux de 7 jours. Indice décisif dans le texte lui-même : il citait un évènement à 23 jours, que le nouveau code aurait filtré. **Résolu le 07/10** : la fusion de la pull request sur `main` a déclenché un déploiement de production, observé « Ready ». *Leçon : « terminé » veut dire déployé et observé en production, pas seulement fusionné ; et un symptôme vous dit quelle version de votre code tourne.*

## 9. Un écran blanc quand le backend est plus ancien que l'app

Le front lit `eveningBriefing` dans la réponse de `/api/dashboard`. Avec un backend déployé avant l'ajout de ce champ, le composant lisait `undefined.split` et tout l'écran devenait blanc après l'heure du bilan. **Correction** : un texte de repli quand le briefing manque. *Leçon : le front et le backend se déploient séparément ; un champ absent d'une réponse ne doit jamais faire planter l'affichage.*

## 10. Des liens qui ne faisaient rien dans l'application

Sans dossier de capacités, Tauri 2 refuse toute commande de plugin (`opener.open_url not allowed`) : les liens d'articles ne faisaient rien. **Correction** : une capacité donnant à la fenêtre principale la seule permission d'ouvrir des URL `https://`. *Leçon : un refus par défaut est un choix de sécurité, pas un bug ; on accorde le minimum.*

## 11. Une trace blanche à l'ouverture d'une carte

Une carte naissait à quelques pixels de haut et recevait un reflet de bord généré à cette taille, étiré ensuite sur toute sa hauteur : des bords blancs épaissis. **Correction** : aucune carte n'est générée pendant un redimensionnement, le reflet d'une carte étirée de plus de 12 % est masqué, et la réfraction n'est appliquée qu'une fois la carte de déplacement prête. Vérifié image par image (à 120 ms, 450 ms, 800 ms, 1,6 s). *Leçon : un effet calculé à une taille n'est pas valable à une autre ; une animation se vérifie sur ses images intermédiaires, pas sur son état final.*

## 12. Un build qui échoue sur des versions décalées

`cargo add` avait monté la crate Tauri à 2.12.1 alors que les paquets npm restaient en 2.11. **Correction** : aligner les deux paquets npm sur 2.12.1. *Leçon : les dépendances jumelles côté Rust et côté JavaScript doivent suivre la même version.*

## 13. Des entités HTML visibles dans les titres d'articles

Certains flux RSS laissent `&#8216;` dans leurs titres, que React affiche tel quel. **Correction** : une fonction `decodeEntities` appliquée juste après l'extraction, qui laisse intacte une entité inconnue. *Leçon : une donnée externe se nettoie à l'entrée, pas à l'affichage.*

## 14. Une animation saccadée dans l'application installée

Le ruban avait été plafonné à 30 images/s au repos pour économiser le CPU (mesuré le 08/10 : environ 8 à 10 % d'un cœur, contre environ 140 % sans plafond), et ce réglage avait été validé sur la consommation, pas sur le ressenti. Dans l'app installée, l'animation était saccadée. **Correction appliquée le 09/10** : 60 images/s au repos. <span class="st st-prop">Non vérifié</span> à l'usage, et la cause n'est pas établie : le filtre de réfraction des 8 cartes de verre est recalculé à chaque image du canvas (coût GPU, non mesuré). *Leçon : un réglage de performance validé par une mesure de ressources peut dégrader l'expérience ; un seuil de fluidité se juge à l'œil dans l'application réelle.* **Effet de bord** : deux tests d'acceptation figeaient la valeur de 30 images/s et échouent depuis le passage à 60. *Leçon : un test qui recopie la valeur d'un réglage au lieu de la lire casse à chaque changement du réglage.*

## 15. Un prompt qui impose un mot par défaut le répète partout

Le prompt de personnalité donnait « Boss » comme appellation par défaut, et ses exemples commençaient par ce mot. **Correction** : trois surnoms alternés, jamais le même deux messages de suite, et pas de surnom dans la plupart des messages (un seul, pour saluer, marquer une remarque ou adoucir un rappel) ; la question de repli du briefing du soir n'a plus de surnom en dur. <span class="st st-prop">Non vérifié</span> : le texte réel du modèle (seul le contenu du prompt est testé). *Leçon : une valeur « par défaut » écrite dans un prompt tend à devenir un tic ; mieux vaut décrire quand l'employer.*

---

@@ page cloture-v1 | I | 16 | Clôture de la V1 | Ce qui est livré, ce qui a été vérifié le 09/10/2026, l'échec connu et ce qui ne l'est pas.

La V1 a été **déclarée terminée par l'utilisateur le 09/10/2026**, après trois semaines et 73 commits ; la V2 démarrera plus tard.

## Ce qui est livré

- **Backend en production** : webhook Telegram, worker, crons du matin et du soir (briefings rédigés par Soza), endpoint du dashboard ; 13 outils IA, une seule personnalité, pause de plusieurs jours.
- **Application de bureau** : intro en particules puis dashboard en verre, temps d'écran réel, démarrage avec Windows, zone de notification, installeur NSIS, barre de titre aux couleurs du fond.
- **Qualité** : 286 tests, deux passes d'optimisation mesurées, documentation à jour.

## Ce qui a été fait le 09/10/2026

Le ruban à 60 images/s et la barre de titre Windows 11 en `#2757D0` (PR 8), les surnoms variés (PR 9), l'installeur reconstruit et lancé par l'utilisateur (rien d'anormal constaté), et un déploiement de production après la dernière fusion (Vercel « Ready », constaté environ 3 minutes après la fusion).

## Vérifié à la clôture

| Vérification | Résultat |
| --- | --- |
| `npm test` (unitaires, intégration, régression) | <span class="st st-ok">Fait</span> 263 tests passent (22 fichiers, moins d'une seconde) |
| `tsc --noEmit` | <span class="st st-ok">Fait</span> sans erreur |
| `npm run test:acceptance` | <span class="st st-repl">Échec connu</span> 18 scénarios sur 20 passent |
| Tests Rust | <span class="st st-prop">Non vérifié</span> non rejoués ce jour-là |

## L'échec connu

Les deux tests de cadence de `tests/acceptance/performance.test.ts` figent l'ancienne cadence de 30 images/s alors que `REST_FPS` est passé à 60. « Au repos, le rendu est plafonné à environ 30 images par seconde » compte 125 images en 2 s pour moins de 75 attendues ; « pendant l'intro, pleine cadence… » dépasse son délai de 60 s. **Le code n'est pas en cause, ce sont les attentes qui sont périmées** : à corriger en lisant `REST_FPS` plutôt qu'une valeur en dur.

## Non vérifié à la clôture

Listé comme restant avant la déclaration ; sa vérification n'est pas consignée.

- <span class="st st-prop">Non vérifié</span> Démarrage automatique réel au lancement de session, menu de la zone de notification, reprise du rendu après un clic sur l'icône, suivi du temps d'écran et clics sur les blocs dans l'application installée.
- <span class="st st-prop">Non vérifié</span> `npm run test:live` : les écritures Notion avec le client 4, jamais vérifiées contre le vrai Notion.
- <span class="st st-prop">Non vérifié</span> Une passe sécurité (`/security-review`).
- <span class="st st-prop">Non vérifié</span> Quelques jours d'usage, et le premier texte réel du briefing du soir et du matin avec le nouveau code.
- <span class="st st-prop">Non vérifié</span> La cause du lag (le filtre de réfraction est suspecté, non mesuré).

## Optionnel, non fait

La catégorie Notion lue par le code (les logos restent devinés), le statut `Terminé` pour les idées (« Finis » compte aujourd'hui les idées archivées, ce qui n'est pas la même chose), un nom et un logo pour les applications inconnues du temps d'écran, le calcul des positions des particules sur le GPU.

## Limites assumées

- Les relecteurs expérimentés y regarderont en premier ; autant les dire : **la suite de tests n'est pas entièrement verte** (2 scénarios sur 20 en échec).
- **Un seul projet « En cours » à la fois** : limite choisie pour la simplicité, documentée plutôt que contournée.
- **Dépendance à des services tiers gratuits** (Vercel, QStash, Upstash, Notion, Groq) avec leurs quotas.
- **Le texte produit par le modèle n'est pas testé automatiquement** : seul le contexte qui lui est envoyé l'est.
- **Pas de limitation de débit** au-delà du filtre `chat_id`.
- **Détection des icônes par mots-clés** : fragile par construction.

## Ce que la journée de clôture enseigne

- Un réglage validé sur une mesure (le CPU) peut être mauvais à l'usage (la fluidité) ; et un test qui recopie la valeur du réglage plutôt que de la lire échoue dès qu'on le change.
- Une valeur « par défaut » écrite dans un prompt tend à se retrouver partout dans les réponses.
- Déclarer « terminé » n'efface pas la liste de ce qu'on n'a pas vérifié : la clôture l'inscrit au lieu de l'omettre.
