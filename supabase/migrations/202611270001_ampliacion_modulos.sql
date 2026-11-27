-- IberAcad · Ampliación de módulos (informes guardados, eliminación de borradores
-- y gestión de cuentas no administrativas por Secretaría).
-- Se puede ejecutar UNA o VARIAS veces: no borra datos ni duplica objetos.
-- Es compatible con bases que ya tengan la actualización 0.10 de IberAcadX.
-- No archiva ni modifica comunicados.
begin;

-- 1. Informes guardados: cada cuenta guarda y administra sus propios filtros.
create table if not exists public.reportes_guardados (
  id uuid primary key default gen_random_uuid(),
  propietario_id uuid not null references public.perfiles(id),
  nombre text not null check (length(btrim(nombre)) between 1 and 150),
  parametros text not null check (length(parametros) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.reportes_guardados enable row level security;
grant select, insert, update, delete on public.reportes_guardados to authenticated;
drop policy if exists reportes_select on public.reportes_guardados;
drop policy if exists reportes_write on public.reportes_guardados;
create policy reportes_select on public.reportes_guardados for select to authenticated
  using (propietario_id = auth.uid());
create policy reportes_write on public.reportes_guardados for all to authenticated
  using (propietario_id = auth.uid() and private.rol() is not null)
  with check (propietario_id = auth.uid() and private.rol() is not null);

-- 2. Eliminar un registro académico en BORRADOR (calificación o asistencia).
--    Se ejecuta con los permisos de quien llama (RLS) y exige retirar antes la publicación.
create or replace function public.eliminar_registro_academico(p_tipo text, p_id uuid)
returns void language plpgsql security invoker set search_path = '' as $$
declare
  c public.calificaciones_trimestrales;
  a public.asistencias;
  j public.jornadas_asistencia;
begin
  if p_tipo = 'calificaciones' then
    select * into c from public.calificaciones_trimestrales where id = p_id for update;
    if not found or not private.editar_asignacion(c.asignacion_docente_id) then
      raise exception 'Sin permiso' using errcode = '42501';
    end if;
    if c.estado <> 'BORRADOR' then raise exception 'Retira la publicación'; end if;
    delete from public.notas_criterios
      where matricula_id = c.matricula_id
        and criterio_id in (
          select id from public.criterios_evaluacion
          where asignacion_docente_id = c.asignacion_docente_id
            and trimestre_id = c.trimestre_id);
    delete from public.calificaciones_trimestrales where id = c.id;
  elsif p_tipo = 'asistencia' then
    select * into a from public.asistencias where id = p_id;
    if not found or not private.editar_jornada(a.jornada_id) then
      raise exception 'Sin permiso' using errcode = '42501';
    end if;
    select * into j from public.jornadas_asistencia where id = a.jornada_id for update;
    if j.estado <> 'BORRADOR' then raise exception 'Retira la publicación'; end if;
    delete from public.asistencias where id = p_id;
  else
    raise exception 'Tipo inválido';
  end if;
end $$;
revoke all on function public.eliminar_registro_academico(text, uuid) from public, anon;
grant execute on function public.eliminar_registro_academico(text, uuid) to authenticated;

-- 3. Secretaría administra cuentas de estudiantes, docentes y familias.
--    Nunca ve, crea ni modifica cuentas de Dirección o Secretaría, ni puede
--    asignar esos roles. Las políticas de Dirección no cambian.
drop policy if exists perfiles_secretaria_select on public.perfiles;
drop policy if exists perfiles_secretaria_insert on public.perfiles;
drop policy if exists perfiles_secretaria_update on public.perfiles;
create policy perfiles_secretaria_select on public.perfiles for select to authenticated
  using (private.admin() and rol in ('ESTUDIANTE','DOCENTE','PADRE'));
create policy perfiles_secretaria_insert on public.perfiles for insert to authenticated
  with check (private.admin() and rol in ('ESTUDIANTE','DOCENTE','PADRE'));
create policy perfiles_secretaria_update on public.perfiles for update to authenticated
  using (private.admin() and rol in ('ESTUDIANTE','DOCENTE','PADRE'))
  with check (private.admin() and rol in ('ESTUDIANTE','DOCENTE','PADRE'));

commit;
