import { database } from './conexionBD.js';
import { ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
import MesaReservaService from "./reservasMesasService.js";

const contenedorDePagosPendientes = document.getElementById('pagos-adeudados');
const mensajeSinDeuda = document.getElementById('mensaje-sin-deudas');

const refObtenerDatosUsuario = ref(database, `usuarios/usuario${sessionStorage.getItem('usuario')}`);

//Se obtienen los datos del usuario en sesión
function getUsuarioAPagar() {
    const promise = new Promise((resolve, reject) => {
        onValue(refObtenerDatosUsuario, (snapshot) => {
            const data = snapshot.val();
            resolve(data);
        }, {
            onlyOnce: true
        });
    });

    return promise;
}

//Se procede a crear la lista de reservas sin pagar pendientes, junto con sus botones de pago y cancelación

function getReservasDelUsuario() {
    getUsuarioAPagar()
    .then(usuario => {
        if(usuario.reservasSinPagar == undefined || usuario.reservasSinPagar == []) {
            console.log('No hay reservas registradas.');
        } else {
            let contadorReservas = 0;
            mensajeSinDeuda.remove();
            usuario.reservasSinPagar.forEach( reserva => {
                contadorReservas++;
                const reservaAgendada = document.createElement('h4');
                reservaAgendada.innerText = `Reserva N°${contadorReservas}: ` + reserva;
                reservaAgendada.className ='reserva-agendada';
                reservaAgendada.id = `reserva-agendada${contadorReservas}`;
                contenedorDePagosPendientes.appendChild(reservaAgendada);

                const contenedorPagoYCancelacion = document.createElement('div');
                contenedorPagoYCancelacion.className = 'contenedor_botones_pago_y_cancelacion';

                const botonRealizarPago = document.createElement('button');
                botonRealizarPago.innerText = `Pagar la Reserva N°${contadorReservas}`;
                botonRealizarPago.className ='boton-realizar-pago';
                botonRealizarPago.id = `boton-pagar-reserva${contadorReservas}`;

                botonRealizarPago.addEventListener('click', evento => {
                    evento.preventDefault();
                    deshabilitarTodosLosBotones();
                    let id = parseInt(evento.target.id[evento.target.id.length - 1]);
                    let mensajeReserva = evento.target.parentNode.parentNode.childNodes[id * 2].innerText;
                    console.log(mensajeReserva);
                    const regExSoloReserva = /mesa.{1,38}/;
                    let reservaSolo = regExSoloReserva.exec(mensajeReserva);
                    console.log(reservaSolo[0]);

                    pagarReserva(reservaSolo[0]);

                    setTimeout(() => {location.reload();}, 2000);
                });

                contenedorPagoYCancelacion.appendChild(botonRealizarPago);
                
                const botonCancelarReserva = document.createElement('button');
                botonCancelarReserva.innerText = `Cancelar la Reserva N°${contadorReservas}`;
                botonCancelarReserva.className ='boton-cancelar-reserva';
                botonCancelarReserva.id = `boton-cancelar-reserva${contadorReservas}`;

                botonCancelarReserva.addEventListener('click', evento => {
                    evento.preventDefault();
                    deshabilitarTodosLosBotones();
                    let id = parseInt(evento.target.id[evento.target.id.length - 1]);
                    let mensajeReserva = evento.target.parentNode.parentNode.childNodes[id * 2].innerText;
                    console.log(mensajeReserva);
                    const regExReservaCompleta = /mesa.{38}/;
                    let reservaCompleta = regExReservaCompleta.exec(mensajeReserva);
                    console.log('Cancelar: ' + reservaCompleta[0]);
                    const regExSoloReserva = /mesa.{13}/;
                    let reservaSolo = regExSoloReserva.exec(mensajeReserva);
                    const regExSoloFechaReserva = /.{10}$/;
                    let fechaReservaSolo = regExSoloFechaReserva.exec(reservaSolo[0]);
                    console.log('Cancelar: ' + fechaReservaSolo[0]);

                    CancelarReserva(fechaReservaSolo[0], reservaCompleta[0]);

                    setTimeout(() => {location.reload();}, 2000);
                });

                contenedorPagoYCancelacion.appendChild(botonCancelarReserva);
                
                contenedorDePagosPendientes.appendChild(contenedorPagoYCancelacion);

                console.log(reserva);
            })
        }
        })
        .catch(error => {console.log(error)});
}

getReservasDelUsuario();

//Se consulta los ingresos totales por reservas para acumularlos

const refIngresosTotalesReservas = ref(database, 'ingresosTotalesPorReservas');

function getIngresosTotalesPorReservas() {
    const promise = new Promise((resolve, reject) => {
        onValue(refIngresosTotalesReservas, (snapshot) => {
            const data = snapshot.val();
            resolve(data);
        }, {
            onlyOnce: true
        });
    });

    return promise;
}

function aumentarCantidadIngresosPorReservas() {
    getIngresosTotalesPorReservas()
        .then(ingresosTotales => {

            let acumulacionIngresos = ingresosTotales;
            acumulacionIngresos += 500;
            set(refIngresosTotalesReservas, acumulacionIngresos);
        })
        .catch(error => {console.log(error)});
}

//Se crea la opcion de pagar y guardar los datos de la reserva pagada

function pagarReserva(reservaConfirmada) {
    getUsuarioAPagar()
        .then(usuario => {
            const usuarioActualizado = usuario;
            if(usuarioActualizado.reservasPagadas == undefined) {
                usuarioActualizado.reservasPagadas = [];
                usuarioActualizado.reservasPagadas.push(reservaConfirmada);
            } else {
                usuarioActualizado.reservasPagadas.push(reservaConfirmada);
            }
            let reservasSinPagarActualizadas = [];
            usuarioActualizado.reservasSinPagar.forEach( reserva => {
                if(reserva != reservaConfirmada) {
                    reservasSinPagarActualizadas.push(reserva);
                }
            });
            usuarioActualizado.reservasSinPagar = reservasSinPagarActualizadas;

            console.log(usuarioActualizado);
            set(refObtenerDatosUsuario, usuarioActualizado);
            aumentarCantidadIngresosPorReservas();
            alert('Pago exitoso.');
        })
        .catch(error => {console.log(error)});
}

//Se crea la funcion para cancelar una reserva, de manera que se borra del usuario y se 
//actualiza el estado de disponibilidad de la mesa corresondiente

function CancelarReserva(fechaCancelada, reservaCancelada) {
    const refMesaReservada = ref(database, `mesas/mesa${sessionStorage.getItem('mesa')}/disponible/${fechaCancelada}`);
    set(refMesaReservada, true);
    getUsuarioAPagar()
        .then(usuario => {
            const usuarioActualizado = usuario;
            let reservasSinPagarActualizadas = [];
            usuarioActualizado.reservasSinPagar.forEach( reserva => {
                if(reserva != reservaCancelada) {
                    reservasSinPagarActualizadas.push(reserva);
                }
            });
            usuarioActualizado.reservasSinPagar = reservasSinPagarActualizadas;

            console.log(usuarioActualizado);
            set(refObtenerDatosUsuario, usuarioActualizado);
            alert('Reserva cancelada.');
        })
        .catch(error => {console.log(error)});
}

function deshabilitarTodosLosBotones() {
    let botones = document.querySelectorAll('button');
    botones.forEach(boton => {
        boton.disabled = true;
    })
}