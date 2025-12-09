// Cl_mAsistente.ts
import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";
export default class Cl_mAsistente extends Cl_mTablaWeb {
    constructor({ id, creadoEl, alias, nombre, telefono, correo, tipo, estado, observaciones } = {
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
        this._nombre = "";
        this._telefono = "";
        this._correo = "";
        this._tipo = "";
        this._estado = "";
        this._observaciones = "";
        this.nombre = nombre;
        this.telefono = telefono;
        this.correo = correo;
        this.tipo = tipo;
        this.estado = estado;
        this.observaciones = observaciones;
    }
    set nombre(nombre) {
        this._nombre = nombre.trim();
    }
    get nombre() {
        return this._nombre;
    }
    set telefono(telefono) {
        this._telefono = telefono.trim();
    }
    get telefono() {
        return this._telefono;
    }
    set correo(correo) {
        this._correo = correo.trim().toLowerCase();
    }
    get correo() {
        return this._correo;
    }
    set tipo(tipo) {
        this._tipo = tipo;
    }
    get tipo() {
        return this._tipo;
    }
    set estado(estado) {
        this._estado = estado;
    }
    get estado() {
        return this._estado;
    }
    set observaciones(observaciones) {
        this._observaciones = observaciones.trim();
    }
    get observaciones() {
        return this._observaciones;
    }
    get nombreOk() {
        return this.nombre.length >= 3;
    }
    get telefonoOk() {
        return this.telefono.length >= 7;
    }
    get correoOk() {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo);
    }
    get asistenteOk() {
        if (!this.nombreOk)
            return "nombre";
        if (!this.telefonoOk)
            return "telefono";
        if (!this.correoOk)
            return "correo";
        return true;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { nombre: this._nombre, telefono: this._telefono, correo: this._correo, tipo: this._tipo, estado: this._estado, observaciones: this._observaciones });
    }
}
