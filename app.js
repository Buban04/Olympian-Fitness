// ============================================================
//  app.js — Núcleo compartido por todas las páginas
//  Cliente de Supabase + header/nav + fab por rol + helpers
// ============================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase/config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Página "inicio" de cada rol tras iniciar sesión
export const ROLE_HOME = {
  admin: 'panel_administrador.html',
  entrenador: 'panel_entrenador.html',
  usuario: 'panel.html',
};

export const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));

export const formatCOP = n => '$' + Number(n || 0).toLocaleString('es-CO');

export const formatFecha = f => {
  if (!f) return '—';
  const [y, m, d] = String(f).slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
};

// Perfil del usuario autenticado (tabla public.usuarios + rol)
export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('usuarios')
    .select('id,nombre_completo,correo,telefono,rol_id,activo,fecha_registro,roles(nombre)')
    .eq('id', user.id)
    .maybeSingle();
  if (error) { console.error(error); return null; }
  return data ? { ...data, rol: data.roles?.nombre || 'usuario' } : null;
}

export async function signOut() {
  await supabase.auth.signOut();
  location.href = './index.html';
}

// Redirige si no hay sesión, o si el rol no está permitido en esta página.
// allowedRoles = null → solo exige estar logueado.
export async function requireAuth(allowedRoles = null) {
  const profile = await getProfile();
  if (!profile) {
    location.href = './login.html';
    return null;
  }
  if (allowedRoles && !allowedRoles.includes(profile.rol)) {
    location.href = './' + (ROLE_HOME[profile.rol] || 'index.html');
    return null;
  }
  return profile;
}

const NAV_LINKS = [
  ['horarios.html', 'Horarios'],
  ['entrenadores.html', 'Entrenadores'],
  ['foro.html', 'Foro/comunidad'],
  ['planes.html', 'Planes'],
];

function fabMenuHtml(profile) {
  const nombre = escapeHtml(profile.nombre_completo);
  if (profile.rol === 'admin') {
    return `
      <div class="fab-panel" id="fab-panel">
        <div class="fab-panel-header">Panel Administrador<span>👤 ${nombre}</span></div>
        <a href="index.html"><span class="fab-icon">🏠</span> Inicio</a>
        <a href="panel_administrador.html"><span class="fab-icon">📊</span> Dashboard</a>
        <a href="admin_usuarios.html"><span class="fab-icon">👥</span> Usuarios y roles</a>
        <a href="admin_pagos.html"><span class="fab-icon">💳</span> Pagos y membresías</a>
        <a href="horarios.html"><span class="fab-icon">🕐</span> Horarios</a>
        <a href="entrenadores.html"><span class="fab-icon">👨‍💼</span> Entrenadores</a>
        <a href="planes.html"><span class="fab-icon">🥇</span> Planes</a>
        <a href="foro.html"><span class="fab-icon">💬</span> Foro</a>
        <button class="fab-logout" id="fab-logout"><span class="fab-icon">🚪</span> Cerrar sesión</button>
      </div>
      <button class="fab-btn" id="fab-toggle" title="Panel Admin">⚙️</button>`;
  }
  if (profile.rol === 'entrenador') {
    return `
      <div class="fab-panel" id="fab-panel">
        <div class="fab-panel-header">Panel Entrenador<span>👤 ${nombre}</span></div>
        <a href="index.html"><span class="fab-icon">🏠</span> Inicio</a>
        <a href="panel_entrenador.html"><span class="fab-icon">📋</span> Mi Agenda</a>
        <a href="rutinas_entrenador.html"><span class="fab-icon">🏋️</span> Gestionar Rutinas</a>
        <a href="horarios.html"><span class="fab-icon">🕐</span> Horarios</a>
        <a href="foro.html"><span class="fab-icon">💬</span> Foro</a>
        <button class="fab-logout" id="fab-logout"><span class="fab-icon">🚪</span> Cerrar sesión</button>
      </div>
      <button class="fab-btn" id="fab-toggle" title="Panel Entrenador">🏅</button>`;
  }
  return `
    <div class="fab-panel" id="fab-panel">
      <div class="fab-panel-header">Mi cuenta<span>👤 ${nombre}</span></div>
      <a href="index.html"><span class="fab-icon">🏠</span> Inicio</a>
      <a href="panel.html"><span class="fab-icon">📋</span> Mi panel</a>
      <a href="rutinas.html"><span class="fab-icon">🏋️</span> Mis Rutinas</a>
      <a href="entrenadores.html"><span class="fab-icon">👨‍💼</span> Entrenadores</a>
      <a href="historial.html"><span class="fab-icon">📅</span> Mi Historial</a>
      <a href="planes.html"><span class="fab-icon">🥇</span> Mis Planes</a>
      <a href="foro.html"><span class="fab-icon">💬</span> Foro</a>
      <button class="fab-logout" id="fab-logout"><span class="fab-icon">🚪</span> Cerrar sesión</button>
    </div>
    <button class="fab-btn" id="fab-toggle" title="Mi cuenta">👤</button>`;
}

// Dibuja el header (logo + nav + login) y el fab flotante según el rol.
// activeKey: nombre del archivo actual (ej. 'planes.html') para resaltar el link.
export async function renderHeader(activeKey = '') {
  const headerEl = document.getElementById('site-header');
  const fabEl = document.getElementById('site-fab');
  const profile = await getProfile();

  if (headerEl) {
    const links = NAV_LINKS.map(([href, label]) =>
      `<a href="${href}" class="${href === activeKey ? 'activo' : ''}">${label}</a>`
    ).join('');
    headerEl.innerHTML = `
      <h1><a href="index.html">OLYMPIAN <span class="fitness">FITNESS</span></a></h1>
      <nav>
        ${links}
        ${!profile ? `<a href="login.html" class="login-btn"><img src="usuario.png" alt="login"></a>` : ''}
      </nav>`;
  }

  if (fabEl) {
    fabEl.innerHTML = profile
      ? fabMenuHtml(profile)
      : `<a href="login.html" class="fab-login-btn" title="Iniciar sesión">👤</a>`;

    fabEl.querySelector('#fab-toggle')?.addEventListener('click', () => {
      fabEl.querySelector('#fab-panel')?.classList.toggle('open');
    });
    fabEl.querySelector('#fab-logout')?.addEventListener('click', e => { e.preventDefault(); signOut(); });
    document.addEventListener('click', e => {
      if (!fabEl.contains(e.target)) fabEl.querySelector('#fab-panel')?.classList.remove('open');
    });
  }
  async function obtenerRolUsuario() {
  // 1. Obtener la sesión activa de Supabase
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.log("No hay usuario autenticado");
    return null;
  }

  // 2. Consultar el rol directamente en la base de datos para no usar datos en caché
  const { data: perfil, error: profileError } = await supabase
    .from('usuarios') // O el nombre de tu tabla de perfiles (ej. 'profiles')
    .select('rol')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error("Error al obtener el rol:", profileError.message);
    return null;
  }

  return perfil.rol; // Retorna el rol actual ('admin', 'entrenador', 'cliente', etc.)
}

  return profile;
}
