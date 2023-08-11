//Carrito
//CLASE Y FUNCION PARA AGREGAR ARTICULOS AL CARRITO
class ArticuloCarrito {

  constructor(nombre, cantidad, precio) {
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = precio;
  }
}

function agregarCarrito(nombre, cantidad, precio) {

  //Vemos si el producto esta repetido
  const productoRepetido = carrito.findIndex(producto => producto.nombre === nombre);

  if (productoRepetido !== -1) {

    //Sumamos la cantidad del array carrito con la cantidad que se agrega    
    carrito[productoRepetido].cantidad += parseInt(cantidad);
    Toastify({
      text: "Agregaste un producto al carrito",
      className: "info",
      duration: 2000,
      style: {
        color: "black",
        background: "linear-gradient(to right, rgba(253,240,233,1) 2.2%, rgba(255,194,203,1) 96.2%)",
      }
    }).showToast();

  }
  else {

    carrito.push(new ArticuloCarrito(nombre, parseInt(cantidad), precio))
    Toastify({
      text: "Agregaste un producto al carrito",
      className: "info",
      duration: 2000,
      style: {
        color: "black",
        background: "linear-gradient(to right, rgba(253,240,233,1) 2.2%, rgba(255,194,203,1) 96.2%)"
      }
    }).showToast();
  }
}

//VARIABLES GLOBALES
let carrito = [];
let productos = [];
let btnProductos;

//Contenedor de productos a comprar donde se indica la cantidad para agregar al carrito
const comprarProducto = document.getElementById('comprar_producto');

//Elementos del DOM del carrito
const btnCarrito = document.getElementById('btn_carrito');
const divCarrito = document.getElementById('carrito');
const carritoLista = document.querySelector('.carrito_lista');
const carritoFormulario = document.getElementById('carrito_formulario');
let carritoBorrar = []



//FUNCIONES

//Renderiza el contenido div#lista_productos de la vista principal
function mostrarProductos(productos) {

  const listaProductos = document.getElementById('lista_productos');

  productos.forEach((producto) => {

    listaProductos.innerHTML +=
      `<div class="tarjeta col-sm-12 col-md-6 col-lg-3">
            <img src="${producto.imagen}" alt="">
            <h3>${producto.nombre}</h3>
            <h4>$${producto.precio}</h4>
            <button class="comprar btn btn-primary">Comprar</button>
        </div>`
  })
}

//Obtencion de la informacion de los productos productos.json
async function obtenerProductos() {

  try {

    //Traemos la informacion del JSON
    const productosJson = await fetch('./productos.json');
    productos = await productosJson.json();
    mostrarProductos(productos);
    return (productos);
  }

  catch (error) {

    //Solicitud denegada
    console.log(error);
  }
}

//Funcionalidad del boton comprar de la lista de productos y carga del contenido del div comprar_producto

//Boton Aceptar de la funcion comprar()
function aceptarCompra(producto, i) {

  const btnAceptarCompra = document.getElementById('aceptar');

  btnAceptarCompra.addEventListener('click', (event) => {

    event.preventDefault();

    const inputCantidad = document.getElementById('cantidad');

    //En el input se me permite colocar la letra "e" por eso agrego esta capa para corroborar
    if (isNaN(inputCantidad.value)) {

      //No se agrega a carrito
      comprarProducto.classList.toggle('activo')
    }

    comprarProducto.innerHTML = ""
    comprarProducto.classList.toggle('activo')
    agregarCarrito(producto.nombre, inputCantidad.value, producto.precio);

  })
}

//Cancelar compra
function cancelarCompra() {

  const btnCancelarCompra = document.getElementById('cancelar');

  btnCancelarCompra.addEventListener('click', (event) => {

    event.preventDefault();
    comprarProducto.innerHTML = ""
    comprarProducto.classList.toggle('activo')
  })
}

//Renderiza todo el contenido del div comprar_producto
function comprar(productos) {

  //Leemos y guardamos una constante que tenga todos los botones comprar de los articulos
  btnProductos = document.querySelectorAll('.comprar');

  btnProductos.forEach((btn, i) => {

    btn.addEventListener('click', () => {

      comprarProducto.classList.toggle('activo');
      comprarProducto.innerHTML +=
        `<h2 class="nombre">${productos[i].nombre}</h2>
        <img id="compraImg" src="${productos[i].imagen}">
        <h3 class="precioUnitario">$${productos[i].precio}</h3>
        <form>
          <label for="cantidad" class="cantidad">Cantidad:</label>
          <input id="cantidad" type="number" min="1" value="1">
          <input type="submit" class="btn btn-primary" value="Aceptar" id="aceptar">
          <input type="submit" class="btn btn-danger" value="Cancelar" id="cancelar">
        </form>`;

      aceptarCompra(productos[i], i);
      cancelarCompra();
    })
  })
}

//FUNCIONES DEL CARRITO

function eliminarProducto() {

  carritoBorrar = document.querySelectorAll('.carrito_borrar');

  carritoBorrar.forEach((btn, i) => {

    btn.addEventListener('click', () => {

      carrito.splice(i, 1);
      actualizarCarrito();
      Toastify({
        text: "Producto eliminado",
        className: "info",
        duration: 2000,
        style: {
          color: "black",
          background: "linear-gradient(to right, rgba(253,240,233,1) 2.2%, rgba(255,194,203,1) 96.2%)"
        }
      }).showToast();
    })
  })
}

function actualizarCarrito() {

  if (carrito.length > 0) {
    //Si el carrito tiene productos

    //Limpiamos el carrito
    carritoLista.innerHTML = "";
    carritoFormulario.innerHTML = "";
    let montoTotal = 0

    //Contenido carritoList  
    carrito.forEach((producto) => {

      let carritoItem = document.createElement("div");
      carritoItem.classList.add('item');
      carritoItem.innerHTML =
        `<span class="carrito_producto">${producto.nombre}</span>
        <span class="carrito_cantidad">${producto.cantidad}</span>
        <span class="carrito_subtotal">${producto.cantidad * producto.precio}</span>
        <button class="carrito_borrar btn btn-danger">X</button>`;

      //Sumamos de forma acumulativa los subtotales de cada producto al monto total en cada iteracion
      montoTotal += (producto.cantidad * producto.precio);
      carritoLista.appendChild(carritoItem);
    })

    eliminarProducto();

    //Contenido carrito formulario
    carritoFormulario.innerHTML =
      `<p>El total a pagar es $ ${montoTotal}</p>
      <form action="">
        <label for= "nombre" ></label >
        <input type="text" name="nombre" id="nombre_cliente" placeholder="Ingresa tu nombre" required>
        <label for="email"></label>
        <input type="email" id="email_cliente" placeholder="Ingresa tu email" required>
        <input type="submit" class="btn btn-primary" value="Enviar Pedido" id="pedido_cliente">
      </form>`

    enviarPedido();
  }

  //Si el carrito esta vacio
  else {

    divCarrito.classList.toggle('activo');

    Swal.fire({
      title: 'Tu carrito de compras esta vacio',
      text: "¿Queres repetir la ultima compra?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Repetir pedido'
    })
      .then((result) => {

        //Comprobamos si hay un pedido guardado en el LocalStorage
        const comprobarUltimoPedido = localStorage.getItem("ultimaOrden");

        if (result.isConfirmed && (comprobarUltimoPedido === null || comprobarUltimoPedido === undefined)) {

          Swal.fire(
            'No hay un pedido anterior guardado.'
          )
        }

        else if (result.isConfirmed) {

          Swal.fire(
            'Tu carrito fue actualizado con exito'
          )

          //Recuperamos el pedido y lo guardamos en el carrito
          const recuperarUltimoPedido = JSON.parse(comprobarUltimoPedido);
          carrito = recuperarUltimoPedido;
        }
      })
  }
}

//Activa el carrito para poder visualizarlo y lo actualiza
function abrirCarrito() {

  btnCarrito.addEventListener('click', () => {

    divCarrito.classList.toggle('activo');
    actualizarCarrito();
  })
}

//Funciones validadoras del formulario del carrito
const validarEmail = (email) => {

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar el formato del nombre
const validarNombre = (nombre) => {

  const regex = /^[a-zA-Z\s]+$/;
  return regex.test(nombre);
};

//Si el pedido se confirma en el formulario del carrito
function enviarPedido() {

  const btnAceparPedido = document.getElementById('pedido_cliente');

  btnAceparPedido.addEventListener('click', (event) => {

    event.preventDefault();

    const nombreCliente = document.getElementById('nombre_cliente');
    const emailCliente = document.getElementById('email_cliente');

    //Validaoms la informacion del formulario
    const NombreValido = validarNombre(nombreCliente.value);
    const EmailValido = validarEmail(emailCliente.value);

    if (!NombreValido || !EmailValido) {

      //Si los datos ingresados no son validos
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El Nombre o el Email ingresado no son validos',
      })
    }

    else {

      //Guardamos el pedido en localstore para poder repetirlo si se desea en otra sesion
      const ultimoPedido = carrito;
      const ultimoPedidoJSON = JSON.stringify(ultimoPedido);
      localStorage.setItem('ultimaOrden', ultimoPedidoJSON);

      //Construccion del listado de productos pedidos como string
      let listadoPedido = "";
      for (let i = 0; i < carrito.length; i++) {
        let articuloJson = JSON.stringify(carrito[i].nombre);
        listadoPedido += (articuloJson + " por ");
        articuloJson = JSON.stringify(carrito[i].cantidad);
        listadoPedido += (articuloJson + " unidades;");
      }

      divCarrito.classList.toggle('activo');
      //Vaciamos el carrito
      carrito = [];

      //Mensaje que se va a enviar
      let mensaje = encodeURIComponent(`Hola Letizir mi nombre es ${nombreCliente.value} mi mail de contacto es ${emailCliente.value} y quiero realizar un pedido con los siguientes productos: ${listadoPedido}`);
      //Reemplaza 'numero_destino' con el número de teléfono al que deseas enviar el mensaje(incluyendo el código de país)
      let numeroDestino = '5491134330889';
      //Ruta que utilizamos para enviar el mensaje
      let enlaceWhatsApp = 'https://api.whatsapp.com/send?phone=' + numeroDestino + '&text=' + mensaje;
      //Abre el enlace en una nueva pestaña o ventana del navegador
      window.open(enlaceWhatsApp);
    }
  })
}

//Iniciamos recuperando la lista de produtos del JSON
const cargarProductos = new Promise((resolve, reject) => {

  obtenerProductos()
    .then(() => {
      if (productos.length > 0) {
        resolve(productos);
      }
    })
    .catch(error => {
      reject(error);
    });
})

cargarProductos
  .then(() => {
    //Agregamos o no productos al carrito por el formulario
    comprar(productos);
  })
  .then(() => {
    abrirCarrito();
  })
  .catch(error => {
    console.log(error);
  })