const { Schema, model } = require("mongoose");

// Creamos el schema de un alumno
const AlumnoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  nota: {
    type: Number,
    max: 10,
    min: 0,
  },
});

// Creamos el modelo alumno
const Alumno = model("Alumno", AlumnoSchema, "alumnos");

module.exports = {
  Alumno,
};
