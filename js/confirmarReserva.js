const inputFechaReserva = document.getElementById('fecha-reserva');
const botonReserva = document.getElementById('confirmar-reserva');

let fecha;

botonReserva.addEventListener('click', (evento) => {
    evento.preventDefault();
    fecha = new Date();
    console.log(inputFechaReserva.value);
    const regExDias = /\d{2}/.exec(fecha);
    let mes = '';
    if(fecha.getMonth() + 1 < 10) {
        mes = '0';
        mes += fecha.getMonth() + 1;
    } else {
        mes += fecha.getMonth() + 1;
    }
    console.log(fecha.getFullYear() + '-' + mes + '-' + regExDias[0]);
});