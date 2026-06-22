# TP1 DevOps — Réparer une image Docker cassée

## 📝 Contexte du projet
Dans le cadre de ce TP, j'ai eu pour mission d'auditer et de réparer le `Dockerfile` d'une application Node.js (un simple système de messagerie). Le fichier initial permettait certes de faire tourner l'application, mais il était catastrophique d'un point de vue sécurité, optimisation et bonnes pratiques de production.

L'objectif de ce dépôt est de présenter la version corrigée, propre et optimisée de cette infrastructure.

## 🛠️ Les corrections que j'ai apportées

Pour rendre cette image utilisable en production, j'ai identifié et corrigé 5 problèmes majeurs :

1. **Réduction drastique du poids de l'image :** Je suis passé de l'image de base `node:18` (basée sur une Debian complète et très lourde) à `node:18-alpine`. J'ai également mis en place une architecture **Multi-stage build**. Résultat : l'image est passée de plus de 1 Go à environ 175 Mo.
2. **Sécurisation des secrets :** L'ancien fichier contenait des clés API et mots de passe en dur (`ENV DB_PASSWORD=...`). Je les ai supprimés du code source. Ces variables doivent désormais être injectées proprement à l'exécution (via un `.env`).
3. **Optimisation du cache Docker :** J'ai séparé la copie des fichiers `package.json` et l'installation des dépendances (`npm install`) du reste du code source. Ainsi, si je modifie juste un fichier JavaScript, Docker utilise le cache et ne re-télécharge pas toutes les librairies.
4. **Principe du moindre privilège (Non-Root) :** L'application tournait par défaut avec les droits administrateur (`root`). J'ai créé un dossier de données avec les bons droits de propriété et j'ai forcé l'utilisation de l'utilisateur restreint `node` (`USER node`).
5. **Nettoyage des outils inutiles :** J'ai supprimé l'installation de paquets systèmes (curl, vim, htop...) qui n'ont rien à faire dans un conteneur de production et qui ne font qu'augmenter la surface d'attaque.
6. **Ajout du `.dockerignore` :** J'ai créé ce fichier pour éviter d'envoyer le dossier `node_modules` local et d'autres fichiers sensibles dans le contexte de build de Docker.

## 📂 Structure du projet

\`\`\`text
tp1/
├── Dockerfile          # Le fichier de build optimisé (Multi-stage)
├── .dockerignore       # Les exclusions pour le build Docker
├── index.js            # L'application Node.js (non modifiée)
└── package.json        # Les dépendances (non modifiées)
\`\`\`

## 🚀 Comment tester mon travail

### 1. Compiler l'image
Placez-vous à la racine du projet et lancez le build. Le processus est optimisé et très rapide grâce à l'image Alpine et au cache.
\`\`\`bash
docker build -t tp1:corrige .
\`\`\`

### 2. Démarrer l'application
Pour lancer le conteneur en associant le port 3000 de la machine hôte à celui du conteneur :
\`\`\`bash
docker run -d -p 3000:3000 --name app_messages tp1:corrige
\`\`\`
L'application est maintenant accessible sur le navigateur à l'adresse : [http://localhost:3000](http://localhost:3000).

## ✅ Critères de validation (Tests)

Voici les commandes que j'ai utilisées pour m'assurer que tous les critères de réussite du TP sont validés :

* **Vérifier la taille de l'image (inférieure à 200MB) :**
  \`\`\`bash
  docker images tp1:corrige
  \`\`\`
* **Vérifier que le conteneur ne tourne pas en root :**
  \`\`\`bash
  docker run --rm tp1:corrige whoami
  # Doit retourner "node" et non "root"
  \`\`\`
* **Vérifier l'absence de secrets figés dans l'image :**
  \`\`\`bash
  docker inspect tp1:corrige | grep DB_PASSWORD
  # La commande ne doit rien retourner
  \`\`\`
* **Vérifier l'utilisation du cache :**
  Si vous modifiez un simple commentaire dans `index.js` et relancez la commande de build, l'étape concernant le `RUN npm install` affichera la mention `CACHED`.