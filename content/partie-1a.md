@@ page en-bref | I | 1 | En bref | Le problème, la réponse, le statut et les chiffres clés.

## Le problème

Tenir une discipline de travail sur un projet personnel, malgré des horaires de travail postés (shifts) qui fatiguent. Deux exigences opposées à concilier : demander de la régularité sans mettre la pression quand le corps est épuisé.

## La réponse

Un assistant qui vit là où l'utilisateur est déjà, une conversation Telegram :

- il comprend le langage naturel (« ajoute un rendez-vous jeudi à 14 h », « je prends mon week-end ») et agit dans Notion via des outils IA ;
- il envoie un **briefing le matin** (météo, agenda, bilan de la veille) et demande un **bilan le soir**, à des horaires modifiables en conversation ;
- une **application de bureau** (Tauri + React) affiche tout cela dans un tableau de bord en « verre liquide », devant un ruban de Möbius en particules animé en temps réel ;
- depuis la V2, elle répond aussi aux **questions extérieures** par une recherche web (réponse courte, lisible à voix haute), suit **plusieurs projets en parallèle**, et exécute des **commandes locales** (ouvrir ou fermer une application, volume, musique) depuis une barre `Ctrl+K` ;
- un message exact sur Telegram peut lancer un **protocole** : une séquence d'étapes que le PC va chercher et exécute ;
- elle **parle et écoute** : chaque réponse de `Ctrl+K` est dite à voix haute avec une voix entraînée sur des enregistrements consentis, et une phrase qui commence par « Løra » est comprise par une reconnaissance vocale locale (voir [La voix de Løra](#voix)) ;
- à la voix, elle lance aussi des **modes de travail** et peut **lire ou écrire dans une session Claude Code**.

## Un cadrage qui a évolué

Løra est née comme un coach de discipline à deux personnalités (une exigeante, une protectrice, selon les horaires de travail). Le 07/10/2026, l'utilisateur tenant sa cadence de travail, ce cadrage a été abandonné : une seule personnalité (« Friday »), plus de mode ACTIF/PAUSE, le produit se rapprochant d'un assistant du type Jarvis/FRIDAY. Le retrait a touché le backend (modes, prompts, outils, accès Notion, briefing, API du dashboard), les scripts et le front. Voir [Ce qui a été retiré](#retraits).

## Un nouveau nom

L'assistante s'appelait Soza, un prénom masculin choisi comme nom provisoire. Le 05/11/2026, l'utilisateur l'a rebaptisée **Løra** pour de bon, avant d'attaquer la reconnaissance vocale. Le code et la documentation sont renommés. Quelques identifiants gardent volontairement l'ancien nom, parce que les renommer casserait un état existant : le dossier de données de l'application, l'adresse du déploiement, les identifiants des planifications QStash (en créer de nouvelles enverrait deux briefings le matin), le dépôt GitHub. Le « ø » ne se décompose pas comme « é » : il est ramené à « o » pour retrouver un projet par son nom et pour la prononciation de la voix.

## Statut

La V1 a été déclarée terminée le 09/10/2026 (voir [Clôture de la V1](#cloture-v1)). Le backend est en production ; l'application de bureau a un installeur Windows. La V2 a démarré le 12/10/2026 et avance une pull request par étape (39 fusionnées au 06/11/2026, voir [Avancement de la V2](#avancement-v2)) : les étapes 0 à 8 sont faites, la voix (étape 9) et le widget (étape 10) sont faits côté code, et l'étape 13 (élargir les commandes vocales) a plusieurs lots. Les étapes 11 et 12 (« qu'est-ce que je regarde ? », gestes de la main) ne sont pas commencées (voir [Vision V2](#vision-v2) et [La voix de Løra](#voix)).

## Chiffres clés

| | |
| --- | --- |
| Durée | 3 semaines de V1 (premier commit le 16/09/2026, clôture le 09/10/2026), puis la V2 : étapes 0 à 8 du 12 au 20/10/2026, la voix et les commandes vocales du 18/10 au 06/11/2026 |
| Historique | 73 commits à la clôture, 155 sur `main` au 06/11/2026 (39 pull requests fusionnées) |
| Code suivi par git | ~5 070 lignes : `api/` 167, `lib/` 1 165, `src/` 3 135, `scripts/` 440, Rust 166 ; plus 2 152 lignes de tests |
| Tests | 529 : 411 rapides, 95 en Rust, 23 scénarios navigateur (rejoués le 06/11/2026 d'après l'état du projet) ; 13 essais réels en Rust sont ignorés par défaut |
| Endpoints serverless | 7 |
| Outils IA exposés au modèle | 19, plus la recherche web intégrée du fournisseur |
| Bases Notion | 5 (Idées, Agenda, Jalons, Progression, Réglages) |
| Fournisseur du modèle | Groq (un second fournisseur a été essayé puis retiré) |
| Dépendances d'exécution | 13 |

---

@@ page architecture | I | 2 | Architecture | Les flux, les sept endpoints, les principes directeurs et l'organisation du dépôt.

## Vue d'ensemble

```
Telegram ──▶ api/telegram-webhook.ts ──▶ QStash (file) ──▶ api/qstash-worker.ts ──▶ Groq (LLM + 19 outils + recherche web) ──▶ Notion
                    │                                              │
                    ▼                                              ▼
             valide le chat_id                               répond sur Telegram

QStash Schedules ──▶ api/cron-morning.ts / api/cron-evening.ts ──▶ Notion + Telegram
                         (silencieux pendant une pause)

Application de bureau (Tauri) ──▶ api/dashboard.ts ──▶ Notion (lecture agrégée) + Redis (derniers briefings)
Application de bureau (Ctrl+K, micro) ──▶ api/ask.ts ──▶ même cerveau que Telegram ──▶ réponse affichée et dite

Redis : mémoire de conversation (10 messages, 6 h), derniers briefings (matin et soir), pause en cours
Application de bureau (Rust) : temps d'écran mesuré en local (jamais envoyé), zone de notification, démarrage avec Windows
```

## Les sept endpoints

| Endpoint | Rôle |
| --- | --- |
| `api/telegram-webhook.ts` | Reçoit les messages Telegram. Vérifie la méthode (POST), le secret partagé de l'en-tête, puis le `chat_id` ; publie un job dans QStash. Ignore tout le reste sans erreur. |
| `api/qstash-worker.ts` | Reçoit le job de QStash (signature vérifiée), appelle le modèle avec les outils, répond sur Telegram. |
| `api/cron-morning.ts` | Déclenché par un QStash Schedule : rédige et envoie le briefing du matin, enregistre la version courte pour le dashboard. Silencieux pendant une pause. |
| `api/cron-evening.ts` | Même mécanique pour le briefing du soir, qui se termine par la question du bilan. |
| `api/dashboard.ts` | Agrège Notion, les actualités et les derniers briefings pour l'application de bureau. Protégé par une clé. |
| `api/protocol.ts` | Appelé par l'application du PC (même clé que le dashboard) : remet une seule fois le protocole en attente, puis reçoit le statut de chaque étape et envoie le message de fin sur Telegram. |
| `api/ask.ts` | Reçoit les phrases de la barre `Ctrl+K` et du micro (même clé que le dashboard) et appelle le même `askLora` que Telegram, avec une consigne de réponse dite à voix haute. |

## Principes directeurs

1. **Le webhook ne fait jamais de travail long.** Il valide le `chat_id` autorisé et publie un job dans QStash ; un worker séparé appelle le modèle. Un appel IA lent ne fait donc ni expirer ni rejouer le webhook Telegram, et le système est rejouable.
2. **Toute action vérifie d'abord qui parle.** Le `chat_id` est contrôlé avant toute action ; les crons n'acceptent qu'une signature QStash valide (ou un secret de secours).
3. **Notion est la source de vérité** pour tout ce qui doit être consultable à distance (idées, agenda, jalons, bilans, réglages). Le backend lit et écrit, sans dupliquer d'état métier. Redis ne sert qu'à de l'éphémère.
4. **Les faits sont calculés dans le code, le modèle ne fait que rédiger.** C'est la leçon la plus transposable du projet (voir [Bugs et causes racines](#bugs), bug 7).

## Organisation du dépôt

```
api/        7 endpoints serverless (edge) : webhook, worker, crons, dashboard, protocole, ask
lib/        cœur métier : IA (client, outils, prompt), accès Notion, intégrations, mémoire Redis, dates, briefing
src/        application de bureau : features/ (glass, widgets, calendar, intro, particles, hub…)
src-tauri/  application de bureau en Rust : fenêtre, temps d'écran, zone de notification, démarrage automatique, commandes locales (applications, volume, musique, batterie), agent de protocoles, voix de sortie (Piper), écoute du micro (Whisper), commandes de contrôle, modes de travail, Claude Code, widget
tests/      unit, integration, regression, acceptance + faux Notion, faux Redis et réseau bloqué
scripts/    configuration et migration Notion/QStash, test contre les vraies APIs
docs/       état du projet, contexte IA, V2, journal de construction
```

---

@@ page coeur-ia | I | 3 | Le cœur IA | Appel d'outils, prompt de personnalité, doute, date du jour, mémoire et repli.

Le modèle ne « répond » pas seulement : il agit, via 19 outils (voir [Les outils IA](#outils-ia)), chacun défini par un schéma Zod. Il est appelé par `askLora` (`lib/ai/client.ts`) avec le Vercel AI SDK et le fournisseur Groq (modèle par défaut `openai/gpt-oss-120b`, réglable par la variable `GROQ_MODEL`).

## Ce qui est envoyé au modèle

Le système est la concaténation de trois blocs : le prompt de personnalité (`friday.ts`), la consigne de doute, et la date du jour au fuseau de Paris. À cela s'ajoutent les 10 derniers messages de la conversation (gardés 6 heures dans Redis).

## Une phrase peut déclencher plusieurs actions

Jusqu'à 4 étapes d'outils par message (« crée cette idée et planifie un point jeudi »).

## Le doute vaut mieux que l'action

Une consigne dédiée interdit de créer une idée ou un jalon sur une intention ambiguë : le modèle pose d'abord une question courte. Validé en conditions réelles.

## Une seule personnalité

Deux prompts de personnage (l'un exigeant, l'autre protecteur, choisis selon l'heure) ont été fusionnés en un seul, `friday.ts`, rédigé par l'utilisateur :

- Løra est « LØRA, opérateur système IA personnel » : une personnalité qui fusionne l'efficacité tactique de FRIDAY et la finesse de J.A.R.V.I.S., en français ;
- deux registres : **opérationnel** (court, factuel, propose une action) et **conseil** (déclenché par un évitement répété, une décision risquée, le briefing du matin ou le bilan) ;
- appellations : « Boss », « patron », « chef », **tirées au hasard par le code** pour les briefings du matin et du soir et pour les réponses dites à voix haute (le modèle n'a pas de mémoire d'un appel à l'autre et retombait toujours sur « patron »), **jamais dans le texte écrit sur Telegram** ; l'utilisateur a autorisé les surnoms à l'oral le 05/11/2026 ; « Monsieur » seulement pour une remarque pointue ;
- **le prénom de l'utilisateur n'est jamais dit ni écrit**, même s'il figure dans les données (la voix lit les textes à voix haute) : une règle explicite du prompt, testée sur le contenu du prompt seulement ;
- toujours au **tutoiement** (« tu », « ton ») : un mélange tu/vous avait été constaté à l'oral comme sur Telegram, la règle est maintenant en tête du prompt ;
- elle ne parle jamais d'elle à la troisième personne : quand l'utilisateur parle de Løra (le bot, l'app, le dashboard, les briefings), il parle d'elle.

## Le modèle décide des détails qu'il peut décider

La taille d'un projet (Petit / Moyen / Grand) est estimée par le modèle selon une grille donnée dans la description de l'outil, au lieu d'être demandée à l'utilisateur. À l'inverse, il lui est interdit d'inventer le contenu d'une note.

## Les entrées d'un modèle ne respectent pas votre schéma

Groq renvoie parfois `null` pour un paramètre optionnel au lieu de l'omettre ; avec `.optional()`, toute la validation échouait et l'action se perdait sans message. Les six paramètres concernés utilisent `.nullish()`.

## Un modèle ne connaît pas la date du jour

Le prompt de conversation ne contenait aucune date : « ce week-end » ou « demain » ne pouvaient pas être convertis en dates réelles pour les outils. La date du jour (fuseau de Paris) est désormais injectée.

## Peser les appels : la limite de débit de Groq

Le palier gratuit de Groq limite chaque modèle à **8 000 jetons par minute** et à 200 000 par jour. Un appel avec tous les outils pèse environ 3 700 jetons avant même le message de l'utilisateur, et une action en demandait deux. Quatre mesures, toutes par allègement (l'utilisateur refuse tout palier payant) :

- le second appel d'une action n'envoie plus d'outils (7 603 → 5 275 jetons, −31 %) ;
- sur une limite 429, le modèle suivant prend le relais (`gpt-oss-20b`, qui suit moins bien la personnalité et n'a pas de recherche web), jamais après qu'un outil a écrit ;
- les descriptions d'outils sont raccourcies ;
- **seuls les outils évoqués par le message sont envoyés** : routage par mots-clés, accents et majuscules ignorés ; aucun mot reconnu = tous les outils, pour ne jamais bloquer une action.

Le cache de prompt de Groq ne se déclenche pas sur ce compte : on ne compte pas dessus. Voir le bug [16](#bugs) pour l'incident qui a déclenché ce travail. <span class="st st-prop">Non vérifié</span> Le repli de modèle contre un vrai refus (testé avec des simulations).

## Parler à voix haute

Une phrase venue de `Ctrl+K` ou du micro passe par `api/ask`, qui appelle le même `askLora` que Telegram (mêmes outils, même historique) avec une consigne en plus : 2 à 4 phrases, sans liste, nombres écrits comme on les prononce, code météo jamais lu tel quel. Les « C'est fait. » collés à une réponse d'information sont retirés en code quand aucun outil d'écriture n'a tourné. **Une demande vocale demande confirmation avant toute écriture dans Notion** (« je le fais ? ») et n'appelle l'outil qu'après un « oui » au message suivant ; le texte tapé et Telegram ne changent pas. Les lectures (briefing, agenda, idées, météo, dernier bilan, réglages) sont des outils à part. Essai réel le 05/11/2026 (vrai modèle, vrai Notion, lecture seule) : météo, briefing relu, projets avec avis, `17 fois 23` = 391, agenda de la semaine, recherche.

## Ne jamais deviner

Une consigne de franchise est ajoutée à toutes les conversations : ne jamais inventer une information, un résultat ou une réponse ; ne dire sur Løra et sur l'utilisateur que ce qu'un outil a rendu dans l'échange ; sinon le dire en une phrase et proposer comment l'obtenir ; ne jamais annoncer une action faite sans la confirmation de l'outil. C'est une consigne au modèle, pas un filtre : seul ce qui lui est envoyé est testé. Les briefings, eux, reçoivent des faits calculés par le code.

## Repli

Si le modèle ne produit aucun texte après avoir appelé un outil, la réponse est « ✅ Action enregistrée. » ; s'il n'a rien fait, « Je n'ai rien fait — peux-tu préciser ? ». Pour les briefings, si le modèle est indisponible (quota, panne), un briefing basique est envoyé plutôt que de faire échouer le cron.

Zod n'est plus utilisé que par les outils de l'IA : le webhook et le worker ont leur propre validation (voir [Sécurité](#securite)).

---

@@ page outils-ia | I | 4 | Les outils IA | Les 19 outils que le modèle peut appeler, et ceux qui ont été retirés.

Définis dans `lib/ai/tools.ts`. Chaque outil a un schéma Zod et une description qui guide le modèle.

| Outil | Ce qu'il fait |
| --- | --- |
| `create_idea` | Enregistre une idée dans Notion. Le modèle estime la taille (Petit / Moyen / Grand) et rédige une synthèse complète du fond et de la forme dans `notes`. Un statut de départ n'est renseigné que si l'utilisateur le précise. |
| `update_idea_notes` | Remplace la synthèse d'une idée déjà enregistrée (en combinant l'ancien contenu et les nouvelles précisions). |
| `update_idea_status` | Change le statut d'un projet : Brute, En cours ou Archivée. |
| `create_milestone` | Crée un jalon de 7 à 10 jours, éventuellement lié à une idée. |
| `complete_project` | Marque un projet comme terminé : passe l'idée en `Terminé` (`Archivée` = abandonné) et valide son jalon lié. |
| `suggest_projects` | Propose 3 idées à commencer, une par taille, en priorisant les plus anciennes. |
| `add_agenda_item` | Ajoute un item ponctuel à l'agenda (date, heure et fin optionnelles). |
| `add_shift_schedule` | Crée un bloc par jour ouvré pour un rythme de travail récurrent (type « Shift »). |
| `list_milestones` | Liste les jalons non validés, triés par échéance. |
| `update_briefing_schedule` | Change l'heure du briefing du matin ou du bilan du soir (met à jour le QStash Schedule et la base Réglages). |
| `set_break` | Met Løra en pause entre deux dates : plus de briefing ni de bilan, et l'absence de bilan n'est pas reprochée. |
| `cancel_break` | Annule la pause en cours ou programmée. |
| `record_progress` | Enregistre le bilan du jour dans Notion. Reçoit aussi, quand il y a plusieurs projets en cours, la liste de ceux sur lesquels l'utilisateur a avancé (`projectsWorkedOn`), écrite en tête du texte et rapprochée des vrais titres par le code, et `finishedProjects` (les projets dits terminés, terminés **après** l'écriture du bilan : une panne ne perd pas le bilan). |
| `get_settings` | Lecture seule : heures du briefing et du bilan, pause en cours ou à venir, noms des applications déclarées par le PC. Chaque source est lue à part : une qui échoue est rendue « indisponible » sans masquer les autres. |
| `get_agenda` | Lit l'agenda avec un libellé de jour calculé par le code (« demain », « dans 10 jours, dimanche 15/11 »), car le modèle comptait mal les jours de la semaine. |
| `list_ideas` | Liste les idées par statut ou mot du titre (25 au plus ; les notes seulement sur recherche). |
| `get_weather` | Météo du moment. |
| `get_last_progress` | Dernier bilan enregistré. |
| `get_briefing` | Redit presque tel quel le dernier briefing du matin ou du soir déjà généré. |

**Recherche web.** En plus de ces 19 outils, le modèle dispose de la recherche intégrée du fournisseur (`web_search`). Il décide seul de s'en servir, pour une question extérieure ou récente seulement (jamais pour l'agenda ou les projets). La réponse doit tenir en deux ou trois phrases sans liste ni lien, et les marques de citation que la recherche ajoute sont retirées par le code. Si Groq rejette l'outil, un second essai a lieu sans la recherche, mais seulement si aucun outil d'écriture n'a déjà tourné. Voir [Avancement de la V2](#avancement-v2), étape 5, pour le coût en jetons. **Tous les outils ne sont pas envoyés à chaque message** : un routage par mots-clés (`lib/ai/tool-routing.ts`) ne garde que ceux que le message évoque (voir [Le cœur IA](#coeur-ia)).

## Pourquoi un bloc par jour de shift

L'API Notion ne gère pas les évènements récurrents : un bloc unique pour toute la période s'afficherait comme un seul évènement continu dans Notion Calendar. Les blocs « Shift » sont exclus du briefing du matin, sinon un planning de plusieurs semaines noierait les rendez-vous personnels.

## Outils retirés

| Outil | Pourquoi |
| --- | --- |
| `update_mode_schedule` | Il ne servait qu'à piloter l'ancien basculement ACTIF/PAUSE (retiré le 07/10/2026). |
| `get_progress_context` | Il n'existait que pour nourrir le contrôle du streak (retiré le 30/09/2026). |

---

@@ page briefings-pause | I | 5 | Briefings et pause | Comment le briefing du matin et celui du soir sont construits, et comment une pause les suspend.

## Principe : les faits sont calculés, le modèle rédige

Le code (`lib/briefing.ts`) calcule les faits et les donne au modèle sous forme de lignes de contexte ; le modèle n'a rien à déduire. Si le modèle est indisponible, un briefing basique est envoyé.

## Le briefing du matin

| Ligne de contexte | Règle |
| --- | --- |
| Bilan d'hier | Repris seulement s'il est daté d'hier, ou d'aujourd'hui (saisi après minuit). Sinon le modèle reçoit « Bilan d'hier : AUCUN, le dernier date du … » et doit le signaler sans ressortir l'ancien bilan. |
| Agenda | Seuls les rendez-vous des **7 prochains jours** (5 au maximum), chacun avec son échéance en toutes lettres : « aujourd'hui », « demain à 14:30 », « dans 4 jours, dimanche 11/10 ». Les blocs Shift sont exclus. |
| Météo | Une ligne, depuis Open-Meteo. |
| Actualités | Deux flux (Tech, Mode), citées seulement si elles apportent quelque chose. |

Le briefing envoyé sur Telegram est le texte complet. Une version courte (bilan et météo, deux à trois phrases) est générée en même temps, enregistrée dans Redis (`last-briefing`, 20 heures) et affichée dans l'application de bureau : c'est un second appel au modèle par matin.

## Le briefing du soir

Rédigé par Løra avec la même personnalité : la journée (tâches faites sur le total, puis celles qui restent, hors Shift), le prochain jalon, l'agenda des 7 jours, puis la question du bilan. **Ni météo ni actualités.**

Garde-fous :

- le prompt interdit d'inventer du travail et de conclure qu'une journée est improductive parce que l'agenda est vide ;
- si le texte ne contient pas le mot « bilan », une question de bilan est ajoutée, parce que le briefing du matin en dépend ;
- si le modèle est indisponible, l'ancienne phrase fixe de demande de bilan part quand même.

Une version courte est enregistrée dans Redis (`last-evening-briefing`, 20 heures) pour le dashboard.

## La pause de plusieurs jours

« Je prends mon week-end » : le modèle appelle `set_break` avec une date de début et de fin.

- La pause est stockée dans **Redis** (clé `break`, dates `AAAA-MM-JJ`), avec une durée de vie qui expire 3 jours après la fin, pour que le briefing de reprise sache que la veille était en pause.
- Pendant la pause, `cron-morning` et `cron-evening` répondent « ignoré » et n'envoient rien.
- Le lendemain de la fin, le briefing n'annonce pas de bilan manquant : il accueille la reprise et rappelle le dernier bilan d'avant la pause. Le surlendemain, l'absence de bilan est de nouveau signalée.
- Elle n'est pas dans Notion : cela évite de modifier le schéma d'une base de production pour un état transitoire. Contrepartie : elle n'est pas visible dans Notion ni encore dans le dashboard.

## Fin de projet, jalons manqués et mots relatifs (novembre 2026)

- **Un projet dit terminé dans un bilan est terminé dans Notion** (03/11) : `record_progress` accepte la liste des projets terminés, les termine après avoir écrit le bilan, rapproche leurs noms des projets en cours et valide **tous** les jalons ouverts liés. La consigne héritée « demande une preuve concrète pour valider un jalon » est remplacée par « la parole de l'utilisateur suffit ». Voir le bug [18](#bugs).
- **Jalons manqués** : au début du cron du matin, les jalons « À faire » à l'échéance passée passent en « Manqué » (un statut Notion seulement : aucune dégradation visuelle). Au premier cron après le déploiement, tous les jalons déjà en retard passent d'un coup.
- **Mots relatifs du bilan décalés par le code** (04/11) : le bilan est écrit la veille, donc son « demain matin » devient « ce matin » dans le briefing, par une fonction et non par une consigne au modèle. Voir le bug [17](#bugs). Un jour en toutes lettres (« demain jeudi »), « cette semaine » et « le week-end » ne sont pas décalés.

---

@@ page donnees | I | 6 | Les données | Les cinq bases Notion, les clés Redis et le fichier local de temps d'écran.

Notion est la source de vérité. Le schéma ci-dessous vient du code (`lib/notion/`) ; le fichier `docs/product/NOTION-SCHEMA.md` du dépôt est antérieur à plusieurs retraits.

## Bases Notion

| Base | Propriétés utilisées |
| --- | --- |
| **Idées** | Titre (title), Taille (select : Petit / Moyen / Grand), Date d'entrée (date), Statut (select : Brute / En cours / Terminé / Archivée), Notes (rich_text), Catégorie (select) |
| **Agenda** | Titre (title), Date (date, avec heure et fuseau Europe/Paris si connue), Statut (select, dont « À faire » et « Fait »), Type (select : Perso / Shift), Catégorie (select) |
| **Jalons** | Titre (title), Échéance (date), Statut (select, dont « Validé »), Preuve (url), Idée liée (relation), Catégorie (select) |
| **Progression** | Date (title, `AAAA-MM-JJ` au fuseau de Paris), Bilan (rich_text) |
| **Réglages** | Une seule ligne : Heure briefing matin, Heure bilan soir, QStash id briefing, QStash id bilan |

La colonne **Catégorie** (15 options, les mêmes noms que les pastilles de logos) a été ajoutée par une migration et renseignée pour les 52 idées ; **le code la lit depuis le 12/10/2026** : elle est prioritaire sur les mots-clés pour choisir les logos (`Autre` = pas de logo), et `create_idea`, `add_agenda_item` et `create_milestone` l'écrivent. Les entrées d'Agenda et de Jalons créées avant cette date n'en ont pas. **Écriture réelle vérifiée le 13/10/2026** : écrite puis relue dans Idées, Agenda et Jalons (les pages de test ont été archivées), et `npm run test:live` a donné 48/48 le même jour, après l'ajout du statut `Terminé` dans la base Idées par l'utilisateur (à refaire si la base est recréée). Le statut d'une idée peut être `Brute`, `En cours`, `Terminé` ou `Archivée`.

## Redis

| Clé | Contenu | Durée de vie |
| --- | --- | --- |
| `history:<chatId>` | Les 10 derniers messages de la conversation | 6 heures |
| `last-briefing` | Version courte du briefing du matin, pour le dashboard | 20 heures |
| `last-evening-briefing` | Version courte du briefing du soir | 20 heures |
| `break` | Pause en cours : `{ start, end }` | jusqu'à 3 jours après la fin |
| `protocol:run` | Protocole ou ouverture d'applications en attente : code, étapes, indicateur « déjà remis au PC » | 15 minutes |
| `agent:apps` | Les noms (jamais les chemins) des applications que le PC déclare | sans expiration |

## Fichier local (application de bureau)

`usage.json`, dans `%APPDATA%\com.soza.assistant\` : les secondes passées par jour et par application. Il reste sur la machine ; rien n'est envoyé à Notion ni au backend.

D'autres fichiers, dans le même dossier, sont créés au premier lancement et relus à chaque commande, jamais versionnés : `apps.json` (la liste blanche des applications que la barre de commande, les modes et les protocoles peuvent ouvrir ou fermer), `modes.json` (les modes de travail), un fichier d'identifiants pour la recherche d'un morceau par son nom et un fichier de jeton de renouvellement pour les titres likés, `agent.json` (l'adresse de l'API et la clé que le PC utilise pour récupérer les protocoles), `voice.json` (volume de la voix, mots dits avec l'accent anglais), `listen.json` (réglages de l'écoute du micro) et `claude.json`. Deux fichiers servent de boîte aux lettres pour Claude Code (`say.txt`, `claude-last.json`). La liste commentée est dans [Commandes et variables](#commandes).

## Migration Notion

`npm run notion:categories-cleanup` **simule** d'abord (aucune écriture) et affiche ce qu'il ferait ; avec `-- --apply` il applique puis relit les schémas. Il est idempotent. Il a supprimé les colonnes obsolètes (« Mode » des bases Agenda et Progression, les cinq colonnes de shift de Réglages) et ajouté « Catégorie ». **Supprimer une colonne efface ses valeurs sans retour possible** : le code avait été nettoyé avant que le script soit écrit, pour que l'ordre avec le déploiement n'ait pas d'importance.
