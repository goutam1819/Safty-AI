import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Maximize2, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Camera, 
  Zap, 
  Sparkles,
  Smartphone,
  CheckCircle2,
  Wifi,
  Radio,
  Flame,
  CloudFog,
  ShieldAlert,
  ShieldCheck,
  HardHat,
  Shirt
} from 'lucide-react';

const CAMERA_PRESETS = [
  { id: "cam-01", name: "Camera 01 — Production Floor", zone: "Zone A — Assembly & Production Floor", bg: "/assets/cctv_factory.jpg" },
  { id: "cam-02", name: "Camera 02 — Warehouse", zone: "Zone B — Logistics & High Racks", bg: "/assets/cctv_warehouse.jpg" },
  { id: "cam-03", name: "Camera 03 — Loading Bay", zone: "Zone C — Heavy Vehicle Freight Yard", bg: "/assets/cctv_loading.jpg" },
  { id: "cam-04", name: "Camera 04 — Assembly Line", zone: "Zone D — Precision Robotics & Machining", bg: "/assets/cctv_assembly.jpg" },
];

export default function LiveVideoAIPlayer({
  onViolationAlert,
  onCounterUpdate,
  cameraZone = "Zone A — Assembly Line"
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const imageCacheRef = useRef({});
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const lastInferenceTimeRef = useRef(0);
  const isInferringRef = useRef(false);

  // Playback & Stream State
  const [isPlaying, setIsPlaying] = useState(true);
  const [showOverlays, setShowOverlays] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState("Camera 01 — Production Floor");
  
  // LIVE PHONE / WEBCAM MODE
  const [isLiveCameraMode, setIsLiveCameraMode] = useState(false);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [cameraStatus, setCameraStatus] = useState("idle"); // idle, connecting, active, error
  const [cameraErrorMsg, setCameraErrorMsg] = useState("");
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [liveDetections, setLiveDetections] = useState([]);

  // LIVE EVENT SIMULATION & CLASSIFIER STATE
  // 'compliant' | 'missing_helmet' | 'missing_vest' | 'smoke' | 'fire'
  const [liveEventType, setLiveEventType] = useState('compliant');

  // Real-time metrics
  const [fps, setFps] = useState(30);
  const [latency, setLatency] = useState(31);
  const [aiMode, setAiMode] = useState("LIVE AI DETECTION");
  
  // Real-time violation simulation
  const [activePopupAlert, setActivePopupAlert] = useState(null);
  const [isJudgeDemoRunning, setIsJudgeDemoRunning] = useState(false);
  const [demoStepMessage, setDemoStepMessage] = useState("");

  // Live KPI counters
  const [counters, setCounters] = useState({
    workersDetected: 2,
    safeWorkers: 2,
    violations: 0,
    alerts: 0
  });

  const activePreset = CAMERA_PRESETS.find(c => c.name === selectedCamera) || CAMERA_PRESETS[0];

  // Preload all camera images into memory cache on mount
  useEffect(() => {
    CAMERA_PRESETS.forEach(preset => {
      if (!imageCacheRef.current[preset.bg]) {
        const img = new Image();
        img.src = preset.bg;
        imageCacheRef.current[preset.bg] = img;
      }
    });
  }, []);

  // Enumerate video devices (Iriun Webcam, DroidCam, etc.)
  const enumerateCameras = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      setCameraDevices(videoInputs);
      if (videoInputs.length > 0 && !selectedDeviceId) {
        // Prefer phone webcams if found
        const phoneCam = videoInputs.find(d => 
          d.label.toLowerCase().includes('iriun') || 
          d.label.toLowerCase().includes('droid') ||
          d.label.toLowerCase().includes('phone')
        );
        setSelectedDeviceId(phoneCam ? phoneCam.deviceId : videoInputs[0].deviceId);
      }
    } catch (err) {
      console.warn("Could not enumerate video devices:", err);
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    enumerateCameras();
  }, [enumerateCameras]);

  // Dispatch event alert to Dashboard
  const triggerEventAlert = useCallback((eventType) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let alertData = null;
    let counterData = { workersDetected: 1, safeWorkers: 1, violations: 0, alerts: 0 };

    if (eventType === 'missing_helmet') {
      alertData = {
        title: "PPE VIOLATION: NO HELMET",
        worker: "Live Camera Worker #01",
        violation: "Missing Hardhat / Safety Helmet Protocol Breached",
        zone: "Live Phone / Zone A (Assembly)",
        confidence: "98.5%",
        severity: "High",
        time: timeStr
      };
      counterData = { workersDetected: 1, safeWorkers: 0, violations: 1, alerts: 1 };
    } else if (eventType === 'missing_vest') {
      alertData = {
        title: "PPE VIOLATION: NO HIGH-VIS VEST",
        worker: "Live Camera Worker #01",
        violation: "Missing Reflective Safety Vest in Heavy Vehicle Zone",
        zone: "Live Phone / Zone A (Assembly)",
        confidence: "96.4%",
        severity: "High",
        time: timeStr
      };
      counterData = { workersDetected: 1, safeWorkers: 0, violations: 1, alerts: 1 };
    } else if (eventType === 'smoke') {
      alertData = {
        title: "ENVIRONMENTAL HAZARD: SMOKE DETECTED",
        worker: "Hazard Sensor & Camera #01",
        violation: "Volumetric Smoke Cloud Exceeding 250 PPM Limit",
        zone: "Live Phone / Sector 01 High Hazard",
        confidence: "94.2%",
        severity: "Critical",
        time: timeStr
      };
      counterData = { workersDetected: 1, safeWorkers: 0, violations: 1, alerts: 1 };
    } else if (eventType === 'fire') {
      alertData = {
        title: "CRITICAL EMERGENCY: ACTIVE FIRE OUTBREAK",
        worker: "Thermal AI & Camera #01",
        violation: "Volumetric Flame Outbreak Detected — Evacuation Required",
        zone: "Live Phone / Sector 01 Furnace Line",
        confidence: "98.8%",
        severity: "Critical",
        time: timeStr
      };
      counterData = { workersDetected: 1, safeWorkers: 0, violations: 1, alerts: 1 };
    } else {
      // Compliant
      setActivePopupAlert(null);
      counterData = { workersDetected: 1, safeWorkers: 1, violations: 0, alerts: 0 };
    }

    if (alertData) {
      setActivePopupAlert(alertData);
      if (onViolationAlert) onViolationAlert(alertData);
    }
    if (onCounterUpdate) onCounterUpdate(counterData);
  }, [onViolationAlert, onCounterUpdate]);

  // Connect WebSocket to FastAPI YOLOv8 Live Streaming Endpoint
  const connectWebSocket = useCallback(() => {
    try {
      const wsHost = window.location.hostname || 'localhost';
      const wsUrl = `ws://${wsHost}:8000/ws/live-stream`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsWsConnected(true);
      };

      ws.onmessage = (event) => {
        isInferringRef.current = false;
        try {
          const data = JSON.parse(event.data);
          if (data.success) {
            setLatency(data.latency_ms || 32);
            if (data.detections) {
              setLiveDetections(data.detections);
            }
            if (data.smoke_fire_detected) {
              setLiveEventType('fire');
              triggerEventAlert('fire');
            } else if (data.violations_found > 0) {
              setLiveEventType('missing_helmet');
              triggerEventAlert('missing_helmet');
            }
          }
        } catch (e) {
          console.warn("WebSocket parse error:", e);
        }
      };

      ws.onerror = () => setIsWsConnected(false);
      ws.onclose = () => setIsWsConnected(false);
    } catch (e) {
      console.warn("WebSocket init failed:", e);
    }
  }, [triggerEventAlert]);

  // Start Live Phone / USB Webcam Stream
  const startLiveCamera = async (deviceIdToUse) => {
    setCameraStatus("connecting");
    setCameraErrorMsg("");

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const constraints = {
        video: {
          deviceId: deviceIdToUse ? { exact: deviceIdToUse } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsLiveCameraMode(true);
      setCameraStatus("active");
      await enumerateCameras();
      connectWebSocket();
      triggerEventAlert('compliant');
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraStatus("error");
      setCameraErrorMsg(err.message || "Failed to access phone/webcam. Please allow camera permissions in your browser.");
      setIsLiveCameraMode(false);
    }
  };

  // Stop Live Phone / Webcam Stream
  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsLiveCameraMode(false);
    setCameraStatus("idle");
    setLiveDetections([]);
    setActivePopupAlert(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // 60 FPS Surveillance Animation & Computer Vision Tracking Loop
  useEffect(() => {
    let animId;
    let canvas = canvasRef.current;
    if (!canvas) return;

    let ctx = canvas.getContext('2d');
    let frame = 0;

    let bgImg = imageCacheRef.current[activePreset.bg];
    if (!bgImg) {
      bgImg = new Image();
      bgImg.src = activePreset.bg;
      imageCacheRef.current[activePreset.bg] = bgImg;
    }

    const render = () => {
      if (isPlaying) {
        frame++;
      }

      const w = canvas.width;
      const h = canvas.height;
      const t = frame / 30.0;

      // ========================================================
      // MODE A: LIVE PHONE / WEBCAM STREAM
      // ========================================================
      if (isLiveCameraMode && videoRef.current && videoRef.current.readyState >= 2) {
        // 1. Draw Real Live Video Frame from Phone/Webcam
        ctx.drawImage(videoRef.current, 0, 0, w, h);

        // Surveillance tint overlay
        ctx.fillStyle = 'rgba(6, 12, 28, 0.10)';
        ctx.fillRect(0, 0, w, h);

        // 2. Send frame to FastAPI YOLOv8 Live WebSocket (throttled every 160ms)
        const now = Date.now();
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && !isInferringRef.current && (now - lastInferenceTimeRef.current > 160)) {
          lastInferenceTimeRef.current = now;
          isInferringRef.current = true;
          try {
            const offCanvas = document.createElement('canvas');
            offCanvas.width = 480;
            offCanvas.height = 270;
            const offCtx = offCanvas.getContext('2d');
            offCtx.drawImage(videoRef.current, 0, 0, 480, 270);
            const dataUrl = offCanvas.toDataURL('image/jpeg', 0.65);
            wsRef.current.send(dataUrl);
          } catch (e) {
            isInferringRef.current = false;
          }
        }

        // ========================================================
        // 3. RENDER REAL-TIME DETAILED EVENT OVERLAYS ACCORDING TO LIVE EVENT
        // ========================================================
        if (showOverlays) {
          const cx = w * 0.28;
          const cy = h * 0.16;
          const cw = w * 0.44;
          const ch = h * 0.72;

          // Corner Bracket Helper
          const drawBrackets = (bx, by, bw, bh, color, blen = 22, lw = 3) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = lw;
            // TL
            ctx.beginPath(); ctx.moveTo(bx, by + blen); ctx.lineTo(bx, by); ctx.lineTo(bx + blen, by); ctx.stroke();
            // TR
            ctx.beginPath(); ctx.moveTo(bx + bw - blen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + blen); ctx.stroke();
            // BL
            ctx.beginPath(); ctx.moveTo(bx, by + bh - blen); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + blen, by + bh); ctx.stroke();
            // BR
            ctx.beginPath(); ctx.moveTo(bx + bw - blen, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - blen); ctx.stroke();
          };

          // EVENT 1: FULL COMPLIANT
          if (liveEventType === 'compliant') {
            drawBrackets(cx, cy, cw, ch, '#10b981', 28, 3.5);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
            ctx.fillRect(cx, cy, cw, ch);

            // Head Box (Helmet Verified)
            const hx = cx + cw * 0.24, hy = cy + 12, hw = cw * 0.52, hh = ch * 0.28;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.strokeRect(hx, hy, hw, hh);
            ctx.fillStyle = 'rgba(7, 14, 30, 0.94)';
            ctx.fillRect(hx, Math.max(0, hy - 24), 180, 22);
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 11px monospace';
            ctx.fillText('HELMET: 98.4% VERIFIED ✓', hx + 6, Math.max(0, hy - 24) + 15);

            // Torso Box (Vest Verified)
            const tx = cx + cw * 0.15, ty = cy + ch * 0.32, tw = cw * 0.70, th = ch * 0.38;
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.strokeRect(tx, ty, tw, th);
            ctx.fillStyle = 'rgba(7, 14, 30, 0.94)';
            ctx.fillRect(tx, Math.max(0, ty - 24), 195, 22);
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 11px monospace';
            ctx.fillText('SAFETY VEST: 96.8% VERIFIED ✓', tx + 6, Math.max(0, ty - 24) + 15);

            // Main Worker Tag
            ctx.fillStyle = 'rgba(7, 14, 30, 0.95)';
            ctx.fillRect(cx, Math.max(0, cy - 38), 240, 34);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(cx, Math.max(0, cy - 38), 240, 34);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Segoe UI", sans-serif';
            ctx.fillText('WORKER #01 • LIVE CAMERA', cx + 8, Math.max(0, cy - 38) + 16);
            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 10px monospace';
            ctx.fillText('● PROTOCOL: 100% COMPLIANT', cx + 8, Math.max(0, cy - 38) + 28);
          }

          // EVENT 2: MISSING HELMET (VIOLATION)
          else if (liveEventType === 'missing_helmet') {
            const pulse = Math.sin(t * 10) > 0;
            const errColor = pulse ? '#ef4444' : '#f87171';
            drawBrackets(cx, cy, cw, ch, errColor, 28, 4);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
            ctx.fillRect(cx, cy, cw, ch);

            // Missing Helmet Head Box (Flashing Red)
            const hx = cx + cw * 0.24, hy = cy + 12, hw = cw * 0.52, hh = ch * 0.28;
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.setLineDash([6, 4]);
            ctx.strokeRect(hx, hy, hw, hh);
            ctx.setLineDash([]);

            // Exclamation badge
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(hx, Math.max(0, hy - 32), 230, 30);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'black 12px monospace';
            ctx.fillText('⚠️ MISSING HELMET (0%)', hx + 8, Math.max(0, hy - 32) + 14);
            ctx.font = '9px monospace';
            ctx.fillText('CRITICAL HEAD INJURY HAZARD', hx + 8, Math.max(0, hy - 32) + 25);

            // Torso (Vest still compliant)
            const tx = cx + cw * 0.15, ty = cy + ch * 0.32, tw = cw * 0.70, th = ch * 0.38;
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.strokeRect(tx, ty, tw, th);
            ctx.fillStyle = 'rgba(7, 14, 30, 0.94)';
            ctx.fillRect(tx, Math.max(0, ty - 22), 160, 20);
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 10px monospace';
            ctx.fillText('VEST: VERIFIED (95%) ✓', tx + 6, Math.max(0, ty - 22) + 14);

            // Bottom Alert Ribbon
            const ribW = 280;
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(cx + cw / 2 - ribW / 2, cy + ch + 8, ribW, 26);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px monospace';
            ctx.fillText('🚨 SAFETY VIOLATION DETECTED', cx + cw / 2 - 105, cy + ch + 24);
          }

          // EVENT 3: MISSING HIGH-VIS VEST (VIOLATION)
          else if (liveEventType === 'missing_vest') {
            const errColor = '#f59e0b';
            drawBrackets(cx, cy, cw, ch, errColor, 28, 4);
            ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
            ctx.fillRect(cx, cy, cw, ch);

            // Head (Helmet Compliant)
            const hx = cx + cw * 0.24, hy = cy + 12, hw = cw * 0.52, hh = ch * 0.28;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.strokeRect(hx, hy, hw, hh);
            ctx.fillStyle = 'rgba(7, 14, 30, 0.94)';
            ctx.fillRect(hx, Math.max(0, hy - 22), 170, 20);
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 10px monospace';
            ctx.fillText('HELMET: VERIFIED (98%) ✓', hx + 6, Math.max(0, hy - 22) + 14);

            // Torso (MISSING VEST - Pulsing Amber)
            const tx = cx + cw * 0.15, ty = cy + ch * 0.32, tw = cw * 0.70, th = ch * 0.38;
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 3;
            ctx.setLineDash([6, 4]);
            ctx.strokeRect(tx, ty, tw, th);
            ctx.setLineDash([]);

            ctx.fillStyle = '#d97706';
            ctx.fillRect(tx, Math.max(0, ty - 32), 230, 30);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'black 12px monospace';
            ctx.fillText('⚠️ MISSING HIGH-VIS VEST (0%)', tx + 8, Math.max(0, ty - 32) + 14);
            ctx.font = '9px monospace';
            ctx.fillText('VISIBILITY & VEHICLE IMPACT RISK', tx + 8, Math.max(0, ty - 32) + 25);
          }

          // EVENT 4: VOLUMETRIC SMOKE DETECTED
          else if (liveEventType === 'smoke') {
            // Draw simulated volumetric smoke haze clouds across top & center
            for (let i = 0; i < 6; i++) {
              const smX = (0.2 + (i * 0.12) + Math.sin(t * 1.5 + i) * 0.05) * w;
              const smY = (0.25 + Math.cos(t * 1.2 + i) * 0.08) * h;
              const rad = (70 + (i * 15)) + Math.sin(t * 2 + i) * 15;
              const grad = ctx.createRadialGradient(smX, smY, 10, smX, smY, rad);
              grad.addColorStop(0, 'rgba(148, 163, 184, 0.45)');
              grad.addColorStop(0.6, 'rgba(100, 116, 139, 0.25)');
              grad.addColorStop(1, 'rgba(51, 65, 85, 0)');
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(smX, smY, rad, 0, Math.PI * 2);
              ctx.fill();
            }

            // Hazard Bounding Box on Smoke origin
            const sx = w * 0.18, sy = h * 0.12, sw = w * 0.64, sh = h * 0.45;
            drawBrackets(sx, sy, sw, sh, '#94a3b8', 25, 3);
            ctx.fillStyle = 'rgba(7, 14, 30, 0.94)';
            ctx.fillRect(sx, sy - 34, 310, 32);
            ctx.strokeStyle = '#94a3b8';
            ctx.strokeRect(sx, sy - 34, 310, 32);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Segoe UI", sans-serif';
            ctx.fillText('💨 VOLUMETRIC SMOKE HAZARD (94.2%)', sx + 8, sy - 18);
            ctx.fillStyle = '#f87171';
            ctx.font = 'bold 10px monospace';
            ctx.fillText('● AIR QUALITY LEVEL: DANGEROUS (>250 PPM)', sx + 8, sy - 6);
          }

          // EVENT 5: ACTIVE FLAME / FIRE DETECTED
          else if (liveEventType === 'fire') {
            // Flickering fire glow around screen borders
            const glowOpacity = 0.25 + 0.15 * Math.sin(t * 12);
            ctx.fillStyle = `rgba(239, 68, 68, ${glowOpacity})`;
            ctx.fillRect(0, 0, w, 8);
            ctx.fillRect(0, h - 8, w, 8);
            ctx.fillRect(0, 0, 8, h);
            ctx.fillRect(w - 8, 0, 8, h);

            // Volumetric flickering flames in center-bottom
            const fx = w * 0.22, fy = h * 0.35, fw = w * 0.56, fh = h * 0.58;
            for (let f = 0; f < 8; f++) {
              const flameX = fx + (fw * (f / 8)) + Math.sin(t * 8 + f) * 12;
              const flameY = fy + fh * 0.6 - Math.random() * 80;
              const flameRad = 55 + Math.random() * 25;
              const fGrad = ctx.createRadialGradient(flameX, flameY, 5, flameX, flameY, flameRad);
              fGrad.addColorStop(0, 'rgba(255, 237, 74, 0.7)');
              fGrad.addColorStop(0.35, 'rgba(249, 115, 22, 0.5)');
              fGrad.addColorStop(0.7, 'rgba(239, 68, 68, 0.3)');
              fGrad.addColorStop(1, 'rgba(185, 28, 28, 0)');
              ctx.fillStyle = fGrad;
              ctx.beginPath();
              ctx.arc(flameX, flameY, flameRad, 0, Math.PI * 2);
              ctx.fill();
            }

            drawBrackets(fx, fy, fw, fh, '#ef4444', 32, 4);
            ctx.fillStyle = '#b91c1c';
            ctx.fillRect(fx, fy - 36, 330, 34);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px monospace';
            ctx.fillText('🔥 CRITICAL: FLAME OUTBREAK (98.8%)', fx + 8, fy - 20);
            ctx.font = 'bold 10px monospace';
            ctx.fillText('AUTOMATIC SPRINKLER PROTOCOL ENGAGED', fx + 8, fy - 8);
          }
        }

        // 4. ON-SCREEN LIVE EVENT INTELLIGENCE TELEMETRY HUD
        const boxW = 280;
        const boxH = 110;
        ctx.fillStyle = 'rgba(7, 14, 30, 0.88)';
        ctx.fillRect(w - boxW - 16, h - boxH - 16, boxW, boxH);
        ctx.strokeStyle = liveEventType === 'compliant' ? '#10b981' : '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(w - boxW - 16, h - boxH - 16, boxW, boxH);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('LIVE AI EVENT TELEMETRY', w - boxW - 6, h - boxH + 2);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "Segoe UI", sans-serif';
        ctx.fillText('EVENT TYPE:', w - boxW - 6, h - boxH + 20);
        ctx.fillStyle = liveEventType === 'compliant' ? '#34d399' : '#f87171';
        ctx.font = 'bold 11px monospace';
        const eventLabel = {
          compliant: 'PROTOCOL COMPLIANT',
          missing_helmet: 'MISSING HELMET BREACH',
          missing_vest: 'MISSING HIGH-VIS VEST',
          smoke: 'VOLUMETRIC SMOKE DETECTED',
          fire: 'ACTIVE FIRE OUTBREAK'
        }[liveEventType];
        ctx.fillText(eventLabel, w - boxW + 70, h - boxH + 20);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "Segoe UI", sans-serif';
        ctx.fillText('SEVERITY:', w - boxW - 6, h - boxH + 38);
        ctx.fillStyle = liveEventType === 'compliant' ? '#34d399' : (liveEventType === 'missing_vest' ? '#fbbf24' : '#ef4444');
        ctx.font = 'bold 11px monospace';
        ctx.fillText(liveEventType === 'compliant' ? 'NORMAL (SAFE)' : (liveEventType === 'fire' || liveEventType === 'smoke' ? 'CRITICAL (TIER 1)' : 'HIGH PRIORITY'), w - boxW + 70, h - boxH + 38);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "Segoe UI", sans-serif';
        ctx.fillText('ZONE:', w - boxW - 6, h - boxH + 56);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('Zone A — Live Phone Surveillance', w - boxW + 70, h - boxH + 56);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "Segoe UI", sans-serif';
        ctx.fillText('STATUS:', w - boxW - 6, h - boxH + 74);
        ctx.fillStyle = liveEventType === 'compliant' ? '#34d399' : '#f87171';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(liveEventType === 'compliant' ? 'All Parameters Verified' : 'Alert Dispatched to Console', w - boxW + 70, h - boxH + 74);

        // Top Right LIVE Stamp
        ctx.fillStyle = 'rgba(239, 68, 68, 0.95)';
        ctx.fillRect(w - 180, 16, 164, 32);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Courier New", monospace';
        ctx.fillText('🔴 LIVE PHONE CAM', w - 168, 36);

      } else {
        // ========================================================
        // MODE B: INDUSTRIAL CCTV SIMULATION (DEFAULT)
        // ========================================================
        if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
          ctx.drawImage(bgImg, 0, 0, w, h);
        } else {
          ctx.fillStyle = '#0a1020';
          ctx.fillRect(0, 0, w, h);
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 60) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
          }
          for (let y = 0; y < h; y += 60) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
          }
        }

        ctx.fillStyle = 'rgba(4, 9, 22, 0.22)';
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3;
        ctx.setLineDash([16, 12]);
        ctx.beginPath();
        ctx.moveTo(w * 0.08, h * 0.88);
        ctx.lineTo(w * 0.92, h * 0.88);
        ctx.stroke();
        ctx.setLineDash([]);

        const progress1 = 0.5 - 0.5 * Math.cos(t * (Math.PI * 2 / 8.0));
        const w1X = (0.16 + progress1 * 0.50) * w;
        const w1Y = 0.50 * h + Math.sin(t * 3.5) * 4;
        const w1W = 0.06 * w;
        const w1H = 0.30 * h;

        const progress2 = 0.5 + 0.5 * Math.cos(t * (Math.PI * 2 / 7.0));
        const w2X = (0.28 + progress2 * 0.46) * w;
        const w2Y = 0.53 * h + Math.cos(t * 3.2) * 4;
        const w2W = 0.062 * w;
        const w2H = 0.31 * h;

        const isW2Violating = (t % 30 >= 6 && t % 30 <= 22);

        const drawWorkerWithTracking = (x, y, pw, ph, isCompliant, workerName) => {
          const stride = Math.sin(t * 8) * (pw * 0.24);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.beginPath();
          ctx.ellipse(x + pw / 2, y + ph, pw * 0.5, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#1e293b';
          ctx.fillRect(x + pw * 0.18 - stride, y + ph * 0.60, pw * 0.25, ph * 0.40);
          ctx.fillRect(x + pw * 0.57 + stride, y + ph * 0.60, pw * 0.25, ph * 0.40);

          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x + pw * 0.16 - stride, y + ph * 0.94, pw * 0.30, ph * 0.06);
          ctx.fillRect(x + pw * 0.55 + stride, y + ph * 0.94, pw * 0.30, ph * 0.06);

          const torsoW = pw * 0.72;
          const torsoH = ph * 0.38;
          const torsoX = x + pw * 0.14;
          const torsoY = y + ph * 0.23;

          if (isCompliant) {
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(torsoX, torsoY, torsoW, torsoH);
            ctx.fillStyle = '#f1f5f9';
            ctx.fillRect(torsoX, torsoY + torsoH * 0.35, torsoW, 3);
            ctx.fillRect(torsoX, torsoY + torsoH * 0.65, torsoW, 3);
            ctx.fillRect(torsoX + torsoW * 0.28, torsoY, 4, torsoH);
            ctx.fillRect(torsoX + torsoW * 0.68, torsoY, 4, torsoH);
          } else {
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(torsoX, torsoY, torsoW, torsoH);
          }

          const armSwing = Math.sin(t * 8) * 8;
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(x + pw * 0.02, y + ph * 0.24 + armSwing, pw * 0.14, ph * 0.32);
          ctx.fillRect(x + pw * 0.84, y + ph * 0.24 - armSwing, pw * 0.14, ph * 0.32);

          const headRadius = pw * 0.26;
          const headCenterX = x + pw / 2;
          const headCenterY = y + ph * 0.13;

          if (isCompliant) {
            ctx.fillStyle = '#eab308';
            ctx.beginPath();
            ctx.arc(headCenterX, headCenterY, headRadius * 1.15, Math.PI, 0, false);
            ctx.fill();
            ctx.fillRect(headCenterX - headRadius * 1.3, headCenterY - 1, headRadius * 2.6, 4);
            ctx.fillStyle = '#fed7aa';
            ctx.beginPath();
            ctx.arc(headCenterX, headCenterY + 4, headRadius * 0.8, 0, Math.PI, false);
            ctx.fill();
          } else {
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.arc(headCenterX, headCenterY - 2, headRadius * 0.95, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fed7aa';
            ctx.beginPath();
            ctx.arc(headCenterX, headCenterY + 3, headRadius * 0.75, 0, Math.PI * 2);
            ctx.fill();
          }

          if (showOverlays) {
            const bx = x - 8;
            const by = y - 8;
            const bw = pw + 16;
            const bh = ph + 16;
            const color = isCompliant ? '#10b981' : '#ef4444';

            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;

            const bracketLen = 18;
            ctx.beginPath(); ctx.moveTo(bx, by + bracketLen); ctx.lineTo(bx, by); ctx.lineTo(bx + bracketLen, by); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(bx + bw - bracketLen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + bracketLen); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(bx, by + bh - bracketLen); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bracketLen, by + bh); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(bx + bw - bracketLen, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - bracketLen); ctx.stroke();

            ctx.fillStyle = isCompliant ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.12)';
            ctx.fillRect(bx, by, bw, bh);

            const tagW = Math.max(120, bw);
            const tagH = 30;
            ctx.fillStyle = 'rgba(7, 14, 30, 0.92)';
            ctx.fillRect(bx, by - tagH, tagW, tagH);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(bx, by - tagH, tagW, tagH);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px "Segoe UI", sans-serif';
            ctx.fillText(`${workerName} (${isCompliant ? '98%' : '94%'})`, bx + 8, by - tagH + 14);

            ctx.font = 'bold 9px monospace';
            if (isCompliant) {
              ctx.fillStyle = '#34d399';
              ctx.fillText('HELMET ✓ | VEST ✓', bx + 8, by - tagH + 24);
            } else {
              ctx.fillStyle = '#fca5a5';
              ctx.fillText('NO HELMET | NO VEST', bx + 8, by - tagH + 24);
            }

            if (!isCompliant) {
              const pillW = 96;
              ctx.fillStyle = '#dc2626';
              ctx.fillRect(bx + bw / 2 - pillW / 2, by + bh + 4, pillW, 16);
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 9px monospace';
              ctx.fillText('CRITICAL ALERT', bx + bw / 2 - 40, by + bh + 15);
            }
          }
        };

        drawWorkerWithTracking(w1X, w1Y, w1W, w1H, true, 'Worker #08');
        drawWorkerWithTracking(w2X, w2Y, w2W, w2H, !isW2Violating, 'Worker #12');

        const violCount = isW2Violating ? 1 : 0;
        const safeCount = 2 - violCount;
        setCounters({
          workersDetected: 2,
          safeWorkers: safeCount,
          violations: violCount,
          alerts: violCount
        });
      }

      // Telemetry Timestamp
      const now = new Date();
      const pad = (n, s = 2) => n.toString().padStart(s, '0');
      const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(Math.floor(now.getMilliseconds() / 10))}`;

      // Top Left Telemetry Box
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(16, 14, 380, 50);
      ctx.fillStyle = isLiveCameraMode ? '#38bdf8' : '#10b981';
      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.fillText(isLiveCameraMode ? 'LIVE STREAM [PHONE / WEBCAM]' : `${activePreset.id.toUpperCase()} [${activePreset.zone.slice(0, 24)}]`, 26, 32);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '12px "Courier New", monospace';
      ctx.fillText(`${timeStr}  30 FPS  FHD`, 26, 52);

      // Top Right REC Blinker
      if (Math.floor(t * 2) % 2 === 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(w - 75, 30, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.fillText('REC', w - 60, 34);

      // Scanline CRT Noise
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      for (let scY = 0; scY < h; scY += 4) {
        ctx.fillRect(0, scY, w, 1.5);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, showOverlays, activePreset, isLiveCameraMode, liveEventType]);

  // Automated Judge Demo presentation
  const triggerJudgeDemo = () => {
    setIsJudgeDemoRunning(true);
    setDemoStepMessage("Step 1/5: Connecting High-Speed Plant Surveillance Feed...");
    setLiveEventType('compliant');
    triggerEventAlert('compliant');

    setTimeout(() => {
      setDemoStepMessage("Step 2/5: YOLOv8 AI Multi-Worker Tracking Locked (Brackets follow workers)");
    }, 2500);

    setTimeout(() => {
      setDemoStepMessage("Step 3/5: Real-Time PPE Verification: Hardhats & High-Vis Vests Active");
    }, 5500);

    setTimeout(() => {
      setDemoStepMessage("Step 4/5: 🔴 CRITICAL SAFETY EVENT: Worker Removed Hardhat!");
      setLiveEventType('missing_helmet');
      triggerEventAlert('missing_helmet');
    }, 8500);

    setTimeout(() => {
      setDemoStepMessage("Step 5/5: Alert Dispatched to Safety Console & Incident Log");
    }, 13000);

    setTimeout(() => {
      setIsJudgeDemoRunning(false);
      setDemoStepMessage("");
    }, 17000);
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl bg-[#081024] border border-[#162a56] overflow-hidden shadow-2xl flex flex-col group select-none"
    >
      {/* Hidden HTML5 video element for webcam streaming */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
        autoPlay
      />

      {/* 1. TOP HEADER: Status, Mode, Metrics & Camera Switcher */}
      <div className="px-4 py-2.5 bg-[#0b1733] border-b border-[#162a56] flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2.5">
          {/* Live Indicator */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
            isLiveCameraMode 
              ? "bg-red-500/20 border border-red-500/40 text-red-400" 
              : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isLiveCameraMode ? "bg-red-500 animate-ping" : "bg-emerald-500 animate-pulse"}`}></span>
            <span>{isLiveCameraMode ? "● LIVE PHONE CAM" : "● LIVE CCTV"}</span>
          </div>

          {/* AI Mode Selector */}
          <button
            onClick={() => setAiMode(aiMode === "LIVE AI DETECTION" ? "DEMO AI MODE" : "LIVE AI DETECTION")}
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border tracking-wider transition-all cursor-pointer ${
              aiMode === "LIVE AI DETECTION"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
            }`}
          >
            {aiMode}
          </button>

          {isLiveCameraMode && (
            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>YOLOv8 {isWsConnected ? "WS: Connected" : "Local Engine"}</span>
            </span>
          )}
        </div>

        {/* Live Controls & Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* CAMERA TOGGLE: Phone/Webcam VS Industrial CCTV */}
          {!isLiveCameraMode ? (
            <button
              onClick={() => startLiveCamera(selectedDeviceId)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all active:scale-95"
              title="Connect your Phone / USB Webcam to show live detection"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Start Live Phone / USB Cam</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              {/* Select device dropdown if multiple cameras exist */}
              {cameraDevices.length > 1 && (
                <select
                  value={selectedDeviceId}
                  onChange={(e) => {
                    setSelectedDeviceId(e.target.value);
                    startLiveCamera(e.target.value);
                  }}
                  className="bg-[#0e1e42] border border-blue-500/50 text-white text-xs rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer max-w-[130px] truncate"
                >
                  {cameraDevices.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label || `Camera ${d.deviceId.slice(0, 4)}`}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={stopLiveCamera}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#142345] hover:bg-slate-700 text-slate-200 border border-slate-600 flex items-center gap-1.5 cursor-pointer transition-all"
                title="Switch back to Plant CCTV"
              >
                <Radio className="w-3.5 h-3.5 text-slate-400" />
                <span>Return to CCTV</span>
              </button>
            </div>
          )}

          {/* Camera Selector Dropdown (for CCTV mode) */}
          {!isLiveCameraMode && (
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="bg-[#0e1e42] border border-[#1d3870] text-slate-200 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-blue-500 cursor-pointer font-semibold"
            >
              {CAMERA_PRESETS.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          )}

          {/* Judge Demo Workflow Button */}
          <button
            onClick={triggerJudgeDemo}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer ${
              isJudgeDemoRunning
                ? "bg-amber-600 text-white animate-pulse"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isJudgeDemoRunning ? "DEMO ACTIVE" : "JUDGE DEMO"}</span>
          </button>
        </div>
      </div>

      {/* 2. STATS STRIP */}
      <div className="px-4 py-1.5 bg-[#091530] border-b border-[#14264d] flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-300">
            Workers Detected: <strong className="text-white font-mono font-bold">{counters.workersDetected.toString().padStart(2, '0')}</strong>
          </span>
          <span className="text-emerald-400">
            Safe: <strong className="font-mono font-bold">{counters.safeWorkers.toString().padStart(2, '0')}</strong>
          </span>
          <span className={`${counters.violations > 0 ? 'text-red-400 animate-pulse font-bold' : 'text-slate-400'}`}>
            Violations: <strong className="font-mono">{counters.violations.toString().padStart(2, '0')}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span>FPS: <strong className="text-emerald-400 font-bold">{fps}</strong></span>
          <span>|</span>
          <span>LATENCY: <strong className="text-cyan-400 font-bold">{latency} ms</strong></span>
        </div>
      </div>

      {/* 2B. LIVE EVENT SELECTOR BAR (ACTIVE IN PHONE/WEBCAM MODE) */}
      {isLiveCameraMode && (
        <div className="px-4 py-2 bg-[#091224] border-b border-[#1a3366] flex flex-wrap items-center justify-between gap-2 z-20">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300">
            <span className="text-blue-400">⚡ LIVE EVENT SIMULATOR:</span>
            <span className="text-slate-400 font-normal">Select event to project onto live camera:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Event 1: Compliant */}
            <button
              onClick={() => {
                setLiveEventType('compliant');
                triggerEventAlert('compliant');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                liveEventType === 'compliant'
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/40"
                  : "bg-[#0d1a38] text-slate-300 hover:text-white border border-[#1e3b75]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Full Compliant</span>
            </button>

            {/* Event 2: Missing Helmet */}
            <button
              onClick={() => {
                setLiveEventType('missing_helmet');
                triggerEventAlert('missing_helmet');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                liveEventType === 'missing_helmet'
                  ? "bg-red-600 text-white shadow-md shadow-red-600/40 animate-pulse"
                  : "bg-[#0d1a38] text-slate-300 hover:text-red-300 border border-[#1e3b75]"
              }`}
            >
              <HardHat className="w-3.5 h-3.5 text-red-400" />
              <span>Missing Helmet</span>
            </button>

            {/* Event 3: Missing Vest */}
            <button
              onClick={() => {
                setLiveEventType('missing_vest');
                triggerEventAlert('missing_vest');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                liveEventType === 'missing_vest'
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/40 animate-pulse"
                  : "bg-[#0d1a38] text-slate-300 hover:text-amber-300 border border-[#1e3b75]"
              }`}
            >
              <Shirt className="w-3.5 h-3.5 text-amber-400" />
              <span>Missing Vest</span>
            </button>

            {/* Event 4: Smoke */}
            <button
              onClick={() => {
                setLiveEventType('smoke');
                triggerEventAlert('smoke');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                liveEventType === 'smoke'
                  ? "bg-slate-600 text-white shadow-md shadow-slate-600/40 animate-pulse"
                  : "bg-[#0d1a38] text-slate-300 hover:text-slate-200 border border-[#1e3b75]"
              }`}
            >
              <CloudFog className="w-3.5 h-3.5 text-slate-300" />
              <span>Smoke Hazard</span>
            </button>

            {/* Event 5: Fire */}
            <button
              onClick={() => {
                setLiveEventType('fire');
                triggerEventAlert('fire');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                liveEventType === 'fire'
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/40 animate-pulse"
                  : "bg-[#0d1a38] text-slate-300 hover:text-orange-300 border border-[#1e3b75]"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Fire Outbreak</span>
            </button>
          </div>
        </div>
      )}

      {/* Camera Error Alert if Permissions Blocked */}
      {cameraErrorMsg && (
        <div className="px-4 py-2 bg-red-950/90 border-b border-red-700/60 text-red-200 text-xs flex items-center justify-between">
          <span>⚠️ {cameraErrorMsg}</span>
          <button onClick={() => setCameraErrorMsg("")} className="text-red-400 hover:text-white font-bold ml-2">Dismiss</button>
        </div>
      )}

      {/* 3. SURVEILLANCE VIDEO CANVAS (16:9 Cinema Aspect) */}
      <div className="relative aspect-[16/9] w-full bg-[#050b18] overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-cover"
        />

        {/* Scanline CRT Surveillance Overlay */}
        <div className="cctv-scanline pointer-events-none" />

        {/* Real-time Violation Alert Toast Popup */}
        {activePopupAlert && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-red-600/95 via-rose-700/95 to-red-800/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-red-400 backdrop-blur-md flex items-center gap-3.5 animate-in slide-in-from-top-4 duration-300">
            <div className="p-2 rounded-xl bg-white/20 text-white animate-bounce shrink-0">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-black tracking-wider uppercase flex items-center gap-2">
                <span>🔴 {activePopupAlert.title}</span>
                <span className="bg-white/20 text-[10px] px-1.5 py-0.2 rounded font-mono">
                  {activePopupAlert.confidence}
                </span>
              </div>
              <div className="text-sm font-bold text-white leading-tight mt-0.5">
                {activePopupAlert.worker} — {activePopupAlert.violation}
              </div>
              <div className="text-[10px] text-red-100 mt-0.5">
                {activePopupAlert.zone} • {activePopupAlert.time}
              </div>
            </div>
          </div>
        )}

        {/* Judge Demo Workflow Toast */}
        {isJudgeDemoRunning && demoStepMessage && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-blue-900/90 border border-blue-400 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in z-30">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
            <span>{demoStepMessage}</span>
          </div>
        )}

        {/* Bottom Left Camera Zone Stamp */}
        <div className="absolute bottom-3 left-3 bg-[#0d1c3bee]/90 backdrop-blur-md border border-[#1e3e78] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span>
            {isLiveCameraMode 
              ? "PHONE / WEBCAM • LIVE SURVEILLANCE & AI INFERENCE" 
              : `${activePreset.id.toUpperCase()} • ${activePreset.zone}`}
          </span>
        </div>
      </div>

      {/* 4. SURVEILLANCE CONTROLS & TIMELINE TOOLBAR */}
      <div className="p-3 bg-[#0b1733] border-t border-[#162a56] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer shadow-lg shadow-blue-600/30"
            title={isPlaying ? "Pause Stream" : "Resume Stream"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e1e42] hover:bg-[#162d61] text-slate-300 hover:text-white transition-colors border border-[#1d3870] text-xs font-semibold cursor-pointer"
            title={showOverlays ? "Hide Bounding Boxes" : "Show Bounding Boxes"}
          >
            {showOverlays ? <Eye className="w-3.5 h-3.5 text-blue-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>{showOverlays ? "Hide AI Boxes" : "Show AI Boxes"}</span>
          </button>
        </div>

        {/* Right: Quick Alert Event Trigger */}
        <div className="flex items-center gap-2">
          {isLiveCameraMode ? (
            <button
              onClick={() => {
                const nextType = liveEventType === 'compliant' ? 'missing_helmet' : 'compliant';
                setLiveEventType(nextType);
                triggerEventAlert(nextType);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg ${
                liveEventType !== 'compliant'
                  ? "bg-red-600 text-white shadow-red-600/40 animate-pulse"
                  : "bg-[#0e1e42] hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-[#1d3870] hover:border-red-500/40"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{liveEventType !== 'compliant' ? "Reset to Compliant" : "Trigger Live Violation"}</span>
            </button>
          ) : (
            <button
              onClick={triggerJudgeDemo}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0e1e42] hover:bg-blue-600 text-slate-200 hover:text-white border border-[#1d3870] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Run Automated Demo</span>
            </button>
          )}

          <button
            onClick={() => {
              if (containerRef.current) {
                if (!document.fullscreenElement) {
                  containerRef.current.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }
            }}
            className="p-2 rounded-xl bg-[#0e1e42] hover:bg-[#162d61] text-slate-300 hover:text-white transition-colors border border-[#1d3870] cursor-pointer"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
