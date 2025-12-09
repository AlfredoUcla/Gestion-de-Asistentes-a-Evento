import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
export default class Cl_vAsistentesPublico extends Cl_vGeneral {
    constructor() {
        super({ formName: "asistentesPublico" });
        this.selFiltroEstado = this.crearHTMLSelectElement("selFiltroEstado", {
            elementsSource: [
                { value: "todos", text: "Todos los estados" },
                { value: "Pendiente", text: "Pendiente" },
                { value: "Confirmado", text: "Confirmado" },
                { value: "Asistió", text: "Asistió" },
                { value: "Cancelado", text: "Cancelado" }
            ],
            valueAttributeName: "value",
            textExpresion: (item) => item.text,
            onchange: () => this.mostrarAsistentes()
        });
        this.selFiltroTipo = this.crearHTMLSelectElement("selFiltroTipo", {
            elementsSource: [
                { value: "todos", text: "Todos los tipos" },
                { value: "Estudiante", text: "Estudiante" },
                { value: "Profesor", text: "Profesor" },
                { value: "Invitado", text: "Invitado" },
                { value: "Organizador", text: "Organizador" }
            ],
            valueAttributeName: "value",
            textExpresion: (item) => item.text,
            onchange: () => this.mostrarAsistentes()
        });
        this.btVolver = this.crearHTMLButtonElement("btVolver", {
            onclick: () => this.controlador.activarVista({ vista: "usuario" }),
        });
        this.divAsistentes = this.crearHTMLElement("divAsistentes", {
            type: tHTMLElement.CONTAINER,
            refresh: () => this.mostrarAsistentes(),
        });
    }
    mostrarAsistentes() {
        var _a;
        this.divAsistentes.innerHTML = "";
        let asistentes = (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.dtAsistentes;
        if (!asistentes)
            return;
        const filtroEstado = this.selFiltroEstado.value;
        const filtroTipo = this.selFiltroTipo.value;
        const asistentesFiltrados = asistentes.filter(asistente => {
            const cumpleEstado = filtroEstado === "todos" || asistente.estado === filtroEstado;
            const cumpleTipo = filtroTipo === "todos" || asistente.tipo === filtroTipo;
            return cumpleEstado && cumpleTipo;
        });
        let tablaHTML = `
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Tipo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
    `;
        asistentesFiltrados.forEach((asistente) => {
            const estadoColor = this.getColorEstado(asistente.estado);
            tablaHTML += `
        <tr>
          <td>${asistente.nombre}</td>
          <td>${asistente.telefono}</td>
          <td>${asistente.correo}</td>
          <td>${asistente.tipo}</td>
          <td style="color: ${estadoColor}">${asistente.estado}</td>
        </tr>
      `;
        });
        tablaHTML += `</tbody></table>`;
        this.divAsistentes.innerHTML = tablaHTML;
    }
    getColorEstado(estado) {
        switch (estado) {
            case "Pendiente": return "orange";
            case "Confirmado": return "blue";
            case "Asistió": return "green";
            case "Cancelado": return "red";
            default: return "black";
        }
    }
    show({ ver }) {
        super.show({ ver });
        if (ver)
            this.mostrarAsistentes();
    }
}
