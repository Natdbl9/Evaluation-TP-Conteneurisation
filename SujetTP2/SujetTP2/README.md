# Documentation Technique - TP2 : Stack Multi-Services (Docker Compose)

## 1. Introduction
Ce projet implémente une architecture applicative conteneurisée via Docker Compose. La solution déploie quatre services interdépendants — Frontend, API, Base de données et Adminer — en garantissant l'isolation réseau, la persistance des données et une gestion sécurisée des secrets.

## 2. Architecture et Réseau
La stack repose sur un réseau virtuel interne permettant la communication entre les conteneurs :
- **Frontend** : Service Nginx, accessible sur le port `8080`.
- **API (Node.js)** : Service backend écoutant sur le port `3000`.
- **Database (PostgreSQL)** : Moteur de stockage, isolé du réseau hôte pour des raisons de sécurité.
- **Adminer** : Interface SQL, accessible sur le port `8081`.

## 3. Stratégie de Persistance et Robustesse
- **Persistance :** Un volume nommé `db_data` est monté sur le répertoire `/var/lib/postgresql/data` du conteneur PostgreSQL, assurant la conservation des données après l'arrêt de la stack.
- **Résilience :** Le service API intègre la directive `restart: on-failure` pour pallier les délais d'initialisation de la base de données.

## 4. Gestion des Secrets
Conformément aux bonnes pratiques, aucune donnée sensible (identifiants, mots de passe) n'est présente en clair dans le code. Les variables (`DB_USER`, `DB_PASSWORD`, `DB_NAME`) sont injectées dynamiquement via un fichier `.env` local, exclu du versionnage Git.

## 5. Guide de déploiement

### Initialisation
1. Copier le modèle : `cp .env.example .env`
2. Éditer le fichier `.env` pour définir vos identifiants PostgreSQL.

### Lancement
Déployer la stack en arrière-plan :
```bash
docker compose up -d --build