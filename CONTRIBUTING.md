# 🤝 Contribuindo para SimPlay Mobile

Obrigado por considerar contribuir para o SimPlay Mobile! Este documento fornece diretrizes e instruções para contribuir.

## 📋 Código de Conduta

Por favor, note que este projeto é lançado com um [Contributor Code of Conduct](CODE_OF_CONDUCT.md). Ao participar deste projeto, você concorda em cumprir seus termos.

## 🐛 Reportando Bugs

Antes de criar um relatório de bug, verifique a lista de issues, pois você pode descobrir que o bug já foi reportado. Ao criar um relatório de bug, inclua o máximo de detalhes possível:

- **Use um título descritivo** para o issue
- **Descreva os passos exatos** que reproduzem o problema
- **Forneça exemplos específicos** para demonstrar os passos
- **Descreva o comportamento observado** e **aponte qual é o problema** com esse comportamento
- **Explique qual é o comportamento esperado** e **por quê**
- **Inclua screenshots/vídeos** se possível
- **Mencione sua versão do Android/iOS** e **versão do app**

## 💡 Sugerindo Melhorias

Sugestões de melhorias são sempre bem-vindas! Ao criar uma sugestão de melhoria, inclua:

- **Use um título descritivo**
- **Forneça uma descrição detalhada** da melhoria sugerida
- **Liste exemplos específicos** para demonstrar os passos
- **Descreva o comportamento atual** e **o comportamento esperado**
- **Explique por que essa melhoria seria útil**

## 🚀 Pull Requests

- Preencha o template de PR completamente
- Siga o guia de estilo do projeto
- Inclua screenshots/vídeos para mudanças visuais
- Termine todos os arquivos com uma nova linha
- Evite código de plataforma específica a menos que necessário

## 📝 Guia de Estilo

### Git Commit Messages

- Use o tempo presente ("Add feature" não "Added feature")
- Use o modo imperativo ("Move cursor to..." não "Moves cursor to...")
- Limite a primeira linha a 72 caracteres ou menos
- Referencie issues e pull requests liberalmente após a primeira linha

Exemplo:
```
Add support for synced lyrics display

- Implement LyricsDisplay component
- Add useLyricsSync hook for managing lyrics
- Update player screen to show synced lyrics
- Add lyrics editor modal for manual sync

Fixes #123
```

### TypeScript/JavaScript

- Use TypeScript para novos código
- Siga as convenções de nomenclatura camelCase
- Use `const` por padrão, `let` quando necessário, evite `var`
- Adicione comentários JSDoc para funções públicas
- Use tipos explícitos quando não for óbvio

Exemplo:
```typescript
/**
 * Marca o tempo atual para uma linha de letra
 * @param lineIndex - Índice da linha
 * @param timeMs - Tempo em milissegundos
 */
const markTime = useCallback((lineIndex: number, timeMs: number) => {
  // implementação
}, []);
```

### React/React Native

- Use functional components com hooks
- Mantenha componentes pequenos e focados
- Use `useCallback` para funções passadas como props
- Use `useMemo` para valores computados caros
- Prefira composição sobre herança

### Styling

- Use NativeWind (Tailwind CSS) para styling
- Mantenha estilos consistentes com o design system
- Evite estilos inline quando possível
- Use cores do tema definidas em `theme.config.js`

## 🔄 Processo de Desenvolvimento

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie uma branch** para sua feature (`git checkout -b feature/amazing-feature`)
4. **Faça suas mudanças**
5. **Teste** suas mudanças completamente
6. **Commit** suas mudanças (`git commit -m 'Add amazing feature'`)
7. **Push** para sua branch (`git push origin feature/amazing-feature`)
8. **Abra um Pull Request**

## 🧪 Testando

Antes de submeter um PR, teste seu código:

```bash
# Verificar tipos TypeScript
pnpm check

# Executar linter
pnpm lint

# Testar no emulador/dispositivo
pnpm android
pnpm ios
pnpm dev
```

## 📚 Estrutura do Projeto

```
simplay-mobile/
├── app/              # Telas e rotas
├── components/       # Componentes reutilizáveis
├── hooks/            # Hooks customizados
├── types/            # Tipos TypeScript
├── assets/           # Imagens e ícones
├── lib/              # Utilitários
└── constants/        # Constantes
```

## 🎯 Áreas de Contribuição

- 🐛 **Bug Fixes** - Corrija bugs existentes
- ✨ **Novas Funcionalidades** - Implemente features do roadmap
- 📚 **Documentação** - Melhore README, comentários, etc
- 🎨 **UI/UX** - Melhore a interface e experiência do usuário
- ⚡ **Performance** - Otimize código e performance
- 🧪 **Testes** - Adicione testes unitários e de integração

## 📦 Dependências

Antes de adicionar uma nova dependência, considere:

- É realmente necessária?
- Qual é o tamanho do bundle?
- É mantida ativamente?
- Tem boa documentação?

Abra uma issue para discutir antes de adicionar dependências grandes.

## 📞 Contato

- **Issues** - Para bugs e features
- **Discussions** - Para perguntas e ideias
- **Pull Requests** - Para contribuições

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença MIT do projeto.

---

**Obrigado por contribuir para SimPlay Mobile! 🎵**
