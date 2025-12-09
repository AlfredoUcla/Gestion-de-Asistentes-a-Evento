import Cl_mAsistente, { iAsistente } from "./Cl_mAsistente.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";

export default class Cl_vUsuario extends Cl_vGeneral {
  private inNombre: HTMLInputElement;
  private inTelefono: HTMLInputElement;
  private inCorreo: HTMLInputElement;
  private selTipo: HTMLSelectElement;
  private inObservaciones: HTMLInputElement;
  private btRegistrar: HTMLButtonElement;
  private btCancelar: HTMLButtonElement;
  private btVolver: HTMLButtonElement;
  private lblMensaje: HTMLLabelElement;
  private divAsistentes: HTMLDivElement;
  private selFiltroEstado: HTMLSelectElement;
  private selFiltroTipo: HTMLSelectElement;

  constructor() {
    super({ formName: "usuario" });
    // Elementos de la interfaz
    this.lblMensaje = this.crearHTMLLabelElement("lblMensaje");

    // Elementos del formulario
      this.inNombre = this.crearHTMLInputElement("inNombre", {
      oninput: () => this.validarFormulario()
    });
    this.inTelefono = this.crearHTMLInputElement("inTelefono", {
      oninput: () => this.validarFormulario()
    }); 
    this.inCorreo = this.crearHTMLInputElement("inCorreo", {
      oninput: () => this.validarFormulario()
    });

this.selTipo = this.crearHTMLSelectElement("selTipo", {
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

    this.inObservaciones = this.crearHTMLInputElement("inObservaciones");
    // Botones del formulario
    this.btRegistrar = this.crearHTMLButtonElement("btRegistrar", {
      onclick: () => this.registrarAsistencia()
    });

    this.btCancelar = this.crearHTMLButtonElement("btCancelar", {
      onclick: () => this.limpiarFormulario()
    });

    // Botón volver
    this.btVolver = this.crearHTMLButtonElement("btVolver", {
      onclick: () => this.controlador!.activarVista({ vista: "inicio" })
    });

    // Filtros para la tabla
    this.selFiltroEstado = this.crearHTMLSelectElement("selFiltroEstado", {
      elementsSource: [
        { value: "todos", text: "Todos los estados" },
        { value: "Invitado", text: "Invitados" },
        { value: "Confirmado", text: "Confirmados" },
        { value: "Asistente", text: "Asististentes" },
      ],
      valueAttributeName: "value",
      textExpresion: (item: any) => item.text,
      onchange: () => this.mostrarAsistentes()
    });

    this.selFiltroTipo = this.crearHTMLSelectElement("selFiltroTipo", {
      elementsSource: [
        { value: "todos", text: "Todos los tipos" },
        { value: "Estudiante", text: "Estudiantes" },
        { value: "Docente", text: "Docentes" },
        { value: "Familiar", text: "Familiares" },
        { value: "Otro", text: "Otros" }
      ],
      valueAttributeName: "value",
      textExpresion: (item: any) => item.text,
      onchange: () => this.mostrarAsistentes()
    });

    // Contenedor de la tabla
    this.divAsistentes = this.crearHTMLElement("divAsistentes", {
      type: tHTMLElement.CONTAINER,
      refresh: () => this.mostrarAsistentes(),
    }) as HTMLDivElement;
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
    const tipo = this.selTipo.value.trim();
    const observaciones = this.inObservaciones.value.trim();

    if (nombre.length < 3) {
      this.mostrarMensaje("El nombre debe tener al menos 3 caracteres", "error");
      return { valido: false };
    }

    if (telefono.length < 7) {
      this.mostrarMensaje("El teléfono debe tener al menos 7 dígitos", "error");
      return { valido: false };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      this.mostrarMensaje("Ingrese un correo electrónico válido", "error");
      return { valido: false };
    }

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
        estado: "Invitado",
        observaciones
      }
    };
  }

  private mostrarMensaje(mensaje: string, tipo: "exito" | "error" = "exito") {
    this.lblMensaje.innerHTML = mensaje;
    this.lblMensaje.className = `message ${tipo}`;
  }

  private limpiarFormulario() {
    this.inNombre.value = "";
    this.inTelefono.value = "";
    this.inCorreo.value = "";
    this.selTipo.value = "";
    this.inObservaciones.value = "";
    this.lblMensaje.innerHTML = "";
    this.lblMensaje.className = "message";
  }
  

  private registrarAsistencia() {
    const validacion = this.getDatosValidos();
    if (!validacion.valido || !validacion.datos) return;

    this.controlador?.addAsistente({
      dtAsistente: validacion.datos,
      callback: (error) => {
        if (!error) {
          this.mostrarMensaje("¡Registro exitoso! Será contactado para confirmación.", "exito");
          this.limpiarFormulario();
          this.mostrarAsistentes(); // Actualizar la tabla
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

    // Aplicar filtros
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

    // Crear tabla de solo lectura
    let tablaHTML = `
      <div class="registros-section">
        <h3>📋 Asistentes Registrados</h3>
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
              </tr>
            </thead>
            <tbody>
    `;

    asistentesFiltrados.forEach((asistente: iAsistente) => {
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
      </div>
    `;

    this.divAsistentes.innerHTML = tablaHTML;
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

  show({ ver }: { ver: boolean }): void {
    super.show({ ver });
    if (ver) {
      this.limpiarFormulario();
      this.mostrarAsistentes();
    }
  }
}