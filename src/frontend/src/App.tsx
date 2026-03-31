import { useCallback, useEffect, useRef, useState } from "react";
import {
  AIUniverseAnimation,
  GlassOrbs,
  MouseTrail,
  PageLoadOverlay,
  addRipple,
  useScrollReveal,
  useStatsCounter,
} from "./Animations";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
}

type Stage = 0 | 1 | 2 | 3 | 4 | 5;

// ─── Constants ───────────────────────────────────────────────────────────────
const PROFILE_IMG =
  "/assets/uploads/chatgpt_image_mar_30_2026_01_06_38_am-019d3d7e-1a59-77f5-8f94-fc7a48b8818b-2.png";

const SERVICES = [
  {
    icon: "🤖",
    title: "AI Agent Development",
    desc: "Custom AI agents that think and act autonomously",
  },
  {
    icon: "💬",
    title: "AI Chatbot Development",
    desc: "Intelligent chatbots that engage customers 24/7",
  },
  {
    icon: "🎯",
    title: "Lead Generation Automation",
    desc: "Automated pipelines that capture and qualify leads",
  },
  {
    icon: "📧",
    title: "Email Auto-Reply Agents",
    desc: "Smart agents that respond to emails instantly",
  },
  {
    icon: "📅",
    title: "Booking Automation",
    desc: "End-to-end calendar booking automation",
  },
  {
    icon: "🎙️",
    title: "Voice AI Agents",
    desc: "Conversational voice agents for customer support",
  },
  {
    icon: "🍽️",
    title: "Restaurant AI Systems",
    desc: "AI-powered ordering and management systems",
  },
  {
    icon: "🔄",
    title: "Workflow Automation",
    desc: "Streamline entire business operations",
  },
  {
    icon: "🏢",
    title: "CRM Automation (GoHighLevel)",
    desc: "Full GHL setup and AI integrations",
  },
  {
    icon: "🔗",
    title: "API Integration",
    desc: "Connect all tools through API pipelines",
  },
  {
    icon: "⚡",
    title: "Make.com Systems",
    desc: "Advanced automation scenarios at scale",
  },
  {
    icon: "🌿",
    title: "n8n Workflows",
    desc: "Self-hosted n8n workflow automation",
  },
  {
    icon: "📋",
    title: "Airtable Automation",
    desc: "Intelligent Airtable bases with automation",
  },
];

const PROJECTS = [
  {
    icon: "📧",
    title: "Email AI Agent",
    desc: "90% time saved, 24/7 active",
    tag: "Live",
    tagColor: "#00c853",
  },
  {
    icon: "📦",
    title: "Inventory AI System",
    desc: "Real-time tracking, Auto-reorder",
    tag: "Active",
    tagColor: "#4f6fff",
  },
  {
    icon: "🧠",
    title: "AI Decision System",
    desc: "Autonomous ops, Data-driven",
    tag: "Production",
    tagColor: "#9b5de5",
  },
  {
    icon: "🎯",
    title: "Lead Gen AI System",
    desc: "5x more leads, Auto-qualify",
    tag: "Running",
    tagColor: "#00d4ff",
  },
  {
    icon: "🎙️",
    title: "Voice Support AI",
    desc: "24/7 support, Zero wait time",
    tag: "Deployed",
    tagColor: "#ff6b6b",
  },
];

const CERTS = [
  { icon: "🧠", name: "IBM AI Foundations", issuer: "IBM" },
  { icon: "📊", name: "IBM Machine Learning", issuer: "IBM" },
  { icon: "💬", name: "IBM Chatbot Level 1", issuer: "IBM" },
  { icon: "✨", name: "Microsoft Generative AI", issuer: "Microsoft" },
  { icon: "☁️", name: "Azure AI Agents", issuer: "Microsoft" },
  { icon: "⚡", name: "Make.com Advanced", issuer: "Make.com" },
  { icon: "🤖", name: "UiPath RPA", issuer: "UiPath" },
  { icon: "💼", name: "DigiSkills Freelancing", issuer: "DigiSkills" },
  { icon: "🗣️", name: "DigiSkills Communication", issuer: "DigiSkills" },
  { icon: "🌐", name: "Elements of AI", issuer: "MinnaLearn" },
];

const WHY = [
  {
    icon: "⏱️",
    title: "Save 100+ Hours Monthly",
    desc: "Automate repetitive tasks so your team focuses on what matters",
  },
  {
    icon: "⚡",
    title: "Fully Automated Workflows",
    desc: "End-to-end systems that run without manual intervention",
  },
  {
    icon: "📈",
    title: "Scalable AI Solutions",
    desc: "Systems built to grow with your business from day one",
  },
  {
    icon: "🎯",
    title: "Business-Focused Approach",
    desc: "Every solution aligned to your specific business goals",
  },
  {
    icon: "🚀",
    title: "Fast Delivery",
    desc: "Rapid development and deployment to get you results quickly",
  },
];

const STATS = [
  { num: "13+", label: "Services Delivered" },
  { num: "100+", label: "Hours Saved" },
  { num: "5+", label: "Platforms Mastered" },
  { num: "1+", label: "Year Experience" },
];

function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Hero Canvas (particles) ─────────────────────────────────────────────────
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < 70; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(79,111,255,0.7)";
        ctx.fill();
      }
      for (let ai = 0; ai < dots.length; ai++) {
        const a = dots[ai];
        for (let bi = ai + 1; bi < dots.length; bi++) {
          const b = dots[bi];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(79,111,255,${(1 - dist / 100) * 0.25})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Neural Network Canvas ────────────────────────────────────────────────────
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      color: string;
    }[] = [];
    const colors = ["#4f6fff", "#9b5de5", "#00d4ff"];
    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * 1200,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * 3)],
      });
    }

    // Travelling particles along edges
    const particles: { from: number; to: number; t: number; speed: number }[] =
      [];
    for (let i = 0; i < 20; i++) {
      particles.push({
        from: Math.floor(Math.random() * nodes.length),
        to: Math.floor(Math.random() * nodes.length),
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.004,
      });
    }

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // Edges
      for (let ai = 0; ai < nodes.length; ai++) {
        const a = nodes[ai];
        for (let bi = ai + 1; bi < nodes.length; bi++) {
          const b = nodes[bi];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(79,111,255,${(1 - dist / 150) * 0.3})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Travelling particles
      for (const p of particles) {
        p.t += p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.from = p.to;
          p.to = Math.floor(Math.random() * nodes.length);
        }
        const from = nodes[p.from];
        const to = nodes[p.to];
        if (!from || !to) return;
        const x = from.x + (to.x - from.x) * p.t;
        const y = from.y + (to.y - from.y) * p.t;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#00d4ff";
        ctx.shadowColor = "#00d4ff";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

// ─── Contact Modal ────────────────────────────────────────────────────────────
function ContactModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      data-ocid="contact.modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(4,5,10,0.85)",
        backdropFilter: "blur(12px)",
        padding: "1rem",
      }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
      tabIndex={-1}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        style={{
          background: "rgba(11,15,25,0.98)",
          border: "1px solid rgba(79,111,255,0.3)",
          borderRadius: "20px",
          padding: "2.5rem",
          maxWidth: "440px",
          width: "100%",
          position: "relative",
          boxShadow: "0 0 60px rgba(79,111,255,0.2)",
          borderTop: "3px solid transparent",
          backgroundImage:
            "linear-gradient(rgba(11,15,25,0.98), rgba(11,15,25,0.98)), linear-gradient(135deg, #4f6fff, #9b5de5)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        <button
          type="button"
          data-ocid="contact.close_button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "rgba(255,255,255,0.05)",
            border: "none",
            color: "#aaa",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "0.5rem",
          }}
        >
          Let&apos;s Connect! 📞
        </h2>
        <p
          style={{
            color: "#9ca3af",
            marginBottom: "1.8rem",
            fontSize: "0.95rem",
          }}
        >
          Book a call or reach out directly
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Phone - most prominent */}
          <a
            data-ocid="contact.phone_button"
            href="tel:+923415142049"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              background:
                "linear-gradient(135deg, #2d4cff 0%, #7c3aed 50%, #9b5de5 100%)",
              color: "#fff",
              padding: "16px 24px",
              borderRadius: "28px",
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              textDecoration: "none",
              fontSize: "1.1rem",
              boxShadow: "0 0 25px rgba(79,111,255,0.5)",
              transition: "transform 0.2s, box-shadow 0.2s",
              letterSpacing: "0.5px",
            }}
          >
            📞 +92 341 5142049
          </a>
          {/* Email */}
          <a
            data-ocid="contact.email_button"
            href="mailto:nawazmubshar387@gmail.com?subject=Book%20a%20Call%20-%20AI%20Automation"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "rgba(79,111,255,0.12)",
              border: "1.5px solid rgba(79,111,255,0.4)",
              color: "#93c5fd",
              padding: "14px 24px",
              borderRadius: "28px",
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "1rem",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            📧 nawazmubshar387@gmail.com
          </a>
          {/* WhatsApp secondary */}
          <a
            data-ocid="contact.whatsapp_button"
            href="https://wa.me/923415142049?text=Hi%20Haseeb!%20I%20want%20to%20book%20a%20call%20for%20AI%20automation."
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "linear-gradient(135deg, #00c853, #00a040)",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: "28px",
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "1rem",
              boxShadow: "0 0 20px rgba(0,200,83,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            💬 WhatsApp Me
          </a>
        </div>
        <p
          style={{
            marginTop: "1.2rem",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "0.85rem",
          }}
        >
          ⚡ I typically respond within 1 hour
        </p>
      </div>
    </div>
  );
}

// ─── Chatbot Widget ───────────────────────────────────────────────────────────
function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: "Hi! I'm Haseeb's AI Assistant. How can I help you with AI automation today?",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      80,
    );
  }, []);

  const addBot = useCallback(
    (text: string) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "bot", text, time: now() },
      ]);
      scrollToBottom();
    },
    [scrollToBottom],
  );

  const addUser = useCallback(
    (text: string) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "user", text, time: now() },
      ]);
      scrollToBottom();
    },
    [scrollToBottom],
  );

  const getSmartResponse = useCallback(
    (userMsg: string, history: Message[]): string => {
      const msg = userMsg.toLowerCase();
      const prevBotMsgs = history
        .filter((m) => m.role === "bot")
        .map((m) => m.text.toLowerCase())
        .join(" ");
      const prevUserMsgs = history
        .filter((m) => m.role === "user")
        .map((m) => m.text.toLowerCase())
        .join(" ");

      const hasAskedBusiness = prevBotMsgs.includes("business name");
      const hasAskedProblem = prevBotMsgs.includes("main problem");
      const hasAskedTools = prevBotMsgs.includes("tools or platforms");
      const hasAskedBudget = prevBotMsgs.includes("budget");

      if (msg.match(/^(hi|hello|hey|assalam|salam|greetings)/)) {
        return "Hey! Welcome 👋 I'm Haseeb's AI Assistant. Are you looking to automate your business or build AI systems? Tell me what you need!";
      }
      if (
        msg.includes("service") ||
        msg.includes("what do you do") ||
        msg.includes("what can you do")
      ) {
        return "Haseeb offers 13+ AI services including:\n🤖 AI Agent Development\n📧 Email Auto-Reply Agents\n🎯 Lead Generation Automation\n🔄 Workflow Automation\n🎙️ Voice AI Agents\n...and more! Which one interests you most?";
      }
      if (
        msg.includes("price") ||
        msg.includes("cost") ||
        msg.includes("rate") ||
        msg.includes("charge") ||
        msg.includes("how much")
      ) {
        return "Pricing depends on the project scope and complexity. To give you an accurate quote, can I ask — what's your business type and what process do you want to automate?";
      }
      if (
        msg.includes("n8n") ||
        msg.includes("make.com") ||
        msg.includes("zapier")
      ) {
        return "Yes! Haseeb works with n8n, Make.com, and similar automation platforms. He can build complex multi-step workflows. What process are you looking to automate?";
      }
      if (
        msg.includes("how long") ||
        msg.includes("timeline") ||
        (msg.includes("time") && msg.includes("take"))
      ) {
        return "Most automation projects take 3-7 days depending on complexity. Simple automations can be done in 1-2 days. What are you trying to build?";
      }
      if (
        msg.includes("contact") ||
        msg.includes("phone") ||
        msg.includes("email") ||
        msg.includes("reach") ||
        msg.includes("number")
      ) {
        setStage(5);
        return "Here's how to reach Haseeb directly:\n📞 +923415142049\n📧 nawazmubshar387@gmail.com\n\nHe usually responds within 1 hour! 🚀";
      }
      if (msg.includes("whatsapp") || msg.includes("whats app")) {
        setStage(5);
        return "You can WhatsApp Haseeb directly at +923415142049 — click the button below to connect instantly!";
      }
      if (msg.includes("chatbot") || msg.includes("chat bot")) {
        return "Haseeb builds AI chatbots that handle customer queries 24/7, qualify leads, book appointments, and integrate with your CRM. What platform are you on? (Website, WhatsApp, Instagram?)";
      }
      if (msg.includes("voice") || msg.includes("phone bot")) {
        return "Haseeb builds Voice AI agents that handle calls, answer questions, and qualify leads automatically — perfect for businesses getting many calls. Want to know more?";
      }
      if (msg.includes("lead") || msg.includes("sales")) {
        return "Haseeb has built lead gen systems that 5x'd client leads! He can automate lead capture, qualification, follow-up, and CRM updates. What's your current lead source?";
      }
      if (
        msg.includes("book") ||
        msg.includes("appointment") ||
        msg.includes("calendar") ||
        msg.includes("schedule")
      ) {
        return "Haseeb can automate your entire booking flow — from form submission to calendar invite to confirmation email. Which booking platform do you use?";
      }
      if (
        msg.includes("experience") ||
        msg.includes("portfolio") ||
        msg.includes("previous work") ||
        msg.includes("project")
      ) {
        return "Haseeb has 1+ year hands-on experience and has built:\n📧 Email AI Agents\n📦 Inventory AI Systems\n🎯 Lead Gen Automation\n🎙️ Voice Support AI\n...for real businesses! Check the Projects section above.";
      }
      if (!hasAskedBusiness && prevUserMsgs.length > 5) {
        return "That sounds interesting! Could you tell me your business name so I can better understand your needs?";
      }
      if (hasAskedBusiness && !hasAskedProblem) {
        return "Great! What's the main problem you're trying to solve — repetitive tasks, slow responses, missing leads, something else?";
      }
      if (hasAskedProblem && !hasAskedTools) {
        return "Got it! What tools or platforms are you currently using? (e.g. email software, CRM, website platform)";
      }
      if (hasAskedTools && !hasAskedBudget) {
        return "Perfect. Do you have a rough budget in mind for this automation project?";
      }
      if (hasAskedBudget) {
        setStage(5);
        return "Thanks for sharing all that! Haseeb can definitely help. Contact him directly:\n📞 +923415142049\n📧 nawazmubshar387@gmail.com";
      }
      return "I can help with that! Haseeb specializes in AI automation and agent development. Could you tell me a bit more about your business and what you're looking to automate?";
    },
    [],
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    addUser(text);
    setInput("");
    const response = getSmartResponse(text, messages);
    setTimeout(() => addBot(response), 600);
  }, [input, messages, addUser, addBot, getSmartResponse]);

  const handleQuickReply = useCallback(
    (type: string) => {
      if (type === "services") {
        addUser("View Services");
        document
          .getElementById("services")
          ?.scrollIntoView({ behavior: "smooth" });
        setTimeout(
          () =>
            addBot(
              "I've scrolled to the Services section for you! Haseeb offers 13+ AI services. Which one interests you most?",
            ),
          500,
        );
      } else if (type === "audit") {
        addUser("Free Audit");
        setTimeout(
          () =>
            addBot(
              "I'd love to help with a free audit! First, what's your business name?",
            ),
          500,
        );
      } else if (type === "contact") {
        addUser("Get Contact Info");
        setTimeout(() => {
          addBot(
            "Here's how to reach Haseeb directly:\n📞 +923415142049\n📧 nawazmubshar387@gmail.com\n\nClick below to connect on WhatsApp!",
          );
          setStage(5);
        }, 500);
      }
    },
    [addUser, addBot],
  );

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        data-ocid="chatbot.toggle"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 900,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #4f6fff, #9b5de5)",
          border: "none",
          cursor: "pointer",
          fontSize: "1.6rem",
          boxShadow: "0 0 30px rgba(79,111,255,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s",
        }}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat window */}
      {open && (
        <div
          data-ocid="chatbot.panel"
          style={{
            position: "fixed",
            bottom: "100px",
            right: "28px",
            zIndex: 900,
            width: "min(380px, calc(100vw - 40px))",
            height: "520px",
            background: "#0B0F19",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: "20px",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(124,58,237,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(79,111,255,0.15), rgba(124,58,237,0.15))",
              borderBottom: "1px solid rgba(124,58,237,0.2)",
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={PROFILE_IMG}
                  alt="Haseeb"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "10px",
                    height: "10px",
                    background: "#00c853",
                    borderRadius: "50%",
                    border: "2px solid #0B0F19",
                  }}
                />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: "0.9rem",
                    margin: 0,
                  }}
                >
                  Haseeb&apos;s AI Assistant
                </p>
                <p style={{ color: "#00c853", fontSize: "0.75rem", margin: 0 }}>
                  ● Online
                </p>
              </div>
            </div>
            {/* Quick buttons */}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {[
                { label: "Services", type: "services" },
                { label: "Free Audit", type: "audit" },
                { label: "Contact", type: "contact" },
              ].map((btn) => (
                <button
                  type="button"
                  key={btn.type}
                  data-ocid={`chatbot.${btn.type}_button`}
                  onClick={() => handleQuickReply(btn.type)}
                  style={{
                    background: "rgba(124,58,237,0.2)",
                    border: "1px solid rgba(124,58,237,0.4)",
                    borderRadius: "20px",
                    color: "#c4b5fd",
                    padding: "4px 12px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "78%",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #4f6fff, #7C3AED)"
                        : "rgba(255,255,255,0.06)",
                    color: "#e8eaf6",
                    borderRadius:
                      msg.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    padding: "10px 14px",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                  {/* WhatsApp link for stage 5 */}
                  {msg.role === "bot" &&
                    stage === 5 &&
                    msg.id === messages[messages.length - 1].id && (
                      <a
                        href="https://wa.me/923415142049?text=Hi%20Haseeb!%20I%20want%20to%20automate%20my%20business%20with%20AI."
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "block",
                          marginTop: "8px",
                          background:
                            "linear-gradient(135deg, #00c853, #00a040)",
                          color: "#fff",
                          padding: "8px 16px",
                          borderRadius: "20px",
                          textDecoration: "none",
                          textAlign: "center",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        💬 Connect on WhatsApp
                      </a>
                    )}
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(255,255,255,0.35)",
                      marginTop: "4px",
                      textAlign: msg.role === "user" ? "right" : "left",
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px",
              borderTop: "1px solid rgba(124,58,237,0.2)",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              data-ocid="chatbot.input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: "12px",
                padding: "10px 14px",
                color: "#e8eaf6",
                fontSize: "0.85rem",
                outline: "none",
                fontFamily: "DM Sans, sans-serif",
              }}
            />
            <button
              type="button"
              data-ocid="chatbot.submit_button"
              onClick={handleSend}
              style={{
                background: "linear-gradient(135deg, #7C3AED, #4f6fff)",
                border: "none",
                borderRadius: "12px",
                padding: "10px 16px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const FAQS = [
  {
    q: "How long does it take to build an AI automation system?",
    a: "Most projects take 3–7 days depending on complexity. Simple automations (like email auto-reply) can be done in 1–2 days, while complex multi-step AI agent systems may take up to 2 weeks.",
  },
  {
    q: "What tools and platforms do you work with?",
    a: "I work with n8n, Make.com, GoHighLevel, OpenAI APIs, Airtable, Zapier, and custom Python scripts. I can integrate with virtually any platform that has an API or webhook support.",
  },
  {
    q: "Do I need technical knowledge to use the systems you build?",
    a: "Not at all! I design automation systems to be fully hands-off. Once set up, they run automatically 24/7 without you needing to touch anything. I also provide a quick walkthrough after delivery.",
  },
  {
    q: "Can you automate my existing workflows?",
    a: "Absolutely. I start by understanding your current processes and then design automation around them — no need to change your existing tools or systems unless you want to upgrade.",
  },
  {
    q: "How do I get started?",
    a: "Simple! Click 'Book a Call' and send me your phone number or email. I'll understand your business needs and suggest the best automation strategy — completely free.",
  },
];

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {FAQS.map((faq, i) => (
        <div
          key={faq.q}
          data-ocid={`faqs.item.${i + 1}`}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${openIdx === i ? "rgba(79,111,255,0.4)" : "rgba(79,111,255,0.15)"}`,
            borderRadius: "16px",
            overflow: "hidden",
            transition: "border-color 0.3s",
            boxShadow: openIdx === i ? "0 0 20px rgba(79,111,255,0.1)" : "none",
          }}
        >
          <button
            type="button"
            data-ocid={`faqs.toggle.${i + 1}`}
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.25rem 1.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                color: "#fff",
                fontSize: "1rem",
              }}
            >
              {faq.q}
            </span>
            <span
              style={{
                color: "#4f6fff",
                fontSize: "1.2rem",
                flexShrink: 0,
                marginLeft: "1rem",
                transition: "transform 0.3s",
                transform: openIdx === i ? "rotate(45deg)" : "rotate(0)",
              }}
            >
              +
            </span>
          </button>
          {openIdx === i && (
            <div
              style={{
                padding: "0 1.5rem 1.25rem",
                color: "#9ca3af",
                lineHeight: 1.7,
                fontSize: "0.95rem",
              }}
            >
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

// ── BEFORE / AFTER TRANSFORMATION SECTION ──
function BeforeAfterSection({ openModal }: { openModal: () => void }) {
  const [counts, setCounts] = useState({ time: 0, leads: 0, replies: 0 });
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const targets = { time: 87, leads: 430, replies: 2400 };
    const dur = 2200;
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / dur, 1);
      const ease = 1 - (1 - p) ** 3;
      setCounts({
        time: Math.round(targets.time * ease),
        leads: Math.round(targets.leads * ease),
        replies: Math.round(targets.replies * ease),
      });
      if (p < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const beforeRows = [
    { icon: "📧", label: "Manually reading & replying emails", cost: "3h/day" },
    { icon: "📞", label: "Following up leads by hand", cost: "2h/day" },
    { icon: "📅", label: "Booking appointments manually", cost: "1h/day" },
    { icon: "📊", label: "Updating CRM records", cost: "1.5h/day" },
  ];

  const afterRows = [
    { icon: "🤖", label: "AI replies emails instantly", gain: "0 mins" },
    { icon: "🎯", label: "Leads auto-nurtured 24/7", gain: "Autopilot" },
    { icon: "⚡", label: "Smart booking bot live", gain: "Always on" },
    { icon: "🔄", label: "CRM updates automatically", gain: "Real-time" },
  ];

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,#04050a 0%,#0a0612 50%,#04050a 100%)",
        padding: "6rem max(1.5rem,calc((100vw - 1200px)/2))",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: no stable key available
            key={i}
            style={{
              position: "absolute",
              width: i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
              borderRadius: "50%",
              background: i % 2 === 0 ? "#7C3AED" : "#00d4ff",
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              opacity: 0.35,
              animation: `floatParticle ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.3) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Headline */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "3.5rem",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.4)",
            borderRadius: "50px",
            padding: "0.35rem 1.2rem",
            fontSize: "0.8rem",
            color: "#a78bfa",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Live Transformation
        </div>
        <h2
          style={{
            fontSize: "clamp(1.8rem,4vw,3rem)",
            fontWeight: 800,
            fontFamily: "Syne,sans-serif",
            background:
              "linear-gradient(135deg,#fff 0%,#a78bfa 50%,#22d3ee 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.75rem",
          }}
        >
          This Is What Automation Does to Your Business
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "1.05rem",
            maxWidth: "540px",
            margin: "0 auto",
          }}
        >
          See exactly how AI automation transforms your daily workflow.
        </p>
      </div>

      {/* Side-by-side comparison */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          gap: "0",
          maxWidth: "1000px",
          margin: "0 auto 3.5rem",
          alignItems: "center",
        }}
      >
        {/* BEFORE column */}
        <div
          style={{
            background: "rgba(239,68,68,0.04)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "20px 0 0 20px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid rgba(239,68,68,0.15)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "rgba(239,68,68,0.08)",
            }}
          >
            <span
              style={{ fontSize: "1.1rem", color: "#ef4444", fontWeight: 800 }}
            >
              ✗
            </span>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "#ef4444",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Before Automation
            </span>
          </div>
          {/* Rows */}
          {beforeRows.map((row, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: no stable key available
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                borderBottom:
                  i < beforeRows.length - 1
                    ? "1px solid rgba(239,68,68,0.08)"
                    : "none",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    flexShrink: 0,
                  }}
                >
                  {row.icon}
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "0.88rem",
                    fontWeight: 500,
                  }}
                >
                  {row.label}
                </span>
              </div>
              <span
                style={{
                  color: "#ef4444",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "20px",
                  padding: "0.2rem 0.65rem",
                }}
              >
                {row.cost}
              </span>
            </div>
          ))}
        </div>

        {/* Center divider */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 0.5rem",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#7C3AED,#22d3ee)",
              boxShadow:
                "0 0 30px rgba(124,58,237,0.5), 0 0 60px rgba(34,211,238,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              color: "#fff",
              animation: "pulse 2s infinite",
              flexShrink: 0,
            }}
          >
            →
          </div>
        </div>

        {/* AFTER column */}
        <div
          style={{
            background: "rgba(34,211,238,0.04)",
            border: "1px solid rgba(34,211,238,0.2)",
            borderRadius: "0 20px 20px 0",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid rgba(34,211,238,0.15)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "rgba(34,211,238,0.08)",
            }}
          >
            <span
              style={{ fontSize: "1.1rem", color: "#22d3ee", fontWeight: 800 }}
            >
              ✓
            </span>
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: 800,
                color: "#22d3ee",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              After Automation
            </span>
          </div>
          {/* Rows */}
          {afterRows.map((row, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: no stable key available
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                borderBottom:
                  i < afterRows.length - 1
                    ? "1px solid rgba(34,211,238,0.08)"
                    : "none",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(34,211,238,0.1)",
                    border: "1px solid rgba(34,211,238,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    flexShrink: 0,
                    boxShadow: "0 0 10px rgba(34,211,238,0.15)",
                  }}
                >
                  {row.icon}
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "0.88rem",
                    fontWeight: 500,
                  }}
                >
                  {row.label}
                </span>
              </div>
              <span
                style={{
                  color: "#22d3ee",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  background: "rgba(34,211,238,0.1)",
                  border: "1px solid rgba(34,211,238,0.2)",
                  borderRadius: "20px",
                  padding: "0.2rem 0.65rem",
                }}
              >
                {row.gain}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "1.5rem",
          maxWidth: "750px",
          margin: "0 auto 3rem",
        }}
      >
        {[
          {
            val: `${counts.time}%`,
            label: "Time Saved",
            icon: "⏱️",
            color: "#22d3ee",
          },
          {
            val: `${counts.leads}+`,
            label: "Leads Captured",
            icon: "🎯",
            color: "#a78bfa",
          },
          {
            val: `${counts.replies.toLocaleString()}+`,
            label: "Replies Automated",
            icon: "🤖",
            color: "#34d399",
          },
        ].map((s, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: no stable key available
            key={i}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${s.color}33`,
              borderRadius: "16px",
              padding: "1.5rem 1rem",
              textAlign: "center",
              boxShadow: `0 0 24px ${s.color}15`,
            }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>
              {s.icon}
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                fontFamily: "Syne,sans-serif",
                color: s.color,
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.82rem",
                marginTop: "0.2rem",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center" }}>
        <button
          type="button"
          onClick={openModal}
          style={{
            background: "linear-gradient(135deg,#7C3AED,#22d3ee)",
            border: "none",
            borderRadius: "50px",
            padding: "16px 48px",
            color: "#fff",
            fontSize: "1.1rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 8px 40px rgba(124,58,237,0.4)",
            transition: "transform 0.2s,box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 12px 50px rgba(124,58,237,0.6)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 8px 40px rgba(124,58,237,0.4)";
          }}
        >
          Start Your Transformation 🚀
        </button>
      </div>
    </section>
  );
}

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Animation hooks
  useScrollReveal();
  useStatsCounter();

  // Mouse position for parallax orbs
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const ctaCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ctaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const particles: {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
      alpha: number;
    }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.0003,
        dy: (Math.random() - 0.5) * 0.0003,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    function resize() {
      const rect = canvas!.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas!.width = rect.width;
        canvas!.height = rect.height;
      }
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;
      t += 0.005;

      // Animated gradient background
      const x1 = w * (0.2 + 0.15 * Math.sin(t * 0.7));
      const y1 = h * (0.2 + 0.1 * Math.cos(t * 0.5));
      const x2 = w * (0.8 + 0.1 * Math.cos(t * 0.6));
      const y2 = h * (0.8 + 0.1 * Math.sin(t * 0.8));
      const grad = ctx!.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, `hsl(${260 + 15 * Math.sin(t * 0.3)}, 80%, 52%)`);
      grad.addColorStop(0.45, `hsl(${230 + 10 * Math.cos(t * 0.4)}, 85%, 60%)`);
      grad.addColorStop(1, `hsl(${185 + 10 * Math.sin(t * 0.5)}, 90%, 58%)`);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      // Soft glowing orbs
      const orbs: [number, number, number][] = [
        [0.15, 0.2, 0.28],
        [0.85, 0.75, 0.22],
        [0.5, 0.5, 0.2],
      ];
      for (const [bx, by, br] of orbs) {
        const ox = w * (bx + 0.05 * Math.sin(t * 0.4 + bx * 10));
        const oy = h * (by + 0.05 * Math.cos(t * 0.35 + by * 10));
        const orbGrad = ctx!.createRadialGradient(ox, oy, 0, ox, oy, w * br);
        orbGrad.addColorStop(0, "rgba(255,255,255,0.12)");
        orbGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx!.fillStyle = orbGrad;
        ctx!.fillRect(0, 0, w, h);
      }

      // Floating particles
      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;
        ctx!.beginPath();
        ctx!.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx!.fill();
      }

      // Subtle grid lines
      ctx!.strokeStyle = "rgba(255,255,255,0.04)";
      ctx!.lineWidth = 1;
      for (let i = 0; i < w; i += 60) {
        ctx!.beginPath();
        ctx!.moveTo(i, 0);
        ctx!.lineTo(i, h);
        ctx!.stroke();
      }
      for (let j = 0; j < h; j += 60) {
        ctx!.beginPath();
        ctx!.moveTo(0, j);
        ctx!.lineTo(w, j);
        ctx!.stroke();
      }

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 2);
      setMouseY((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    const onScroll = () => {
      setNavScrolled(window.scrollY > 40);
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const navLinks = [
    { label: "About", id: "about" },
    { label: "Services", id: "services" },
    { label: "Projects", id: "projects" },
    { label: "Certifications", id: "certifications" },
  ];

  return (
    <div
      style={{ background: "#04050a", minHeight: "100vh", color: "#e8eaf6" }}
    >
      {/* ── NAVBAR ── */}
      <nav
        className={navScrolled ? "navbar-scrolled" : ""}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 500,
          background: "rgba(4,5,10,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(79,111,255,0.12)",
          padding: "0 max(1.5rem, calc((100vw - 1200px)/2))",
          transition: "all 0.4s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "68px",
          }}
        >
          {/* Logo */}
          <span
            className="logo-glow logo-shimmer"
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "1.3rem",
              background: "linear-gradient(135deg, #fff, #a5b4fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              cursor: "default",
            }}
          >
            Haseeb Nawaz
          </span>

          {/* Desktop links */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              alignItems: "center",
            }}
            className="nav-desktop"
          >
            {navLinks.map((l) => (
              <button
                type="button"
                key={l.id}
                data-ocid={`nav.${l.id}_link`}
                onClick={() => scrollTo(l.id)}
                className="nav-link-anim"
                style={{
                  background: "none",
                  border: "none",
                  color: "#9ca3af",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "color 0.2s",
                  padding: "4px 0",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "#9ca3af";
                }}
              >
                {l.label}
              </button>
            ))}
            <button
              type="button"
              data-ocid="nav.hire_button"
              onClick={openModal}
              className="btn-primary nav-cta-pulse"
              style={{ padding: "10px 24px", fontSize: "0.9rem" }}
            >
              Book a Call
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            data-ocid="nav.mobile_menu_button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            style={{
              background: "none",
              border: "1px solid rgba(79,111,255,0.3)",
              borderRadius: "8px",
              color: "#fff",
              padding: "8px 12px",
              cursor: "pointer",
              display: "none",
              fontSize: "1.1rem",
            }}
            className="nav-mobile-btn"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            style={{
              borderTop: "1px solid rgba(79,111,255,0.1)",
              padding: "1rem 0",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {navLinks.map((l) => (
              <button
                type="button"
                key={l.id}
                onClick={() => scrollTo(l.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#d1d5db",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "1rem",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "8px 4px",
                }}
              >
                {l.label}
              </button>
            ))}
            <button
              type="button"
              onClick={openModal}
              className="btn-primary"
              style={{ alignSelf: "flex-start" }}
            >
              Book a Call
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "6rem max(1.5rem, calc((100vw - 1200px)/2)) 4rem",
        }}
        className="grid-bg hero-animated-bg"
      >
        {/* Orbs */}
        <div
          className="orb-anim"
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(79,111,255,0.18) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          className="orb-anim"
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: "350px",
            height: "350px",
            background:
              "radial-gradient(circle, rgba(155,93,229,0.16) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
            animationDelay: "1.5s",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "250px",
            height: "250px",
            background:
              "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
          }}
        />
        <HeroCanvas />
        <GlassOrbs mouseX={mouseX} mouseY={mouseY} />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "3rem",
            alignItems: "center",
            width: "100%",
          }}
          className="hero-grid"
        >
          {/* Text */}
          <div
            className="hero-parallax-text"
            style={{ transform: `translateY(${scrollY * 0.12}px)` }}
          >
            {/* Badge */}
            <div
              className="hero-badge-anim"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(79,111,255,0.1)",
                border: "1px solid rgba(79,111,255,0.35)",
                borderRadius: "100px",
                padding: "8px 18px",
                marginBottom: "1.5rem",
                fontSize: "0.85rem",
                color: "#93c5fd",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  background: "#4f6fff",
                  borderRadius: "50%",
                  display: "inline-block",
                  boxShadow: "0 0 8px #4f6fff",
                }}
              />
              Haseeb Nawaz — Agentic AI Engineer &amp; AI Automation Engineer
            </div>

            <h1
              className="hero-headline"
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "2.4rem",
                lineHeight: 1.15,
                marginBottom: "1.4rem",
              }}
            >
              {["Stop", "Manual", "Work."].map((w, i) => (
                <span
                  key={w}
                  className="word-reveal"
                  style={{
                    animationDelay: `${i * 0.12}s`,
                    color: "#fff",
                    display: "inline-block",
                    marginRight: "0.3em",
                  }}
                >
                  {w}
                </span>
              ))}
              {["Scale", "Your", "Business"].map((w, i) => (
                <span
                  key={w}
                  className="word-reveal"
                  style={{
                    animationDelay: `${(i + 3) * 0.12}s`,
                    background: "linear-gradient(135deg, #4f6fff, #9b5de5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    display: "inline-block",
                    marginRight: "0.3em",
                  }}
                >
                  {w}
                </span>
              ))}
              {["with", "AI", "Automation"].map((w, i) => (
                <span
                  key={w}
                  className="word-reveal"
                  style={{
                    animationDelay: `${(i + 6) * 0.12}s`,
                    background: "linear-gradient(135deg, #00d4ff, #4f6fff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    display: "inline-block",
                    marginRight: "0.3em",
                  }}
                >
                  {w}
                </span>
              ))}
            </h1>

            <p
              className="hero-sub"
              style={{
                color: "#9ca3af",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                marginBottom: "2.2rem",
                maxWidth: "540px",
              }}
            >
              I build intelligent AI agents and automation systems that save
              time, reduce costs, and help businesses grow faster.
            </p>

            <div
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
              className="hero-btns"
            >
              <button
                type="button"
                data-ocid="hero.view_services_button"
                onClick={() => scrollTo("services")}
                className="btn-ghost"
              >
                View Services
              </button>
              <button
                type="button"
                data-ocid="hero.hire_button"
                onClick={(e) => {
                  addRipple(e);
                  openModal();
                }}
                className="btn-primary"
              >
                Book a Call →
              </button>
            </div>
          </div>

          {/* Profile image */}
          <div
            className="float-anim hero-img-wrap"
            style={{ position: "relative", flexShrink: 0 }}
          >
            {/* Multi spinning rings */}
            <div className="profile-ring-1" />
            <div className="profile-ring-2" />
            <div className="profile-ring-3" />
            <div className="profile-ring-glow" />
            {/* Original conic ring */}
            <div
              className="spin-ring"
              style={{
                position: "absolute",
                inset: "-10px",
                borderRadius: "50%",
                background:
                  "conic-gradient(from 0deg, #4f6fff, #9b5de5, #00d4ff, #4f6fff)",
                padding: "3px",
                zIndex: 0,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "#04050a",
                }}
              />
            </div>
            <img
              src={PROFILE_IMG}
              alt="Haseeb Nawaz"
              style={{
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center top",
                position: "relative",
                zIndex: 1,
                display: "block",
              }}
            />
            {/* Online dot */}
            <span
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                width: "20px",
                height: "20px",
                background: "#00c853",
                borderRadius: "50%",
                border: "3px solid #04050a",
                zIndex: 2,
                boxShadow: "0 0 10px #00c853",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── LIVE ANIMATION SECTION ── */}
      <section
        style={{
          background: "#0B0F19",
          padding: "4rem max(1.5rem, calc((100vw - 1200px)/2))",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(0,212,255,0.1)",
            border: "1px solid rgba(0,212,255,0.25)",
            borderRadius: "100px",
            padding: "6px 16px",
            color: "#00d4ff",
            fontSize: "0.8rem",
            marginBottom: "1rem",
            fontFamily: "Syne, sans-serif",
            fontWeight: 600,
          }}
        >
          ● LIVE
        </div>
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "2rem",
            marginBottom: "0.5rem",
            color: "#fff",
          }}
        >
          AI Systems Running in{" "}
          <span className="gradient-text-cyan">Real Time</span>
        </h2>
        <p
          style={{
            color: "#6b7280",
            marginBottom: "2rem",
            fontSize: "0.95rem",
          }}
        >
          Every automation, agent, and workflow — live and intelligent.
        </p>
        <div
          style={{
            height: "380px",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(79,111,255,0.15)",
            background: "#080c14",
          }}
        >
          <NeuralCanvas />
        </div>

        {/* Floating live activity cards */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "1.5rem",
          }}
        >
          {[
            {
              emoji: "🎯",
              text: "Lead Captured",
              sub: "2 seconds ago",
              color: "#4f6fff",
            },
            {
              emoji: "📧",
              text: "Email Sent",
              sub: "Auto-reply fired",
              color: "#9b5de5",
            },
            {
              emoji: "🤖",
              text: "Agent Running",
              sub: "n8n Workflow",
              color: "#00d4ff",
            },
            {
              emoji: "⚡",
              text: "Task Automated",
              sub: "Saved 3 hrs",
              color: "#00c853",
            },
            {
              emoji: "🔄",
              text: "CRM Updated",
              sub: "GoHighLevel",
              color: "#ff6b6b",
            },
          ].map((card, i) => (
            <div
              key={card.text}
              className="live-card"
              style={{
                animationDelay: `${i * 0.4}s`,
                background: `rgba(${card.color === "#4f6fff" ? "79,111,255" : card.color === "#9b5de5" ? "155,93,229" : card.color === "#00d4ff" ? "0,212,255" : card.color === "#00c853" ? "0,200,83" : "255,107,107"},0.08)`,
                border: `1px solid ${card.color}44`,
                borderRadius: "16px",
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{card.emoji}</span>
              <div>
                <div
                  style={{
                    color: "#fff",
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                >
                  {card.text}
                </div>
                <div style={{ color: card.color, fontSize: "0.72rem" }}>
                  ✓ {card.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI UNIVERSE ── */}
      <AIUniverseAnimation />

      {/* ── STATS ── */}
      <section
        style={{
          background: "#04050a",
          padding: "3rem max(1.5rem, calc((100vw - 1200px)/2))",
          borderTop: "1px solid rgba(79,111,255,0.08)",
          borderBottom: "1px solid rgba(79,111,255,0.08)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
          }}
          className="stats-grid"
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="stat-card stat-card-anim"
              data-ocid={`stats.item.${i + 1}`}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(79,111,255,0.2)",
                borderRadius: "20px",
                padding: "2rem 1.5rem",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "20%",
                  right: "20%",
                  height: "2px",
                  background:
                    "linear-gradient(90deg, transparent, #4f6fff, #9b5de5, transparent)",
                  borderRadius: "2px",
                }}
              />
              <div
                data-count-target={s.num.replace("+", "")}
                data-count-suffix="+"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 800,
                  fontSize: "3rem",
                  background:
                    "linear-gradient(135deg, #4f6fff, #9b5de5, #00d4ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "pulse-glow 3s ease-in-out infinite",
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERTISE STRIP ── */}
      <section
        data-reveal
        style={{
          padding: "5rem max(1.5rem, calc((100vw - 1200px)/2))",
          background: "linear-gradient(180deg, #04050a 0%, #070a14 100%)",
          borderTop: "1px solid rgba(79,111,255,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(79,111,255,0.12)",
              border: "1px solid rgba(79,111,255,0.3)",
              color: "#4f6fff",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "6px 18px",
              borderRadius: "100px",
              marginBottom: "1.2rem",
            }}
          >
            What I Do
          </span>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            AI Automation That{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #4f6fff, #9b5de5, #00d4ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Actually Works
            </span>
          </h2>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "1rem",
              marginTop: "1rem",
              maxWidth: "560px",
              margin: "1rem auto 0",
              lineHeight: 1.7,
            }}
          >
            From idea to deployed agent — I build intelligent systems that save
            time, cut costs, and scale your business 24/7.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.2rem",
          }}
        >
          {[
            {
              icon: "🤖",
              title: "AI Agents",
              desc: "Custom autonomous agents that handle tasks end-to-end",
              color: "#4f6fff",
            },
            {
              icon: "⚡",
              title: "n8n Workflows",
              desc: "Powerful automation flows connecting all your tools",
              color: "#9b5de5",
            },
            {
              icon: "🎯",
              title: "Lead Generation",
              desc: "AI-powered pipelines that capture and qualify leads",
              color: "#00d4ff",
            },
            {
              icon: "📧",
              title: "Email Automation",
              desc: "Smart replies, follow-ups, and nurture sequences",
              color: "#00c853",
            },
            {
              icon: "🔗",
              title: "API Integration",
              desc: "Connect any platform — CRM, Slack, Notion and more",
              color: "#ff6b6b",
            },
            {
              icon: "🗣️",
              title: "Voice AI",
              desc: "AI voice bots that handle calls and customer support",
              color: "#ffa500",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="service-card"
              data-reveal
              style={{
                background: `linear-gradient(135deg, rgba(${item.color === "#4f6fff" ? "79,111,255" : item.color === "#9b5de5" ? "155,93,229" : item.color === "#00d4ff" ? "0,212,255" : item.color === "#00c853" ? "0,200,83" : item.color === "#ff6b6b" ? "255,107,107" : "255,165,0"},0.06) 0%, rgba(4,5,10,0.8) 100%)`,
                border: `1px solid ${item.color}30`,
                borderRadius: "20px",
                padding: "1.8rem 1.5rem",
                transition:
                  "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                cursor: "default",
                animationDelay: `${i * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-6px)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  `${item.color}66`;
                (e.currentTarget as HTMLElement).style.boxShadow =
                  `0 20px 40px ${item.color}20`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.borderColor =
                  `${item.color}30`;
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
                {item.icon}
              </div>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#ffffff",
                  marginBottom: "0.5rem",
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </div>
              <div
                style={{
                  height: "2px",
                  background: `linear-gradient(90deg, ${item.color}, transparent)`,
                  borderRadius: "2px",
                  marginTop: "1.2rem",
                  opacity: 0.6,
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section
        id="about"
        data-reveal
        style={{
          padding: "6rem max(1.5rem, calc((100vw - 1200px)/2))",
          background: "#04050a",
        }}
      >
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "2.5rem",
            marginBottom: "3rem",
            background: "linear-gradient(135deg, #4f6fff, #9b5de5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          About Me
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
          className="about-grid"
        >
          {/* Bio */}
          <div>
            <p
              style={{
                color: "#d1d5db",
                lineHeight: 1.85,
                fontSize: "0.975rem",
                whiteSpace: "pre-line",
              }}
            >
              {`🚀 Hi, I'm Haseeb Nawaz — a passionate Agentic AI Engineer and AI Automation Builder from Lahore, Pakistan.

I specialize in building intelligent AI systems and automation workflows that help businesses save time, reduce manual work, and scale operations efficiently.

My focus is on creating Agentic AI solutions — systems that can think, decide, and automate complex business processes.

🔥 I have 1+ year of hands-on experience in AI Automation and Agentic AI development, building real-world systems for businesses.

⚡ What I Do:
• Build AI Automation Systems
• Design Agentic AI workflows
• API integrations
• AI decision systems
• No-code & low-code automation`}
            </p>
          </div>

          {/* Tools + Skills card */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Tools */}
            <div>
              <p
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "1rem",
                  fontSize: "1rem",
                }}
              >
                🧠 Tools & Platforms
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {[
                  "n8n",
                  "Make.com",
                  "GoHighLevel",
                  "OpenAI APIs",
                  "Python",
                  "APIs",
                  "Webhooks",
                ].map((tool) => (
                  <span
                    key={tool}
                    style={{
                      background: "rgba(79,111,255,0.1)",
                      border: "1px solid rgba(79,111,255,0.3)",
                      color: "#93c5fd",
                      borderRadius: "100px",
                      padding: "6px 14px",
                      fontSize: "0.82rem",
                      fontFamily: "DM Sans, sans-serif",
                      boxShadow: "0 0 8px rgba(79,111,255,0.1)",
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills card */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(79,111,255,0.2)",
                borderRadius: "16px",
                padding: "1.5rem",
              }}
            >
              {[
                { icon: "⚙️", text: "Strategy-First Approach" },
                { icon: "🛠️", text: "Full Development Cycle" },
                { icon: "📈", text: "Scalable Systems" },
                { icon: "🤝", text: "Client Partnership" },
                { icon: "🔒", text: "Reliable & Secure" },
              ].map((s, idx) => (
                <div
                  key={s.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 0",
                    borderBottom:
                      idx < 4 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{s.icon}</span>
                  <span style={{ color: "#d1d5db", fontSize: "0.9rem" }}>
                    {s.text}
                  </span>
                  <span style={{ marginLeft: "auto", color: "#4f6fff" }}>
                    ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section
        id="services"
        data-reveal
        style={{
          padding: "6rem max(1.5rem, calc((100vw - 1200px)/2))",
          background: "#0B0F19",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "2.5rem",
              background: "linear-gradient(135deg, #4f6fff, #9b5de5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.75rem",
            }}
          >
            My Services
          </h2>
          <p style={{ color: "#6b7280" }}>
            End-to-end AI automation solutions for your business
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.25rem",
          }}
          className="services-grid"
        >
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              data-ocid={`services.item.${i + 1}`}
              className="service-card"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(79,111,255,0.2)",
                borderRadius: "16px",
                padding: "1.75rem",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                {s.icon}
              </div>
              <h3
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: "1rem",
                  marginBottom: "0.5rem",
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section
        id="projects"
        data-reveal
        style={{
          padding: "6rem max(1.5rem, calc((100vw - 1200px)/2))",
          background: "#04050a",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "2.5rem",
              background: "linear-gradient(135deg, #4f6fff, #9b5de5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.75rem",
            }}
          >
            Real Projects I&apos;ve Built
          </h2>
          <p style={{ color: "#6b7280" }}>
            AI automation systems delivered for real businesses
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
          }}
          className="projects-grid"
        >
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              data-ocid={`projects.item.${i + 1}`}
              className="service-card"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(79,111,255,0.2)",
                borderRadius: "16px",
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: `${p.tagColor}22`,
                  border: `1px solid ${p.tagColor}55`,
                  color: p.tagColor,
                  borderRadius: "100px",
                  padding: "3px 10px",
                  fontSize: "0.72rem",
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 600,
                }}
              >
                {p.tag}
              </span>
              <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
                {p.icon}
              </div>
              <h3
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.5rem",
                  fontSize: "1.05rem",
                }}
              >
                {p.title}
              </h3>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section
        id="certifications"
        data-reveal
        style={{
          padding: "6rem max(1.5rem, calc((100vw - 1200px)/2))",
          background: "#0B0F19",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "2.5rem",
              background: "linear-gradient(135deg, #4f6fff, #9b5de5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.75rem",
            }}
          >
            Certifications &amp; Credentials
          </h2>
          <p style={{ color: "#6b7280" }}>
            Industry-recognized credentials in AI and automation
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "1rem",
          }}
          className="certs-grid"
        >
          {CERTS.map((c, i) => (
            <div
              key={c.name}
              data-ocid={`certifications.item.${i + 1}`}
              className="service-card cert-card-anim"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(155,93,229,0.2)",
                borderRadius: "14px",
                padding: "1.5rem 1rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
                <span className="cert-icon-anim">{c.icon}</span>
              </div>
              <p
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: "0.82rem",
                  marginBottom: "0.3rem",
                  lineHeight: 1.3,
                }}
              >
                {c.name}
              </p>
              <p
                style={{
                  color: "#9b5de5",
                  fontSize: "0.72rem",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {c.issuer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE ME ── */}
      <section
        style={{
          padding: "6rem max(1.5rem, calc((100vw - 1200px)/2))",
          background: "#04050a",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "2.5rem",
              background: "linear-gradient(135deg, #4f6fff, #9b5de5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.75rem",
            }}
          >
            Why Work With Me?
          </h2>
          <p style={{ color: "#6b7280" }}>
            The advantages that make my work stand out
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "1.25rem",
          }}
          className="why-grid"
        >
          {WHY.map((w) => (
            <div
              key={w.title}
              className="service-card"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(79,111,255,0.2)",
                borderRadius: "16px",
                padding: "2rem 1.25rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                {w.icon}
              </div>
              <h3
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                  lineHeight: 1.3,
                }}
              >
                {w.title}
              </h3>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "0.8rem",
                  lineHeight: 1.6,
                }}
              >
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL LINKS ── */}
      <section
        style={{
          padding: "5rem max(1.5rem, calc((100vw - 1200px)/2))",
          background: "#0B0F19",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "2.2rem",
            color: "#fff",
            marginBottom: "2.5rem",
          }}
        >
          Connect With Me
        </h2>
        <div
          style={{
            display: "flex",
            gap: "1.25rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            data-ocid="social.linkedin_button"
            className="social-btn social-btn-anim"
            href="https://www.linkedin.com/in/haseeb-nawaz-99355b395/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(10,102,194,0.15)",
              border: "1.5px solid rgba(10,102,194,0.5)",
              color: "#60a5fa",
              padding: "14px 32px",
              borderRadius: "28px",
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "1rem",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(10,102,194,0.3)";
              el.style.boxShadow = "0 0 20px rgba(10,102,194,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(10,102,194,0.15)";
              el.style.boxShadow = "none";
            }}
          >
            💼 LinkedIn
          </a>
          <a
            data-ocid="social.fiverr_button"
            className="social-btn social-btn-anim"
            href="https://www.fiverr.com/mubsharnawaz835?public_mode=true"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(29,191,115,0.12)",
              border: "1.5px solid rgba(29,191,115,0.4)",
              color: "#4ade80",
              padding: "14px 32px",
              borderRadius: "28px",
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "1rem",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(29,191,115,0.25)";
              el.style.boxShadow = "0 0 20px rgba(29,191,115,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(29,191,115,0.12)";
              el.style.boxShadow = "none";
            }}
          >
            🟢 Fiverr
          </a>
          <a
            data-ocid="social.upwork_button"
            className="social-btn social-btn-anim"
            href="https://www.upwork.com/freelancers/~015345c26be3b242c8"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(20,176,118,0.12)",
              border: "1.5px solid rgba(20,176,118,0.4)",
              color: "#34d399",
              padding: "14px 32px",
              borderRadius: "28px",
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "1rem",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(20,176,118,0.25)";
              el.style.boxShadow = "0 0 20px rgba(20,176,118,0.3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(20,176,118,0.12)";
              el.style.boxShadow = "none";
            }}
          >
            🔷 Upwork
          </a>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section
        id="faqs"
        style={{
          padding: "6rem max(1.5rem, calc((100vw - 1200px)/2))",
          background: "#0B0F19",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "2.5rem",
              background: "linear-gradient(135deg, #4f6fff, #9b5de5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.75rem",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p style={{ color: "#6b7280" }}>Everything you need to know</p>
        </div>
        <FaqSection />
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "5rem max(1.5rem, calc((100vw - 1200px)/2))",
          background: "#04050a",
        }}
      >
        <div
          style={{
            background: "transparent",
            borderRadius: "32px",
            padding: "5rem 3rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow:
              "0 20px 80px rgba(124,58,237,0.45), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          {/* Animated CTA Canvas */}
          <canvas
            ref={ctaCanvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              borderRadius: "32px",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          {/* Decorative background orbs */}
          <div
            style={{
              position: "absolute",
              top: "-80px",
              left: "-80px",
              zIndex: 1,
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-100px",
              right: "-60px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "rgba(34,211,238,0.15)",
              filter: "blur(80px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "60%",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(79,111,255,0.2)",
              filter: "blur(50px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "15%",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.07)",
              filter: "blur(40px)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "50px",
              padding: "8px 20px",
              marginBottom: "1.8rem",
              fontSize: "0.9rem",
              color: "#fff",
              fontWeight: 600,
              position: "relative",
              zIndex: 2,
              letterSpacing: "0.02em",
            }}
          >
            🤖 AI-Powered Automation
          </div>

          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "3rem",
              color: "#fff",
              marginBottom: "1.2rem",
              position: "relative",
              zIndex: 2,
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              lineHeight: 1.15,
            }}
          >
            Ready to Automate Your Business?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.2rem",
              marginBottom: "2.8rem",
              position: "relative",
              zIndex: 2,
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              maxWidth: "560px",
              margin: "0 auto 2.8rem",
            }}
          >
            Let&apos;s build intelligent systems that work for you — 24/7.
          </p>
          <button
            type="button"
            data-ocid="cta.hire_button"
            onClick={(e) => {
              addRipple(e);
              openModal();
            }}
            className="cta-white-btn"
            style={{
              fontSize: "1.1rem",
              padding: "16px 44px",
              borderRadius: "50px",
              fontWeight: 700,
              position: "relative",
              zIndex: 2,
              boxShadow: "0 8px 32px rgba(255,255,255,0.25)",
            }}
          >
            Book a Call Now 🚀
          </button>
        </div>
      </section>

      {/* ── BEFORE / AFTER TRANSFORMATION ── */}
      <BeforeAfterSection openModal={openModal} />
      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "#04050a",
          borderTop: "1px solid rgba(79,111,255,0.12)",
          padding: "2.5rem max(1.5rem, calc((100vw - 1200px)/2))",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "0.2rem",
              }}
            >
              Haseeb Nawaz — AI Automation Engineer
            </p>
            <p style={{ color: "#4b5563", fontSize: "0.8rem" }}>
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1.5rem" }}>
            {navLinks.slice(0, 3).map((l) => (
              <button
                type="button"
                key={l.id}
                onClick={() => scrollTo(l.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "#9ca3af";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "#6b7280";
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          <p style={{ color: "#4b5563", fontSize: "0.8rem" }}>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#6b7280", textDecoration: "underline" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* ── MODAL ── */}
      {showModal && <ContactModal onClose={closeModal} />}

      {/* ── ANIMATIONS ── */}
      <PageLoadOverlay />
      <MouseTrail />

      {/* ── CHATBOT ── */}
      <ChatbotWidget />

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        @media (max-width: 1024px) {
          .certs-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .why-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .hero-img-wrap { order: -1; display: flex; justify-content: center; }
          .hero-img-wrap img { width: 200px !important; height: 200px !important; }
          .hero-img-wrap > div:first-child { width: 220px !important; height: 220px !important; }
          .hero-btns { flex-direction: column !important; }
          .hero-btns button, .hero-btns a { width: 100%; justify-content: center; }
          .about-grid { grid-template-columns: 1fr !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .certs-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .why-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-btn { display: none !important; }
        }
        @media (max-width: 480px) {
          .certs-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .why-grid { grid-template-columns: 1fr !important; }
        }


        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 8px rgba(155,93,229,0.6), 0 0 20px rgba(79,111,255,0.3); transform: scale(1); }
          50% { text-shadow: 0 0 16px rgba(155,93,229,1), 0 0 40px rgba(79,111,255,0.6); transform: scale(1.15); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(155,93,229,0.2); box-shadow: none; }
          50% { border-color: rgba(155,93,229,0.6); box-shadow: 0 0 18px rgba(155,93,229,0.25); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cert-card-anim {
          animation: borderGlow 3s ease-in-out infinite;
        }
        .cert-card-anim:nth-child(2n) { animation-delay: 0.5s; }
        .cert-card-anim:nth-child(3n) { animation-delay: 1s; }
        .cert-card-anim:nth-child(4n) { animation-delay: 1.5s; }
        .cert-card-anim:nth-child(5n) { animation-delay: 2s; }
        .cert-icon-anim {
          display: inline-block;
          animation: floatY 3s ease-in-out infinite;
        }
        .cert-card-anim:nth-child(2n) .cert-icon-anim { animation-delay: 0.6s; }
        .cert-card-anim:nth-child(3n) .cert-icon-anim { animation-delay: 1.2s; }
        .social-btn-anim {
          position: relative;
          overflow: hidden;
        }
        .social-btn-anim::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          animation: socialShimmer 3s ease-in-out infinite;
        }
        .social-btn-anim:nth-child(2)::before { animation-delay: 1s; }
        .social-btn-anim:nth-child(3)::before { animation-delay: 2s; }
        @keyframes socialShimmer {
          0% { left: -100%; }
          50%, 100% { left: 150%; }
        }
        .section-heading-glow {
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}
