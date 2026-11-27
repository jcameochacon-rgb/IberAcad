// Datos públicos de las fuentes facilitadas por el usuario, consultadas el 2026-10-09.
export const school = {
  rue: "40730423",
  address: "Plaza 16 de Febrero s/n",
  phone: "72576322",
  historyUrl:
    "https://historiadelaunidadedicayivaiberdrola.blogspot.com/2023/09/historia-de-la-unidad-educativa.html",
  directoryUrl:
    "https://unidadeducativa.net/cerca-de-mi-ubicacion/unidades-educativas/el-alto/fiscales/iberdrola-a/RUE/40730423/",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Unidad+Educativa+Iberdrola+A+Plaza+16+de+Febrero+El+Alto+Bolivia",
  /** Mapa incrustado de Google Maps (no requiere clave). */
  mapEmbedUrl:
    "https://www.google.com/maps?q=Unidad+Educativa+Iberdrola+A+Plaza+16+de+Febrero+El+Alto+Bolivia&hl=es&z=16&output=embed",
  /** Correo directo de comunicación. Se muestra en la portada solo si tiene valor. */
  email: "unidadeducativaiberdrolaa@gmail.com",
  /** Direcciones completas (https://...) de las redes oficiales. Las vacías no se muestran. */
  social: {
    Facebook: "https://www.facebook.com/share/1Crjpxf1SL/",
    WhatsApp: "https://wa.me/59172576322",
  } as Record<string, string>,
};
export function socialLinks(): [string, string][] {
  return Object.entries(school.social).filter(([, url]) =>
    /^https:\/\//.test(url.trim()),
  ) as [string, string][];
}
