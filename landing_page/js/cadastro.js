document.getElementById('form-cadastro').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome_usuario').value;
    const email = document.getElementById('email_usuario').value;
    const senha = document.getElementById('senha_usuario').value;

    console.log(`nome: ${nome}, email: ${email}, senha: ${senha}`);

    try {
        const response = await fetch('http://localhost:3000/api/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        } else {
            alert('Erro ao cadastrar: ' + data.message);
        }

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro de rede ou servidor');
    }
});