// Seletores
const unitSelector = document.getElementsByClassName("unit-btn");
const quizContainer = document.getElementById("quiz-container");
const questionTitle = document.getElementById("question-title");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-btn");
const unitboxSelector = document.getElementById("unit_box_selector")
const caixa_de_perguntas = document.getElementById("caixa_pergunta")

let host = "http://54.158.115.48:3000"
let questaoatual = -1
let limite_de_questao = 10
let pontos_unidade = 0 // quantidade de pontos por unidade 
let acertos_aprovado = 7; // quantidade de pontos necessario para aprovação
let currentQuestionIndex = 0; // Índice da pergunta atual
let questions = []; // Array de perguntas
let score = 0; // Pontuação do jogador
let currentUnit = 0; // Unidade atual


console.log("JavaScript carregado!");

// Carregar progresso ao inicializar a página
document.addEventListener("DOMContentLoaded", () => {
  validar_usuario(); //Valida o usuário

  //Carregamento dos niveis
  carregar_nivel_unidade();

 
});


async function getNivelUser(){
  let id_user = await getIdUser()

  try {
    const response = await fetch(`${host}/user/nivel?id_user=${id_user}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseBody = await response.json(); // Processa o corpo da resposta como JSON
    console.log('Status Code:', response.status);
    console.log('Body:', responseBody);

    return responseBody.user.nivel;

} catch (error) {
    console.error('Erro na requisição:', error);
}

}

function getIdUser(){
  return localStorage.getItem('id_user');
}

async function addLevelUser(){
  //atualizar no backend
  let nivelatual = await getNivelUser();
  let id_user = await getIdUser()
  nivelatual += 1;

try {
    const response = await fetch(`${host}/user/nivel`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_user:id_user, nivel:nivelatual }) // Corpo da requisição
    });

    const responseBody = await response.json(); // Processa o corpo da resposta como JSON
    console.log('Status Code:', response.status);
    console.log('Body:', responseBody);

    return responseBody.user.nivel

} catch (error) {
    console.error('Erro na requisição:', error);
}

}

async function validar_usuario() {
  //pegar id do localstorage, se não tiver id, fazer um post para criar um novo usuário
  let  id_user = localStorage.getItem('id_user');

   try {
        const response = await fetch(`${host}/validar_users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_user }) // Corpo da requisição
        });

        const responseBody = await response.json(); // Processa o corpo da resposta como JSON
        console.log('Status Code:', response.status);
        console.log('Body:', responseBody);

        if(response.status == 404){
          localStorage.removeItem("id_user")
          await validar_usuario()
          await carregar_nivel_unidade()
        }
        if(response.status == 201) {
          localStorage.setItem('id_user', responseBody.user.id_user)
        }

    } catch (error) {
        console.error('Erro na requisição:', error);
    }

}

let lista_questoes_unidade = null
async function request_unit(nivel){
  //Faz a consulta no backend para obter as perguntas de determinada unidade

  try {
    const response = await fetch(`${host}/questoes?unidade=${nivel}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseBody = await response.json(); // Processa o corpo da resposta como JSON
    console.log('Status Code:', response.status);
    console.log('Body:', responseBody);
    
    // return responseBody.questoes
    const perguntasEmbaralhadas = responseBody.questoes.sort(() => Math.random() - 0.5);

    return perguntasEmbaralhadas;
    

} catch (error) {
    console.error('Erro na requisição:', error);
}


}

  function alternar_perguntas_unidades(){
    unitboxSelector.classList.toggle("hidden")
    caixa_de_perguntas.classList.toggle("hidden")
  }


  async function carregarQuestoes(unidade){
    //carregar as perguntas e respostas
    lista_questoes_unidade = await request_unit(unidade); //obter as questões
    proxima_questao()
    
  }

  function resetarQuestionario(){
    questaoatual = -1;
  }


  
  async function proxima_questao(){

    caixa_de_perguntas.innerHTML = ""
    questaoatual++
    // console.log(questaoatual)
    //preencher titulo
    let tituloPergunta = document.createElement('span')
    tituloPergunta.id = "titulo_pergunta"
    tituloPergunta.innerText = lista_questoes_unidade[questaoatual].tituloquestao
    tituloPergunta.style = "font-size:32px;font-weight:bold;margin-bottom:15px"
    caixa_de_perguntas.appendChild(tituloPergunta)
    
    //preencher respostas
    Array.from(lista_questoes_unidade[questaoatual].respostas).forEach(element => {
      //Criar botao respostas
      let btnresposta = document.createElement('button');
      btnresposta.innerHTML = element
      btnresposta.classList.add("respostas")
      btnresposta.addEventListener('click', validarResposta)
      btnresposta.style = "margin:0px;margin-bottom:10px;"
      caixa_de_perguntas.appendChild(btnresposta)
  });

  

  }

 
 async function validarResposta(event){
  
    let resposta_correta = lista_questoes_unidade[questaoatual].respostas[lista_questoes_unidade[questaoatual].id_resposta_correta]
    
    //se resposta tiver certa acumular mais um pontos de unidade e ir para proxima questao
    let elemento = event.target
    let texto = elemento.innerHTML


    if(texto == resposta_correta){
      pontos_unidade++
      // console.log("Acertou! Questão " + questaoatual + " de " + 10 )
    }

    //Se ultrapasssar o limite de questoes permitidas
    if(questaoatual >= 10){
      let nivelUser = await getNivelUser()
      //reseta o questionario
      resetarQuestionario()
      
      //processa a qunatidade de acertos
      if(pontos_unidade >= acertos_aprovado){
        //atualizar dados usuario contabilizando mais um nivel
            //post backend acrescentar nivel para id do usuario
            await addLevelUser()
        alert("Parabens!!! Você foi aprovado na Unidade " + nivelUser)
        //exibir parabens e btn para tela inicial
      }
      else{
        alert("Infelizmente você não foi aprovado na Unidade " + nivelUser + ", tente novamente!")
      }

      alternar_perguntas_unidades();
      carregar_nivel_unidade();

      return
    }

    //se resposta tiver errada ir para proxima questao
    proxima_questao()
  }


async function carregar_nivel_unidade(){
  let nivelUser = await getNivelUser()
  unitSelector[nivelUser].classList.add("pending")

  //desbloquear niveis com base no level do usuario
  for(let i=0; i < 6; i++){

   

    if(nivelUser > i) unitSelector[i].classList.remove("locked")

    if(i < nivelUser - 1) unitSelector[i].classList.add("done")
      

    //exibir caixa de perguntas e respostas
    unitSelector[i].addEventListener('click', submeter_unidade)

  }
}

async function submeter_unidade(event){
  let nivelUser = await getNivelUser()
  let unidade_selecionada = event.target.getAttribute('data-unit');
  if(nivelUser >= unidade_selecionada){
    alternar_perguntas_unidades()
    carregarQuestoes(unidade_selecionada);
  }
  else{
    alert("Não é possível acessar essa unidade!")
  }
}