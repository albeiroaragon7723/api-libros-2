const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.set('port', process.env.PORT ?? '')

const mongoUri = process.env.MONGODB_URI;

try {
  mongoose.connect(mongoUri);
  console.log("conectado");
} catch (error) {
  console.error("error", error);
}


const libroSchema = new mongoose.Schema({

  titulo: String,

  autor: String,

});

const Libro = mongoose.model("Libros", libroSchema);

app.use((req, res, next) => {

  const authToken = req.headers["authorization"];

  if (authToken === "miTokenSecreto123") {

    next();

  } else {

    res.status(401).send("Acceso no autorizado");

  }

});

app.post("/libros", async (req, res) => {

  const libro = new Libro({

    titulo: req.body.titulo,

    autor: req.body.autor

  })

  try {

    await libro.save();

    res.json(libro);

  } catch (error) {

    res.status(500).send("Error al guardar libro", error);

  }

})

app.get("/libros", async (req, res) => {

  try {

    const libros = await Libro.find();

    res.json(libros);

  } catch (error) {

    res.status(500).send("Error al obtener libros", error);

  }

});





//rutas

// app.get("/libros", (req, res) => {

//  res.json(libros);

//});

//crear libro

//Pedir el listado de libros



//actualizar libro
app.put("/libros/:id", async (req, res) => {

  try {

    let id = req.params.id;

    const libro = await Libro.findByIdAndUpdate(

      id,

      { titulo: req.body.titulo, autor: req.body.autor },

      { new: true }

    );

    if (libro) {

      res.json(libro);

    } else {

      res.status(404).send("Libro no encontrado");

    }

  } catch (error) {

    res.status(500).send("Error al actualizar el libro", error);

  }

});



//eliminar libro
app.delete("/libros/:id", async (req, res) => {

  try {

    const libro = await Libro.findByIdAndRemove(req.params.id);

    if (libro) {

      res.status(204).send("libro eliminado");

    } else {

      res.status(404).send("Libro no encontrado");

    }

  } catch (error) {

    res.status(500).send("Error al eliminar el libro");

  }

});
app.get("/libros/:id", async (req, res) => {
  try {
    const { id } = req.params
    const libro = await Libro.findById(id).exec()
    return res.json(libro)
  } catch (error) {
    return res.status(404).json({ message: "libro no encontrado" })
  }
})


app.listen(app.get('port'), () => {
  console.log(`Servidor ejecutandose en http://localhost:${app.get('port')}/`);
});