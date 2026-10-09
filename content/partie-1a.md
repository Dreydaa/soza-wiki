@@ page en-bref | I | 1 | En bref | Le problème, la réponse, le statut et les chiffres clés.

## Le problème

Tenir une discipline de travail sur un projet personnel, malgré des horaires de travail postés (shifts) qui fatiguent. Deux exigences opposées à concilier : demander de la régularité sans mettre la pression quand le corps est épuisé.

## La réponse

Un assistant qui vit là où l'utilisateur est déjà, une conversation Telegram :

- il comprend le langage naturel (« ajoute un rendez-vous jeudi à 14 h », « je prends mon week-end ») et agit dans Notion via des outils IA ;
- il envoie un **briefing le matin** (météo, agenda, bilan de la veille) et demande un **bilan le soir**, à des horaires modifiables en conversation ;
- une **application de bureau** (Tauri + React) affiche tout cela dans un tableau de bord en « verre liquide », devant un ruban de Möbius en particules animé en temps réel.

## Un cadrage qui a évolué

Soza est née comme un coach de discipline à deux personnalités (une exigeante, une protectrice, selon les horaires de travail). Le 07/10/2026, l'utilisateur tenant sa cadence de travail, ce cadrage a été abandonné : une seule personnalité (« Friday »), plus de mode ACTIF/PAUSE, le produit se rapprochant d'un assistant du type Jarvis/FRIDAY. Le retrait a touché le backend (modes, prompts, outils, accès Notion, briefing, API du dashboard), les scripts et le front. Voir [Ce qui a été retiré](#retraits).

## Statut

La V1 a été déclarée terminée le 09/10/2026 (voir [Clôture de la V1](#cloture-v1)). Le backend est en production ; l'application de bureau a un installeur Windows ; une V2 est cadrée (voir [Vision V2](#vision-v2)).

## Chiffres clés

| | |
| --- | --- |
| Durée | 3 semaines (premier commit le 16/09/2026, dernier le 09/10/2026) |
| Historique | 73 commits |
| Code suivi par git | ~5 070 lignes : `api/` 167, `lib/` 1 165, `src/` 3 135, `scripts/` 440, Rust 166 ; plus 2 152 lignes de tests |
| Tests | 286 : 263 rapides (rejoués le 09/10/2026), 20 scénarios navigateur (18 passent), 3 en Rust |
| Endpoints serverless | 5 |
| Outils IA exposés au modèle | 13 |
| Bases Notion | 5 (Idées, Agenda, Jalons, Progression, Réglages) |
| Fournisseur du modèle | Groq (un second fournisseur a été essayé puis retiré) |
| Dépendances d'exécution | 13 |

---

@@ page architecture | I | 2 | Architecture | Les flux, les cinq endpoints, les principes directeurs et l'organisation du dépôt.

## Vue d'ensemble

```
Telegram ──▶ api/telegram-webhook.ts ──▶ QStash (file) ──▶ api/qstash-worker.ts ──▶ Groq (LLM + 13 outils) ──▶ Notion
                    │                                              │
                    ▼                                              ▼
             valide le chat_id                               répond sur Telegram

QStash Schedules ──▶ api/cron-morning.ts / api/cron-evening.ts ──▶ Notion + Telegram
                         (silencieux pendant une pause)

Application de bureau (Tauri) ──▶ api/dashboard.ts ──▶ Notion (lecture agrégée) + Redis (derniers briefings)

Redis : mémoire de conversation (10 messages, 6 h), derniers briefings (matin et soir), pause en cours
Application de bureau (Rust) : temps d'écran mesuré en local (jamais envoyé), zone de notification, démarrage avec Windows
```

## Les cinq endpoints

| Endpoint | Rôle |
| --- | --- |
| `api/telegram-webhook.ts` | Reçoit les messages Telegram. Vérifie la méthode (POST), le secret partagé de l'en-tête, puis le `chat_id` ; publie un job dans QStash. Ignore tout le reste sans erreur. |
| `api/qstash-worker.ts` | Reçoit le job de QStash (signature vérifiée), appelle le modèle avec les outils, répond sur Telegram. |
| `api/cron-morning.ts` | Déclenché par un QStash Schedule : rédige et envoie le briefing du matin, enregistre la version courte pour le dashboard. Silencieux pendant une pause. |
| `api/cron-evening.ts` | Même mécanique pour le briefing du soir, qui se termine par la question du bilan. |
| `api/dashboard.ts` | Agrège Notion, les actualités et les derniers briefings pour l'application de bureau. Protégé par une clé. |

## Principes directeurs

1. **Le webhook ne fait jamais de travail long.** Il valide le `chat_id` autorisé et publie un job dans QStash ; un worker séparé appelle le modèle. Un appel IA lent ne fait donc ni expirer ni rejouer le webhook Telegram, et le système est rejouable.
2. **Toute action vérifie d'abord qui parle.** Le `chat_id` est contrôlé avant toute action ; les crons n'acceptent qu'une signature QStash valide (ou un secret de secours).
3. **Notion est la source de vérité** pour tout ce qui doit être consultable à distance (idées, agenda, jalons, bilans, réglages). Le backend lit et écrit, sans dupliquer d'état métier. Redis ne sert qu'à de l'éphémère.
4. **Les faits sont calculés dans le code, le modèle ne fait que rédiger.** C'est la leçon la plus transposable du projet (voir [Bugs et causes racines](#bugs), bug 7).

## Organisation du dépôt

```
api/        5 endpoints serverless (edge) : webhook, worker, crons, dashboard
lib/        cœur métier : IA (client, outils, prompt), accès Notion, intégrations, mémoire Redis, dates, briefing
src/        application de bureau : features/ (glass, widgets, calendar, intro, particles, hub…)
src-tauri/  application de bureau en Rust : fenêtre, temps d'écran, zone de notification, démarrage automatique
tests/      unit, integration, regression, acceptance + faux Notion, faux Redis et réseau bloqué
scripts/    configuration et migration Notion/QStash, test contre les vraies APIs
docs/       état du projet, contexte IA, V2, journal de construction
```

---

@@ page coeur-ia | I | 3 | Le cœur IA | Appel d'outils, prompt de personnalité, doute, date du jour, mémoire et repli.

Le modèle ne « répond » pas seulement : il agit, via 13 outils (voir [Les outils IA](#outils-ia)), chacun défini par un schéma Zod. Il est appelé par `askSoza` (`lib/ai/client.ts`) avec le Vercel AI SDK et le fournisseur Groq (modèle par défaut `openai/gpt-oss-120b`, réglable par la variable `GROQ_MODEL`).

## Ce qui est envoyé au modèle

Le système est la concaténation de trois blocs : le prompt de personnalité (`friday.ts`), la consigne de doute, et la date du jour au fuseau de Paris. À cela s'ajoutent les 10 derniers messages de la conversation (gardés 6 heures dans Redis).

## Une phrase peut déclencher plusieurs actions

Jusqu'à 4 étapes d'outils par message (« crée cette idée et planifie un point jeudi »).

## Le doute vaut mieux que l'action

Une consigne dédiée interdit de créer une idée ou un jalon sur une intention ambiguë : le modèle pose d'abord une question courte. Validé en conditions réelles.

## Une seule personnalité

Deux prompts de personnage (l'un exigeant, l'autre protecteur, choisis selon l'heure) ont été fusionnés en un seul, `friday.ts`, rédigé par l'utilisateur :

- Soza est « SOZA, opérateur système IA personnel » : une personnalité qui fusionne l'efficacité tactique de FRIDAY et la finesse de J.A.R.V.I.S., en français ;
- deux registres : **opérationnel** (court, factuel, propose une action) et **conseil** (déclenché par un évitement répété, une décision risquée, le briefing du matin ou le bilan) ;
- appellations : « Boss », « patron », « chef », alternées (jamais le même deux messages de suite, et pas de surnom dans la plupart des messages) ; « Monsieur » seulement pour une remarque pointue ;
- elle ne parle jamais d'elle à la troisième personne : quand l'utilisateur parle de Soza (le bot, l'app, le dashboard, les briefings), il parle d'elle.

## Le modèle décide des détails qu'il peut décider

La taille d'un projet (Petit / Moyen / Grand) est estimée par le modèle selon une grille donnée dans la description de l'outil, au lieu d'être demandée à l'utilisateur. À l'inverse, il lui est interdit d'inventer le contenu d'une note.

## Les entrées d'un modèle ne respectent pas votre schéma

Groq renvoie parfois `null` pour un paramètre optionnel au lieu de l'omettre ; avec `.optional()`, toute la validation échouait et l'action se perdait sans message. Les six paramètres concernés utilisent `.nullish()`.

## Un modèle ne connaît pas la date du jour

Le prompt de conversation ne contenait aucune date : « ce week-end » ou « demain » ne pouvaient pas être convertis en dates réelles pour les outils. La date du jour (fuseau de Paris) est désormais injectée.

## Repli

Si le modèle ne produit aucun texte après avoir appelé un outil, la réponse est « ✅ Action enregistrée. » ; s'il n'a rien fait, « Je n'ai rien fait — peux-tu préciser ? ». Pour les briefings, si le modèle est indisponible (quota, panne), un briefing basique est envoyé plutôt que de faire échouer le cron.

Zod n'est plus utilisé que par les outils de l'IA : le webhook et le worker ont leur propre validation (voir [Sécurité](#securite)).

---

@@ page outils-ia | I | 4 | Les outils IA | Les 13 outils que le modèle peut appeler, et ceux qui ont été retirés.

Définis dans `lib/ai/tools.ts`. Chaque outil a un schéma Zod et une description qui guide le modèle.

| Outil | Ce qu'il fait |
| --- | --- |
| `create_idea` | Enregistre une idée dans Notion. Le modèle estime la taille (Petit / Moyen / Grand) et rédige une synthèse complète du fond et de la forme dans `notes`. Un statut de départ n'est renseigné que si l'utilisateur le précise. |
| `update_idea_notes` | Remplace la synthèse d'une idée déjà enregistrée (en combinant l'ancien contenu et les nouvelles précisions). |
| `update_idea_status` | Change le statut d'un projet : Brute, En cours ou Archivée. |
| `create_milestone` | Crée un jalon de 7 à 10 jours, éventuellement lié à une idée. |
| `complete_project` | Marque un projet comme terminé : archive l'idée et valide son jalon lié. |
| `suggest_projects` | Propose 3 idées à commencer, une par taille, en priorisant les plus anciennes. |
| `add_agenda_item` | Ajoute un item ponctuel à l'agenda (date, heure et fin optionnelles). |
| `add_shift_schedule` | Crée un bloc par jour ouvré pour un rythme de travail récurrent (type « Shift »). |
| `list_milestones` | Liste les jalons non validés, triés par échéance. |
| `update_briefing_schedule` | Change l'heure du briefing du matin ou du bilan du soir (met à jour le QStash Schedule et la base Réglages). |
| `set_break` | Met Soza en pause entre deux dates : plus de briefing ni de bilan, et l'absence de bilan n'est pas reprochée. |
| `cancel_break` | Annule la pause en cours ou programmée. |
| `record_progress` | Enregistre le bilan du jour dans Notion. |

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

Rédigé par Soza avec la même personnalité : la journée (tâches faites sur le total, puis celles qui restent, hors Shift), le prochain jalon, l'agenda des 7 jours, puis la question du bilan. **Ni météo ni actualités.**

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

---

@@ page donnees | I | 6 | Les données | Les cinq bases Notion, les clés Redis et le fichier local de temps d'écran.

Notion est la source de vérité. Le schéma ci-dessous vient du code (`lib/notion/`) ; le fichier `docs/product/NOTION-SCHEMA.md` du dépôt est antérieur à plusieurs retraits.

## Bases Notion

| Base | Propriétés utilisées |
| --- | --- |
| **Idées** | Titre (title), Taille (select : Petit / Moyen / Grand), Date d'entrée (date), Statut (select : Brute / En cours / Archivée), Notes (rich_text), Catégorie (select) |
| **Agenda** | Titre (title), Date (date, avec heure et fuseau Europe/Paris si connue), Statut (select, dont « À faire » et « Fait »), Type (select : Perso / Shift), Catégorie (select) |
| **Jalons** | Titre (title), Échéance (date), Statut (select, dont « Validé »), Preuve (url), Idée liée (relation), Catégorie (select) |
| **Progression** | Date (title, `AAAA-MM-JJ` au fuseau de Paris), Bilan (rich_text) |
| **Réglages** | Une seule ligne : Heure briefing matin, Heure bilan soir, QStash id briefing, QStash id bilan |

La colonne **Catégorie** (15 options, les mêmes noms que les pastilles de logos) a été ajoutée par une migration et renseignée pour les 52 idées ; **le code ne la lit pas encore** (les logos restent devinés par mots-clés).

## Redis

| Clé | Contenu | Durée de vie |
| --- | --- | --- |
| `history:<chatId>` | Les 10 derniers messages de la conversation | 6 heures |
| `last-briefing` | Version courte du briefing du matin, pour le dashboard | 20 heures |
| `last-evening-briefing` | Version courte du briefing du soir | 20 heures |
| `break` | Pause en cours : `{ start, end }` | jusqu'à 3 jours après la fin |

## Fichier local (application de bureau)

`usage.json`, dans `%APPDATA%\com.soza.assistant\` : les secondes passées par jour et par application. Il reste sur la machine ; rien n'est envoyé à Notion ni au backend.

## Migration Notion

`npm run notion:categories-cleanup` **simule** d'abord (aucune écriture) et affiche ce qu'il ferait ; avec `-- --apply` il applique puis relit les schémas. Il est idempotent. Il a supprimé les colonnes obsolètes (« Mode » des bases Agenda et Progression, les cinq colonnes de shift de Réglages) et ajouté « Catégorie ». **Supprimer une colonne efface ses valeurs sans retour possible** : le code avait été nettoyé avant que le script soit écrit, pour que l'ordre avec le déploiement n'ait pas d'importance.
