const mongoose = require("mongoose");

// Conexión a la base de datos
mongoose.connect(
  "mongodb://localhost:27017/aula",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log("Error al conectarse a la base de datos");
      return;
    }
    console.log("Conectado a la base de datos");
  }
);
