function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const produtos = [
    {
        cod_vestuario: '1',
        nome_vestuario: 'Vestido Casual',
        url_vestuario: 'assets/img/mulher-falando-ao-telefone-ao-ar-livre.jpg',
        descricao_vestuario: 'Vestido casual em tom vinho, confeccionado em tecido leve e confortável, ideal para o dia a dia ou encontros informais. Possui corte fluido que valoriza a silhueta, com detalhes sutis como decote em V e mangas curtas, perfeito para quem busca estilo com conforto. Fácil de combinar e usar em diversas ocasiões, trazendo elegância descomplicada ao seu guarda-roupa.',
        valor_vestuario: 120,
        cor_vestuario: 'vinho',
        tamanho_vestuario: 'G'
    },
    {
        cod_vestuario: '2',
        nome_vestuario: 'Vestido Formal',
        url_vestuario: 'assets/img/retrato-da-moda-da-jovem-mulher-elegante.jpg',
        descricao_vestuario: 'Vestido formal em cetim verde esmeralda, com acabamento suave e brilho sofisticado. Design elegante com corte ajustado ao corpo, decote delicado e comprimento midi, ideal para eventos especiais e ocasiões sofisticadas. Um toque de luxo e charme para quem quer impressionar com estilo e elegância.',
        valor_vestuario: 150,
        cor_vestuario: 'verde esmeralda',
        tamanho_vestuario: 'P'
    },
    {
        cod_vestuario: '3',
        nome_vestuario: 'Vestido Casual',
        url_vestuario: 'assets/img/mulher-sorridente-de-vista-lateral-posando-com-bolsa.jpg',
        descricao_vestuario: 'Vestido branco leve e fluido, perfeito para um visual praiano e descontraído. Feito com tecido fresco e respirável, ideal para dias ensolarados à beira-mar. Com detalhes delicados como alças finas e acabamento em renda, traz conforto e estilo casual para passeios e momentos relaxantes.',
        valor_vestuario: 100,
        cor_vestuario: 'branco',
        tamanho_vestuario: 'PP'
    },
    {
        cod_vestuario: '4',
        nome_vestuario: 'Macacão Formal',
        url_vestuario: 'assets/img/mulher-bonita-vestindo-um-terno-preto-coque-de-cabelo-maquiagem-sorrindo-posando-em-pe-perto-dos-portoes-ao-ar-livre-mao-na-cintura-olhando-para-baixo-elegante-moda.jpg',
        descricao_vestuario: 'Macacão formal elegante, ideal para ocasiões especiais. Confeccionado em tecido de alta qualidade com corte ajustado que valoriza a silhueta. Perfeito para um visual sofisticado e moderno.',
        valor_vestuario: 100,
        cor_vestuario: 'preto',
        tamanho_vestuario: 'M'
    }
];

function criarCards(produtos) {
    const lista = document.getElementById('lista-produtos');
    lista.innerHTML = '';

    produtos.forEach(prod => {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-5 d-flex justify-content-center';

        col.innerHTML = `
          <div class="card h-100 d-flex flex-column">
            <div class="card-img-container">
              <img src="${prod.url_vestuario}" alt="${prod.nome_vestuario}" />
            </div>
            <div class="card-body p-4 text-center">
              <h5 class="fw-bolder">${prod.nome_vestuario}</h5>
              <p>Cor: ${prod.cor_vestuario}</p>
              <p>Tamanho: ${prod.tamanho_vestuario}</p>
              <p class="text-success fw-bold">${formatarPreco(prod.valor_vestuario)}</p>
            </div>
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent text-center">
              <a href="detalhes.html?uuid=${prod.cod_vestuario}" class="btn btn-outline-dark mt-auto">Ver detalhes</a>
            </div>
          </div>
        `;

        lista.appendChild(col);
    });
}

window.onload = () => {
    criarCards(produtos);
};