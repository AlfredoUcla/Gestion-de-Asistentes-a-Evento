// Cl_mEvento.ts - Versión con base de datos
import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251203-1117";
import Cl_mAsistente from "./Cl_mAsistente.js";
export default class Cl_mEvento {
    constructor() {
        this.tbAsistentes = "tb_EventoAsistentes";
        this.db = new Cl_dcytDb({ aliasCuenta: "THE CODE RANGERS" });
        this.asistentes = [];
    }
    cargar(callback) {
        this.db.listRecords({
            tabla: this.tbAsistentes,
            callback: ({ objects, error }) => {
                if (error) {
                    callback(`Error cargando: ${error}`);
                }
                else {
                    this.llenarAsistentes(objects !== null && objects !== void 0 ? objects : []);
                    callback(false);
                }
            },
        });
    }
    llenarAsistentes(datos) {
        this.asistentes = [];
        datos.forEach((d) => this.asistentes.push(new Cl_mAsistente(d)));
    }
    dtAsistentes() {
        return this.asistentes.map((d) => d.toJSON());
    }
    buscarAsistentePorCorreo(correo) {
        return this.asistentes.find((d) => d.correo === correo.toLowerCase()) || null;
    }
    addAsistente({ dtAsistente, callback }) {
        // Crear instancia para validación
        let nuevoAsistente = new Cl_mAsistente(dtAsistente);
        // 1. Validación de Campos Obligatorios
        if (nuevoAsistente.asistenteOk !== true) {
            callback(nuevoAsistente.asistenteOk);
            return;
        }
        // 2. Validación de Duplicados (correo único)
        if (this.asistentes.find((d) => d.correo === dtAsistente.correo)) {
            callback(`El asistente con correo ${dtAsistente.correo} ya está registrado.`);
            return;
        }
        // 3. Preparar datos para enviar
        const datosParaGuardar = Object.assign(Object.assign({}, dtAsistente), { creadoEl: new Date().toISOString(), alias: dtAsistente.nombre.replace(/\s+/g, '_') });
        // 4. Enviar a la base de datos
        this.db.addRecord({
            tabla: this.tbAsistentes,
            registroAlias: datosParaGuardar.alias,
            object: datosParaGuardar,
            callback: ({ objects: data, error }) => {
                if (!error) {
                    // Actualizar lista local
                    this.llenarAsistentes(data);
                    callback(false);
                }
                else {
                    callback(error);
                }
            },
        });
    }
    editAsistente({ dtAsistente, callback }) {
        // 1. Buscar asistente original por ID (prioridad) o correo
        let asistenteOriginal = this.asistentes.find(a => a.id === dtAsistente.id);
        if (!asistenteOriginal) {
            asistenteOriginal = this.asistentes.find(a => a.correo === dtAsistente.correo);
        }
        if (!asistenteOriginal) {
            callback("Error: No se encuentra el asistente para editar.");
            return;
        }
        // 2. Validar datos nuevos
        let tempValidador = new Cl_mAsistente(dtAsistente);
        if (tempValidador.asistenteOk !== true) {
            callback(tempValidador.asistenteOk);
            return;
        }
        // 3. Verificar duplicado de correo (si cambió el correo)
        if (dtAsistente.correo !== asistenteOriginal.correo) {
            const duplicado = this.asistentes.find(a => a.correo === dtAsistente.correo && a.id !== dtAsistente.id);
            if (duplicado) {
                callback(`Ya existe otro asistente con el correo ${dtAsistente.correo}`);
                return;
            }
        }
        // 4. Actualizar memoria local
        asistenteOriginal.nombre = dtAsistente.nombre;
        asistenteOriginal.telefono = dtAsistente.telefono;
        asistenteOriginal.correo = dtAsistente.correo;
        asistenteOriginal.tipo = dtAsistente.tipo;
        asistenteOriginal.estado = dtAsistente.estado;
        asistenteOriginal.observaciones = dtAsistente.observaciones;
        // 5. Preparar objeto para enviar a BD
        const datosParaEnviar = {
            id: asistenteOriginal.id,
            nombre: asistenteOriginal.nombre,
            telefono: asistenteOriginal.telefono,
            correo: asistenteOriginal.correo.toLowerCase(),
            tipo: asistenteOriginal.tipo,
            estado: asistenteOriginal.estado,
            observaciones: asistenteOriginal.observaciones,
            creadoEl: asistenteOriginal.creadoEl,
            alias: asistenteOriginal.alias || asistenteOriginal.nombre.replace(/\s+/g, '_')
        };
        // 6. Enviar a la nube
        this.db.editRecord({
            tabla: this.tbAsistentes,
            object: datosParaEnviar,
            callback: ({ error }) => {
                if (!error) {
                    // Éxito en BD, recargar lista completa
                    this.cargar((err) => {
                        if (err) {
                            callback(`Edición exitosa, pero error al recargar: ${err}`);
                        }
                        else {
                            callback(false); // Éxito total
                        }
                    });
                }
                else {
                    callback(error);
                }
            },
        });
    }
    deleteAsistente({ correo, callback }) {
        // Buscar asistente por correo
        let asistente = this.buscarAsistentePorCorreo(correo);
        if (!asistente) {
            callback(`No existe un asistente con el correo ${correo}`);
            return;
        }
        // Eliminar de la base de datos
        this.db.deleteRecord({
            tabla: this.tbAsistentes,
            object: { id: asistente.id },
            callback: ({ objects: data, error }) => {
                if (!error) {
                    // Actualizar lista local
                    this.llenarAsistentes(data);
                    callback(false);
                }
                else {
                    callback(error);
                }
            },
        });
    }
    // Método para obtener asistente por correo (compatibilidad con código existente)
    asistente(correo) {
        return this.buscarAsistentePorCorreo(correo);
    }
}
