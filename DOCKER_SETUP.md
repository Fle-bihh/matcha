# Configuration Docker Compose

Ce fichier explique comment configurer et lancer l'application Matcha avec Docker Compose.

## Configuration des variables d'environnement

1. Copiez le fichier `.env.example` vers `.env`:

```bash
cp .env.example .env
```

2. Modifiez les valeurs dans `.env` selon vos besoins.

## Variables d'environnement

### Application

-   `PORT`: Port du serveur backend (par défaut: 3000)
-   `WEB_PORT`: Port de l'application web Next.js (par défaut: 3001)
-   `NODE_ENV`: Environnement d'exécution (development/production)

### Base de données

-   `DB_HOST`: Hôte de la base de données (db pour Docker Compose)
-   `DB_PORT`: Port de la base de données (3306)
-   `DB_NAME`: Nom de la base de données
-   `DB_USER`: Utilisateur de la base de données
-   `DB_PASSWORD`: Mot de passe de la base de données
-   `DB_ROOT_PASSWORD`: Mot de passe root MySQL

### Conteneurs

-   `CONTAINER_SERVER`: Nom du conteneur serveur
-   `CONTAINER_WEB`: Nom du conteneur web
-   `CONTAINER_DB`: Nom du conteneur base de données
-   `CONTAINER_ADMINER`: Nom du conteneur Adminer

## Lancement de l'application

```bash
# Construire et lancer tous les services
docker-compose up --build

# Lancer en arrière-plan
docker-compose up -d --build

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

## Accès aux services

-   Application web: http://localhost:3001 (ou le port défini par WEB_PORT)
-   Serveur API: http://localhost:3000 (ou le port défini par PORT)
-   Adminer: http://localhost:8080 (ou le port défini par ADMINER_PORT)

## Développement

Les volumes sont configurés pour le hot-reloading:

-   Le code source est monté dans les conteneurs
-   Les modifications sont reflétées automatiquement
-   Les node_modules sont persistés pour éviter les conflits
