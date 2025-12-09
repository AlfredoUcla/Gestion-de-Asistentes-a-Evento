import Cl_vGeneral from "./tools/Cl_vGeneral.js";

export default class Cl_vInicio extends Cl_vGeneral {
  private btUsuario: HTMLButtonElement;
  private btAdmin: HTMLButtonElement;

  constructor() {
    super({ formName: "inicio" });
    this.btUsuario = this.crearHTMLButtonElement("btUsuario", {
      onclick: () => {
        if (this.controlador) {
          this.controlador.activarVista({ vista: "usuario" });
        }
      }
    });

    this.btAdmin = this.crearHTMLButtonElement("btAdmin", {
      onclick: () => {
        if (this.controlador) {
          this.controlador.activarVista({ vista: "admin" });
        }
      }
    });
  }
  
  show({ ver }: { ver: boolean }): void {
    super.show({ ver });
  }
}