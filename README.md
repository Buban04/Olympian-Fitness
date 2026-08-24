# Olympian Fitness — versión estática (GitHub Pages + Supabase)

Este sitio es 100% HTML/CSS/JS estático (sin PHP, sin backend propio), pensado
para publicarse directamente con **GitHub Pages**. Toda la base de datos y la
autenticación las maneja **Supabase**.

## Estructura

Cada página del sitio original en PHP ahora es un archivo `.html` independiente:

| Página original      | Archivo nuevo              |
|-----------------------|-----------------------------|
| Index.php             | `index.html`                |
| login.php / Login_*.php | `login.html` (único login para los 3 roles) |
| registro.php          | `registro.html`             |
| planes.php            | `planes.html`               |
| horarios.php          | `horarios.html`              |
| entrenadores.php      | `entrenadores.html`         |
| foro.php               | `foro.html`                 |
| rutinas.php            | `rutinas.html`              |
| historial_asistencias.php | `historial.html`        |
| panel_cliente.php / panel_usuario.php | `panel.html`  |
| panel_entrenador.php  | `panel_entrenador.html`     |
| panel_rutinas_entrenador.php | `rutinas_entrenador.html` |
| panel_administrador.php | `panel_administrador.html` |
| admin_usuarios.php    | `admin_usuarios.html`       |
| admin_pagos.php       | `admin_pagos.html`          |

`app.js` reemplaza a `config.php`/`fab.php`: ahí vive el cliente de Supabase,
el encabezado con navegación y el botón flotante (fab) con el menú según el
rol de la persona logueada — igual que en el sitio original.

`style.css` es el CSS original completo, más un bloque al final con los
estilos que faltaban en la versión que ya tenías en GitHub (fab, tablas de
administrador, modal de pago, tarjetas de rutinas, alertas, etc.)

## Pasos para publicarlo

1. **Base de datos**: en el SQL Editor de tu proyecto de Supabase, ejecuta
   en este orden:
   1. `supabase/schema.sql` (si ya lo ejecutaste antes, puedes saltarlo)
   2. `supabase/policies-extra.sql` — **nuevo**, agrega los permisos que
      faltaban para que el administrador pueda gestionar pagos/usuarios y el
      entrenador pueda crear/editar rutinas y ver su agenda.
2. **Credenciales**: revisa que `supabase/config.js` tenga la URL y la
   `anon key` correctas de tu proyecto (ya están puestas las que traía tu
   repo).
3. Sube todos estos archivos a la raíz de tu repositorio de GitHub (o a la
   carpeta que uses para Pages), reemplazando los anteriores.
4. En GitHub → Settings → Pages, confirma que la fuente sea la rama/carpeta
   donde subiste estos archivos.
5. Crea al menos un usuario **administrador** manualmente: regístrate desde
   `registro.html` (queda como cliente) y luego, en Supabase → Table editor
   → tabla `usuarios`, cambia su `rol_id` a `1` (admin). Desde ahí ya puedes
   usar `admin_usuarios.html` para promover a los demás.

## Limitaciones a tener en cuenta

- Por ser un sitio estático, **no se pueden crear usuarios con contraseña
  desde el panel de administrador** (eso requeriría exponer una clave
  privilegiada de Supabase, lo cual no es seguro en un sitio público). Los
  usuarios nuevos deben registrarse ellos mismos desde `registro.html`; el
  administrador solo cambia su rol y estado.
- El flujo de pago sigue siendo **simulado**, igual que en el proyecto
  original: no se procesa ningún cobro real ni se guarda el número completo
  de tarjeta ni el CVV.
