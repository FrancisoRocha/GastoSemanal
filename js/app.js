//* VARIABLES Y SELECTORES
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//* EVENTOS
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

//* CLASES
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }
    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto(cantidad){
        //EXTRAYENDO LOS VALORES
        const { presupuesto, restante } = cantidad;
        // INSERTAR EN EL HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    //IMPRIMIR ALERTA
    imprimirAlerta(mensaje, tipo){
        //CREAR EL DIV
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert')

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        //MENSAJE DE ERROR
        divMensaje.textContent = mensaje;

        //INSERTAR EL HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //REMOVER MENSAJE 
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);1
    }

    mostrarGatos(gastos){

        this.limpiarHTML();

        //ITERAR SOBRE LOS GASTOS
        gastos.forEach( gasto => {
            const { cantidad, nombre, id } = gasto;

            //CREAT UN LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            //AGREGAR AL HTML
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`

            //BOTON BORRAR GASTO
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            gastoListado.appendChild(nuevoGasto);
        })
    }
    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestObj){
        const { presupuesto, restante } = presupuestObj;
        const restanteDiv = document.querySelector('.restante');
        // COMPROBAR EL 25%
        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( (presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // VALOR ES IGUAL O MENOR A 0
        if(restante <= 0){
            ui.imprimirAlerta('Presupesto Agotado', 'error')
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// INSTACIAR
const ui = new UI();
let presupuesto;

//* FUNCIONES
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto ?')
    //console.log(presupuestoUsuario);

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <=0 ){
        window.location.reload();
    }

    //Presupuesto Valido
    presupuesto = new Presupuesto(presupuestoUsuario);

    //PRESUPUESTO EN HTML
    ui.insertarPresupuesto(presupuesto)
}

//AÑADIR GASTO
function agregarGasto(e){
    e.preventDefault();

    //LEER LOS DATOS DEL FORMULARIO
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if ( cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    //GENERAR OBJETO DEL GASTO
    const gasto = { nombre, cantidad, id: Date.now() }

    //AÑADIR EL GASTO
    presupuesto.nuevoGasto(gasto);

    //IMPRIME ALERTA
    ui.imprimirAlerta('Gasto agregado correctamente');

    //LISTAR GASTOS
    const { gastos, restante } = presupuesto;
    ui.mostrarGatos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    //REINICIA EL FORMULARIO
    formulario.reset();
    
}

//ELIMINAR GASTO

function eliminarGasto(id){
    //Elimina del objeto
    presupuesto.eliminarGasto(id);
    //Elimina los gastos del HTML
    const { gastos, restante } = presupuesto
    ui.mostrarGatos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
