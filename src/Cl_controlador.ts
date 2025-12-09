import Cl_mAsistente, { iAsistente } from "./Cl_mAsistente.js";
import Cl_mEvento from "./Cl_mEvento.js";
import Cl_vEvento from "./Cl_vEvento.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_controlador {
  public modelo: Cl_mEvento;
  public vista: Cl_vEvento;
  
  constructor(modelo: Cl_mEvento, vista: Cl_vEvento) {
    this.modelo = modelo;
    this.vista = vista;
  }

  addAsistente({
    dtAsistente,
    callback,
  }: {
    dtAsistente: iAsistente;
    callback: (error: string | false) => void;
  }): void {
    this.modelo.addAsistente({
      dtAsistente,
      callback,
    });
  }

  editAsistente({
    dtAsistente,
    callback,
  }: {
    dtAsistente: iAsistente;
    callback: (error: string | boolean) => void;
  }): void {
    this.modelo.editAsistente({
      dtAsistente,
      callback,
    });
  }

  deleteAsistente({
    correo,
    callback,
  }: {
    correo: string;
    callback: (error: string | boolean) => void;
  }): void {
    this.modelo.deleteAsistente({
      correo,
      callback,
    });
  }

  asistente(correo: string): Cl_mAsistente | null {
    let asistente = this.modelo.asistente(correo);
    if (asistente) return new Cl_mAsistente(asistente.toJSON());
    else return null;
  }

  get dtAsistentes(): iAsistente[] {
    let dtAsistentes = this.modelo.dtAsistentes();
    dtAsistentes.sort((a, b) => a.nombre.localeCompare(b.nombre));
    return dtAsistentes;
  }

  activarVista({
    vista,
    opcion,
    objeto,
  }: {
    vista: string;
    opcion?: opcionFicha;
    objeto?: Cl_mAsistente;
  }): void {
    this.vista.activarVista({ vista, opcion, objeto });
  }
}