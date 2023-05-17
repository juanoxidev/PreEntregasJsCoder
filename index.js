// El siguiente codigo solicita al usuario que ingrese sus servicios para verlos reflejados en la pagina y ver el monto total de lo que debe pagar.
const botonAgregar = document.getElementById("agregar");
const botonAsc = document.getElementById("asc");
const botonDesc = document.getElementById("desc");
const info = document.getElementById("info");
const servicios = document.getElementById("servicios");
const nuevoServicio = document.getElementsByClassName("nuevoServicio");
const total = document.getElementById("total");
const eliminarTodos = document.getElementById("eliminarTodo");
const pesoArg = document.getElementById("arg");
const dolar = document.getElementById("usa");
let montos = obtenerMontosLS();
let arrayServicios = obtenerServiciosLS();

botonAgregar.addEventListener("click", validarForm);
botonAsc.addEventListener("click", ordenarMaxMin);
botonDesc.addEventListener("click", ordenarMinMax);
eliminarTodos.addEventListener("click", eliminarTodo);

function validarForm() {
  let nombre = document.getElementById("nombre").value;
  let monto = document.getElementById("monto").valueAsNumber;
  let fecha = document.getElementById("fecha").value;
  // let mes = document.getElementById("mes").valueAsNumber;
  // let dia = document.getElementById("dia").valueAsNumber;
  if (servicioValidado(nombre) && montoValido(monto) && fechaValida(fecha)) {
    agregar(nombre, monto, fecha);
    info.innerHTML = "";
  }
}

// CONSTRUCTOR
function Servicio(strNombre, intMonto, fecha) {
  this.nombre = strNombre.toUpperCase();
  this.monto = intMonto;
  this.fvto = fecha;
  this.id = generarID();
}

// function generarFecha(mes, dia) {
//   return new Date(anioActual, mes - 1, dia, 0, 0, 0);
// }
function generarID() {
  let generarID = Math.round(Math.random() * 10000);
  while (buscarServicioID(generarID) != -1) {
    generarID = Math.round(Math.random() * 10000);
  }
  return generarID;
}
// METODOS
// Del array.

// AGREGAR
function agregar(nombre, monto, fecha) {
  //Agregar solo tipo Servicio, creo que en este metodo no pasa por las validaciones.
  let servicio = new Servicio(nombre, monto, fecha);
  if (buscarServicioNombre(servicio.nombre) == -1) {
    arrayServicios.push(servicio);
    GenerarDOMServicio(servicio);
    montos.push(servicio.monto);
    let importeFinal = sumarImportes(montos);
    modificarDOMTotal(importeFinal);
    let montoJSON = JSON.stringify(montos);
    localStorage.setItem("Monto", montoJSON);
    let servicioJSON = JSON.stringify(arrayServicios);
    localStorage.setItem("Servicios", servicioJSON);
  } else {
    let emergente = document.createElement("h3");
    emergente.className = "error";
    emergente.textContent = "ERROR: SERVICIO YA CARGADO";
    info.appendChild(emergente);
  }
}
// ACUMULADOR
// ORDENAR

function ordenarMaxMin() {
  // To sort an array of objects, you use the sort() method and provide a comparison function that determines the order of objects.
  arrayServicios.sort(function (s1, s2) {
    if (s1.monto < s2.monto) {
      return 1;
    }
    if (s1.monto > s2.monto) {
      return -1;
    }
    return 0; // ifs one line
  });
  servicios.innerHTML = "";
  arrayServicios.forEach((s) => GenerarDOMServicio(s));
}

function ordenarMinMax() {
  arrayServicios.sort(
    (s1, s2) => (s1.monto > s2.monto ? 1 : s1.monto < s2.monto ? -1 : 0) // ifs one line
  );
  servicios.innerHTML = ""; // borra lo q habia en id servicios
  arrayServicios.forEach((s) => GenerarDOMServicio(s)); // genera el dom nuevamente con la lista ordenada
}

// MOSTRAR
function mostrarArray() {
  arrayServicios.forEach((s) => {
    console.log(`${s.nombre} ${s.monto} ${s.fvto}`);
  });
}

// FILTRAR

function minMonto(limite) {
  // JavaScript arrays have a filter() method that let you create a new array containing only elements that pass a certain test. In other words, filter() gives you a new array containing just the elements you need
  return arrayServicios.filter((s) => s.monto >= limite);
}

function maxMonto(limite) {
  return arrayServicios.filter((s) => s.monto <= limite);
}

/* function buscarServicio(servicio) {
      let servicioEncontrado = arrayServicios.find((s) => s.nombre === servicio); // devuelve el objeto , si el valor no existe retorna undefined
      if (servicioEncontrado == undefined) {
        console.log("No existe");
      }
      return servicioEncontrado;
    }
    */

function buscarServicioID(id) {
  return arrayServicios.findIndex((s) => s.id === id); // El método findIndex() devuelve el índice del primer elemento de un array que cumpla con la función de prueba proporcionada. En caso contrario devuelve -1.
}
function buscarServicioNombre(nombre) {
  return arrayServicios.findIndex((s) => s.nombre === nombre); // El método findIndex() devuelve el índice del primer elemento de un array que cumpla con la función de prueba proporcionada. En caso contrario devuelve -1.
}

function eliminarTodo() {
  localStorage.clear();
  arrayServicios = [];
  montos = [];
  servicios.innerHTML = "";
  total.innerHTML = "";
}
function suprimirServicio(id) {
  return arrayServicios.filter((s) => s.id != id); // Devuelve una lista nueva donde se excluye la condicion (s.nombre != servicio) de manera indirecta lo elimina
}

// SUMAR TOTAL

// De los pedidos al usuario.
function montoValido(strMonto) {
  let validado = false;
  let numero = parseFloat(strMonto);
  if (!isNaN(numero) && numero != null && numero > 0) {
    validado = true;
  } else {
    let emergente = document.createElement("h3");
    emergente.className = "error";
    emergente.textContent = "ERROR: MONTO INVALIDO";
    info.appendChild(emergente);
  }
  return validado;
}

function servicioValidado(strServicioGasto) {
  let validado = false;
  if (
    isNaN(strServicioGasto) &&
    strServicioGasto !== null &&
    strServicioGasto !== ""
  ) {
    validado = true;
  } else {
    let emergente = document.createElement("h3");
    emergente.className = "error";
    emergente.textContent = "ERROR: NOMBRE INVALIDO";
    console.log("ERROR: NOMBRE INVALIDO");
    info.appendChild(emergente);
  }
  return validado;
}

function fechaValida(strFvto) {
  let validado = false;
  if (isNaN(strFvto) && strFvto !== null && strFvto !== "") {
    validado = true;
  } else {
    let emergente = document.createElement("h3");
    emergente.className = "error";
    emergente.textContent = "ERROR: FECHA INVALIDA";
    info.appendChild(emergente);
  }
  return validado;
}

// GENERAR ETIQUETAS DE SERVICIOS CON DOM

function GenerarDOMServicio(servicio) {
  let fecha = fechaFormateada(servicio.fvto);
  let servicioDOM = document.createElement("div");
  servicioDOM.id = `${servicio.id}`;
  servicioDOM.className = "servicioCreado";
  servicioDOM.innerHTML = `
  <div class="servicio_info"> 
        <h3 class="${servicio.id}_nombre">  ${servicio.nombre} 📃</h3>
        <h4 class="${servicio.id}_monto"> M:  $${servicio.monto}.- 💵</h4>
        <h4 class="${servicio.id}_fecha"> F:  ${fecha} 📅 </h4>
    </div>
  <span class="botonEliminar">❌</div>`;
  servicios.append(servicioDOM);

  let eliminarItemServicio = servicioDOM.querySelector(".botonEliminar");
  eliminarItemServicio.addEventListener("click", () => {
    eliminarServicio(servicio.id); // ELIMINO EL SERVICIO DEL ARRAYSERVICIOS
    actualizarServiciosLS(); // ACTUALIZO ARRAY SERVICIO Y LS SERVICIOS
    actualizarMontoLS(); // ACTUALIZO ARRAY MONTO Y LS MONTO
    servicios.removeChild(servicioDOM); // REMUEVO EL CONTENEDOR SERVICIO DOM
  });

  function eliminarServicio(id) {
    let nuevaLista = suprimirServicio(id);
    arrayServicios = [...nuevaLista]; //  El contenido de nueva lista llena la lista original.
    montos = actualizarMonto();
  }
}

function modificarDOMTotal(monto) {
  if (monto > 0) {
    total.innerHTML = "";
    let importeTotal = document.createElement("div");
    importeTotal.className = "importeTotal";
    importeTotal.innerHTML = `
        <h2 class="montoTotal">💰 $${monto}.- (PESOS ARG) 💰</h3>
    `;
    total.appendChild(importeTotal);
  } else {
    total.innerHTML = "";
    console.log("No hay ningun servicio cargado");
  }
}

function sumarImportes(montos) {
  return montos.reduce((acc, n) => acc + n, 0);
}

//STORAGE
//JSON.parse recibe un texto JSON como parametro y devuelve un objeto.
//JSON.stringify acepta un objeto como parametro y devuelve la forma de textoJSON equivalente.

function obtenerServiciosLS() {
  let arraylist = [];
  if (localStorage.getItem("Servicios")) {
    arraylist = JSON.parse(localStorage.getItem("Servicios"));
    arraylist.forEach((s) => GenerarDOMServicio(s));
  } else {
    localStorage.setItem("Servicios", "[]");
  }
  return arraylist;
}

function obtenerMontosLS() {
  let monto = 0;
  let total = 0;
  if (localStorage.getItem("Monto")) {
    monto = JSON.parse(localStorage.getItem("Monto"));
    total = sumarImportes(monto);
    modificarDOMTotal(total);
  } else {
    localStorage.setItem("Monto", "[]");
  }
  return monto;
}

// Metodo de fechas

// function mesValido(numero) {
//   let validado = false;
//   if (0 < numero && numero <= 12) {
//     validado = true;
//   } else {
//     let emergente = document.createElement("h3");
//     emergente.className = "error";
//     emergente.textContent = "ERROR: MES INVALIDO";
//     info.appendChild(emergente);
//   }
//   return validado;
// }

// function diaValido(numero) {
//   let validado = false;
//   if (0 < numero && numero <= 31) {
//     validado = true;
//   } else {
//     let emergente = document.createElement("h3");
//     emergente.className = "error";
//     emergente.textContent = "ERROR: DIA INVALIDO";
//     info.appendChild(emergente);
//   }
//   return validado;
// }

// function obtenerFechaFormateada(fecha) {
//   let dia = fecha.getDay();
//   let mes = fecha.getMonth() + 1; // Los meses en JavaScript son base 0, por lo que se suma 1
//   let anio = fecha.getFullYear();

//   let diaFormateado = dia.toString().padStart(2, "0");
//   let mesFormateado = mes.toString().padStart(2, "0");
//   let anioFormateado = anio.toString().slice(-2);

//   // se formatean los componentes asegurando que tengan dos dígitos utilizando el método padStart() y se extrae el año de dos dígitos utilizando el método slice().

//   return `${diaFormateado}/${mesFormateado}/${anioFormateado}`;
// }

function fechaFormateada(fecha) {
  fechaCortada = fecha.split("-"); // corto la fecha String por los "-" y lo guardo en un Array
  fechaForma = `${fechaCortada[2]}/${fechaCortada[1]}/${fechaCortada[0]}`; // de ese array agarro el dia pos [2], el mes [1], anio [0]
  return fechaForma;
}
function actualizarMonto() {
  let montos = [];
  arrayServicios.forEach((s) => {
    montos.push(s.monto);
  });
  return montos;
}

function actualizarMontoLS() {
  let montos = actualizarMonto();
  let importeFinal = sumarImportes(montos);
  localStorage.setItem("Monto", JSON.stringify(montos));
  modificarDOMTotal(importeFinal);
}

function actualizarServiciosLS() {
  localStorage.setItem("Servicios", JSON.stringify(arrayServicios));
}
