import Cl_vGeneral from "./tools/Cl_vGeneral.js";

export default class Cl_vAdmin extends Cl_vGeneral {
  private btAsistentes: HTMLButtonElement;
  private btEstadisticas: HTMLButtonElement;
  private btVolver: HTMLButtonElement;

  constructor() {
    super({ formName: "admin" });
    
    this.btAsistentes = this.crearHTMLButtonElement("btAsistentes", {
      onclick: () => {
        this.controlador?.activarVista({ vista: "asistentes" });
      }
    });

    this.btEstadisticas = this.crearHTMLButtonElement("btEstadisticas", {
      onclick: () => {
        this.controlador?.activarVista({ vista: "estadisticas" });
      }
    });

    this.btVolver = this.crearHTMLButtonElement("btVolver", {
      onclick: () => {
        this.controlador?.activarVista({ vista: "inicio" });
      }
    });
  }
}