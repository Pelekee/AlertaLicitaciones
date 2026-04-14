
/* Tipos basados en el Diccionario de Datos OFICIAL de la API
    de Mercado Público (Licitaciones y Órdenes de Compra) */


// TIPOS COMPARTIDOS

export type UnidadMonetaria = 'CLP' | 'CLF' | 'USD' | 'UTM' | 'EUR'

// Estados de licitación (CodigoEstado)
// 5=Publicada, 6=Cerrada, 7=Desierta, 8=Adjudicada, 18=Revocada, 19=Suspendida
export type EstadoLicitacionCodigo = '5' | '6' | '7' | '8' | '18' | '19'

// Tipos de licitación (según documentación oficial)
// Públicas por monto: L1 < 100 UTM | LE 100-1000 | LP 1000-2000 | LQ 2000-5000 | LR > 5000
// Privadas: E2 < 100 | CO 100-1000 | B2 1000-2000 | H2 2000-5000 | I2 > 5000
// Especial: LS = Servicios personales especializados
export type TipoLicitacion =
  | 'L1' | 'LE' | 'LP' | 'LQ' | 'LR'   // Públicas por monto
  | 'E2' | 'CO' | 'B2' | 'H2' | 'I2'   // Privadas
  | 'LS'                                  // Servicios especializados
  | string                                // Otros tipos posibles

// Estados de órdenes de compra (CodigoEstado)
// 4=Enviada, 5=En proceso, 6=Aceptada, 9=Cancelada
// 12=Recepción Conforme, 13=Pendiente Recepcionar
// 14=Recepcionada Parcialmente, 15=Recepción Conforme Incompleta
export type EstadoOrdenCompraCodigo = '4' | '5' | '6' | '9' | '12' | '13' | '14' | '15'

// LICITACIONES — Interfaces

// Datos del organismo comprador (dentro de una licitación)
export interface CompradorLicitacion {
  CodigoOrganismo: string        // Código del organismo público
  NombreOrganismo: string        // Nombre de la institución
  RutUnidad?: string             // RUT de la unidad
  CodigoUnidad?: string          // Código de la unidad de compra
  NombreUnidad?: string          // Nombre de la unidad de compra
  DireccionUnidad?: string
  ComunaUnidad?: string
  RegionUnidad?: string
  RutUsuario?: string
  CodigoUsuario?: string
  NombreUsuario?: string
  CargoUsuario?: string
}

// Fechas relevantes de una licitación
export interface FechasLicitacion {
  FechaCreacion?: string
  FechaCierre?: string
  FechaInicio?: string           // Inicio del foro
  FechaFinal?: string            // Cierre del foro
  FechaPubRespuestas?: string
  FechaActoAperturaTecnica?: string
  FechaActoAperturaEconomica?: string
  FechaPublicacion?: string
  FechaAdjudicacion?: string
  FechaEstimadaAdjudicacion?: string
}

// Información de adjudicación
export interface AdjudicacionLicitacion {
  Tipo?: number                  // 1=Autorización, 2=Resolución, 3=Acuerdo, 4=Decreto, 5=Otros
  Fecha?: string
  Numero?: string
  NumeroOferentes?: number       // Cantidad de proveedores adjudicados
  UrlActa?: string               // URL del acta en mercadopublico.cl
}

// Item/producto dentro de una licitación
export interface ItemLicitacion {
  CodigoEstadoLicitacion?: number
  Correlativo?: number
  CodigoProducto?: number
  CodigoCategoria?: string
  Categoria?: string
  NombreProducto?: string
  Descripcion?: string
  UnidadMedida?: string
  Cantidad?: number
  Adjudicacion?: {
    RutProveedor?: string
    NombreProveedor?: string
    CantidadAdjudicada?: number
    MontoUnitario?: number
  }
}

// Interfaz principal de una Licitación (campos del diccionario oficial)
export interface Licitacion {
  // Identificación
  CodigoExterno: string          // Código único de la licitación (ej: "1509-5-L114")
  Nombre: string                 // Nombre/título de la licitación
  CodigoEstado: EstadoLicitacionCodigo
  Estado?: string                // Estado en texto (ej: "Publicada")
  Descripcion?: string

  // Tipo y clasificación
  CodigoTipo?: number            // 1=Pública, 2=Privada
  Tipo: TipoLicitacion           // L1, LE, LP, etc.
  TipoConvocatoria?: number      // 1=Abierto, 0=Cerrada
  Informada?: number             // 1=Si, 0=No

  // Fechas
  FechaCierre: string            // Fecha límite para ofertar
  DiasCierreLicitacion?: number  // Días restantes para el cierre
  Fechas?: FechasLicitacion

  // Organismo comprador
  Comprador?: CompradorLicitacion

  // Monto y financiamiento
  MontoEstimado?: number
  VisibilidadMonto?: number      // 1=público, 0=oculto
  Moneda?: UnidadMonetaria
  Estimacion?: number            // 1=Presupuesto, 2=Precio Ref., 3=No estimable
  FuenteFinanciamiento?: number

  // Condiciones del contrato
  Modalidad?: number             // Modalidad de pago (1-10)
  TipoPago?: number
  SubContratacion?: number       // 1=Si, 0=No
  TiempoDuracionContrato?: number
  UnidadTiempoDuracionContrato?: number
  EsRenovable?: number           // 1=Si, 0=No
  ExtensionPlazo?: number        // 1=Extiende, 0=No extiende

  // Contactos
  NombreResponsablePago?: string
  EmailResponsablePago?: string
  NombreResponsableContrato?: string
  EmailResponsableContrato?: string
  FonoResponsableContrato?: string

  // Otros
  TomaRazon?: number             // 1=Si requiere toma de razón
  CantidadReclamos?: number
  Obras?: number                 // 2=Si, 1=No (es obra pública)
  EsBaseTipo?: number            // 1=Si, 0=No

  // Adjudicación (disponible cuando CodigoEstado = 8)
  Adjudicacion?: AdjudicacionLicitacion

  // Items/productos
  Items?: {
    Cantidad: number
    Listado: ItemLicitacion[]
  }
}

// Respuesta completa del endpoint de licitaciones
export interface RespuestaLicitaciones {
  Cantidad: number
  FechaCreacion: string
  Version: string
  Listado: Licitacion[]
}

export interface FiltrosLicitacion {
  fecha?: string                 // Formato ddmmaaaa (ej: "04042026")
  estado?: string                // "activas", "publicada", "adjudicada", etc.
  codigo?: string                // Código específico de una licitación
  CodigoOrganismo?: string
  CodigoProveedor?: string
}

// ÓRDENES DE COMPRA — Interfaces

// Datos del comprador en una Orden de Compra
export interface CompradorOrdenCompra {
  CodigoOrganismo: string
  NombreOrganismo: string
  RutUnidad?: string
  CodigoUnidad?: string
  NombreUnidad?: string
  Actividad?: string
  DireccionUnidad?: string
  ComunaUnidad?: string
  RegionUnidad?: string
  Pais?: string
  NombreContacto?: string
  CargoContacto?: string
  FonoContacto?: string
  MailContacto?: string
}

// Datos del proveedor en una Orden de Compra
export interface ProveedorOrdenCompra {
  Codigo: string
  Nombre: string
  Actividad?: string
  CodigoSucursal?: string
  NombreSucursal?: string
  RutSucursal?: string           // RUT del proveedor
  Direccion?: string
  Comuna?: string
  Region?: string
  Pais?: string
  NombreContacto?: string
  CargoContacto?: string
  FonoContacto?: string
  MailContacto?: string
}

// Item dentro de una Orden de Compra
export interface ItemOrdenCompra {
  Correlativo: number
  CodigoCategoria?: number
  Categoria?: string
  CodigoProducto?: number
  EspecificacionComprador?: string
  EspecificacionProveedor?: string
  Cantidad: number
  Moneda?: string
  PrecioNeto: number
  TotalCargos?: number
  TotalDescuentos?: number
  TotalImpuestos?: number
  Total: number
}

// Fechas relevantes de una Orden de Compra
export interface FechasOrdenCompra {
  FechaCreacion?: string
  FechaEnvio?: string
  FechaAceptacion?: string
  FechaCancelacion?: string
  FechaUltimaModificacion?: string
}

// Interfaz principal de una Orden de Compra
export interface OrdenCompra {
  Codigo: string                 // Código único (ej: "2097-241-SE14")
  Nombre: string
  CodigoEstado: EstadoOrdenCompraCodigo
  CodigoLicitacion?: string      // Licitación asociada (si existe)
  Descripcion?: string
  CodigoTipo?: string
  Tipo?: string                  // Abreviación: OC, D1, C1, CM, etc.
  TipoMoneda?: UnidadMonetaria
  CodigoEstadoProveedor?: number
  EstadoProveedor?: string

  Fechas?: FechasOrdenCompra

  TieneItems?: string            // "1"=Si, "0"=No
  PromedioCalificacion?: number
  CantidadEvaluacion?: number

  // Valores económicos
  Descuentos?: number
  Cargos?: number
  TotalNeto?: number
  PorcentajeIva?: number
  Impuestos?: number
  Total?: number

  Financiamiento?: string
  Pais?: string

  // Tipo despacho: 7,9,12,14,20,21,22
  TipoDespacho?: number
  // Forma pago: 1=15días, 2=30días, 39=Otra, 46=50días, 47=60días
  FormaPago?: number

  Comprador?: CompradorOrdenCompra
  Proveedor?: ProveedorOrdenCompra

  Items?: {
    Cantidad: number
    Listado: ItemOrdenCompra[]
  }
}

// Respuesta completa del endpoint de órdenes de compra
export interface RespuestaOrdenesCompra {
  Cantidad: number
  FechaCreacion: string
  Version: string
  Listado: OrdenCompra[]
}

// Filtros para consultar órdenes de compra
export interface FiltrosOrdenCompra {
  fecha?: string
  estado?: string                // "todos", "aceptada", "cancelada", etc.
  codigo?: string
  CodigoOrganismo?: string
  CodigoProveedor?: string
}

// Resultado del algoritmo de score de oportunidad  // ← nuevo
export interface ScoreResult {
  puntaje: number
  nivel:   'Alta' | 'Media' | 'Baja'
  color:   'green' | 'yellow' | 'red'
  factores: {
    diasRestantes: number
    monto:         number
    estado:        number
    tipo:          number
  }
}