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

    // Background Music
    function initBackgroundMusic() {
        const music = document.getElementById("bg-music");
        const toggle = document.querySelector(".music-toggle");
        if (!music || !toggle) return;

        music.volume = 0.28;

        function setPlaying(isPlaying) {
            toggle.classList.toggle("is-playing", isPlaying);
        }

        function playMusic() {
            const attempt = music.play();
            if (attempt && typeof attempt.then === "function") {
                attempt.then(() => setPlaying(true)).catch(() => setPlaying(false));
            } else {
                setPlaying(true);
            }
        }

        toggle.addEventListener("click", () => {
            if (music.paused) {
                playMusic();
            } else {
                music.pause();
                setPlaying(false);
            }
        });

        music.addEventListener("play", () => setPlaying(true));
        music.addEventListener("pause", () => setPlaying(false));
        setPlaying(false);
    }

    initBackgroundMusic();

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

    function initSiteSearch() {
        const search = document.querySelector(".site-search");
        if (!search) return;

        const input = search.querySelector(".site-search-input");
        const clearButton = search.querySelector(".site-search-clear");
        const results = search.querySelector(".site-search-results");
        if (!input || !clearButton || !results) return;

        const compactText = (text) => text.replace(/\s+/g, " ").trim();
        const normalizeText = (text) =>
            compactText(text)
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
        const getText = (root, selector) => {
            const element = root.querySelector(selector);
            return element ? compactText(element.textContent) : "";
        };
        const limitSnippet = (text) => {
            const compact = compactText(text);
            return compact.length > 120 ? compact.slice(0, 117) + "..." : compact;
        };
        const createItem = ({ page, section, title, meta = "", body = "", target, philKey = "" }) => ({
            page,
            section,
            title: compactText(title),
            meta: compactText(meta),
            body: compactText(body),
            target,
            philKey,
            searchText: normalizeText([section, title, meta, body].join(" ")),
        });

        function buildSearchIndex() {
            const items = [];
            const hero = document.querySelector("#pg-home .hero");
            if (hero) {
                items.push(
                    createItem({
                        page: "home",
                        section: "Home",
                        title: getText(hero, ".h1"),
                        meta: getText(hero, ".eyebrow"),
                        body: getText(hero, ".hero-sub"),
                        target: hero,
                    }),
                );
            }

            document.querySelectorAll("#pg-home .tc").forEach((card) => {
                items.push(
                    createItem({
                        page: "home",
                        section: "Core Themes",
                        title: getText(card, ".tc-title"),
                        meta: getText(card, ".tc-num"),
                        body: getText(card, ".tc-body"),
                        target: card,
                    }),
                );
            });

            document.querySelectorAll("#pg-artists .ac").forEach((card) => {
                items.push(
                    createItem({
                        page: "artists",
                        section: "Artists",
                        title: getText(card, ".ac-name"),
                        meta: [getText(card, ".ac-dates"), getText(card, ".ac-tag")].join(" "),
                        body: getText(card, ".ac-bio"),
                        target: card,
                    }),
                );
            });

            document.querySelectorAll("#pg-gallery .gi").forEach((card) => {
                items.push(
                    createItem({
                        page: "gallery",
                        section: "Gallery",
                        title: getText(card, ".gi-title") || getText(card, ".gi-img"),
                        meta: [getText(card, ".gi-artist"), getText(card, ".gi-year")].join(" "),
                        body: card.getAttribute("href") || "",
                        target: card,
                    }),
                );
            });

            document.querySelectorAll("#pg-phil .phil-section").forEach((section) => {
                const philKey = section.id.replace("pp-", "");
                items.push(
                    createItem({
                        page: "phil",
                        section: "Philosophy",
                        title: getText(section, ".ph2"),
                        body: getText(section, ".phil-body"),
                        target: section,
                        philKey,
                    }),
                );
            });

            return items.filter((item) => item.title && item.target);
        }

        const searchIndex = buildSearchIndex();
        let currentMatches = [];

        function closeResults() {
            search.classList.remove("open");
            results.textContent = "";
            currentMatches = [];
        }

        function openResult(item) {
            document.querySelectorAll(".pg").forEach((page) => {
                page.classList.remove("on");
            });

            const targetPage = document.getElementById("pg-" + item.page);
            if (targetPage) {
                targetPage.classList.add("on");
            }

            document
                .querySelectorAll(".nl")
                .forEach((n) => n.classList.remove("active"));
            document.querySelectorAll(".nl").forEach((navItem) => {
                if (navItem.getAttribute("data-page") === item.page) {
                    navItem.classList.add("active");
                }
            });

            if (item.philKey) {
                document.querySelectorAll(".ti").forEach((tab) => {
                    tab.classList.toggle("on", tab.getAttribute("data-phil") === item.philKey);
                });

                document.querySelectorAll(".phil-section").forEach((section) => {
                    section.classList.toggle("on", section.id === "pp-" + item.philKey);
                });
            }

            closeResults();
            input.blur();

            window.setTimeout(() => {
                item.target.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 80);
        }

        function appendResult(item) {
            const button = document.createElement("button");
            button.className = "site-search-result";
            button.type = "button";
            button.setAttribute("role", "option");

            const kicker = document.createElement("span");
            kicker.className = "site-search-result-kicker";
            kicker.textContent = item.section;

            const title = document.createElement("span");
            title.className = "site-search-result-title";
            title.textContent = item.title;

            const snippet = document.createElement("span");
            snippet.className = "site-search-result-snippet";
            snippet.textContent = limitSnippet([item.meta, item.body].join(" "));

            button.append(kicker, title, snippet);
            button.addEventListener("click", () => openResult(item));
            results.append(button);
        }

        function renderEmptyResult() {
            const empty = document.createElement("div");
            empty.className = "site-search-empty";
            empty.textContent = "No matches found";
            results.append(empty);
        }

        function scoreResult(item, query) {
            const title = normalizeText(item.title);
            if (title === query) return 0;
            if (title.startsWith(query)) return 1;
            if (title.includes(query)) return 2;
            return 3;
        }

        function renderSearch() {
            const rawQuery = input.value.trim();
            const query = normalizeText(rawQuery);
            search.classList.toggle("has-query", rawQuery.length > 0);
            results.textContent = "";

            if (!query) {
                closeResults();
                return;
            }

            const terms = query.split(" ").filter(Boolean);
            currentMatches = searchIndex
                .filter((item) => terms.every((term) => item.searchText.includes(term)))
                .sort((a, b) => scoreResult(a, query) - scoreResult(b, query))
                .slice(0, 8);

            if (currentMatches.length) {
                currentMatches.forEach(appendResult);
            } else {
                renderEmptyResult();
            }

            search.classList.add("open");
        }

        input.addEventListener("input", renderSearch);
        input.addEventListener("focus", () => {
            if (input.value.trim()) renderSearch();
        });
        input.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeResults();
                input.blur();
            }
            if (event.key === "Enter" && currentMatches.length) {
                event.preventDefault();
                openResult(currentMatches[0]);
            }
        });

        clearButton.addEventListener("click", () => {
            input.value = "";
            search.classList.remove("has-query");
            closeResults();
            input.focus();
        });

        document.addEventListener("click", (event) => {
            if (!search.contains(event.target)) closeResults();
        });
    }

    initSiteSearch();

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
