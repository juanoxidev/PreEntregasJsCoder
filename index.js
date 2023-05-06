// El siguiente codigo solicita al usuario que ingrese sus servicios para verlos reflejados en la pagina y ver el monto total de lo que debe pagar.
const botonAgregar = document.getElementById("agregar");
const botonAsc = document.getElementById("asc");
const botonDesc = document.getElementById("desc");
const info = document.getElementById("info");
const servicios = document.getElementById("servicios");
const nuevoServicio = document.getElementsByClassName("nuevoServicio");
const total = document.getElementById("total");
let montos = obtenerMontosLS();
let arrayServicios = obtenerServiciosLS();

botonAgregar.addEventListener("click", validarForm);
botonAsc.addEventListener("click", ordenarMaxMin);
botonDesc.addEventListener("click", ordenarMinMax);

function validarForm() {
  console.log("Ejecutando validacion");
  let nombre = document.getElementById("nombre").value;
  let monto = document.getElementById("monto").valueAsNumber;
  let fecha = document.getElementById("fecha").value;
  // let fechaVto = new Date(fecha).toLocaleDateString(); // como se debe mostrar
  if (servicioValidado(nombre) && montoValido(monto) && fechaValida(fecha)) {
    agregar(nombre, monto, fecha);
    console.log(arrayServicios);
  } else {
    console.log;
  }
}

// CONSTRUCTOR
function Servicio(strNombre, intMonto, strFvto) {
  this.nombre = strNombre.toUpperCase();
  this.monto = intMonto;
  this.fvto = strFvto;
}

// METODOS
// Del array.

// AGREGAR
function agregar(nombre, monto, fvto) {
  //Agregar solo tipo Servicio, creo que en este metodo no pasa por las validaciones.
  let servicio = new Servicio(nombre, monto, fvto);
  if (buscarServicio(servicio.nombre) == -1) {
    arrayServicios.push(servicio);
    GenerarDOMServicio(servicio);
    console.log(montos);
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

function buscarServicio(servicio) {
  return arrayServicios.findIndex((s) => s.nombre === servicio); // El método findIndex() devuelve el índice del primer elemento de un array que cumpla con la función de prueba proporcionada. En caso contrario devuelve -1.
}

function suprimirServicio(servicio) {
  return arrayServicios.filter((s) => s.nombre != servicio); // Devuelve una lista nueva donde se excluye la condicion (s.nombre != servicio) de manera indirecta lo elimina
}

function eliminarServicio() {
  let servicio = prompt("Que servicio desea eliminar?").trim().toUpperCase();
  let servicioEncontrado = buscarServicio(servicio);
  if (servicioEncontrado == -1) {
    console.log("El servicio indicado existe");
  } else {
    let nuevaLista = suprimirServicio(servicio);
    arrayServicios = [...nuevaLista]; //  El contenido de nueva lista llena la lista original.
  }
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
  let fechaVto = new Date(servicio.fvto).toLocaleDateString();
  let nuevoServicio = document.createElement("div");
  nuevoServicio.className = "nuevoServicio";
  nuevoServicio.innerHTML = `
        <h3 class="nuevoServicio_nombre">Servicio: ${servicio.nombre}</h3>
        <h4 class="nuevoServicio_monto">Importe : $${servicio.monto}.-</h4>
        <h4 class="nuevoServicio_fecha">Vencimiento: ${fechaVto}</h4>
    `;
  servicios.appendChild(nuevoServicio);
}

function modificarDOMTotal(monto) {
  total.innerHTML = "";
  let importeTotal = document.createElement("div");
  importeTotal.className = "importeTotal";
  importeTotal.innerHTML = `
        <h2 class="montoTotal">TOTAL: $${monto}</h3>
    `;
  total.appendChild(importeTotal);
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
    console.log(monto);
    total = sumarImportes(monto);
    console.log(total);
    modificarDOMTotal(total);
  } else {
    localStorage.setItem("Monto", "[]");
  }
  return monto;
}
