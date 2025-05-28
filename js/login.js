document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  console.log(`email: ${email}, senha: ${senha}`);
  
  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();
    console.log(data)


    if (res.ok) {
      localStorage.setItem('cod_usuario', data.cod_usuario); // ou data.uuid, se for esse mesmo

      window.location.href = 'catalogo.html';
    } else {
      alert('Erro: ' + data.message);
    }
  } catch (error) {
    alert('Erro ao se conectar com o servidor');
    console.error(error);
  }
});