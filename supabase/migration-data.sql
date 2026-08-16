-- Datos no sensibles tomados de mi_web.sql.
-- Los usuarios y sus contraseñas bcrypt NO se importan aquí.

insert into public.planes (id, nombre, precio, beneficios, destacado) values
(1, 'PLAN BÁSICO', 50000, 'Acceso al gimnasio\nUso de máquinas', false),
(2, 'PLAN PREMIUM', 120000, 'Todo Incluido\nEntrenador Personal', true),
(3, 'PLAN VIP', 80000, 'Clases Grupales\nAcceso a todo el Gimnasio', false)
on conflict (id) do nothing;

insert into public.horario_gimnasio (id, dias, apertura, cierre, telefono) values
(1, 'Lunes a Miércoles', '03:00', '23:00', '3205000000'),
(2, 'Jueves a Viernes', '02:00', '12:00', '3205000000'),
(3, 'Sábados, domingos y festivos', '00:00', '23:59', '3205000000')
on conflict (id) do nothing;
