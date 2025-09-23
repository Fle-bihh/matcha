# Système de Base de Données Modulaire avec Métadonnées

Ce système fournit un `DatabaseService` générique qui gère automatiquement les métadonnées communes (`id`, `created_at`, `updated_at`, `deleted_at`) pour toutes les entités.

## Architecture

### DatabaseService (Générique)

Le `DatabaseService` est complètement modulaire et ne fait référence à aucun modèle spécifique. Il fournit des méthodes CRUD génériques :

-   `createDocument<T>()` - Crée un document avec métadonnées automatiques
-   `updateDoc<T>()` - Met à jour un document (soft update)
-   `deleteDoc()` - Suppression soft (marque avec `deleted_at`)
-   `getDoc<T>()` - Récupère un document par ID
-   `getDocs<T>()` - Récupère plusieurs documents avec filtres
-   `countDocs()` - Compte les documents
-   `restoreDoc()` - Restaure un document supprimé
-   `hardDeleteDoc()` - Suppression définitive

### Services Métier

Chaque service métier (comme `HelloService`) utilise le `DatabaseService` générique et définit ses propres méthodes spécifiques au domaine.

## Métadonnées Automatiques

Chaque table créée avec `createTableWithMetadata()` inclut automatiquement :

```sql
id INT AUTO_INCREMENT PRIMARY KEY,
-- vos champs personnalisés --
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL
```

## Utilisation

### 1. Créer un Nouveau Service

```typescript
import { DatabaseService } from "./DatabaseService";
import { MyEntity, CreateMyEntity, UpdateMyEntity } from "@/models/MyModels";

export class MyService {
	private dbService: DatabaseService;
	private readonly tableName = "my_entities";

	constructor(dbService: DatabaseService) {
		this.dbService = dbService;
	}

	async initializeTable(): Promise<void> {
		await this.dbService.createTableWithMetadata(
			this.tableName,
			`name VARCHAR(255) NOT NULL,
			 description TEXT,
			 status ENUM('active', 'inactive') DEFAULT 'active'`
		);
	}

	async createEntity(data: CreateMyEntity): Promise<MyEntity> {
		return this.dbService.createDocument<MyEntity>(this.tableName, data);
	}

	async getEntityById(id: number): Promise<MyEntity | null> {
		return this.dbService.getDoc<MyEntity>(this.tableName, id);
	}

	async updateEntity(data: UpdateMyEntity): Promise<MyEntity | null> {
		const { id, ...updateData } = data;
		return this.dbService.updateDoc<MyEntity>(
			this.tableName,
			id,
			updateData
		);
	}

	async deleteEntity(id: number): Promise<boolean> {
		return this.dbService.deleteDoc(this.tableName, id);
	}

	async searchByName(name: string): Promise<MyEntity[]> {
		return this.dbService.getDocs<MyEntity>(this.tableName, {
			where: "name LIKE ?",
			values: [`%${name}%`],
		});
	}
}
```

### 2. Enregistrer le Service

```typescript
// Dans ServiceRegistry.ts
private constructor() {
	const databaseService = new DatabaseService();

	this.services = {
		DatabaseService: databaseService,
		MyService: new MyService(databaseService),
		// autres services...
	};
}
```

### 3. Initialiser les Tables

```typescript
// Dans index.ts
private async initializeDatabase(): Promise<void> {
	const dbService = ServiceRegistry.getInstance().getService("DatabaseService");
	await dbService.connect();

	// Initialiser toutes les tables
	const myService = ServiceRegistry.getInstance().getService("MyService");
	await myService.initializeTable();
}
```

## Fonctionnalités

### Soft Delete

Par défaut, `deleteDoc()` fait une suppression soft :

-   Marque `deleted_at` avec la date/heure actuelle
-   Les méthodes `getDoc()` et `getDocs()` excluent automatiquement les documents supprimés
-   Utilisez `includeDeleted: true` pour inclure les documents supprimés
-   `restoreDoc()` remet `deleted_at` à `NULL`
-   `hardDeleteDoc()` supprime définitivement

### Filtrage et Recherche

```typescript
// Recherche avec conditions
const results = await this.dbService.getDocs<MyEntity>("my_table", {
	where: "status = ? AND name LIKE ?",
	values: ["active", "%search%"],
	orderBy: "created_at DESC",
	limit: 10,
	offset: 20,
});

// Compter les résultats
const count = await this.dbService.countDocs("my_table", {
	where: "status = ?",
	values: ["active"],
});
```

### Gestion des Timestamps

-   `created_at` : Défini automatiquement à la création
-   `updated_at` : Mis à jour automatiquement par MySQL lors des modifications
-   `deleted_at` : Géré par les méthodes de suppression soft

## Avantages

1. **Modularité** : Le `DatabaseService` ne dépend d'aucun modèle spécifique
2. **Consistance** : Toutes les tables ont les mêmes métadonnées
3. **Réutilisabilité** : Méthodes CRUD génériques pour tous les modèles
4. **Type Safety** : Support TypeScript complet avec génériques
5. **Soft Delete** : Gestion automatique des suppressions réversibles
6. **Performance** : Requêtes optimisées avec filtres et pagination

## Exemple Complet : TestValue

Voir `HelloService.ts` pour un exemple complet d'utilisation du système avec le modèle `TestValue`.
