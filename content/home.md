@@ page accueil | - | - | Løra | Un assistant personnel piloté par Telegram, doublé d'une application de bureau Windows.

<div class="rule"><span class="st st-ok">Règle</span><span>En cas de conflit entre ce wiki et le dépôt Løra, le dépôt fait foi : <code>docs/ai/STATUS.md</code> est la source d'état du projet.</span></div>

Løra aide un utilisateur unique à garder une discipline de travail sur son projet en cours. Elle vit là où il est déjà (une conversation Telegram), écrit dans Notion, rédige un briefing le matin et un bilan le soir, et s'affiche dans une application de bureau où un ruban de Möbius en particules tourne derrière un tableau de bord en verre liquide.

Construite de zéro en trois semaines (16/09/2026 → 09/10/2026). **La V1 est terminée** (l'utilisateur a soldé le 10/11/2026 sa liste « non vérifié »). La V2 a démarré le 12/10/2026 et avance étape par étape : applications lancées depuis une barre de commande, recherche web, volume et musique, plusieurs projets en parallèle, protocoles lancés depuis Telegram (le premier essayé en réel), puis, en novembre, une voix (synthèse entraînée sur des enregistrements consentis, reconnaissance locale avec mot d'activation « Løra »), un widget de bureau, des commandes de contrôle, des modes de travail, la lecture d'une session Claude Code, près de vingt « broutilles » vocales, des réponses sans modèle et une parole spontanée. Les étapes 9, 10 et 13 sont validées par l'utilisateur (08/11/2026) ; « qu'est-ce que je regarde ? » est abandonnée ; il reste les gestes de la main et deux protocoles reportés. L'assistante s'appelait Soza jusqu'au 05/11/2026. Voir [Avancement de la V2](#avancement-v2), [La voix de Løra](#voix) et [Les commandes de Løra](#commandes-vocales).

## En quelques chiffres

<div class="cards">
<div class="card"><b>176</b><span>commits sur main au 10/11/2026 (73 à la clôture de la V1)</span></div>
<div class="card"><b>~5 070</b><span>lignes de code (TypeScript, CSS, Rust), comptées le 09/10/2026</span></div>
<div class="card"><b>2 152</b><span>lignes de tests, comptées le 09/10/2026</span></div>
<div class="card"><b>26</b><span>outils IA exposés au modèle</span></div>
<div class="card"><b>8</b><span>endpoints serverless</span></div>
<div class="card"><b>5</b><span>bases Notion</span></div>
<div class="card"><b>472</b><span>tests rapides, tous verts (09/11/2026)</span></div>
<div class="card"><b>23</b><span>scénarios navigateur, tous verts (08/11/2026)</span></div>
</div>

Chiffres tirés de `git log` et du dépôt : commits au 10/11/2026 ; lignes de code au 09/10/2026 (non recomptées) ; tests d'après l'état du projet (472 rapides et 149 Rust le 09/11/2026, 23 scénarios navigateur le 08/11/2026), non rejoués pour cette mise à jour du wiki.

## État du projet

| Sujet | Statut |
| --- | --- |
| Backend en production (webhook, worker, crons, endpoint du dashboard) | <span class="st st-ok">Fait</span> |
| Briefings du matin et du soir rédigés par Løra, pause de plusieurs jours | <span class="st st-ok">Fait</span> |
| Texte réel des briefings du matin et du soir avec le code actuel | <span class="st st-ok">Fait</span> lus dans Redis le 08/11/2026 (le « demain » du bilan est bien devenu « aujourd'hui ») |
| Application de bureau, installeur Windows, temps d'écran réel | <span class="st st-ok">Fait</span> |
| Démarrage automatique réel, menu de la zone de notification, liste « non vérifié » de la V1 | <span class="st st-ok">Fait</span> déclarés soldés par l'utilisateur le 10/11/2026 (« la V1 est finie, tout est bon »), non rejoués par moi |
| 472 tests rapides (unitaires, intégration, régression), 149 tests Rust, 23 scénarios navigateur | <span class="st st-ok">Fait</span> |
| 2 scénarios d'acceptation de cadence (attentes périmées après le passage à 60 images/s) | <span class="st st-ok">Fait</span> corrigés le 12/10/2026 (étape 0) |
| Statut `Terminé` pour les idées, catégorie Notion lue et écrite par le code | <span class="st st-ok">Fait</span> écriture réelle vérifiée sur Notion le 13/10/2026 |
| Pause de plusieurs jours visible dans le dashboard | <span class="st st-ok">Fait</span> (étape 2) ; la lecture de la clé en production marche (`pause: null`) ; la pause posée par conversation est comptée parmi les points soldés par l'utilisateur le 10/11/2026 |
| Lag du dashboard : cause mesurée (réfraction du verre), réfraction coupée | <span class="st st-ok">Fait</span> (étape 3, ~120 % → ~30 % d'un cœur) |
| Ouvrir et fermer une application nommée depuis une barre de commande (liste blanche locale) | <span class="st st-ok">Fait</span> essayé et validé par l'utilisateur (étape 4) |
| Recherche web de Løra sur Telegram, avec repli si elle échoue | <span class="st st-ok">Fait</span> essayée sur le vrai modèle ; <span class="st st-prop">Non vérifié</span> sur un vrai message Telegram (étape 5) |
| Volume, musique, batterie de la souris depuis la barre de commande | <span class="st st-ok">Fait</span> essayés sur la vraie machine (étape 6) |
| Plusieurs projets en parallèle (bilan et briefings) | <span class="st st-ok">Fait</span> confirmé par l'utilisateur le 17/10/2026 (étape 7) |
| Moteur de protocoles et premier protocole | <span class="st st-ok">Fait</span> essayé en réel par l'utilisateur le 05/11/2026 (étape 8) ; deux autres protocoles reportés (une ressource manque) |
| Voix de sortie entraînée sur des enregistrements consentis (Piper), repli sur la voix de Windows | <span class="st st-ok">Fait</span> validée par l'utilisateur le 08/11/2026, accents jugés satisfaisants |
| Reconnaissance vocale locale (Whisper) et mot d'activation « Løra » | <span class="st st-ok">Fait</span> essayés avec la vraie voix le 05/11/2026, validés le 08/11/2026 |
| Ruban qui réagit à l'état et à la vraie voix, widget de bureau | <span class="st st-ok">Fait</span> validés par l'utilisateur le 08/11/2026 (étape 10) |
| Commandes « stop », « repose-toi », « fin de mission » ; modes de travail ; lire, dicter et envoyer dans Claude Code | <span class="st st-ok">Fait</span> validées par l'utilisateur le 08/11/2026 (sur sa parole) |
| Près de vingt « broutilles » locales : minuteurs, rappels, heure, temps d'écran, sites et dossiers, fenêtres, volume par application, sortie audio, micro, verrouillage / veille / extinction avec confirmation, presse-papiers, dictée, musique (titre en cours, like, aléatoire, playlist) | <span class="st st-ok">Fait</span> validées par l'utilisateur le 10/11/2026 (« tout est bon », sur sa parole) ; deux défauts trouvés à l'usage et corrigés |
| Réponses sans modèle : météo de demain, conversions, titres du jour, compte à rebours, « mon PC est-il allumé ? », « envoie-moi ça sur Telegram » | <span class="st st-ok">Fait</span> validées le 10/11/2026 ; essayées avant seulement avec des réponses et des serveurs simulés |
| Six outils Notion : décaler ou supprimer un rendez-vous, valider un jalon, note rapide, bilans de la semaine, « que faire maintenant ? » | <span class="st st-ok">Fait</span> validés le 10/11/2026 ; essayés avant contre un faux Notion |
| Briefing du matin avec résumés et liens, actualités par thème à la demande | <span class="st st-ok">Fait</span> côté code ; <span class="st st-prop">Non vérifié</span> essai réel non consigné |
| Løra prend la parole d'elle-même (rendez-vous, batterie de la souris, pause pour le dos) et dit bonjour au démarrage | <span class="st st-ok">Fait</span> côté code ; <span class="st st-prop">Non vérifié</span> essai réel non consigné |
| « Qu'est-ce que je regarde ? » | <span class="st st-repl">Retiré</span> abandonnée le 08/11/2026 (inutile, coût en jetons, le modèle de vision inventait le contenu de l'écran) |
| Passe sécurité sur le code réel | <span class="st st-ok">Fait</span> faite le 08/11/2026, rien de bloquant (points à connaître dans [Sécurité](#securite)) |
| Renommage Soza → Løra (05/11/2026) | <span class="st st-ok">Fait</span> dans le code et la documentation ; quelques identifiants gardent l'ancien nom ; une réinstallation a effacé la voix le 06/11 (parade en place, voir le bug [21](#bugs)) |
| Mode ACTIF/PAUSE, streak, Proof of Work | <span class="st st-repl">Retiré</span> |
| Gestes de la main | <span class="st st-vision">V2</span> |

## Légende des statuts

| Statut | Signification |
| --- | --- |
| <span class="st st-ok">Fait</span> | Livré et vérifié |
| <span class="st st-prop">Non vérifié</span> | Livré, mais sa vérification n'est pas consignée |
| <span class="st st-repl">Retiré</span> | Existait, supprimé volontairement |
| <span class="st st-repl">Échec connu</span> | Un test échoue et c'est écrit |
| <span class="st st-vision">V2</span> | Cadré, pas commencé |

## Comment lire ce wiki

- **Deux minutes** : le chapitre 1 (En bref) et le chapitre 16 (Clôture de la V1).
- **Dix minutes** : l'architecture (2), le cœur IA (3), les bugs et leurs causes racines (15).
- **Pour relire le projet comme un pair** : les décisions et compromis (13), les tests (11), la sécurité (12), les limites (16).
- Appuyez sur <kbd>/</kbd> pour chercher, <kbd>Ctrl</kbd>+clic pour ouvrir une page dans un nouvel onglet, <kbd>Suppr</kbd> pour fermer l'onglet courant.

Wiki consolidé le 09/10/2026 d'après le dépôt Soza, mis à jour le 17/10, le 06/11 puis le 10/11/2026 : README, état du projet, journal de construction, documents de la V2, code et tests.
