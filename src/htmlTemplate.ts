export const ORIGINAL_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cypheric Madness — Character Ledger</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght=500;600;700&family=Spectral:ital,wght=0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght=400;500;600&display=swap');

    :root {
      --void: #06070d;
      --panel: rgba(13, 16, 31, 0.75);
      --panel-alt: rgba(22, 26, 48, 0.6);
      --panel-line: rgba(58, 66, 107, 0.5);
      --hm: #e2b34c;
      --hm-dim: #5c451a;
      --sn: #a67bf2;
      --sn-dim: #432b70;
      --wl: #40cbd3;
      --wl-dim: #164f52;
      --ink: #f2eff7;
      --ink-dim: #9499bd;
      --danger: #ff5252;
      --gold-line: rgba(226, 179, 76, 0.3);
      
      /* Cosmic Prism Palette */
      --crystal-glow: rgba(64, 203, 211, 0.15);
      --void-glow: rgba(166, 123, 242, 0.1);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      color: var(--ink);
      font-family: 'Spectral', serif;
      min-height: 100vh;
      padding: 40px 16px 100px;
      background-color: var(--void);
      transition: padding-left 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
      
      /* Layered Background representing the central void singularity and shifting outer nebulae */
      background-image: 
        radial-gradient(circle at 50% 35%, rgba(166, 123, 242, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 20% 80%, rgba(64, 203, 211, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 80% 10%, rgba(226, 179, 76, 0.06) 0%, transparent 45%),
        conic-gradient(from 225deg at 50% 35%, #090a14, #120e24, #0b131c, #06070d, #090a14);
      background-attachment: fixed;
    }

    body.sidebar-active {
      padding-left: 380px;
    }

    .wrap { max-width: 1020px; margin: 0 auto; transition: transform 0.3s ease; }

    h1, h2, h3, .eyebrow { 
      font-family: 'Cinzel', serif; 
      letter-spacing: 0.08em; 
      text-shadow: 0 2px 4px rgba(0,0,0,0.8);
    }

    /* ===== PERPETUAL SIDEBAR FLOATING TOGGLE ===== */
    .sidebar-toggle-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1200;
      background: rgba(13, 16, 31, 0.9);
      border: 1px solid var(--panel-line);
      color: var(--wl);
      font-family: 'Cinzel', serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      padding: 12px 16px;
      border-radius: 2px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.6), 0 0 10px var(--crystal-glow);
      backdrop-filter: blur(8px);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sidebar-toggle-btn:hover {
      border-color: var(--wl);
      color: var(--ink);
      box-shadow: 0 4px 25px rgba(64, 203, 211, 0.3);
      transform: translateY(-1px);
    }
    .sidebar-toggle-btn.open-state {
      border-color: var(--sn);
      color: var(--sn);
      box-shadow: 0 4px 20px rgba(166, 123, 242, 0.2);
    }

    /* ===== FRACTURED SHARD SIDEBAR DRAWER ===== */
    .sidebar-drawer {
      position: fixed;
      top: 0;
      left: 0;
      width: 350px;
      height: 100vh;
      z-index: 1100;
      background: rgba(8, 10, 20, 0.95);
      border-right: 1px solid var(--panel-line);
      box-shadow: 5px 0 30px rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(20px);
      padding: 90px 20px 30px;
      overflow-y: auto;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .sidebar-drawer.open {
      transform: translateX(0);
    }
    .sidebar-drawer h2 {
      font-size: 16px;
      color: var(--wl);
      margin-top: 0;
      margin-bottom: 24px;
      text-transform: uppercase;
      border-bottom: 1px solid var(--panel-line);
      padding-bottom: 10px;
    }

    /* ===== CELESTIAL SIGIL HEADER ===== */
    .masthead {
      display: flex;
      align-items: center;
      gap: 32px;
      padding-bottom: 28px;
      margin-bottom: 36px;
      border-bottom: 1px solid var(--panel-line);
      position: relative;
    }

    .masthead::after {
      content: "";
      position: absolute;
      bottom: -1px; left: 25%; width: 50%; height: 1px;
      background: linear-gradient(90deg, transparent, var(--wl), transparent);
    }

    .seal {
      position: relative;
      width: 110px; height: 110px; flex: none;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cinzel', serif;
      font-size: 9px; font-weight: 700; letter-spacing: 0.05em;
      color: var(--ink);
      background: radial-gradient(circle, rgba(6,7,13,0.9) 40%, rgba(22,26,48,0.4) 100%);
      border: 1px solid var(--panel-line);
      box-shadow: 
        0 0 20px rgba(0, 0, 0, 0.8),
        0 0 0 4px rgba(6, 7, 13, 1),
        0 0 0 5px var(--gold-line);
      text-align: center;
      transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .seal:hover {
      transform: rotate(45deg);
    }

    .seal::before {
      content: "";
      position: absolute; inset: 4px;
      border-radius: 50%;
      border: 1px dashed rgba(148, 153, 189, 0.3);
    }

    .seal span {
      background: rgba(6, 7, 13, 0.95); 
      color: var(--ink); 
      padding: 6px 8px; 
      border: 1px solid var(--gold-line);
      max-width: 96px; word-wrap: break-word; line-height: 1.2;
      box-shadow: 0 4px 12px rgba(0,0,0,0.6);
      transform: rotate(-45deg);
      transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .seal:hover span { transform: rotate(0deg); }

    .masthead h1 { 
      font-size: 28px; margin: 0; 
      background: linear-gradient(135deg, var(--ink) 30%, var(--ink-dim) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      text-transform: uppercase; 
    }
    .masthead .sub { 
      color: var(--wl); font-size: 12px; margin-top: 6px; 
      font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.15em; text-transform: uppercase;
    }

    .name-row { display: flex; gap: 20px; margin-left: auto; align-items: flex-end; flex-wrap: wrap; }

    /* ===== CRYSTALLINE INTERACTIVE ELEMENTS ===== */
    input[type=text], input[type=number], select, textarea {
      background: rgba(14, 17, 33, 0.8);
      border: 1px solid var(--panel-line);
      color: var(--ink);
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      padding: 10px 12px;
      border-radius: 4px;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    }
    input[type=text]:focus, input[type=number]:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--wl);
      background: rgba(22, 26, 48, 0.9);
      box-shadow: 0 0 8px var(--crystal-glow), inset 0 1px 2px rgba(0,0,0,0.5);
    }
    label.field-label {
      display: block; font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.1em;
      color: var(--ink-dim); text-transform: uppercase; margin-bottom: 6px;
    }

    button.export-btn {
      background: rgba(92, 69, 26, 0.4); border: 1px solid var(--hm); color: var(--hm);
      font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
      padding: 10px 20px; border-radius: 4px; cursor: pointer; height: 41px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      transition: all 0.2s ease;
    }
    button.export-btn:hover { background: var(--hm); color: var(--void); box-shadow: 0 0 12px rgba(226, 179, 76, 0.4); }

    /* ===== FRACTURED SHARD PANELS ===== */
    .panel {
      background: var(--panel);
      border: 1px solid var(--panel-line);
      border-radius: 2px;
      padding: 24px;
      margin-bottom: 24px;
      backdrop-filter: blur(12px);
      box-shadow: 
        0 10px 30px -10px rgba(0,0,0,0.7),
        inset 0 1px 0px rgba(255,255,255,0.05);
      position: relative;
    }

    .panel::before {
      content: ""; position: absolute; top: -1px; left: -1px; width: 8px; height: 8px;
      border-top: 2px solid var(--ink-dim); border-left: 2px solid var(--ink-dim); opacity: 0.3;
    }

    .panel h2 {
      font-size: 16px; color: var(--ink); text-transform: uppercase; margin: 0 0 20px;
      display: flex; align-items: center; gap: 14px;
    }
    .panel h2::after { 
      content: ""; flex: 1; height: 1px; 
      background: linear-gradient(90deg, var(--panel-line), transparent); 
    }

    .panel h2 .cap-badge {
      font-family: 'IBM Plex Mono', monospace; font-size: 11px;
      padding: 3px 8px; border-radius: 2px;
      background: rgba(6, 7, 13, 0.6); border: 1px solid var(--panel-line); color: var(--ink-dim);
    }
    .panel h2 .cap-badge.warn { border-color: var(--danger); color: var(--danger); text-shadow: 0 0 4px rgba(255,82,82,0.4); }

    /* Stat Triad */
    .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .stat-card {
      border-radius: 2px; padding: 18px; border: 1px solid var(--panel-line);
      background: var(--panel-alt); position: relative; overflow: hidden;
    }
    .stat-card::after {
      content: ""; position: absolute; bottom: 0; left: 0; width: 100%; height: 3px;
    }
    .stat-card.hm::after { background: var(--hm); }
    .stat-card.sn::after { background: var(--sn); }
    .stat-card.wl::after { background: var(--wl); }

    .stat-card .stat-name { font-family: 'Cinzel', serif; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
    .stat-card.hm .stat-name { color: var(--hm); text-shadow: 0 0 8px rgba(226, 179, 76, 0.2); }
    .stat-card.sn .stat-name { color: var(--sn); text-shadow: 0 0 8px rgba(166, 123, 242, 0.2); }
    .stat-card.wl .stat-name { color: var(--wl); text-shadow: 0 0 8px rgba(64, 203, 211, 0.2); }
    .stat-card .stat-desc { font-size: 12px; color: var(--ink-dim); margin: 6px 0 14px; line-height: 1.4; font-style: italic; min-height: 34px;}
    .stat-card input { width: 100%; font-size: 22px; text-align: center; padding: 6px; background: rgba(6,7,13,0.5); }

    .budget-line {
      margin-top: 16px; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: var(--ink-dim);
      display: flex; justify-content: space-between; background: rgba(6,7,13,0.4); padding: 10px 14px; border-radius: 2px;
    }
    .budget-line b { color: var(--wl); }
    .budget-line.over b { color: var(--danger); text-shadow: 0 0 6px var(--danger); }

    /* Derived Shard Matrix */
    .derived-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
    .derived-card {
      background: var(--panel-alt); border: 1px solid var(--panel-line); border-radius: 2px;
      padding: 14px; position: relative;
    }
    .derived-card.clickable { cursor: pointer; transition: all 0.15s ease; }
    .derived-card.clickable:hover {
      background: rgba(42, 48, 84, 0.5); border-color: var(--wl);
      transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    }
    .derived-card .d-label { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.05em; color: var(--ink-dim); text-transform: uppercase; }
    .derived-card .d-value { font-family: 'IBM Plex Mono', monospace; font-size: 20px; color: var(--ink); margin-top: 6px; font-weight: 600; }
    .derived-card .d-note { font-size: 10.5px; color: rgba(148, 153, 189, 0.6); margin-top: 4px; font-family: 'IBM Plex Mono', monospace; }

    /* ===== RUNIC ROLLS ENGINE ===== */
    .roll-stack { display: flex; flex-direction: column; gap: 12px; }
    .roll-row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }

    button.roll-btn {
      background: rgba(22, 26, 48, 0.5); border: 1px solid var(--panel-line); color: var(--ink);
      font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
      padding: 10px 12px; border-radius: 2px; cursor: pointer; text-align: left; width: 100%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      transition: all 0.15s ease; position: relative;
    }
    button.roll-btn:hover {
      border-color: var(--sn); color: var(--sn); background: rgba(166, 123, 242, 0.1);
      box-shadow: 0 0 10px rgba(166, 123, 242, 0.2);
    }
    .roll-result-wrapper { display: flex; gap: 6px; width: 100%; }
    .roll-result {
      font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: rgba(148, 153, 189, 0.5);
      background: rgba(6, 7, 13, 0.5); border: 1px solid var(--panel-line); border-radius: 2px;
      padding: 8px 12px; min-height: 36px; display: flex; align-items: center; flex: 1;
    }
    .roll-result.has-val { color: var(--ink); border-color: rgba(64, 203, 211, 0.4); background: rgba(14, 17, 33, 0.7); }
    .roll-result b { color: var(--wl); text-shadow: 0 0 8px rgba(64, 203, 211, 0.4); }

    button.clear-roll-btn {
      background: transparent; border: 1px solid var(--panel-line); color: var(--ink-dim);
      border-radius: 2px; cursor: pointer; width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center; font-size: 12px;
      transition: all 0.15s ease; flex: none;
    }
    button.clear-roll-btn:hover { color: var(--danger); border-color: var(--danger); background: rgba(255,82,82,0.1); }

    /* Thaumagen Vault Grid */
    .bank-grid { display: grid; grid-template-columns: auto repeat(3, 1fr); gap: 10px 16px; align-items: center; font-family: 'IBM Plex Mono', monospace; font-size: 13px; }
    .bank-grid .row-label { color: var(--ink-dim); font-family: 'Cinzel', serif; font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600; }
    .bank-grid .col-head { text-align: center; font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim); padding-bottom: 4px; }
    .bank-grid input { width: 100%; text-align: center; background: rgba(6,7,13,0.6); }

    /* ===== MATRIX / ENTRY ARCHITECTURE ===== */
    .entry-list { display: flex; flex-direction: column; gap: 12px; }
    .entry {
      background: var(--panel-alt); border: 1px solid var(--panel-line); border-radius: 2px;
      padding: 16px; position: relative;
    }
    .entry-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .entry-head input[type=text] { flex: 1; font-family: 'Spectral', serif; font-size: 15px; background: rgba(6,7,13,0.4); border-color: rgba(58,66,107,0.3); }
    .entry textarea {
      width: 100%; margin-top: 12px; background: rgba(6, 7, 13, 0.5); border: 1px solid var(--panel-line);
      color: var(--ink); font-family: 'Spectral', serif; font-size: 13.5px; padding: 10px;
      min-height: 65px; resize: vertical;
    }
    .entry-meta { display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap; }
    .entry-meta input { font-size: 12px; padding: 8px 10px; background: rgba(6,7,13,0.3); }

    button.icon-btn {
      background: none; border: none; color: var(--ink-dim); cursor: pointer; font-size: 16px; padding: 6px 10px;
      border-radius: 2px; transition: color .15s, background 0.15s;
    }
    button.icon-btn:hover { color: var(--danger); background: rgba(255,82,82,0.1); }

    button.add-btn {
      align-self: flex-start;
      background: transparent; border: 1px dashed var(--panel-line); color: var(--ink-dim);
      font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
      padding: 12px 20px; border-radius: 2px; cursor: pointer; margin-top: 16px;
      transition: all 0.15s ease;
    }
    button.add-btn:hover { border-color: var(--wl); color: var(--wl); background: rgba(64, 203, 211, 0.05); }

    /* ===== THE MANTLE INTERFACE ===== */
    .mantle-title-btn, .entry-title-btn {
      width: 100%; text-align: left; background: var(--panel-alt); border: 1px solid var(--panel-line);
      color: var(--ink); padding: 14px 18px; border-radius: 2px; font-family: 'Cinzel', serif;
      font-size: 14px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
      transition: all 0.15s ease;
    }
    .mantle-title-btn:hover, .entry-title-btn:hover { border-color: var(--hm); background: rgba(226, 179, 76, 0.05); }

    .mantle-content-box, .entry-content-box {
      background: rgba(14, 17, 33, 0.9); border: 1px solid var(--panel-line); border-top: none;
      border-radius: 0; padding: 20px; margin-top: 0; margin-bottom: 12px;
      box-shadow: inset 0 4px 20px rgba(0,0,0,0.5);
    }
    .mantle-sub-group { margin-bottom: 16px; }
    .mantle-sub-group h4 {
      font-family: 'Cinzel', serif; font-size: 11px; color: var(--ink-dim); 
      text-transform: uppercase; margin: 0 0 10px; border-bottom: 1px dashed var(--panel-line); padding-bottom: 6px;
      letter-spacing: 0.05em;
    }
    .mantle-btn-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
    .mantle-toggle-btn {
      background: rgba(6, 7, 13, 0.5); border: 1px solid var(--panel-line); color: var(--ink-dim);
      font-family: 'Spectral', serif; font-size: 12.5px; padding: 8px 14px; border-radius: 2px;
      cursor: pointer; transition: all 0.2s ease;
    }
    .mantle-toggle-btn:hover { color: var(--ink); border-color: var(--ink-dim); }
    .mantle-toggle-btn.active {
      background: rgba(92, 69, 26, 0.35); border-color: var(--hm); color: var(--hm);
      text-shadow: 0 0 6px rgba(226,179,76,0.3); box-shadow: 0 0 8px rgba(226,179,76,0.1);
    }
    .mantle-popdown {
      background: rgba(6, 7, 13, 0.6); border-left: 3px solid var(--hm); padding: 14px 18px;
      border-radius: 0; margin-bottom: 12px; font-size: 13.5px; line-height: 1.5;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }
    .nested-editor-card {
      background: rgba(6, 7, 13, 0.4); border: 1px dashed var(--panel-line); 
      padding: 14px; border-radius: 2px; margin-bottom: 10px;
    }

    @media (max-width: 768px) {
      body.sidebar-active { padding-left: 16px; }
      .sidebar-drawer { width: 300px; }
      .stat-grid { grid-template-columns: 1fr; }
      .masthead { flex-wrap: wrap; gap: 20px; }
      .name-row { margin-left: 0; width: 100%; }
    }
  </style>
</head>
<body>

  <!-- Floating Sidebar Toggle -->
  <button class="sidebar-toggle-btn" id="sidebar-toggle-trigger" onclick="toggleSidebar()">
    <span>🎲</span> <span id="toggle-label-text">Open Runic Rolls</span>
  </button>

  <!-- Ledger Workspace Wrap -->
  <div class="wrap" id="app">
    <!-- App layout gets dynamically rendered here by the JS script below -->
  </div>

  <!-- Main Ledger Game Script -->
  <script>
    // Global Error Handler for Standalone Self-Diagnosis
    window.onerror = function(message, source, lineno, colno, error) {
      const appEl = document.getElementById('app');
      if (appEl) {
        appEl.innerHTML = \`
          <div style="background: rgba(255, 82, 82, 0.1); border: 1px solid #ff5252; padding: 24px; border-radius: 4px; margin: 40px auto; max-width: 600px; font-family: monospace; color: #ff5252; box-shadow: 0 4px 20px rgba(255, 82, 82, 0.2); backdrop-filter: blur(8px);">
            <h3 style="margin-top: 0; text-transform: uppercase; font-family: 'Cinzel', serif; font-size: 16px; letter-spacing: 0.05em; color: #ff5252;">🔮 Ledger Convergence Error</h3>
            <p style="font-size: 14px; margin-bottom: 16px; font-family: 'Spectral', serif; color: #f2eff7;">An error occurred while rendering the standalone character ledger:</p>
            <div style="background: rgba(6,7,13,0.9); padding: 12px; border-radius: 2px; font-size: 12px; line-height: 1.5; border: 1px solid rgba(255,82,82,0.3); overflow-x: auto; white-space: pre-wrap; color: #f2eff7;">\${message}\\n\\nat \${source || 'inline'}:\${lineno}:\${colno}</div>
            <p style="font-size: 12px; margin-top: 16px; color: #9499bd; font-family: 'Spectral', serif;">Please report this or check if your exported ledger has been corrupted.</p>
          </div>
        \`;
      }
      return false;
    };

    // ============ PERSISTED EMBED SLOT ============
    /*CHARDATA_START*/const EMBEDDED_CHARACTER_DATA = __STATE_JSON__;/*CHARDATA_END*/

    // ============ DATA TABLES ============
    const TIER_GROUPS = {
      Mortal:    { dice:"1d4",  n:1, sides:4,  tierBonus:1, equipLimit:3, seal:"#e2b34c" },
      Storied:   { dice:"2d6",  n:2, sides:6,  tierBonus:2, equipLimit:4, seal:"#a67bf2" },
      Honored:   { dice:"3d8",  n:3, sides:8,  tierBonus:3, equipLimit:5, seal:"#40cbd3" },
      Legendary: { dice:"5d10", n:5, sides:10, tierBonus:5, equipLimit:6, seal:"#ff5252" },
      Kaleidian: { dice:"7d12", n:7, sides:12, tierBonus:7, equipLimit:7, seal:"#f2eff7" },
    };

    const TIER_LEVELS = [
      {name:"Mortal",        group:"Mortal",    thauma:20,  health:40,   ability:4,   statPoints:15},
      {name:"Mortal One",    group:"Mortal",    thauma:25,  health:45,   ability:5,   statPoints:22},
      {name:"Mortal Two",    group:"Mortal",    thauma:35,  health:55,   ability:7,   statPoints:31},
      {name:"Mortal Three",  group:"Mortal",    thauma:46,  health:66,   ability:9,   statPoints:41},
      {name:"Mortal Four",   group:"Mortal",    thauma:59,  health:79,   ability:11,  statPoints:53},
      {name:"Mortal Five",   group:"Mortal",    thauma:75,  health:95,   ability:14,  statPoints:67},
      {name:"Storied One",   group:"Storied",   thauma:93,  health:173,  ability:17,  statPoints:83},
      {name:"Storied Two",   group:"Storied",   thauma:113, health:193,  ability:21,  statPoints:101},
      {name:"Storied Three", group:"Storied",   thauma:136, health:216,  ability:25,  statPoints:122},
      {name:"Storied Four",  group:"Storied",   thauma:163, health:243,  ability:30,  statPoints:146},
      {name:"Storied Five",  group:"Storied",   thauma:194, health:274,  ability:35,  statPoints:174},
      {name:"Honored One",   group:"Honored",   thauma:229, health:399,  ability:42,  statPoints:206},
      {name:"Honored Two",   group:"Honored",   thauma:270, health:440,  ability:49,  statPoints:243},
      {name:"Honored Three", group:"Honored",   thauma:318, health:488,  ability:58,  statPoints:286},
      {name:"Honored Four",  group:"Honored",   thauma:373, health:543,  ability:68,  statPoints:335},
      {name:"Honored Five",  group:"Honored",   thauma:435, health:605,  ability:79,  statPoints:391},
      {name:"Legendary",     group:"Legendary", thauma:514, health:884,  ability:93,  statPoints:462},
      {name:"Kaleidian",     group:"Kaleidian", thauma:615, health:1085, ability:111, statPoints:553},
    ];

    // ============ STATE ============
    const DEFAULT_CHAR = () => ({
      name:"New Student",
      tierLevel:"Mortal",
      hm:5, sn:5, wl:5,
      flatHealthBonus:0,
      currentThauma: null,
      currentHealth: null,
      thaumagen:{
        hm:{sub:5,data:0,sync:0},
        sn:{sub:5,data:0,sync:0},
        wl:{sub:5,data:0,sync:0},
      },
      matrices:[],
      merits:[],
      mantles:[],
      items:[],
      summons:[],
    });

    let state = DEFAULT_CHAR();
    let sidebarOpen = false;

    let rollOutputs = {
      oneDx: '',
      fullDx: '',
      hit: '',
      resist: '',
      init: '',
      summon: ''
    };

    // ============ PERSISTENT TOGGLE ENGINE ============
    function toggleSidebar() {
      sidebarOpen = !sidebarOpen;
      render();
    }

    // ============ FILE EXPORT ============
    function exportCharacterAppFile() {
      const fullHtmlSource = document.documentElement.outerHTML;
      const rawDataJson = JSON.stringify(state);

      const startMarker = "/*CHARDATA_START*/const EMBEDDED_CHARACTER_DATA = ";
      const endMarker = ";/*CHARDATA_END*/";
      const startIdx = fullHtmlSource.indexOf(startMarker);
      const endIdx = startIdx === -1 ? -1 : fullHtmlSource.indexOf(endMarker, startIdx);

      if (startIdx === -1 || endIdx === -1) {
        alert("System Compilation Error: Code structural anchor target shifted or missing.");
        return;
      }

      const before = fullHtmlSource.slice(0, startIdx + startMarker.length);
      const after = fullHtmlSource.slice(endIdx);
      const optimizedFileContent = "<!DOCTYPE html>\n" + before + rawDataJson + after;
      const compiledBlob = new Blob([optimizedFileContent], { type: "text/html;charset=utf-8" });
      const virtualAnchor = document.createElement("a");
      
      const cleanedName = state.name.replace(/[^a-z0-9]/gi, '_');
      virtualAnchor.download = \`\${cleanedName || 'Unnamed'}_Cypheric_Ledger.html\`;
      virtualAnchor.href = URL.createObjectURL(compiledBlob);
      virtualAnchor.click();
      
      URL.revokeObjectURL(virtualAnchor.href);
    }

    // ============ CALCULATIONS ============
    function getTierData(){
      return TIER_LEVELS.find(t=>t.name===state.tierLevel) || TIER_LEVELS[0];
    }
    function getGroupData(){
      return TIER_GROUPS[getTierData().group];
    }
    function calcMaxThauma(){
      const {hm,sn,wl} = state;
      return Math.ceil((hm/0.9)+(sn*1.2)+(wl/0.9));
    }
    function calcMaxHealth(){
      const {hm,sn,wl} = state;
      const tierData = getTierData();
      return Math.ceil((hm/0.9)+(sn/0.9)+(wl*1.2)+Number(tierData.health)+Number(state.flatHealthBonus||0));
    }
    function calcAbility(){
      const {hm,sn,wl} = state;
      return Math.ceil((hm * 0.3) + (sn * 0.2) + (wl * 0.2));
    }
    function getAspect(){
      const {hm,sn,wl} = state;
      const max = Math.max(hm,sn,wl);
      if(max === hm) return "Harmonics";
      if(max === wl) return "Wavelength";
      return "Sanity";
    }
    function statPointsUsed(){
      return Number(state.hm)+Number(state.sn)+Number(state.wl);
    }
    function rollDice(n,sides){
      const rolls = [];
      for(let i=0;i<n;i++) rolls.push(1+Math.floor(Math.random()*sides));
      return rolls;
    }
    function fmt(n){
      return Math.round(n*100)/100;
    }

    function autoEvaluateTierThreshold() {
      const points = statPointsUsed();
      let selectedTier = TIER_LEVELS[0].name;
      for (let i = 0; i < TIER_LEVELS.length; i++) {
        if (points >= TIER_LEVELS[i].statPoints) {
          selectedTier = TIER_LEVELS[i].name;
        }
      }
      state.tierLevel = selectedTier;
    }

    function applyTierMacroBaseline(levelName) {
      const matched = TIER_LEVELS.find(t => t.name === levelName);
      if (!matched) return;
      
      const budget = matched.statPoints;
      const equalSplit = Math.floor(budget / 3);
      const leftOver = budget % 3;

      state.hm = equalSplit + (leftOver > 0 ? 1 : 0);
      state.sn = equalSplit + (leftOver > 1 ? 1 : 0);
      state.wl = equalSplit;
      state.tierLevel = levelName;

      state.thaumagen.hm.sub = state.hm;
      state.thaumagen.sn.sub = state.sn;
      state.thaumagen.wl.sub = state.wl;

      state.currentThauma = calcMaxThauma();
      state.currentHealth = calcMaxHealth();
    }

    function syncCurrentTrackers() {
      const maxThauma = calcMaxThauma();
      const maxHealth = calcMaxHealth();
      if (state.currentThauma === null) state.currentThauma = maxThauma;
      if (state.currentHealth === null) state.currentHealth = maxHealth;
    }

    function promptTrackerUpdate(type, currentVal, maxVal) {
      const input = prompt(\`Modify \${type} (Current: \${currentVal}/\${maxVal}).\\nEnter a modification (e.g., -2, +10) or a new absolute value:\`);
      if (input === null || input.trim() === "") return;

      const trimmed = input.trim();
      if (trimmed.startsWith("+") || trimmed.startsWith("-")) {
        const parsedMod = parseInt(trimmed, 10);
        if (!isNaN(parsedMod)) {
          if (type === "Thauma") state.currentThauma += parsedMod;
          if (type === "Health") state.currentHealth += parsedMod;
        }
      } else {
        const absolute = parseInt(trimmed, 10);
        if (!isNaN(absolute)) {
          if (type === "Thauma") state.currentThauma = absolute;
          if (type === "Health") state.currentHealth = absolute;
        }
      }
      render();
    }

    // ============ RENDER ============
    function render(){
      const tier = getTierData();
      const group = getGroupData();
      
      const maxThauma = calcMaxThauma();
      const maxHealth = calcMaxHealth();
      
      syncCurrentTrackers();
      
      const ability = calcAbility();
      const used = statPointsUsed();
      const over = false;
      const aspect = getAspect();

      const matrixOver = state.matrices.length > 7;
      const itemOver = state.items.length > group.equipLimit;
      const summonOver = state.summons.length > group.equipLimit;

      const hmTotal = state.thaumagen.hm.sub + state.thaumagen.hm.data + state.thaumagen.hm.sync;
      const snTotal = state.thaumagen.sn.sub + state.thaumagen.sn.data + state.thaumagen.sn.sync;
      const wlTotal = state.thaumagen.wl.sub + state.thaumagen.wl.data + state.thaumagen.wl.sync;

      // Global Context Style Syncing
      const toggleBtn = document.getElementById('sidebar-toggle-trigger');
      const labelText = document.getElementById('toggle-label-text');
      if (toggleBtn && labelText) {
        if (sidebarOpen) {
          document.body.classList.add('sidebar-active');
          toggleBtn.classList.add('open-state');
          labelText.innerText = "Close Runic Rolls";
        } else {
          document.body.classList.remove('sidebar-active');
          toggleBtn.classList.remove('open-state');
          labelText.innerText = "Open Runic Rolls";
        }
      }

      const app = document.getElementById('app');
      app.innerHTML = \`
        <div class="sidebar-drawer \${sidebarOpen ? 'open' : ''}" id="runic-sidebar-drawer">
          <h2>Dice Engine</h2>
          <div class="roll-stack">
            <div class="roll-row">
              <button class="roll-btn" data-roll="oneDx">Roll 1d\${group.sides}</button>
              <div class="roll-result-wrapper">
                <div class="roll-result \${rollOutputs.oneDx?'has-val':''}">\${rollOutputs.oneDx || '—'}</div>
                <button class="clear-roll-btn" data-clear="oneDx" title="Clear result">✕</button>
              </div>
            </div>
            <div class="roll-row">
              <button class="roll-btn" data-roll="fullDx">Roll Full dx (\${group.dice})</button>
              <div class="roll-result-wrapper">
                <div class="roll-result \${rollOutputs.fullDx?'has-val':''}">\${rollOutputs.fullDx || '—'}</div>
                <button class="clear-roll-btn" data-clear="fullDx" title="Clear result">✕</button>
              </div>
            </div>
            <div class="roll-row">
              <button class="roll-btn" data-roll="hit">Roll to Hit (1dx + Ability)</button>
              <div class="roll-result-wrapper">
                <div class="roll-result \${rollOutputs.hit?'has-val':''}">\${rollOutputs.hit || '—'}</div>
                <button class="clear-roll-btn" data-clear="hit" title="Clear result">✕</button>
              </div>
            </div>
            <div class="roll-row">
              <button class="roll-btn" data-roll="resist">Roll to Resist (1dx + Ability)</button>
              <div class="roll-result-wrapper">
                <div class="roll-result \${rollOutputs.resist?'has-val':''}">\${rollOutputs.resist || '—'}</div>
                <button class="clear-roll-btn" data-clear="resist" title="Clear result">✕</button>
              </div>
            </div>
            <div class="roll-row">
              <button class="roll-btn" data-roll="init">Initiative (Ability + 1dx)</button>
              <div class="roll-result-wrapper">
                <div class="roll-result \${rollOutputs.init?'has-val':''}">\${rollOutputs.init || '—'}</div>
                <button class="clear-roll-btn" data-clear="init" title="Clear result">✕</button>
              </div>
            </div>
            <div class="roll-row">
              <button class="roll-btn" style="cursor:default; border-color:var(--panel-line); color:var(--ink-dim);" disabled>Summon Actions Tracker</button>
              <div class="roll-result-wrapper">
                <div class="roll-result \${rollOutputs.summon?'has-val':''}">\${rollOutputs.summon || 'No dynamic summon calculation parsed.'}</div>
                <button class="clear-roll-btn" data-clear="summon" title="Clear result">✕</button>
              </div>
            </div>
          </div>
        </div>

        <div class="masthead">
          <div class="seal" style="box-shadow: 0 0 20px rgba(0,0,0,0.8), 0 0 0 4px rgba(6,7,13,1), 0 0 0 5px \${group.seal}"><span>\${state.tierLevel}</span></div>
          <div>
            <h1>Cypheric Madness</h1>
            <div class="sub">Omniversal Character Ledger</div>
          </div>
          <div class="name-row">
            <div>
              <label class="field-label">Character Name</label>
              <input type="text" id="char-name" value="\${state.name}">
            </div>
            <div>
              <label class="field-label">Set Tier Level</label>
              <select id="tier-macro-select">
                <option value="" disabled selected>— Select Baseline —</option>
                \${TIER_LEVELS.map(t=>\`<option value="\${t.name}">\${t.name} (\${t.statPoints} pts)</option>\`).join('')}
              </select>
            </div>
            <div>
              <button class="export-btn" id="export-app-btn" title="Download standalone updated sheet file">💾 Save App File</button>
            </div>
          </div>
        </div>

        <div class="panel">
          <h2>Player Stats</h2>
          <div class="stat-grid">
            <div class="stat-card hm">
              <div class="stat-name">Harmonics</div>
              <div class="stat-desc">Energetic &amp; physical stability. Favors Ability. Roll to Resist.</div>
              <input type="number" id="stat-hm" value="\${state.hm}" min="0">
            </div>
            <div class="stat-card sn">
              <div class="stat-name">Sanity</div>
              <div class="stat-desc">Strength of will, awareness of the Cypher. Favors Thauma. Summoning.</div>
              <input type="number" id="stat-sn" value="\${state.sn}" min="0">
            </div>
            <div class="stat-card wl">
              <div class="stat-name">Wavelength</div>
              <div class="stat-desc">Raw power, projection of will. Favors Health. Roll to Hit.</div>
              <input type="number" id="stat-wl" value="\${state.wl}" min="0">
            </div>
          </div>
          <div class="budget-line \${over?'over':''}">
            <span>Thaumagen Used: <b>\${state.hm}/\${hmTotal}</b> | <b>\${state.sn}/\${snTotal}</b> | <b>\${state.wl}/\${wlTotal}</b></span>
            <span>Aspect: <b>\${aspect}</b></span>
          </div>
        </div>

        <div class="panel">
          <h2>Derived Stats</h2>
          <div class="derived-grid">
            <div class="derived-card clickable" id="derived-thauma" title="Click to expend or adjust Thauma">
              <div class="d-label">Thauma (Spent/Max) ✎</div>
              <div class="d-value">\${state.currentThauma} / \${maxThauma}</div>
              <div class="d-note">threshold \${tier.thauma}</div>
            </div>
            <div class="derived-card clickable" id="derived-health" title="Click to log damage or adjust Health">
              <div class="d-label">Health (Curr/Max) ✎</div>
              <div class="d-value">\${state.currentHealth} / \${maxHealth}</div>
              <div class="d-note">base \${tier.health}</div>
            </div>
            <div class="derived-card">
              <div class="d-label">Ability</div>
              <div class="d-value">\${fmt(ability)}</div>
              <div class="d-note">ref \${tier.ability}</div>
            </div>
            <div class="derived-card">
              <div class="d-label">Dice (dx)</div>
              <div class="d-value">\${group.dice}</div>
              <div class="d-note">dx Total \${group.n*group.sides} · Half \${Math.floor(group.n*group.sides/2)}</div>
            </div>
            <div class="derived-card">
              <div class="d-label">Tier Bonus</div>
              <div class="d-value">\${group.tierBonus}</div>
              <div class="d-note">sustain / multicast slots</div>
            </div>
            <div class="derived-card">
              <div class="d-label">Equip Limit</div>
              <div class="d-value">\${group.equipLimit}</div>
              <div class="d-note">items / summons</div>
            </div>
          </div>
          <div style="margin-top:16px;">
            <label class="field-label">Additional Merit / Item Health Modifications</label>
            <input type="number" id="flat-health" value="\${state.flatHealthBonus}" style="width:120px;">
          </div>
        </div>

        <div class="panel">
          <h2>Thaumagen Bank</h2>
          <div class="bank-grid">
            <div></div>
            <div class="col-head">Substrate</div>
            <div class="col-head">Data</div>
            <div class="col-head">Sync</div>
            \${['hm','sn','wl'].map(s=>\`
              <div class="row-label">\${s.toUpperCase()}</div>
              <input type="number" data-bank="\${s}-sub" value="\${state.thaumagen[s].sub}">
              <input type="number" data-bank="\${s}-data" value="\${state.thaumagen[s].data}">
              <input type="number" data-bank="\${s}-sync" value="\${state.thaumagen[s].sync}">
            \`).join('')}
          </div>
        </div>

        \${renderListPanel('Matrices','matrices',['name','tags','area','aspect'], matrixOver, 7)}
        \${renderListPanel('Merits','merits',['name'])}
        
        <div class="panel">
          <h2>Mantles</h2>
          <div class="entry-list">
            \${state.mantles.map((mantle, mIdx) => renderMantleEntry(mantle, mIdx)).join('')}
          </div>
          <button class="add-btn" id="add-mantle-btn">+ Add Mantle</button>
        </div>

        \${renderListPanel('Items','items',['name','aspect'], itemOver, group.equipLimit)}
        \${renderListPanel('Summons','summons',['name','aspect'], summonOver, group.equipLimit)}
      \`;

      attachHandlers();
    }

    const LIST_ICON = { matrices:'⚡', merits:'✦', items:'🜲', summons:'✧' };

    function renderListPanel(title, key, metaFields, isOver = false, limitMax = null){
      const list = state[key];
      const capLabel = limitMax !== null ? \`<span class="cap-badge \${isOver?'warn':''}">Cap: \${list.length}/\${limitMax}</span>\` : '';
      
      return \`
        <div class="panel">
          <h2>\${title} \${capLabel}</h2>
          <div class="entry-list" data-list="\${key}">
            \${list.map((item,i)=>renderListEntry(item,i,key,metaFields)).join('')}
          </div>
          <button class="add-btn" data-addlist="\${key}">+ Add \${title.slice(0,-1)}</button>
        </div>
      \`;
    }

    function renderListEntry(item, idx, key, metaFields){
      const otherFields = metaFields.filter(f=>f!=='name');
      const summonRollBtn = \`<button class="roll-btn summon-roll-btn" data-summon-idx="\${idx}" style="font-size:11px; max-width:160px; padding:6px 10px;">Roll Thauma</button>\`;

      if (item.isEditing) {
        return \`
          <div class="entry" data-idx="\${idx}" style="border:1px solid var(--hm);">
            <div class="entry-head">
              <input type="text" data-field="name" placeholder="Name" value="\${item.name||''}">
              \${key === 'summons' ? summonRollBtn : ''}
              <button class="icon-btn" data-remove="\${key}:\${idx}">✕</button>
            </div>
            <div class="entry-meta">
              \${otherFields.map(f=>\`
                <input type="text" data-field="\${f}" placeholder="\${f[0].toUpperCase()+f.slice(1)}" value="\${item[f]||''}">
              \`).join('')}
            </div>
            <textarea data-field="effect" placeholder="Effect / description...">\${item.effect||''}</textarea>
            <button class="save-entry-btn" data-savekey="\${key}" data-idx="\${idx}" style="margin-top:12px; font-size:11px; padding:6px 12px; background:var(--hm-dim); border:1px solid var(--hm); color:var(--ink); cursor:pointer;">Lock &amp; Minimize</button>
          </div>
        \`;
      }

      const isOpen = item.isOpen || false;
      const icon = LIST_ICON[key] || '◆';
      const metaLine = otherFields.map(f=>\`\${f[0].toUpperCase()+f.slice(1)}: \${item[f] || '—'}\`).join(' · ');

      return \`
        <div style="margin-bottom: 8px;">
          <button class="entry-title-btn" data-togglekey="\${key}" data-idx="\${idx}">
            <span>\${icon} \${item.name || 'Unnamed'}</span>
            <span style="font-size:11px; color:var(--ink-dim);">\${isOpen ? '▲ Collapse' : '▼ Expand'}</span>
          </button>
          \${isOpen ? \`
            <div class="entry-content-box">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:12px;">
                <span style="font-size:11px; font-family:'IBM Plex Mono'; color:var(--ink-dim);">\${metaLine}</span>
                <button class="edit-entry-btn" data-editkey="\${key}" data-idx="\${idx}" style="flex:none; font-size:11px; padding:4px 10px; background:transparent; border:1px solid var(--panel-line); color:var(--ink); cursor:pointer;">⚙ Edit</button>
              </div>
              \${key === 'summons' ? \`<div style="margin-bottom:12px;">\${summonRollBtn}</div>\` : ''}
              <p style="margin:0; white-space:pre-wrap; font-size:13.5px; line-height:1.5;">\${item.effect || 'No description.'}</p>
            </div>
          \` : ''}
        </div>
      \`;
    }

    function renderMantleEntry(mantle, mIdx) {
      if (mantle.isEditing) {
        return \`
          <div class="entry" style="border: 1px solid var(--hm);">
            <div class="entry-head" style="margin-bottom:12px;">
              <input type="text" class="mantle-name-input" data-midx="\${mIdx}" placeholder="Mantle Name" value="\${mantle.name||''}">
              <button class="primary-btn save-mantle-btn" data-midx="\${mIdx}" style="font-size:11px; padding:6px 12px; background:var(--hm-dim); border:1px solid var(--hm); color:var(--ink); cursor:pointer;">Lock &amp; Minimize</button>
              <button class="icon-btn remove-mantle-btn" data-midx="\${mIdx}">✕</button>
            </div>
            <div class="mantle-sub-group">
              <h4>Mantle Effects</h4>
              <div class="nested-list">
                \${(mantle.effects || []).map((eff, eIdx) => \`
                  <div class="nested-editor-card">
                    <input type="text" class="mantle-eff-name" data-midx="\${mIdx}" data-eidx="\${eIdx}" placeholder="Trigger Name" value="\${eff.name||''}" style="width:100%; margin-bottom:6px;">
                    <textarea class="mantle-eff-desc" data-midx="\${mIdx}" data-eidx="\${eIdx}" placeholder="Effect description...">\${eff.effect||''}</textarea>
                    <button class="icon-btn delete-mantle-eff" data-midx="\${mIdx}" data-eidx="\${eIdx}" style="font-size:11px; padding:2px;">Remove Effect</button>
                  </div>
                \`).join('')}
              </div>
              <button class="add-btn add-mantle-eff" data-midx="\${mIdx}" style="padding:4px 8px; font-size:11px;">+ Add Passive Effect</button>
            </div>
            <div class="mantle-sub-group" style="margin-top:14px;">
              <h4>Embedded Matrices</h4>
              <div class="nested-list">
                \${(mantle.matrices || []).map((mat, matIdx) => \`
                  <div class="nested-editor-card" style="border-color: var(--panel-line)">
                    <div style="display:flex; gap:6px; margin-bottom:6px;">
                      <input type="text" class="mantle-mat-name" data-midx="\${mIdx}" data-matidx="\${matIdx}" placeholder="Matrix Name" value="\${mat.name||''}" style="flex:2;">
                      <input type="text" class="mantle-mat-tags" data-midx="\${mIdx}" data-matidx="\${matIdx}" placeholder="Tags" value="\${mat.tags||''}" style="flex:1;">
                      <input type="text" class="mantle-mat-area" data-midx="\${mIdx}" data-matidx="\${matIdx}" placeholder="Area" value="\${mat.area||''}" style="flex:1;">
                      <input type="text" class="mantle-mat-aspect" data-midx="\${mIdx}" data-matidx="\${matIdx}" placeholder="Aspect" value="\${mat.aspect||''}" style="flex:1;">
                    </div>
                    <textarea class="mantle-mat-desc" data-midx="\${mIdx}" data-matidx="\${matIdx}" placeholder="Logic Chain / Rules...">\${mat.effect||''}</textarea>
                    <button class="icon-btn delete-mantle-mat" data-midx="\${mIdx}" data-matidx="\${matIdx}" style="font-size:11px; padding:2px;">Remove Matrix</button>
                  </div>
                \`).join('')}
              </div>
              <button class="add-btn add-mantle-mat" data-midx="\${mIdx}" style="padding:4px 8px; font-size:11px;">+ Embed Matrix</button>
            </div>
          </div>
        \`;
      }

      const isOpen = mantle.isOpen || false;
      const subKey = mantle.openSubKey || null;

      return \`
        <div style="margin-bottom: 8px;">
          <button class="mantle-title-btn" data-midx="\${mIdx}">
            <span>💎 \${mantle.name || 'Unnamed Mantle'}</span>
            <span style="font-size:11px; color:var(--ink-dim);">\${isOpen ? '▲ Collapse' : '▼ Expand'}</span>
          </button>
          \${isOpen ? \`
            <div class="mantle-content-box">
              <div style="display: flex; justify-content: space-between; margin-bottom:12px;">
                <span style="font-size:11px; font-family:'IBM Plex Mono'; color:var(--hm);">Matrices Bound: \${(mantle.matrices||[]).length}</span>
                <button class="edit-mantle-btn" data-midx="\${mIdx}" style="font-size:11px; padding:4px 10px; background:transparent; border:1px solid var(--panel-line); color:var(--ink); cursor:pointer;">⚙ Edit Layout</button>
              </div>
              <div class="mantle-sub-group">
                <h4>Passive Effects</h4>
                <div class="mantle-btn-row">
                  \${(mantle.effects || []).map((eff, eIdx) => \`
                    <button class="mantle-toggle-btn \${subKey === 'eff_' + eIdx ? 'active' : ''}" data-midx="\${mIdx}" data-target="eff_\${eIdx}">
                      \${eff.name || 'Unnamed Effect'}
                    </button>
                  \`).join('')}
                </div>
              </div>
              <div class="mantle-sub-group">
                <h4>Component Matrices</h4>
                <div class="mantle-btn-row">
                  \${(mantle.matrices || []).map((mat, matIdx) => \`
                    <button class="mantle-toggle-btn \${subKey === 'mat_' + matIdx ? 'active' : ''}" data-midx="\${mIdx}" data-target="mat_\${matIdx}">
                      ⚡ \${mat.name || 'Unnamed Matrix'}
                    </button>
                  \`).join('')}
                </div>
              </div>
              \${subKey ? renderMantlePopdownContent(mantle, subKey) : ''}
            </div>
          \` : ''}
        </div>
      \`;
    }

    function renderMantlePopdownContent(mantle, subKey) {
      const [type, idxStr] = subKey.split('_');
      const idx = parseInt(idxStr);
      if (type === 'eff') {
        const eff = mantle.effects[idx];
        if (!eff) return '';
        return \`<div class="mantle-popdown"><strong>\${eff.name || 'Unnamed Effect'}:</strong><p style="margin:6px 0 0; white-space: pre-wrap;">\${eff.effect || 'No description.'}</p></div>\`;
      } else if (type === 'mat') {
        const mat = mantle.matrices[idx];
        if (!mat) return '';
        return \`<div class="mantle-popdown" style="border-left-color: var(--wl);"><strong>\${mat.name || 'Unnamed Matrix'}</strong><span style="font-size:11px; color:var(--ink-dim); margin-left:8px; font-family:'IBM Plex Mono';">Tags: [\${mat.tags||'None'}] | Area: \${mat.area||'None'} | Aspect: \${mat.aspect||'None'}</span><p style="margin:6px 0 0; white-space: pre-wrap;">\${mat.effect || 'No rules parameters.'}</p></div>\`;
      }
      return '';
    }

    function attachHandlers(){
      document.getElementById('char-name').oninput = e=>{ state.name = e.target.value; };
      
      document.getElementById('tier-macro-select').onchange = e=>{ 
        if(e.target.value) {
          applyTierMacroBaseline(e.target.value); 
          render(); 
        }
      };
      
      document.getElementById('stat-hm').onchange = e=>{
        const val = Number(e.target.value)||0;
        const total = state.thaumagen.hm.sub + state.thaumagen.hm.data + state.thaumagen.hm.sync;
        if (val > total) {
          alert("You lack Depth...");
          render();
          return;
        }
        state.hm = val; autoEvaluateTierThreshold(); render();
      };
      
      document.getElementById('stat-sn').onchange = e=>{
        const val = Number(e.target.value)||0;
        const total = state.thaumagen.sn.sub + state.thaumagen.sn.data + state.thaumagen.sn.sync;
        if (val > total) {
          alert("You lack Depth...");
          render();
          return;
        }
        state.sn = val; autoEvaluateTierThreshold(); render();
      };
      
      document.getElementById('stat-wl').onchange = e=>{
        const val = Number(e.target.value)||0;
        const total = state.thaumagen.wl.sub + state.thaumagen.wl.data + state.thaumagen.wl.sync;
        if (val > total) {
          alert("You lack Depth...");
          render();
          return;
        }
        state.wl = val; autoEvaluateTierThreshold(); render();
      };
      
      document.getElementById('flat-health').oninput = e=>{ state.flatHealthBonus = Number(e.target.value)||0; render(); };

      document.getElementById('export-app-btn').onclick = exportCharacterAppFile;

      document.getElementById('derived-thauma').onclick = () => {
        promptTrackerUpdate("Thauma", state.currentThauma, calcMaxThauma());
      };
      document.getElementById('derived-health').onclick = () => {
        promptTrackerUpdate("Health", state.currentHealth, calcMaxHealth());
      };

      document.querySelectorAll('[data-roll]').forEach(btn=>{
        btn.onclick = ()=>{
          const group = getGroupData();
          const ability = fmt(calcAbility());
          const type = btn.dataset.roll;

          if(type === 'oneDx') {
            const d1 = 1+Math.floor(Math.random()*group.sides);
            rollOutputs.oneDx = \`1d\${group.sides}: [<b>\${d1}</b>]\`;
          } else if(type === 'fullDx'){
            const rolls = rollDice(group.n, group.sides);
            const total = rolls.reduce((a,b)=>a+b,0);
            rollOutputs.fullDx = \`[\${rolls.join(', ')}] = <b>\${total}</b>\`;
          } else if(type === 'hit' || type === 'resist'){
            const d1 = 1+Math.floor(Math.random()*group.sides);
            rollOutputs[type] = \`1d\${group.sides} [\${d1}] + Ab \${ability} = <b>\${fmt(d1+ability)}</b>\`;
          } else if(type === 'init'){
            const d1 = 1+Math.floor(Math.random()*group.sides);
            rollOutputs.init = \`Ab \${ability} + 1d\${group.sides} [\${d1}] = <b>\${fmt(ability+d1)}</b>\`;
          }
          render();
        };
      });

      document.querySelectorAll('[data-clear]').forEach(btn => {
        btn.onclick = () => {
          rollOutputs[btn.dataset.clear] = '';
          render();
        };
      });

      document.querySelectorAll('.summon-roll-btn').forEach(btn => {
        btn.onclick = () => {
          const group = getGroupData();
          const san = Number(state.sn) || 0;
          const d20 = 1 + Math.floor(Math.random() * 20);
          const dxRoll = 1 + Math.floor(Math.random() * group.sides);
          rollOutputs.summon = \`<b>\${state.summons[btn.dataset.summonIdx].name || "Unnamed Summon"}:</b> d20[\${d20}] + 1d\${group.sides}[\${dxRoll}] + Sanity[\${san}] = <b>\${d20 + dxRoll + san}</b>\`;
          render();
        };
      });

      document.querySelectorAll('[data-bank]').forEach(inp=>{
        inp.oninput = e=>{
          const [stat,type] = e.target.dataset.bank.split('-');
          state.thaumagen[stat][type] = Number(e.target.value)||0;
          render();
        };
      });

      ['matrices','merits','items','summons'].forEach(key=>{
        const container = document.querySelector(\`[data-list="\${key}"]\`);
        if(!container) return;
        container.querySelectorAll('.entry').forEach(entryEl=>{
          const idx = Number(entryEl.dataset.idx);
          entryEl.querySelectorAll('[data-field]').forEach(inp=>{
            inp.oninput = e=>{ state[key][idx][e.target.dataset.field] = e.target.value; };
          });
        });
      });

      document.querySelectorAll('[data-addlist]').forEach(btn=>{
        btn.onclick = ()=>{ state[btn.dataset.addlist].push({name:'', isEditing:true, isOpen:false}); render(); };
      });
      document.querySelectorAll('[data-remove]').forEach(btn=>{
        btn.onclick = ()=>{
          const [key,idx] = btn.dataset.remove.split(':');
          state[key].splice(Number(idx),1);
          render();
        };
      });
      document.querySelectorAll('.entry-title-btn').forEach(btn=>{
        btn.onclick = ()=>{
          const key = btn.dataset.togglekey, idx = Number(btn.dataset.idx);
          state[key][idx].isOpen = !state[key][idx].isOpen;
          render();
        };
      });
      document.querySelectorAll('.edit-entry-btn').forEach(btn=>{
        btn.onclick = ()=>{
          const key = btn.dataset.editkey, idx = Number(btn.dataset.idx);
          state[key][idx].isEditing = true;
          render();
        };
      });
      document.querySelectorAll('.save-entry-btn').forEach(btn=>{
        btn.onclick = ()=>{
          const key = btn.dataset.savekey, idx = Number(btn.dataset.idx);
          state[key][idx].isEditing = false;
          state[key][idx].isOpen = true;
          render();
        };
      });

      const addMantleBtn = document.getElementById('add-mantle-btn');
      if(addMantleBtn) {
        addMantleBtn.onclick = () => {
          state.mantles.push({ name: '', isEditing: true, isOpen: false, openSubKey: null, matrices: [], effects: [] });
          render();
        };
      }
      document.querySelectorAll('.mantle-title-btn').forEach(btn => {
        btn.onclick = () => { const idx = parseInt(btn.dataset.midx); state.mantles[idx].isOpen = !state.mantles[idx].isOpen; render(); };
      });
      document.querySelectorAll('.mantle-toggle-btn').forEach(btn => {
        btn.onclick = () => {
          const idx = parseInt(btn.dataset.midx); const target = btn.dataset.target;
          state.mantles[idx].openSubKey = (state.mantles[idx].openSubKey === target) ? null : target;
          render();
        };
      });
      document.querySelectorAll('.edit-mantle-btn').forEach(btn => {
        btn.onclick = () => { state.mantles[parseInt(btn.dataset.midx)].isEditing = true; render(); };
      });
      document.querySelectorAll('.save-mantle-btn').forEach(btn => {
        btn.onclick = () => { const idx = parseInt(btn.dataset.midx); state.mantles[idx].isEditing = false; state.mantles[idx].isOpen = true; render(); };
      });
      document.querySelectorAll('.remove-mantle-btn').forEach(btn => {
        btn.onclick = () => { state.mantles.splice(parseInt(btn.dataset.midx), 1); render(); };
      });
      document.querySelectorAll('.mantle-name-input').forEach(inp => {
        inp.oninput = e => { state.mantles[parseInt(inp.dataset.midx)].name = e.target.value; };
      });
      document.querySelectorAll('.add-mantle-eff').forEach(btn => {
        btn.onclick = () => { state.mantles[parseInt(btn.dataset.midx)].effects.push({ name: '', effect: '' }); render(); };
      });
      document.querySelectorAll('.delete-mantle-eff').forEach(btn => {
        btn.onclick = () => { state.mantles[parseInt(btn.dataset.midx)].effects.splice(parseInt(btn.dataset.eidx), 1); render(); };
      });
      document.querySelectorAll('.mantle-eff-name').forEach(inp => {
        inp.oninput = e => { state.mantles[parseInt(inp.dataset.midx)].effects[parseInt(inp.dataset.eidx)].name = e.target.value; };
      });
      document.querySelectorAll('.mantle-eff-desc').forEach(txt => {
        txt.oninput = e => { state.mantles[parseInt(txt.dataset.midx)].effects[parseInt(txt.dataset.eidx)].effect = e.target.value; };
      });
      document.querySelectorAll('.add-mantle-mat').forEach(btn => {
        btn.onclick = () => { state.mantles[parseInt(btn.dataset.midx)].matrices.push({ name: '', tags: '', area: '', aspect: '', effect: '' }); render(); };
      });
      document.querySelectorAll('.delete-mantle-mat').forEach(btn => {
        btn.onclick = () => { state.mantles[parseInt(btn.dataset.midx)].matrices.splice(parseInt(btn.dataset.matidx), 1); render(); };
      });
      document.querySelectorAll('.mantle-mat-name').forEach(inp => {
        inp.oninput = e => { state.mantles[parseInt(inp.dataset.midx)].matrices[parseInt(inp.dataset.matidx)].name = e.target.value; };
      });
      document.querySelectorAll('.mantle-mat-tags').forEach(inp => {
        inp.oninput = e => { state.mantles[parseInt(inp.dataset.midx)].matrices[parseInt(inp.dataset.matidx)].tags = e.target.value; };
      });
      document.querySelectorAll('.mantle-mat-area').forEach(inp => {
        inp.oninput = e => { state.mantles[parseInt(inp.dataset.midx)].matrices[parseInt(inp.dataset.matidx)].area = e.target.value; };
      });
      document.querySelectorAll('.mantle-mat-aspect').forEach(inp => {
        inp.oninput = e => { state.mantles[parseInt(inp.dataset.midx)].matrices[parseInt(inp.dataset.matidx)].aspect = e.target.value; };
      });
      document.querySelectorAll('.mantle-mat-desc').forEach(txt => {
        txt.oninput = e => { state.mantles[parseInt(txt.dataset.midx)].matrices[parseInt(txt.dataset.matidx)].effect = e.target.value; };
      });
    }

    // ============ INITIALIZATION & AUTO-HYDRATION ============
    (function init(){
      if (EMBEDDED_CHARACTER_DATA && typeof EMBEDDED_CHARACTER_DATA === 'object') {
        // Deep merge/fallback-hydration for safety against missing keys from old schema exports
        state = {
          ...DEFAULT_CHAR(),
          ...EMBEDDED_CHARACTER_DATA,
          thaumagen: {
            ...DEFAULT_CHAR().thaumagen,
            ...(EMBEDDED_CHARACTER_DATA.thaumagen || {})
          }
        };
      }
      render();
    })();
  </script>
</body>
</html>
`;
