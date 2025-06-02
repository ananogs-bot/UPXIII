document.getElementById('form-login').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  // Usuário fixo permitido
  const emailPermitido = 'visitante@gmail.com';
  const senhaPermitida = 'Mudar@123';

  if (email === emailPermitido && senha === senhaPermitida) {
    // Simula um ID de usuário para sessão
    const usuarioFake = {
      cod_usuario: 'demo-visitante'
    };

    // Armazena no localStorage
    localStorage.setItem('cod_usuario', usuarioFake.cod_usuario);

    // Redireciona para o catálogo
    window.location.href = 'catalogo.html';
  } else {
    alert('E-mail ou senha incorretos. Use:\n\nE-mail: visitante@gmail.com\nSenha: Mudar@123');
  }
});
