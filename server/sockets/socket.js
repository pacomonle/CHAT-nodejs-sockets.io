const { io } = require('../server');
const {crearMensaje} = require('../utilidades/utilidades')
const {Usuarios} = require('../classes/usuarios')

const usuarios = new Usuarios()

io.on('connection', (client) => {

    console.log('Usuario conectado');
 // Escuchar el cliente

 client.on('entrarChat', (data, callback)  => {  
    console.log(data);
    if ( !data.nombre || !data.sala ){
       return callback({
            error: true,
            msg: 'el nombre y la sala son necesario'
        })
    }
// unir usuario a una sala
  client.join(data.sala)

  usuarios.agregarPersona(client.id, data.nombre, data.sala)
  client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
  client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } se unió`));
  // una vez notificados los usuarios enviamos para renderizar la lista de personas por sala
  callback(usuarios.getPersonasPorSala(data.sala))

 })

 client.on('crearMensaje', (data, callback) => {
   let persona = usuarios.getPersona(client.id)
   let mensaje = crearMensaje(persona.nombre, data.mensaje)
   client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
   // una vez notificado todo el mundo devolvemos el mensaje para renderizar
   callback(mensaje);
 })

 // mensaje privado
 client.on('mensajePrivado', (data, callback) => {
    let persona = usuarios.getPersona(client.id)
    let mensaje = crearMensaje(persona.nombre, data.mensaje)
 // en el parametro para del objeto data se envia el id de la persona a la que va el mensaje
    client.broadcast.to(data.para).emit('mensajePrivado', mensaje);
 
  })



 // desconexion
 client.on('disconnect', () => {
    console.log('Usuario desconectado');
    let personaBorrada = usuarios.borrarPersona(client.id)

    client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`));
    client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonas());

}); 


  
});