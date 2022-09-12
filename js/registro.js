const formulario = document.getElementById('fieldset-registro').value;

const nombre = document.getElementById('nombre-usuario');
const apellido = document.getElementById('apellido');
const dni = document.getElementById('dni');
const celular = document.getElementById('celular');
const domicilio = document.getElementById('domicilio');
const contrasena = document.getElementById('contrasena');
const correoElectronico = document.getElementById('correo-electronico');

const botonRegistrarse = document.getElementById('boton-registrarse');

let nombreCorrecto = false;
let apellidoCorrecto = false;
let dniCorrecto = false;
let celularCorrecto = false;
let domicilioCorrecto = false;
let contrasenaCorrecto = false;
let correoElectronicoCorrecto = false;

function validarNombre(comprobarNombre) {
    const nombreValido = /^[A-ZÑ][a-zñ]{3,20}$/;
    if(nombreValido.test(comprobarNombre)) {
        console.log('nombre válido');
        console.log(nombre.value);
        nombreCorrecto = true;
    } else {
        console.log('nombre inválido');
        console.log(nombre.value);
        alert('El nombre debe empezar con mayúscula y seguir con' 
        + 'minúsculas y tener entre 3 y 20 caracteres');
    }
}

function validarApellido(comprobarApellido) {
    const apellidoValido = /^[A-ZÑ][a-zñ]{3,20}$/;
    if(apellidoValido.test(comprobarApellido)) {
        console.log('apellido válido');
        console.log(apellido.value);
        apellidoCorrecto = true;
    } else {
        console.log('apellido inválido');
        console.log(apellido.value);
        alert('El apellido debe empezar con mayúscula y seguir con' 
        + 'minúsculas y tener entre 3 y 20 caracteres');
    }
}

function validarDni(comprobarDni) {
    const dniValido = /^[0-9]{6,9}$/;
    if(dniValido.test(comprobarDni)) {
        console.log('dni válido');
        console.log(dni.value);
        dniCorrecto = true;
    } else {
        console.log('dni inválido');
        console.log(dni.value);
        alert('El DNI debe tener solo números y poseer ' 
        + 'entre 6 y 9 caracteres');
    }
}

function validarCelular(comprobarCelular) {
    const celularValido = /^[0-9]{10,12}$/;
    if(celularValido.test(comprobarCelular)) {
        console.log('celular válido');
        console.log(celular.value);
        celularCorrecto = true;
    } else {
        console.log('celular inválido');
        console.log(celular.value);
        alert('El celular debe tener solo números y poseer ' 
        + 'entre 10 y 12 caracteres');
    }
}

function validarDomicilio(comprobarDomicilio) {
    const DomicilioValido = /^[a-z0-9_\-\s]{6,20}$/i;
    if(DomicilioValido.test(comprobarDomicilio)) {
        console.log('domicilio válido');
        console.log(domicilio.value);
        domicilioCorrecto = true;
    } else {
        console.log('domicilio inválido');
        console.log(domicilio.value);
        alert('El domicilio debe tener ' 
        + 'entre 6 y 20 caracteres');
    }
}

function validarContrasena(comprobarContrasena) {
    const nombreContrasena = /^[a-z0-9_\-!"#$%&/()=?¡¨*ñÑ]{8,20}$/i;
    if(nombreContrasena.test(comprobarContrasena)) {
        console.log('contrasena válida');
        console.log(contrasena.value);
        contrasenaCorrecto = true;
    } else {
        console.log('contrasena inválida');
        console.log(contrasena.value);
        alert('La contraseña debe tener ' 
        + 'entre 8 y 20 caracteres');
    }
}

function validarCorreoElectronico(comprobarCorreoElectronico) {
    const correoElectronicoValido = /^[a-zñA-ZÑ0-9_]{3,20}@[a-zA-Z]{2,10}.com$/;
    if(correoElectronicoValido.test(comprobarCorreoElectronico)) {
        console.log('correo electrónico válido');
        console.log(correoElectronico.value);
        correoElectronicoCorrecto = true;
    } else {
        console.log('correo electrónico inválido');
        console.log(correoElectronico.value);
        alert('El correo electrónico debe contener entre 3 y 20 caracteres ' 
        + 'antes del arroba y entre 2 y 10 caracteres antes del ".com"');
    }
}

botonRegistrarse.addEventListener('click', (evento) => {
    evento.preventDefault();
    validarNombre(nombre.value);
    validarApellido(apellido.value);
    validarDni(dni.value);
    validarCelular(celular.value);
    validarDomicilio(domicilio.value);
    validarContrasena(contrasena.value);
    validarCorreoElectronico(correoElectronico.value);
    if(nombreCorrecto && apellidoCorrecto &&
        dniCorrecto && celularCorrecto &&
        domicilioCorrecto && contrasenaCorrecto &&
        correoElectronicoCorrecto) {
        alert('usuario agregado');
    }
    nombreCorrecto = false;
    apellidoCorrecto = false;
    dniCorrecto = false;
    celularCorrecto = false;
    domicilioCorrecto = false;
    contrasenaCorrecto = false;
    correoElectronicoCorrecto = false;
});