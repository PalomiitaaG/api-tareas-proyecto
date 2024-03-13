const { MongoClient } = require("mongodb")

let url = "mongodb+srv://paloma:123454321@tareas.0g0zdy3.mongodb.net/"

MongoClient.connect(url).then(conexion => {
    let coleccion = conexion.db("tareas").collection("tareas")

    coleccion.insertOne({tarea : "Ir a la compra"}).then(resultado => {
        console.log(resultado);
        conexion.close();
    })
})