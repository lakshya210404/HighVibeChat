import { useEffect, useRef } from "react";

const SmokeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = canvas!.height + 100;
        this.size = Math.random() * 150 + 50;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = -Math.random() * 1.5 - 0.5;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.hue = Math.random() > 0.5 ? 155 : 280; // Green or purple
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
      }

      update() {
        this.x += this.speedX + Math.sin(this.life * 0.01) * 0.5;
        this.y += this.speedY;
        this.life++;
        this.size += 0.3;
        this.opacity *= 0.998;
      }

      draw() {
        if (!ctx) return;
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 50%, 40%, ${this.opacity})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 40%, 30%, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 30%, 20%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animate = () => {
      ctx.fillStyle = "rgba(10, 12, 16, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.05) {
        particles.push(new Particle());
      }

      particles = particles.filter(p => p.life < p.maxLife && p.opacity > 0.01);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default SmokeBackground;
