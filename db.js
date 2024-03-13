require("dotenv").config();
const { MongoClient,ObjectId } = require("mongodb");


//HACEMOS LA CONEXION A MONGO. Através de el arvhivo de env en el que hemos colocado la url de la ddbb de mongo.
function conectar(){
    return MongoClient.connect(process.env.URL_MONGO);
}


function getTareas(){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

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

function crearTarea(tarea){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");

            //desestructuramos el insertedId para que nos muestre solo la id.
            let {insertedId} = await coleccion.insertOne(tarea);

            conexion.close();

            //aqui le decimos que nos muestre un objeto con id : "id de la tarea"
            ok({id : insertedId});

        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

function borrarTarea(id){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");

            let {deletedCount} = await coleccion.deleteOne({ _id : new ObjectId(id) });

            conexion.close();

            //aqui le decimos que nos muestre un objeto con id : "id de la tarea"
            ok(deletedCount); //que va a ser 1 o 0, segun si se ha borrado o ya esta borrado

        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

function actualizarEstado(id){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");
            
            //preguntar, primero hay qye poner terminado y luego no terminar
            let resultado = await coleccion.updateOne({  },{$set : });

            conexion.close();

            ok(resultado); 
        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

function actualizarTexto(id,tarea){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let coleccion = conexion.db("tareas").collection("tareas");
            
            //preguntar, primero hay qye poner terminado y luego no terminar
            let resultado = await coleccion.updateOne({_id : new ObjectId(id)},{ $set : {tarea : (tarea) }});

            conexion.close();

            ok(resultado); 
        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

actualizarTexto('65f1e7ca1b101672010488ee',"nueva tarea")
.then(algo => console.log(algo))


