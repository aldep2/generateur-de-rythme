# Entraîneur de Rythme Pro

Petit projet web (une page statique) pour créer et écouter des séquences rythmiques. Le projet contient également un petit serveur d'appoint permettant d'enregistrer côté projet les exports JSON.

## Structure

- `entraineur-rythme.html` : page principale (UI + logique JavaScript).
- `img/` : images utilisées pour représenter les notes et silences.
- `server.js` : serveur Node/Express minimal pour sauvegarder un export dans `./exports/`.
- `package.json` : dépendances et script pour lancer le serveur.
- `exports/` : dossier créé à l'exécution du serveur et où les exports côté projet sont écrits.

## Prérequis

- Node.js >= 14 et npm (si vous utilisez l'export vers le dossier du projet)
- Navigateur moderne (Chrome/Firefox/Edge) pour ouvrir `entraineur-rythme.html`

## Installation (serveur d'export)

Si vous souhaitez utiliser la fonctionnalité "Exporter → projet" (enregistrer les sauvegardes dans `./exports`), installez les dépendances et lancez le serveur :

```bash
cd /home/depre/a
npm install
npm start
```

Le serveur sera disponible sur http://localhost:50056 et créera automatiquement le dossier `exports/` si nécessaire.

> Remarque : si vous n'avez pas besoin d'enregistrer sur le disque du projet, vous pouvez ignorer l'installation du serveur. L'interface propose toujours un export local (téléchargement `.json`) et un import depuis fichier.

## Utilisation

1. Ouvrez `entraineur-rythme.html` dans votre navigateur. (Double-cliquez ou servez-le via un petit serveur HTTP si vous préférez éviter `file://`.)

   Conseil (optionnel, recommandé pour éviter certains comportements de CORS/fetch) :

   ```bash
   # Servir le dossier avec python (port 8000)
   python3 -m http.server 8000
   # puis ouvrez http://localhost:8000/entraineur-rythme.html
   ```

2. Construisez une séquence en cliquant sur les notes de la palette.
3. Contrôlez le tempo, activez le métronome, puis cliquez sur "▶️ Jouer".
4. Sauvegarde : cliquez sur 💾 Sauvegarder pour enregistrer le rythme dans le localStorage du navigateur.
5. Charger : cliquez sur 📁 Charger (n) pour afficher et charger les sauvegardes stockées dans votre navigateur.

## Export / Import

- Exporter (télécharger) : clique sur `⬇️ Exporter` pour télécharger un fichier `savedRhythms.json` contenant toutes les sauvegardes (depuis `localStorage`).
- Importer : clique sur `⤴️ Importer` et sélectionnez un `.json` obtenu via l'export pour recharger les sauvegardes dans votre `localStorage`.
- Exporter → projet : envoie le contenu des sauvegardes au petit serveur (http://localhost:50056/save-export) qui écrira le fichier sous `./exports/<nom>`.

  Exemple : si vous fournissez `savedRhythms_1690000000000.json`, le serveur créera `./exports/savedRhythms_1690000000000.json`.

> Remarque : le bouton "Exporter → projet" nécessite que `npm start` soit en cours d'exécution dans le dossier du projet.

## Déployer sur GitHub Pages

- Ce projet est essentiellement une page statique (`entraineur-rythme.html`) et peut être publié sur GitHub Pages. J'ai ajouté un workflow GitHub Actions (`.github/workflows/gh-pages.yml`) qui déploie la branche `main` vers `gh-pages`.
- IMPORTANT : GitHub Pages ne permet pas d'exécuter Node.js côté serveur. La fonctionnalité "Exporter → projet" qui POSTe vers `http://localhost:50056/save-export` ne fonctionnera pas sur GitHub Pages. Sur Pages, l'export doit être réalisé côté client (téléchargement local).

Déploiement rapide :

1. Poussez votre repository sur GitHub (remote `origin`) sur la branche `main`.
2. Le workflow GitHub Actions déclenchera et publiera le contenu sur la branche `gh-pages`.
3. Activez GitHub Pages dans les settings du repo (source `gh-pages`) si nécessaire.

Note : si vous voulez un déploiement plus fin (fichiers compilés, assets), adaptez le dossier `folder:` dans le workflow.

## Format des sauvegardes

Les sauvegardes sont stockées dans `localStorage` sous la clé :

```
savedRhythms
```

Il s'agit d'un tableau JSON d'objets :

```json
[
  {
    "name": "Nom du rythme",
    "created": 1690000000000,
    "seq": [ {"name":"Noire","duration":1,...}, ... ]
  }
]
```

Chaque `seq` contient les objets `note` tels qu'ils sont utilisés dans l'application (propriété `name`, `duration`, `id`, etc.).

## Dépannage

- Le serveur d'export écoute sur le port 3000. Si le port est occupé, arrêtez l'autre service ou modifiez `server.js`.
- Si la requête d'export vers `http://localhost:50056` renvoie une erreur `TypeError: Failed to fetch`, vérifiez que le serveur est lancé et que vous n'êtes pas en train d'ouvrir `entraineur-rythme.html` via `file://` (dans certains navigateurs fetch vers localhost depuis file:// est bloqué). Servez la page via `http://localhost:8000` comme indiqué plus haut.
- Les exports côté serveur sont écrits dans `./exports/` et peuvent être partagés ou sauvegardés ailleurs.

## Sécurité

Le serveur fourni est un utilitaire local minimal : ne l'exposez pas sur Internet. Il écrit les données reçues telles quelles dans un fichier, sans authentification ni validation approfondie.

## Améliorations possibles

- Ajouter export/import d'un seul rythme (actuel) et non du tableau entier.
- Ajouter une interface serveur pour lister les fichiers dans `exports/` et les importer depuis l'UI.
- Ajouter des tests unitaires et validation du JSON côté serveur.

Si vous voulez, j'ajoute un endpoint pour lister les fichiers dans `exports/` et un bouton UI "Importer depuis projet" pour charger un export présent sur le disque du projet.

---

Si vous voulez que je génère maintenant l'endpoint pour lister les fichiers dans `exports/` et le bouton UI correspondant, dites "oui" et je l'implémente.