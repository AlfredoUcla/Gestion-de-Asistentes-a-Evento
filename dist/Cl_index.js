import Cl_controlador from "./Cl_controlador.js";
import Cl_mEvento from "./Cl_mEvento.js";
import Cl_vEvento from "./Cl_vEvento.js";
export default class Cl_index {
    constructor() {
        let modelo = new Cl_mEvento();
        modelo.cargar((error) => {
            if (error) {
                alert("Error cargando el sistema: " + error);
                return;
            }
            let vista = new Cl_vEvento();
            let controlador = new Cl_controlador(modelo, vista);
            vista.controlador = controlador;
            vista.refresh();
        });
    }
}
