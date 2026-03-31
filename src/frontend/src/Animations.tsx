import { useEffect, useRef, useState } from "react";

// ─── Page Load Overlay ────────────────────────────────────────────────────────
export function PageLoadOverlay() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 400);
    const t2 = setTimeout(() => setVisible(false), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#04050a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1.8rem",
        opacity: fading ? 0 : 1,
        transition: "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* Spinning rings + logo */}
      <div style={{ position: "relative", width: "100px", height: "100px" }}>
        {/* Outer ring */}
        <div
          className="preloader-ring-1"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#4f6fff",
            borderRightColor: "#4f6fff40",
          }}
        />
        {/* Inner ring */}
        <div
          className="preloader-ring-2"
          style={{
            position: "absolute",
            inset: "12px",
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#9b5de5",
            borderLeftColor: "#9b5de540",
          }}
        />
        {/* Center logo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "1.6rem",
            background: "linear-gradient(135deg, #4f6fff, #9b5de5, #00d4ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "pageload-pulse 1.2s ease-in-out infinite",
          }}
        >
          HN
        </div>
      </div>
      {/* Animated dots */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`preloader-dot-${i + 1}`}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: ["#4f6fff", "#9b5de5", "#00d4ff"][i],
              boxShadow: `0 0 8px ${["#4f6fff", "#9b5de5", "#00d4ff"][i]}`,
            }}
          />
        ))}
      </div>
      {/* Progress bar */}
      <div
        style={{
          width: "140px",
          height: "2px",
          background: "rgba(79,111,255,0.15)",
          borderRadius: "2px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #4f6fff, #9b5de5, #00d4ff)",
            animation: "pageload-bar 1.2s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}

// ─── Mouse Trail ──────────────────────────────────────────────────────────────
export function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<
    { x: number; y: number; life: number; size: number; color: string }[]
  >([]);
  const mouse = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      const colors = ["#4f6fff", "#9b5de5", "#00d4ff"];
      for (let i = 0; i < 3; i++) {
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          life: 1,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * 3)],
        });
      }
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter((p) => p.life > 0);
      for (const p of particles.current) {
        p.life -= 0.04;
        p.y -= 0.5;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life) * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
}

// ─── Glass Orbs ───────────────────────────────────────────────────────────────
interface OrbConfig {
  id: string;
  size: number;
  top: string;
  left?: string;
  right?: string;
  color: string;
  glow: string;
  duration: number;
  delay: number;
  rx: number;
  animClass: string;
}

const ORB_CONFIGS: OrbConfig[] = [
  {
    id: "orb1",
    size: 200,
    top: "8%",
    left: "2%",
    color: "rgba(79,111,255,0.18)",
    glow: "#4f6fff",
    duration: 18,
    delay: 0,
    rx: 0.04,
    animClass: "glass-orb-float-1",
  },
  {
    id: "orb2",
    size: 150,
    top: "60%",
    left: "0%",
    color: "rgba(155,93,229,0.16)",
    glow: "#9b5de5",
    duration: 22,
    delay: 3,
    rx: -0.03,
    animClass: "glass-orb-float-2",
  },
  {
    id: "orb3",
    size: 120,
    top: "20%",
    right: "5%",
    color: "rgba(0,212,255,0.12)",
    glow: "#00d4ff",
    duration: 16,
    delay: 1.5,
    rx: 0.05,
    animClass: "glass-orb-float-3",
  },
  {
    id: "orb4",
    size: 90,
    top: "75%",
    right: "12%",
    color: "rgba(124,58,237,0.14)",
    glow: "#7C3AED",
    duration: 25,
    delay: 5,
    rx: -0.04,
    animClass: "glass-orb-float-4",
  },
  {
    id: "orb5",
    size: 80,
    top: "45%",
    left: "45%",
    color: "rgba(34,211,238,0.1)",
    glow: "#22D3EE",
    duration: 20,
    delay: 2,
    rx: 0.02,
    animClass: "glass-orb-float-5",
  },
];

export function GlassOrbs({
  mouseX,
  mouseY,
}: { mouseX: number; mouseY: number }) {
  return (
    <>
      {ORB_CONFIGS.map((orb) => (
        <div
          key={orb.id}
          style={{
            position: "absolute",
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, ${orb.color}, transparent 70%)`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${orb.glow}30`,
            boxShadow: `0 0 ${orb.size / 2}px ${orb.glow}30, inset 0 0 ${orb.size / 4}px ${orb.glow}15`,
            pointerEvents: "none",
            animation: `${orb.animClass} ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
            transform: `translate(${mouseX * orb.rx * 40}px, ${mouseY * orb.rx * 20}px)`,
            transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
          }}
        />
      ))}
    </>
  );
}

// ─── Scroll Reveal Hook ────────────────────────────────────────────────────────
export function useScrollReveal() {
  useEffect(() => {
    // Small delay so initial content is visible before we hide for reveal
    const timer = setTimeout(() => {
      const els = document.querySelectorAll("[data-reveal]");
      for (const el of els) {
        const rect = (el as HTMLElement).getBoundingClientRect();
        // Only hide sections that are NOT already visible on load
        if (rect.top > window.innerHeight) {
          (el as HTMLElement).classList.add("reveal-ready");
        }
      }
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add("revealed");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.08 },
      );
      for (const el of els) observer.observe(el);
    }, 1800); // After page load overlay fades
    return () => clearTimeout(timer);
  }, []);
}

// ─── Stats Counter Hook ────────────────────────────────────────────────────────
export function useStatsCounter() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-count-target]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = Number.parseInt(
              el.getAttribute("data-count-target") || "0",
            );
            const suffix = el.getAttribute("data-count-suffix") || "";
            let start = 0;
            const duration = 1800;
            const step = (timestamp: number) => {
              if (!start) start = timestamp;
              const progress = Math.min((timestamp - start) / duration, 1);
              const eased = 1 - (1 - progress) ** 3;
              el.textContent = Math.floor(eased * target) + suffix;
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.5 },
    );
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);
}

// ─── Ripple Effect ────────────────────────────────────────────────────────────
export function addRipple(e: React.MouseEvent<HTMLElement>) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement("span");
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.cssText = `
    position:absolute;
    width:${size}px;
    height:${size}px;
    left:${e.clientX - rect.left - size / 2}px;
    top:${e.clientY - rect.top - size / 2}px;
    background:rgba(255,255,255,0.2);
    border-radius:50%;
    transform:scale(0);
    animation:ripple-anim 0.6s ease-out forwards;
    pointer-events:none;
    z-index:10;
  `;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}

// ─── AI UNIVERSE / GALAXY PORTAL ANIMATION ───────────────────────────────────
export function AIUniverseAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const handleResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", handleResize);

    // ── Stars ──
    const NUM_STARS = 1800;
    interface Star {
      x: number;
      y: number;
      z: number;
      pz: number;
      r: number;
      color: string;
      angle: number;
      radius: number;
      speed: number;
      trail: number;
    }
    const COLORS = [
      "#22D3EE",
      "#7C3AED",
      "#4f6fff",
      "#a78bfa",
      "#67e8f9",
      "#ffffff",
    ];
    const stars: Star[] = Array.from({ length: NUM_STARS }, (_) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(W, H) * 0.48;
      return {
        x: W / 2 + Math.cos(angle) * radius,
        y: H / 2 + Math.sin(angle) * radius,
        z: Math.random() * W,
        pz: 0,
        r: Math.random() * 2 + 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        angle,
        radius,
        speed: 0.0003 + Math.random() * 0.0008,
        trail: Math.random(),
      };
    });

    // ── Circuit nodes ──
    const NUM_NODES = 28;
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      color: string;
      pulse: number;
      pulseSpeed: number;
    }
    const nodes: Node[] = Array.from({ length: NUM_NODES }, () => ({
      x: W * 0.15 + Math.random() * W * 0.7,
      y: H * 0.12 + Math.random() * H * 0.76,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 3 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    }));

    // ── Nebula clouds ──
    const _NUM_NEBULA = 5;
    interface Nebula {
      x: number;
      y: number;
      rx: number;
      ry: number;
      color: string;
      alpha: number;
      angle: number;
      rotSpeed: number;
    }
    const nebulae: Nebula[] = [
      {
        x: W * 0.15,
        y: H * 0.2,
        rx: W * 0.22,
        ry: H * 0.15,
        color: "#7C3AED",
        alpha: 0.06,
        angle: 0,
        rotSpeed: 0.0003,
      },
      {
        x: W * 0.82,
        y: H * 0.75,
        rx: W * 0.2,
        ry: H * 0.18,
        color: "#22D3EE",
        alpha: 0.05,
        angle: 1,
        rotSpeed: -0.0004,
      },
      {
        x: W * 0.5,
        y: H * 0.85,
        rx: W * 0.25,
        ry: H * 0.1,
        color: "#4f6fff",
        alpha: 0.04,
        angle: 2,
        rotSpeed: 0.0002,
      },
      {
        x: W * 0.75,
        y: H * 0.2,
        rx: W * 0.18,
        ry: H * 0.14,
        color: "#a78bfa",
        alpha: 0.05,
        angle: 0.5,
        rotSpeed: 0.0005,
      },
      {
        x: W * 0.28,
        y: H * 0.72,
        rx: W * 0.2,
        ry: H * 0.13,
        color: "#67e8f9",
        alpha: 0.04,
        angle: 1.5,
        rotSpeed: -0.0003,
      },
    ];

    // ── Warp trails ──
    const NUM_WARPS = 80;
    interface Warp {
      angle: number;
      speed: number;
      len: number;
      life: number;
      maxLife: number;
      color: string;
    }
    const warps: Warp[] = Array.from({ length: NUM_WARPS }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: 2 + Math.random() * 5,
      len: 60 + Math.random() * 120,
      life: Math.random(),
      maxLife: 0.7 + Math.random() * 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let t = 0;

    function drawNebula(n: Nebula, alpha: number) {
      const grd = ctx!.createRadialGradient(
        n.x,
        n.y,
        0,
        n.x,
        n.y,
        Math.max(n.rx, n.ry),
      );
      const hex = n.color;
      grd.addColorStop(
        0,
        hex +
          Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0"),
      );
      grd.addColorStop(1, `${hex}00`);
      ctx!.save();
      ctx!.translate(n.x, n.y);
      ctx!.rotate(n.angle);
      ctx!.scale(n.rx / Math.max(n.rx, n.ry), n.ry / Math.max(n.rx, n.ry));
      ctx!.beginPath();
      ctx!.arc(0, 0, Math.max(n.rx, n.ry), 0, Math.PI * 2);
      ctx!.fillStyle = grd;
      ctx!.fill();
      ctx!.restore();
    }

    function draw() {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      t++;

      // Background
      ctx!.fillStyle = "rgba(4,5,10,0.18)";
      ctx!.fillRect(0, 0, W, H);

      // Nebulae
      for (const n of nebulae) {
        n.angle += n.rotSpeed;
        drawNebula(n, n.alpha * (0.7 + 0.3 * Math.sin(t * 0.008 + n.angle)));
      }

      // Warp trails from center
      for (const w of warps) {
        w.life += w.speed * 0.004;
        if (w.life > w.maxLife) {
          w.life = 0;
          w.angle = Math.random() * Math.PI * 2;
          w.speed = 2 + Math.random() * 5;
          w.len = 60 + Math.random() * 120;
          w.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        const dist = w.life / w.maxLife;
        const startR = dist * Math.min(W, H) * 0.05;
        const endR = startR + w.len * dist;
        const sx = W / 2 + Math.cos(w.angle) * startR;
        const sy = H / 2 + Math.sin(w.angle) * startR;
        const ex = W / 2 + Math.cos(w.angle) * endR;
        const ey = H / 2 + Math.sin(w.angle) * endR;
        const grad = ctx!.createLinearGradient(sx, sy, ex, ey);
        grad.addColorStop(0, `${w.color}00`);
        grad.addColorStop(
          0.5,
          w.color +
            Math.round(180 * (1 - dist))
              .toString(16)
              .padStart(2, "0"),
        );
        grad.addColorStop(1, `${w.color}00`);
        ctx!.beginPath();
        ctx!.moveTo(sx, sy);
        ctx!.lineTo(ex, ey);
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.2 * dist;
        ctx!.stroke();
      }

      // Galaxy spiral stars
      for (const s of stars) {
        s.angle += s.speed;
        s.radius += 0.012;
        if (s.radius > Math.min(W, H) * 0.52) {
          s.radius = Math.random() * 8;
          s.angle = Math.random() * Math.PI * 2;
        }
        const armOffset = Math.floor(s.trail * 3) * ((Math.PI * 2) / 3);
        const spiral = s.angle + armOffset + s.radius * 0.012;
        s.x = W / 2 + Math.cos(spiral) * s.radius;
        s.y = H / 2 + Math.sin(spiral) * s.radius;
        const alpha = Math.min(1, s.radius / 30) * 0.85;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle =
          s.color +
          Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0");
        ctx!.fill();
      }

      // Circuit nodes and connecting lines
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.pulse += n.pulseSpeed;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.5;
            const grad = ctx!.createLinearGradient(
              nodes[i].x,
              nodes[i].y,
              nodes[j].x,
              nodes[j].y,
            );
            grad.addColorStop(
              0,
              nodes[i].color +
                Math.round(alpha * 255)
                  .toString(16)
                  .padStart(2, "0"),
            );
            grad.addColorStop(
              1,
              nodes[j].color +
                Math.round(alpha * 255)
                  .toString(16)
                  .padStart(2, "0"),
            );
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.strokeStyle = grad;
            ctx!.lineWidth = 0.7;
            ctx!.stroke();
          }
        }
      }
      for (const n of nodes) {
        const glow = 1 + 0.5 * Math.sin(n.pulse);
        const g = ctx!.createRadialGradient(
          n.x,
          n.y,
          0,
          n.x,
          n.y,
          n.r * 4 * glow,
        );
        g.addColorStop(0, `${n.color}cc`);
        g.addColorStop(0.4, `${n.color}44`);
        g.addColorStop(1, `${n.color}00`);
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r * 3 * glow, 0, Math.PI * 2);
        ctx!.fillStyle = g;
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r * glow, 0, Math.PI * 2);
        ctx!.fillStyle = n.color;
        ctx!.fill();
      }

      // Central AI Core orb
      const pulse = 1 + 0.18 * Math.sin(t * 0.04);
      const coreR = Math.min(W, H) * 0.055 * pulse;
      for (let ring = 5; ring >= 1; ring--) {
        const rg = ctx!.createRadialGradient(
          W / 2,
          H / 2,
          0,
          W / 2,
          H / 2,
          coreR * ring * 0.9,
        );
        rg.addColorStop(0, `#ffffff${ring === 5 ? "ff" : "aa"}`);
        rg.addColorStop(0.15, `#22D3EE${ring === 5 ? "dd" : "66"}`);
        rg.addColorStop(0.4, `#7C3AED${ring === 5 ? "aa" : "33"}`);
        rg.addColorStop(1, "#4f6fff00");
        ctx!.beginPath();
        ctx!.arc(W / 2, H / 2, coreR * ring * 0.9, 0, Math.PI * 2);
        ctx!.fillStyle = rg;
        ctx!.globalAlpha = 0.18 / ring;
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      // Core solid
      const cg = ctx!.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        coreR,
      );
      cg.addColorStop(0, "#ffffff");
      cg.addColorStop(0.3, "#22D3EE");
      cg.addColorStop(0.7, "#7C3AED");
      cg.addColorStop(1, "#4f6fff00");
      ctx!.beginPath();
      ctx!.arc(W / 2, H / 2, coreR, 0, Math.PI * 2);
      ctx!.fillStyle = cg;
      ctx!.fill();

      // Rotating outer rings
      for (let ring = 0; ring < 3; ring++) {
        const ringR = coreR * (2.5 + ring * 1.2);
        const dashLen = (Math.PI * 2 * ringR) / 16;
        ctx!.save();
        ctx!.translate(W / 2, H / 2);
        ctx!.rotate(t * 0.008 * (ring % 2 === 0 ? 1 : -1));
        ctx!.beginPath();
        ctx!.arc(0, 0, ringR, 0, Math.PI * 2);
        ctx!.setLineDash([dashLen * 0.6, dashLen * 0.4]);
        ctx!.strokeStyle =
          ring === 0 ? "#22D3EE88" : ring === 1 ? "#7C3AED88" : "#4f6fff88";
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
        ctx!.setLineDash([]);
        ctx!.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      data-ocid="ai_universe.section"
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(60vh, 100vh, 100vh)",
        background: "#04050a",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      {/* Overlay text */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.2rem, 3.5vw, 2.8rem)",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background:
              "linear-gradient(90deg, #22D3EE, #7C3AED, #4f6fff, #22D3EE)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "universeTextShimmer 4s linear infinite",
            marginBottom: "0.75rem",
            textShadow: "none",
          }}
        >
          Powered by Artificial Intelligence
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          AI Automation · Agentic Systems · Intelligent Workflows
        </div>
      </div>
      <style>{`
        @keyframes universeTextShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </section>
  );
}
