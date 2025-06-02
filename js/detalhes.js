const produtos = [
  {
    cod_vestuario: '1',
    nome_vestuario: 'Vestido Casual',
    url_vestuario: 'assets/img/mulher-falando-ao-telefone-ao-ar-livre.jpg',
    descricao_vestuario:
      'Vestido casual em tom vinho, confeccionado em tecido leve e confortável, ideal para o dia a dia ou encontros informais. Possui corte fluido que valoriza a silhueta, com detalhes sutis como decote em V e mangas curtas, perfeito para quem busca estilo com conforto. Fácil de combinar e usar em diversas ocasiões, trazendo elegância descomplicada ao seu guarda-roupa.',
    valor_vestuario: 120,
    cor_vestuario: 'vinho',
    tamanho_vestuario: 'G',
  },
  {
    cod_vestuario: '2',
    nome_vestuario: 'Vestido Formal',
    url_vestuario: 'assets/img/retrato-da-moda-da-jovem-mulher-elegante.jpg',
    descricao_vestuario:
      'Vestido formal em cetim verde esmeralda, com acabamento suave e brilho sofisticado. Design elegante com corte ajustado ao corpo, decote delicado e comprimento midi, ideal para eventos especiais e ocasiões sofisticadas. Um toque de luxo e charme para quem quer impressionar com estilo e elegância.',
    valor_vestuario: 150,
    cor_vestuario: 'verde esmeralda',
    tamanho_vestuario: 'P',
  },
  {
    cod_vestuario: '3',
    nome_vestuario: 'Vestido Casual',
    url_vestuario: 'assets/img/mulher-sorridente-de-vista-lateral-posando-com-bolsa.jpg',
    descricao_vestuario:
      'Vestido branco leve e fluido, perfeito para um visual praiano e descontraído. Feito com tecido fresco e respirável, ideal para dias ensolarados à beira-mar. Com detalhes delicados como alças finas e acabamento em renda, traz conforto e estilo casual para passeios e momentos relaxantes.',
    valor_vestuario: 100,
    cor_vestuario: 'branco',
    tamanho_vestuario: 'PP',
  },
  {
    cod_vestuario: '4',
    nome_vestuario: 'Macacão Formal',
    url_vestuario:
      'assets/img/mulher-bonita-vestindo-um-terno-preto-coque-de-cabelo-maquiagem-sorrindo-posando-em-pe-perto-dos-portoes-ao-ar-livre-mao-na-cintura-olhando-para-baixo-elegante-moda.jpg',
    descricao_vestuario:
      'Macacão formal elegante, ideal para ocasiões especiais. Confeccionado em tecido de alta qualidade com corte ajustado que valoriza a silhueta. Perfeito para um visual sofisticado e moderno.',
    valor_vestuario: 100,
    cor_vestuario: 'preto',
    tamanho_vestuario: 'M',
  },
];

const formatarPreco = (valor) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const getUUID = () => new URLSearchParams(window.location.search).get('uuid');

let valorVestuarioGlobal = 0;

function atualizarValorTotal() {
  const diasInput = document.getElementById('dias');
  const totalValor = document.getElementById('valor-total');

  const dias = parseInt(diasInput.value, 10) || 0;
  const total = valorVestuarioGlobal * dias;

  totalValor.textContent = `Total: ${formatarPreco(total)}`;
}

function mostrarErro(mensagem) {
  const erroDiv = document.getElementById('erro');
  erroDiv.textContent = mensagem;
  erroDiv.classList.remove('d-none');

  const produtoContainer = document.getElementById('produto-detalhes');
  produtoContainer.innerHTML = '';
}

function configurarDataMinima() {
  const inputData = document.getElementById('data-inicial');
  const hoje = new Date();
  hoje.setDate(hoje.getDate() + 1);
  inputData.min = hoje.toISOString().split('T')[0];
  inputData.value = '';
}

function mostrarProduto(produto) {
  valorVestuarioGlobal = produto.valor_vestuario;

  const container = document.getElementById('produto-detalhes');
  container.innerHTML = `
  <div class="row align-items-start produto-layout">
    <div class="imagem-container col-12 col-xl-6 mb-3">
      <img src="${produto.url_vestuario}" alt="${produto.nome_vestuario}" class="img-fluid rounded w-100" />
    </div>
    <div class="info-container col-12 col-xl-6">
        <br>
      <h2>${produto.nome_vestuario}</h2>
      <p>${produto.descricao_vestuario}</p>
      <p><strong>Cor:</strong> ${produto.cor_vestuario}</p>
      <p><strong>Tamanho:</strong> ${produto.tamanho_vestuario}</p>
      <p class="text-success fw-bold fs-4 text-dark">${formatarPreco(produto.valor_vestuario)}</p>

      <div class="inputs-container">
        <label for="data-inicial" class="form-label">Data de Início:</label>
        <input type="date" id="data-inicial" class="form-control" required />

        <label for="dias" class="form-label mt-3">Quantos dias?</label>
        <input type="number" id="dias" class="form-control" min="1" required />

        <label for="pagamento" class="form-label mt-3">Método de Pagamento:</label>
        <select id="pagamento" class="form-control">
          <option value="1">Débito</option>
          <option value="2">Crédito</option>
          <option value="3">Pix</option>
        </select>

        <p id="valor-total" class="mt-3 fw-bold text-dark">Total: ${formatarPreco(0)}</p>

        <button id="btn-alugar" class="btn btn-cta mt-3 w-100">Confirmar Aluguel</button>
        <a href="catalogo.html" class="btn btn-cta mt-3 w-100">Voltar ao catálogo</a>
      </div>
    </div>
  </div>
`;


  configurarDataMinima();

  document.getElementById('dias').addEventListener('input', atualizarValorTotal);

  document.getElementById('btn-alugar').addEventListener('click', alugar);

  document.getElementById('erro').classList.add('d-none');
}


function carregarProduto() {
  const uuid = getUUID();

  if (!uuid) {
    mostrarErro('UUID não fornecido na URL.');
    return;
  }

  const produto = produtos.find((p) => p.cod_vestuario === uuid);

  if (!produto) {
    mostrarErro('Produto não encontrado.');
    return;
  }

  mostrarProduto(produto);
}

function alugar() {
  const cod_usuario = localStorage.getItem('cod_usuario');
  const cod_vestuario = getUUID();
  const dataInicial = document.getElementById('data-inicial').value;
  const dias = parseInt(document.getElementById('dias').value, 10);
  const cod_pagamento = document.getElementById('pagamento').value;

  if (!cod_usuario) {
    alert('Você precisa estar logado para alugar.');
    return;
  }

  if (!dataInicial) {
    alert('Por favor, selecione a data de início.');
    return;
  }

  if (!dias || dias < 1) {
    alert('Informe um número válido de dias.');
    return;
  }

  const total = valorVestuarioGlobal * dias;

  alert(
    `Aluguel confirmado!\n\nProduto: ${cod_vestuario}\nDias: ${dias}\nMétodo de Pagamento: ${cod_pagamento}\nTotal: ${formatarPreco(
      total
    )}`
  );

  // Aqui você pode enviar os dados para o backend via fetch, por exemplo
}

window.addEventListener('DOMContentLoaded', carregarProduto);
