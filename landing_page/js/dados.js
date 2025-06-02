fetch('http://localhost:3000/api/dados-por-dia')
  .then(res => res.json())
  .then(data => {
    if (!data.datas || data.datas.length === 0) {
      console.warn('Nenhum dado para mostrar');
      return;
    }

    // Gráfico Energia acumulada
    new Chart(document.getElementById('graficoEnergia'), {
      type: 'line',
      data: {
        labels: data.datas,
        datasets: [{
          label: 'Energia Economizada (kWh)',
          data: data.energia,
          borderColor: '#b38f6f',
          backgroundColor: '#b38f6f',
          fill: false,
          tension: 0.2,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#b38f6f',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          showLine: true,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Energia Economizada por Dia (kWh)' },
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        scales: {
          x: { title: { display: true, text: 'Dia/Mês' }, ticks: { maxRotation: 0, minRotation: 0 } },
          y: { title: { display: true, text: 'kWh' }, beginAtZero: true }
        }
      }
    });

    // Gráfico Água acumulada
    new Chart(document.getElementById('graficoAgua'), {
      type: 'line',
      data: {
        labels: data.datas,
        datasets: [{
          label: 'Água Economizada (litros)',
          data: data.agua,
          borderColor: '#161616',
          backgroundColor: '#161616',
          fill: false,
          tension: 0.2,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#161616',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          showLine: true,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Água Economizada por dia (litros)' },
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        scales: {
          x: { title: { display: true, text: 'Dia/Mês' }, ticks: { maxRotation: 0, minRotation: 0 } },
          y: { title: { display: true, text: 'Litros' }, beginAtZero: true }
        }
      }
    });

  })
  .catch(error => {
    console.error('Erro ao carregar dados:', error);
  });
