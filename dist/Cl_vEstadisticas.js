import Cl_vGeneral from "./tools/Cl_vGeneral.js";
export default class Cl_vEstadisticas extends Cl_vGeneral {
    constructor() {
        super({ formName: "estadisticas" });
        this.divEstadisticas = this.crearHTMLElement("divEstadisticas", {
            type: "CONTAINER",
            refresh: () => this.mostrarEstadisticas(),
        });
        this.btVolver = this.crearHTMLButtonElement("btVolver", {
            onclick: () => this.controlador.activarVista({ vista: "admin" }),
        });
    }
    mostrarEstadisticas() {
        var _a;
        const asistentes = ((_a = this.controlador) === null || _a === void 0 ? void 0 : _a.dtAsistentes) || [];
        const total = asistentes.length;
        if (total === 0) {
            this.divEstadisticas.innerHTML = `
        <div class="empty-state">
          <h3>📊 No hay datos para mostrar</h3>
          <p>No hay asistentes registrados aún.</p>
        </div>
      `;
            return;
        }
        // Calcular estadísticas
        const asistentesLista = this.filtrarAsistentes(asistentes);
        const porcentajeSinConfirmar = this.calcularPorcentajeSinConfirmar(asistentes);
        const distribucionEstado = this.calcularDistribucionEstado(asistentes);
        const distribucionTipo = this.calcularDistribucionTipo(asistentes);
        const tasaAsistenciaPorTipo = this.calcularTasaAsistenciaPorTipo(asistentes, total);
        // Generar HTML
        const html = `
      <div class="estadisticas-container">
        <header class="stats-header">
          <h2>📊 Estadísticas Detalladas del Evento</h2>
          <div class="resumen-general">
            <span class="total-registrados">Total Registrados: <strong>${total}</strong></span>
          </div>
        </header>

        <div class="stats-grid">
          <!-- Sección 1: Lista de Asistentes -->
          <div class="stat-card full-width">
            <h3>👥 Lista de Asistentes Confirmados y Asistentes</h3>
            ${this.generarListaAsistentes(asistentesLista)}
          </div>

          <!-- Sección 2: Porcentaje sin Confirmar -->
          <div class="stat-card">
            <h3>📈 Estado de Confirmación</h3>
            <div class="stat-highlight">
              <div class="stat-value">${porcentajeSinConfirmar.porcentaje}%</div>
              <div class="stat-label">Sin Confirmar</div>
            </div>
            <div class="stat-details">
              <p>Invitados sin confirmar: <strong>${porcentajeSinConfirmar.invitados}</strong></p>
              <p>Total registrados: <strong>${total}</strong></p>
            </div>
          </div>

          <!-- Sección 3: Distribución por Estado -->
          <div class="stat-card">
            <h3>🎯 Distribución por Estado</h3>
            <div class="progress-bars">
              ${this.generarBarrasProgreso(distribucionEstado)}
            </div>
            <ul class="stat-list">
              ${Object.entries(distribucionEstado).map(([estado, datos]) => `
                <li>
                  <span class="estado-label estado-${estado.toLowerCase()}">${estado}</span>
                  <span class="stat-numbers">
                    ${datos.cantidad} (${datos.porcentaje}%)
                  </span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Sección 4: Distribución por Tipo -->
          <div class="stat-card">
            <h3>👤 Distribución por Tipo</h3>
            <div class="donut-chart-placeholder">
              <div class="chart-info">
                <span class="chart-total">${total}</span>
                <span class="chart-label">Total</span>
              </div>
            </div>
            <ul class="stat-list">
              ${Object.entries(distribucionTipo).map(([tipo, cantidad]) => `
                <li>
                  <span class="tipo-label">${tipo}</span>
                  <span class="stat-numbers">
                    ${cantidad} (${((cantidad / total) * 100).toFixed(1)}%)
                  </span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Sección 5: Tasa de Asistencia por Tipo -->
          <div class="stat-card full-width">
            <h3>📊 Tasa de Asistencia por Tipo</h3>
            <div class="tasa-container">
              ${Object.entries(tasaAsistenciaPorTipo).map(([tipo, datos]) => `
                <div class="tasa-item">
                  <div class="tasa-header">
                    <span class="tasa-tipo">${tipo}</span>
                    <span class="tasa-total">${datos.total}</span>
                  </div>
                  <div class="tasa-details">
                    <div class="tasa-row">
                      <span class="tasa-label">Asistentes:</span>
                      <span class="tasa-value">${datos.asistentes}</span>
                    </div>
                    <div class="tasa-row">
                      <span class="tasa-label">Tasa:</span>
                      <span class="tasa-porcentaje">${datos.porcentaje}%</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Sección 6: Resumen Ejecutivo -->
          <div class="stat-card">
            <h3>📋 Resumen Ejecutivo</h3>
            <div class="resumen-item">
              <span class="resumen-label">Total Asistentes:</span>
              <span class="resumen-value">${asistentesLista.length}</span>
            </div>
            <div class="resumen-item">
              <span class="resumen-label">Tasa de Confirmación:</span>
              <span class="resumen-value">${(100 - porcentajeSinConfirmar.porcentaje).toFixed(1)}%</span>
            </div>
            <div class="resumen-item">
              <span class="resumen-label">Mayoría por Tipo:</span>
              <span class="resumen-value">${this.obtenerTipoMayoritario(distribucionTipo)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
        this.divEstadisticas.innerHTML = html;
    }
    filtrarAsistentes(asistentes) {
        return asistentes.filter(a => a.estado === "Asistente" || a.estado === "Confirmado");
    }
    calcularPorcentajeSinConfirmar(asistentes) {
        const invitados = asistentes.filter(a => a.estado === "Invitado").length;
        const total = asistentes.length;
        const porcentaje = total > 0 ? (invitados / total) * 100 : 0;
        return {
            invitados,
            porcentaje: parseFloat(porcentaje.toFixed(1))
        };
    }
    calcularDistribucionEstado(asistentes) {
        const total = asistentes.length;
        const distribucion = {};
        asistentes.forEach(asistente => {
            distribucion[asistente.estado] = (distribucion[asistente.estado] || 0) + 1;
        });
        const resultado = {};
        Object.entries(distribucion).forEach(([estado, cantidad]) => {
            resultado[estado] = {
                cantidad,
                porcentaje: parseFloat(((cantidad / total) * 100).toFixed(1))
            };
        });
        return resultado;
    }
    calcularDistribucionTipo(asistentes) {
        const distribucion = {
            "Estudiante": 0,
            "Docente": 0,
            "Familiar": 0,
            "Otro": 0
        };
        asistentes.forEach(asistente => {
            const tipo = asistente.tipo || "Otro";
            distribucion[tipo] = (distribucion[tipo] || 0) + 1;
        });
        return distribucion;
    }
    calcularTasaAsistenciaPorTipo(asistentes, total) {
        const tipos = ["Estudiante", "Docente", "Familiar", "Otro"];
        const resultado = {};
        tipos.forEach(tipo => {
            const delTipo = asistentes.filter(a => a.tipo === tipo);
            const asistentesDelTipo = delTipo.filter(a => a.estado === "Asistente");
            const porcentaje = total > 0 ? (asistentesDelTipo.length / total) * 100 : 0;
            resultado[tipo] = {
                total: delTipo.length,
                asistentes: asistentesDelTipo.length,
                porcentaje: parseFloat(porcentaje.toFixed(1))
            };
        });
        return resultado;
    }
    generarListaAsistentes(asistentes) {
        // Filtrar solo los asistentes con estado "Asistente"
        const asistentesFiltrados = asistentes.filter(a => a.estado === "Asistente");
        if (asistentesFiltrados.length === 0) {
            return '<p class="no-data">No hay asistentes que hayan confirmado su asistencia.</p>';
        }
        const listaHTML = asistentesFiltrados
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
            .map(asistente => `
      <div class="asistente-item">
        <span class="asistente-nombre">${asistente.nombre}</span>
        <span class="asistente-estado estado-${asistente.estado.toLowerCase()}">${asistente.estado}</span>
        <span class="asistente-tipo">${asistente.tipo}</span>
      </div>
    `).join('');
        return `
    <div class="lista-asistentes">
      ${listaHTML}
    </div>
  `;
    }
    generarBarrasProgreso(distribucion) {
        return Object.entries(distribucion)
            .map(([estado, datos]) => `
        <div class="progress-item">
          <div class="progress-label">${estado}</div>
          <div class="progress-bar">
            <div 
              class="progress-fill estado-${estado.toLowerCase()}" 
              style="width: ${datos.porcentaje}%"
            ></div>
          </div>
          <div class="progress-value">${datos.porcentaje}%</div>
        </div>
      `).join('');
    }
    obtenerTipoMayoritario(distribucion) {
        const entradas = Object.entries(distribucion);
        if (entradas.length === 0)
            return "N/A";
        const [tipoMayor, cantidad] = entradas.reduce((max, [tipo, cantidad]) => cantidad > max[1] ? [tipo, cantidad] : max);
        return `${tipoMayor} (${cantidad})`;
    }
    show({ ver }) {
        super.show({ ver });
        if (ver)
            this.mostrarEstadisticas();
    }
}
