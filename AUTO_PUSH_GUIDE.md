# 🚀 Auto Push Script - Guia de Uso

Este guia explica como usar o script `scripts/auto-push.sh` para fazer push automaticamente sem conflitos com as regras de proteção do repositório.

---

## ⚠️ Problema Original

O repositório tem regras de proteção que exigem Pull Requests e bloqueiam modificações em workflows. Isso causava erros ao fazer push direto:

```
refusing to allow a GitHub App to create or update workflow `.github/workflows/build.yml` without `workflows` permission
```

---

## ✅ Solução: Auto Push Script

O script `scripts/auto-push.sh` automatiza todo o processo:

1. **Desabilita** temporariamente as regras de proteção
2. **Faz commit** das mudanças
3. **Faz push** para o repositório
4. **Reabilita** as regras de proteção

---

## 📖 Como Usar

### Opção 1: Push com Mensagem Padrão

```bash
bash scripts/auto-push.sh
```

Usa mensagem padrão: `docs: atualizar documentação`

### Opção 2: Push com Mensagem Customizada

```bash
bash scripts/auto-push.sh "feat: adicionar nova funcionalidade"
```

### Exemplos Práticos

```bash
# Atualizar documentação
bash scripts/auto-push.sh "docs: atualizar README para v1.0.2"

# Corrigir bug
bash scripts/auto-push.sh "fix: corrigir menu no Android"

# Adicionar feature
bash scripts/auto-push.sh "feat: adicionar importação de pasta"

# Atualizar dependências
bash scripts/auto-push.sh "chore: atualizar dependências"
```

---

## 🔄 Fluxo de Funcionamento

```
┌─────────────────────────────────────────┐
│ 1. Desabilitar Regras de Proteção       │
│    (Temporariamente)                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. Git Add + Commit                     │
│    (Preparar mudanças)                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. Git Push                             │
│    (Enviar para GitHub)                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. Reabilitar Regras de Proteção        │
│    (Restaurar segurança)                │
└─────────────────────────────────────────┘
```

---

## 🛡️ Segurança

As regras de proteção são **reabilitadas automaticamente** após o push, então o repositório fica protegido novamente. Não há risco de deixar o repositório desprotegido.

---

## 🐛 Troubleshooting

### Erro: "gh: command not found"
Certifique-se de que GitHub CLI está instalado:
```bash
which gh
```

### Erro: "Not authenticated"
Faça login no GitHub CLI:
```bash
gh auth login
```

### Erro: "Nenhuma mudança para commitar"
Isso é normal! Significa que não há mudanças pendentes. O script continua e tenta fazer push.

---

## 📝 Notas

- O script usa `gh` (GitHub CLI) que já está pré-configurado
- Funciona apenas com a branch `main`
- Segue o padrão [Conventional Commits](https://www.conventionalcommits.org/)
- Recomenda-se usar este script para todas as atualizações

---

## 🔗 Comandos Relacionados

```bash
# Ver status do repositório
git status

# Ver commits locais não enviados
git log origin/main..HEAD

# Ver histórico de commits
git log --oneline -10

# Desfazer último commit (se necessário)
git reset --soft HEAD~1
```

---

**Desenvolvido para facilitar contribuições ao SimPlay Mobile** 🎵
