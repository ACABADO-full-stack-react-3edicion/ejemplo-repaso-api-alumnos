const express = require("express");
const { Alumno } = require("../../db/modelos/Alumno");

const router = express.Router();

// Si llega una petición con método GET a la url /alumnos
router.get(
  "/",
  (req, res, next) => {
    console.log("Paso /alumnos 1");
    req.aula = 1; // Podemos añadir datos a la petición y el resto de middlewares los podrán consultar
    next();
  },
  (req, res, next) => {
    console.log("Paso /alumnos 2");
    next();
  },
  async (req, res, next) => {
    const { aula } = req; // Consulto el dato que mi anterior middleware añadió
    console.log("Paso /alumnos 3");
    console.log(`Listado de alumnos del aula ${aula}`);
    const alumnos = await Alumno.find();
    res.json({ alumnos });
  }
);

// Si llega una petición con método GET a la url /alumnos/loquesea
router.get("/:idAlumno", async (req, res, next) => {
  const { idAlumno } = req.params; // Extraemos un parámetro de la URL (siempre tipo String)
  console.log(`La id del alumno es ${+idAlumno}`);
  const alumno = await Alumno.findById(idAlumno);
  if (!alumno) {
    const nuevoError = new Error(
      "No he podido conseguir la información del alumno"
    );
    return next(nuevoError); // IMPORTANTE: return
  }
  res.json({ datos: alumno });
});

// Si llega una petición con método POST a la url /alumnos/nuevo-alumno
router.post("/nuevo-alumno", (req, res, next) => {
  const nuevoAlumno = req.body; // Extraemos el body de la petición (tiene que estar el middleware express.json())
  if (!nuevoAlumno.nombre) {
    // Si no pongo status, lo envía con 200
    // Para poner un código de status distinto, usamos res.status(codigo)
    res.status(400).json({ error: true, mensaje: "Faltan datos del alumno" });
    return; // IMPORTANTE: aunque la cadena de middlewares se pare, JavaScript sigue ejecutando, por eso ponemos return
  }
  console.log("Vamos a crear un alumno");
  Alumno.create(nuevoAlumno);
  res.status(201).json({ alumnoCreado: { nombre: nuevoAlumno.nombre } });
});

// Si llega una petición con método PUT a la url /alumnos/modificar-alumno/loquesea
router.put("/modificar-alumno/:idAlumno", async (req, res, next) => {
  const { idAlumno } = req.params;
  const modificaciones = req.body;
  console.log(`Vamos a modificar al alumno con id ${idAlumno}`);
  /* await Alumno.updateOne({
    _id: idAlumno
  }, modificaciones); */
  const alumnoModificado = await Alumno.findByIdAndUpdate(
    idAlumno,
    modificaciones,
    {
      returnDocument: false,
    }
  );
  if (!alumnoModificado) {
    const nuevoError = new Error("No se ha podido modificar el alumno");
    return next(nuevoError); // IMPORTANTE: return
  }
  res.json({ alumnoModificado });
});

// Si llega una petición con método DELETE a la url /alumnos/borrar-alumno/loquesea
router.delete("/borrar-alumno/:idAlumno", async (req, res, next) => {
  const { idAlumno } = req.params;
  console.log(`Vamos a borrar al alumno con id ${idAlumno}`);
  // Damos a Mongo la orden de borrar el alumno con nuestra id
  /* await Alumno.deleteOne({
    _id: idAlumno
  }); */
  const alumnoBorrado = await Alumno.findByIdAndDelete(idAlumno);
  if (!alumnoBorrado) {
    const nuevoError = new Error("No se ha podido borrar el alumno");
    return next(nuevoError); // IMPORTANTE return
  }
  res.json({ alumnoBorrado: idAlumno });
});

module.exports = router;
