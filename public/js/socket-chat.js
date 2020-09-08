const socket = io();


let params = new URLSearchParams(window.location.search)
if (!params.has('nombre') || !params.has('sala')){
    window.location= 'index.html'
    throw new Error('el nombre y la sala son necesario')
}

let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('entrarChat', usuario, function(resp){
        console.log('usuarios conectados', resp)
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
socket.emit('crearMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});




// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// escuchar cuan entran o salen usuarios del chat
socket.on('listaPersonas', function(personas) {

    console.log('Servidor:', personas);

});

// Escuchar Mensajes Privados
socket.on('mensajePrivados', function(mensaje) {

    console.log('Mensaje Prrivado:', mensaje);

});
