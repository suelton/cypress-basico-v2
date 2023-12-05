/// <reference types="Cypress" />

beforeEach(() => {
  cy.visit("./src/index.html");
});

describe("Central de Atendimento ao Cliente TAT", function () {
  it("verifica o título da aplicação", function () {
    cy.title().should("include", "Central de Atendimento ao Cliente TAT");
  });

  it("Preencha os campos obrigatórios e envie o formulário", function () {
    const longText =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl quis aliquam lacinia, nunc nisl aliquet nunc, quis aliquam nis";
    cy.get("#firstName").type("Suelton", { delay: 0 });
    cy.get("#lastName").type("Teixeira", { delay: 0 });
    cy.get("#email").type("suelton@gmail.com", { delay: 0 });
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();
    cy.get(".success").should("be.visible");
  });

  it("Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.get("#firstName").type("Suelton", { delay: 0 });
    cy.get("#lastName").type("Teixeira", { delay: 0 });
    cy.get("#email").type("12334@12323", { delay: 0 });
    cy.get("#open-text-area").type("Fazendo qualquer coisa", { delay: 0 });
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.get("#firstName").type("Suelton", { delay: 0 });
    cy.get("#lastName").type("Teixeira", { delay: 0 });
    cy.get("#email").type("suelton@gmail.com", { delay: 0 });
    cy.get("#phone").type("xxxxxx", { delay: 0 }).should("have.value", "");
    cy.get("#open-text-area").type("Fazendo qualquer coisa", { delay: 0 });
    cy.get("#phone-checkbox").check();
    cy.contains("button", "Enviar").click();
    cy.get('span[class="error"]').should(
      "contain",
      "Valide os campos obrigatórios!"
    );
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName")
      .type("Suelton", { delay: 0 })
      .should("have.value", "Suelton")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Teixeira", { delay: 0 })
      .should("have.value", "Teixeira")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("suelton@gmail.com", { delay: 0 })
      .should("have.value", "suelton@gmail.com")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type("12345", { delay: 0 })
      .should("have.value", "12345")
      .clear()
      .should("have.value", "");

    cy.get("#open-text-area")
      .type("Fazendo qualquer coisa", { delay: 0 })
      .should("have.value", "Fazendo qualquer coisa")
      .clear()
      .should("have.value", "");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.get(".button").click();
    cy.get(".error").should("be.visible");
  });

  it("envia o formuário com sucesso usando um comando customizado", () => {
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success").should("be.visible");
  });

  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.get("select").select("youtube").should("have.value", "youtube");
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", () => {
    cy.get("select").select("mentoria").should("have.value", "mentoria");
  });

  it("seleciona um produto (Blog) por seu índice", () => {
    cy.get("select").select(1).should("have.value", "blog");
  });

  it('marca o tipo de atendimento "Feedback', () => {
    cy.get('[type="radio"]').check("feedback").should("be.checked");
  });

  it("marca cada tipo de atendimento", () => {
    // cy.get('[type="radio"]').check("ajuda").should("be.checked");
    // cy.get('[type="radio"]').check("elogio").should("be.checked");
    // cy.get('[name="atendimento-tat"]').check("feedback").should("be.checked");

    cy.get('[type="radio"]')
      .should("have.length", 3)
      .each(($radio) => {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('[type="checkbox"]')
      .should("have.length", 2)
      .each(($checkbox) => {
        cy.wrap($checkbox).check();
        cy.wrap($checkbox).should("be.checked");
      })
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json")
      .should(($input) => {
        expect($input[0].files[0].name).to.eq("example.json");
      });
  });

  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      //.selectFile("cypress/fixtures/example.json", { action: "drag-n-drop" })
      .should(($input) => {
        expect($input[0].files[0].name).to.eq("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json", null).as("sampleFile");
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("@sampleFile")
      .should(($input) => {
        expect($input[0].files[0].name).to.eq("example.json");
      });
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });

  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.get("#privacy a").invoke("removeAttr", "target").click();

    cy.contains("Talking About Testing").should("be.visible");
  });
});
