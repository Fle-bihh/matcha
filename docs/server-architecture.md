# Architecture du Serveur - Guide de refactorisation

## Vue d'ensemble de la nouvelle architecture

Cette refactorisation améliore l'organisation du code en séparant clairement les responsabilités et en rendant l'architecture plus maintenable et testable.

## Structure des responsabilités

### 1. Point d'entrée (`src/index.ts`)

-   **Responsabilité** : Point d'entrée simple et clair de l'application
-   **Rôle** : Initialise l'`ApplicationSetup` et gère les erreurs de démarrage
-   **Améliorations** : Plus simple, plus focalisé

### 2. Bootstrap (`src/bootstrap/`)

#### `ApplicationSetup`

-   **Responsabilité** : Orchestration de l'initialisation complète de l'application
-   **Ordre d'initialisation** :
    1. Container et services
    2. Base de données
    3. Serveur HTTP
-   **Avantages** : Contrôle centralisé de l'ordre d'initialisation

#### `ContainerSetup`

-   **Responsabilité** : Initialisation et configuration du container DI
-   **Fonctions** :
    -   Création du container
    -   Pré-chargement des services critiques
    -   Monitoring de l'état du container
-   **Avantages** : Séparation claire de la gestion du container

#### `DatabaseSetup`

-   **Responsabilité** : Initialisation de la base de données
-   **Fonctions** :
    -   Connexion à la base de données
    -   Gestion des erreurs de connexion
-   **Avantages** : Responsabilité isolée

#### `ServerSetup`

-   **Responsabilité** : Configuration et démarrage du serveur HTTP
-   **Fonctions** :
    -   Configuration des middlewares
    -   Enregistrement des routes
    -   Démarrage du serveur
-   **Avantages** : Séparation des préoccupations réseau

### 3. Container (`src/container/`)

#### `Container`

-   **Ancien problème** : Le `ControllerRegistry` maintenait son propre container statique
-   **Nouvelle solution** : Container instanciable et injectable
-   **Améliorations** :
    -   Plus de singleton global
    -   Meilleure testabilité
    -   Gestion d'état plus claire
    -   Méthodes de debugging (`has`, `getInstantiatedTokens`, `clear`)

### 4. Registry (`src/registry/`)

#### `ControllerRegistry`

-   **Ancien problème** : Singleton avec container intégré
-   **Nouvelle solution** : Classe instanciable qui reçoit un container
-   **Améliorations** :
    -   Plus de couplage fort avec le container
    -   Instance par application
    -   Meilleure séparation des responsabilités
    -   Méthodes de debugging et test

## Flux d'initialisation

```
1. index.ts
   ↓
2. ApplicationSetup.initialize()
   ↓
3. ContainerSetup.initialize()
   - Création du Container
   - Pré-chargement des services critiques
   ↓
4. DatabaseSetup.initialize()
   - Récupération du BaseRepository via le Container
   - Connexion à la base de données
   ↓
5. ServerSetup.initialize()
   - Configuration des middlewares
   - Création d'une instance ControllerRegistry avec le Container
   - Enregistrement des routes
   - Démarrage du serveur HTTP
```

## Avantages de la refactorisation

### 1. **Séparation des responsabilités**

-   Chaque classe a une responsabilité unique et bien définie
-   Plus facile à maintenir et à tester

### 2. **Élimination des singletons problématiques**

-   Le `ControllerRegistry` n'est plus un singleton
-   Le `Container` est créé et injecté explicitement

### 3. **Meilleure testabilité**

-   Chaque composant peut être testé indépendamment
-   Injection de dépendances claire
-   Possibilité de mocker facilement les dépendances

### 4. **Architecture plus claire**

-   Ordre d'initialisation explicite
-   Flux de données prévisible
-   Debugging plus facile

### 5. **Extensibilité**

-   Facile d'ajouter de nouveaux bootstraps
-   Container extensible
-   Middleware et routes facilement configurables

## Migration depuis l'ancienne architecture

### Changements principaux :

1. **Container** : Plus de `ControllerRegistry.containerInstance`, utiliser l'injection
2. **Initialisation** : Plus de classe `Server`, utiliser `ApplicationSetup`
3. **Registry** : Plus de méthodes statiques, utiliser une instance

### Compatibilité :

-   Les contrôleurs existants continuent de fonctionner
-   Les décorateurs de routes restent identiques
-   L'interface publique reste la même

## Tests

La nouvelle architecture facilite les tests :

```typescript
// Test du container
const container = new Container();
const service = container.get<MyService>(ETokens.MyService);

// Test des bootstraps
const dbBootstrap = new DatabaseSetup(container);
await dbBootstrap.initialize();

// Test du registry
const registry = new ControllerRegistry(container);
const app = express();
registry.setupRoutes(app);
```

## Configuration recommandée

Pour les nouvelles fonctionnalités :

1. Ajouter de nouveaux services dans `ETokens` et le `serviceRegistry`
2. Créer de nouveaux bootstraps si nécessaire
3. Utiliser l'injection de dépendances pour tous les services
4. Éviter les singletons globaux
