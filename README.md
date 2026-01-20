
# ⚡ Math Flash Pro

**Math Flash Pro** é um jogo *Hyper-Casual* de raciocínio lógico ultra-rápido desenvolvido com React 19. Desafie seu cérebro decidindo se equações matemáticas são verdadeiras ou falsas em frações de segundo!

## 🚀 Funcionalidades Principal
- **Três Modos de Jogo:** Easy (8s), Medium (4s) e Hard (2.5s).
- **Sistema de Progressão:** Dificuldade adaptativa que aumenta conforme você pontua.
- **Identidade Local:** Suporte a múltiplos perfis de usuário com salvamento local (Privacy-First).
- **Motor de Som Procedural:** Áudio gerado via Web Audio API (sem assets externos, carregamento instantâneo).
- **Mobile First & PWA:** Totalmente instalável no Android/iOS, funciona offline e possui splash screen nativa.

## 🛠️ Tecnologias Utilizadas
- **Frontend:** React 19 (ESM), Tailwind CSS.
- **Ícones:** Lucide React.
- **PWA:** Service Workers, Web Manifest e Assets para TWA.
- **Hospedagem:** Otimizado para GitHub Pages.

## 📱 Preparado para a Google Play Store
Este repositório já inclui a estrutura necessária para ser convertido em um **Trusted Web Activity (TWA)**:
- Arquivo `.nojekyll` para suporte a pastas ocultas no GitHub.
- Configuração de `assetlinks.json` em `.well-known/` para validação de domínio digital.
- Manifest configurado para modo `standalone` e orientação `portrait`.

## 📦 Como Instalar (Desenvolvimento)
Como este projeto utiliza módulos ES modernos e CDN, você pode rodá-lo simplesmente servindo a pasta raiz com qualquer servidor HTTP local:
```bash
npx serve .
```

## 📄 Licença
Este projeto é distribuído sob a licença MIT. Sinta-se à vontade para clonar e monetizar!

---
*Desenvolvido para máxima performance e diversão rápida.*
