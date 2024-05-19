import express from "express"
import pkg from "pg"
import dotenv from "dotenv"
import path from "path"

const app = express()
dotenv.config()

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(3000, () => {
console.log("El servidor está inicializado en el puerto 3000");
});

let {Pool} = pkg
let config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}
const pool = new Pool(config)

app.get("/", (req, res) =>{
    try {
        res.sendFile(path.resolve("index.html"))
    } catch (error) {
        console.log(error)
    }
})

app.post("/cancion", async (req, res) =>{
    try {
        let {titulo, artista, tono} = req.body
        let query ={   
            text: "INSERT INTO canciones VALUES (default, $1, $2, $3) RETURNING *",
            values: [titulo, artista, tono]
        }
        let result = await pool.query(query)
        res.send(result.rows)
    } catch (error) {
        console.log(error)
    }
})

app.get("/canciones", async (req, res) =>{
    try {
        let query = {
            text: "SELECT * FROM canciones ORDER BY id ASC"
        }
        let result = await pool.query(query)
        res.send(result.rows)
    } catch (error) {
        console.log(error.message)
    }
})

app.put("/cancion/:id", async (req, res) =>{
    try {
        let {id} = req.params
        let {titulo, artista, tono} = req.body
        let query = {
            text : "UPDATE canciones SET titulo = $1, artista = $2, tono = $3 WHERE id = $4",
            values: [titulo, artista, tono, id]
        }
        let result = await pool.query(query)
        res.send(result)
    } catch (error) {
        console.log(error)
    }
})

app.delete("/cancion", async (req, res) =>{
    try {
        let {id} = req.query
        let query = {
            text: "DELETE FROM canciones WHERE id = $1",
            values: [id]
        }
        let result = await pool.query(query)
        res.send(result)
    } catch (error) {
        console.log(error)
    }
})





