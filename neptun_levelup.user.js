// ==UserScript==
// @name         Neptun LevelUP! - Javítás
// @namespace    http://tampermonkey.net/
// @version      V1.1
// @description  Univerzális Neptun csomag
// @updateURL    https://raw.githubusercontent.com/Marcuss-works/Neptun-LevelUP/main/neptun_levelup.user.js
// @downloadURL  https://raw.githubusercontent.com/Marcuss-works/Neptun-LevelUP/main/neptun_levelup.user.js
// @author       Marcuss
// @match        *://*.uni-obuda.hu/*
// @match        *://*.elte.hu/*
// @match        *://*.u-szeged.hu/*
// @match        *://*.pte.hu/*
// @match        *://*.uni-corvinus.hu/*
// @match        *://*.bme.hu/*
// @match        *://*.uni-miskolc.hu/*
// @match        *://*.sze.hu/*
// @match        *://*.uni-nke.hu/*
// @match        *://*.unideb.hu/*
// @match        *://*.uni-pannon.hu/*
// @match        *://*.uni-sopron.hu/*
// @match        *://*.nje.hu/*
// @match        *://*.uni-eszterhazy.hu/*
// @match        *://*.uni-mate.hu/*
// @match        *://*.tkp.hu/*
// @match        *://*.uni-bge.hu/*
// @match        *://*.metropolitan.hu/*
// @match        *://*.mome.hu/*
// @match        *://*.se-nka.hu/*
// @match        *://*.semmelweis.hu/*
// @match        *://*.kre.hu/*
// @match        *://*.ppke.hu/*
// @match        *://*.nye.hu/*
// @match        *://*.ke.hu/*
// @match        *://*.duf.hu/*
// @match        *://*.ejfe.hu/*
// @match        *://*.szfe.hu/*
// @match        *://*.lfze.hu/*
// @match        *://*.mke.hu/*
// @match        *://*.uni-milton.hu/*
// @match        *://*.kodolanyi.hu/*
// @match        *://*.edutus.hu/*
// @match        *://*.wsuf.hu/*
// @match        *://*.atvsz.hu/*
// @match        *://*.wjlf.hu/*
// @match        *://*.avkf.hu/*
// @match        *://*.bjhf.hu/*
// @match        *://*.drhe.hu/*
// @match        *://*.srhe.hu/*
// @match        *://*.pattantyus.hu/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Kizárjuk az e-learninget és a moodle-t
    if (window.location.href.includes("elearning") || window.location.href.includes("moodle")) {
        return;
    }

    // ÚJ SZŰRŐ: Csak akkor fusson, ha Neptun-specifikus az URL
    // A legtöbb Neptun ezeket használja: login.aspx, main.aspx vagy /hallgato/
    const isNeptun = /login\.aspx|main\.aspx|hallgato|oktato/i.test(window.location.href);

    // Ha nem Neptun oldalon vagyunk, álljunk meg
    if (!isNeptun) {
        return;
    }

    // --- Innentől jön a kódod többi része ---

     // ---Menü rendszer---
    const THEMES = {
        white:   { main: '#ffffff', bg: '#202020', accent: '#F3F3F3' },
        red:     { main: '#e23d30', bg: '#0d0221', accent: '#00d4ff' },
        rose:    { main: '#FF66B2', bg: '#202020', accent: '#ffff66' },
        levelup: { main: '#00dea4', bg: '#181818', accent: '#00fa9a' },
        violet:  { main: '#B266FF', bg: '#000000', accent: '#00ff00' },
        ocean:   { main: '#3399FF', bg: '#001a33', accent: '#00ccff' },
        gold:    { main: '#ffcc00', bg: '#1a1a00', accent: '#ffff66' },
    };

    const getSettings = () => {
        const defaults = {
            Automatikus_belépés: true,
            Animációk: true,
            Végtelen_munkamenet: true,
            Ping_kijelzés : true,
            Automatikus_próbálkozás: true,
            Sötét_mód: true,
            Szerver_idő: true,
            theme: 'levelup',
            activeAccount: null //
        };
        const saved = localStorage.getItem('marcuss_settings');
        return saved ? JSON.parse(saved) : defaults;
    };

    let CONFIG = getSettings();

    // Fiókok lekérése (tömbként)
    const getAccounts = () => {
        const accs = localStorage.getItem('marcuss_accounts');
        return accs ? JSON.parse(accs) : [];
    };

    // Az aktuálisan kiválasztott fiók adatai
    const getActiveCredentials = () => {
        const accounts = getAccounts();
        return accounts.find(a => a.user === CONFIG.activeAccount) || null;
    };

    let credentials = getActiveCredentials();

    // ÁLLAPOTOK
    let belepesFolyamatban = false, loginElkuldve = false, manualisStop = false;

    const injectStyles = () => {
        let style = document.getElementById('levelup-dynamic-css');
        if (!style) { style = document.createElement('style'); style.id = 'levelup-dynamic-css'; document.head.appendChild(style); }
        const t = THEMES[CONFIG.theme] || THEMES.levelup;
        style.innerHTML = `
            :root { --lu-main: ${t.main}; --lu-bg: ${t.bg}; --lu-accent: ${t.accent}; }
            #lu-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); backdrop-filter: blur(8px); z-index: 1000009; display: none; opacity: 0; transition: opacity 0.3s; }
            #levelup-modal { position: fixed; top: 55%; left: 50%; transform: translate(-50%, -40%); background: var(--lu-bg); border: 1px solid var(--lu-main); border-radius: 16px; color: white; font-family: 'Segoe UI', sans-serif; z-index: 1000010; box-shadow: 0 20px 60px rgba(0,0,0,0.8); width: 600px; overflow: hidden; display: none; flex-direction: column; opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            #levelup-modal.active { opacity: 1; top: 50%; transform: translate(-50%, -50%); }
            #lu-ping-container { border: 1px solid var(--lu-main) !important; }
            .lu-header { background: var(--lu-main); color: black; padding: 15px; font-weight: bold; text-align: center; font-size: 18px; position: relative; }
            #lu-close-x { position: absolute; right: 15px; top: 12px; cursor: pointer; font-size: 22px; transition: transform 0.2s; }
            #lu-close-x:hover { transform: scale(1.3) rotate(90deg); color: #ff0000; }
            .lu-body { display: flex; padding: 25px; gap: 20px; }
            .lu-col { flex: 1; display: flex; flex-direction: column; gap: 15px; }
            .lu-divider { width: 1px; background: rgba(255,255,255,0.1); margin: 0 10px; }
            .lu-module-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
            .lu-module-row:hover { background: rgba(255,255,255,0.08); }
            .lu-module-row input { cursor: pointer; accent-color: var(--lu-main); width: 18px; height: 18px; }
            .lu-btn { background: var(--lu-main); color: black; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.3s; }
            .lu-btn:hover { filter: brightness(1.2); transform: translateY(-2px); }
            .lu-btn-danger { background: #ff4444; color: white; }
            #levelup-launcher { position: fixed; bottom: 5px; left: 7px; width: 55px; height: 55px; background: var(--lu-bg); border: 2px solid var(--lu-main); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000008; font-size: 26px; transition: all 0.4s; }
            #levelup-launcher:hover { transform: rotate(45deg) scale(1.1); box-shadow: 0 0 20px var(--lu-main); background: var(--lu-main); color: black; }
            #marcuss-timer-ui { position: fixed; top: 20px; right: 20px; padding: 15px; background: #1e1e1e; color: var(--lu-main); border: 2px solid var(--lu-main); border-radius: 10px; z-index: 1000009; font-weight: bold; text-align: center; min-width: 150px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
            .lu-theme-picker { display: flex; gap: 10px; flex-wrap: wrap; }
            .lu-theme-circle { width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255,255,255,0.1); transition: all 0.3s; }
            .lu-theme-circle.active { border-color: white !important; transform: scale(1.2); }
        `;
    };

     // ---Automatikus beléptető ---
    const observeLogin = () => {
        const observer = new MutationObserver(() => {
            const uField = document.querySelector('input[test-id="login-user"], input#user, input[name*="user"]');
            const pField = document.querySelector('input[test-id="login-password"], input#pwd, input[type="password"]');
            const btn = document.querySelector('button[test-id="login-button"], #btnSubmit, #Submit');
            const isInside = document.querySelector('#lblSignOut, #btnKijelentkezes, .top_menu_wrapper');

            if (isInside) {
                manualisStop = false;
                loginElkuldve = false;
                belepesFolyamatban = false;
                return;
            }

            if (manualisStop) return;
            if (loginElkuldve || !CONFIG.Automatikus_belépés || belepesFolyamatban) return;
            if (uField && pField && btn && credentials.user) {
                if (uField.value === "" || uField.value === credentials.user) {
                    Automatikus_belépés(uField, pField, btn);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    const Automatikus_belépés = (u, p, btn) => {
        belepesFolyamatban = true;
        const ui = document.createElement('div');
        ui.id = 'marcuss-timer-ui';
        document.body.appendChild(ui);

        let sec = 3;
        const t = setInterval(() => {
            if (manualisStop) {
                clearInterval(t);
                ui.innerHTML = "MEGÁLLÍTVA";
                ui.style.borderColor = "#ff4444";
                setTimeout(() => { if(ui) ui.remove(); belepesFolyamatban = false; }, 2000);
                return;
            }

            ui.innerHTML = `BEJELENTKEZÉS<br><span style="font-size:22px;">${sec}s</span>`;

            if (sec <= 0) {
                clearInterval(t);
                loginElkuldve = true;
                ui.innerHTML = "BELÉPÉS...";
                u.value = credentials.user;
                p.value = credentials.pass;
                const tr = (el) => {
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    el.dispatchEvent(new Event('change', { bubbles: true }));
                };
                tr(u); tr(p);
                setTimeout(() => { btn.click(); }, 100);
                setTimeout(() => { if(ui) ui.remove(); belepesFolyamatban = false; loginElkuldve = false; }, 5000);
            }
            sec--;
        }, 1000);
    };

    // --- DASHBOARD ÉS EGYÉB MODULOK ---

    // --- Dashboard ---
    const showDashboard = () => {
        let modal = document.getElementById('levelup-modal');
        let overlay = document.getElementById('lu-overlay');
        if (!modal) {
            overlay = document.createElement('div'); overlay.id = 'lu-overlay'; document.body.appendChild(overlay);
            modal = document.createElement('div'); modal.id = 'levelup-modal'; document.body.appendChild(modal);
        }

        const accounts = getAccounts();

        modal.innerHTML = `
            <div class="lu-header">🚀 Neptun LevelUP! <span id="lu-close-x">×</span></div>
            <div class="lu-body">
                <div class="lu-col">
                    <h4 style="margin:0; color:var(--lu-main);">👥 Fiókok kezelése</h4>
                    <div id="account-list" style="max-height: 150px; overflow-y: auto; display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px;">
                        ${accounts.map(acc => `
                            <div class="lu-module-row" style="border: 1px solid ${CONFIG.activeAccount === acc.user ? 'var(--lu-main)' : 'transparent'}; background: ${CONFIG.activeAccount === acc.user ? 'rgba(0,222,164,0.1)' : 'rgba(255,255,255,0.05)'};">
                                <span class="lu-select-acc" data-user="${acc.user}" style="flex-grow:1;">${acc.user} ${CONFIG.activeAccount === acc.user ? '✅' : ''}</span>
                                <span class="lu-del-acc" data-user="${acc.user}" style="color:#ff4444; cursor:pointer; padding: 0 5px;">×</span>
                            </div>
                        `).join('')}
                    </div>

                    <div style="display:flex; flex-direction:column; gap:5px; padding:10px; background:rgba(255,255,255,0.03); border-radius:8px;">
                        <input type="text" id="lu-u" placeholder="Neptun kód" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; padding:8px; border-radius:5px;">
                        <input type="password" id="lu-p" placeholder="Jelszó" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:white; padding:8px; border-radius:5px;">
                        <button id="lu-add-acc" class="lu-btn" style="padding:8px;">Mentés</button>
                    </div>

                    <h4 style="margin:15px 0 5px 0; color:var(--lu-main);">🌈 Stílus</h4>
                    <div class="lu-theme-picker">
                        ${Object.keys(THEMES).map(t => `<div class="lu-theme-circle ${CONFIG.theme === t ? 'active' : ''}" style="background:${THEMES[t].main}" data-theme="${t}"></div>`).join('')}
                    </div>
                </div>
                <div class="lu-divider"></div>
                <div class="lu-col">
                    <h4 style="margin:0; color:var(--lu-main);">🛠️ Modulok</h4>
                    <div id="lu-toggles">
                        ${['Automatikus_belépés', 'Animációk', 'Végtelen_munkamenet', 'Ping_kijelzés', 'Sötét_mód', 'Szerver_idő', 'Automatikus_próbálkozás'].map(key => {
                            const labels = {
                                Automatikus_belépés: "🤖 Automata belépés",
                                Animációk: "⚡ Animációk",
                                Végtelen_munkamenet: "🔄 Végtelen munkamenet",
                                Ping_kijelzés: "📶 Ping",
                                Sötét_mód: "🌙 Sötét mód",
                                Szerver_idő: "⏰ Szerver óra",
                                Automatikus_próbálkozás: "🚀 Auto-Retry"
                            };
                            return `
                                <label class="lu-module-row">
                                    <span>${labels[key] || key}</span>
                                    <input type="checkbox" data-key="${key}" ${CONFIG[key] ? 'checked' : ''}>
                                </label>`;
                        }).join('')}
                    </div>
                    <button id="lu-apply" class="lu-btn" style="margin-top:auto;">✅ MENTÉS ÉS ÚJRATÖLTÉS</button>
                </div>
            </div>`;

        overlay.style.display = 'block'; modal.style.display = 'flex';
        setTimeout(() => { overlay.style.opacity = '1'; modal.classList.add('active'); }, 10);

        // --- ESEMÉNYKEZELŐK ---

        // Bezárás
        modal.querySelector('#lu-close-x').onclick = () => {
            overlay.style.opacity = '0'; modal.classList.remove('active');
            setTimeout(() => { modal.style.display = 'none'; overlay.style.display = 'none'; }, 300);
        };

        // Fiók hozzáadása
        modal.querySelector('#lu-add-acc').onclick = () => {
            const u = modal.querySelector('#lu-u').value.trim().toUpperCase();
            const p = modal.querySelector('#lu-p').value;
            if(u && p) {
                let accs = getAccounts();
                accs = accs.filter(a => a.user !== u); // Duplikáció törlése
                accs.push({user: u, pass: p});
                localStorage.setItem('marcuss_accounts', JSON.stringify(accs));
                CONFIG.activeAccount = u; // Az új legyen az aktív
                localStorage.setItem('marcuss_settings', JSON.stringify(CONFIG));
                showDashboard(); // UI frissítés
            }
        };

        // Fiók kiválasztása (Váltás)
        modal.querySelectorAll('.lu-select-acc').forEach(el => {
            el.onclick = () => {
                CONFIG.activeAccount = el.dataset.user;
                localStorage.setItem('marcuss_settings', JSON.stringify(CONFIG));
                showDashboard();
            };
        });

        // Fiók törlése
        modal.querySelectorAll('.lu-del-acc').forEach(el => {
            el.onclick = (e) => {
                e.stopPropagation();
                if(confirm(`Töröljük a(z) ${el.dataset.user} fiókot?`)) {
                    let accs = getAccounts().filter(a => a.user !== el.dataset.user);
                    localStorage.setItem('marcuss_accounts', JSON.stringify(accs));
                    if(CONFIG.activeAccount === el.dataset.user) CONFIG.activeAccount = null;
                    localStorage.setItem('marcuss_settings', JSON.stringify(CONFIG));
                    showDashboard();
                }
            };
        });

        // Téma váltás
        modal.querySelectorAll('.lu-theme-circle').forEach(c => {
            c.onclick = () => { CONFIG.theme = c.dataset.theme; injectStyles(); showDashboard(); };
        });

        // Mentés gomb
        modal.querySelector('#lu-apply').onclick = () => {
            modal.querySelectorAll('#lu-toggles input').forEach(c => { CONFIG[c.dataset.key] = c.checked; });
            localStorage.setItem('marcuss_settings', JSON.stringify(CONFIG));
            location.reload();
        };
    };

    // --- Szerver_idő ---
    const Szerver_idő = () => {
        if (!CONFIG.Szerver_idő) return;
        let serverOffset = 0;
        const syncTime = async () => {
            try {
                const start = performance.now();
                const response = await fetch(window.location.origin + '/favicon.ico', { method: 'HEAD', cache: 'no-store' });
                const end = performance.now();
                const serverDateStr = response.headers.get('Date');

                if (serverDateStr) {
                    const serverTime = new Date(serverDateStr).getTime();
                    const localTime = Date.now();
                    const latancy = (end - start) / 2;
                    serverOffset = serverTime - localTime + latancy;
                    console.log(`%c[LevelUP] Idő szinkronizálva! Eltérés: ${(serverOffset / 1000).toFixed(2)}sec`, "color: #ffcc00");
                }
            } catch (e) { console.error("Szerver idő szinkron hiba:", e); }
        };

        // UI létrehozása
        const clockDiv = document.createElement('div');
        clockDiv.id = 'lu-server-clock';
        clockDiv.style = `
            position: fixed;
            top: 40px;
            left: 10px;
            color: var(--lu-main);
            font-family: 'Consolas', monospace;
            font-size: 13px;
            z-index: 1000000;
            background: rgba(0,0,0,0.8);
            padding: 5px 10px;
            border-radius: 20px;
            border: 1px solid var(--lu-main);
            pointer-events: none;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(clockDiv);

        const updateUI = () => {
            const correctedNow = new Date(Date.now() + serverOffset);
            const hours = String(correctedNow.getHours()).padStart(2, '0');
            const mins = String(correctedNow.getMinutes()).padStart(2, '0');
            const secs = String(correctedNow.getSeconds()).padStart(2, '0');
            const ms = Math.floor(correctedNow.getMilliseconds() / 100); // Csak az első tizedest mutatjuk

            clockDiv.innerHTML = `<span style="color:white">🌐 Szerver: ${hours}:${mins}:${secs}<span style="font-size:10px; opacity:0.7">.${ms}</span></span>`;
        };

        syncTime();
        setInterval(syncTime, 1000 * 60 * 5);
        setInterval(updateUI, 50);
    };

    // --- Ping kijelzés ---
    const Ping_kijelzés = () => {
        if (!CONFIG.Ping_kijelzés) return;
        const container = document.createElement('div');
        container.id = 'lu-ping-container';
        container.style = `
            position: fixed;
            top: 5px;
            left: 10px;
            padding: 5px 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            border: 1px solid var(--lu-main); /* FIX SZÍN HELYETT VÁLTOZÓ */
            border-radius: 20px;
            font-family: 'Consolas', monospace;
            font-size: 13px;
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 0px 10px rgba(0,0,0,0.3);
            pointer-events: none;
            transition: all 0.3s ease;
        `;
        const dot = document.createElement('div');
        dot.style = `width:10px; height:10px; background:#888; border-radius:50%;`;
        const text = document.createElement('span');
        text.innerText = "Szerver: -- ms";
        container.appendChild(dot); container.appendChild(text);
        document.body.appendChild(container);
        const check = async () => {
            const start = performance.now();
            try {
                await fetch('/favicon.ico', { cache: 'no-store', method: 'HEAD' });
                const ping = Math.round(performance.now() - start);
                text.innerText = `Szerver: ${ping} ms`;
                dot.style.background = ping < 100 ? "#00ff00" : (ping < 300 ? "#ffff00" : "#ff0000");
            } catch (e) { text.innerText = "OFFLINE"; dot.style.background = "#555"; }
        };
        setInterval(check, 1500); check();
    };

    // --- Animation Off ---
    const Animációk = () => {
        if (CONFIG.Animációk) return;
        const style = document.createElement('style');
        style.innerHTML = `* { transition: none !important; animation-duration: 0s !important; }`;
        document.head.appendChild(style);

        setInterval(() => {
            if (window.jQuery) window.jQuery.fx.off = true;
        }, 3000);
    };

    // --- Szerver túlterhelés ellen ---
    const startErrorRefresher = () => {
    if (!CONFIG.Automatikus_próbálkozás) return;
    const errorKeywords = [
        "túlterhelt", "overloaded", "hiba történt",
        "error occurred", "service unavailable", "adatbázis hiba",
        "neptun.error", "átmeneti hiba"
    ];

    const bodyText = document.body.innerText.toLowerCase();
    const isErrorPage = errorKeywords.some(keyword => bodyText.includes(keyword));
    if (isErrorPage || document.title.includes("Hiba") || document.title.includes("Error")) {

        const retryDiv = document.createElement('div');
        retryDiv.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #1a1a1a; color: #ff4444; z-index: 9999999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            font-family: 'Segoe UI', sans-serif; text-align: center;
        `;
        retryDiv.innerHTML = `
            <h1 style="font-size: 50px; margin-bottom: 10px;">⚠️ SZERVER HALOTT</h1>
            <p style="font-size: 20px; color: #ccc;">A LevelUP! automatikusan újrapróbálkozik...</p>
            <div style="margin-top: 20px; width: 50px; height: 50px; border: 5px solid #333; border-top: 5px solid #ff4444; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
        `;
        document.body.appendChild(retryDiv);

        setTimeout(() => {
            location.reload();
        }, 1500);
    }
};

   // --- Sötét_mód ---
    const Sötét_mód = () => {
        if (!CONFIG.Sötét_mód) return;
        const style = document.createElement('style');
        style.id = 'lu-dark-mode-css';
        style.innerHTML = `
            /* 1. Alap invertálás */
            html {
                filter: invert(0.9) hue-rotate(180deg) !important;
                background: #fff !important;
            }

            /* 2. VISSZAINVERTÁLÁS (Ami maradjon eredeti) */
            img, iframe,
            #levelup-modal, #levelup-launcher, #lu-overlay, #neptun-timer-ui, #lu-server-clock, #lu-ping-container,
            neptun-notification-bar, .footer, #footer, .bottom_menu_wrapper, #lblLablec,
            .footer__logo, .footer__informations, #menu-btn, textarea, .cke_inner,
            /* JAVÍTOTT NÉV: kötőjellel, ahogy fentebb létrehoztad */
            #marcuss-timer-ui {
                filter: invert(1) hue-rotate(180deg) !important;
            }

            /* 3. SZÖVEG FIXEK */
            .footer *, #footer *, neptun-notification-bar *, #marcuss-timer-ui * {
                color: inherit !important;
                -webkit-text-fill-color: inherit !important;
            }

            /* 4. SZERKESZTŐ MEZŐK */
            textarea {
                background-color: #fff !important;
                color: #000 !important;
            }
        `;
        document.head.appendChild(style);
    };

    // --- Végtelen munkamenet ---
    const Végtelen_munkamenet = () => {
        if (!CONFIG.Végtelen_munkamenet) return;
        let bearerToken = null;
        let refreshTokenValue = null;
        const getApiUrl = () => {
            const pathParts = window.location.pathname.split('/');
            const instance = pathParts[1] || 'hallgato'; // pl. 'hallgatoing' vagy 'hallgato'
            return `${window.location.origin}/${instance}/api/Account/GetNewTokens`;
        };
        const originalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            xhr.addEventListener('load', function() {
                if (this.responseURL.includes('Account/Authenticate') && this.status === 200) {
                    try {
                        const response = JSON.parse(this.responseText);
                        if (response.data && response.data.accessToken) {
                            bearerToken = response.data.accessToken;
                            refreshTokenValue = response.data.refreshToken;
                            console.log("%c[LevelUP] Új típusú munkamenet érzékelve. Végtelenítés aktív!", "color: #00dea4; font-weight: bold;");
                            scheduleRefresh();
                        }
                    } catch (e) { /* Nem JSON válasz, ignoráljuk */ }
                }
            });
            return xhr;
        };

        const scheduleRefresh = () => {
            setTimeout(() => {
                if (!refreshTokenValue || !bearerToken) return;

                const refreshXhr = new originalXHR();
                refreshXhr.open('POST', getApiUrl());
                refreshXhr.setRequestHeader('Authorization', 'Bearer ' + bearerToken);
                refreshXhr.setRequestHeader('Content-Type', 'application/json');

                refreshXhr.onload = function() {
                    if (this.status === 200) {
                        const res = JSON.parse(this.responseText);
                        bearerToken = res.accessToken;
                        refreshTokenValue = res.refreshToken;
                        console.log("%c[LevelUP] Tokenek sikeresen frissítve! (Végtelenítve)", "color: #3399FF");
                        scheduleRefresh();
                    } else {
                        console.warn("[LevelUP] Munkamenet frissítése sikertelen. Státusz:", this.status);
                    }
                };
                refreshXhr.send(JSON.stringify({ "refreshToken": refreshTokenValue }));
            }, 1000 * 60 * 7);
        };

        // Régi Neptun típusokhoz (biztonsági tartalék)
        setInterval(() => {
            if (!bearerToken) {
                fetch(window.location.href, { method: 'HEAD' }).catch(() => {});
            }
        }, 1000 * 60 * 5);
    };

    const init = () => {
        injectStyles();
        const launcher = document.createElement('div');
        launcher.id = 'levelup-launcher'; launcher.innerHTML = "🔧";
        launcher.onclick = showDashboard; document.body.appendChild(launcher);

        window.addEventListener('mousedown', (e) => {
            if (belepesFolyamatban && !e.target.closest('#levelup-modal') && !e.target.closest('#levelup-launcher') && !e.target.closest('#marcuss-timer-ui')) {
                manualisStop = true;
            }
        });

        observeLogin();
        Ping_kijelzés();
        Animációk();
        Sötét_mód();
        Szerver_idő();
        Végtelen_munkamenet();
        startErrorRefresher();
        console.log("🚀 Neptun LevelUP! Aktív!");
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

})();
