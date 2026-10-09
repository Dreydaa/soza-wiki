@@ page deploiement | I | 7 | Déploiement et planification | Vercel, QStash, variables d'environnement, poids des fonctions et le piège du correctif non livré.

## Hébergement

- **Vercel**, fonctions « edge » en TypeScript (durée maximale de 10 secondes par fonction, `vercel.json`).
- **La production se déploie depuis la branche `main`.** Chaque autre branche produit un déploiement « Preview », protégé par Vercel Deployment Protection : inaccessible depuis l'extérieur, donc jamais appelé par QStash.
- **`APP_URL`** est une URL fixe pointant sur l'alias de production. Les jobs QStash l'utilisent (voir [Bugs et causes racines](#bugs), bug 1).
- `.vercelignore` exclut `node_modules` et la cible de compilation Rust (le premier déploiement tentait d'envoyer 1,8 Go).

## Planification avec QStash

Le briefing du matin et le bilan du soir sont déclenchés par des **QStash Schedules** (identifiants `soza-morning-briefing` et `soza-evening-review`), pas par des crons Vercel : le plan gratuit de Vercel limite les crons à une exécution par jour avec ±59 minutes d'imprécision, et QStash a une API qui permet de changer l'heure depuis une conversation (outil `update_briefing_schedule`) sans redéployer.

Les deux endpoints de cron acceptent soit une signature QStash valide, soit le secret `CRON_SECRET` en `Bearer` (déclenchement manuel de secours).

## Variables d'environnement

Seuls les noms sont listés ; les valeurs vivent dans `.env` en local et dans la configuration Vercel.

| Groupe | Variables |
| --- | --- |
| App | `APP_URL`, `CRON_SECRET` |
| Groq | `GROQ_API_KEY`, `GROQ_MODEL` |
| Notion | `NOTION_TOKEN`, `NOTION_PARENT_PAGE_ID` (scripts de création), `NOTION_AGENDA_DATABASE_ID`, `NOTION_IDEAS_DATABASE_ID`, `NOTION_MILESTONES_DATABASE_ID`, `NOTION_PROGRESS_DATABASE_ID`, `NOTION_SETTINGS_DATABASE_ID` |
| Telegram | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_ALLOWED_CHAT_ID` |
| QStash | `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY`, `QSTASH_DEV` |
| Redis | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| Dashboard | `DASHBOARD_API_KEY` (serveur), `VITE_DASHBOARD_API_KEY` et `VITE_API_URL` (embarquées dans le build de l'application) |
| Divers | `NEWS_RSS_URL_TECH`, `NEWS_RSS_URL_FASHION`, `WEATHER_LAT`, `WEATHER_LON` |

## Poids des fonctions

Une passe d'optimisation du 08/10/2026 a allégé le backend sans changer son comportement :

- **Contexte des crons chargé une seule fois** pour les deux textes du jour : matin 3 à 2 requêtes Notion et 2 à 1 appel météo, soir 5 à 3 requêtes Notion (Notion limite à environ 3 requêtes par seconde).
- **Contrôle d'accès séparé de la validation** (`lib/auth.ts` sans Zod, `lib/validation.ts` avec) : la fonction `/api/dashboard` passe de 925 à 482 ko.
- **Zod retiré du webhook et du worker** (551 ko → 109 ko) : deux fonctions de lecture écrites à la main ont le même comportement (toute charge mal formée est ignorée), et un test d'équivalence rejoue une trentaine d'entrées contre les anciens schémas.
- **Client Notion 2.2.15 → 4.0.2** (plus de `node-fetch`) : environ 300 ko en moins par fonction qui lit Notion (`/api/dashboard` 482 → 182 ko). L'API Notion reste en `2022-06-28`. La version 5 est exclue : elle supprime `databases.query` au profit des data sources. Les lectures ont été vérifiées sur le vrai Notion ; **les écritures avec le client 4 ne sont pas citées comme vérifiées** (le test `test:live` les couvre, à lancer à la main).
- 5 dépendances inutilisées retirées (`tailwindcss`, `postcss`, `autoprefixer`, `@tauri-apps/plugin-shell`, `@ai-sdk/provider`) : le build du front est identique à l'octet près.

## Un correctif écrit n'est pas un correctif livré

Un correctif commité sur une branche de travail ne change rien en production tant qu'il n'est pas fusionné dans `main`. C'est arrivé : voir [Bugs et causes racines](#bugs), bug 8.

---

@@ page application-bureau | I | 8 | L'application de bureau | Tauri, le thread Rust de temps d'écran, la zone de notification, le démarrage automatique et l'installeur.

Application Tauri 2 (React + Vite pour l'interface, Rust pour le système), Windows uniquement. `src-tauri/src/main.rs` fait environ 166 lignes.

## Fenêtre

Fixe, 1440×1024, centrée, non redimensionnable ni maximisable (la maquette Figma, `--u` = 1). Pour une version 1920, il suffit de changer `width` et `height` dans `tauri.conf.json` : la mise en page se met à l'échelle. La barre de titre Windows 11 prend la couleur du fond (`#2757D0`) par l'API DWM ; avant Windows 11, elle garde sa couleur par défaut, sans erreur.

## Temps d'écran

Un thread Rust mesure le temps passé par application, sans rien envoyer en dehors de la machine :

1. toutes les **5 secondes**, il lit l'application au premier plan (`active-win-pos-rs`, clé = nom de l'exécutable en minuscules) ;
2. il **ignore** la machine inactive depuis 5 minutes (`user-idle`) et la fenêtre de Soza elle-même ;
3. les secondes par jour et par application restent en mémoire et sont sauvegardées toutes les **30 secondes** dans `usage.json` ;
4. la commande Tauri `app_usage` renvoie l'historique au front, qui classe les applications.

## Zone de notification et démarrage

- **Fermer la fenêtre la masque** seulement. Clic gauche sur l'icône : afficher. Clic droit : menu « Afficher Soza » / « Quitter » ; « Quitter » sauvegarde `usage.json` puis arrête l'app et le suivi.
- L'icône réutilise l'icône par défaut de la fenêtre : sans image, Windows crée une entrée invisible.
- **Démarrage avec Windows** (`tauri-plugin-autostart`, clé de registre `Run`) au premier lancement de l'app **installée** ; Windows la lance avec `--autostart` et la fenêtre est alors masquée. En développement rien n'est inscrit, sinon Windows lancerait l'exécutable de debug sans serveur de développement. Si l'utilisateur la désactive dans le Gestionnaire des tâches, ce choix est respecté.

## Visibilité de la fenêtre

Masquer la fenêtre dans la zone de notification ne change pas `document.visibilityState` : la page continuait donc de dessiner le ruban. `main.rs` émet l'évènement `soza://visibility` à chaque affichage ou masquage et expose la commande `window_visible` pour l'état de départ (démarrage automatique). La page arrête alors sa boucle de rendu (voir [L'avatar](#avatar-ruban)).

## Installeur

`npm run tauri build` produit `src-tauri/target/release/bundle/nsis/Soza_0.1.0_x64-setup.exe` : un installeur NSIS de 2,18 Mo, par utilisateur, sans droits administrateur. L'identifiant de l'application est `com.soza.assistant` (le suffixe `.app` est déconseillé sur macOS ; le dossier de données en dépend).

Le build a d'abord échoué : `cargo add` avait monté la crate `tauri` à 2.12.1 alors que les paquets npm restaient en 2.11 ; les deux ont été alignés (voir [Bugs et causes racines](#bugs), bug 12). Profil `release` : `opt-level = "s"`, LTO, `codegen-units = 1`, `strip`, `panic` laissé en `unwind` pour qu'une panique du thread de suivi n'arrête pas l'app. Résultat mesuré : exécutable de 9,75 à 6,55 Mo (−33 %).

## Sécurité de l'application

Voir [Sécurité](#securite) : politique de sécurité de contenu stricte en production et capacité d'ouverture de liens limitée à `https://`.

## Limites

Seule l'application Tauri mesure le temps d'écran (dans un navigateur le bloc affiche « — »), uniquement sous Windows, et seulement tant que Soza tourne. L'installeur a été reconstruit et lancé par l'utilisateur le 09/10/2026 sans anomalie constatée ; <span class="st st-prop">Non vérifié</span> : le démarrage automatique réel au lancement de session, le menu de la zone de notification et la reprise du rendu après un clic sur l'icône.

---

@@ page dashboard-verre | I | 9 | Le dashboard en verre | Les neuf cartes, les interactions, le calendrier, les logos, la technique du verre et les sources de données.

L'application s'ouvre sur une intro en particules, puis sur un dashboard « liquid glass » : neuf cartes de verre posées sur un fond bleu uni où le ruban de Möbius continue de tourner. Tout se pilote par la conversation Telegram ; le dashboard ne fait que lire (Notion, météo, flux RSS) et mesurer le temps d'écran.

## Disposition

Deux colonnes (736 / 544 sur la maquette Figma 1440×1024).

| Zone | Contenu |
| --- | --- |
| Gauche, haut | **Projets en cours** : logo, titre, aperçu des notes, taille, ancienneté, progression des jalons liés, prochain jalon. |
| Gauche, 4 petits blocs | Météo, Prochain jalon, Écran, compteurs de projets (Finis, En cours, Brutes). |
| Gauche, bas | **Veille** : deux colonnes Tech et Fashion, chaque titre est un lien vers l'article. |
| Droite, haut | **Briefing** du matin ou du soir selon l'heure (version courte). |
| Droite, bas | **Calendrier** : vue Mois par défaut, bascule Semaine, clic sur un jour pour son détail. |

## Interactions

- **Prochain jalon** (clic) : une carte s'ajoute sous les petits blocs avec la ligne du temps des jalons (validé vert, en retard rouge, en cours cyan, à faire gris), centrée sur « Aujourd'hui ».
- **Écran** (clic) : la même carte affiche les applications les plus utilisées, aujourd'hui ou sur 7 jours. Cliquer sur l'autre bloc change le contenu sans refermer. ✕ ou Échap referme et le bento revient à l'identique.
- Les animations respectent `prefers-reduced-motion`. `?skip` saute l'intro.

## Une grille qui s'anime sans JavaScript de mise en page

Le bento est une CSS Grid en unités `fr`. La colonne de gauche est une grille à 7 pistes : cartes en lignes 1, 3, 5 et 7, écarts en lignes 2, 4 et 6. La carte « ligne du temps » et l'écart qui la précède sont **repliés à 0** hors mode détail ; l'ouverture ne modifie que `grid-template-rows` : tout s'anime avec une transition CSS, sans calcul de position ni marge animée.

## Le « verre liquide »

Chaque carte est un panneau de verre qui **réfracte** réellement le fond :

- une **carte de déplacement** est calculée pour chaque carte à partir de sa taille et de son rayon (distance au bord d'un rectangle arrondi, normale du bord, profil de lentille convexe), puis appliquée au fond par `backdrop-filter: url(#filtre-svg)` ;
- la **dispersion chromatique** sépare les trois canaux couleur avec des intensités légèrement différentes ;
- le reflet du biseau est généré à partir des normales du bord, pas dessiné ;
- tout est exprimé dans une unité qui suit la fenêtre (`--u`), pour que la maquette reste fidèle à toute taille ;
- compromis assumé : cette technique n'existe que dans Chromium/WebView2 ; ailleurs, repli sur flou et saturation.

Les cartes remplies ont une teinte sombre pour garder le texte lisible sur les rayons clairs. Quand une carte change de taille, le reflet étiré est masqué (`data-stale`) le temps d'être régénéré (voir [Bugs et causes racines](#bugs), bug 11).

## Le calendrier et les logos

Vue mois ou semaine, navigation, détail du jour, couleurs par type d'évènement (Perso cyan, Shift ambre, Jalon violet, retard rouge), évènements passés atténués. Les logos des tâches sont devinés **par mots-clés dans le titre** (`taskIcons.ts` : une ligne par icône, la première qui correspond gagne ; logos de marque `simple-icons`, pictogrammes `lucide-react`), testés sur 28 titres types dont des faux amis (« Révision vélo », « Séance de muscu »). La version fiable existe côté données (colonne « Catégorie » dans Notion) mais n'est pas encore lue par le code.

## Sources de données

| Bloc | Source |
| --- | --- |
| Projets, jalons, agenda, compteurs | Notion, via `/api/dashboard` |
| Briefings | Texte généré par les crons, gardé dans Redis |
| Veille | Flux RSS (TechCrunch, Vogue) ; les entités HTML des titres sont décodées |
| Météo | Open-Meteo, appelée directement par l'application |
| Écran | Suivi local de l'application (`usage.json`) |

Si le backend est injoignable, le dashboard garde des données d'exemple. Un champ absent de la réponse d'un backend plus ancien que l'app ne doit pas faire planter l'affichage : un texte de repli s'affiche.

---

@@ page avatar-ruban | I | 10 | L'avatar : le ruban de Möbius | Un seul système de particules de l'intro au dashboard, le fond, et le coût du rendu.

## Un seul système de particules

Le ruban est un mesh instancié de **4 500 sphères** positionnées par l'équation paramétrique du ruban de Möbius (`particles/ribbon.ts`). L'intro n'est **pas une vidéo** : chaque particule a une position de départ (une trajectoire relevée sur la vue caméra de Blender) et une position cible sur le ruban, interpolées par un paramètre de progression. Une fois arrivé, le dashboard *est* ce même système au repos : aucun raccord vidéo → canvas.

Le calcul du ruban a été extrait dans un module partagé seulement quand un second usage (le hub statique) l'a justifié, pas avant.

## L'intro

Environ **8,4 secondes** : les particules entrent par la droite, bouclent, puis se transforment en ruban (la transformation commence vers 5,6 s) ; les cartes de verre apparaissent ensuite en cascade. Les routes `?intro` et `?hub` restent des prévisualisations du ruban seul.

## Blender et l'asset final

Blender sert au prototypage et à la documentation, pas à produire l'asset final : une scène Blender ne s'embarque pas comme fond d'une application Tauri. Le rendu final est du three.js dans le webview, plus léger et variable en temps réel.

## Le fond : de la photo à l'aplat

1. **Un shader plein écran** a d'abord été reconstruit pour reproduire une photo de référence (un éclat de rayons façon zoom radial). Plutôt que de le régler à l'œil, le profil des rayons (360 valeurs, une par degré) a été **extrait automatiquement de la photo** (centre et courbe du cœur ajustés par moindres carrés). Mesuré sur le rendu seul : **0,978 de corrélation** avec la photo, à luminosité moyenne égale. Cette approche a remplacé huit commits d'itérations à l'œil en une journée, toutes abandonnées.
2. **Puis simplifié** (07/10/2026) : avec le dashboard en verre devant, le fond est devenu un **aplat bleu `#2757D0`** et les particules des billes blanches en fil de fer. Le shader et le profil de rayons restent dans le code, désactivés par leurs valeurs.

## Coût du rendu

| Réglage | Valeur | Pourquoi |
| --- | --- | --- |
| Pause fenêtre masquée | la boucle s'arrête | Mesure (app en debug, même méthode avant et après) : 138 % d'un cœur visible et 125 % masquée → environ 10 % visible et 0,3 % masquée |
| `REST_FPS` | 60 | 30 images/s économisaient le CPU (environ 8 % mesurés) mais donnaient une animation saccadée dans l'app installée (09/10/2026) |
| `MAX_PIXEL_RATIO` | 1,5 | Plafond de résolution |
| `PARTICLE_COUNT` | 4 500 | En réduire le nombre à 3 600 ne changeait rien au CPU, donc le visuel validé est gardé |

<span class="st st-prop">Non vérifié</span> : la cause exacte de la saccade n'est pas établie ; le filtre de réfraction des cartes de verre est recalculé à chaque image du canvas (coût GPU, non mesuré). Si la saccade persiste, l'option suivante est de désactiver la réfraction (`REFRACTIVE = false` dans `glass.ts`). Le CPU à 60 images/s n'a pas été remesuré.

## Réactivité audio

<span class="st st-vision">V2</span> Le ruban doit réagir à la voix de Soza : le buffer audio de sa sortie vocale (TTS), pas le micro de l'utilisateur, passerait dans un `AnalyserNode` (Web Audio API) qui pilote les paramètres des particules. Aucune permission de micro à gérer. Rien de cela n'existe encore : Soza ne parle pas, elle écrit.

---

@@ page tests-qualite | I | 11 | Tests et qualité | Quatre familles de tests plus du Rust, ce qu'ils garantissent et ce qu'ils ne couvrent pas.

286 tests, ajoutés le 08/10/2026 en fin de V1. Vitest 5, configuration à quatre projets dans `vitest.config.ts`.

| Famille | Ce qu'elle couvre | Rapidité |
| --- | --- | --- |
| **Unitaires** | dates, lignes du briefing (bilan, agenda, journée, jalon), flux RSS, validation et accès, logos par mots-clés, classement du temps d'écran, calendrier, mémoire Redis, boucle de rendu | instantané |
| **Intégration** | webhook Telegram (secret, `chat_id`, publication dans la file), worker (signature, réponse), crons du matin et du soir, `/api/dashboard` : le vrai code tourne de bout en bout, seuls Notion, Redis, Telegram, Groq et le réseau sont simulés | instantané |
| **Régression** | un fichier par **famille de bugs déjà corrigés** : paramètres `null` de Groq, fuseau horaire, bilan périmé et rappels d'agenda, URL de livraison QStash, garde-fous fermés par défaut, requêtes Notion, champs retirés du payload, plafonds de requêtes des crons | instantané |
| **Acceptation** | 20 scénarios utilisateur dans un vrai navigateur (Playwright) sur l'app réelle avec un faux backend : dashboard complet, briefings, détail Écran, bascule Écran ↔ Jalons, liens, calendrier, backend en panne ou clé refusée, intro, pause du rendu | environ 100 s |
| **Rust** | 3 tests | — |

## Principes à retenir

- **Aucun test n'utilise le `.env` ni un vrai service** : variables factices, et tout appel réseau non prévu fait échouer le test. Un seul script, lancé à la main, appelle les vraies APIs (`npm run test:live`, la suite historique : 37 vérifications au 30/09, qui avait elle-même remplacé dix scripts ad hoc).
- **Un test de régression se vérifie en réintroduisant le bug** : l'un des tests d'acceptation a été validé en remettant l'ancien code, sur lequel il échoue bien. Un test qui ne peut pas échouer ne protège de rien.
- **Les bugs sont rangés par famille**, pas par date : chaque bug du chapitre [Bugs et causes racines](#bugs) a son garde-fou.
- La vérification de types stricte (`tsc --noEmit`) accompagne chaque étape.

## État au 09/10/2026

- <span class="st st-ok">Fait</span> **263 tests rapides passent** (22 fichiers, moins d'une seconde) ; `tsc --noEmit` sans erreur.
- <span class="st st-repl">Échec connu</span> **18 scénarios d'acceptation sur 20 passent.** Les deux tests de cadence de `tests/acceptance/performance.test.ts` figent l'ancienne cadence de 30 images/s alors que `REST_FPS` est passé à 60 : l'un compte 125 images en 2 s pour moins de 75 attendues, l'autre dépasse son délai de 60 s (cause non analysée, vraisemblablement la même attente). Le code est juste, les attentes sont périmées : la correction (lire `REST_FPS` au lieu d'une valeur en dur) n'est pas faite.
- Les 3 tests Rust sont repris de l'état du projet sans avoir été rejoués ce jour-là.

## Ce que les tests ne couvrent pas

Le suivi réel de la fenêtre active (il dépend du système d'exploitation), le rendu visuel du verre et des particules (WebGL logiciel), le menu de la zone de notification et le démarrage automatique (visibles seulement dans l'application installée), et **le texte produit par le modèle** : seul le contexte qui lui est envoyé est testé.

## Commandes

Voir [Commandes et variables](#commandes) : `npm test`, `npm run test:acceptance`, `npm run test:rust`, `npm run test:all`, `npm run test:live`.

---

@@ page securite | I | 12 | Sécurité | Les barrières du webhook, des crons et du dashboard, la politique de contenu de l'application et les limites assumées.

## Le webhook Telegram : trois barrières successives

1. la méthode doit être **POST** ;
2. un **secret partagé** doit figurer dans l'en-tête `x-telegram-bot-api-secret-token` ;
3. le **`chat_id`** doit être celui de l'utilisateur autorisé.

Un message d'un autre utilisateur reçoit une réponse « ignoré » sans aucune action ni erreur révélatrice. La charge est lue par une fonction écrite à la main (plus de Zod dans le webhook) qui ignore toute entrée mal formée ; un test d'équivalence la compare aux anciens schémas.

## Les crons et le worker

Les endpoints de cron exigent une signature QStash valide, ou le secret `CRON_SECRET` en `Bearer` pour un déclenchement manuel. Le worker vérifie la signature QStash du job. Les contrôles d'accès sont **fermés par défaut** (une famille de tests de régression les couvre).

## L'endpoint du dashboard

Protégé par une clé dans l'en-tête `x-dashboard-key`. **Compromis assumé** : la clé est embarquée dans le build de l'application (variable `VITE_DASHBOARD_API_KEY`), ce qui est acceptable en usage mono-utilisateur mais ne le serait pas pour un produit public.

## L'application de bureau

- **Politique de sécurité de contenu (CSP) stricte en production**, limitée à l'application, à l'API de production, au service météo et à la communication interne de Tauri ; un appel vers un autre site est bloqué (vérifié). Elle est un peu élargie en développement (script de rafraîchissement de Vite). `style-src 'unsafe-inline'` est indispensable : React pose des styles en ligne (variables CSS du verre).
- **L'ouverture de liens est une permission explicite** : sans dossier de capacités, Tauri 2 refuse toute commande de plugin ; une capacité donne à la fenêtre principale la seule permission d'ouvrir des URL `https://`.
- Si l'URL de l'API ou un nouveau service externe est ajouté, il faut l'ajouter à `connect-src` dans les deux politiques.

## Données personnelles

Le temps d'écran, qui révèle ce qu'on fait sur son ordinateur, reste sur la machine dans un fichier local ; rien n'est envoyé en ligne.

## Limites

- **Pas de limitation de débit** au-delà du filtre `chat_id` : risque faible en usage à un utilisateur, à traiter si le bot devient accessible à d'autres.
- <span class="st st-prop">Non vérifié</span> **Une passe sécurité** (`/security-review`) n'a pas été consignée avant la clôture de la V1.
- Une clé de dashboard embarquée dans un binaire est lisible par quiconque obtient le binaire (voir plus haut).
