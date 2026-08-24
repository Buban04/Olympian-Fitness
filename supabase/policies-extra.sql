-- ============================================================
--  policies-extra.sql — Políticas RLS adicionales
--  Ejecutar en el SQL Editor de Supabase DESPUÉS de schema.sql
--  Necesarias para que el panel de administrador y el panel de
--  entrenador (versión GitHub Pages) puedan crear/editar datos.
-- ============================================================

-- ---- MEMBRESÍAS: el admin puede actualizar y eliminar ----
create policy "admin actualiza membresias" on public.membresias
for update using (public.mi_rol() = 'admin');

create policy "admin elimina membresias" on public.membresias
for delete using (public.mi_rol() = 'admin');

-- ---- ENTRENADORES: el admin puede crear y editar perfiles ----
create policy "admin crea entrenadores" on public.entrenadores
for insert with check (public.mi_rol() = 'admin');

create policy "admin actualiza entrenadores" on public.entrenadores
for update using (public.mi_rol() = 'admin');

-- ---- RUTINAS: el entrenador dueño puede crear/editar/eliminar ----
create policy "entrenador crea rutinas" on public.rutinas
for insert with check (
  exists (select 1 from public.entrenadores e where e.id = entrenador_id and e.usuario_id = auth.uid())
  or public.mi_rol() = 'admin'
);

create policy "entrenador actualiza rutinas" on public.rutinas
for update using (
  exists (select 1 from public.entrenadores e where e.id = entrenador_id and e.usuario_id = auth.uid())
  or public.mi_rol() = 'admin'
);

create policy "entrenador elimina rutinas" on public.rutinas
for delete using (
  exists (select 1 from public.entrenadores e where e.id = entrenador_id and e.usuario_id = auth.uid())
  or public.mi_rol() = 'admin'
);

-- ---- RUTINA_EJERCICIOS: el entrenador dueño de la rutina puede gestionar ----
create policy "entrenador crea ejercicios" on public.rutina_ejercicios
for insert with check (
  exists (
    select 1 from public.rutinas r join public.entrenadores e on e.id = r.entrenador_id
    where r.id = rutina_id and (e.usuario_id = auth.uid() or public.mi_rol() = 'admin')
  )
);

create policy "entrenador elimina ejercicios" on public.rutina_ejercicios
for delete using (
  exists (
    select 1 from public.rutinas r join public.entrenadores e on e.id = r.entrenador_id
    where r.id = rutina_id and (e.usuario_id = auth.uid() or public.mi_rol() = 'admin')
  )
);

-- ---- CITAS: el entrenador ve/gestiona su propia agenda, el cliente ve las suyas ----
create policy "citas visibles al entrenador" on public.citas
for select using (
  exists (select 1 from public.entrenadores e where e.id = entrenador_id and e.usuario_id = auth.uid())
  or cliente_id = auth.uid()
  or public.mi_rol() = 'admin'
);

create policy "entrenador actualiza sus citas" on public.citas
for update using (
  exists (select 1 from public.entrenadores e where e.id = entrenador_id and e.usuario_id = auth.uid())
  or public.mi_rol() = 'admin'
);

create policy "admin crea citas" on public.citas
for insert with check (public.mi_rol() = 'admin');

-- ---- USUARIOS: el admin puede ver/editar la lista completa (ya existe una
--      política base en schema.sql; esta la refuerza para instalaciones
--      donde no se haya creado todavía) ----
drop policy if exists "usuarios leen su perfil" on public.usuarios;
create policy "usuarios leen su perfil" on public.usuarios
for select using (id = auth.uid() or public.mi_rol() = 'admin');

drop policy if exists "usuario actualiza su perfil" on public.usuarios;
create policy "usuario actualiza su perfil" on public.usuarios
for update using (id = auth.uid() or public.mi_rol() = 'admin');
