import MesaReservaService from './reservasMesasService.js';

if(sessionStorage.getItem('usuario') == null) {
    alert('Por favor inicie sesión o regístrese si previamente no lo ha hecho.');
    location.href = 'ingresar.html';
}

if(sessionStorage.getItem('mesa') == null) {
    alert('Por favor seleccione una mesa si previamente no lo ha hecho para realizar su reserva.');
    location.href = 'reservas.html';
}

const inputFechaReserva = document.getElementById('fecha-reserva');
const botonReserva = document.getElementById('confirmar-reserva');

const consultarReserva = new MesaReservaService;


function getReservasDisponibles() {
    consultarReserva.getMesaReserva()
    .then((mesas) => {
        console.log(mesas[`mesa${sessionStorage.getItem('mesa')}`]['disponible'][inputFechaReserva.value]);
    })
    .catch(error => console.log(error));
}


botonReserva.addEventListener('click', (evento) => {
    evento.preventDefault();

    let fecha = inputFechaReserva.value;
    
    console.log(inputFechaReserva.value);
    console.log('mes: ' + fecha[5] + fecha[6] + ' dia: ' + fecha[8] + fecha[9]);
    
    /* fecha = new Date();
    console.log(inputFechaReserva.value);
    const regExDias = /\d{2}/.exec(fecha);
    let mes = '';
    if(fecha.getMonth() + 1 < 10) {
        mes = '0';
        mes += fecha.getMonth() + 1;
    } else {
        mes += fecha.getMonth() + 1;
    }
    console.log(fecha.getFullYear() + '-' + mes + '-' + regExDias[0]); */
    
    //getReservasDisponibles();
});