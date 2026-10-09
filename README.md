# Wiki Soza

Wiki de documentation du projet **Soza** (assistant personnel piloté par Telegram, doublé d'une application de bureau Windows). Un site statique à page unique : barre latérale numérotée, recherche, onglets de pages ouvertes, rail « dans cette page », statuts colorés.

Le contenu est consolidé à partir du dépôt Soza (README, état du projet, journal de construction, document de la V2, code et tests) au **09/10/2026**. En cas de conflit, le dépôt Soza fait foi.

## Contenu

22 pages en deux parties.

- **Partie I : le projet (V1)** : en bref, architecture, cœur IA, outils IA, briefings et pause, données, déploiement, application de bureau, dashboard en verre, avatar (ruban de Möbius), tests, sécurité, décisions, retraits, bugs et causes racines, clôture de la V1.
- **Partie II : référence et V2** : chronologie, vision V2, chantiers V2, commandes et variables, glossaire, sources.

## Lancer en local

Le site charge ses pages avec `fetch` : il faut un serveur web, pas un double-clic sur `index.html`.

```bash
python -m http.server 8099
# puis ouvrir http://localhost:8099
```

Aucune étape de build, aucune dépendance à installer (le rendu Markdown, `marked`, est fourni dans `assets/`).

## Raccourcis

- `/` : rechercher
- `Ctrl` + clic : ouvrir une page dans un nouvel onglet
- `Suppr` : fermer l'onglet courant

## Structure

```
index.html            squelette de la page
assets/app.js         routage par #, barre latérale, onglets, recherche
assets/style.css      styles (palette, polices, mise en page responsive)
assets/marked.min.js  rendu Markdown (marked 12.0.2, licence MIT)
content/              les pages, en Markdown
```

## Ajouter ou modifier une page

Les pages sont dans `content/*.md`. Chaque page commence par une ligne d'en-tête :

```
@@ page identifiant | partie | numéro | Titre | résumé d'une phrase
```

- `partie` vaut `I` ou `II` (les parties sont déclarées dans `PARTS` au début de `assets/app.js`) ;
- `numéro` est un chiffre pour un chapitre, une lettre pour une annexe ;
- les titres `##` d'une page alimentent le rail « dans cette page » ;
- un lien vers une autre page s'écrit `[texte](#identifiant)` ;
- un statut s'écrit `<span class="st st-ok">Fait</span>` (`st-ok`, `st-prop`, `st-vision`, `st-repl`).

Une nouvelle page est ajoutée dans l'un des fichiers déjà listés dans `FILES` (`assets/app.js`), ou dans un nouveau fichier ajouté à cette liste.

## Publier

Le dépôt est **privé**. C'est un site statique : il se déploie tel quel sur n'importe quel hébergeur de fichiers statiques (par exemple Vercel, sans commande de build, avec la racine du dépôt comme dossier de sortie). Avant de le rendre public ou de le déployer, relire le contenu : il décrit l'architecture interne, le schéma des bases et les noms des variables d'environnement du projet. Il ne contient aucun secret, aucune valeur de variable ni identifiant de production.
