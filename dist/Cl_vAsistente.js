import Cl_mAsistente from "./Cl_mAsistente.js";
import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class Cl_vAsistente extends Cl_vGeneral {
    constructor() {
        super({ formName: "asistente" });
        this.opcion = null;
        this.asistente = new Cl_mAsistente();
        this.lblOpcion = this.crearHTMLLabelElement("lblOpcion", {
            refresh: () => (this.lblOpcion.innerHTML =
                this.opcion === opcionFicha.add ? "Agregar " : "Editar "),
        });
        this.inNombre = this.crearHTMLInputElement("inNombre", {
            oninput: () => {
                this.inNombre.value = this.asistente.nombre = this.inNombre.value.trim();
                this.refresh();
            },
            refresh: () => (this.inNombre.style.borderColor = this.asistente.nombreOk ? "" : "red"),
        });
        this.inTelefono = this.crearHTMLInputElement("inTelefono", {
            oninput: () => {
                this.inTelefono.value = this.asistente.telefono = this.inTelefono.value.trim();
                this.refresh();
            },
            refresh: () => (this.inTelefono.style.borderColor = this.asistente.telefonoOk ? "" : "red"),
        });
        this.inCorreo = this.crearHTMLInputElement("inCorreo", {
            oninput: () => {
                this.inCorreo.value = this.asistente.correo = this.inCorreo.value.trim().toLowerCase();
                this.refresh();
            },
            refresh: () => (this.inCorreo.style.borderColor = this.asistente.correoOk ? "" : "red"),
        });
        this.selTipo = this.crearHTMLSelectElement("selTipo", {
            elementsSource: [
                { value: "Estudiante", text: "Estudiante" },
                { value: "Docente", text: "Docente" },
                { value: "Familiar", text: "Familiar" },
                { value: "Otro", text: "Otro" }
            ],
            valueAttributeName: "value",
            textExpresion: (item) => item.text,
            onchange: () => {
                this.asistente.tipo = this.selTipo.value;
                this.refresh();
            }
        });
        this.selEstado = this.crearHTMLSelectElement("selEstado", {
            elementsSource: [
                { value: "Invitado", text: "Invitado" },
                { value: "Asistente", text: "Asistente" },
                { value: "Confirmado", text: "Confirmado" },
            ],
            valueAttributeName: "value",
            textExpresion: (item) => item.text,
            onchange: () => {
                this.asistente.estado = this.selEstado.value;
                this.refresh();
            }
        });
        this.inObservaciones = this.crearHTMLElement("inObservaciones", {
            type: "textarea"
        });
        this.inObservaciones.oninput = () => {
            this.asistente.observaciones = this.inObservaciones.value;
            this.refresh();
        };
        this.btAceptar = this.crearHTMLButtonElement("btAceptar", {
            onclick: () => this.aceptar(),
            refresh: () => {
                this.btAceptar.disabled = this.asistente.asistenteOk !== true;
            },
        });
        this.btCancelar = this.crearHTMLButtonElement("btCancelar", {
            onclick: () => this.controlador.activarVista({ vista: "asistentes" }),
        });
    }
    aceptar() {
        if (this.opcion === opcionFicha.add) {
            this.controlador.addAsistente({
                dtAsistente: this.asistente.toJSON(),
                callback: (error) => {
                    if (!error)
                        this.controlador.activarVista({ vista: "asistentes" });
                    else
                        alert(`Error: ${error}`);
                },
            });
        }
        else {
            this.controlador.editAsistente({
                dtAsistente: this.asistente.toJSON(),
                callback: (error) => {
                    if (!error)
                        this.controlador.activarVista({ vista: "asistentes" });
                    else
                        alert(`Error: ${error}`);
                },
            });
        }
    }
    show({ ver, asistente, opcion, } = {
        ver: false,
        asistente: new Cl_mAsistente(),
    }) {
        super.show({ ver });
        if (opcion && asistente) {
            this.opcion = opcion;
            this.asistente.id = asistente.id;
            this.asistente.nombre = this.inNombre.value = asistente.nombre;
            this.asistente.telefono = this.inTelefono.value = asistente.telefono;
            this.asistente.correo = this.inCorreo.value = asistente.correo;
            this.asistente.tipo = this.selTipo.value = asistente.tipo;
            this.asistente.estado = this.selEstado.value = asistente.estado;
            this.asistente.observaciones = this.inObservaciones.value = asistente.observaciones;
            this.refresh();
        }
    }
}
