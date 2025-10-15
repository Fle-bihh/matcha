# Guide de Configuration GitHub - Matcha

Ce guide explique comment configurer les règles de protection de branches sur GitHub pour le projet Matcha.

## 📋 Prérequis

- Droits d'administrateur sur le dépôt GitHub `Fle-bihh/matcha`
- Les branches `main`, `production`, et `dev` doivent exister

## 🔧 Configuration des branches

### Étape 1 : Créer les branches si nécessaire

Si les branches n'existent pas encore :

```bash
# Créer et pousser la branche production (depuis main)
git checkout main
git checkout -b production
git push -u origin production

# Créer et pousser la branche dev (depuis production)
git checkout production
git checkout -b dev
git push -u origin dev
```

### Étape 2 : Configurer la branche par défaut

1. Aller sur GitHub : `https://github.com/Fle-bihh/matcha`
2. Cliquer sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquer sur **Branches**
4. Dans "Default branch", cliquer sur le bouton avec les deux flèches
5. Sélectionner **`dev`** comme branche par défaut
6. Cliquer sur **Update** puis confirmer

> ℹ️ **Pourquoi ?** La branche `dev` devient la branche par défaut pour que toutes les nouvelles branches soient automatiquement créées à partir de `dev`.

## 🛡️ Configuration des règles de protection

### Protection de la branche `main`

1. Sur la page **Settings > Branches**
2. Cliquer sur **Add branch protection rule**
3. Configurer comme suit :

**Branch name pattern :** `main`

Cocher les options suivantes :

- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1` (optionnel mais recommandé)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Ajouter les status checks (une fois que les workflows ont été exécutés au moins une fois) :
    - `validate-branch-name`
    - `validate-pr-target`

- ✅ **Require conversation resolution before merging**

- ✅ **Restrict who can push to matching branches**
  - Ne sélectionner aucun utilisateur/équipe (seulement les PR sont autorisées)
  - OU limiter aux administrateurs si nécessaire

- ✅ **Do not allow bypassing the above settings** (recommandé)

- ✅ **Restrict pushes that create matching branches**

4. Cliquer sur **Create** en bas de la page

### Protection de la branche `production`

1. Cliquer sur **Add branch protection rule**
2. Configurer comme suit :

**Branch name pattern :** `production`

Cocher les options suivantes :

- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **`1`** ⚠️ **IMPORTANT : Au moins 1 revue obligatoire**
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (optionnel, nécessite un fichier CODEOWNERS)
  
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Ajouter les status checks :
    - `validate-branch-name`
    - `validate-pr-target`
    - `check-pr-requirements`

- ✅ **Require conversation resolution before merging**

- ✅ **Restrict who can push to matching branches**
  - Ne sélectionner aucun utilisateur/équipe

- ✅ **Do not allow bypassing the above settings**

- ✅ **Restrict pushes that create matching branches**

3. Cliquer sur **Create**

### Protection de la branche `dev`

1. Cliquer sur **Add branch protection rule**
2. Configurer comme suit :

**Branch name pattern :** `dev`

Cocher les options suivantes :

- ✅ **Require a pull request before merging** (optionnel pour dev, selon vos préférences)
  - Si coché, vous pouvez mettre `0` ou `1` pour les revues

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Ajouter les status checks :
    - `validate-branch-name`
    - `validate-pr-target`

- ✅ **Require conversation resolution before merging**

3. Cliquer sur **Create**

## 📸 Captures d'écran des étapes

### Navigation vers les paramètres de branches

```
GitHub Repository
└── Settings (onglet en haut)
    └── Branches (menu de gauche)
        ├── Default branch
        └── Branch protection rules
```

### Résumé de la configuration

| Branche | PR Requise | Revues Requises | Source Autorisée | Push Direct |
|---------|------------|-----------------|------------------|-------------|
| `main` | ✅ Oui | 1 (recommandé) | `production` uniquement | ❌ Non |
| `production` | ✅ Oui | ✅ **1 minimum** | `dev` uniquement | ❌ Non |
| `dev` | ⚠️ Optionnel | 0-1 | `feat/*`, `fix/*`, etc. | ⚠️ Selon config |

## ✅ Vérification de la configuration

Après la configuration, vérifier que :

1. La branche par défaut est `dev` :
   ```bash
   # Sur GitHub, le repository doit afficher "dev" par défaut
   # Lors d'un clone, la commande suivante doit montrer dev :
   git clone https://github.com/Fle-bihh/matcha.git
   cd matcha
   git branch
   # Devrait afficher: * dev
   ```

2. Les règles sont actives :
   - Essayer de pusher directement sur `main` devrait échouer
   - Essayer de créer une PR de `dev` vers `main` devrait échouer

3. Le workflow GitHub Actions fonctionne :
   - Créer une branche avec un mauvais nom (ex: `test-branch`)
   - Créer une PR, le workflow devrait échouer
   - Créer une branche valide (ex: `feat/test`)
   - Créer une PR, le workflow devrait passer

## 🔄 Workflow validé

Voici le workflow attendu après configuration :

```
1. Développeur crée une branche depuis dev :
   dev → feat/new-feature

2. Développeur pousse et crée une PR vers dev :
   feat/new-feature → dev ✅

3. Après merge, promotion vers production :
   dev → production
   - ⚠️ Requiert 1 revue de code
   - ✅ Validation automatique du workflow

4. Après tests en staging, promotion vers main :
   production → main ✅
   - Déploiement en production
```

## ⚠️ Cas d'erreur et solutions

### Erreur : "Required status check is not available"

**Cause :** Le workflow GitHub Actions n'a jamais été exécuté.

**Solution :**
1. Faire un premier push sur une branche de test
2. Attendre que le workflow s'exécute
3. Les status checks apparaîtront alors dans la liste
4. Retourner dans les paramètres et ajouter les status checks

### Erreur : "You can't push to this branch"

**Cause :** C'est normal ! Les branches protégées n'acceptent que les PR.

**Solution :**
```bash
# Au lieu de pusher directement sur production :
git checkout dev
git pull origin dev
# Créer une PR sur GitHub : dev → production
```

### Erreur : "Review required"

**Cause :** PR vers production sans revue de code.

**Solution :**
1. Demander à un collègue de review la PR
2. Une fois approuvée, le merge sera possible

## 📚 Ressources additionnelles

- [Documentation GitHub - Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Documentation GitHub - CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Conventional Commits](https://www.conventionalcommits.org/)
- Voir aussi : `BRANCHING_STRATEGY.md` pour les conventions de nommage

## 🆘 Support

En cas de problème avec la configuration :
1. Vérifier que vous avez les droits administrateur sur le dépôt
2. Consulter les logs GitHub Actions pour les erreurs de workflow
3. Contacter l'équipe DevOps ou l'administrateur du dépôt

---

**Dernière mise à jour :** Octobre 2025
