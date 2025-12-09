import Cl_vGeneral from "./tools/Cl_vGeneral.js";
export default class Cl_vAdmin extends Cl_vGeneral {
    constructor() {
        super({ formName: "admin" });
        this.btAsistentes = this.crearHTMLButtonElement("btAsistentes", {
            onclick: () => {
                var _a;
                (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.activarVista({ vista: "asistentes" });
            }
        });
        this.btEstadisticas = this.crearHTMLButtonElement("btEstadisticas", {
            onclick: () => {
                var _a;
                (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.activarVista({ vista: "estadisticas" });
            }
        });
        this.btVolver = this.crearHTMLButtonElement("btVolver", {
            onclick: () => {
                var _a;
                (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.activarVista({ vista: "inicio" });
            }
        });
    }
}
