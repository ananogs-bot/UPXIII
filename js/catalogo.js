function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function criarCards(produtos) {
    const lista = document.getElementById('lista-produtos');
    lista.innerHTML = '';

    produtos.forEach(prod => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-5 d-flex justify-content-center';
        
        col.innerHTML = `
          <div class="card h-100">
            <img class="card-img-top" src="${prod.url_vestuario}" alt="${prod.nome_vestuario}"
              style="object-fit: cover; object-position: top; height: 300px;" />
            <div class="card-body p-4">
              <div class="text-center">
                <h5 class="fw-bolder">${prod.nome_vestuario}</h5>
                <p>Cor: ${prod.cor_vestuario} </p>
                <p>Tamanho: ${prod.tamanho_vestuario}</p>
                <p class="text-success fw-bold">${formatarPreco(prod.valor_vestuario)}</p>
              </div>
            </div>
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
              <div class="text-center">
                <a href="detalhes.html?uuid=${prod.cod_vestuario}" class="btn btn-outline-dark mt-auto">Ver detalhes</a>
              </div>
            </div>
          </div>
        `;

        lista.appendChild(col);
    });
}

async function carregarProdutos() {
    try {
        const resposta = await fetch('http://localhost:3000/api/produtos');
        if (!resposta.ok) throw new Error('Erro ao carregar produtos');
        const dados = await resposta.json();
        criarCards(dados);
    } catch (error) {
        alert(error.message);
    }
}

window.onload = carregarProdutos;