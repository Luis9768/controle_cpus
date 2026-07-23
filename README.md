<div align="center">
  <h1>💻 Gestão de Controle de CPUs</h1>
  <p><em>Um sistema desktop moderno para gestão de estoque e alocação física de CPUs em Posições de Atendimento (PAs).</em></p>
</div>

---

## ✨ Principais Funcionalidades

- 🏢 **Gestão de Salas e PAs:** Adição, remoção e monitoramento de capacidade de salas e PAs em tempo real.
- 📦 **Estoque e Rastreamento:** Cadastro completo de CPUs, edição, exclusão e rotulagem de origem e aquisições de forma dinâmica.
- 🖱️ **Interface Drag & Drop:** Movimente as máquinas livremente entre o estoque e as posições arrastando com o mouse, de forma totalmente intuitiva.
- 📝 **Histórico e Relatórios:** Todo movimento gera um registro no histórico. Importe dados em massa e exporte relatórios via planilhas Excel (XLSX).
- 👥 **Controle de Acesso:** Gestão de usuários com diferentes níveis de permissão (Administradores e Usuários Comuns).
- ☁️ **Cloud Backup:** Integração direta e segura com o **Supabase** para backup, garantindo proteção e restauração dos dados com apenas 1 clique.
- 🎨 **Design Premium:** UI moderna utilizando _Glassmorphism_, animações fluidas e suporte nativo a Tema Claro (☀️) e Tema Escuro (🌙).

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as mais modernas e performáticas ferramentas do ecossistema JavaScript:

- **[React 18](https://reactjs.org/)** - Renderização reativa e componentização.
- **[Vite](https://vitejs.dev/)** - Build tool ultrarrápido para desenvolvimento.
- **[Electron](https://www.electronjs.org/)** - Empacotamento para aplicativo Desktop independente (Windows `.exe`).
- **[Supabase](https://supabase.com/)** - Backend as a Service (BaaS) e armazenamento em nuvem.
- **Vanilla CSS** - Estilização limpa, leve e moderna, construída do zero.

## 🚀 Como Executar o Projeto Localmente

Siga o passo a passo abaixo para rodar a aplicação no seu ambiente de desenvolvimento:

1. **Clone o repositório e acesse o diretório:**
   ```bash
   git clone https://github.com/Luis9768/controle_cpus.git
   cd controle_cpus
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   *(O ambiente do Electron será aberto automaticamente carregando a aplicação local).*

4. **Gerando o executável final (.exe):**
   ```bash
   npm run build
   npm exec electron-builder -- --win
   ```
   *(O instalador finalizado estará disponível dentro da pasta `release`)*.

---

<div align="center">
  <p>Desenvolvido com 💙 para a otimização de parques tecnológicos.</p>
</div>
