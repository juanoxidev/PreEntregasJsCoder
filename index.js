// El siguiente codigo solicita al usuario que ingrese sus servicios para verlos reflejados en la pagina y ver el monto total de lo que debe pagar.
let strContinuar;
let intTotalMonto = 0;
let arrayServicios = [];

do {
  let strServicio = pedirServicio(); // Se guarda en una variable local el servicio del usuario Se evalua si ese servicio ingresado es valido.
  let intMonto = pedirMonto(); // Si el servicio es valido, se le pide el monto de su factura/gasto. El monto debe ser mayor a 0, Si es valido continua el programa, si es invalido se le va a pedir que ingrese un monto de nuevo.
  let strFvto = pedirFvto();
  intTotalMonto += intMonto; // Se agrega el monto de la factura actual, al monto total de gastos que tiene el usuario
  document.write(
    `<h4 class="anuncio"> Servicio: ${strServicio.toUpperCase()} --- Monto : $${intMonto} --- Fecha Vto: ${strFvto} <br></h4>`
  );

  agregar(strServicio, intMonto, strFvto);
  strContinuar = prompt("Desea continuar? (S para continuar)");
} while (
  strContinuar.trim().charAt(0).toUpperCase() === "S" &&
  strContinuar !== null
);

if (intTotalMonto > 0) {
  // Una vez que se opta por no ingresar mas servicios, se muestra en la pagina el monto total que se debe pagar por todos los servicios anotados. En caso de ser 0 se indica que no hay ninguna factura o gasto ingresado.
  document.write(
    ` <h3 class="anuncio"> ---------------- Total: $${intTotalMonto} ---------------- </h3>`
  );
} else {
  document.write(
    ` <h2 class="anuncio"> Usted no ha ingresado ninguna factura/gasto. </h2>`
  );
}

console.table(arrayServicios);
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
  arrayServicios.push(servicio);
}

// ORDENAR

function ordenarMaxMin() {
  // To sort an array of objects, you use the sort() method and provide a comparison function that determines the order of objects.
  arrayServicios.sort(
    (s1, s2) => (s1.monto < s2.monto ? 1 : s1.monto > s2.monto ? -1 : 0) // ifs one line
  );
}
function ordenarMinMax() {
  arrayServicios.sort(
    (s1, s2) => (s1.monto > s2.monto ? 1 : s1.monto < s2.monto ? -1 : 0) // ifs one line
  );
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
  }
  return validado;
}

function fechaValida(strFvto) {
  let validado = false;
  if (
    isNaN(strFvto) &&
    strFvto !== null &&
    strFvto !== "" &&
    strFvto.length == 5
  ) {
    validado = true;
  }
  return validado;
}

function pedirMonto() {
  let strMonto;
  strMonto = prompt("¿Cual es el monto que desea registrar?");
  while (montoValido(strMonto) !== true) {
    alert("Ud. ingreso un monto invalido. Ingrese un numero > 0.");
    strMonto = prompt("¿Cual es el monto que desea registrar?");
  }
  return parseFloat(strMonto);
}

function pedirFvto() {
  let strFvto;
  strFvto = prompt("¿Cual es la fecha de vencimiento? (DD/MM)");
  while (fechaValida(strFvto) !== true) {
    alert(
      "Ud. ingreso una fecha invalida. Ingrese una fecha con este formato (DD/MM)."
    );
    strFvto = prompt("¿Cual es la fecha de vencimiento?");
  }
  return strFvto;
}

function pedirServicio() {
  let strServicio;
  strServicio = prompt("¿Qué servicio/gasto desea agregar? ");
  while (servicioValidado(strServicio) !== true) {
    alert(
      "Ud. ingreso un servicio/gasto invalido. Ingrese el nombre del servicio correctamente."
    );
    strServicio = prompt("¿Qué servicio/gasto desea agregar?");
  }
  return strServicio;
}
