@@ page chronologie | II | A | Chronologie | Du premier commit à la clôture de la V1, puis la V2 en cours.

73 commits entre le 16/09/2026 et le 09/10/2026. Le 30/09/2026 compte 12 commits dont 8 pour trouver le fond de l'intro.

| Période | Étape | Ce qui s'est passé |
| --- | --- | --- |
| 16 → 22/09 | **Preuve de concept locale** | Telegram → modèle → Notion en local ; mémoire de conversation dans Redis ; briefing du matin ; deux fournisseurs de modèle branchés pour se prémunir d'un quota. |
| 23 → 24/09 | **Mise en production** | Déploiement Vercel et ses pièges (URL protégée, secrets corrompus) ; horaires et mode pilotables en conversation ; synthèse IA des idées ; heure des rendez-vous et plannings de shifts ; correction du décalage horaire UTC ; retrait de Gemini. |
| 26 → 30/09 | **Simplification du produit** | Le « Proof of Work » est remplacé par un contrôle de cohérence, puis le streak est retiré en entier ; le dashboard est ramené à une page plate pour repartir d'une maquette Figma. |
| 28/09 → 01/10 | **L'avatar** | Intro en particules (entrée, boucle, transformation en ruban de Möbius) ; hub statique ; fond en shader reconstruit à partir d'une photo de référence ; ombre, glow, rendu hologramme. |
| 30/09 | **Dashboard branché** | Endpoint agrégé `api/dashboard.ts` ; le front passe des données factices aux vraies données Notion. |
| 06/10 | **Dashboard en verre et correctifs** | Disposition « bento » de la maquette, calendrier, blocs, frise des jalons ; correctif du briefing (bilan manquant, rappels d'agenda) ; pauses de plusieurs jours. |
| 07/10 | **Une seule personnalité, dashboard par défaut, mise en ligne** | Les deux personnalités sont fusionnées (« Friday »), le mode ACTIF/PAUSE est retiré, le dashboard en verre devient la page d'accueil, le fond passe à un aplat bleu ; la fusion sur `main` déclenche le déploiement qui met en ligne les correctifs de la veille. |
| 08/10 | **Une application qui s'installe, qui mesure et qui se teste** | Bloc « Écran » réel (thread Rust), démarrage automatique et zone de notification, installeur Windows, briefing du soir rédigé par Soza, colonnes Notion obsolètes supprimées, 52 idées catégorisées, 286 tests, passe d'optimisation mesurée. |
| 09/10 | **Fin de la V1** | Ruban à 60 images/s, barre de titre colorée, surnoms variés, installeur reconstruit et lancé, V1 déclarée terminée. |
| 12/10 | **Quatre étapes de finition** | Tests de cadence corrigés ; statut `Terminé`, catégorie Notion et applications inconnues ; pause de plusieurs jours dans le dashboard ; lag mesuré puis réfraction du verre coupée. PR #12 à #15. |
| 13 → 17/10 | **V2 : étapes 4 à 8** | Barre `Ctrl+K` pour ouvrir et fermer des applications (liste blanche locale, fermeture douce) ; recherche web de Soza avec repli ; volume, musique et batterie de la souris ; plusieurs projets en parallèle ; moteur de protocoles et premier protocole. Entre-temps : surnoms tirés par le code, « demain » du bilan recopié au briefing corrigé. PR #17 à #23. |
| à partir de 30/09 | **V2 cadrée** | Assistant vocal local, protocoles, puis (06/10) gestes de la main : documenté ; étapes 0 à 8 faites au 17/10 (la 8 côté code seulement), étapes 9 à 12 pas commencées. Le premier chantier (personnalité unique) a été fait le 07/10, en fin de V1. |

---

@@ page vision-v2 | II | B | Vision V2 | Une seule personnalité, un agent local sur la machine, deux canaux d'entrée, un raisonnement qui reste dans le cloud.

<span class="st st-vision">V2</span> Rien de cette annexe n'est implémenté (hors mention contraire). La V1 est terminée ; la V2 a démarré le 12/10/2026 : ses étapes 0 à 8 sont faites ou livrées (voir [Avancement de la V2](#avancement-v2)), les étapes 9 à 12 (voix, agent résident et widget, « qu'est-ce que je regarde ? », gestes de la main) ne sont pas commencées.

## Pourquoi cette direction

Le 30/09/2026, l'utilisateur tenait sa cadence de travail (au moins une session par jour) et sentait que le cadrage « coach de discipline et de fatigue » était moins nécessaire que prévu : la difficulté est de *tenir* la discipline plus que de la *construire*, et il la tenait. La direction retenue rapproche Soza d'un assistant du type **FRIDAY** (l'IA de Tony Stark) : une seule personnalité, des fonctionnalités qui servent l'utilisateur directement plutôt qu'un rôle de coach.

## Principe : local plutôt que cloud

La V1 est entièrement cloud (Vercel, Notion, Telegram). La V2 penche vers le **local** : Notion reste la source de vérité pour ce qui doit rester accessible à distance (suivi de projet, agenda) ; le reste (réglages, défauts, logique d'action sur la machine) vit en local, sur le PC. Cela exige un **agent résident local**, probablement intégré à l'application Tauri existante côté Rust : rien de ce qui suit (contrôle d'applications, volume, périphériques) ne peut tourner sur l'infrastructure Vercel, qui n'a aucun accès à la machine. **Les fondations existent déjà** (thread Rust résident, zone de notification, démarrage avec Windows, installeur).

## Un système hybride, pas une IA locale complète

- Le **mot d'activation** et l'**exécution des actions** sur la machine sont locaux par nécessité (accès au système).
- Le **raisonnement** (comprendre la demande, décider quoi faire) reste dans le cloud via Groq comme en V1. Faire tourner un modèle de langage complet en local est explicitement écarté pour l'instant.
- Les **commandes simples** sont reconnues en local, sans aller-retour réseau, pour la rapidité et le fonctionnement hors connexion.
- Une phrase ambiguë mais qui a un **défaut configuré** reste locale : « mets de la musique » n'a pas besoin du cloud si une application par défaut est déjà configurée. Ces défauts par catégorie vivent dans un **fichier de configuration purement local**, pas dans Notion.
- Seules les demandes vraiment ouvertes (recherche au contenu imprévisible, description d'écran) passent par le cloud.

## Deux canaux d'entrée, puis un troisième

- **Local, par la voix** : pour tout ce qui suppose d'être devant le PC allumé.
- **Distant, par Telegram** : le canal existant, inchangé, avec en plus des commandes à effet réel (les « protocoles »). Un protocole qui démarre un PC éteint ne peut pas passer par la voix locale, puisque le micro est éteint avec la machine.
- **Les gestes de la main** filmés par la caméra : un troisième canal d'entrée local, par le même agent.

## Démarrage de l'écoute locale

Elle commence en mode « application ouverte » (le processus Tauri tourne ; une fenêtre minimisée en widget compte comme ouverte, puisque minimiser ne tue pas le processus). Le mode « toujours active, même application fermée » vient après la validation des fonctions vocales de base. L'ordre de test voulu : valider l'écoute et les actions d'abord (retour visuel ou texte sur le ruban), brancher la vraie voix de sortie ensuite.

---

@@ page avancement-v2 | II | C | Avancement de la V2 | Étapes 0 à 8 faites entre le 12 et le 17/10/2026 : ce qui est fait, vérifié ou non, et la suite.

La V2 avance en 13 étapes, **du plus simple au plus dur**, une pull request par étape. Source : `docs/ai/STATUS-V2.md` du dépôt, qui fait foi. Chaque étape dit ce qui a été **essayé pour de vrai** et ce qui ne l'a été que dans des tests simulés.

| # | Étape | Statut |
| --- | --- | --- |
| 0 | Tests de cadence remis au vert | <span class="st st-ok">Fait</span> |
| 1 | Statut `Terminé`, catégorie Notion, applications inconnues | <span class="st st-ok">Fait</span> |
| 2 | Pause de plusieurs jours visible dans le dashboard | <span class="st st-ok">Fait</span> |
| 3 | Cause du lag trouvée, réfraction du verre coupée | <span class="st st-ok">Fait</span> |
| 4 | Ouvrir et fermer une application nommée | <span class="st st-ok">Fait</span> validé par l'utilisateur |
| 5 | Recherche web de Soza | <span class="st st-ok">Fait</span> sur le vrai modèle ; <span class="st st-prop">Non vérifié</span> sur Telegram |
| 6 | Volume, musique, batterie de la souris | <span class="st st-ok">Fait</span> essayés sur la vraie machine |
| 7 | Plusieurs projets en parallèle | <span class="st st-ok">Fait</span> confirmé par l'utilisateur |
| 8 | Moteur de protocoles | <span class="st st-ok">Fait</span> côté code ; <span class="st st-prop">Non vérifié</span> essai réel |
| 9 à 12 | Voix, agent résident et widget, « qu'est-ce que je regarde ? », gestes de la main | <span class="st st-vision">V2</span> |

## Étape 4 : ouvrir et fermer une application

- **Entrée** : une barre de commande, `Ctrl+K` pour l'ouvrir, `Échap` pour la fermer, seulement dans l'application de bureau. Position validée par l'utilisateur : elle recouvre un peu le bas des cartes.
- **Reconnaissance locale, sans réseau** : un verbe puis le nom, articles ignorés (« ferme mon éditeur »).
- **Liste blanche** : un fichier `apps.json` local (nom → chemin), relu à chaque commande. Rien d'autre ne peut être lancé ni fermé ; un nom inconnu, une phrase non reconnue, un chemin complet ou un enchaînement de commandes sont refusés (vérifié : aucun processus d'interpréteur de commandes n'est créé).
- **Fermeture douce** (décidée) : l'application peut proposer d'enregistrer, rien n'est forcé. Confirmé par l'utilisateur sur un logiciel de modélisation avec des changements non enregistrés.
- **Défaut trouvé pendant les essais** : un octet d'ordre (BOM) en tête du fichier, ajouté par certains éditeurs, vidait la liste ; corrigé et testé.
- **Limites** : ouvrir une application déjà ouverte en lance parfois une seconde instance ; fermer une application sans fenêtre échoue ; le raccourci n'est pas couvert par un test d'acceptation (le navigateur de test n'a pas Tauri).

## Étape 5 : recherche web

- **Outil** : la recherche intégrée du fournisseur du modèle, sans clé ni service en plus. Le modèle décide seul de s'en servir ; une consigne la réserve aux questions extérieures ou récentes.
- **Réponse faite pour être lue** : deux ou trois phrases, sans liste ni lien ; les marques de citation sont retirées par le code.
- **Coût mesuré** : une recherche coûte 19 000 à 41 000 jetons d'entrée contre environ 3 700 sans. Le quota quotidien (200 000 jetons, 8 000 par minute) est partagé avec les briefings : une batterie de 28 cas contre le vrai modèle l'a épuisé dès le premier passage.
- **Échec intermittent** : le fournisseur a rejeté l'appel de l'outil dans un essai, ce qui laissait Telegram sans réponse. Correctif : un second essai sans la recherche, seulement si aucun outil d'écriture n'a déjà tourné. Testé avec des simulations ; le rejet réel n'a pas pu être reproduit.
- **Exactitude** : pas de recherche pour une capitale, un calcul, la date ou l'agenda ; « Cherche ça » demande une précision ; un événement futur n'est pas inventé ; la météo donnée par la recherche était probablement fausse dans un essai.
- <span class="st st-prop">Non vérifié</span> Un vrai message Telegram ; la latence réelle (les mesures de la batterie sont faussées par des relances après des erreurs de quota) ; la fiabilité des sources.

## Étape 6 : volume, musique, batterie

- **Volume** : la même échelle que le curseur de la barre des tâches ; régler un volume lève aussi le mode muet.
- **Musique** : les commandes multimédia de Windows, donc le lecteur actif quel qu'il soit. « Pause » est un vrai ordre pause, pas une bascule. « Mets de la musique » lance le lecteur s'il n'est pas ouvert, puis attend qu'il apparaisse.
- **Un morceau par son nom** : cherché par l'API web du service de musique (identifiants dans un fichier local, application gratuite), puis lancé par une adresse précise. Vérifié de bout en bout avec les vrais identifiants de l'utilisateur sur un morceau. Sans identifiants, la recherche s'ouvre dans le lecteur sans lire.
- **Batterie de la souris** : Windows ne l'expose pas pour cette souris ; seule une fonction du protocole propriétaire du fabricant la donne, lue en lecture seule (34 % lus, non comparés au logiciel du fabricant). Une autre souris pourrait répondre « batterie non exposée ».
- **Défaut trouvé et corrigé** : juste après la fermeture d'un lecteur, Windows répond un instant « serveur non disponible » ; la lecture réessaie pendant quelques secondes.
- **Limite connue** : « mets » suivi d'un titre contenant le mot « son » ou « volume » est pris pour une commande de volume.

## Étape 7 : plusieurs projets en parallèle

- **Constat** : la limite d'un seul projet « En cours » n'existait déjà plus dans le code. Restait à décider ce que font le bilan et les briefings. Choix de l'utilisateur : le bilan reste un texte (aucune colonne Notion ajoutée) et le soir donne **un jalon par projet**.
- **Bilan** : `record_progress` reçoit la liste des projets sur lesquels l'utilisateur a avancé, écrite en tête du texte ; les noms sont rapprochés des vrais titres par le code (le modèle ne les connaît pas exactement).
- **Briefings** : le soir cite le prochain jalon de chaque projet en cours (trois au maximum, le plus urgent d'abord) et demande sur lesquels l'utilisateur a avancé ; le matin les cite en une phrase.
- **Batterie contre le vrai modèle** : 7 scénarios de briefing corrects. Elle a trouvé un défaut que les tests simulés ne voyaient pas : avec le champ nommé `projects`, le modèle l'omettait une fois sur deux ; renommé `projectsWorkedOn`, il l'a renseigné six fois sur six. **Défaut résiduel, non corrigé** : sur un projet explicitement « pas touché », il le liste encore une fois sur trois.
- <span class="st st-prop">Non vérifié</span> Un vrai briefing Telegram avec plusieurs projets ; le vrai Notion n'avait qu'un jalon, non lié, donc le chemin « un jalon par projet » n'a été vu que sur des données simulées. L'utilisateur a toutefois confirmé en réel, le 17/10/2026, que le bilan, le briefing Telegram et les jalons fonctionnent.

## Étape 8 : moteur de protocoles (premier lot)

- **Décisions** : le PC va chercher ses étapes (il interroge le backend, aucun port n'est ouvert) ; l'allumage du PC par Soza est écarté (l'utilisateur le démarre avec l'application de sa prise connectée) ; premier lot = moteur, déclencheur strict et un premier protocole.
- **Déclencheur** : le message entier `Protocole <code>` avec un code connu ; une phrase libre qui contient « protocole » reste au modèle. Le worker l'exécute avant le modèle, jamais le webhook.
- **Déroulé** : message de début sur Telegram, protocole mis en attente dans Redis (15 minutes), le PC l'attrape (toutes les 30 secondes), exécute chaque étape et renvoie son statut, message de fin (« terminé » ou la liste des étapes en échec avec leur raison). Remis une seule fois au PC.
- **Délai** : un job différé de 10 minutes prévient sur Telegram si le PC n'a jamais répondu.
- **Le premier protocole** ouvre un outil de bureau à distance puis un éditeur de code ; deux autres sont reconnus mais sans étapes (leur contenu n'est pas défini). Le « mode travail » n'a pas de définition dans la spécification : non implémenté.
- **Coût Redis** : l'application interroge toutes les 30 secondes, environ 2 900 lectures par jour ; à surveiller sur le palier gratuit.
- <span class="st st-prop">Non vérifié</span> Tout ce qui touche au vrai PC et au vrai Telegram : la boucle contre le vrai backend et le lancement réel des applications n'ont pas été essayés (tests avec faux Redis et faux Telegram seulement). Le backend de cette étape est déployé (GitHub marque le déploiement de production « success » ; l'état détaillé côté hébergeur n'a pas été consulté).
- **Limites** : un seul protocole en cours à la fois ; l'ouverture est jugée réussie quand le processus démarre, sans vérifier qu'une fenêtre est apparue ; un protocole commencé avec un PC éteint n'est repris que quand l'application démarre avec Windows.

## Ce qui reste ouvert

Le démarrage automatique réel et le menu de la zone de notification dans l'app installée ; la passe sécurité sur le code réel ; les textes réels des briefings avec le code actuel ; l'essai réel d'un protocole ; la définition des deux autres protocoles ; puis les étapes 9 à 12.

---

@@ page chantiers-v2 | II | D | Les chantiers de la V2 | Les neuf chantiers cadrés, leur statut et leurs décisions déjà prises.

| # | Chantier | Statut |
| --- | --- | --- |
| 1 | Une seule personnalité, retrait du mode ACTIF/PAUSE | <span class="st st-ok">Fait</span> le 07/10/2026 |
| 2 | Système de protocoles | Premier lot fait le 17/10/2026 (côté code), <span class="st st-prop">Non vérifié</span> en réel |
| 3 | Fonctionnalités vocales | Applications, recherche, musique, volume et batterie faits (sans la voix, depuis la barre `Ctrl+K` et Telegram) ; la voix elle-même : <span class="st st-vision">V2</span> |
| 4 | Pauses de plusieurs jours | <span class="st st-ok">Fait</span> en version minimale le 06/10/2026, affichée dans le dashboard le 12/10/2026 |
| 5 | Widget en barre des tâches, app fermée | Fondations faites, <span class="st st-vision">V2</span> pour le reste |
| 6 | Optimisation du code et du dossier | Trois passes mesurées faites (la dernière le 12/10/2026), le reste laissé volontairement |
| 7 | Plusieurs projets « En cours » en même temps | <span class="st st-ok">Fait</span> le 15/10/2026 |
| 8 | Documentation pour le portfolio | En cours (ce wiki en fait partie) |
| 9 | Gestes de la main par caméra | <span class="st st-vision">V2</span> |

## 2. Protocoles

Un protocole est une **séquence nommée d'actions** (lancer une application, en fermer une, appeler une API externe). Un moteur générique unique vaut mieux que du code par protocole, la liste devant grandir.

- **Détection stricte** d'une phrase-clé exacte envoyée sur Telegram, jamais une recherche de mot-clé dans une phrase libre, pour qu'un message qui *parle* d'un protocole ne le déclenche pas. Le principe existait avec l'ancienne commande `/mode` (regex ancrée qui court-circuitait le modèle) ; elle a disparu avec le mode ACTIF/PAUSE et **a été réintroduite le 17/10/2026** (message entier exigé, code connu seulement, exécution par le worker avant le modèle).
- **Rendu** : une phrase de début, puis une phrase de fin une fois toutes les étapes terminées (pas de message par étape) ; générique si tout a réussi, avec le détail de l'étape qui a échoué sinon. Cela implique que chaque étape vérifie et remonte son propre statut.
- Exemples cadrés : démarrer un PC à distance (réveil par prise connectée ou par le réseau, puis lancement d'outils de jeu à distance) ; démarrer un PC et ouvrir un environnement de travail pour travailler à distance. Un même outil de bureau à distance sert à deux protocoles : une dépendance partagée, un argument de plus pour le moteur générique.
- **Sécurité traitée d'abord** : exécuter des actions sur une machine réelle depuis une commande à distance est sensible ; le modèle de menace est posé avant le code.

## 3. Fonctionnalités vocales

- **Mot d'activation** : « Soza », réponse courte. Moteur choisi : **openWakeWord** (open source, local, gratuit, sans limite d'usage), plutôt que Picovoice Porcupine (commercial, plus simple à configurer, mais dépendance à un service tiers même si l'inférence tourne en local). Entraînement par **génération synthétique** (notebook fourni : voix de synthèse variées, bruit, hauteur, vitesse, réverbération simulés) plutôt que par enregistrements répétés de sa propre voix ; inférence prévue en Rust (ONNX Runtime) pour s'intégrer à l'agent local.
- **Ordre de test**, du plus simple au plus dur : 1) lancer et fermer une application nommée ; 2) recherche rapide parlée ; 3) « qu'est-ce que je suis en train de regarder ? » (captures d'écran répétées et modèle avec vision : le plus lourd et le plus sensible côté vie privée, donc en dernier).
- Musique, volume, batterie d'un périphérique : trois intégrations isolées au niveau système ; la batterie d'une souris dépend entièrement du fabricant.

## 4. Pauses de plusieurs jours

Faite en version minimale (voir [Briefings et pause](#briefings-pause)). **Affichée dans le dashboard depuis le 12/10/2026** ; la persistance dans Notion a été écartée (Redis suffit pour l'affichage).

## 5. Widget en barre des tâches, application fermée

Fondations faites en V1 (thread Rust résident, icône de zone de notification, démarrage avec Windows, installeur). Reste : l'écoute vocale en arrière-plan et le widget animé.

## 6. Optimisation

Première passe mesurée faite (voir [Déploiement](#deploiement) et [L'avatar](#avatar-ruban)). Restent, car elles changent le visuel ou le comportement : un rendu plus léger, retirer Zod du dernier endroit où il pèse, découper le chunk JavaScript du front (716 ko dont 482 ko de three.js, peu d'intérêt dans une application locale).

## 7. Plusieurs projets en même temps

**Fait le 15/10/2026** : la limite d'un seul projet « En cours » n'existait déjà plus dans le code ; le bilan reçoit la liste des projets travaillés (texte, sans colonne Notion), le soir donne le prochain jalon de chaque projet, le matin les cite. Voir [Avancement de la V2](#avancement-v2), étape 7.

## 9. Gestes de la main par caméra

Surdev assumé par l'utilisateur : un défi personnel pour construire l'agent qu'il veut vraiment, plus proche de Jarvis/FRIDAY.

- **Prérequis : un détecteur de mains avec rendu de contrôle**, avant toute action : un point par articulation (21 par main), un bâton par doigt, un carré par main, la gauche et la droite distinguées ; le but est de voir en direct si le suivi est fiable (les deux mains identifiées en continu, gauche et droite qui ne s'inversent pas malgré l'image miroir de la webcam, tenue quand un doigt se cache).
- Suivi **en local** dans le webview (aucune image ne quitte la machine) ; règles simples sur les points (pincement, paume ouverte qui glisse, poing fermé) puis table de correspondance dans la configuration locale, **sans modèle de langage**.
- **Actions de départ** : défiler une page, zoomer sur différents documents ou applications, déplacer une fenêtre d'un écran à l'autre, gérer le son. Le zoom demande un **profil par application** (Blender, un logiciel graphique, un lecteur PDF réagissent chacun à leurs propres raccourcis).
- **Nombre de mains** : une seule suffit pour la plupart des gestes ; le **zoom** utilise les deux (dos des mains face à face et écartement = zoom avant ; paumes face à face et rapprochement = zoom arrière). Quantité de zoom **proportionnelle** à l'écartement, avec un comportement de **cliquet** : dans une pose donnée, seul le mouvement dans le sens du geste compte, le retour est ignoré et la distance de référence est recalée.
- **Risques** : déclenchements involontaires (il faudra un geste d'armement explicite), applications lancées en administrateur (Windows refuse l'injection d'entrées), position de la webcam et éclairage, coût CPU/GPU d'une caméra qui regarde en continu.

---

@@ page commandes | II | E | Commandes et variables | Les commandes npm, les scripts de configuration et les variables d'environnement.

## Développement et build

| Commande | Effet |
| --- | --- |
| `npm run dev` | Dashboard en développement (Vite, port 1420) |
| `npm run build` | `tsc --noEmit` puis build Vite |
| `npm run tauri dev` | Application de bureau en développement |
| `npm run tauri build` | Installeur Windows (`src-tauri/target/release/bundle/nsis/`) |

`tauri dev` relance `npm run dev` : un serveur Vite déjà ouvert sur le port 1420 fait échouer le démarrage. Un build de production parallèle doit utiliser un autre `CARGO_TARGET_DIR` (l'exécutable de développement est verrouillé tant qu'il tourne).

## Tests

| Commande | Effet |
| --- | --- |
| `npm test` | Tests rapides : unitaires + intégration + régression (moins d'une seconde) |
| `npm run test:acceptance` | Scénarios dans un vrai navigateur (environ 100 s) |
| `npm run test:rust` | Tests Rust |
| `npm run test:all` | Tout enchaîner |
| `npm run test:live` | Test contre les vraies APIs (à lancer à la main) |
| `npm run test:search` | Batterie de la recherche web contre le vrai modèle (28 cas, 160 000 à 220 000 jetons : une fois par jour au plus) |
| `npm run test:projects` | Batterie des briefings multi-projets contre le vrai modèle (Notion et Redis simulés ; même réserve de quota) |

## Notion et QStash

| Commande | Effet |
| --- | --- |
| `npm run notion:check` | Vérifie la connexion Notion |
| `npm run notion:create` | Crée les bases Notion |
| `npm run notion:create-settings` | Crée la base Réglages |
| `npm run notion:categories-cleanup` | Simule la migration (ajout de « Catégorie », suppression des colonnes obsolètes) ; avec `-- --apply`, l'applique |
| `npm run notion:migrate-agenda-type` | Migration du champ Type de l'agenda |
| `npm run qstash:setup-schedules` | Configure les schedules QStash (briefing et bilan) |

## Routes de l'application

| Route | Contenu |
| --- | --- |
| *(aucun paramètre)* | Intro puis dashboard en verre (page d'accueil de l'app Tauri) |
| `?skip` | Saute l'intro |
| `?intro` | Prévisualisation de l'intro seule |
| `?hub` | Prévisualisation du ruban seul |

## Variables d'environnement

Voir le tableau du chapitre [Déploiement et planification](#deploiement).

---

@@ page glossaire | II | F | Glossaire | Les termes techniques utilisés dans ce wiki.

| Terme | Définition |
| --- | --- |
| **Bento** | Disposition en cartes de tailles variées, comme les compartiments d'une boîte-repas. |
| **`chat_id`** | Identifiant d'une conversation Telegram ; seul celui de l'utilisateur autorisé est accepté. |
| **Cron** | Déclenchement planifié d'une fonction à heure fixe. |
| **CSP** | Politique de sécurité de contenu : liste des origines que la page a le droit de contacter. |
| **DWM** | Gestionnaire de fenêtres de Windows ; il permet de colorer la barre de titre (Windows 11). |
| **Edge (runtime)** | Environnement d'exécution léger de Vercel pour les fonctions. |
| **Friday** | Nom de la personnalité unique de Soza (efficacité tactique et finesse de conseil). |
| **Idempotent** | Qui peut être exécuté plusieurs fois avec le même résultat. |
| **NSIS** | Format d'installeur Windows produit par Tauri. |
| **QStash** | Service de file de messages et de planification (Upstash) : livre les jobs au worker et déclenche les crons. |
| **Redis (TTL)** | Base clé-valeur en mémoire ; une clé peut expirer seule après une durée de vie (TTL). |
| **`REST_FPS`** | Cadence du rendu une fois le ruban formé (60 images par seconde). |
| **Tauri** | Cadre d'application de bureau : interface web dans une fenêtre système, avec un cœur en Rust. |
| **Tool calling** | Mécanisme par lequel le modèle appelle des fonctions (les outils) avec des paramètres validés. |
| **TTS / STT** | Synthèse vocale / reconnaissance vocale. Aucun des deux n'existe dans la V1. |
| **WebView2** | Moteur web de Windows (basé sur Chromium) qui affiche l'interface de l'application. |
| **Zod** | Bibliothèque de validation de schémas ; ici limitée aux outils de l'IA. |
| **Möbius** | Surface à une seule face ; son équation paramétrique place les particules du ruban. |
| **Streak** | Compteur de jours consécutifs. <span class="st st-repl">Retiré</span> |
| **Proof of Work** | Preuve tangible d'une journée de travail. <span class="st st-repl">Retiré</span> |
| **ACTIF / PAUSE** | Ancien mode qui changeait le ton du modèle selon les horaires de travail. <span class="st st-repl">Retiré</span> |

---

@@ page sources | II | G | Sources | Les documents du dépôt Soza et les services utilisés.

Ce wiki est consolidé à partir du dépôt Soza et de son historique. En cas de conflit, le dépôt fait foi.

## Documents du dépôt Soza

| Fichier | Contenu |
| --- | --- |
| `README.md` | Présentation, structure, configuration, commandes |
| `docs/ai/STATUS.md` | État du projet : source d'état, daté et détaillé |
| `docs/ai/SozaV2.md` | Vision et chantiers de la V2 |
| `docs/ai/STATUS-V2.md` | Avancement de la V2 : ce qui est fait, mesuré, vérifié ou non |
| `docs/ai/CONTEXT.md` | Contexte donné à l'assistant de développement |
| `docs/product/UI.md` | Description de l'interface |
| `docs/product/NOTION-SCHEMA.md` | Propriétés Notion lues et écrites par le code (réécrit le 12/10/2026) |
| `docs/portfolio/BUILD-LOG.md` | Journal de construction et étude de cas |
| `tests/` | Les quatre familles de tests |

## Services et bibliothèques

Groq (modèle de langage), Vercel (hébergement et AI SDK), Upstash (QStash et Redis), Notion (API), Telegram (Bot API), Open-Meteo (météo), flux RSS (TechCrunch, Vogue), Tauri 2, React, Vite, three.js, Zod, Vitest, Playwright. Le rendu Markdown de ce wiki utilise `marked` (licence MIT).

## Ce que ce wiki ne contient pas

Aucun secret, aucune valeur de variable d'environnement, aucun identifiant de production, et peu de détails personnels : les noms d'appareils et de protocoles de la V2 sont généralisés.
