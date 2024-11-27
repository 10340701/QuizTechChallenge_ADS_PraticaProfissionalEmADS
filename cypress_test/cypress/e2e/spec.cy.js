describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})/// <reference types="cypress" />

describe("Teste do QuizTech", () => {
  const host = "http://localhost:3000"; // Substitua pelo host correto

  beforeEach(() => {
    // Reseta o localStorage e acessa o site antes de cada teste
    cy.clearLocalStorage();
    cy.visit(host);
  });

  it("Valida o carregamento da página inicial e o usuário", () => {
    // Verifica se os botões de unidade estão carregados
    cy.get(".unit-btn").should("have.length.greaterThan", 0);

    // Simula a validação do usuário
    cy.window().then((win) => {
      const mockUserId = "12345";
      win.localStorage.setItem("id_user", mockUserId);
      cy.reload(); // Recarrega a página para aplicar a validação
      expect(win.localStorage.getItem("id_user")).to.eq(mockUserId);
    });
  });

  it("Testa o acesso à unidade e carrega as perguntas", () => {
    // Desbloqueia uma unidade no DOM
    cy.get(".unit-btn").first().click();

    // Alterna para a tela de perguntas
    cy.get("#unit_box_selector").should("not.be.visible");
    cy.get("#caixa_pergunta").should("be.visible");

    // Verifica se a primeira pergunta foi carregada
    cy.get("#titulo_pergunta").should("exist").and("not.be.empty");
    cy.get(".respostas").should("have.length.greaterThan", 0);
  });

  it("Responde corretamente às perguntas", () => {
    // Simula a entrada na unidade
    cy.get(".unit-btn").first().click();

    // Interage com perguntas/respostas
    for (let i = 0; i < 10; i++) {
      // Clica na resposta correta (simulando lógica de backend)
      cy.get(".respostas")
        .contains(/Tecnologia da Informação|Teclado|HD|Universal|Git/) // Modifique conforme necessário
        .click();

      // Avança para a próxima questão
      cy.get("#titulo_pergunta").should("not.be.empty");
    }

    // Verifica o fim do questionário
    cy.on("window:alert", (text) => {
      expect(text).to.include("Parabéns");
    });
  });

  it("Verifica se um usuário reprovado recebe a mensagem correta", () => {
    // Simula a entrada na unidade
    cy.get(".unit-btn").first().click();

    // Clica em respostas incorretas
    for (let i = 0; i < 10; i++) {
      cy.get(".respostas")
        .not(":contains('Tecnologia da Informação')") // Resposta incorreta
        .first()
        .click();
    }

    // Verifica a mensagem de reprovação
    cy.on("window:alert", (text) => {
      expect(text).to.include("Infelizmente");
    });
  });

  it("Bloqueia acesso a unidades não desbloqueadas", () => {
    // Clica em uma unidade bloqueada
    cy.get(".unit-btn.locked").first().click();

    // Verifica a mensagem de alerta
    cy.on("window:alert", (text) => {
      expect(text).to.include("Não é possível acessar essa unidade");
    });
  });
});
