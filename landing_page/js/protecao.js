const cod_usuario = localStorage.getItem('cod_usuario');
console.log(`cod_usuário: ${cod_usuario}`);

if (!cod_usuario) {
  window.location.href = 'login.html';
}