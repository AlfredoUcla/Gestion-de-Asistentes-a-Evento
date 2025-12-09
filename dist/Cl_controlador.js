import Cl_mAsistente from "./Cl_mAsistente.js";
export default class Cl_controlador {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
    }
    addAsistente({ dtAsistente, callback, }) {
        this.modelo.addAsistente({
            dtAsistente,
            callback,
        });
    }
    editAsistente({ dtAsistente, callback, }) {
        this.modelo.editAsistente({
            dtAsistente,
            callback,
        });
    }
    deleteAsistente({ correo, callback, }) {
        this.modelo.deleteAsistente({
            correo,
            callback,
        });
    }
    asistente(correo) {
        let asistente = this.modelo.asistente(correo);
        if (asistente)
            return new Cl_mAsistente(asistente.toJSON());
        else
            return null;
    }
    get dtAsistentes() {
        let dtAsistentes = this.modelo.dtAsistentes();
        dtAsistentes.sort((a, b) => a.nombre.localeCompare(b.nombre));
        return dtAsistentes;
    }
    activarVista({ vista, opcion, objeto, }) {
        this.vista.activarVista({ vista, opcion, objeto });
    }
}
