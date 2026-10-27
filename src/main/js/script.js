/* ANIMAÇÕES card PACOTES */
(function () {
  var janela = document.getElementById("janela-detalhes");
  if (!janela) return; // não é a página de pacotes

  var cards = document.querySelectorAll(".card-passeio");

  cards.forEach(function (card) {
    var botao = card.querySelector(".card-abrir");

    botao.addEventListener("click", function () {
      var categoria = card.closest(".categoria-pacotes").querySelector("h3");

      janela.querySelector(".janela-categoria").textContent =
        categoria.textContent;
      janela.querySelector(".janela-titulo").textContent = botao.textContent;
      janela.querySelector(".janela-meta").textContent =
        card.querySelector(".card-detalhes").textContent;
      janela.querySelector(".janela-texto").innerHTML =
        card.querySelector(".card-completo").innerHTML;
      janela.querySelector(".janela-preco").innerHTML =
        card.querySelector(".card-preco").innerHTML;
      janela.querySelector(".janela-imagem").innerHTML =
        card.querySelector(".card-imagem").innerHTML;

      janela.showModal();
    });
  });

  // Fechar: botão ×, clique fora da janela. Esc já fecha sozinho
  janela.querySelector(".janela-fechar").addEventListener("click", function () {
    janela.close();
  });

  janela.addEventListener("click", function (evento) {
    if (evento.target === janela) {
      janela.close();
    }
  });
})();

/* VALIDAÇÃO DO FORMULÁRIO DE RESERVA */
(function () {
  var formulario = document.querySelector(".formulario-reserva");
  if (!formulario) return; // não é a página de reserva

  /*Funções de validação*/

  // Nome: só letras e espaços, com pelo menos um espaço (nome + sobrenome)
  function validaNome() {
    var valor = document.getElementById("nome").value.trim();

    if (valor === "") {
      alert("Informe seu nome completo.");
      return false;
    }
    // \p{L} = qualquer letra (aceita acentos); \s = espaço
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

  // E-mail: precisa ter "@" e pelo menos um "." depois dele
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

  // Telefone: só números, espaços, traços e parênteses; de 10 a 11 dígitos
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

  // Tour: precisa escolher uma opção
  function validaTour() {
    if (document.getElementById("tour").value === "") {
      alert("Selecione um passeio.");
      return false;
    }
    return true;
  }

  // Data: obrigatória e não pode estar no passado
  function validaData() {
    var valor = document.getElementById("data").value; // formato AAAA-MM-DD

    if (valor === "") {
      alert("Escolha a data do passeio.");
      return false;
    }
    var partes = valor.split("-");
    var escolhida = new Date(partes[0], partes[1] - 1, partes[2]); // meses vão de 0 a 11
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (escolhida < hoje) {
      alert("A data do passeio não pode estar no passado.");
      return false;
    }
    return true;
  }

  // Número de pessoas: inteiro entre 1 e 50
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

  // Horário: precisa escolher uma opção
  function validaHorario() {
    if (!document.querySelector('input[name="horario"]:checked')) {
      alert("Escolha um horário.");
      return false;
    }
    return true;
  }

  // Termos: precisa estar marcado
  function validaTermos() {
    if (!document.getElementById("termos").checked) {
      alert("Para continuar, aceite os termos e condições.");
      return false;
    }
    return true;
  }

  /* Validação ao perder o foco (onblur)  */
  // Só valida se o campo foi preenchido, para não gerar alerta ao apenas passar por ele.

  function validaAoSair(idCampo, funcaoValidacao) {
    document.getElementById(idCampo).addEventListener("blur", function () {
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

  /*Caixa de diálogo com os dados */

  var janelaResumo = document.getElementById("janela-resumo");

  function textoDoTour() {
    var select = document.getElementById("tour");
    return select.options[select.selectedIndex].text;
  }

  function dataBR(valor) {
    // 2026-10-27 -> 27/10/2026
    var p = valor.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function mostraResumo() {
    var horario = document.querySelector('input[name="horario"]:checked');
    var rotuloHorario = document
      .querySelector('label[for="' + horario.id + '"]')
      .textContent.trim();
    var obs = document.getElementById("observacoes").value.trim();

    var dados = [
      ["Nome", document.getElementById("nome").value.trim()],
      ["E-mail", document.getElementById("email").value.trim()],
      ["Telefone", document.getElementById("celular").value.trim()],
      ["Tour", textoDoTour()],
      ["Data", dataBR(document.getElementById("data").value)],
      ["Pessoas", document.getElementById("pessoas").value],
      ["Horário", rotuloHorario],
      ["Observações", obs === "" ? "(nenhuma)" : obs],
      ["Termos", "Aceitos"],
    ];

    var lista = document.getElementById("resumo-lista");
    lista.innerHTML = "";
    dados.forEach(function (par) {
      var dt = document.createElement("dt");
      var dd = document.createElement("dd");
      dt.textContent = par[0]; // textContent evita interpretar HTML digitado pelo usuário
      dd.textContent = par[1];
      lista.appendChild(dt);
      lista.appendChild(dd);
    });

    janelaResumo.showModal();
  }

  /*  Envio: valida tudo e mostra o pop-up */

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault(); // não envia/recarrega a página

    // Para no primeiro erro encontrado e leva o foco até o campo
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
        document.getElementById(checagens[i][0]).focus();
        return;
      }
    }

    mostraResumo();
  });

  /* Fechar o pop-up  */

  document
    .getElementById("resumo-fechar")
    .addEventListener("click", function () {
      janelaResumo.close();
    });

  janelaResumo.addEventListener("click", function (evento) {
    if (evento.target === janelaResumo) {
      // clique no fundo escuro
      janelaResumo.close();
    }
  });
})();
