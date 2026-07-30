(function () {
  var STORAGE_KEY = "oreka_private_access_v3";
  // La clave ya no viaja en texto plano: se compara su SHA-256. Para cambiarla,
  // reemplazar este hash por el de la clave nueva y volver a publicar:
  //   python3 -c "import hashlib;print(hashlib.sha256('CLAVE'.encode()).hexdigest())"
  // Sigue siendo proteccion contra el curioso casual, no seguridad de servidor:
  // no subir aqui material legal, patrimonial ni de RRHH sensible.
  var PASSWORD_HASH = "993dba15fe54682ebcc67f0efcd56a56f024354b71140a4d230d58a147d6c30b";

  function sha256Hex(text) {
    var bytes = new TextEncoder().encode(text);
    return crypto.subtle.digest("SHA-256", bytes).then(function (buf) {
      return Array.prototype.map
        .call(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, "0"); })
        .join("");
    });
  }

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

  // Fail-closed: se oculta el contenido mientras se valida y solo se revela
  // si la clave calza. Si el navegador no soporta crypto.subtle, no se muestra.
  var ocultar = document.createElement("style");
  ocultar.id = "oreka-gate-hide";
  ocultar.textContent = "body{visibility:hidden}";
  (document.head || document.documentElement).appendChild(ocultar);

  function revelar() {
    var s = document.getElementById("oreka-gate-hide");
    if (s && s.parentNode) s.parentNode.removeChild(s);
  }

  var entered = window.prompt("Clave de acceso Oreka");

  if (!window.crypto || !crypto.subtle) {
    renderDenied();
    return;
  }

  sha256Hex((entered || "").trim()).then(function (hex) {
    if (hex === PASSWORD_HASH) {
      try {
        localStorage.setItem(STORAGE_KEY, "granted");
      } catch (error) {}
      revelar();
      return;
    }
    revelar();
    renderDenied();
  }).catch(function () {
    revelar();
    renderDenied();
  });
})();
