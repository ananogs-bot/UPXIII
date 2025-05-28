let valorVestuarioGlobal = 0; // variável global para guardar o valor do vestuário

// Função para obter o valor do parâmetro 'uuid' (código do vestuário)
function getUUID() {
    const params = new URLSearchParams(window.location.search);
    return params.get('uuid');
}

// Função para formatar o preço
function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para atualizar o valor total dinamicamente
function atualizarValorTotal() {
    const dias = parseInt(document.getElementById('dias').value) || 0;
    const total = valorVestuarioGlobal * dias;
    document.getElementById('valor-total').textContent = `Total: ${formatarPreco(total)}`;
}

// Pegar os produtos do banco de dados
async function carregarProduto() {
    const uuid = getUUID();
    if (!uuid) {
        mostrarErro("UUID não fornecido na URL.");
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000/api/produtos/${uuid}`);
        if (!resposta.ok) {
            if (resposta.status === 404) {
                mostrarErro("Produto não encontrado.");
            } else {
                mostrarErro("Erro ao buscar produto.");
            }
            return;
        }

        const produto = await resposta.json();
        mostrarProduto(produto);
    } catch (error) {
        mostrarErro("Erro ao acessar o servidor.");
        console.error(error);
    }
}

// Mostrar os produtos com base no banco de dados
function mostrarProduto(produto) {
    valorVestuarioGlobal = produto.valor_vestuario;

    const container = document.getElementById('produto-detalhes');
    container.innerHTML = `
        <div class="col-md-6">
            <img src="${produto.url_vestuario}" alt="${produto.nome_vestuario}" class="img-fluid rounded" />
        </div>
        <div class="col-md-6">
            <h2>${produto.nome_vestuario}</h2>
            <p>${produto.descricao_vestuario}</p>
            <p><strong>Cor:</strong> ${produto.cor_vestuario}</p>
            <p><strong>Tamanho:</strong> ${produto.tamanho_vestuario}</p>
            <p class="text-success fw-bold fs-4 text-dark">${formatarPreco(produto.valor_vestuario)}</p>

            <br>
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

            <p id="valor-total" class="mt-3 fw-bold text-dark">Total: R$ 0,00</p>

            <button class="btn btn-cta mt-3 w-100" onclick="alugar()">Confirmar Aluguel</button>
            <a href="catalogo.html" class="btn btn-cta mt-3 w-100">Voltar ao catálogo</a>
        </div>
    `;

    // Bloquear datas anteriores
    const inputData = document.getElementById('data-inicial');
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    inputData.min = amanha.toISOString().split('T')[0];

    // Atualiza valor ao mudar dias
    document.getElementById('dias').addEventListener('input', atualizarValorTotal);

    document.getElementById('erro').classList.add('d-none');
    console.log(localStorage.getItem('cod_usuario'));
}

function mostrarErro(mensagem) {
    const erroDiv = document.getElementById('erro');
    erroDiv.textContent = mensagem;
    erroDiv.classList.remove('d-none');
    document.getElementById('produto-detalhes').innerHTML = '';
}

// Enviar os dados para o servidor
async function alugar() {
    const cod_usuario = localStorage.getItem('cod_usuario');
    const cod_vestuario = getUUID();
    const dataInicial = document.getElementById('data-inicial').value;
    const dias = parseInt(document.getElementById('dias').value);
    const cod_pagamento = parseInt(document.getElementById('pagamento').value);

    if (!dataInicial || !dias || !cod_usuario) {
        alert("Preencha todos os campos e certifique-se de estar logado!");
        return;
    }

    const dataInicio = new Date(dataInicial);
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataInicio.getDate() + dias - 1);

    const data_inicio = dataInicio.toISOString().split('T')[0];
    const data_fim = dataFim.toISOString().split('T')[0];

    const total = valorVestuarioGlobal * dias;

    const aluguel = {
        cod_usuario,
        cod_vestuario,
        data_inicio,
        data_fim,
        cod_pagamento
    };

    const alugueis = [aluguel];

    try {
        const resposta = await fetch('http://localhost:3000/api/alugar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alugueis, total })
        });

        if (resposta.ok) {
            alert(`Aluguel realizado com sucesso! Total a pagar: ${formatarPreco(total)}`);
        } else if (resposta.status === 409) {
            const data = await resposta.json();
            alert(data.erro || 'Este período já está reservado para essa peça.');
        } else {
            alert("Erro ao registrar aluguel");
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro na comunicação com o servidor");
    }
}

window.addEventListener('DOMContentLoaded', carregarProduto);
