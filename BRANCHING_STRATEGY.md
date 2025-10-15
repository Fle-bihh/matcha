# Stratégie de Branching - Matcha

## 📋 Vue d'ensemble

Ce document décrit la stratégie de branching et les règles de workflow Git pour le projet Matcha.

## 🌳 Hiérarchie des branches

```
main (production stable)
  ↑
production (pre-production)
  ↑
dev (développement)
  ↑
feat/*, fix/*, hotfix/*, chore/*, etc.
```

### Branches principales

- **`main`** : Branche principale contenant le code en production stable
  - ⛔ Pas de push direct
  - ✅ Accepte uniquement les merges depuis `production`
  - 📦 Déclenchements de déploiements en production

- **`production`** : Branche de pre-production
  - ⛔ Pas de push direct
  - ✅ Accepte uniquement les merges depuis `dev`
  - 👥 Requiert au moins 1 revue de code (code review)
  - 🧪 Environnement de staging/pre-production

- **`dev`** : Branche de développement principale
  - ✅ Branche par défaut pour créer de nouvelles branches
  - 🔄 Intégration continue des fonctionnalités
  - 🧑‍💻 Environnement de développement

### Branches de travail

Toutes les nouvelles branches doivent être créées à partir de `dev` et suivre ces conventions de nommage :

- **`feat/feature-name`** : Nouvelles fonctionnalités
  ```bash
  git checkout dev
  git pull origin dev
  git checkout -b feat/user-authentication
  ```

- **`fix/object-to-fix`** : Corrections de bugs
  ```bash
  git checkout dev
  git pull origin dev
  git checkout -b fix/login-validation
  ```

- **`hotfix/critical-issue`** : Corrections critiques urgentes
  ```bash
  git checkout dev
  git pull origin dev
  git checkout -b hotfix/security-vulnerability
  ```

- **`chore/task-description`** : Tâches de maintenance
  ```bash
  git checkout dev
  git pull origin dev
  git checkout -b chore/update-dependencies
  ```

- **`docs/documentation-update`** : Mises à jour de documentation
  ```bash
  git checkout dev
  git pull origin dev
  git checkout -b docs/api-documentation
  ```

- **`refactor/code-improvement`** : Refactoring de code
  ```bash
  git checkout dev
  git pull origin dev
  git checkout -b refactor/user-service
  ```

## 🔄 Workflow de développement

### 1. Créer une nouvelle fonctionnalité

```bash
# 1. S'assurer d'être à jour sur dev
git checkout dev
git pull origin dev

# 2. Créer une branche de fonctionnalité
git checkout -b feat/my-new-feature

# 3. Développer et commiter
git add .
git commit -m "feat: add my new feature"

# 4. Pousser la branche
git push origin feat/my-new-feature

# 5. Créer une Pull Request vers dev sur GitHub
```

### 2. Merger dans dev

```bash
# Une fois la PR approuvée et mergée dans dev
git checkout dev
git pull origin dev
```

### 3. Promouvoir vers production

```bash
# Créer une PR de dev vers production sur GitHub
# ⚠️ Requiert au moins 1 revue de code
# Une fois approuvée et mergée, production est mise à jour
```

### 4. Déployer en production (main)

```bash
# Créer une PR de production vers main sur GitHub
# Une fois mergée, main est mis à jour et déploiement en production
```

## 📝 Conventions de nommage des commits

Suivre la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage, style
- `refactor:` - Refactoring de code
- `test:` - Ajout de tests
- `chore:` - Maintenance, tâches diverses

**Exemples :**
```bash
git commit -m "feat: add user profile page"
git commit -m "fix: resolve login redirect issue"
git commit -m "docs: update API documentation"
```

## ✅ Checklist avant de créer une PR

- [ ] Code testé localement
- [ ] Pas de conflits avec la branche cible
- [ ] Commits suivent les conventions
- [ ] Documentation mise à jour si nécessaire
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Nom de branche suit les conventions

## 🚫 Ce qu'il ne faut PAS faire

- ❌ Ne pas pusher directement sur `main`, `production`, ou `dev`
- ❌ Ne pas créer de branches depuis `main` ou `production`
- ❌ Ne pas merger sans revue de code (pour production)
- ❌ Ne pas utiliser de noms de branches génériques (`branch1`, `test`, `temp`)
- ❌ Ne pas forcer les push (`git push -f`) sur les branches protégées

## 🔧 Configuration requise

Voir `GITHUB_SETUP.md` pour les instructions détaillées de configuration des règles de protection sur GitHub.

## 🆘 Aide et questions

En cas de doute sur le workflow :
1. Consultez cette documentation
2. Demandez à un membre de l'équipe
3. Créez une issue pour clarification

---

**Dernière mise à jour :** Octobre 2025
