import MesaReservaService from './reservasMesasService.js';
import UsuarioRegistradoService from './usuariosRegistradosService.js';
import { database } from './conexionBD.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";

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

function actualizarEstadoReservasDisponibles() {
    consultarReserva.getMesaReserva()
    .then((mesas) => {

        const fechaYMesaDisponible = mesas[`mesa${sessionStorage.getItem('mesa')}`]['disponible'][inputFechaReserva.value];
        const refMesaYFecha = ref(database, `mesas/mesa${sessionStorage.getItem('mesa')}/disponible/${inputFechaReserva.value}`);

        console.log('Estado anterior de disponibilidad de la mesa: ' + fechaYMesaDisponible);

        if(fechaYMesaDisponible) {
            set(refMesaYFecha, false);
            agregarReservaAUsuarioSolicitante(inputFechaReserva.value);
        } else {
            alert('Esta mesa ya se encuentra reservada en esta misma fecha, por favor pruebe en otra fecha.');
        }
    })
    .catch(error => console.log(error));
}

const usuarioSolicitante = new UsuarioRegistradoService;

function agregarReservaAUsuarioSolicitante(reserva) {
    usuarioSolicitante.getUsuarioRegistrado()
    .then((usuarios) => {

        const usuarioConNuevaReserva = usuarios[`usuario${sessionStorage.getItem('usuario')}`];

        if(usuarioConNuevaReserva.reservas == undefined) {
            usuarioConNuevaReserva.reservas = [];
            usuarioConNuevaReserva.reservas.push(reserva);
        } else {
            usuarioConNuevaReserva.reservas.push(reserva);
        }

        console.log("Objeto usuario a actualizar: ");
        console.log(usuarioConNuevaReserva);

        const refUsuarioQueHaReservado = ref(database, `usuarios/usuario${sessionStorage.getItem('usuario')}`);
        set(refUsuarioQueHaReservado, usuarioConNuevaReserva);
    })
    .catch(error => console.log(error));
};

botonReserva.addEventListener('click', (evento) => {
    evento.preventDefault();

    let fechaActual = new Date();
    console.log(inputFechaReserva.value);
    const regExDias = /\d{2}/.exec(fechaActual);
    let mes = '';
    if(fechaActual.getMonth() + 1 < 10) {
        mes = '0';
        mes += fechaActual.getMonth() + 1;
    } else {
        mes += fechaActual.getMonth() + 1;
    }
    fechaActual = fechaActual.getFullYear() + '-' + mes + '-' + regExDias[0];
    console.log(fechaActual);

    if(inputFechaReserva.value == '') {
        alert('Por favor use una fecha válida, puede utilizar el ícono de calendario al extremo derecho de la barra donde debe ingresar la fecha.');
    }

    let fechaIngresada = inputFechaReserva.value;
    
    console.log(inputFechaReserva.value);
    console.log('reserva el mes: ' + fechaIngresada[5] + fechaIngresada[6] + ' y dia: ' + fechaIngresada[8] + fechaIngresada[9]);

    if(fechaIngresada[5] == '0') {
        if(fechaIngresada[6] < fechaActual[6] || fechaIngresada[6] > parseInt(fechaActual[6]) + 1) {
            console.log('fallo'); 
            alert('No se puede realizar reservas antes de mañana o después de un mes de la fecha actual.');
        } else {
            if(fechaIngresada[8] == '0') {
                if(fechaIngresada[9] > fechaActual[9]) {
                    console.log('fallo');
                   actualizarEstadoReservasDisponibles();
                   console.log('estado disponible cambia a false.'); 
                } else if(fechaIngresada[9] <= fechaActual[9] && fechaIngresada[6] == parseInt(fechaActual[6]) + 1) {
                    console.log('fallo');
                    actualizarEstadoReservasDisponibles();
                    console.log('estado disponible cambia a false.');
                } else {
                    console.log('fallo'); 
                    alert('No se puede realizar reservas antes de mañana o después de un mes de la fecha actual.');
                }
            } else {
                if(parseInt(fechaIngresada[8] + fechaIngresada[9]) > parseInt(fechaActual[8] + fechaActual[9])) {
                    console.log('fallo');
                    actualizarEstadoReservasDisponibles();
                    console.log('estado disponible cambia a false.'); 
                 } else if(parseInt(fechaIngresada[8] + fechaIngresada[9]) <= parseInt(fechaActual[8] + fechaActual[9]) 
                    && fechaIngresada[6] == parseInt(fechaActual[6]) + 1) {
                    console.log('fallo');
                     actualizarEstadoReservasDisponibles();
                     console.log('estado disponible cambia a false.');
                 } else {
                    console.log('fallo'); 
                    alert('No se puede realizar reservas antes de mañana o después de un mes de la fecha actual.');
                 }
            }
        }
    } else {
        if(parseInt(fechaIngresada[5] + fechaIngresada[6]) < parseInt(fechaActual[5] + fechaActual[6]) 
            || parseInt(fechaIngresada[5] + fechaIngresada[6]) > parseInt(fechaActual[5] + fechaActual[6]) + 1) {
            console.log('fallo'); 
            alert('No se puede realizar reservas antes de mañana o después de un mes de la fecha actual.');
        } else {
            if(fechaIngresada[8] == '0') {
                if(fechaIngresada[9] > fechaActual[9]) {
                    console.log('fallo');
                   actualizarEstadoReservasDisponibles();
                   console.log('estado disponible cambia a false.'); 
                } else if(fechaIngresada[9] <= fechaActual[9] 
                    && parseInt(fechaIngresada[5] + fechaIngresada[6]) == parseInt(fechaActual[5] + fechaActual[6]) + 1) {
                    console.log('fallo');
                    actualizarEstadoReservasDisponibles();
                    console.log('estado disponible cambia a false.');
                } else {
                    console.log('fallo'); 
                    alert('No se puede realizar reservas antes de mañana o después de un mes de la fecha actual.');
                }
            } else {
                if(parseInt(fechaIngresada[8] + fechaIngresada[9]) < parseInt(fechaActual[8] + fechaActual[9])) {
                    console.log('fallo');
                    actualizarEstadoReservasDisponibles();
                    console.log('estado disponible cambia a false.'); 
                 } else if(parseInt(fechaIngresada[8] + fechaIngresada[9]) <= parseInt(fechaActual[8] + fechaActual[9]) 
                    && parseInt(fechaIngresada[5] + fechaIngresada[6]) == parseInt(fechaActual[5] + fechaActual[6]) + 1) {
                    console.log('fallo');
                     actualizarEstadoReservasDisponibles();
                     console.log('estado disponible cambia a false.');
                 } else {
                    console.log('fallo'); 
                     alert('No se puede realizar reservas antes de mañana o después de un mes de la fecha actual.');
                 }
            }
        }
    }
});