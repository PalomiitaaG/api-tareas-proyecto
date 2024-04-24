require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {getTareas,crearTarea,borrarTarea,actualizarEstado,actualizarTexto} = require("./db");
const {json} = require("body-parser");


const servidor = express();

servidor.use(cors());
servidor.use(json()); //cualquier cosa que venga en json es procesado por el body-parse.

//Para comprobar si funciona la conexion
servidor.use("/mentirillas", express.static("./pruebas_api"));

//midleware para las solicitudesde de GET
servidor.get("/api-todo", async (peticion,respuesta) => {
    try{
        //esperamos la llegada de la respuesta de la funcion de get de la bbdd.
        let tareas = await getTareas();

        //hacemos map para que nos devuelva un objeto se que llamara id, que dentro tendra la propiedad del id y de terminada.
         tareas = tareas.map(({_id,tarea,terminada}) => { return {id : _id,tarea,terminada}});

        respuesta.json(tareas); // colocamos el return y las llaves al rededor del ojbeto para que no piese que sigue la función.ss
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});
 
//creamos un middleware para las solicutudes POST 
servidor.post("/api-todo/crear", async (peticion,respuesta,siguiente) => {
    //extramos la tarea del cuerpo de la petición
    let {tarea} = peticion.body;
    
    //si la tarea es verdadero además de tarea sin ningun espacio es distinto a vacio hace el try.
    if(tarea && tarea.trim() != ""){
        try{
            //espera la respuesta de la funcion crearTarea de la bbdd.
            let id = await crearTarea({tarea});

            //responde con el id de la nueva tarea.
            return respuesta.json(id);
        }catch(error){
            respuesta.status(500);
            return respuesta.json(error);
        }
    }
    //si noy una tarea valida, por ejemplo si se ha equivocado en el formato de la solicitud.
    siguiente({error : "falta la tarea"});
});

//creamos un middleware para las solicitudes PUT. En el que hemos puesto una expresion regular en el que puede contener cualquier letra y número además de ser 24 caracteres.
servidor.put("/api-todo/actualizar/:id([a-f0-9]{24})/:operacion(1|2)", async(peticion,respuesta) => {
    //el id que ha puesto el usuario lo combierto en numeros y lo guardo en la variable operacion
    let operacion = Number(peticion.params.operacion);

    //las operaciones equivalen a 1 o 2
    let operaciones = [actualizarTexto,actualizarEstado];

    //la peticion body te va dar 1 o 2. Si es 1 --> actualizar texto, si es 2 --> actualizar estado.
    let {tarea} = peticion.body;

    //si la operacion es 1 directamente te devuele el siguiente.
    if(operacion == 1 && (!tarea || tarea.trim() == "")){
        return siguiente({ error : "falta el argumento tarea en el objeto JSON" });
    }
    
    try{
        // si en la operacion entre 1, hace operacion 1 -1 igual a 0 que es el indice 0 = actulizarTexto, y si en la operacion es 2 hace 2- 1 = 1 = actualizarEstado
        let cantidad = await operaciones[operacion - 1](peticion.params.id, operacion == 1 ? tarea : null);

        respuesta.json({ resultado : cantidad ? "ok" : "ko"});

    }catch(error){

        respuesta.status(500);
        respuesta.json(error);
    }
});

//creamos un middleware para las solicitudes para borrar.
servidor.delete("/api-todo/borrar/:id([a-f0-9]{24})", async (peticion,respuesta) => {
    //el id tiene una expresion regular que lo que dice es que puede ser cualquier letra o numero, en total tienen que ser 24 caracteres.

    try{
        //esperamos a la funcion de borrar pasandole el parametro del id de la peticion
        let cantidad = await borrarTarea(peticion.params.id);

        //si la cantidad es 1 es que ha sido borrado y si sale 0 no se ha podido eliminar.
        respuesta.json({resultado : cantidad > 0 ? "ok" : "ko"});
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({error : "error en la petición"});
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({error : "recurso no encontrado"});
})

servidor.listen(process.env.PORT);