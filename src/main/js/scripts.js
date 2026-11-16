/* PÁGINA DE PACOTES*/
(function () {
  var janela = document.getElementById("janela-detalhes");

  // Se a página não tiver a janela de detalhes, não executa esta parte.
  if (janela) {
    var cards = document.querySelectorAll(".card-passeio");

    cards.forEach(function (card) {
      var botao = card.querySelector(".card-abrir");
      if (!botao) return;

      botao.addEventListener("click", function () {
        var categoria = card.closest(".categoria-pacotes");
        var tituloCategoria = categoria ? categoria.querySelector("h3") : null;
        var detalhes = card.querySelector(".card-detalhes");
        var completo = card.querySelector(".card-completo");
        var preco = card.querySelector(".card-preco");
        var imagem = card.querySelector(".card-imagem");

        janela.querySelector(".janela-categoria").textContent = tituloCategoria
          ? tituloCategoria.textContent
          : "Passeio";
        janela.querySelector(".janela-titulo").textContent = botao.textContent;

        if (detalhes) {
          janela.querySelector(".janela-meta").textContent =
            detalhes.textContent;
        }
        if (completo) {
          janela.querySelector(".janela-texto").innerHTML = completo.innerHTML;
        }
        if (preco) {
          janela.querySelector(".janela-preco").innerHTML = preco.innerHTML;
        }
        if (imagem) {
          janela.querySelector(".janela-imagem").innerHTML = imagem.innerHTML;
        }

        janela.showModal();
      });
    });

    var botaoFecharDetalhes = janela.querySelector(".janela-fechar");
    if (botaoFecharDetalhes) {
      botaoFecharDetalhes.addEventListener("click", function () {
        janela.close();
      });
    }

    janela.addEventListener("click", function (evento) {
      if (evento.target === janela) {
        janela.close();
      }
    });
  }

  // Carrega os dados do arquivo tabela.json e monta a tabela.
  var corpoTabela = document.getElementById("corpo-tabela");

  if (corpoTabela) {
    function carregarTabela() {
      var requisicao = new XMLHttpRequest();
      requisicao.open("GET", "tabela.json", true);

      requisicao.onload = function () {
        if (requisicao.status >= 200 && requisicao.status < 300) {
          try {
            var passeios = JSON.parse(requisicao.responseText);
            corpoTabela.innerHTML = "";

            passeios.forEach(function (passeio) {
              var linha = document.createElement("tr");

              var colunaPasseio = document.createElement("td");
              colunaPasseio.textContent = passeio.passeio;

              var detalhes = document.createElement("span");
              detalhes.className = "detalhes-passeio";
              detalhes.textContent = "Saída: " + passeio.saida;
              colunaPasseio.appendChild(detalhes);

              var colunaDia = document.createElement("td");
              colunaDia.textContent = passeio.dia;

              var colunaHorario = document.createElement("td");
              colunaHorario.textContent = passeio.horario;

              var colunaValor = document.createElement("td");
              colunaValor.textContent = passeio.valor;

              linha.appendChild(colunaPasseio);
              linha.appendChild(colunaDia);
              linha.appendChild(colunaHorario);
              linha.appendChild(colunaValor);
              corpoTabela.appendChild(linha);
            });
          } catch (erro) {
            console.error(
              "O arquivo tabela.json não contém um JSON válido:",
              erro,
            );
          }
        } else {
          console.error("Erro ao carregar tabela.json:", requisicao.status);
        }
      };

      requisicao.onerror = function () {
        console.error("Não foi possível acessar tabela.json.");
      };

      requisicao.send();
    }

    carregarTabela();
  }
})();

/*  PÁGINA DO QUIZ */
(function () {
  var elementoPergunta = document.querySelector(".pergunta");
  var botoesOpcao = document.querySelector(".opcoes");
  var botaoProximo = document.querySelector(".botao-proximo");
  var progresso = document.querySelector(".progresso");
  var resultadoQuiz = document.querySelector(".resultado-quiz");
  var resultadoImagem = document.querySelector(".resultado-imagem");
  var resultadoCategoria = document.querySelector(".resultado-categoria");
  var resultadoNome = document.querySelector(".resultado-nome");
  var resultadoDesc = document.querySelector(".resultado-descricao");

  // Só executa o quiz na página que possui seus elementos.
  if (
    !elementoPergunta ||
    !botoesOpcao ||
    !botaoProximo ||
    !progresso ||
    !resultadoQuiz ||
    !resultadoImagem ||
    !resultadoCategoria ||
    !resultadoNome ||
    !resultadoDesc
  ) {
    return;
  }

  var perguntas = [
    {
      pergunta: "O que mais te interessa em um lugar?",
      opcoes: [
        { texto: "A história e pessoas que estão por trás", perfil: "A" },
        { texto: "Experiência do momento e sensações", perfil: "B" },
      ],
    },
    {
      pergunta: "Você se considera uma pessoa mais...",
      opcoes: [
        { texto: "Tradicional e que prefere coisas com renome", perfil: "A" },
        { texto: "Moderna e disposta a conhecer coisas novas", perfil: "B" },
      ],
    },
    {
      pergunta: "Qual ritmo você prefere?",
      opcoes: [
        { texto: "Muita coisa em pouco tempo", perfil: "A" },
        { texto: "Calmo e com pausas", perfil: "B" },
      ],
    },
    {
      pergunta: "No fim da semana, você prefere...",
      opcoes: [
        { texto: "Sair para um lugar agitado", perfil: "A" },
        { texto: "Repor as energias em um lugar tranquilo", perfil: "B" },
      ],
    },
    {
      pergunta: "Diante de algo novo, você...",
      opcoes: [
        { texto: "Quero experimentar", perfil: "A" },
        { texto: "Quero entender", perfil: "B" },
      ],
    },
    {
      pergunta: "Que tipo de ambiente você prefere?",
      opcoes: [
        { texto: "Cidade movimentada", perfil: "A" },
        { texto: "Natureza e paisagens", perfil: "B" },
      ],
    },
  ];

  var matrizResultados = [
    ["Italiana", "Antiga", "Assombrada"],
    ["Arquitetonica", "Artistica", "Urbana"],
    ["Verde", "Independente", "Alto"],
    ["Cafe", "Oriental", "Sabores"],
  ];

  var tours = {
    Italiana: {
      nome: "Sampa Italiana",
      descricao:
        "Bixiga e suas cantinas, da Estação Brigadeiro à Escadaria do Bixiga.",
      imagem: "img/SampaItaliana.png",
    },
    Antiga: {
      nome: "Sampa Antiga",
      descricao:
        "Praça da República, Theatro Municipal, Pateo do Collegio e Catedral da Sé.",
      imagem: "img/SampaAntiga.png",
    },
    Assombrada: {
      nome: "Sampa Assombrada",
      descricao:
        "Lendas urbanas da Estação São Bento ao Cemitério da Consolação.",
      imagem: "img/SampaAssombrada.png",
    },
    Arquitetonica: {
      nome: "Sampa Arquitetônica",
      descricao: "Do MASP à Casa das Rosas pela Avenida Paulista.",
      imagem: "img/SampaArquitetonica.png",
    },
    Artistica: {
      nome: "Sampa Artística",
      descricao:
        "Museu da Língua Portuguesa, Pinacoteca e MASP, com trecho de van.",
      imagem: "img/SampaArtistica.png",
    },
    Urbana: {
      nome: "Sampa Urbana",
      descricao: "Arte de rua e grafites no Beco do Batman, na Vila Madalena.",
      imagem: "img/SampaUrbana.png",
    },
    Verde: {
      nome: "Sampa Verde",
      descricao: "Parque Ibirapuera: lago, Marquise, Oca e áreas verdes.",
      imagem: "img/SampaVerde.png",
    },
    Independente: {
      nome: "Sampa Independente",
      descricao: "Parque da Independência e arredores do Museu do Ipiranga.",
      imagem: "img/SampaIndependente.png",
    },
    Alto: {
      nome: "Sampa do Alto",
      descricao:
        "Vistas do centro: Largo São Bento, Anhangabaú e Farol Santander.",
      imagem: "img/SampaAlto.png",
    },
    Cafe: {
      nome: "Sampa Café",
      descricao: "Cafeterias da Vila Madalena e de Pinheiros.",
      imagem: "img/SampaCafe.png",
    },
    Oriental: {
      nome: "Sampa Oriental Gastronômica",
      descricao: "Sabores japoneses e asiáticos pela Liberdade.",
      imagem: "img/SampaOrientalGastronomica.png",
    },
    Sabores: {
      nome: "Sampa de Sabores",
      descricao:
        "Mercado Municipal: bancas, queijos, temperos e o sanduíche de mortadela.",
      imagem: "img/SampaSabores.png",
    },
  };

  var categoriaNomes = [
    "História e Cultura",
    "Arte e Arquitetura",
    "Pontos Turísticos",
    "Gastronomia",
  ];

  var perguntaAtualIndice = 0;
  var respostas = [];
  var categoriaResultado = 0;

  function comecarQuiz() {
    perguntaAtualIndice = 0;
    respostas = [];
    mostrarPergunta();
  }

  function resetarEstado() {
    botaoProximo.style.display = "none";
    resultadoQuiz.style.display = "none";
    botoesOpcao.innerHTML = "";
  }

  function mostrarPergunta() {
    resetarEstado();

    var perguntaAtual = perguntas[perguntaAtualIndice];
    var perguntaNum = perguntaAtualIndice + 1;

    progresso.textContent = perguntaNum + "/6";
    elementoPergunta.textContent = perguntaNum + ". " + perguntaAtual.pergunta;

    perguntaAtual.opcoes.forEach(function (opcao) {
      var labelOpcao = document.createElement("label");
      labelOpcao.classList.add("opcao");

      var botao = document.createElement("input");
      botao.type = "radio";
      botao.name = "opcao";
      botao.value = opcao.perfil;

      labelOpcao.appendChild(botao);
      labelOpcao.appendChild(document.createTextNode(opcao.texto));
      botoesOpcao.appendChild(labelOpcao);

      botao.addEventListener("change", selecionaOpcao);
    });
  }

  function selecionaOpcao() {
    var botaoSelecionado = document.querySelector(
      'input[name="opcao"]:checked',
    );
    if (!botaoSelecionado) return;

    respostas[perguntaAtualIndice] = botaoSelecionado.value;
    botaoProximo.style.display = "block";
  }

  function calcularResultado() {
    categoriaResultado =
      (respostas[0] === "A" ? 0 : 2) + (respostas[1] === "A" ? 0 : 1);

    var contagem = respostas.slice(2).filter(function (resposta) {
      return resposta === "A";
    }).length;

    var faixa = contagem <= 1 ? 0 : contagem === 2 ? 1 : 2;
    return matrizResultados[categoriaResultado][faixa];
  }

  function mostrarResultado() {
    resetarEstado();

    var tourFinal = calcularResultado();
    elementoPergunta.textContent = "A SUA TOUR IDEAL É...";
    resultadoQuiz.style.display = "block";
    resultadoCategoria.textContent = categoriaNomes[categoriaResultado];
    resultadoNome.textContent = tours[tourFinal].nome;
    resultadoDesc.textContent = tours[tourFinal].descricao;
    resultadoImagem.src = tours[tourFinal].imagem;
    resultadoImagem.alt = tours[tourFinal].nome;
  }

  botaoProximo.addEventListener("click", function () {
    // Não avança se o usuário ainda não escolheu uma alternativa.
    if (!respostas[perguntaAtualIndice]) {
      alert("Selecione uma opção para continuar.");
      return;
    }

    perguntaAtualIndice++;
    if (perguntaAtualIndice < perguntas.length) {
      mostrarPergunta();
    } else {
      mostrarResultado();
    }
  });

  comecarQuiz();
})();

/*  PÁGINA DE RESERVA  */
(function () {
  var formulario = document.querySelector(".formulario-reserva");

  // Só executa a validação na página que possui o formulário de reserva.
  if (!formulario) return;

  function validaNome() {
    var valor = document.getElementById("nome").value.trim();

    if (valor === "") {
      alert("Informe seu nome completo.");
      return false;
    }
    if (/[^\p{L}\s]/u.test(valor)) {
      alert("O nome aceita apenas letras e espaços.");
      return false;
    }
    if (!/\s/.test(valor)) {
      alert("Digite nome e sobrenome (pelo menos um espaço).");
      return false;
    }
    return true;
  }

  function validaEmail() {
    var valor = document.getElementById("email").value.trim();

    if (valor === "") {
      alert("Informe seu e-mail.");
      return false;
    }
    var arroba = valor.indexOf("@");
    var pontoDepois = valor.indexOf(".", arroba);
    if (
      arroba < 1 ||
      pontoDepois === -1 ||
      pontoDepois === valor.length - 1 ||
      /\s/.test(valor)
    ) {
      alert("O e-mail deve ter '@' e pelo menos um ponto. Ex.: nome@email.com");
      return false;
    }
    return true;
  }

  function validaTelefone() {
    var valor = document.getElementById("celular").value.trim();

    if (valor === "") {
      alert("Informe seu telefone.");
      return false;
    }
    if (/[^0-9\s()-]/.test(valor)) {
      alert("O telefone aceita apenas números, espaços, parênteses e traços.");
      return false;
    }
    var digitos = valor.replace(/\D/g, "");
    if (digitos.length < 10 || digitos.length > 11) {
      alert(
        "O telefone deve ter DDD + número (10 ou 11 dígitos). Ex.: (11) 99999-9999",
      );
      return false;
    }
    return true;
  }

  function validaTour() {
    if (document.getElementById("tour").value === "") {
      alert("Selecione um passeio.");
      return false;
    }
    return true;
  }

  function validaData() {
    var valor = document.getElementById("data").value;

    if (valor === "") {
      alert("Escolha a data do passeio.");
      return false;
    }
    var partes = valor.split("-");
    var escolhida = new Date(partes[0], partes[1] - 1, partes[2]);
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (escolhida < hoje) {
      alert("A data do passeio não pode estar no passado.");
      return false;
    }
    return true;
  }

  function validaPessoas() {
    var valor = document.getElementById("pessoas").value;
    var numero = Number(valor);

    if (
      valor === "" ||
      !Number.isInteger(numero) ||
      numero < 1 ||
      numero > 50
    ) {
      alert("O número de pessoas deve ser um inteiro entre 1 e 50.");
      return false;
    }
    return true;
  }

  function validaHorario() {
    if (!document.querySelector('input[name="horario"]:checked')) {
      alert("Escolha um horário.");
      return false;
    }
    return true;
  }

  function validaTermos() {
    if (!document.getElementById("termos").checked) {
      alert("Para continuar, aceite os termos e condições.");
      return false;
    }
    return true;
  }

  function validaAoSair(idCampo, funcaoValidacao) {
    var campo = document.getElementById(idCampo);
    if (!campo) return;

    campo.addEventListener("blur", function () {
      if (this.value.trim() !== "") {
        funcaoValidacao();
      }
    });
  }

  validaAoSair("nome", validaNome);
  validaAoSair("email", validaEmail);
  validaAoSair("celular", validaTelefone);
  validaAoSair("pessoas", validaPessoas);

  document.getElementById("data").addEventListener("change", validaData);
  document.getElementById("tour").addEventListener("change", validaTour);

  var janelaResumo = document.getElementById("janela-resumo");
  var listaResumo = document.getElementById("resumo-lista");
  var botaoFecharResumo = document.getElementById("resumo-fechar");

  function textoDoTour() {
    var select = document.getElementById("tour");
    return select.options[select.selectedIndex].text;
  }

  function dataBR(valor) {
    var partes = valor.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
  }

  function mostraResumo() {
    var horario = document.querySelector('input[name="horario"]:checked');
    var rotuloHorario = document.querySelector(
      'label[for="' + horario.id + '"]',
    );
    var obs = document.getElementById("observacoes").value.trim();

    var dados = [
      ["Nome", document.getElementById("nome").value.trim()],
      ["E-mail", document.getElementById("email").value.trim()],
      ["Telefone", document.getElementById("celular").value.trim()],
      ["Tour", textoDoTour()],
      ["Data", dataBR(document.getElementById("data").value)],
      ["Pessoas", document.getElementById("pessoas").value],
      [
        "Horário",
        rotuloHorario ? rotuloHorario.textContent.trim() : horario.value,
      ],
      ["Observações", obs === "" ? "(nenhuma)" : obs],
      ["Termos", "Aceitos"],
    ];

    listaResumo.innerHTML = "";
    dados.forEach(function (par) {
      var dt = document.createElement("dt");
      var dd = document.createElement("dd");
      dt.textContent = par[0];
      dd.textContent = par[1];
      listaResumo.appendChild(dt);
      listaResumo.appendChild(dd);
    });

    janelaResumo.showModal();
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    var checagens = [
      ["nome", validaNome],
      ["email", validaEmail],
      ["celular", validaTelefone],
      ["tour", validaTour],
      ["data", validaData],
      ["pessoas", validaPessoas],
      ["manha", validaHorario],
      ["termos", validaTermos],
    ];

    for (var i = 0; i < checagens.length; i++) {
      if (!checagens[i][1]()) {
        var campoComErro = document.getElementById(checagens[i][0]);
        if (campoComErro) campoComErro.focus();
        return;
      }
    }

    mostraResumo();
  });

  if (botaoFecharResumo) {
    botaoFecharResumo.addEventListener("click", function () {
      janelaResumo.close();
    });
  }

  if (janelaResumo) {
    janelaResumo.addEventListener("click", function (evento) {
      if (evento.target === janelaResumo) {
        janelaResumo.close();
      }
    });
  }
})();
