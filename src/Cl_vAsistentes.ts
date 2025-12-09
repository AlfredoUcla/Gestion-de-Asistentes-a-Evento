import { iAsistente } from "./Cl_mAsistente.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_vAsistentes extends Cl_vGeneral {
  private btVolver: HTMLButtonElement;
  private divAsistentes: HTMLDivElement;
  private selFiltroEstado: HTMLSelectElement;
  private selFiltroTipo: HTMLSelectElement;
  private inNombre: HTMLInputElement;
  private inTelefono: HTMLInputElement;
  private inCorreo: HTMLInputElement;
  private inTipo: HTMLSelectElement;  
  private inEstado: HTMLSelectElement;
  private inObservaciones: HTMLTextAreaElement;
  private btRegistrar: HTMLButtonElement;
  private btCancelar: HTMLButtonElement; 
  private lblMensaje: HTMLLabelElement;


  constructor() {
    super({ formName: "asistentes" });
    this.inNombre = this.crearHTMLInputElement("inNombre", {
      oninput: () => this.validarFormulario()
    });
    this.inTelefono = this.crearHTMLInputElement("inTelefono", {
      oninput: () => this.validarFormulario()
    }); 
    this.inCorreo = this.crearHTMLInputElement("inCorreo", {
      oninput: () => this.validarFormulario()
    });
    this.inTipo = this.crearHTMLSelectElement("inTipo", {
      elementsSource: [
        { value: "Estudiante", text: "Estudiante" },
        { value: "Docente", text: "Docente" },
        { value: "Familiar", text: "Familiar" },
        { value: "Otro", text: "Otro" }
      ],
      valueAttributeName: "value",
      textExpresion: (item: any) => item.text,
      onchange: () => this.validarFormulario()
    });
    this.inEstado = this.crearHTMLSelectElement("inEstado", {
      elementsSource: [
        { value: "Invitado", text: "Invitado" },
        { value: "Confirmado", text: "Confirmado" },
        { value: "Asistente", text: "Asistente" },
      ],
      valueAttributeName: "value",
      textExpresion: (item: any) => item.text,
      onchange: () => this.validarFormulario()
    });
    this.inObservaciones = this.crearHTMLElement("inObservaciones", {
      type: "textarea"
    }) as HTMLTextAreaElement;
    this.btRegistrar = this.crearHTMLButtonElement("btRegistrar", {
      onclick: () => this.registrarAsistenteDesdeFormulario()
    });
    this.btCancelar = this.crearHTMLButtonElement("btCancelar", {
      onclick: () => this.limpiarFormulario()
    });
    this.lblMensaje = this.crearHTMLLabelElement("lblMensaje");
    this.selFiltroEstado = this.crearHTMLSelectElement("selFiltroEstado", {
      elementsSource: [
        { value: "todos", text: "Todos" },
        { value: "Invitado", text: "Invitado" },
        { value: "Confirmado", text: "Confirmado" },
        { value: "Asistente", text: "Asistente" }
      ],
      valueAttributeName: "value",
      textExpresion: (item: any) => item.text,
      onchange: () => this.mostrarAsistentes()
    });
    this.selFiltroTipo = this.crearHTMLSelectElement("selFiltroTipo", {
      elementsSource: [
        { value: "todos", text: "Todos" },
        { value: "Estudiante", text: "Estudiantes" },
        { value: "Docente", text: "Docentes" },
        { value: "Familiar", text: "Familiares" },
        { value: "Otro", text: "Otros" }
      ],
      valueAttributeName: "value",
      textExpresion: (item: any) => item.text,
      onchange: () => this.mostrarAsistentes()
    });
    this.btVolver = this.crearHTMLButtonElement("btVolver", {
      onclick: () => this.controlador!.activarVista({ vista: "admin" }),
    });
    this.divAsistentes = this.crearHTMLElement("divAsistentes", {
      type: tHTMLElement.CONTAINER,
      refresh: () => this.mostrarAsistentes(),
    }) as HTMLDivElement;
  }
  private mostrarMensaje(mensaje: string, tipo: "exito" | "error" = "exito") {
    this.lblMensaje.innerHTML = mensaje;
    this.lblMensaje.className = `message ${tipo}`;
    this.lblMensaje.style.display = "block";
  }

  private limpiarFormulario() {
    this.inNombre.value = "";
    this.inTelefono.value = "";
    this.inCorreo.value = "";
    this.inTipo.value = "";
    this.inEstado.value = "";
    this.inObservaciones.value = "";
    this.lblMensaje.innerHTML = "";
    this.lblMensaje.style.display = "none";
  }

  private validarFormulario(): boolean {
    let valido = true;
    if (this.inNombre.value.trim().length < 3) {
      valido = false;
    } else {
      this.inNombre.style.borderColor = "";
    }
    if (this.inTelefono.value.trim().length < 7) {
      valido = false;
    }
    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.inCorreo.value.trim().toLowerCase())) {
      valido = false;
    } else {
      this.inCorreo.style.borderColor = "";
    }
    this.btRegistrar.disabled = !valido;
    return valido;
  }

  private getDatosValidos(): { valido: boolean; datos?: iAsistente } {
    const nombre = this.inNombre.value.trim();
    const telefono = this.inTelefono.value.trim();
    const correo = this.inCorreo.value.trim().toLowerCase();
    const tipo = this.inTipo.value;
    const estado = this.inEstado.value;
    const observaciones = this.inObservaciones.value.trim();
    return {
      valido: true,
      datos: {
        id: null,
        creadoEl: null,
        alias: null,
        nombre,
        telefono,
        correo,
        tipo,
        estado,
        observaciones
      }
    };
  }

  private registrarAsistenteDesdeFormulario() {
    const validacion = this.getDatosValidos();
    if (!validacion.valido || !validacion.datos) return;
    this.controlador?.addAsistente({
      dtAsistente: validacion.datos,
      callback: (error) => {
        if (!error) {
          this.mostrarMensaje("¡Asistente registrado exitosamente!", "exito");
          this.limpiarFormulario();
          this.mostrarAsistentes();
        } else {
          this.mostrarMensaje(`Error: ${error}`, "error");
        }
      },
    });
  }

  mostrarAsistentes() {
    this.divAsistentes.innerHTML = "";
    let asistentes = this.controlador?.dtAsistentes;
    if (!asistentes || asistentes.length === 0) {
      this.divAsistentes.innerHTML = `
        <div class="empty-state">
          <h3>📝 No hay asistentes registrados aún</h3>
          <p>Completa el formulario para registrar el primer asistente.</p>
        </div>
      `;
      return;
    }
    const filtroEstado = this.selFiltroEstado.value;
    const filtroTipo = this.selFiltroTipo.value;
    
    const asistentesFiltrados = asistentes.filter(asistente => {
      const cumpleEstado = filtroEstado === "todos" || asistente.estado === filtroEstado;
      const cumpleTipo = filtroTipo === "todos" || asistente.tipo === filtroTipo;
      return cumpleEstado && cumpleTipo;
    });

    if (asistentesFiltrados.length === 0) {
      this.divAsistentes.innerHTML = `
        <div class="empty-state">
          <h3>🔍 No hay resultados</h3>
          <p>No se encontraron asistentes con los filtros aplicados.</p>
        </div>
      `;
      return;
    }
    let tablaHTML = `
      <div class="table-responsive">
        <table class="registros-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
    `;
    asistentesFiltrados.forEach((asistente: iAsistente, index: number) => {
      const estadoClass = this.getClassEstado(asistente.estado);
      const observaciones = asistente.observaciones || "Sin observaciones";
      tablaHTML += `
        <tr>
          <td>${asistente.nombre}</td>
          <td>${asistente.telefono}</td>
          <td>${asistente.correo}</td>
          <td>${asistente.tipo}</td>
          <td><span class="${estadoClass}">${asistente.estado}</span></td>
          <td title="${observaciones}">${this.recortarTexto(observaciones, 30)}</td>
          <td>
            <div class="acciones-container">
              <button id="asistentes_btEditar_${index}" class="btn btn-warning btn-small">✏️ Editar</button>
              <button id="asistentes_btEliminar_${index}" class="btn btn-danger btn-small">🗑️ Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    });
    tablaHTML += `
          </tbody>
        </table>
        <div class="table-footer">
          <p>Total de asistentes: <strong>${asistentesFiltrados.length}</strong></p>
        </div>
      </div>
    `;
    this.divAsistentes.innerHTML = tablaHTML;
    // Agregar eventos a los botones de la tabla
    asistentesFiltrados.forEach((asistente: iAsistente, index) => {
      const btnEditar = document.getElementById(`asistentes_btEditar_${index}`);
      if (btnEditar) {
        btnEditar.onclick = () => this.editarAsistente(asistente.correo);
      }
      const btnEliminar = document.getElementById(`asistentes_btEliminar_${index}`);
      if (btnEliminar) {
        btnEliminar.onclick = () => this.deleteAsistente(asistente.correo);
      }
    });
  }

  private getClassEstado(estado: string): string {
    switch (estado) {
      case "Invitado": return "estado-invitado";
      case "Confirmado": return "estado-confirmado";
      case "Asistente": return "estado-asistente";
      default: return "";
    }
  }
  private recortarTexto(texto: string, maxLength: number): string {
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + "...";
  }
  editarAsistente(correo: string) {
    let asistente = this.controlador?.asistente(correo);
    if (asistente)
      this.controlador?.activarVista({
        vista: "asistente",
        opcion: opcionFicha.edit,
        objeto: asistente,
      });
  }

  deleteAsistente(correo: string) {
    if (confirm(`¿Está seguro de eliminar al asistente con correo ${correo}?\n\nEsta acción no se puede deshacer.`)) {
      this.controlador?.deleteAsistente({
        correo,
        callback: (error) => {
          if (error) {
            alert(`No se pudo eliminar el asistente ${correo}.\nError: ${error}`);
          } else {
            this.mostrarAsistentes();
          }
        },
      });
    }
  }

  show({ ver }: { ver: boolean }): void {
    super.show({ ver });
    if (ver) {
      this.limpiarFormulario();
      this.mostrarAsistentes();
      this.validarFormulario();
    }
  }
}