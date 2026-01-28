# 🔒 Configuração de Branch Protection - SimPlay Mobile

Este guia te ajudará a configurar a proteção de branch no GitHub para garantir qualidade e segurança do código.

## ⚠️ Pré-requisitos

- **GitHub Pro** (recomendado) OU
- **Repositório Público** (alternativa gratuita)

Se seu repositório é privado e você não tem GitHub Pro, você pode:
1. Fazer upgrade para GitHub Pro
2. Tornar o repositório público
3. Usar este guia como referência para quando tiver acesso

---

## 🔧 Configurar Branch Protection (Interface Web)

### Passo 1: Acessar Configurações do Repositório

1. Vá para https://github.com/SrTharos/simplay-mobile
2. Clique em **Settings** (Engrenagem no topo)
3. No menu lateral, clique em **Branches**

### Passo 2: Adicionar Regra de Proteção

1. Clique em **Add rule** ou **Add branch protection rule**
2. Em **Branch name pattern**, digite: `main`
3. Clique em **Create**

### Passo 3: Configurar Requisitos

Após criar a regra, você verá várias opções. Configure assim:

#### ✅ Require a pull request before merging
- **Require approvals** - Marque esta opção
- **Required number of approvals before merging** - Defina como `1`
- **Dismiss stale pull request approvals when new commits are pushed** - Marque

#### ✅ Require status checks to pass before merging
- **Require branches to be up to date before merging** - Marque
- **Require status checks to pass before merging** - Marque
- Em **Status checks that must pass**, selecione:
  - `build` (se tiver CI/CD configurado)
  - `lint` (se tiver linter)
  - `test` (se tiver testes)

#### ✅ Require code owner review
- Deixe desmarcado (opcional)

#### ✅ Require conversation resolution before merging
- Marque esta opção
- Garante que todos os comentários sejam resolvidos

#### ✅ Require signed commits
- Deixe desmarcado (opcional, mas recomendado para segurança)

#### ✅ Require linear history
- Deixe desmarcado (permite merge commits)

#### ✅ Allow force pushes
- Deixe desmarcado (previne sobrescrita de histórico)

#### ✅ Allow deletions
- Deixe desmarcado (protege contra exclusão acidental)

### Passo 4: Salvar

1. Role até o final
2. Clique em **Save changes**

---

## 📋 Resumo das Configurações

| Opção | Status | Razão |
|-------|--------|-------|
| Require pull request | ✅ Ativado | Garante code review |
| Require approvals | ✅ 1 aprovação | Validação mínima |
| Dismiss stale reviews | ✅ Ativado | Força revisão de novo código |
| Require status checks | ✅ Ativado | Valida build/testes |
| Require up to date | ✅ Ativado | Evita conflitos |
| Require conversation resolution | ✅ Ativado | Resolve todos os comentários |
| Require signed commits | ❌ Opcional | Segurança extra |
| Require linear history | ❌ Desativado | Permite merge commits |
| Allow force pushes | ❌ Desativado | Protege histórico |
| Allow deletions | ❌ Desativado | Protege branch |

---

## 🔄 Fluxo de Trabalho com Branch Protection

### Para Desenvolvedores

1. **Criar Feature Branch**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

2. **Fazer Commits**
   ```bash
   git commit -m "feat: Adicionar nova funcionalidade"
   ```

3. **Push para GitHub**
   ```bash
   git push origin feature/nova-funcionalidade
   ```

4. **Abrir Pull Request**
   - Vá para o repositório no GitHub
   - Clique em **Compare & pull request**
   - Preencha título e descrição
   - Clique em **Create pull request**

5. **Aguardar Aprovação**
   - Status checks rodam automaticamente
   - Aguarde pelo menos 1 aprovação
   - Resolva comentários se houver
   - Clique em **Merge pull request**

### Para Mantenedores

1. **Revisar Pull Request**
   - Leia o código
   - Verifique se segue padrões
   - Teste localmente se necessário

2. **Aprovar ou Solicitar Mudanças**
   - Clique em **Review changes**
   - Selecione **Approve** ou **Request changes**
   - Clique em **Submit review**

3. **Merge**
   - Após aprovação e status checks passarem
   - Clique em **Merge pull request**
   - Selecione estratégia de merge:
     - **Create a merge commit** (recomendado)
     - **Squash and merge** (para histórico limpo)
     - **Rebase and merge** (para histórico linear)

---

## 🚀 Boas Práticas

### Commits
```bash
# ✅ Bom
git commit -m "feat: Adicionar sincronização de letras"
git commit -m "fix: Corrigir bug no player"
git commit -m "docs: Atualizar README"

# ❌ Ruim
git commit -m "update"
git commit -m "fix stuff"
git commit -m "asdf"
```

### Pull Requests
```
Título: feat: Adicionar sincronização de letras

Descrição:
## Mudanças
- Implementado hook useLyricsSync
- Criado componente LyricsDisplay
- Adicionado editor de letras

## Testes
- Testado no Android
- Testado no iOS
- Testado no Web

## Screenshots
[Adicionar screenshots se aplicável]

Fixes #123
```

### Branch Names
```bash
# ✅ Bom
feature/sync-lyrics
bugfix/player-crash
docs/update-readme

# ❌ Ruim
new-feature
bug-fix
update
```

---

## 🔐 Segurança Adicional

### Configurar Secrets (Variáveis de Ambiente)

1. Vá para **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Adicione secrets necessários:
   - `API_KEY` (se usar APIs)
   - `SIGNING_KEY` (se assinar commits)

### Configurar Deploy Keys (SSH)

1. Vá para **Settings** → **Deploy keys**
2. Clique em **Add deploy key**
3. Cole sua chave SSH pública
4. Marque **Allow write access** se necessário

---

## 📊 Monitorar Status

### Ver Status de Proteção

1. Vá para **Settings** → **Branches**
2. Clique em **main** para ver detalhes
3. Você verá:
   - ✅ Status checks passando
   - ✅ Aprovações recebidas
   - ✅ Conversas resolvidas

### Ver Histórico de Merges

1. Vá para **Insights** → **Network**
2. Visualize o histórico de commits e branches
3. Veja quando cada PR foi mergeado

---

## 🆘 Solução de Problemas

### "Branch protection rule not available"
- Você precisa de GitHub Pro ou repositório público
- Considere fazer upgrade ou tornar público

### "Status checks are failing"
- Verifique os logs do build
- Corrija os erros localmente
- Faça novo commit e push

### "Waiting for status checks"
- Aguarde os testes rodarem
- Pode levar alguns minutos
- Verifique em **Actions** para ver progresso

### "Merge button is disabled"
- Verifique se todas as condições foram atendidas:
  - ✅ PR aprovado
  - ✅ Status checks passando
  - ✅ Sem conflitos
  - ✅ Branch atualizado

---

## 📚 Recursos Adicionais

- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## ✅ Checklist de Configuração

- [ ] Acessei Settings → Branches
- [ ] Criei regra de proteção para `main`
- [ ] Ativei "Require pull request before merging"
- [ ] Defini 1 aprovação necessária
- [ ] Ativei "Dismiss stale reviews"
- [ ] Ativei "Require status checks to pass"
- [ ] Ativei "Require conversation resolution"
- [ ] Cliquei em "Save changes"
- [ ] Testei criando um PR de teste
- [ ] Verifiquei que as regras funcionam

---

**Parabéns! Seu repositório está protegido! 🔒**
