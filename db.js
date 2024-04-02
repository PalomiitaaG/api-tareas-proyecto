require("dotenv").config();
const { MongoClient,ObjectId } = require("mongodb");


//HACEMOS LA CONEXION A MONGO. Através de el arvhivo de env en el que hemos colocado la url de la ddbb de mongo.
function conectar(){
    return MongoClient.connect(process.env.URL_MONGO);
}

//creamos una funcion para leer las tareas
function getTareas(){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();
            
            //hacemos la conexion a la base de datos y donde tiene que coger la información.
            let coleccion = conexion.db("tareas").collection("tareas");

            //creamos una variable para que meta dentro todas las careas encontradas convertidas en un array.
            let tareas = await coleccion.find({}).toArray();

            conexion.close();

            ok(tareas); // que se cumpla la promesa

        }catch(error){
            //si rechaza enviará el mensaje.
            ko({error :"error en base de datos"});
        }
    });
}

//creamos una funcion para crear las tarminadas, además de al crearlas coloca el toggle como no terminada
function crearTarea(tarea){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");

            tarea.terminada = false;

            //desestructuramos el insertedId para que nos muestre solo la id.
            let {insertedId} = await coleccion.insertOne(tarea);

            conexion.close();

            //si se cumple la promesa nos muestre un objeto con id : "id de la tarea"
            ok({id : insertedId});

        }catch(error){

            ko({error : "error en base de datos"});
        }
    });
}

//creamos la funcion para borrar las tareas
function borrarTarea(id){ //le pasamos el id de la tarea que querramos borrar
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");

            //Con deleteOne borramos un elemento en especifico y lo metemos en un objeto que seria 1 o 0. 1-->(se borró), 2 -->(ya esta eliminada)
            let {deletedCount} = await coleccion.deleteOne({ _id : new ObjectId(id) });

            conexion.close();

            //aqui le decimos que nos muestre un objeto con id : "id de la tarea"
            ok(deletedCount); //que va a ser 1 o 0, segun si se ha borrado o ya esta borrado

        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

//creamos una función para actualizar el estado.
function actualizarEstado(id){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");

            //buscamos la tarea através del id
            let tarea = await coleccion.findOne({_id : new ObjectId(id)});

            //creamos una variable para decir que la tarea esta terminada
            let nuevoEstado = !tarea.terminada;

            //actualizamos el estado de la tarea.
            let resultado = await coleccion.updateOne({_id : new ObjectId(id)}, {$set : {terminada : nuevoEstado}});

            conexion.close();

            ok(resultado); 
        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

//creamos  una función para actualizar el texto.
function actualizarTexto(id,tarea){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");
            
            //actualizamos el texto con la nueva tarea.
            let actualizar = await coleccion.updateOne({_id : new ObjectId(id)},{ $set : {tarea : tarea }});

            conexion.close();

            ok(actualizar); 
        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}


module.exports = {getTareas,crearTarea,borrarTarea,actualizarEstado,actualizarTexto}
