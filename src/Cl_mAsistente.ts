// Cl_mAsistente.ts
import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";

export interface iAsistente {
  id: number | null;
  creadoEl: string | null;
  alias: string | null;
  nombre: string;
  telefono: string;
  correo: string;
  tipo: string;
  estado: string;
  observaciones: string;
}

export default class Cl_mAsistente extends Cl_mTablaWeb {
  private _nombre: string = "";
  private _telefono: string = "";
  private _correo: string = "";
  private _tipo: string = "";
  private _estado: string = "";
  private _observaciones: string = "";

  constructor({
    id,
    creadoEl,
    alias,
    nombre,
    telefono,
    correo,
    tipo,
    estado,
    observaciones
  }: iAsistente = {
    id: null,
    creadoEl: null,
    alias: null,
    nombre: "",
    telefono: "",
    correo: "",
    tipo: "",
    estado: "Invitado",
    observaciones: ""
  }) {
    super({ id, creadoEl, alias });
    this.nombre = nombre;
    this.telefono = telefono;
    this.correo = correo;
    this.tipo = tipo;
    this.estado = estado;
    this.observaciones = observaciones;
  }

  set nombre(nombre: string) {
    this._nombre = nombre.trim();
  }
  get nombre(): string {
    return this._nombre;
  }

  set telefono(telefono: string) {
    this._telefono = telefono.trim();
  }
  get telefono(): string {
    return this._telefono;
  }

  set correo(correo: string) {
    this._correo = correo.trim().toLowerCase();
  }
  get correo(): string {
    return this._correo;
  }

  set tipo(tipo: string) {
    this._tipo = tipo;
  }
  get tipo(): string {
    return this._tipo;
  }

  set estado(estado: string) {
    this._estado = estado;
  }
  get estado(): string {
    return this._estado;
  }

  set observaciones(observaciones: string) {
    this._observaciones = observaciones.trim();
  }
  get observaciones(): string {
    return this._observaciones;
  }

  get nombreOk(): boolean {
    return this.nombre.length >= 3;
  }

  get telefonoOk(): boolean {
    return this.telefono.length >= 7;
  }

  get correoOk(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo);
  }

  get asistenteOk(): string | true {
    if (!this.nombreOk) return "nombre";
    if (!this.telefonoOk) return "telefono";
    if (!this.correoOk) return "correo";
    return true;
  }

  toJSON(): iAsistente {
    return {
      ...super.toJSON(),
      nombre: this._nombre,
      telefono: this._telefono,
      correo: this._correo,
      tipo: this._tipo,
      estado: this._estado,
      observaciones: this._observaciones
    };
  }
}