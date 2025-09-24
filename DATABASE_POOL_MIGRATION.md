# Migration vers Pool de Connexions MySQL

## Changements apportés

La base de données a été migrée d'une connexion unique vers un **pool de connexions** pour améliorer les performances et la fiabilité.

### Avant (Connexion unique)

```typescript
// Une seule connexion partagée pour toute l'application
const connection = await mysql.createConnection(config);
```

### Après (Pool de connexions)

```typescript
// Pool de connexions avec gestion automatique
const pool = mysql.createPool({
	connectionLimit: 10,
	waitForConnections: true,
	queueLimit: 0,
});
```

## Avantages du Pool de Connexions

### 1. **Gestion Concurrente**

-   **Avant** : Une seule requête à la fois
-   **Maintenant** : Jusqu'à 10 requêtes simultanées par défaut

### 2. **Performance Améliorée**

-   Réutilisation des connexions existantes
-   Pas de surcharge de création/destruction de connexions
-   Meilleure utilisation des ressources

### 3. **Fiabilité**

-   Reconnexion automatique en cas de perte de connexion
-   Gestion automatique des connexions défaillantes
-   Timeout et retry intégrés

### 4. **Scalabilité**

-   Ajustement dynamique selon la charge
-   Gestion de la file d'attente des requêtes
-   Adaptation aux pics de trafic

## Configuration

### Variables d'environnement

```bash
# Nombre maximum de connexions dans le pool (défaut: 10)
DB_POOL_CONNECTION_LIMIT=10
```

### Options configurables dans le code

```typescript
{
  connectionLimit: 10,        // Max connexions simultanées
  waitForConnections: true,   // Attendre si toutes occupées
  queueLimit: 0              // Pas de limite sur la queue
}
```

## Utilisation

### API inchangée

L'API publique reste identique, les changements sont transparents :

```typescript
// Ces méthodes fonctionnent toujours de la même façon
const user = await userRepository.create(userData);
const users = await userRepository.getAll();
```

### Nouvelles méthodes utilitaires

```typescript
const dbManager = DatabaseConnectionManager.getInstance();

// Obtenir des informations sur le pool
const poolInfo = await dbManager.getPoolInfo();
console.log(
	`Connexions actives: ${poolInfo.activeConnections}/${poolInfo.connectionLimit}`
);

// Exécuter une requête directement avec le pool
const [rows] = await dbManager.executeQuery(
	"SELECT * FROM users WHERE id = ?",
	[userId]
);
```

## Monitoring et Debug

### Informations sur le pool

```typescript
const poolInfo = await dbManager.getPoolInfo();
console.log({
	connectionLimit: poolInfo.connectionLimit,
	activeConnections: poolInfo.activeConnections,
});
```

### Logs automatiques

-   Connexion du pool au démarrage
-   Erreurs de connexion avec contexte
-   Déconnexion propre du pool

## Bonnes Pratiques

### 1. **Ne pas garder de connexions**

```typescript
// ❌ Mauvais - garder une connexion
const connection = await pool.getConnection();
// ... beaucoup de code ...
connection.release(); // Risque d'oubli

// ✅ Bon - utiliser executeQuery
const [rows] = await dbManager.executeQuery(query, params);
```

### 2. **Taille du pool appropriée**

```typescript
// Pour un petit serveur : 5-10 connexions
// Pour un serveur en production : 10-20 connexions
// Au-delà, vérifier les goulots d'étranglement
```

### 3. **Gestion des erreurs**

```typescript
try {
	const result = await dbOperations.createDocument("users", userData);
} catch (error) {
	// Les erreurs de pool sont automatiquement loggées
	logger.error("User creation failed:", error);
}
```

## Migration

### Changements de code requis

**Aucun changement requis** dans le code applicatif existant. La migration est totalement transparente.

### Variables d'environnement

Ajouter à votre `.env` :

```bash
DB_POOL_CONNECTION_LIMIT=10  # Optionnel, défaut = 10
```

### Tests

Tous les tests existants continuent de fonctionner sans modification.

## Déploiement

1. **Mettre à jour les variables d'environnement**
2. **Redémarrer l'application**
3. **Vérifier les logs** pour confirmer la connexion du pool

```bash
# Log attendu au démarrage
Database pool connected successfully with 10 connections
```

## Performance Attendue

### Avant (connexion unique)

-   1 requête à la fois
-   Latence élevée en cas de concurrence
-   Risque de timeout

### Après (pool de connexions)

-   Jusqu'à 10 requêtes simultanées
-   Latence réduite pour les requêtes concurrentes
-   Meilleure résistance aux pics de charge

## Troubleshooting

### Pool saturé

Si vous voyez des timeouts fréquents, augmentez `DB_POOL_CONNECTION_LIMIT`.

### Connexions qui traînent

Le pool gère automatiquement les connexions inactives et défaillantes.

### Monitoring

Utilisez `getPoolInfo()` pour surveiller l'utilisation du pool en production.
