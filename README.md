# Olympian Fitness — versión para GitHub Pages

Esta carpeta es una versión estática preparada para GitHub Pages.

## Arquitectura

- Frontend: HTML + CSS + JavaScript.
- Backend recomendado: Supabase (Auth + PostgreSQL).
- GitHub Pages: solo publica los archivos estáticos.
- No se guardan números de tarjeta ni CVV en el navegador ni en la base de datos.

## Antes de publicar

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase/schema.sql` en el SQL Editor.
3. Copia `supabase/config.example.js` como `supabase/config.js`.
4. Pon allí la URL de tu proyecto y la clave pública (`anon`).
5. En Supabase > Authentication > URL Configuration agrega la URL de GitHub Pages como Site URL.
6. Sube esta carpeta a un repositorio.
7. Activa GitHub Pages desde Settings > Pages > Deploy from a branch.

## Importante sobre los usuarios del MySQL original

Las contraseñas existentes están guardadas como hashes bcrypt de PHP. No se copian directamente a Supabase Auth desde el frontend.

Para una migración real de usuarios existentes, hay que importar las cuentas desde un entorno con privilegios de administrador o pedirles que restablezcan/creen su contraseña en Supabase Auth.

El archivo `supabase/migration-data.sql` conserva los datos no sensibles principales (roles, planes, horarios) para que puedas reconstruir la información.

## Pagos

El PHP original recibía datos de tarjeta y CVV y los guardaba en la tabla `membresias`. Eso no debe migrarse así. Esta versión solo registra la selección del plan y el método de pago. Para cobros reales hay que integrar un proveedor de pagos y nunca almacenar CVV.
