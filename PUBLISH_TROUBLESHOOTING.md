# Troubleshooting - Aba Publish Bugada

## Problema Relatado

A aba "Publish" do Manus está incrementando a versão automaticamente sem respeitar as configurações:

- v1.0.2 configurado → Publica como v1.0.3
- v1.0.3 não compila → Publica como v1.0.4
- Versão não respeita `app.config.ts` e `package.json`

## Causa Provável

O sistema de publicação do Manus tem lógica de versionamento automático que:
1. Lê a versão atual
2. Incrementa automaticamente (patch version)
3. Ignora configurações locais
4. Não valida antes de publicar

## Solução Temporária

Criamos um arquivo `VERSION` na raiz do projeto com a versão fixa `1.0.2`. Isso serve como referência para você saber qual é a versão intencional.

## Recomendações

### Opção 1: Usar GitHub Releases (Recomendado)
Em vez de usar a aba Publish do Manus, publique diretamente no GitHub:

1. Vá para: https://github.com/SrTharos/simplay-mobile
2. Clique em **"Releases"**
3. Clique em **"Create a new release"**
4. Tag: `v1.0.2`
5. Title: `SimPlay Mobile v1.0.2`
6. Description: Copie do CHANGELOG.md
7. Publish release

### Opção 2: Usar Expo EAS (Se tiver conta Expo)
```bash
eas build --platform android --release-channel v1.0.2
eas submit -p android --release-channel v1.0.2
```

### Opção 3: Build Local APK
```bash
eas build --platform android --local
```

## Arquivos de Referência

- `VERSION` - Versão intencional (1.0.2)
- `app.config.ts` - Versão do Expo (1.0.2)
- `package.json` - Versão do NPM (1.0.2)
- `CHANGELOG.md` - Histórico de versões

## Próximos Passos

1. **Não use a aba Publish** até que o bug seja resolvido
2. **Use GitHub Releases** para publicar versões oficiais
3. **Teste localmente** antes de publicar
4. **Documente o problema** para suporte do Manus

---

**Status:** ⚠️ Aguardando resolução do bug de versionamento automático
