# Controle de CPUs

Sistema de gestão de estoque e alocação de CPUs em PAs (Posições de Atendimento). Desenvolvido com React, Vite e Electron.

## Funcionalidades
- **Gestão de Salas e PAs:** Adição, remoção e monitoramento de salas e PAs em tempo real.
- **Estoque:** Cadastro, edição, e exclusão de CPUs. Identificação de aquisição (TIM, Affix) e flag (Auditen).
- **Interface Drag & Drop:** Movimente as máquinas livremente entre o estoque e as PAs arrastando com o mouse.
- **Histórico Automático:** Todo movimento gera um registro no histórico.
- **Gestão de Usuários:** Níveis de acesso para Administradores e Usuários Comuns.
- **Backup na Nuvem:** Integração direta com Supabase para backup e restore dos dados e configurações com 1 clique.
- **Design Premium:** UI Moderna com suporte a Tema Claro e Escuro (Dark Mode).

## Tecnologias
- React 18
- Vite
- Electron
- Supabase (Backend/Backup)
- Vanilla CSS + Glassmorphism

## Como rodar localmente
1. Instale as dependências: `npm install`
2. Rode em ambiente de desenvolvimento: `npm run dev`
3. Para gerar o executável (.exe): `npm run build` seguido de `npm exec electron-builder -- --win`
