# 🔐 GitHub Ruleset - Guia Completo

Este guia explica como usar o ruleset JSON para proteger a branch `main` do SimPlay Mobile.

## 📋 O Que é um Ruleset?

Um **ruleset** é um arquivo JSON que define regras de proteção para branches no GitHub. É como um "código de lei" para seu repositório.

**Benefícios:**
- ✅ Proteção automática de branch
- ✅ Validação de commits
- ✅ Exigência de pull requests
- ✅ Verificação de status
- ✅ Fácil de versionear (está no Git!)

---

## 📁 Arquivo Fornecido

**Localização:** `.github/simplay-ruleset.json`

**O que ele faz:**
1. Protege a branch `main`
2. Exige pull request antes de merge
3. Exige 1 aprovação
4. Valida commits com padrão convencional
5. Exige status checks (build, lint, test)
6. Proíbe force push
7. Exige resolução de comentários

---

## 🚀 Como Usar o Ruleset

### Opção 1: Via GitHub CLI (Recomendado)

#### Passo 1: Instalar GitHub CLI
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt-get install gh

# Windows
choco install gh
```

#### Passo 2: Fazer Login
```bash
gh auth login
```

#### Passo 3: Criar Ruleset
```bash
cd simplay-mobile

# Criar ruleset a partir do JSON
gh api repos/SrTharos/simplay-mobile/rulesets \
  -X POST \
  -F name="SimPlay Mobile - Main Branch Protection" \
  -F description="Comprehensive ruleset for protecting the main branch" \
  -F type="branch" \
  -F enforcement="active" \
  -f conditions='{"ref_name":{"include":["refs/heads/main"]}}' \
  -f rules='[
    {"type":"creation"},
    {"type":"update"},
    {"type":"deletion"},
    {"type":"required_status_checks","parameters":{"strict_required_status_checks_policy":true,"required_status_checks":[{"context":"build"},{"context":"lint"},{"context":"test"}]}},
    {"type":"required_pull_request_reviews","parameters":{"dismiss_stale_reviews_on_push":true,"require_code_owner_reviews":false,"required_approving_review_count":1,"required_review_thread_resolution":true}},
    {"type":"non_fast_forward"},
    {"type":"commit_message_pattern","parameters":{"operator":"starts_with","pattern":"^(feat|fix|docs|style|refactor|perf|test|chore|ci):","negate":false}},
    {"type":"commit_author_email_pattern","parameters":{"operator":"contains","pattern":"@","negate":false}}
  ]'
```

### Opção 2: Via Interface Web (Mais Fácil)

#### Passo 1: Acessar Rulesets
1. Vá para: https://github.com/SrTharos/simplay-mobile
2. Settings → Rules → Rulesets
3. Clique em "New ruleset"

#### Passo 2: Configurar Ruleset
1. **Name:** `SimPlay Mobile - Main Branch Protection`
2. **Enforcement:** `Active`
3. **Target branches:** `main`

#### Passo 3: Adicionar Regras

**✅ Creation**
- Previne criação de branches com mesmo nome

**✅ Update**
- Previne atualizações diretas

**✅ Deletion**
- Previne exclusão da branch

**✅ Required status checks**
- ☑️ Require branches to be up to date
- Status checks: `build`, `lint`, `test`

**✅ Required pull request reviews**
- ☑️ Require approval from code owners
- Approvals needed: `1`
- ☑️ Dismiss stale reviews
- ☑️ Require conversation resolution

**✅ Non-fast-forward**
- Exige merge commit (não rebase)

**✅ Commit message pattern**
- Pattern: `^(feat|fix|docs|style|refactor|perf|test|chore|ci):`
- Garante commits convencionais

**✅ Commit author email pattern**
- Pattern: `@`
- Garante email válido

#### Passo 4: Salvar
Clique em "Create"

---

## 📝 Explicação do JSON

### Estrutura Principal
```json
{
  "name": "Nome do ruleset",
  "description": "Descrição",
  "type": "branch",
  "rules": [ /* Array de regras */ ],
  "conditions": { /* Quando aplicar */ },
  "enforcement": "active"
}
```

### Regras Explicadas

#### 1. **creation**
```json
{
  "type": "creation",
  "parameters": {}
}
```
Previne que alguém crie uma nova branch com mesmo nome.

#### 2. **update**
```json
{
  "type": "update",
  "parameters": {}
}
```
Previne push direto para `main` (força usar PR).

#### 3. **deletion**
```json
{
  "type": "deletion",
  "parameters": {}
}
```
Previne que alguém delete a branch `main`.

#### 4. **required_status_checks**
```json
{
  "type": "required_status_checks",
  "parameters": {
    "strict_required_status_checks_policy": true,
    "required_status_checks": [
      { "context": "build" },
      { "context": "lint" },
      { "context": "test" }
    ]
  }
}
```
Exige que build, lint e testes passem antes de merge.

#### 5. **required_pull_request_reviews**
```json
{
  "type": "required_pull_request_reviews",
  "parameters": {
    "dismiss_stale_reviews_on_push": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1,
    "required_review_thread_resolution": true
  }
}
```
- Exige 1 aprovação
- Descarta reviews antigos quando novo código é pushed
- Exige resolver todos os comentários

#### 6. **non_fast_forward**
```json
{
  "type": "non_fast_forward",
  "parameters": {}
}
```
Exige merge commit (não permite rebase direto).

#### 7. **commit_message_pattern**
```json
{
  "type": "commit_message_pattern",
  "parameters": {
    "operator": "starts_with",
    "pattern": "^(feat|fix|docs|style|refactor|perf|test|chore|ci):",
    "negate": false
  }
}
```
Garante que commits sigam padrão convencional:
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `perf:` - Performance
- `test:` - Testes
- `chore:` - Manutenção
- `ci:` - CI/CD

#### 8. **commit_author_email_pattern**
```json
{
  "type": "commit_author_email_pattern",
  "parameters": {
    "operator": "contains",
    "pattern": "@",
    "negate": false
  }
}
```
Garante que email do autor contém `@` (email válido).

---

## 🎯 Padrão de Commits Esperado

Com este ruleset, seus commits devem seguir:

```bash
# ✅ Válidos
git commit -m "feat: Adicionar sincronização de letras"
git commit -m "fix: Corrigir bug no player"
git commit -m "docs: Atualizar README"
git commit -m "test: Adicionar testes para player"
git commit -m "refactor: Melhorar estrutura de hooks"

# ❌ Inválidos
git commit -m "Update"
git commit -m "fix bug"
git commit -m "asdf"
```

---

## 🔄 Fluxo com Ruleset Ativo

```
1. Você cria feature branch
   git checkout -b feature/nova-funcionalidade

2. Faz commits com padrão convencional
   git commit -m "feat: Adicionar nova funcionalidade"

3. Push para GitHub
   git push origin feature/nova-funcionalidade

4. Abre Pull Request
   GitHub verifica:
   ✅ Commit message válido
   ✅ Email do autor válido
   ✅ Status checks passando

5. Aguarda aprovação
   Alguém clica "Approve"

6. Merge
   GitHub verifica:
   ✅ 1 aprovação recebida
   ✅ Comentários resolvidos
   ✅ Branch atualizada
   ✅ Status checks passando
   
7. Merge realizado com merge commit
```

---

## 🛠️ Customizar o Ruleset

### Adicionar Mais Status Checks

Se você tiver mais verificações (segurança, cobertura de código, etc):

```json
"required_status_checks": [
  { "context": "build" },
  { "context": "lint" },
  { "context": "test" },
  { "context": "security" },
  { "context": "coverage" }
]
```

### Exigir Mais Aprovações

Para exigir 2 aprovações em vez de 1:

```json
"required_approving_review_count": 2
```

### Permitir Rebase

Se quiser permitir rebase em vez de merge commit:

Remova a regra `non_fast_forward`.

### Padrão de Commit Customizado

Se quiser permitir outros prefixos:

```json
"pattern": "^(feat|fix|docs|style|refactor|perf|test|chore|ci|release):"
```

---

## 📊 Verificar Status do Ruleset

### Via GitHub CLI
```bash
gh api repos/SrTharos/simplay-mobile/rulesets
```

### Via Interface Web
1. Settings → Rules → Rulesets
2. Clique no ruleset
3. Veja status e estatísticas

---

## 🆘 Problemas Comuns

### "Merge bloqueado - status checks falhando"
**Solução:** Verifique os logs do build/lint/test e corrija os erros.

### "Merge bloqueado - falta aprovação"
**Solução:** Peça para alguém revisar e aprovar o PR.

### "Commit rejeitado - mensagem inválida"
**Solução:** Rebase e corrija a mensagem:
```bash
git commit --amend -m "feat: Mensagem corrigida"
git push --force-with-lease
```

### "Não consigo deletar branch"
**Solução:** A regra `deletion` está protegendo. Use:
```bash
gh api repos/SrTharos/simplay-mobile/git/refs/heads/feature-name -X DELETE
```

---

## 📚 Recursos Adicionais

- [GitHub Rulesets Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI Docs](https://cli.github.com/manual/)

---

## ✅ Checklist de Implementação

- [ ] Arquivo `.github/simplay-ruleset.json` está no repositório
- [ ] Criei o ruleset via GitHub CLI ou interface web
- [ ] Testei criando um PR com commit inválido (deve ser rejeitado)
- [ ] Testei criando um PR com commit válido (deve ser aceito)
- [ ] Verifiquei que status checks são exigidos
- [ ] Verifiquei que aprovação é exigida
- [ ] Testei que force push é bloqueado
- [ ] Documentei o padrão de commits para a equipe

---

**Parabéns! Seu repositório está protegido com ruleset! 🔐**
