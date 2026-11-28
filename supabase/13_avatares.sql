-- Ejecutar una vez en SQL Editor. Depósito privado; cada usuario solo accede a su imagen.
begin;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('avatares','avatares',false,500000,array['image/jpeg']) on conflict(id) do update set public=false,file_size_limit=500000,allowed_mime_types=array['image/jpeg'];
drop policy if exists avatar_own_select on storage.objects;
create policy avatar_own_select on storage.objects for select to authenticated using(bucket_id='avatares' and name=(select auth.uid())::text||'/avatar.jpg');
drop policy if exists avatar_own_insert on storage.objects;
create policy avatar_own_insert on storage.objects for insert to authenticated with check(bucket_id='avatares' and name=(select auth.uid())::text||'/avatar.jpg');
drop policy if exists avatar_own_update on storage.objects;
create policy avatar_own_update on storage.objects for update to authenticated using(bucket_id='avatares' and name=(select auth.uid())::text||'/avatar.jpg') with check(bucket_id='avatares' and name=(select auth.uid())::text||'/avatar.jpg');
commit;
begin;
create or replace function public.desactivar_docente(p_id uuid) returns void language plpgsql security invoker set search_path='' as $$
declare persona uuid; cuenta record;
begin
 if not private.admin() then raise exception 'Sin permiso' using errcode='42501'; end if;
 select persona_id into persona from public.docentes where id=p_id for update;
 if persona is null then raise exception 'Docente no encontrado'; end if;
 update public.docentes set activo=false where id=p_id;
 for cuenta in select id from public.perfiles where persona_id=persona and rol='DOCENTE' loop
  perform public.administrar_cuenta(cuenta.id,null,'DOCENTE',false,false);
 end loop;
end $$;
revoke all on function public.desactivar_docente(uuid) from public,anon;
grant execute on function public.desactivar_docente(uuid) to authenticated;
grant delete on public.estudiante_tutor to authenticated;
drop policy if exists estudiante_tutor_desvincular_admin on public.estudiante_tutor;
create policy estudiante_tutor_desvincular_admin on public.estudiante_tutor for delete to authenticated using(private.admin());
commit;
