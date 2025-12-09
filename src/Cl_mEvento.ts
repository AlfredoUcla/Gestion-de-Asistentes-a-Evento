// Cl_mEvento.ts - Versión con base de datos
import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251203-1117";
import Cl_mAsistente, { iAsistente } from "./Cl_mAsistente.js";

interface iResultAsistentes { objects: [iAsistente] | null; error: string | false; }

export default class Cl_mEvento {
  private db: Cl_dcytDb;
  private asistentes: Cl_mAsistente[]; 
  
  readonly tbAsistentes: string = "tb_EventoAsistentes"; 

  constructor() {
    this.db = new Cl_dcytDb({ aliasCuenta: "THE CODE RANGERS" });
    this.asistentes = [];
  }

  cargar(callback: (error: string | false) => void): void {
    this.db.listRecords({
      tabla: this.tbAsistentes,
      callback: ({ objects, error }: iResultAsistentes) => {
        if (error) {
          callback(`Error cargando: ${error}`);
        } else {
          this.llenarAsistentes(objects ?? []);
          callback(false);
        }
      },
    });
  }

  llenarAsistentes(datos: iAsistente[]): void {
    this.asistentes = [];
    datos.forEach((d) => this.asistentes.push(new Cl_mAsistente(d)));
  }

  dtAsistentes(): iAsistente[] { 
    return this.asistentes.map((d) => d.toJSON()); 
  }

  buscarAsistentePorCorreo(correo: string): Cl_mAsistente | null {
    return this.asistentes.find((d) => d.correo === correo.toLowerCase()) || null;
  }

  addAsistente({ dtAsistente, callback }: { 
    dtAsistente: iAsistente; 
    callback: (error: string | false) => void; 
  }): void {
    
    // Crear instancia para validación
    let nuevoAsistente = new Cl_mAsistente(dtAsistente);
    
    // 1. Validación de Campos Obligatorios
    if (nuevoAsistente.asistenteOk !== true) {
      callback(nuevoAsistente.asistenteOk as string);
      return;
    }
    
    // 2. Validación de Duplicados (correo único)
    if (this.asistentes.find((d) => d.correo === dtAsistente.correo)) {
      callback(`El asistente con correo ${dtAsistente.correo} ya está registrado.`);
      return;
    }
    
    // 3. Preparar datos para enviar
    const datosParaGuardar = {
      ...dtAsistente,
      creadoEl: new Date().toISOString(),
      alias: dtAsistente.nombre.replace(/\s+/g, '_')
    };
    
    // 4. Enviar a la base de datos
    this.db.addRecord({
      tabla: this.tbAsistentes,
      registroAlias: datosParaGuardar.alias, 
      object: datosParaGuardar, 
      callback: ({ objects: data, error }: any) => {
        if (!error) {
          // Actualizar lista local
          this.llenarAsistentes(data);
          callback(false);
        } else {
          callback(error);
        }
      },
    });
  }

  editAsistente({ dtAsistente, callback }: { 
    dtAsistente: iAsistente; 
    callback: (error: string | boolean) => void; 
  }): void {
    
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
      callback(tempValidador.asistenteOk as string);
      return;
    }

    // 3. Verificar duplicado de correo (si cambió el correo)
    if (dtAsistente.correo !== asistenteOriginal.correo) {
      const duplicado = this.asistentes.find(a => 
        a.correo === dtAsistente.correo && a.id !== dtAsistente.id
      );
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
      callback: ({ error }: any) => {
        if (!error) {
          // Éxito en BD, recargar lista completa
          this.cargar((err) => {
            if (err) {
              callback(`Edición exitosa, pero error al recargar: ${err}`);
            } else {
              callback(false); // Éxito total
            }
          });
        } else {
          callback(error);
        }
      },
    });
  }

  deleteAsistente({ correo, callback }: { 
    correo: string; 
    callback: (error: string | boolean) => void; 
  }): void {
    
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
      callback: ({ objects: data, error }: any) => {
        if (!error) {
          // Actualizar lista local
          this.llenarAsistentes(data);
          callback(false);
        } else {
          callback(error);
        }
      },
    });
  }

  // Método para obtener asistente por correo (compatibilidad con código existente)
  asistente(correo: string): Cl_mAsistente | null {
    return this.buscarAsistentePorCorreo(correo);
  }

}