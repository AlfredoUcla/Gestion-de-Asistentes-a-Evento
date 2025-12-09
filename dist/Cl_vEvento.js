import Cl_vAsistente from "./Cl_vAsistente.js";
import Cl_vAsistentes from "./Cl_vAsistentes.js";
import Cl_vUsuario from "./Cl_vUsuario.js";
import Cl_vAdmin from "./Cl_vAdmin.js";
import Cl_vEstadisticas from "./Cl_vEstadisticas.js";
import Cl_vInicio from "./Cl_vInicio.js";
import Cl_vGeneral from "./tools/Cl_vGeneral.js";
export default class Cl_vEvento extends Cl_vGeneral {
    constructor() {
        super({ formName: "evento" });
        // Inicializar todas las vistas
        this.vInicio = new Cl_vInicio();
        this.vUsuario = new Cl_vUsuario();
        this.vAdmin = new Cl_vAdmin();
        this.vAsistentes = new Cl_vAsistentes();
        this.vAsistente = new Cl_vAsistente();
        this.vEstadisticas = new Cl_vEstadisticas();
        // Ocultar todas las vistas inicialmente
        this.ocultarTodasLasVistas();
        // Mostrar vista inicial por defecto
        this.vInicio.show({ ver: true });
    }
    set controlador(controlador) {
        super.controlador = controlador;
        this.vInicio.controlador = controlador;
        this.vUsuario.controlador = controlador;
        this.vAdmin.controlador = controlador;
        this.vAsistentes.controlador = controlador;
        this.vAsistente.controlador = controlador;
        this.vEstadisticas.controlador = controlador;
    }
    get controlador() {
        return super.controlador;
    }
    ocultarTodasLasVistas() {
        this.vInicio.show({ ver: false });
        this.vUsuario.show({ ver: false });
        this.vAdmin.show({ ver: false });
        this.vAsistentes.show({ ver: false });
        this.vAsistente.show({ ver: false });
        this.vEstadisticas.show({ ver: false });
    }
    activarVista({ vista, opcion, objeto, }) {
        console.log(`🔄 Activando vista: ${vista}`);
        // Ocultar todas las vistas primero
        this.ocultarTodasLasVistas();
        // Mostrar la vista solicitada
        switch (vista) {
            case "inicio":
                this.vInicio.show({ ver: true });
                break;
            case "usuario":
                this.vUsuario.show({ ver: true });
                break;
            case "admin":
                this.vAdmin.show({ ver: true });
                break;
            case "asistentes":
                this.vAsistentes.show({ ver: true });
                break;
            case "asistente":
                this.vAsistente.show({
                    ver: true,
                    asistente: objeto,
                    opcion
                });
                break;
            case "estadisticas":
                this.vEstadisticas.show({ ver: true });
                break;
            default:
                this.vInicio.show({ ver: true });
        }
    }
}
