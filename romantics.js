document.addEventListener("DOMContentLoaded", () => {
    // Navigation Logic
    const interactiveLinks = document.querySelectorAll(".nl");
    interactiveLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const pageId = link.getAttribute("data-page");
            const navIndex = link.getAttribute("data-index");

            document.querySelectorAll(".pg").forEach((page) => {
                page.classList.remove("on");
            });

            const targetPage = document.getElementById("pg-" + pageId);
            if (targetPage) {
                targetPage.classList.add("on");
            }

            document
                .querySelectorAll(".nl")
                .forEach((n) => n.classList.remove("active"));
            if (navIndex !== null) {
                const targetNav = document.getElementById("n" + navIndex);
                if (targetNav) targetNav.classList.add("active");
            }

            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    // Cursor Logic
    const cursor = document.querySelector(".cursor-glow");
    document.addEventListener("mousemove", (e) => {
        requestAnimationFrame(() => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        });
    });

    // Phillosophy Tabs
    const philosophyTabs = document.querySelectorAll(".ti");
    philosophyTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const sectionId = tab.getAttribute("data-phil");
            document.querySelectorAll(".ti").forEach((t) => t.classList.remove("on"));
            tab.classList.add("on");

            document.querySelectorAll(".phil-section").forEach((section) => {
                section.classList.toggle("on", section.id === "pp-" + sectionId);
            });
        });
    });

    // Stars
    function renderOriginalHeroCanvas() {
        const c = document.getElementById("hero-canvas");
        if (!c) return;

        let W, H;
        const ctx = c.getContext("2d");

        function setSize() {
            // Using parent dimensions to guarantee it never collapses to 0
            W = c.parentElement.getBoundingClientRect().width || 800;
            H = c.parentElement.getBoundingClientRect().height || 500;
            c.width = W;
            c.height = H;
        }

        window.addEventListener("resize", setSize);
        setSize();

        const stars = [];
        for (let i = 0; i < 500; i++) {
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H * 0.7,
                r: Math.random() * 1.2 + 0.2,
                o: Math.random() * 0.6 + 0.1,
                spd: Math.random() * 0.003 + 0.001,
            });
        }

        const embers = [];
        for (let i = 0; i < 100; i++) {
            embers.push({
                x: Math.random() * W,
                y: H * 0.5 + Math.random() * H * 0.5,
                vy: -(Math.random() * 0.4 + 0.1),
                vx: (Math.random() - 0.5) * 0.3,
                life: Math.random(),
                maxLife: Math.random() * 180 + 80,
                r: Math.random() * 1.5 + 0.5,
            });
        }

        let t = 0;
        function draw() {
            // Dark base with slight trail effect
            ctx.fillStyle = "rgba(5,2,5,.25)";
            ctx.fillRect(0, 0, W, H);

            // Draw drifting stars/fog specs
            stars.forEach((s) => {
                s.o += Math.sin(t * s.spd) * 0.008;
                ctx.globalAlpha = Math.max(0.05, Math.min(0.7, s.o));
                ctx.fillStyle = "#d4c5a9";
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw rising embers
            embers.forEach((e) => {
                e.x += e.vx;
                e.y += e.vy;
                e.life++;
                if (e.life > e.maxLife) {
                    e.x = Math.random() * W;
                    e.y = H * 0.7 + Math.random() * H * 0.3;
                    e.life = 0;
                    e.maxLife = Math.random() * 180 + 80;
                    e.vy = -(Math.random() * 0.4 + 0.1);
                }
                const prog = e.life / e.maxLife;
                ctx.globalAlpha =
                    prog < 0.3 ? (prog / 0.3) * (1 - prog) * 1.5 : 0.8 * (1 - prog);
                ctx.fillStyle = prog < 0.5 ? "#8b0000" : "#4a0000";
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.r * (1 - prog * 0.5), 0, Math.PI * 2);
                ctx.fill();
            });

            // Bottom gradient overlay
            ctx.globalAlpha = 1;
            const grad = ctx.createRadialGradient(
                W * 0.55,
                H * 0.4,
                0,
                W * 0.55,
                H * 0.4,
                W * 0.45,
            );
            grad.addColorStop(0, "rgba(100,0,0,.04)");
            grad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);

            t++;
            requestAnimationFrame(draw);
        }
        draw();
    }

    // Initialize animation
    renderOriginalHeroCanvas();
});
