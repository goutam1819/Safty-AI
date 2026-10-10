/**
 * Mock and Initial Data for Industrial Safety AI
 * BPUT Hackathon 2026
 * Tagline: Smarter Vision. Safer Workplaces.
 */

export const INITIAL_KPIS = {
  totalWorkers: 125,
  totalWorkersDelta: "+2 today",
  safeWorkers: 102,
  safePercentage: 82,
  unsafeWorkers: 23,
  unsafePercentage: 18,
  safetyCompliance: 82,
  complianceTrend: "+6%"
};

export const INITIAL_CAMERAS = [
  {
    id: "cam-01",
    code: "Camera 01",
    name: "Production Floor",
    zone: "Zone A - Assembly & Production",
    status: "Online",
    fps: 30,
    resolution: "1080p FHD",
    alertsCount: 1,
    aiAccuracy: "98%",
    workersDetected: 24,
    safetyCompliance: 91,
    imageUrl: "/assets/cctv_factory.jpg",
    detections: [
      { id: "d1", label: "Helmet 98%", sub: "Vest 96%", status: "compliant", x: 44.5, y: 61.2, w: 7.5, h: 26 },
      { id: "d2", label: "No Helmet 0%", sub: "VIOLATION", status: "violation", x: 68.6, y: 68.4, w: 8.5, h: 28 },
    ]
  },
  {
    id: "cam-02",
    code: "Camera 02",
    name: "Warehouse",
    zone: "Zone B - Logistics & High Racks",
    status: "Online",
    fps: 28,
    resolution: "1080p FHD",
    alertsCount: 0,
    aiAccuracy: "96%",
    workersDetected: 14,
    safetyCompliance: 96,
    imageUrl: "/assets/cctv_warehouse.jpg",
    detections: [
      { id: "d21", label: "Helmet 96%", sub: "Vest 95%", status: "compliant", x: 16, y: 64, w: 8, h: 30 },
      { id: "d22", label: "Helmet 95%", sub: "Vest 92%", status: "compliant", x: 72, y: 58, w: 7, h: 26 },
    ]
  },
  {
    id: "cam-03",
    code: "Camera 03",
    name: "Loading Bay",
    zone: "Zone C - Freight & Loading Bay",
    status: "Online",
    fps: 30,
    resolution: "1080p FHD",
    alertsCount: 0,
    aiAccuracy: "93%",
    workersDetected: 18,
    safetyCompliance: 94,
    imageUrl: "/assets/cctv_loading.jpg",
    detections: [
      { id: "d31", label: "Helmet 94%", sub: "Vest 92%", status: "compliant", x: 23, y: 58, w: 6, h: 22 },
      { id: "d32", label: "Helmet 95%", sub: "Vest 93%", status: "compliant", x: 43, y: 44, w: 5, h: 18 },
      { id: "d33", label: "Helmet 93%", sub: "Vest 90%", status: "compliant", x: 85, y: 56, w: 5, h: 20 },
    ]
  },
  {
    id: "cam-04",
    code: "Camera 04",
    name: "Assembly Line",
    zone: "Zone D - Precision Robotics Line",
    status: "Online",
    fps: 29,
    resolution: "1080p FHD",
    alertsCount: 1,
    aiAccuracy: "96%",
    workersDetected: 28,
    safetyCompliance: 88,
    imageUrl: "/assets/cctv_assembly.jpg",
    detections: [
      { id: "d41", label: "Helmet 97%", sub: "Vest 95%", status: "compliant", x: 21, y: 45, w: 14, h: 48 },
      { id: "d42", label: "Helmet 98%", sub: "Vest 94%", status: "compliant", x: 34, y: 40, w: 14, h: 45 },
      { id: "d43", label: "Helmet 96%", sub: "Vest 95%", status: "compliant", x: 64, y: 46, w: 15, h: 48 },
    ]
  }
];

export const RECENT_DETECTIONS = [
  {
    id: "rd-1",
    title: "Helmet Missing",
    worker: "Worker 12",
    zone: "Zone A — Assembly Line",
    time: "10:22 AM",
    type: "violation",
    severity: "High",
    image: "/assets/worker_12.webp",
  },
  {
    id: "rd-2",
    title: "Smoke Detected",
    worker: "Environmental Hazard",
    zone: "Zone B — Paint Booth",
    time: "10:18 AM",
    type: "hazard",
    severity: "Critical",
    image: "/assets/smoke_hazard.jpg",
  },
  {
    id: "rd-3",
    title: "PPE Violation",
    worker: "Worker 34",
    zone: "Zone C — Packaging",
    time: "10:15 AM",
    type: "violation",
    severity: "Medium",
    image: "/assets/worker_34.webp",
  },
  {
    id: "rd-4",
    title: "Compliant",
    worker: "Worker 56",
    zone: "Zone D — Warehouse",
    time: "10:12 AM",
    type: "safe",
    severity: "None",
    image: "/assets/worker_56.webp",
  }
];

export const AI_ALERTS = [
  {
    id: "alt-1",
    title: "Fire/Smoke Detected",
    zone: "Zone B — Paint Booth",
    time: "10:18 AM",
    severity: "Critical",
    icon: "Flame"
  },
  {
    id: "alt-2",
    title: "Helmet Missing",
    zone: "Worker 12 — Zone A",
    time: "10:22 AM",
    severity: "High",
    icon: "AlertTriangle"
  },
  {
    id: "alt-3",
    title: "Safety Vest Violation",
    zone: "Worker 34 — Zone C",
    time: "10:15 AM",
    severity: "Medium",
    icon: "ShieldAlert"
  }
];

export const COMPLIANCE_TREND_DATA = [
  { day: "Mon", compliance: 78 },
  { day: "Tue", compliance: 80 },
  { day: "Wed", compliance: 81 },
  { day: "Thu", compliance: 82 },
  { day: "Fri", compliance: 79 },
  { day: "Sat", compliance: 84 },
  { day: "Sun", compliance: 82 },
];

export const VIOLATION_STATS_DATA = [
  { name: "Helmet", value: 8, percentage: "35%", color: "#ef4444" },
  { name: "Vest", value: 6, percentage: "26%", color: "#f59e0b" },
  { name: "Gloves", value: 4, percentage: "17%", color: "#3b82f6" },
  { name: "Footwear", value: 3, percentage: "13%", color: "#a855f7" },
  { name: "Others", value: 2, percentage: "9%", color: "#06b6d4" },
];

export const INITIAL_VIOLATIONS = [
  {
    id: "V-001",
    worker: "Worker 24",
    workerName: "Rajesh Kumar",
    violation: "Helmet Missing",
    zone: "Zone A",
    severity: "High",
    time: "10:24 AM",
    status: "Open",
    image: "/assets/worker_24.webp"
  },
  {
    id: "V-002",
    worker: "Worker 18",
    workerName: "Subhashree Nayak",
    violation: "Safety Vest Missing",
    zone: "Zone B",
    severity: "Medium",
    time: "09:52 AM",
    status: "Open",
    image: "/assets/worker_18.webp"
  },
  {
    id: "V-003",
    worker: "Worker 07",
    workerName: "Amit Pradhan",
    violation: "No Safety Shoes",
    zone: "Zone C",
    severity: "Medium",
    time: "09:30 AM",
    status: "Resolved",
    image: "/assets/worker_07.webp"
  },
  {
    id: "V-004",
    worker: "Worker 12",
    workerName: "Deepak Jena",
    violation: "No Goggles",
    zone: "Zone A",
    severity: "Low",
    time: "08:45 AM",
    status: "Resolved",
    image: "/assets/worker_12.webp"
  },
  {
    id: "V-005",
    worker: "Worker 30",
    workerName: "Priyanka Mishra",
    violation: "Smoke Detected",
    zone: "Zone D",
    severity: "Critical",
    time: "07:12 AM",
    status: "Open",
    image: "/assets/smoke_hazard.jpg"
  },
  {
    id: "V-006",
    worker: "Worker 15",
    workerName: "Sanjay Mohanty",
    violation: "Gloves Missing",
    zone: "Zone B",
    severity: "Medium",
    time: "Yesterday 04:30 PM",
    status: "Resolved",
    image: "/assets/worker_15.webp"
  },
  {
    id: "V-007",
    worker: "Worker 09",
    workerName: "Rahul Das",
    violation: "Helmet Missing",
    zone: "Zone C",
    severity: "High",
    time: "Yesterday 02:15 PM",
    status: "Resolved",
    image: "/assets/worker_09.webp"
  }
];

export const INITIAL_UPLOADS = [
  {
    id: "up-1",
    type: "image",
    name: "Factory_01.jpg",
    size: "2.4 MB",
    uploadedOn: "Apr 10, 2025 09:45 AM",
    status: "Processed",
    summary: "3 Compliant, 1 Violation (No Helmet)"
  },
  {
    id: "up-2",
    type: "video",
    name: "Production_Video.mp4",
    size: "48.7 MB",
    uploadedOn: "Apr 09, 2025 07:22 PM",
    status: "Processing",
    summary: "Analyzing frame 420/1200 @ 29.4 FPS"
  },
  {
    id: "up-3",
    type: "image",
    name: "Warehouse.jpg",
    size: "1.8 MB",
    uploadedOn: "Apr 09, 2025 04:18 PM",
    status: "Processed",
    summary: "5 Compliant, 0 Violations"
  },
  {
    id: "up-4",
    type: "image",
    name: "Site_Area.png",
    size: "3.1 MB",
    uploadedOn: "Apr 08, 2025 11:20 AM",
    status: "Processed",
    summary: "2 Compliant, 1 Violation (No Vest)"
  }
];

export const RECENT_ACTIVITIES = [
  { time: "10:22", text: "Violation detected - Helmet Missing", sub: "Worker 12 — Zone A", type: "violation" },
  { time: "10:18", text: "Fire/Smoke detected", sub: "Zone B — Paint Booth", type: "hazard" },
  { time: "10:15", text: "PPE violation detected", sub: "Worker 34 — Zone C", type: "violation" },
  { time: "10:12", text: "Report generated", sub: "Daily safety report — Apr 10, 2025", type: "report" }
];
