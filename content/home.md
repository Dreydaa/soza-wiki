@@ page accueil | - | - | Soza | Un assistant personnel piloté par Telegram, doublé d'une application de bureau Windows.

<div class="rule"><span class="st st-ok">Règle</span><span>En cas de conflit entre ce wiki et le dépôt Soza, le dépôt fait foi : <code>docs/ai/STATUS.md</code> est la source d'état du projet.</span></div>

Soza aide un utilisateur unique à garder une discipline de travail sur son projet en cours. Elle vit là où il est déjà (une conversation Telegram), écrit dans Notion, rédige un briefing le matin et un bilan le soir, et s'affiche dans une application de bureau où un ruban de Möbius en particules tourne derrière un tableau de bord en verre liquide.

Construite de zéro en trois semaines (16/09/2026 → 09/10/2026). **La V1 est terminée.** La V2 a démarré le 12/10/2026 : les étapes 0 à 7 sont faites (finition, applications lancées depuis une barre de commande, recherche web, volume et musique, plusieurs projets en parallèle) et un premier lot du moteur de protocoles est livré côté code (essai réel à faire). La voix, l'agent résident et les gestes de la main ne sont pas commencés. Voir [Avancement de la V2](#avancement-v2).

## En quelques chiffres

<div class="cards">
<div class="card"><b>108</b><span>commits sur main au 17/10/2026 (73 à la clôture de la V1)</span></div>
<div class="card"><b>~5 070</b><span>lignes de code (TypeScript, CSS, Rust), comptées le 09/10/2026</span></div>
<div class="card"><b>2 152</b><span>lignes de tests, comptées le 09/10/2026</span></div>
<div class="card"><b>13</b><span>outils IA exposés au modèle</span></div>
<div class="card"><b>6</b><span>endpoints serverless</span></div>
<div class="card"><b>5</b><span>bases Notion</span></div>
<div class="card"><b>318</b><span>tests rapides, tous verts (17/10/2026)</span></div>
<div class="card"><b>21</b><span>scénarios navigateur (dernière exécution : 21/21 à l'étape 6, 15/10/2026)</span></div>
</div>

Chiffres tirés de `git log` et du dépôt : commits au 17/10/2026, lignes de code au 09/10/2026 (non recomptées), tests rapides rejoués le 17/10/2026.

## État du projet

| Sujet | Statut |
| --- | --- |
| Backend en production (webhook, worker, crons, endpoint du dashboard) | <span class="st st-ok">Fait</span> |
| Briefings du matin et du soir rédigés par Soza, pause de plusieurs jours | <span class="st st-ok">Fait</span> |
| Texte réel des premiers briefings avec le code actuel | <span class="st st-prop">Non vérifié</span> |
| Application de bureau, installeur Windows, temps d'écran réel | <span class="st st-ok">Fait</span> |
| Démarrage automatique réel, menu de la zone de notification | <span class="st st-prop">Non vérifié</span> |
| 318 tests rapides (unitaires, intégration, régression) | <span class="st st-ok">Fait</span> |
| 2 scénarios d'acceptation de cadence (attentes périmées après le passage à 60 images/s) | <span class="st st-ok">Fait</span> corrigés le 12/10/2026 (étape 0) |
| Statut `Terminé` pour les idées, catégorie Notion lue et écrite par le code | <span class="st st-ok">Fait</span> écriture réelle vérifiée sur Notion le 13/10/2026 |
| Pause de plusieurs jours visible dans le dashboard | <span class="st st-ok">Fait</span> (étape 2) ; <span class="st st-prop">Non vérifié</span> sur le vrai Redis |
| Lag du dashboard : cause mesurée (réfraction du verre), réfraction coupée | <span class="st st-ok">Fait</span> (étape 3, ~120 % → ~30 % d'un cœur) |
| Ouvrir et fermer une application nommée depuis une barre de commande (liste blanche locale) | <span class="st st-ok">Fait</span> essayé et validé par l'utilisateur (étape 4) |
| Recherche web de Soza sur Telegram, avec repli si elle échoue | <span class="st st-ok">Fait</span> essayée sur le vrai modèle ; <span class="st st-prop">Non vérifié</span> sur un vrai message Telegram (étape 5) |
| Volume, musique, batterie de la souris depuis la barre de commande | <span class="st st-ok">Fait</span> essayés sur la vraie machine (étape 6) |
| Plusieurs projets en parallèle (bilan et briefings) | <span class="st st-ok">Fait</span> confirmé par l'utilisateur le 17/10/2026 (étape 7) |
| Moteur de protocoles et premier protocole | <span class="st st-ok">Fait</span> côté code, tests simulés ; <span class="st st-prop">Non vérifié</span> essai réel sur le PC (étape 8) |
| Mode ACTIF/PAUSE, streak, Proof of Work | <span class="st st-repl">Retiré</span> |
| Voix, agent résident et widget, gestes de la main | <span class="st st-vision">V2</span> |

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

Wiki consolidé le 09/10/2026 d'après le dépôt Soza : README, état du projet, journal de construction, document de la V2, code et tests.
