export type Notice = {
  id: string;
  titulo: string;
  contenido: string;
  estado: "BORRADOR" | "PUBLICADO";
  institucional: boolean;
  updated_at: string;
  publicado_at: string | null;
  puede_editar: boolean;
  destinatarios: {
    curso_id: string | null;
    perfil_id: string | null;
    nombre: string;
  }[];
};
export type NoticeState = { error?: string };
export function canWriteNotice(role: string) {
  return ["DIRECTOR", "SECRETARIA", "DOCENTE"].includes(role);
}
