// Estados posibles de una licitación (como número, igual que la API)
export type EstadoLicitacion = 5 | 6 | 7 | 8 | 18 | 19
 
// Texto legible para mostrar en pantalla según el código de estado
export const ESTADO_TEXTO: Record<EstadoLicitacion, string> = {
  5:  'Publicada',
  6:  'Cerrada',
  7:  'Desierta',
  8:  'Adjudicada',
  18: 'Revocada',
  19: 'Suspendida',
}
 
// Tipos de licitación con su descripción legible
export const TIPO_TEXTO: Record<string, string> = {
  L1: 'Menor a 100 UTM',
  LE: '100 - 1.000 UTM',
  LP: '1.000 - 2.000 UTM',
  LQ: '2.000 - 5.000 UTM',
  LR: 'Mayor a 5.000 UTM',
  LS: 'Servicios especializados',
}
 
export interface LicitacionBasica {
  CodigoExterno:         string
  Nombre:                string
  CodigoEstado:          EstadoLicitacion
  FechaCierre:           string
  Tipo?:                 string
  MontoEstimado?:        number
  Moneda?:               string
  DiasCierreLicitacion?: number
  Comprador?: {
    CodigoOrganismo: string
    NombreOrganismo: string
    RegionUnidad?:   string
    ComunaUnidad?:   string
  }
}
 

/* Respuesta del endpoint GET /api/licitaciones */
export interface RespuestaLicitaciones {
  ok:            boolean
  cantidad:      number
  fechaConsulta: string
  licitaciones:  LicitacionBasica[]
}

export interface LicitacionDetalle extends LicitacionBasica {
  Descripcion?: string
  Estado?:         string
  SubContratacion?:    number
  TiempoDuracionContrato?: number
  EsRenovable?:         number
  NombreResponsableContrato?: string
  EmailResponsableContrato?: string
  FonoResponsableContrato?: string
  Fechas?: {
    FechaCreacion: string
    FechaPublicacion: string
    FechaAdjudicacion?: string
    FechaEstimadaAdjudicacion?: string
    FechaActoAperturaTecnica?: string
    FechaActoAperturaEconomica?: string
  }
  Items?: {
    Cantidad: number
    Listado: ItemLicitacion []
  }
}
  export interface ItemLicitacion {
    Correlativo?: number
    NombreProducto?: string
    Descripcion?: string
    Categoria?: string
    UnidadMedida?: string
    Cantidad?: number
}
  export interface RespuestaDetalle {
    ok: boolean
    licitacion: LicitacionDetalle
  }