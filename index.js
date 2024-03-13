require("dotenv").config();
const express = require("express");

const servidor = express();

//Para comprobar si funciona la conexion
servidor.use("/mentirillas", express.static("./pruebas_api"));

servidor.get("/api-todo", (peticion,respuesta) => {
    respuesta.send("...get");
});

servidor.post("/api-todo/crear", (peticion,respuesta) => {
    respuesta.send("...post");
});

servidor.put("/api-todo/actualizar/:id/:operacion", (peticion,respuesta) => {
    respuesta.send("...put");
});

servidor.delete("/api-todo/borrar/:id", (peticion,respuesta) => {
    respuesta.send("...delete");
});

servidor.listen(process.env.PORT);