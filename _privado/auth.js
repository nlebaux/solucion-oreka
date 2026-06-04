(function () {
  var STORAGE_KEY = "oreka_private_access_v2";
  var PASSWORD = "oreka";

  function renderDenied() {
    document.documentElement.innerHTML = `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Acceso restringido</title>
    <style>
      :root {
        --bg: #0f0d0b;
        --panel: #1c1814;
        --text: #f2eadf;
        --muted: #b7ab9b;
        --accent: #e77b32;
        --line: rgba(255,255,255,.08);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        background:
          radial-gradient(circle at top left, rgba(231,123,50,.16), transparent 24%),
          linear-gradient(180deg, #15110d 0%, var(--bg) 100%);
        color: var(--text);
      }
      .card {
        width: min(520px, calc(100% - 24px));
        padding: 28px;
        border: 1px solid var(--line);
        border-radius: 20px;
        background: var(--panel);
        text-align: center;
      }
      h1 {
        margin: 0 0 12px;
        font-size: 2rem;
      }
      p {
        margin: 0 0 20px;
        color: var(--muted);
        line-height: 1.6;
      }
      button {
        border: none;
        border-radius: 999px;
        background: var(--accent);
        color: #23150b;
        padding: 12px 18px;
        font-weight: 800;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Acceso restringido</h1>
      <p>La clave ingresada no es valida para esta area privada de Oreka.</p>
      <button onclick="window.location.reload()">Intentar de nuevo</button>
    </div>
  </body>
</html>`;
  }

  if (window.location.search.indexOf("logout=1") !== -1) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {}
  }

  var hasAccess = false;
  try {
    hasAccess = localStorage.getItem(STORAGE_KEY) === "granted";
  } catch (error) {}

  if (hasAccess) {
    return;
  }

  var entered = window.prompt("Clave de acceso Oreka");

  if ((entered || "").trim() === PASSWORD) {
    try {
      localStorage.setItem(STORAGE_KEY, "granted");
    } catch (error) {}
    return;
  }

  renderDenied();
})();
