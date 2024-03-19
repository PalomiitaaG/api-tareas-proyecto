require("dotenv").config();
const express = require("express");
const {getTareas,crearTarea,borrarTarea,actualizarTarea,actualizarEstado,actualizarTexto} = require("./db");
const {json} = require("body-parser");
const cors = require("cors");

const servidor = express();

servidor.use(json());

//Para comprobar si funciona la conexion
servidor.use("/mentirillas", express.static("./pruebas_api"));

servidor.get("/api-todo", async (peticion,respuesta) => {
    try{
        let tareas = await getTareas();
        respuesta.json(tareas.map(({_id,tarea}) => { return {id : _id,tarea}})); // colocamos el return y las llaves al rededor del ojbeto para que no piese que sigue la función.ss
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.post("/api-todo/crear", async (peticion,respuesta,siguiente) => {
    /*let {tarea} = peticion.body;

    if(tarea && tarea.trim() != ""){
        try{
            let id = await crearTareas({tarea});

            return respuesta.json({id})
        }catch(error){
            respuesta.status(500);
            respuesta.json(error);
        }
    }
    siguiente({error : "falta el argumento tarea en el objeto JSON"});*/
    let {tarea} = peticion.body;

    if(tarea && tarea.trim() != ""){
        try{
            let id = await crearTarea({tarea});
            return respuesta.json(id);
        }catch(error){
            respuesta.status(500);
            return respuesta.json(error);
        }
    }

    siguiente({error : "falta la tarea"});
});

servidor.put("/api-todo/actualizar/:id/:operacion", (peticion,respuesta) => {
    respuesta.send("...put");
});

servidor.delete("/api-todo/borrar/:id([a-f0-9]{24})", async (peticion,respuesta) => {
    try{
        let cantidad = await borrarTarea(peticion.params.id);

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