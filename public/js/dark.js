/* ==========================================================
   DARK MODE TOGGLE
   The theme is applied to <html> and <body> as .dark-mode and
   mirrored onto Bootstrap's own data-bs-theme attribute, so
   Bootstrap components (forms, alerts, close buttons, the
   navbar toggler) recolour themselves too.
   ========================================================== */

(function () {
    const root = document.documentElement;

    function applyTheme(theme) {
        const isDark = theme === "dark";

        root.classList.toggle("dark-mode", isDark);
        root.setAttribute("data-bs-theme", isDark ? "dark" : "light");

        if (document.body) {
            document.body.classList.toggle("dark-mode", isDark);
        }

        const icon = document.querySelector("#dark-mode-toggle i");
        if (icon) {
            icon.classList.toggle("fa-moon", !isDark);
            icon.classList.toggle("fa-sun", isDark);
        }

        const btn = document.querySelector("#dark-mode-toggle");
        if (btn) {
            btn.setAttribute("aria-pressed", String(isDark));
            btn.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
            btn.setAttribute("title", isDark ? "Light mode" : "Dark mode");
        }
    }

    function storedTheme() {
        const saved = localStorage.getItem("darkMode");

        if (saved === "enabled") return "dark";
        if (saved === "disabled") return "light";

        // no choice saved yet - follow the operating system setting
        return window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    applyTheme(storedTheme());

    function wireUp() {
        // re-apply so the icon and body class are set once the DOM exists
        applyTheme(root.classList.contains("dark-mode") ? "dark" : "light");

        const darkModeBtn = document.querySelector("#dark-mode-toggle");
        if (!darkModeBtn) return;

        darkModeBtn.addEventListener("click", () => {
            const nowDark = !root.classList.contains("dark-mode");

            applyTheme(nowDark ? "dark" : "light");
            localStorage.setItem("darkMode", nowDark ? "enabled" : "disabled");
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", wireUp);
    } else {
        wireUp();
    }
})();
