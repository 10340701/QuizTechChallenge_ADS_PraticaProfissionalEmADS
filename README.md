
# QuizTech Challenge

## Descrição

O **QuizTech Challenge** é uma aplicação baseada em um sistema de quiz interativo com níveis e validação de progresso do usuário. O projeto possui um frontend em HTML, CSS e JavaScript, além de um backend em Node.js para gerenciamento de usuários e níveis.

## Estrutura do Projeto

```plaintext
.
├── backend/                   # Código do servidor Node.js
│   ├── server.js              # Servidor principal
│   ├── unidades/              # Diretório contendo os arquivos JSON das questões por unidade
│       ├── unidade1.json
│       ├── unidade2.json
│       ├── ... (mais arquivos por unidade)
├── frontend/                  # Código do frontend
│   ├── css/
│   │   ├── styles.css         # Estilos do frontend
│   ├── js/
│   │   ├── index.js           # Lógica do frontend
│   ├── index.html             # Página principal
├── README.md                  # Documentação
```

---

## Pré-requisitos

- **Node.js** (v14 ou superior)
- **NPM** ou **Yarn**
- **Browser moderno** (Google Chrome, Firefox, etc.)

---

## Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/10340701/QuizTechChallenge_ADS_PraticaProfissionalEmADS
cd QuizTechChallenge_ADS_PraticaProfissionalEmADS
```

### 2. Configure o backend
1. Navegue para o diretório do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Certifique-se de que os arquivos de questões (`unidade1.json`, `unidade2.json`, etc.) estejam no diretório `unidades/`.

4. Inicie o servidor:
   ```bash
   node server.js
   ```
   O servidor será iniciado em `http://localhost:3000`.

### 3. Configure o frontend
1. Volte para o diretório principal e navegue para o frontend:
   ```bash
   cd ../frontend
   ```

2. Abra o arquivo `index.html` em um navegador ou use um servidor local:
   - **Com VS Code Live Server:** Clique em "Go Live".
   - **Com Python:** Execute:
     ```bash
     python -m http.server
     ```

---

## Utilização

### Fluxo do Quiz
1. **Seleção de Unidade:**  
   Na tela inicial, selecione uma unidade para começar o quiz.
   
2. **Validação de Usuário:**  
   O sistema valida automaticamente o usuário com base no `id_user` salvo no `localStorage`. Caso o usuário não seja encontrado, um novo será criado.

3. **Níveis e Progresso:**  
   - Cada nível é desbloqueado ao atingir a pontuação mínima necessária.
   - Pontuação mínima para aprovação: **7 acertos**.

4. **Respostas:**  
   Após selecionar uma resposta, o sistema verifica automaticamente a pontuação e avança para a próxima questão.

---

## Endpoints do Backend

### Validação de Usuário
- **POST** `/validar_users`
  - **Body:**
    ```json
    { "id_user": "123456" }
    ```

### Atualizar Nível do Usuário
- **PUT** `/user/nivel`
  - **Body:**
    ```json
    { "id_user": "123456", "nivel": 2 }
    ```

### Obter Nível do Usuário
- **GET** `/user/nivel?id_user=123456`

### Obter Questões
- **GET** `/questoes?unidade=1`

---

## Configuração Personalizada

### Variáveis de Configuração
No arquivo `js/index.js`, as variáveis globais podem ser ajustadas:
- **`host`**: URL do backend (ex.: `http://localhost:3000`).
- **`limite_de_questao`**: Número de questões por unidade (padrão: `10`).
- **`acertos_aprovado`**: Pontuação mínima para aprovação (padrão: `7`).

---

## Como Contribuir

1. Faça um fork do repositório.
2. Crie um branch para sua feature:
   ```bash
   git checkout -b feature/nova-feature
   ```
3. Faça as alterações necessárias e commite:
   ```bash
   git commit -m "Descrição da alteração"
   ```
4. Envie as alterações:
   ```bash
   git push origin feature/nova-feature
   ```
5. Abra um Pull Request no repositório original.

---

## Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para usá-lo e modificá-lo conforme necessário.
