import { Controller, Get } from '@nestjs/common';

@Controller()
export class HomeController {
  @Get()
  getHome() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API - Plataforma de Autos Usados</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-primary: #0a0a0a;
      --bg-secondary: #141414;
      --bg-card: #1a1a1a;
      --bg-card-hover: #222222;
      --border: #2a2a2a;
      --text-primary: #f5f5f5;
      --text-secondary: #9ca3af;
      --text-muted: #6b7280;
      --accent: #f97316;
      --accent-hover: #fb923c;
      --accent-glow: rgba(249, 115, 22, 0.3);
      --accent-subtle: rgba(249, 115, 22, 0.1);
      --success: #22c55e;
      --warning: #eab308;
      --error: #ef4444;
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    }

    [data-theme="light"] {
      --bg-primary: #f8f9fa;
      --bg-secondary: #f1f3f5;
      --bg-card: #ffffff;
      --bg-card-hover: #f9fafb;
      --border: #e5e7eb;
      --text-primary: #111827;
      --text-secondary: #4b5563;
      --text-muted: #9ca3af;
      --accent: #f97316;
      --accent-hover: #ea580c;
      --accent-glow: rgba(249, 115, 22, 0.2);
      --accent-subtle: rgba(249, 115, 22, 0.08);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-sans);
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      min-height: 100vh;
    }

    /* Sidebar */
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 260px;
      height: 100vh;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border);
      padding: 24px 0;
      overflow-y: auto;
      z-index: 100;
    }

    .sidebar-header {
      padding: 0 24px 24px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 16px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--accent), #ea580c);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 0 20px var(--accent-glow);
    }

    .logo-text {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.02em;
    }

    .logo-text span {
      display: block;
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 400;
    }

    .sidebar-nav {
      padding: 0 12px;
    }

    .nav-section {
      margin-bottom: 24px;
    }

    .nav-section-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      padding: 0 12px;
      margin-bottom: 8px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .nav-link:hover {
      background: var(--bg-card);
      color: var(--text-primary);
    }

    .nav-link.active {
      background: var(--accent-subtle);
      color: var(--accent);
    }

    .nav-link-icon {
      width: 18px;
      text-align: center;
      font-size: 14px;
    }

    /* Main Content */
    .main {
      margin-left: 260px;
      padding: 32px 48px;
      max-width: 1200px;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }

    .header-title {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, var(--text-primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .header-subtitle {
      color: var(--text-secondary);
      margin-top: 4px;
      font-size: 14px;
    }

    /* Theme Toggle */
    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .theme-toggle:hover {
      background: var(--bg-card-hover);
      border-color: var(--accent);
    }

    /* Content Cards */
    .section {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-title-icon {
      color: var(--accent);
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 13px;
    }

    th {
      background: var(--bg-secondary);
      color: var(--text-secondary);
      font-weight: 500;
      text-align: left;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      color: var(--text-secondary);
    }

    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--bg-card-hover); }

    /* Method Badges */
    .method {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      font-family: var(--font-mono);
      letter-spacing: 0.02em;
    }

    .GET { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
    .POST { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
    .PUT { background: rgba(234, 179, 8, 0.15); color: #eab308; }
    .DELETE { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
    .PATCH { background: rgba(168, 85, 247, 0.15); color: #a855f7; }

    /* Auth Badges */
    .auth-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
    }

    .auth-yes {
      background: rgba(34, 197, 94, 0.15);
      color: #22c55e;
    }

    .auth-no {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }

    /* Code */
    code {
      font-family: var(--font-mono);
      background: var(--bg-secondary);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 12px;
      color: var(--accent);
    }

    pre {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
      margin: 12px 0;
      font-family: var(--font-mono);
      font-size: 12px;
      line-height: 1.7;
      color: var(--text-primary);
    }

    pre .comment { color: var(--text-muted); }
    pre .string { color: #22c55e; }
    pre .number { color: #f97316; }
    pre .keyword { color: #a855f7; }

    /* Info Boxes */
    .info-box {
      background: var(--accent-subtle);
      border: 1px solid var(--accent);
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
      font-size: 13px;
    }

    .info-box-title {
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Footer */
    .footer {
      text-align: center;
      padding: 40px 0;
      color: var(--text-muted);
      font-size: 12px;
      border-top: 1px solid var(--border);
      margin-top: 48px;
    }

    .footer a {
      color: var(--accent);
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main { margin-left: 0; padding: 20px; }
    }
  </style>
</head>
<body>
  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">🚗</div>
        <div class="logo-text">
          Autos API
          <span>Plataforma Web II</span>
        </div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">
        <div class="nav-section-title">Principal</div>
        <a href="#introduccion" class="nav-link"><span class="nav-link-icon">📋</span> Introducción</a>
        <a href="#autenticacion" class="nav-link"><span class="nav-link-icon">🔐</span> Autenticación</a>
        <a href="#vehiculos" class="nav-link"><span class="nav-link-icon">🚗</span> Vehículos</a>
        <a href="#mensajes" class="nav-link"><span class="nav-link-icon">💬</span> Mensajes</a>
        <a href="#favoritos" class="nav-link"><span class="nav-link-icon">❤️</span> Favoritos</a>
      </div>
      <div class="nav-section">
        <div class="nav-section-title">Sistema</div>
        <a href="#preferencias" class="nav-link"><span class="nav-link-icon">⚙️</span> Preferencias</a>
        <a href="#ia" class="nav-link"><span class="nav-link-icon">🤖</span> Análisis IA</a>
        <a href="#upload" class="nav-link"><span class="nav-link-icon">📤</span> Upload</a>
      </div>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="main">
    <header class="header">
      <div>
        <h1 class="header-title">API REST</h1>
        <p class="header-subtitle">Plataforma de Compra y Venta de Autos Usados</p>
      </div>
      <button class="theme-toggle" onclick="toggleTheme()">
        <span>🌙</span> <span id="theme-text">Modo Claro</span>
      </button>
    </header>

    <!-- Introducción -->
    <section id="introduccion" class="section">
      <h2 class="section-title"><span class="section-title-icon">📋</span> Introducción</h2>
      <p style="color: var(--text-secondary); margin-bottom: 16px;">
        API REST desarrollada con <strong>NestJS</strong> para la gestión de compra y venta de vehículos usados. 
        Incluye autenticación JWT, gestión de vehículos, mensajes entre usuarios, favoritos y análisis de IA.
      </p>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
        <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; border: 1px solid var(--border);">
          <div style="font-size: 24px; font-weight: 700; color: var(--accent);">Web II</div>
          <div style="font-size: 12px; color: var(--text-muted);">Materia</div>
        </div>
        <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; border: 1px solid var(--border);">
          <div style="font-size: 24px; font-weight: 700; color: var(--accent);">IUA</div>
          <div style="font-size: 12px; color: var(--text-muted);">Institución</div>
        </div>
        <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; border: 1px solid var(--border);">
          <div style="font-size: 24px; font-weight: 700; color: var(--accent);">7</div>
          <div style="font-size: 12px; color: var(--text-muted);">Endpoints</div>
        </div>
      </div>
    </section>

    <!-- Autenticación -->
    <section id="autenticacion" class="section">
      <h2 class="section-title"><span class="section-title-icon">🔐</span> Autenticación</h2>
      <table>
        <thead>
          <tr><th>Método</th><th>Ruta</th><th>Descripción</th><th>Auth</th></tr>
        </thead>
        <tbody>
          <tr><td><span class="method POST">POST</span></td><td><code>/auth/register</code></td><td>Registrar nuevo usuario</td><td><span class="auth-badge auth-no">No</span></td></tr>
          <tr><td><span class="method POST">POST</span></td><td><code>/auth/login</code></td><td>Iniciar sesión</td><td><span class="auth-badge auth-no">No</span></td></tr>
          <tr><td><span class="method POST">POST</span></td><td><code>/auth/logout</code></td><td>Cerrar sesión</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
          <tr><td><span class="method GET">GET</span></td><td><code>/auth/me</code></td><td>Obtener usuario</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
        </tbody>
      </table>

      <h3 style="margin: 24px 0 12px; font-size: 14px;">Ejemplo: Registro</h3>
      <pre><span class="comment"># Registrar usuario</span>
<span class="keyword">curl</span> -X POST http://localhost:3000/auth/register \\
  -H <span class="string">"Content-Type: application/json"</span> \\
  -d <span class="string">'{
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "password": "Password123",
    "role": "BUYER"
  }'</span></pre>

      <div class="info-box">
        <div class="info-box-title">📝 Campos requeridos</div>
        <table style="margin: 8px 0 0;">
          <tr><td style="padding: 4px 0;"><code>name</code></td><td style="padding: 4px 0;">string (2-100 caracteres)</td><td style="padding: 4px 0;">Sí</td></tr>
          <tr><td style="padding: 4px 0;"><code>email</code></td><td style="padding: 4px 0;">string (email válido)</td><td style="padding: 4px 0;">Sí</td></tr>
          <tr><td style="padding: 4px 0;"><code>password</code></td><td style="padding: 4px 0;">string (mín 8 caracteres)</td><td style="padding: 4px 0;">Sí</td></tr>
          <tr><td style="padding: 4px 0;"><code>role</code></td><td style="padding: 4px 0;">BUYER | SELLER | ADMIN</td><td style="padding: 4px 0;">No</td></tr>
        </table>
      </div>

      <h3 style="margin: 24px 0 12px; font-size: 14px;">Ejemplo: Login</h3>
      <pre><span class="keyword">curl</span> -X POST http://localhost:3000/auth/login \\
  -H <span class="string">"Content-Type: application/json"</span> \\
  -d <span class="string">'{"email": "juan@email.com", "password": "Password123"}'</span></pre>

      <pre style="margin-top: 12px;">{
  <span class="string">"message"</span>: <span class="string">"Login exitoso"</span>,
  <span class="string">"token"</span>: <span class="string">"eyJhbGciOiJIUzI1NiIs..."</span>,
  <span class="string">"user"</span>: {
    <span class="string">"id"</span>: <span class="string">"uuid"</span>,
    <span class="string">"name"</span>: <span class="string">"Juan Pérez"</span>,
    <span class="string">"email"</span>: <span class="string">"juan@email.com"</span>,
    <span class="string">"role"</span>: <span class="string">"BUYER"</span>
  }
}</pre>
    </section>

    <!-- Vehículos -->
    <section id="vehiculos" class="section">
      <h2 class="section-title"><span class="section-title-icon">🚗</span> Vehículos</h2>
      <table>
        <thead>
          <tr><th>Método</th><th>Ruta</th><th>Descripción</th><th>Auth</th></tr>
        </thead>
        <tbody>
          <tr><td><span class="method POST">POST</span></td><td><code>/vehicles</code></td><td>Crear vehículo</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
          <tr><td><span class="method GET">GET</span></td><td><code>/vehicles/filters</code></td><td>Listar/Buscar</td><td><span class="auth-badge auth-no">No</span></td></tr>
          <tr><td><span class="method GET">GET</span></td><td><code>/vehicles/:id</code></td><td>Ver por ID</td><td><span class="auth-badge auth-no">No</span></td></tr>
          <tr><td><span class="method PUT">PUT</span></td><td><code>/vehicles/:id</code></td><td>Actualizar</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
          <tr><td><span class="method DELETE">DELETE</span></td><td><code>/vehicles/:id</code></td><td>Eliminar</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
        </tbody>
      </table>

      <h3 style="margin: 24px 0 12px; font-size: 14px;">Ejemplo: Crear Vehículo</h3>
      <pre><span class="keyword">curl</span> -X POST http://localhost:3000/vehicles \\
  -H <span class="string">"Content-Type: application/json"</span> \\
  -H <span class="string">"Authorization: Bearer &lt;TOKEN&gt;"</span> \\
  -d <span class="string">'{
    "vehicleType": "SEDAN",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2022,
    "price": 24000
  }'</span></pre>

      <h3 style="margin: 24px 0 12px; font-size: 14px;">Filtros disponibles</h3>
      <table>
        <tr><td><code>brand</code></td><td>Marca</td></tr>
        <tr><td><code>priceMin</code> / <code>priceMax</code></td><td>Rango de precio</td></tr>
        <tr><td><code>yearMin</code> / <code>yearMax</code></td><td>Rango de año</td></tr>
        <tr><td><code>vehicleType</code></td><td>SEDAN, SUV, TRUCK...</td></tr>
        <tr><td><code>fuelType</code></td><td>GASOLINE, DIESEL, ELECTRIC...</td></tr>
        <tr><td><code>province</code>, <code>city</code></td><td>Ubicación</td></tr>
      </table>

      <h3 style="margin: 24px 0 12px; font-size: 14px;">Buscar vehículos</h3>
      <pre><span class="keyword">curl</span> -X GET <span class="string">"http://localhost:3000/vehicles/filters?brand=Toyota&amp;priceMax=30000"</span></pre>
    </section>

    <!-- Mensajes -->
    <section id="mensajes" class="section">
      <h2 class="section-title"><span class="section-title-icon">💬</span> Mensajes</h2>
      <table>
        <thead>
          <tr><th>Método</th><th>Ruta</th><th>Descripción</th><th>Auth</th></tr>
        </thead>
        <tbody>
          <tr><td><span class="method POST">POST</span></td><td><code>/messages</code></td><td>Enviar mensaje</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
          <tr><td><span class="method GET">GET</span></td><td><code>/messages/conversations</code></td><td>Conversaciones</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
          <tr><td><span class="method GET">GET</span></td><td><code>/messages/vehicle/:id</code></td><td>Por vehículo</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
        </tbody>
      </table>

      <h3 style="margin: 24px 0 12px; font-size: 14px;">Ejemplo</h3>
      <pre><span class="keyword">curl</span> -X POST http://localhost:3000/messages \\
  -H <span class="string">"Authorization: Bearer &lt;TOKEN&gt;"</span> \\
  -d <span class="string">'{"vehicleId": "uuid", "receiverId": "uuid", "message": "Hola"}'</span></pre>
    </section>

    <!-- Favoritos -->
    <section id="favoritos" class="section">
      <h2 class="section-title"><span class="section-title-icon">❤️</span> Favoritos</h2>
      <table>
        <thead>
          <tr><th>Método</th><th>Ruta</th><th>Descripción</th><th>Auth</th></tr>
        </thead>
        <tbody>
          <tr><td><span class="method POST">POST</span></td><td><code>/favorites</code></td><td>Agregar</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
          <tr><td><span class="method DELETE">DELETE</span></td><td><code>/favorites/:id</code></td><td>Quitar</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
          <tr><td><span class="method GET">GET</span></td><td><code>/favorites</code></td><td>Listar</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
        </tbody>
      </table>
    </section>

    <!-- Preferencias -->
    <section id="preferencias" class="section">
      <h2 class="section-title"><span class="section-title-icon">⚙️</span> Preferencias de Usuario</h2>
      <table>
        <thead>
          <tr><th>Método</th><th>Ruta</th><th>Descripción</th><th>Auth</th></tr>
        </thead>
        <tbody>
          <tr><td><span class="method GET">GET</span></td><td><code>/user-preferences</code></td><td>Obtener</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
          <tr><td><span class="method PUT">PUT</span></td><td><code>/user-preferences</code></td><td>Actualizar</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
          <tr><td><span class="method DELETE">DELETE</span></td><td><code>/user-preferences</code></td><td>Eliminar</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
        </tbody>
      </table>
    </section>

    <!-- Análisis IA -->
    <section id="ia" class="section">
      <h2 class="section-title"><span class="section-title-icon">🤖</span> Análisis de IA</h2>
      <table>
        <thead>
          <tr><th>Método</th><th>Ruta</th><th>Descripción</th><th>Auth</th></tr>
        </thead>
        <tbody>
          <tr><td><span class="method POST">POST</span></td><td><code>/ai-analysis</code></td><td>Crear análisis</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
          <tr><td><span class="method GET">GET</span></td><td><code>/ai-analysis/vehicle/:id</code></td><td>Ver análisis</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
        </tbody>
      </table>
    </section>

    <!-- Upload -->
    <section id="upload" class="section">
      <h2 class="section-title"><span class="section-title-icon">📤</span> Upload de Imágenes</h2>
      <table>
        <thead>
          <tr><th>Método</th><th>Ruta</th><th>Descripción</th><th>Auth</th></tr>
        </thead>
        <tbody>
          <tr><td><span class="method POST">POST</span></td><td><code>/upload/image</code></td><td>Subir imagen</td><td><span class="auth-badge auth-yes">Sí</span></td></tr>
        </tbody>
      </table>
      <pre><span class="keyword">curl</span> -X POST http://localhost:3000/upload/image \\
  -H <span class="string">"Authorization: Bearer &lt;TOKEN&gt;"</span> \\
  -d <span class="string">'{"imageUrl": "https://ejemplo.com/img.jpg"}'</span></pre>
    </section>

    <footer class="footer">
      <p>API desenvolvida com NestJS | <strong>Web II</strong> - Instituto Universitario Aeronáutico</p>
      <p style="margin-top: 8px;">Santiago Javier Sanchez • Giuliano Ayrton Pucci</p>
    </footer>
  </main>

  <script>
    function toggleTheme() {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') !== 'light';
      html.setAttribute('data-theme', isDark ? 'light' : 'dark');
      document.getElementById('theme-text').textContent = isDark ? 'Modo Oscuro' : 'Modo Claro';
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.getElementById('theme-text').textContent = 'Modo Oscuro';
    }

    // Active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });
  </script>
</body>
</html>`;
  }
}