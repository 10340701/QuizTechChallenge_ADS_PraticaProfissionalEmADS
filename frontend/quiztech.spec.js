// Importar os métodos para serem testados
const { request_unit, validar_usuario, addLevelUser, getNivelUser, proxima_questao } = require('./js/index');

// Mock para `fetch`
global.fetch = jest.fn();

describe("Funções principais do questionário", () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test("`request_unit` retorna perguntas embaralhadas", async () => {
    const mockResponse = {
      questoes: [
        { tituloquestao: "Pergunta 1", respostas: ["A", "B", "C"], id_resposta_correta: 0 },
        { tituloquestao: "Pergunta 2", respostas: ["D", "E", "F"], id_resposta_correta: 1 },
      ],
    };

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const perguntas = await request_unit(1);
    expect(perguntas).toHaveLength(2);
    expect(perguntas).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ tituloquestao: "Pergunta 1" }),
        expect.objectContaining({ tituloquestao: "Pergunta 2" }),
      ])
    );

    // Verificar se as perguntas foram embaralhadas
    expect(perguntas).not.toEqual(mockResponse.questoes);
  });

  test("`validar_usuario` cria novo usuário se não existir no localStorage", async () => {
    localStorage.removeItem("id_user");

    const mockUserResponse = { user: { id_user: "12345" } };
    fetch.mockResolvedValueOnce({
      status: 201,
      json: jest.fn().mockResolvedValueOnce(mockUserResponse),
    });

    await validar_usuario();

    expect(localStorage.getItem("id_user")).toBe("12345");
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/validar_users",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  test("`addLevelUser` incrementa o nível do usuário", async () => {
    localStorage.setItem("id_user", "12345");

    // Mock do nível do usuário
    fetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ user: { nivel: 2 } }),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce({ user: { nivel: 3 } }),
      });

    const newLevel = await addLevelUser();

    expect(newLevel).toBe(3);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/user/nivel",
      expect.objectContaining({
        method: "PUT",
      })
    );
  });

  test("`getNivelUser` retorna o nível correto", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ user: { nivel: 5 } }),
    });

    const nivel = await getNivelUser();

    expect(nivel).toBe(5);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/user/nivel?id_user=null",
      expect.objectContaining({ method: "GET" })
    );
  });

  test("`proxima_questao` exibe corretamente a próxima questão", async () => {
    // Configurar DOM simulado
    document.body.innerHTML = `
      <div id="caixa_pergunta"></div>
    `;

    const mockQuestoes = [
      { tituloquestao: "Pergunta 1", respostas: ["A", "B", "C"], id_resposta_correta: 0 },
      { tituloquestao: "Pergunta 2", respostas: ["D", "E", "F"], id_resposta_correta: 1 },
    ];

    global.lista_questoes_unidade = mockQuestoes;
    global.questaoatual = 0;

    proxima_questao();

    const tituloPergunta = document.getElementById("titulo_pergunta");
    expect(tituloPergunta).not.toBeNull();
    expect(tituloPergunta.textContent).toBe("Pergunta 1");

    const botoes = document.querySelectorAll(".respostas");
    expect(botoes).toHaveLength(3);
    expect(botoes[0].textContent).toBe("A");
    expect(botoes[1].textContent).toBe("B");
    expect(botoes[2].textContent).toBe("C");
  });
});
