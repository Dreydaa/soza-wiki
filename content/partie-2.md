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
| 08/10 | **Une application qui s'installe, qui mesure et qui se teste** | Bloc « Écran » réel (thread Rust), démarrage automatique et zone de notification, installeur Windows, briefing du soir rédigé par Løra, colonnes Notion obsolètes supprimées, 52 idées catégorisées, 286 tests, passe d'optimisation mesurée. |
| 09/10 | **Fin de la V1** | Ruban à 60 images/s, barre de titre colorée, surnoms variés, installeur reconstruit et lancé, V1 déclarée terminée. |
| 12/10 | **Quatre étapes de finition** | Tests de cadence corrigés ; statut `Terminé`, catégorie Notion et applications inconnues ; pause de plusieurs jours dans le dashboard ; lag mesuré puis réfraction du verre coupée. PR #12 à #15. |
| 13 → 17/10 | **V2 : étapes 4 à 8** | Barre `Ctrl+K` pour ouvrir et fermer des applications (liste blanche locale, fermeture douce) ; recherche web de Løra avec repli ; volume, musique et batterie de la souris ; plusieurs projets en parallèle ; moteur de protocoles et premier protocole. Entre-temps : surnoms tirés par le code, « demain » du bilan recopié au briefing corrigé. PR #17 à #23. |
| 18 → 20/10 | **Le worker se bloque sur la limite de Groq** | Deux messages du soir restent sans réponse et créent des doublons dans Notion : Groq plafonne à 8 000 jetons par minute, Vercel coupe à 25 s, QStash relance. Fin des relances automatiques, message d'erreur sur Telegram, échec à 20 s ; puis appels allégés (second appel sans outils, repli sur un autre modèle, outils choisis par mots-clés). PR #27 à #31. |
| 18 → 20/10 | **Protocoles : exclure, ajouter, ouvrir** | Un protocole peut être lancé sans une application, ou avec une de plus ; « Ouvre <application> » lance une application depuis Telegram (le PC déclare les noms de ses applications, jamais les chemins). PR #26 et #31. |
| 01 → 02/11 | **La voix : clonage abandonné, enregistrements consentis** | Ouverture de plusieurs applications par message Telegram, outil `get_settings`, aveu d'ignorance (PR #32). Un clonage sans entraînement est jugé « très médiocre » par l'utilisateur et tout est supprimé ; il choisit d'entraîner Piper sur la voix d'un proche qui signe un accord écrit. |
| 03 → 04/11 | **La voix de Løra : entraînée, branchée, corrigée** | Piper est affiné (582 phrases retenues sur 695, 4 800 époques en environ 6 h), branché dans `Ctrl+K` (Piper d'abord, voix de Windows en repli, gardé en mémoire), un bug d'accents corrigé ; un projet dit terminé l'est dans Notion ; le « demain » du bilan est décalé par le code. PR #33 et #34. |
| 05/11 | **Renommage, Løra parle, Løra entend** | Soza devient Løra ; toute phrase de `Ctrl+K` part à `api/ask` et la réponse est dite ; reconnaissance locale (Whisper) et mot d'activation « Løra », essayés avec la vraie voix ; retour visuel sur le ruban ; personnalité à l'oral (tutoiement, vraies dates, surnoms permis). PR #35 et #36. |
| 06/11 | **Widget, commandes de contrôle, modes de travail, Claude Code** | Widget de bureau et nuage de particules synchronisé sur la vraie voix ; « stop », « repose-toi », « fin de mission » ; deux modes de travail à la voix ; lecture de la dernière réponse de Claude Code, dictée, relecture et envoi sur un « oui ». Relecture de tout le code et des commits. PR #37 à #39. |
| 07 → 08/11 | **Une réinstallation efface la voix** | Après la réinstallation du 06/11, les moteurs de voix (1,9 Go posés à la main) et plusieurs réglages ont disparu avec le dossier de données ; les moteurs sont déplacés dans un dossier voisin et le désinstalleur reçoit une confirmation. PR #42. |
| 08/11 | **Elle parle d'elle-même, dit bonjour, et on abandonne une fonction** | Parole spontanée (rendez-vous, batterie de la souris, pause pour le dos), bonjour au démarrage, agenda léger pour l'application ; « qu'est-ce que je regarde ? » est codée puis abandonnée ; étapes 9, 10 et 13 validées par l'utilisateur ; passe sécurité et dépendances corrigées ; ménage du dépôt. PR #40 à #44. |
| 09/11 | **Les « broutilles » : six lots et un journal plus riche** | Minuteurs, rappels, temps d'écran, sites, fenêtres, audio par application, verrouillage et extinction avec confirmation, presse-papiers, dictée, musique ; réponses sans modèle (météo, conversions, titres, compte à rebours, présence du PC) ; six outils Notion ; envoi vers Telegram ; résumés et liens dans le briefing du matin et actualités par thème. PR #45 et #46. |
| 10/11 | **V1 soldée, deux défauts trouvés à l'usage** | La connexion au compte de musique ouvrait le dossier Documents ; « mets en fenêtré » lançait une musique. L'utilisateur déclare la V1 finie et les lots validés : il ne reste que l'étape 12 et deux protocoles reportés. PR #47. |
| à partir de 30/09 | **V2 cadrée** | Assistant vocal local, protocoles, puis (06/10) gestes de la main : documenté ; au 10/11 : étapes 0 à 7, 9, 10 et 13 faites (les trois dernières validées par l'utilisateur), la 8 avec un seul protocole (deux reportés), la 11 abandonnée, la 12 (gestes de la main) pas commencée. Le premier chantier (personnalité unique) a été fait le 07/10, en fin de V1. |

---

@@ page vision-v2 | II | B | Vision V2 | Une seule personnalité, un agent local sur la machine, deux canaux d'entrée, un raisonnement qui reste dans le cloud.

<span class="st st-vision">V2</span> Cette annexe décrit la vision ; ce qui est fait se lit dans [Avancement de la V2](#avancement-v2), [La voix de Løra](#voix) et [Les commandes de Løra](#commandes-vocales). La V1 est terminée ; la V2 a démarré le 12/10/2026 : au 10/11, les étapes 0 à 7, 9, 10 et 13 sont faites (les trois dernières validées par l'utilisateur le 08/11), la 8 l'est avec un seul protocole (deux autres reportés), la 11 est abandonnée, la 12 (gestes de la main) n'est pas commencée.

## Pourquoi cette direction

Le 30/09/2026, l'utilisateur tenait sa cadence de travail (au moins une session par jour) et sentait que le cadrage « coach de discipline et de fatigue » était moins nécessaire que prévu : la difficulté est de *tenir* la discipline plus que de la *construire*, et il la tenait. La direction retenue rapproche Løra d'un assistant du type **FRIDAY** (l'IA de Tony Stark) : une seule personnalité, des fonctionnalités qui servent l'utilisateur directement plutôt qu'un rôle de coach.

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

Elle commence en mode « application ouverte » (le processus Tauri tourne ; une fenêtre minimisée en widget compte comme ouverte, puisque minimiser ne tue pas le processus). Le mode « toujours active, même application fermée » vient après la validation des fonctions vocales de base. L'ordre de test voulu : valider l'écoute et les actions d'abord (retour visuel ou texte sur le ruban), brancher la vraie voix de sortie ensuite. **État au 06/11/2026** : l'écoute tourne dans le processus de l'application, y compris lancée avec Windows fenêtre masquée (constaté : l'application installée tournait avec le serveur de reconnaissance lancé) ; <span class="st st-prop">Non vérifié</span> qu'une demande reçoive sa réponse fenêtre masquée n'est pas prouvé.

---

@@ page avancement-v2 | II | C | Avancement de la V2 | Étapes 0 à 13 entre le 12/10 et le 10/11/2026 : ce qui est fait, vérifié ou non, et la suite.

La V2 avance en 13 étapes, **du plus simple au plus dur**, une pull request par étape. Source : `docs/ai/STATUS-V2.md` du dépôt, qui fait foi. Chaque étape dit ce qui a été **essayé pour de vrai** et ce qui ne l'a été que dans des tests simulés.

| # | Étape | Statut |
| --- | --- | --- |
| 0 | Tests de cadence remis au vert, liste « non vérifié » de la V1 | <span class="st st-ok">Fait</span> liste soldée le 10/11/2026 d'après l'utilisateur (non rejouée par moi) |
| 1 | Statut `Terminé`, catégorie Notion, applications inconnues | <span class="st st-ok">Fait</span> |
| 2 | Pause de plusieurs jours visible dans le dashboard | <span class="st st-ok">Fait</span> |
| 3 | Cause du lag trouvée, réfraction du verre coupée | <span class="st st-ok">Fait</span> |
| 4 | Ouvrir et fermer une application nommée | <span class="st st-ok">Fait</span> validé par l'utilisateur |
| 5 | Recherche web de Løra | <span class="st st-ok">Fait</span> sur le vrai modèle ; <span class="st st-prop">Non vérifié</span> sur Telegram |
| 6 | Volume, musique, batterie de la souris | <span class="st st-ok">Fait</span> essayés sur la vraie machine |
| 7 | Plusieurs projets en parallèle | <span class="st st-ok">Fait</span> confirmé par l'utilisateur |
| 8 | Moteur de protocoles | <span class="st st-ok">Fait</span> essayé en réel le 05/11/2026 ; deux autres protocoles reportés |
| 9 | Voix : synthèse, reconnaissance, mot d'activation, ruban réactif | <span class="st st-ok">Fait</span> essayée avec la vraie voix le 05/11/2026 ; validée par l'utilisateur le 08/11/2026 |
| 10 | Agent résident et widget de bureau | <span class="st st-ok">Fait</span> validé par l'utilisateur le 08/11/2026 |
| 11 | « Qu'est-ce que je regarde ? » | <span class="st st-repl">Retiré</span> abandonnée le 08/11/2026 |
| 12 | Gestes de la main | <span class="st st-vision">V2</span> |
| 13 | Élargir les commandes vocales | <span class="st st-ok">Fait</span> validé par l'utilisateur (08 et 10/11/2026, sur sa parole) ; essayé avant contre des simulations |
| Extras | Résumés et liens dans le briefing, parole spontanée, bonjour au démarrage | <span class="st st-ok">Fait</span> côté code ; <span class="st st-prop">Non vérifié</span> essai réel non consigné |

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

- **Décisions** : le PC va chercher ses étapes (il interroge le backend, aucun port n'est ouvert) ; l'allumage du PC par Løra est écarté (l'utilisateur le démarre avec l'application de sa prise connectée) ; premier lot = moteur, déclencheur strict et un premier protocole.
- **Déclencheur** : le message entier `Protocole <code>` avec un code connu ; une phrase libre qui contient « protocole » reste au modèle. Le worker l'exécute avant le modèle, jamais le webhook.
- **Déroulé** : message de début sur Telegram, protocole mis en attente dans Redis (15 minutes), le PC l'attrape (toutes les 30 secondes), exécute chaque étape et renvoie son statut, message de fin (« terminé » ou la liste des étapes en échec avec leur raison). Remis une seule fois au PC.
- **Délai** : un job différé de 10 minutes prévient sur Telegram si le PC n'a jamais répondu.
- **Le premier protocole** ouvre un outil de bureau à distance puis un éditeur de code ; deux autres sont reconnus mais sans étapes (reportés : il manque une ressource pour l'un d'eux). Les « modes de travail » vocaux de l'étape 13 sont une autre fonction (voir [La voix de Løra](#voix)).
- **Coût Redis** : l'application interroge toutes les 30 secondes, environ 2 900 lectures par jour ; à surveiller sur le palier gratuit.
- **Essai de bout en bout local (17/10)** : le vrai worker, le vrai endpoint et la vraie boucle Rust contre des faux Redis, Telegram et QStash, avec de vrais processus : 17 contrôles sur 17 (cas nominal, application absente, chemin cassé, PC jamais venu, deux lancements d'affilée, protocole remplacé en cours, coupure réseau, mauvaise clé, backend injoignable). Un défaut trouvé : si l'envoi des statuts échouait brièvement, l'utilisateur recevait 10 minutes plus tard « le PC n'a pas rendu le statut » alors que tout était lancé ; le PC réessaie maintenant trois fois sur une coupure ou une erreur 5xx.
- **Essayé en réel par l'utilisateur le 05/11/2026 : le premier protocole fonctionne.**
- **Exclure et ajouter des applications (18 et 20/10)** : `Protocole <code> - App` lance le protocole sans une application, `+ App` en ajoute une (combinables) ; un nom qui ne correspond à aucune étape refuse tout plutôt que de lancer à moitié.
- **Ouvrir sans protocole depuis Telegram (20/10, 01/11)** : `Ouvre <application>` ou une liste d'applications séparées par « et », « puis » ou une virgule ouvre une ou plusieurs applications sur le PC par le même circuit. Le PC déclare au backend les **noms** de ses applications (jamais les chemins) ; seul un message qui est exactement « verbe + applications déclarées » est intercepté, et rien n'est lancé si l'une n'est pas déclarée.
- <span class="st st-prop">Non vérifié</span> Un vrai message Telegram pour les ouvertures directes, et le fait qu'une fenêtre apparaisse (une application déjà ouverte ne crée pas de nouveau processus). Le backend est déployé (état « success » sur GitHub, état détaillé côté hébergeur non consulté).
- **Limites** : un seul protocole en cours à la fois ; l'ouverture est jugée réussie quand le processus démarre, sans vérifier qu'une fenêtre est apparue ; un protocole commencé avec un PC éteint n'est repris que quand l'application démarre avec Windows.

## Quand le worker s'est bloqué (18 → 20/10)

Voir le bug [16](#bugs). Résumé : fin des relances automatiques, échec à 20 s, message sur Telegram ; puis allègement des appels (second appel sans outils −31 %, repli sur un second modèle, descriptions raccourcies, outils choisis par mots-clés). Quota mesuré : trois modèles de chat à 8 000 jetons par minute chacun, compteurs séparés. **Défaut trouvé le 19/10, non corrigé à cette date** : « je ne bosse pas ce week-end » donnait des dates fausses (3 essais sur 3), le modèle calculant mal les jours à partir de la date du jour ; piste : injecter dans la consigne les dates de demain et des prochains samedi et dimanche. <span class="st st-prop">Non vérifié</span> Un vrai repli de modèle sur un vrai refus.

## Étape 9 : la voix (18/10 → 08/11)

Découpée en lots, dans l'ordre choisi par l'utilisateur, puis **validée par l'utilisateur le 08/11/2026** (sur sa parole : je n'ai rien rejoué). Le détail (essais de voix, entraînement, reconnaissance, mot d'activation, commandes de contrôle, retour visuel, parole spontanée) est dans [La voix de Løra](#voix). Au moment de la validation : voix de sortie faite et branchée ; reconnaissance et mot d'activation essayés avec la vraie voix le 05/11 (« le point est bon »). Les points « non vérifié » de l'étape (faux déclenchements sur la durée, télévision, musique, écoute fenêtre masquée, application installée) ne sont pas consignés comme remesurés.

## Étape 10 : widget de bureau (06/11, validée le 08/11)

Une seconde fenêtre transparente de 320 px en bas à droite, avec le seul ruban, visible seulement quand Løra écoute ou parle, sans focus, clics traversants. Essayée dans un navigateur (noyau Tauri simulé), puis **validée par l'utilisateur le 08/11/2026**. Les points restés « pas essayé » avant sa validation (transparence de WebView2, absence de vol de focus, jeu en plein écran, effet sur le démarrage, particules blanches peu visibles sur fond clair) n'ont pas été remesurés par moi. L'agent résident existait déjà (zone de notification, démarrage avec Windows).

## Étape 13 : élargir les commandes vocales (05 → 10/11)

**Premier lot (05/11)** : toute phrase de `Ctrl+K` ou du micro qui n'est pas une commande locale part à `api/ask` et la réponse est dite : briefing, agenda, idées, météo, bilan, recherche, calcul, avis sur un projet. Un hook « Claude Code a terminé » la fait aussi parler d'elle-même. Essai réel le 05/11 (vrai modèle, vrai Notion, vrai Redis, lecture seule). **Défauts trouvés à l'essai et corrigés** : « C'est fait. » collé aux réponses d'information, code météo lu à voix haute, mauvais jour de la semaine, tu et vous mélangés, fausses dates (« aujourd'hui » pour un événement lointain). **Lots du 06/11** : commandes de contrôle, modes de travail, Claude Code (voir [La voix de Løra](#voix)).

**Six lots du 09/11 : les « broutilles »**, une liste proposée le 08/11 (« toutes les idées sont bonnes à prendre ») dont l'utilisateur a retenu tout sauf trois (une session de travail, l'état de la machine, des modes de plus), livrée **par lots, une pull request chacun** : (1) minuteurs, rappels, heure, date, temps d'écran, sites et dossiers, fenêtres ; (2) volume par application, sortie audio, micro, verrouillage / veille / extinction / corbeille avec confirmation, presse-papiers, dictée ; (3) musique : titre en cours, like, aléatoire, playlist ; (4) internet sans modèle : météo, conversions, titres, compte à rebours, traduction ; (5) six outils Notion ; (6) Telegram et PC : « mon PC est-il allumé ? » et « envoie-moi ça sur Telegram ». Décisions : rappels dits par la voix du PC seulement ; **aucun ordre ne descend vers le PC**. Le catalogue, les garde-fous et les limites sont dans [Les commandes de Løra](#commandes-vocales).

**Validation** : l'utilisateur a validé l'étape le 08/11 puis les lots du 09/11 le 10/11 (« tout est bon, il ne reste que l'étape 12 et 8 »), sur sa parole. Deux défauts trouvés à l'usage ce jour-là ont été corrigés (bugs [22](#bugs) et [23](#bugs)). **Limites générales** : pas d'outil de calcul (le modèle compte, un calcul long peut être faux) ; ce que Løra dit peut être entendu par l'entourage ; le hook se déclenche à chaque fin de réponse de Claude Code, pas seulement pour une longue tâche.

## Renommage Soza → Løra (05/11)

Voir [En bref](#en-bref). Renommés : les textes, la personnalité, les messages, le nom de l'application, les paquets, les identifiants du code, la documentation. Gardés sous l'ancien nom, volontairement : le dossier de données de l'application (qui contient les listes et les modèles de voix), l'adresse du déploiement, les planifications QStash (en créer de nouvelles enverrait deux briefings le matin), le fichier du modèle de voix, le dépôt GitHub et les dossiers du projet. Les points manuels (renommer les bases dans Notion, réinstaller l'application, retirer l'ancienne installation et son démarrage automatique) sont déclarés faits par l'utilisateur ; je ne les ai pas vérifiés.

## Relecture du code et des commits (06/11)

Relus : les modules neufs (commandes de contrôle, Claude Code, modes, analyse du son, forme de la voix, widget) et les commits de la branche de la reconnaissance vocale. Un défaut trouvé et corrigé (bug [20](#bugs)) ; rien d'autre : les accès à des tranches de l'analyse du son sont bornés (un WAV illisible laisse la page garder son son simulé), les modes n'ouvrent que des applications de la liste blanche et des adresses `http(s)` passées en arguments, la frappe dans l'éditeur n'envoie jamais Entrée sans un « oui ». **Limites** : faite sur le code et les tests, rien essayé dans l'application réelle. Un point de conception à garder en tête : après le mot d'activation, « je suis en mode créatif ce soir » lancerait aussi le mode.

## Étape 11 : abandonnée (08/11)

Décision de l'utilisateur : la fonction est inutile et son coût en jetons n'est pas rentable. Le code (capture d'écran, commande Tauri, champ image de `api/ask`, deux dépendances, tests) a été retiré ; il n'existe plus que dans l'historique git. **Ce que l'essai a appris**, au cas où l'idée reviendrait (deux appels réels, environ 2,5 k jetons chacun) : le seul modèle de vision du compte ne lisait pas un écran entier et **inventait le contenu** (à 1 280 px comme en résolution native) ; une consigne durcie lui a fait avouer ne pas lire le détail, mais après avoir inventé ; explication probable, non vérifiée : l'image est comptée 2 048 jetons quelle que soit sa taille, donc le modèle la réduit ; piste jamais essayée : capturer la fenêtre active seule. *Leçon : une capacité qu'un modèle simule sans pouvoir la tenir est pire qu'une capacité absente.*

## Extras 1 et 2 (08 → 09/11)

Les Extras viennent normalement après l'étape 12 ; l'utilisateur a demandé l'Extra 2 avant (signalé comme possible surdev, il a tranché). **Extra 1** : résumés et liens dans le briefing du matin, et outil `get_news` à la demande (voir [Briefings et pause](#briefings-pause)). **Extra 2** : Løra prend la parole d'elle-même, et dit bonjour au démarrage (voir [La voix de Løra](#voix)). <span class="st st-prop">Non vérifié</span> Ni l'un ni l'autre n'est consigné comme essayé en réel ; l'agenda léger de l'Extra 2 est déjà déployé (vu répondre en production le 08/11).

## Passe sécurité et vérifications en lecture seule (08/11)

Passe sécurité sur le code réel : rien de bloquant, cinq points à connaître et deux alertes de dépendances corrigées (voir [Sécurité](#securite)). Vérifications en production : `/api/dashboard` répond avec tous ses champs (jalons, idées, articles, `pause: null`) et refuse sans clé ; de vrais briefings du matin et du soir ont été lus dans Redis ; le « demain » du bilan est bien décalé. Poser une pause pour la voir rendue n'a pas été fait par moi (l'écriture dans le Redis de production a été refusée par le garde-fou de la session et je ne l'ai pas contournée) ; l'utilisateur a ensuite compté la pause posée par conversation parmi les points soldés.

## Ménage (08/11)

L'arbre de travail local était en retard sur `main` : chaque modification non commitée a été comparée fichier par fichier à `origin/main` (identiques) puis sauvegardée avant d'être écartée ; 39 branches locales déjà fusionnées supprimées ; 19 Go de fichiers de compilation supprimés ; un ancien désinstalleur orphelin supprimé sans être lancé. **Pas fait** : les branches distantes déjà fusionnées sont toujours sur GitHub (suppression refusée par le garde-fou de la session).

## Ce qui reste ouvert

Au 10/11/2026, d'après l'utilisateur, il ne reste que **l'étape 12 (gestes de la main)** et **l'étape 8 (deux protocoles reportés)**. Tout ce qui est marqué validé l'est sur sa parole : je n'ai rien rejoué. Restent non consignés comme vérifiés : l'installeur reconstruit (un nom avec « ø » dans NSIS, la confirmation de désinstallation), les Extras en réel, les restrictions d'API du service de musique pour les applications en développement en 2026, la bascule F11 qui ne connaît pas l'état de la fenêtre, et le nettoyage des branches distantes.

---

@@ page voix | II | D | La voix de Løra | Voix de sortie entraînée sur des enregistrements consentis, reconnaissance locale, mot d'activation, commandes de contrôle, retour visuel, modes de travail et Claude Code.

Cette page rassemble ce qui concerne la parole, du 18/10 au 08/11/2026. Source : `docs/ai/STATUS-V2.md`, étapes 9, 10 et 13. Même règle que le reste du wiki : ce qui a été **essayé pour de vrai** est séparé de ce qui ne l'a été qu'en tests. **Le son lui-même n'a jamais été écouté côté développement** : seul l'utilisateur juge la voix. Les étapes 9, 10 et 13 ont été **validées par l'utilisateur le 08/11/2026**, sur sa parole.

## Vue d'ensemble

| Brique | Ce qu'elle fait | Statut |
| --- | --- | --- |
| Voix de sortie (Piper, repli sur la voix de Windows) | Dit les réponses de `Ctrl+K`, du micro et du hook « Claude Code a terminé » | <span class="st st-ok">Fait</span> accents jugés satisfaisants ; validée le 08/11/2026 ; <span class="st st-prop">Non vérifié</span> accent anglais des noms d'applications, volume dans l'application |
| Reconnaissance locale (Whisper) et mot d'activation « Løra » | Transforme une phrase qui commence par « Løra » en demande, traitée comme une phrase tapée | <span class="st st-ok">Fait</span> essayée avec la vraie voix le 05/11/2026, validée le 08/11/2026 |
| Commandes de contrôle | « stop », « repose-toi », « fin de mission » | <span class="st st-ok">Fait</span> validées le 08/11/2026 |
| Retour visuel et widget | Le ruban réagit à l'état et à la vraie voix ; une fenêtre transparente apparaît en bas à droite | <span class="st st-ok">Fait</span> validés le 08/11/2026 |
| Modes de travail | Une phrase lance un ensemble d'applications et de pages | <span class="st st-ok">Fait</span> validés le 08/11/2026 (essayés avant seulement avec des simulations) |
| Claude Code | Lire la dernière réponse, dicter une suite, la relire, l'envoyer sur un « oui » | <span class="st st-ok">Fait</span> validé le 08/11/2026 (essayé avant seulement avec de fausses frappes) |
| Parole spontanée et bonjour | Une phrase fixe pour un rendez-vous, la batterie de la souris, une pause pour le dos ; un bonjour au démarrage | <span class="st st-ok">Fait</span> côté code ; <span class="st st-prop">Non vérifié</span> essai réel non consigné |
| Petites commandes locales | Minuteurs, volume par application, dictée, etc. | voir [Les commandes de Løra](#commandes-vocales) |

## La voix de sortie

**Les essais (18/10 → 02/11).** Une voix de Windows est branchée le 18/10, retirée le jour même puis remise le 19/10 « en attendant ». L'utilisateur veut une voix plus naturelle ; quatre pistes sont essayées ou étudiées : (1) les voix de série de Piper, écartées sans verdict d'écoute consigné ; (2) des voix cloud payantes, comparées sur documents seulement et gardées comme axe d'amélioration (le texte partirait sur leurs serveurs, ce qui sort du principe « local plutôt que cloud ») ; (3) la transformation de sa propre voix, écartée ; (4) un clonage sans entraînement à partir d'un enregistrement de 99 secondes, **jugé « très médiocre » par l'utilisateur** et supprimé. Les conditions d'usage d'un service cloud de voix interdisent d'entraîner un autre modèle avec ses sorties, donc une voix créée là-bas ne peut pas alimenter Piper. **Règle posée** : pas de clonage de la voix d'une personne identifiable sans son accord.

**La voix retenue (02 → 04/11).** Piper, affiné sur les enregistrements d'un proche de l'utilisateur qui a signé un accord écrit (le papier n'est ni dans le dépôt ni consulté). 695 phrases préparées, environ 45 minutes enregistrées en MP3 puis reconverties en WAV ; l'alignement par Whisper garde **582 phrases, 35,5 minutes**. Départ : une voix française féminine à licence CC-BY 4.0 (une attribution sera à prévoir si la voix est un jour distribuée). 4 800 époques en environ 6 heures sur la carte graphique, sans WSL. L'époque 3833 est retenue sur la meilleure note automatique de qualité (4,11 sur 5) ; cette note ne dit rien de la ressemblance ni du naturel. Les enregistrements disent « patron » là où le texte prévoyait le prénom : cohérent avec la règle du nom (Løra ne dit jamais le prénom de l'utilisateur).

**Le branchement.** Piper d'abord, la voix de Windows en repli : Løra ne reste jamais muette. Piper est **résident** (lancé à la première phrase, arrêté après 10 minutes d'inactivité) : 2,5 s pour la première phrase, quelques dixièmes de seconde ensuite. Le volume se règle dans un fichier, sans recompiler. Les guillemets et signes de mise en forme ne sont pas lus ; les noms d'applications anglais passent par des phonèmes anglais ; un journal garde ce qui est dit et les phonèmes, et les 30 derniers WAV, pour décrire un défaut.

**Pièges.** L'ancien exécutable de Piper refuse ce modèle (la nouvelle version de Piper a ajouté des symboles multi-caractères à la configuration) : un exécutable est compilé à partir de la version qui lisait déjà le modèle. Windows PowerShell 5.1 ne lit pas les fichiers de configuration de Piper (clés en double). Un bug d'encodage rendait tous les accents faux (bug [19](#bugs)).

<span class="st st-prop">Non vérifié</span> Ce que personne n'a pu juger : la qualité de l'accent anglais des noms d'applications (un modèle français dit des phonèmes anglais), la prononciation de « Løra » (le « ø » est donné en « o »), le volume dans l'application. L'exécutable de Piper compilé n'est pas signé.

## La voix d'entrée

**Décision de l'utilisateur (18/10 puis 05/11)** : reconnaissance par **Whisper local** et **mot d'activation tout de suite**, contre la recommandation de commencer par un raccourci à maintenir (plus fiable, sans faux déclenchements) ; le raccourci reste le plan B. Le moteur dédié au mot d'activation prévu à l'origine n'est pas utilisé : le nom est cherché dans la transcription.

- **Chemin** : micro (WASAPI) → découpage en phrases par silence → WAV 16 kHz en mémoire → serveur Whisper local (rien ne sort du PC) → le mot d'activation doit ouvrir la phrase (parmi les trois premiers mots, « hé Løra ») → la demande suit le même chemin qu'une phrase tapée dans `Ctrl+K`. « Løra » dit seul : un bip, puis la phrase suivante (dans les 8 s) est la demande.
- **Løra n'entend pas Løra** : tout ce que capte le micro pendant qu'elle parle (et 1 s après) est jeté, sinon sa voix, qui contient son nom, se déclencherait elle-même.
- **Seuil adaptatif** : le bruit de fond de l'utilisateur est très bas (niveau moyen 0,0001), un seuil fixe aurait ignoré une voix normale ; le bruit ambiant est suivi en continu et on parle quand le niveau dépasse 4 fois ce bruit et un plancher réglable. Un son de plus de 15 s sans pause (musique, ventilateur) est appris comme ambiance.
- **Confirmation avant écriture** : une demande vocale est envoyée avec un indicateur ; le backend reformule et demande « je le fais ? » avant tout outil d'écriture, qui n'est appelé qu'après un « oui ».
- **Interrupteur** : une case « Écoute du micro » dans le menu de la zone de notification ; décochée, le flux du micro lui-même est coupé (le témoin de Windows s'éteint).
- **Installation à la main**, hors de l'installeur : le serveur de whisper.cpp (version b5454, archive vérifiée contre l'empreinte publiée par GitHub) et un modèle de 574 Mo (empreinte calculée, non comparée à une valeur publiée), 1,7 Go en tout. **Les exécutables ne sont pas signés.** Sans eux, l'écoute ne démarre pas et rien d'autre ne change.
- **Mesures** : 65 à 85 ms par phrase sur la carte graphique, 2,7 s pour charger le modèle au lancement ; environ 312 Mo de mémoire et 1,1 Go de mémoire vidéo pour le serveur.
- **Constats** : Whisper écrit « Løra » « Laura » (d'où une liste d'orthographes réglable). Une amorce de vocabulaire a été **écartée** : sur du silence, Whisper recrache son amorce, donc le mot d'activation apparaîtrait tout seul.

**Retours du premier essai avec la vraie voix (05/11) et corrections.** (1) « l'aura » déclenchait Løra : un mot collé à une apostrophe (l', d', qu') ne compte plus ; le prénom « Laura » déclenche toujours, comme prévu. (2) Les phrases étaient trop courtes : la fin de phrase passe de 720 ms à 1,2 s de silence (0,5 s de latence en plus). (3) Dire « Løra » seul faisait répondre « Oui ? » par la synthèse, qui coupait le micro 2,5 s à froid et jetait la demande enchaînée : remplacé par un bip. L'utilisateur a conclu : « le point est bon ». Il lui faut plus de temps d'usage pour trouver d'autres défauts.

<span class="st st-prop">Non vérifié</span> Pas essayé : la précision du mot d'activation sur la durée et les faux déclenchements (télévision, conversations, musique), l'événement reçu fenêtre masquée, l'application installée, le démarrage avec Windows. Le micro de l'utilisateur capte très peu de ses haut-parleurs : un essai « par l'air » était impossible. Limite de principe : une personne prénommée Laura, dite en début de phrase, réveillera Løra.

## Les commandes de contrôle (06/11)

Reconnues en local, jamais envoyées à Groq, aussi comprises telles quelles dans `Ctrl+K` :

- **« Løra, stop »** coupe la parole en cours. Sans parole en cours, « stop » reste la commande « pause » de la musique.
- **« Løra, repose-toi »** arrête l'écoute (mode passif) : la case du menu se décoche, seul un clic dessus réveille ; rien n'est écrit dans les réglages, au prochain lancement elle écoute de nouveau.
- **« Løra, fin de mission »** : elle dit « D'accord patron, à la prochaine. » puis ferme sa propre application comme « Quitter ».
- La phrase entière après le mot d'activation compte, accents, casse et ponctuation ignorés ; « ne stop pas la musique » ou « fin de mission accomplie » ne déclenchent rien.
- **Le point délicat : écouter pendant qu'elle parle.** Avant, tout ce que captait le micro était jeté pendant qu'elle parlait, donc « stop » n'aurait jamais été entendu. Un second découpeur en morceaux courts (2 s) garde pour référence le bruit d'avant sa parole, transcrit chaque morceau et cherche le mot d'activation suivi d'une des trois commandes ; **rien d'autre n'est compris pendant qu'elle parle**.
- <span class="st st-prop">Non vérifié</span> Que la pause coupe bien le son à l'oreille ; l'écoute pendant qu'elle parle avec les vrais haut-parleurs (Whisper reçoit un mélange des deux voix : avec des haut-parleurs et un micro ouvert, elle peut ne pas entendre ; un casque rend ça fiable) ; le délai réel avant la coupure (jusqu'à environ 2 s). **Limites** : de la charge sur la carte graphique pendant les réponses longues ; « repose-toi » n'est pas mémorisé d'un lancement à l'autre ; au repos, plus rien n'écoute, donc « fin de mission » se dit après l'avoir réveillée ou se tape.

## Le retour visuel et le widget

Le ruban réagit à l'état et à la vraie voix (voir [L'avatar](#avatar-ruban)). Le **widget** est une seconde fenêtre transparente, sans bordure, toujours au premier plan, absente de la barre des tâches, **sans focus** (elle ne vole jamais le clavier d'une autre application) et qui laisse passer les clics. Elle n'est visible que pendant qu'elle écoute ou parle (décision de l'utilisateur) et son rendu s'arrête quand elle est masquée. <span class="st st-prop">Non vérifié</span> Dans l'application réelle : transparence, position, jeux en plein écran, particules blanches peu visibles sur fond clair.

## Les modes de travail (06/11)

Deux phrases, après le mot d'activation : « on se met au boulot en mode créatif » et « passe en mode dev ». Chaque mode est défini dans un fichier local (`modes.json`, relu à chaque phrase, jamais écrasé) : une phrase de départ et des étapes. Le **mode créatif** ouvre un logiciel de modélisation, un navigateur sur deux pages d'inspiration, un titre tiré au hasard parmi les titres likés de l'utilisateur dans son service de musique et un logiciel graphique ; le **mode dev** ouvre l'éditeur de code, une page de dépôts et l'application Claude. Les pages sont la lecture de la demande de l'utilisateur et se changent dans le fichier.

- **Déroulé** : Løra dit la phrase de départ tout de suite, puis lance les étapes dans l'ordre (300 ms entre deux) sur son propre fil ; ce qui échoue est dit à la fin en une phrase.
- **Titres likés** : ils demandent un compte, contrairement à la recherche. « Connecte… » (le nom du service) ouvre la page d'accord dans le navigateur, un petit serveur local (2 minutes au plus) reçoit le code, vérifie un « état » anti-falsification et l'échange contre un jeton de renouvellement ; droit demandé : lire la bibliothèque, rien d'autre. Sans connexion faite, Løra le dit et le reste du mode se lance quand même.
- **Vérifié le 06/11 sans lancer d'application ni toucher au compte** : le serveur de connexion avec de vraies requêtes locales (mauvais état refusé, délai tenu) ; le tirage contre un **faux** service local (trois appels dans l'ordre, un seul titre) ; le lancement des étapes avec de faux programmes (les deux pages arrivent ensemble au navigateur) ; la reconnaissance des phrases par le vrai Whisper sur des phrases dites par la voix de Løra.
- <span class="st st-prop">Non vérifié</span> Contre le vrai service de musique, et ses restrictions d'API pour les applications en développement en 2026 (non contrôlées) ; avec la voix de l'utilisateur ; que le navigateur déjà ouvert ajoute bien les deux onglets ; que l'application de bureau Claude se lance comme un exécutable ordinaire.
- **Limites** : locaux seulement (pas depuis Telegram) ; pas de fermeture d'un mode ; relancer un mode relance tout ; la phrase doit contenir le mot « mode » : « on se met au boulot » seul n'est pas compris.

## Lire et écrire dans Claude Code (06/11)

Après « Claude Code a terminé », l'utilisateur veut se faire lire la réponse puis dicter une suite. Décisions : lecture **locale** (rien chez Groq), phrase **écrite sans Entrée**.

- **Deux hooks** de fin de réponse dans les réglages de Claude Code : l'un laisse une phrase à dire (avec un surnom une fois sur deux), l'autre copie les informations de l'événement dans un fichier local.
- **Lecture** : « lis la réponse de Claude », « résume la session ». Løra relit la fin de la conversation et prend **le dernier texte de Claude** (pas les appels d'outils), retire code, tableaux et adresses, et s'arrête à la fin d'une phrase avant 600 caractères. Ce n'est pas un résumé : c'est la fin de la réponse.
- **Écriture** : « Løra, écris… », seulement dans les 2 minutes qui suivent une lecture ; la phrase dictée ne passe jamais par le modèle. Elle est tapée caractère par caractère dans la fenêtre de l'éditeur qui porte le nom du dossier du projet, sans toucher au presse-papiers et **sans Entrée**.
- **Relecture puis envoi** : « relis le message » relit tout ce qui a été écrit et pas envoyé, puis demande « Je l'envoie ? ». Seule la phrase suivante compte : « oui » appuie sur Entrée, « non » garde le message, **toute négation l'emporte**, autre chose oublie la question ; elle expire au bout de 60 s.
- **Éditeur en plusieurs volets** : la cible est la session qui vient de finir ; Løra lui donne le focus par une adresse de l'extension qui n'est **pas documentée officiellement** et n'a jamais été essayée ici (un fichier de réglage la coupe).
- <span class="st st-prop">Non vérifié</span> Tout ce qui touche au vrai Windows et à la vraie voix : le premier plan de la fenêtre, la frappe dans la bonne zone de saisie, la façon dont Whisper écrit « Claude » et « Écris », les hooks joués par Claude Code lui-même. L'essai réel de frappe n'a pas été lancé : il aurait écrit dans la session de l'utilisateur.
- **Limites** : une dictée coupée par un silence de plus de 1,2 s devient deux phrases et la seconde est ignorée ; le fichier est écrasé par chaque fin de réponse de n'importe quel projet ; une fenêtre lancée en administrateur bloque la frappe.

## Elle parle d'elle-même et dit bonjour (08/11)

Demandée par l'utilisateur le 08/11, avant la fin des étapes prévues (signalé comme possible surdev, il a tranché). Un seul thread regarde toutes les 15 secondes ; **une phrase au plus par tour, des phrases fixes, aucun appel au modèle** : les faits (heure, pourcentage, titre) viennent du code.

- **Quatre types d'événements** : un rendez-vous qui approche (« Dans 10 minutes : … »), la batterie de la souris sous 20 % (une alerte par décharge, réarmée quand elle recharge), une pause pour le dos après une heure d'activité continue (3 minutes sans clavier ni souris remettent le compteur à zéro), et une remarque d'ambiance (environ une fois par heure, tard le soir, ou le temps passé sur l'application la plus utilisée).
- **Garde-fous** : une case « Løra parle d'elle-même » dans le menu de la zone de notification (« repose-toi » la décoche) ; la pause de plusieurs jours du backend la fait taire ; silence en plein écran ou en présentation ; silence tant qu'elle parle ; rien quand l'utilisateur est parti (5 minutes), sauf un rendez-vous ; **plafond de 3 phrases par heure** (un rendez-vous passe toujours) ; un interrupteur par type de phrase.
- **Vie privée** : tout se décide en local ; seul l'agenda vient du backend (une lecture légère de `/api/dashboard?only=agenda` toutes les 5 minutes, sans les articles) ; les titres de fenêtres ne sont pas lus, seul le nom de l'exécutable du suivi existant sert.
- **Pour essayer sans qu'elle parle** : une option écrit les phrases dans un journal au lieu de les dire (l'ordre de test voulu : afficher avant de dire).
- **Bonjour au démarrage** : une fois par demi-journée, dès qu'une touche est pressée ou que la fenêtre est affichée (8 secondes après le démarrage), elle dit « Bonjour » suivi d'un surnom, le briefing court du dashboard et un titre d'actualité tiré au sort (à partir de 15 h : le briefing du soir). Aucun appel au modèle : le texte est lu dans le dashboard. Réseau absent : quatre essais puis « Bonjour » seul. On regarde seulement si une touche est enfoncée, rien n'est enregistré.
- <span class="st st-prop">Non vérifié</span> Rien n'est consigné comme essayé dans l'application compilée : le son des phrases, le plein écran réel, la case du menu, la batterie à 20 %, la détection réelle d'une touche. **Limites** : les réunions ne sont pas détectées (Windows n'expose pas cet état) ; un rendez-vous sans heure n'est pas annoncé ; un rendez-vous ajouté moins de 5 minutes avant son début peut être manqué ; le briefing court, écrit par le modèle, peut lui-même commencer par « Bonjour ». Événements non faits : réseau coupé, périphérique branché, mise à jour de Windows, disque plein, fin de téléchargement.

## Installation, réinstallation et ce qui s'efface (08/11)

Après la réinstallation du 06/11, la reconnaissance et la synthèse (1,9 Go posés à la main) avaient disparu, ainsi que la liste des applications et les réglages de la musique, des modes, de l'écoute et de la voix. **Cause, déduite des dates** (la désinstallation n'a pas été vue) : la case « supprimer les données de l'application » du désinstalleur de Tauri efface deux dossiers, recréés ici dans la même seconde au premier lancement. **Parade** : les moteurs de voix vivent maintenant dans un **dossier voisin** que cette case ne touche pas ; une confirmation s'ajoute à la désinstallation (« non » par défaut, « non » aussi en mode silencieux). <span class="st st-prop">Non vérifié</span> Aucune vraie désinstallation n'a été essayée et l'installeur n'est pas reconstruit : le désinstalleur actuellement installé n'a pas ce crochet. Voir [L'application de bureau](#application-bureau) et le bug [21](#bugs).

## Ce qui reste

Du temps d'usage et l'essai réel de ce qui est marqué non vérifié ; reconstruire et réinstaller l'application (l'installée ne contient pas tout ce code) ; un raccourci à maintenir si le mot d'activation déçoit ; une voix pour l'accent anglais des titres de morceaux et d'artistes ; puis les gestes de la main. « Qu'est-ce que je regarde ? » est abandonnée.

---

@@ page commandes-vocales | II | E | Les commandes de Løra | Ce que Løra sait faire à la voix ou dans la barre Ctrl+K, par famille, et ce que chacune coûte en jetons.

Tout passe par la même entrée : une phrase tapée dans `Ctrl+K` ou dite après « Løra ». Le principe est **le moins cher d'abord** : le code essaie d'abord les commandes locales (rien ne quitte le PC, zéro jeton), puis les réponses directes (fabriquées par le code), et n'envoie au modèle que ce qui reste. **L'ordre des reconnaissances est une décision de conception** : par exemple, « rappelle-moi de faire une pause » ne doit pas devenir la commande « pause », et « mets la page en plein écran » ne doit pas lancer une musique (bug [23](#bugs)). Source : `docs/ai/STATUS-V2.md`, étape 13 (lots du 05 au 10/11/2026).

## Du moins cher au plus cher

| Famille | Exemples | Où ça tourne | Jetons |
| --- | --- | --- | --- |
| Commandes locales | ouvrir ou fermer une application, volume, musique, batterie de la souris, minuteurs et rappels, heure et date, temps d'écran, sites et dossiers, fenêtres, volume par application, sortie audio, micro, presse-papiers, dictée, titre en cours, like, aléatoire, playlist | le PC | 0 |
| Actions avec confirmation | verrouiller, mettre en veille, éteindre, vider la corbeille | le PC | 0 |
| Contrôle de Løra | « stop », « repose-toi », « fin de mission » | le PC | 0 |
| Modes de travail, Claude Code | « mode créatif », « mode dev » ; lire, dicter, relire, envoyer | le PC | 0 |
| Envoi et présence | « envoie-moi ça sur Telegram » ; « mon PC est-il allumé ? » | le PC et le backend, sans modèle | 0 |
| Réponses directes | météo de demain ou de la semaine, conversions d'unités, de devises et de cryptomonnaies, titres du jour, compte à rebours | le backend, sans modèle | 0 |
| Un petit appel | traduction, définitions | le backend, modèle léger sans outils | environ 1 000 (estimé) |
| Le modèle avec outils | lectures et écritures Notion, briefings, avis sur un projet, recherche web | le backend et Groq | 3 700 et plus ; 19 000 à 41 000 avec la recherche |

## Les lots du 09/11

Une liste de « broutilles » proposée le 08/11, dont l'utilisateur a retenu tout sauf trois idées (une session de travail, l'état de la machine, des modes de plus). Livrée en six lots, une pull request chacun. Décisions : rappels dits par la voix du PC seulement ; pour Telegram et le PC, seulement la présence et « envoie-moi ça » (aucun ordre ne descend vers le PC).

- **Lot 1 : minuteurs, bureau.** « Minuteur de 20 minutes », « rappelle-moi à 18 h de… » (gardés dans un fichier, ils survivent à un redémarrage ; un rappel échu pendant que Løra était éteinte est dit au démarrage comme « manqué »), l'heure et la date (seulement si la phrase ne contient que la question), le temps d'écran à la voix (lu dans le fichier local de suivi, aujourd'hui ou hier), des sites et dossiers d'une liste blanche, « montre le bureau », « mets-la à gauche », « plein écran ». Limites : nombres en chiffres seulement ; « annule » efface tous les minuteurs.
- **Lot 2 : audio et PC.** Volume par application (par les sessions audio de Windows), changement de sortie audio par l'interface non documentée du panneau de son (le nom doit désigner une seule sortie : si plusieurs s'appellent « casque », Løra liste les candidates au lieu d'en choisir une), « coupe le micro » (qui coupe aussi son écoute), verrouiller, veille, extinction (30 secondes de délai, annulable) et corbeille avec confirmation, presse-papiers lu à voix haute (texte seulement, 300 caractères), dictée dans la fenêtre au premier plan (jamais d'Entrée).
- **Lot 3 : musique.** « Quel est ce titre ? » (lu dans Windows, sans réseau ni jeton, y compris pour une vidéo dans le navigateur), « aime ce titre », aléatoire, « joue la playlist … » (parmi les playlists du compte). Les droits demandés au compte de musique sont étendus : une reconnexion est nécessaire.
- **Lot 4 : internet sans modèle.** Voir [Le cœur IA](#coeur-ia) : météo, conversions, titres, compte à rebours, traduction par un petit appel.
- **Lot 5 : Notion.** Six outils (décaler ou supprimer un rendez-vous, valider un jalon, note rapide, bilans de la semaine, « que devrais-je faire maintenant ? »), avec confirmation vocale avant toute écriture et un garde-fou commun : plusieurs entrées qui collent, ou aucune, ne modifient rien. Voir [Les outils IA](#outils-ia).
- **Lot 6 : Telegram et PC.** « Mon PC est-il allumé ? » (le PC signale sa présence au backend toutes les 2 minutes, la réponse dit depuis quand), « envoie-moi ça sur Telegram » (le texte copié, coupé à 3 500 caractères, posté dans le seul chat autorisé). Voir [Sécurité](#securite).

## Statut

<span class="st st-ok">Fait</span> Validé par l'utilisateur le 10/11/2026 (« tout est bon, il ne reste que l'étape 12 et 8 »), **sur sa parole : je n'ai rien rejoué**. Avant sa validation, les lots n'avaient été essayés que contre des simulations : faux Spotify local, faux client Notion, faux serveurs HTTP, réponses simulées des APIs de météo et de taux, et des essais en lecture seule sur la vraie machine (sessions audio, sorties, appel de l'interface de changement de sortie sur la sortie déjà active). Deux défauts trouvés à l'usage ont été corrigés le 10/11 (bugs [22](#bugs) et [23](#bugs)).

<span class="st st-prop">Non vérifié</span> Ce que je ne peux pas confirmer : un vrai changement de sortie audio, la veille, l'extinction, la corbeille, le verrouillage, la dictée réelle, le micro coupé (non essayé : il aurait coupé l'écoute), les APIs réelles de taux de change et de cryptomonnaies, les restrictions d'API du compte de musique pour les applications en développement en 2026, et que le backend de ces lots ait été redéployé (sans lui, la présence et l'envoi vers Telegram répondent en erreur).

## Limites connues

Nombres en chiffres seulement (« vingt minutes » n'est pas compris) ; pas de liste des rappels en attente ; le volume par application agit sur la sortie par défaut seulement ; pas de délai personnalisé pour l'extinction ; les entrées de type Shift sont exclues des outils Notion et seules les 30 prochaines entrées sont cherchées ; F11 bascule sans connaître l'état de la fenêtre ; une personne qui dit « mets » suivi d'un titre contenant « son » ou « volume » peut déclencher la commande de volume ; le texte envoyé vers Telegram est du texte seulement (ni image ni fichier).

---

@@ page chantiers-v2 | II | F | Les chantiers de la V2 | Les neuf chantiers cadrés, leur statut et leurs décisions déjà prises.

| # | Chantier | Statut |
| --- | --- | --- |
| 1 | Une seule personnalité, retrait du mode ACTIF/PAUSE | <span class="st st-ok">Fait</span> le 07/10/2026 |
| 2 | Système de protocoles | Un protocole fait le 17/10/2026 et essayé en réel par l'utilisateur le 05/11/2026 (fonctionne) ; deux autres reportés (une ressource manque) |
| 3 | Fonctionnalités vocales | Applications, recherche, musique, volume, batterie, voix de sortie, reconnaissance locale, mot d'activation, près de vingt « broutilles » et réponses sans modèle faits (validés par l'utilisateur, 08 et 10/11/2026) ; « qu'est-ce que je regarde ? » abandonnée |
| 4 | Pauses de plusieurs jours | <span class="st st-ok">Fait</span> en version minimale le 06/10/2026, affichée dans le dashboard le 12/10/2026 |
| 5 | Widget de bureau, application fermée | Widget fait et validé par l'utilisateur le 08/11/2026 ; l'écoute fenêtre masquée existe (l'application tournait en démarrage automatique avec le serveur de reconnaissance lancé) |
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

- **Mot d'activation** : « Løra ». Le moteur prévu à l'origine était **openWakeWord** (open source, local, entraînement par génération synthétique). **Décision du 05/11/2026 : il n'est pas utilisé** ; le nom est cherché dans la transcription de Whisper local (parmi les trois premiers mots de la phrase), comme l'utilisateur l'a demandé, contre la recommandation d'un raccourci à maintenir. Voir [La voix de Løra](#voix).
- **Ordre de test**, du plus simple au plus dur : 1) lancer et fermer une application nommée ; 2) recherche rapide parlée ; 3) « qu'est-ce que je suis en train de regarder ? » : **abandonnée le 08/11/2026** (inutile, coût en jetons non rentable ; le modèle de vision inventait le contenu de l'écran).
- Musique, volume, batterie d'un périphérique : trois intégrations isolées au niveau système ; la batterie d'une souris dépend entièrement du fabricant.

## 4. Pauses de plusieurs jours

Faite en version minimale (voir [Briefings et pause](#briefings-pause)). **Affichée dans le dashboard depuis le 12/10/2026** ; la persistance dans Notion a été écartée (Redis suffit pour l'affichage).

## 5. Widget en barre des tâches, application fermée

Fondations faites en V1 (thread Rust résident, icône de zone de notification, démarrage avec Windows, installeur). Le widget animé est fait et validé par l'utilisateur (08/11/2026). L'écoute tourne dans le processus de l'application, y compris lancée avec Windows fenêtre masquée (voir [La voix de Løra](#voix)).

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

@@ page commandes | II | G | Commandes et variables | Les commandes npm, les scripts de configuration et les variables d'environnement.

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
| `npm run test:protocol` | Essai de bout en bout des protocoles : vrai worker et vrai endpoint avec de faux Redis, Telegram et QStash, et de vrais processus |

## Notion et QStash

| Commande | Effet |
| --- | --- |
| `npm run notion:check` | Vérifie la connexion Notion |
| `npm run notion:create` | Crée les bases Notion |
| `npm run notion:create-settings` | Crée la base Réglages |
| `npm run notion:categories-cleanup` | Simule la migration (ajout de « Catégorie », suppression des colonnes obsolètes) ; avec `-- --apply`, l'applique |
| `npm run notion:migrate-agenda-type` | Migration du champ Type de l'agenda |
| `npm run qstash:setup-schedules` | Configure les schedules QStash (briefing et bilan) |

## Fichiers locaux de l'application

Dans le dossier de données de l'application (`%APPDATA%\com.soza.assistant\`, l'ancien nom est gardé). Créés au premier lancement, relus à chaque usage, jamais versionnés.

| Fichier | Contenu |
| --- | --- |
| `apps.json` | Liste blanche des applications (nom → chemin) |
| `modes.json` | Les modes de travail : phrase de départ et étapes |
| `spotify.json`, `spotify-token.json` | Identifiants de l'application du service de musique ; jeton de renouvellement (en clair) pour les titres likés |
| `agent.json` | Adresse de l'API et clé pour récupérer les protocoles |
| `voice.json` | Volume de la voix, mots dits avec l'accent anglais ; `voice.log` et `voice/history/` gardent ce qui est dit |
| `listen.json` | Écoute du micro : activée, orthographes du mot d'activation, seuil, délai de la demande, journal en clair (`log`) |
| `claude.json` | Option de focus de la session Claude Code |
| `say.txt`, `claude-last.json` | Boîtes aux lettres écrites par les hooks de Claude Code |
| `usage.json` | Le temps d'écran |
| `reminders.json` | Les minuteurs et rappels en attente (ils survivent à un redémarrage) |
| `shortcuts.json` | Les noms de sites et de dossiers que Løra peut ouvrir (adresses `http(s)` ou dossiers existants) |
| `ambient.json`, `greeting.json` | Réglages de la parole spontanée (seuils, interrupteurs, option « ne pas dire » qui écrit dans un journal) ; le dernier bonjour dit (le supprimer pour le réentendre) |

La voix et l'écoute demandent des fichiers installés à la main (Piper et son modèle, le serveur Whisper et son modèle : environ 1,9 Go), depuis le 08/11/2026 dans un **dossier voisin** du dossier de données, que la désinstallation n'efface pas ; voir [La voix de Løra](#voix).

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

@@ page glossaire | II | H | Glossaire | Les termes techniques utilisés dans ce wiki.

| Terme | Définition |
| --- | --- |
| **Bento** | Disposition en cartes de tailles variées, comme les compartiments d'une boîte-repas. |
| **`chat_id`** | Identifiant d'une conversation Telegram ; seul celui de l'utilisateur autorisé est accepté. |
| **Cron** | Déclenchement planifié d'une fonction à heure fixe. |
| **CSP** | Politique de sécurité de contenu : liste des origines que la page a le droit de contacter. |
| **DWM** | Gestionnaire de fenêtres de Windows ; il permet de colorer la barre de titre (Windows 11). |
| **Edge (runtime)** | Environnement d'exécution léger de Vercel pour les fonctions. |
| **Friday** | Nom de la personnalité unique de Løra (efficacité tactique et finesse de conseil). |
| **Idempotent** | Qui peut être exécuté plusieurs fois avec le même résultat. |
| **NSIS** | Format d'installeur Windows produit par Tauri. |
| **QStash** | Service de file de messages et de planification (Upstash) : livre les jobs au worker et déclenche les crons. |
| **Redis (TTL)** | Base clé-valeur en mémoire ; une clé peut expirer seule après une durée de vie (TTL). |
| **`REST_FPS`** | Cadence du rendu une fois le ruban formé (60 images par seconde). |
| **Tauri** | Cadre d'application de bureau : interface web dans une fenêtre système, avec un cœur en Rust. |
| **Tool calling** | Mécanisme par lequel le modèle appelle des fonctions (les outils) avec des paramètres validés. |
| **TTS / STT** | Synthèse vocale / reconnaissance vocale. Absentes de la V1 ; faites en V2 (Piper et Whisper). |
| **WebView2** | Moteur web de Windows (basé sur Chromium) qui affiche l'interface de l'application. |
| **Zod** | Bibliothèque de validation de schémas ; ici limitée aux outils de l'IA. |
| **Hook** | Commande déclenchée par un événement d'un outil ; ici, la fin d'une réponse de Claude Code. |
| **Broutille** | Petite fonction vocale utile au quotidien (minuteur, volume d'une application, titre en cours…), livrée par lots. |
| **Présence** | Le signe de vie que le PC envoie au backend, pour répondre « mon PC est-il allumé ? ». |
| **Réponse directe** | Réponse fabriquée par le code, sans appeler le modèle : zéro jeton. |
| **Liste blanche** | Liste de ce qui est autorisé et rien d'autre : ici, les applications que Løra peut ouvrir ou fermer. |
| **Mode de travail** | Ensemble d'applications et de pages lancé par une phrase (« mode créatif », « mode dev »). |
| **Mot d'activation** | Le mot qui ouvre une demande vocale : « Løra ». |
| **Piper** | Moteur de synthèse vocale qui tourne en local ; la voix de Løra est un modèle Piper affiné. |
| **Protocole** | Séquence nommée d'étapes lancée par un message exact sur Telegram et exécutée par le PC. |
| **TPM (jetons par minute)** | La limite de débit du modèle gratuit : 8 000 jetons par minute et par modèle. |
| **Whisper** | Modèle de reconnaissance vocale ; ici whisper.cpp, local, sur la carte graphique. |
| **Widget** | La seconde fenêtre transparente qui n'affiche que le ruban quand Løra écoute ou parle. |
| **Möbius** | Surface à une seule face ; son équation paramétrique place les particules du ruban. |
| **Streak** | Compteur de jours consécutifs. <span class="st st-repl">Retiré</span> |
| **Proof of Work** | Preuve tangible d'une journée de travail. <span class="st st-repl">Retiré</span> |
| **ACTIF / PAUSE** | Ancien mode qui changeait le ton du modèle selon les horaires de travail. <span class="st st-repl">Retiré</span> |

---

@@ page sources | II | I | Sources | Les documents du dépôt Løra et les services utilisés.

Ce wiki est consolidé à partir du dépôt Løra (le dépôt GitHub et les dossiers gardent le nom Soza) et de son historique. En cas de conflit, le dépôt fait foi.

## Documents du dépôt Løra

| Fichier | Contenu |
| --- | --- |
| `README.md` | Présentation, structure, configuration, commandes |
| `docs/ai/STATUS.md` | État du projet : source d'état, daté et détaillé |
| `docs/ai/LoraV2.md` | Vision et chantiers de la V2 |
| `docs/ai/STATUS-V2.md` | Avancement de la V2 : ce qui est fait, mesuré, vérifié ou non |
| `docs/ai/CONTEXT.md` | Contexte donné à l'assistant de développement |
| `docs/product/UI.md` | Description de l'interface |
| `docs/product/NOTION-SCHEMA.md` | Propriétés Notion lues et écrites par le code (réécrit le 12/10/2026) |
| `docs/portfolio/BUILD-LOG.md` | Journal de construction et étude de cas |
| `tests/` | Les quatre familles de tests |

## Services et bibliothèques

Groq (modèle de langage), Vercel (hébergement et AI SDK), Upstash (QStash et Redis), Notion (API), Telegram (Bot API), Open-Meteo (météo), flux RSS (TechCrunch, Vogue), Piper (synthèse vocale locale), whisper.cpp (reconnaissance vocale locale), l'API web d'un service de musique, Frankfurter (taux de change) et CoinGecko (cryptomonnaies), des flux d'actualités français et anglais, Tauri 2, React, Vite, three.js, Zod, Vitest, Playwright. Le rendu Markdown de ce wiki utilise `marked` (licence MIT). Le jeu de données de départ de la voix (SIWIS) est sous licence CC-BY 4.0 : une attribution sera à prévoir si la voix est un jour distribuée.

## Ce que ce wiki ne contient pas

Aucun secret, aucune valeur de variable d'environnement, aucun identifiant de production, et peu de détails personnels : les noms d'appareils et de protocoles de la V2 sont généralisés.
