const express = require("express");
const morgan = require("morgan");
const { Alumno } = require("../db/modelos/Alumno");
const rutasAlumnos = require("./rutas/alumnos");

// Servidor Express
const app = express();

// Levantamos el servidor
app.listen(3010, (err) => {
  if (err) {
    console.log("No se ha podido levantar el servidor");
    return;
  }
  console.log("Servidor escuchando en el puerto 3010");
});

// Cadena de middlewares
const middleware1 = (req, res, next) => {
  console.log("Paso 1");
  next(); // Pasa la pelota al siguiente middleware
};
const middleware2 = (req, res, next) => {
  console.log("Paso 2");
  if (["GET", "PUT", "POST", "DELETE"].includes(req.method)) {
    next();
  } else {
    /* res.json({
      mensaje:
        "Me paro en el paso 2 porque sólo acepto GET, PUT, POST y DELETE",
    }); // Emite una respuesta y por tanto se detiene la cadena de middlewares, no continúa */
    const nuevoError = new Error("Método no permitido");
    next(nuevoError);
  }
};
const middleware3 = (req, res, next) => {
  console.log("Paso 3");
  next();
};

app.use(morgan("dev")); // Muestra en la consola info sobre cada petición
app.use(express.json()); // Extrae el body de la petición y me lo mete en req.body
app.use(middleware1); // Middlewares intermedios definidos arriba
app.use(middleware2); // Middlewares intermedios definidos arriba
app.use(middleware3); // Middlewares intermedios definidos arriba

// Todas las peticiones que lleguen a una URL que empieza por /alumnos
// se gestionarán en el router correspondiente
app.use("/alumnos", rutasAlumnos);

// Aquí llegarán las request que no hayan coincidido con ninguna ruta+método anteriores
// Por tanto aquí manejamos el 404
app.use((req, res, next) => {
  res.status(404).json({ error: true, mensaje: "No tengo este endpoint" });
});

// Manejador general de errores
// La petición llegará aquí cuando alguien envíe un next con un error dentro
// o cuando se genere un error de JavaScript
app.use((err, req, res, next) => {
  console.log("Has llegado al manejador general de errores");
  console.log(err.message);
  res.status(500).json({ error: true, mensaje: err.message });
});
