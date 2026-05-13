import { useEffect, useRef } from "react";

const TRACE_COUNT = 19;
const TRACE_COLOR = "rgba(220, 230, 240,";
const LINE_OPACITY = 0.12;
const NODE_OPACITY = 0.2;
const SEGMENT_MIN = 80;
const SEGMENT_MAX = 220;
const DRAW_SPEED = 60; // px per second
const ERASE_SPEED = 80; // px per second — tail chases head slightly faster
const HOLD_DURATION = 2000; // ms
const SPAWN_DELAY = 600; // ms between spawns on init

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function randomInt(a, b) {
  return Math.floor(randomBetween(a, b + 1));
}

function createTrace(canvasW, canvasH) {
  const segmentCount = randomInt(2, 4);
  const segments = [];
  let x = randomBetween(canvasW * 0.05, canvasW * 0.95);
  let y = randomBetween(canvasH * 0.05, canvasH * 0.95);
  let dir = Math.random() < 0.5 ? "h" : "v";

  for (let i = 0; i < segmentCount; i++) {
    const len = randomBetween(SEGMENT_MIN, SEGMENT_MAX) * (Math.random() < 0.5 ? 1 : -1);
    segments.push({ x, y, dir, len });
    if (dir === "h") x += len;
    else y += len;
    dir = dir === "h" ? "v" : "h";
  }

  // precompute cumulative distances so we can map px offsets to positions
  let cum = 0;
  for (const seg of segments) {
    seg.start = cum;
    seg.absLen = Math.abs(seg.len);
    cum += seg.absLen;
  }

  const components = [];
  const eligibleSegs = segments.filter(s => s.absLen > 60);
  const compCount = randomInt(0, Math.min(2, eligibleSegs.length));
  for (let i = 0; i < compCount; i++) {
    const seg = eligibleSegs[randomInt(0, eligibleSegs.length - 1)];
    const t = randomBetween(0.3, 0.7);
    const cx = seg.dir === "h" ? seg.x + seg.len * t : seg.x;
    const cy = seg.dir === "v" ? seg.y + seg.len * t : seg.y;
    // store path position so we can show/hide based on tail/head
    const pathPos = seg.start + seg.absLen * t;
    components.push({ x: cx, y: cy, dir: seg.dir, type: Math.random() < 0.5 ? "resistor" : "capacitor", pathPos });
  }

  const totalLength = cum;

  return {
    segments,
    components,
    totalLength,
    head: 0,
    tail: 0,
    opacity: 1,
    phase: "drawing", // drawing | hold | fade | dead
    holdTimer: 0,
    fadeTimer: 0,
    spawnDelay: 0,
  };
}

// returns the canvas x,y at a given px offset along the path
function pointAtOffset(segments, offset) {
  for (const seg of segments) {
    if (offset <= seg.start + seg.absLen) {
      const t = (offset - seg.start) / seg.absLen;
      return {
        x: seg.dir === "h" ? seg.x + seg.len * t : seg.x,
        y: seg.dir === "v" ? seg.y + seg.len * t : seg.y,
      };
    }
  }
  const last = segments[segments.length - 1];
  return {
    x: last.dir === "h" ? last.x + last.len : last.x,
    y: last.dir === "v" ? last.y + last.len : last.y,
  };
}

function drawComponent(ctx, comp, alpha) {
  const { x, y, dir, type } = comp;
  ctx.strokeStyle = `${TRACE_COLOR} ${alpha})`;
  ctx.lineWidth = 2;

  if (type === "resistor") {
    const tickLen = 12;
    const tickGap = 10;
    for (let i = -1; i <= 1; i++) {
      if (dir === "h") {
        const tx = x + i * tickGap;
        ctx.beginPath(); ctx.moveTo(tx, y - tickLen); ctx.lineTo(tx, y + tickLen); ctx.stroke();
      } else {
        const ty = y + i * tickGap;
        ctx.beginPath(); ctx.moveTo(x - tickLen, ty); ctx.lineTo(x + tickLen, ty); ctx.stroke();
      }
    }
  } else {
    const plateLen = 20;
    const plateGap = 10;
    for (let side = -1; side <= 1; side += 2) {
      if (dir === "h") {
        const px = x + side * plateGap / 2;
        ctx.beginPath(); ctx.moveTo(px, y - plateLen); ctx.lineTo(px, y + plateLen); ctx.stroke();
      } else {
        const py = y + side * plateGap / 2;
        ctx.beginPath(); ctx.moveTo(x - plateLen, py); ctx.lineTo(x + plateLen, py); ctx.stroke();
      }
    }
  }
}

function drawTrace(ctx, trace) {
  const { segments, components, head, tail, opacity } = trace;
  if (head <= tail || opacity <= 0) return;

  const lineAlpha = LINE_OPACITY * opacity;
  const nodeAlpha = NODE_OPACITY * opacity;

  ctx.lineWidth = 2;
  ctx.strokeStyle = `${TRACE_COLOR} ${lineAlpha})`;

  // track which segment corners fall within [tail, head] for node rendering
  const nodes = [];

  for (const seg of segments) {
    const segEnd = seg.start + seg.absLen;

    // skip segments entirely before tail or after head
    if (segEnd <= tail || seg.start >= head) continue;

    const drawFrom = Math.max(tail, seg.start);
    const drawTo = Math.min(head, segEnd);

    const tFrom = (drawFrom - seg.start) / seg.absLen;
    const tTo = (drawTo - seg.start) / seg.absLen;

    const sx = seg.dir === "h" ? seg.x + seg.len * tFrom : seg.x;
    const sy = seg.dir === "v" ? seg.y + seg.len * tFrom : seg.y;
    const ex = seg.dir === "h" ? seg.x + seg.len * tTo : seg.x;
    const ey = seg.dir === "v" ? seg.y + seg.len * tTo : seg.y;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // node at segment start corner if it's in the visible range
    if (tail <= seg.start && seg.start <= head) {
      nodes.push({ x: seg.x, y: seg.y });
    }
    // node at segment end corner
    if (tail <= segEnd && segEnd <= head) {
      nodes.push({ x: seg.dir === "h" ? seg.x + seg.len : seg.x, y: seg.dir === "v" ? seg.y + seg.len : seg.y });
    }
  }

  for (const node of nodes) {
    ctx.strokeStyle = `${TRACE_COLOR} ${nodeAlpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // components visible only when their path position is within [tail, head]
  for (const comp of components) {
    if (comp.pathPos >= tail && comp.pathPos <= head) {
      drawComponent(ctx, comp, lineAlpha);
    }
  }

}

export default function SchematicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let lastTime = null;
    const traces = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < TRACE_COUNT; i++) {
      const t = createTrace(canvas.width, canvas.height);
      t.spawnDelay = i * SPAWN_DELAY;
      traces.push(t);
    }

    const tick = (now) => {
      if (!lastTime) lastTime = now;
      const dt = now - lastTime;
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < traces.length; i++) {
        const tr = traces[i];

        if (tr.spawnDelay > 0) {
          tr.spawnDelay -= dt;
          continue;
        }

        if (tr.phase === "drawing") {
          tr.head += DRAW_SPEED * (dt / 1000);
          if (tr.head >= tr.totalLength) {
            tr.head = tr.totalLength;
            tr.phase = "hold";
            tr.holdTimer = HOLD_DURATION;
          }
        } else if (tr.phase === "hold") {
          tr.holdTimer -= dt;
          if (tr.holdTimer <= 0) {
            tr.phase = "fade";
            tr.fadeTimer = (tr.totalLength / ERASE_SPEED) * 1000;
          }
        } else if (tr.phase === "fade") {
          tr.tail += ERASE_SPEED * (dt / 1000);
          tr.fadeTimer -= dt;
          tr.opacity = Math.max(0, tr.fadeTimer / ((tr.totalLength / ERASE_SPEED) * 1000));
          if (tr.tail >= tr.head) tr.phase = "dead";
        } else if (tr.phase === "dead") {
          traces[i] = createTrace(canvas.width, canvas.height);
          continue;
        }

        drawTrace(ctx, tr);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
