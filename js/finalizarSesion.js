const botonFinalizarSesion = document.getElementById('cerrar-sesion');

botonFinalizarSesion.addEventListener('click', () => {
    sessionStorage.removeItem('usuario');
    alert('Sesión cerrada.');
    location.href = 'index.html';
});