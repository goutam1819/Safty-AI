import cv2
import numpy as np
import base64
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

print("=== INDUSTRIAL SAFETY AI - ENDPOINT TEST SUITE ===")

# 1. Existing Health Check
print("\n[1/5] Testing GET /api/health...")
r_health = client.get("/api/health")
print("Status:", r_health.status_code)
print("Payload:", r_health.json())
assert r_health.status_code == 200
assert r_health.json().get("status") == "online"
print("-> PASS: Health check is online and operational.")

# 2. Existing KPIs Endpoint
print("\n[2/5] Testing GET /api/kpis...")
r_kpis = client.get("/api/kpis")
print("Status:", r_kpis.status_code)
print("Total workers:", r_kpis.json().get("total_workers"), "| Compliance:", r_kpis.json().get("safety_compliance"))
assert r_kpis.status_code == 200
print("-> PASS: KPIs endpoint preserved.")

# 3. Existing Cameras Endpoint
print("\n[3/5] Testing GET /api/cameras...")
r_cameras = client.get("/api/cameras")
print("Status:", r_cameras.status_code, "| Cameras found:", len(r_cameras.json()))
assert r_cameras.status_code == 200
print("-> PASS: Cameras endpoint preserved.")

# 4. Existing Upload Endpoint
print("\n[4/5] Testing POST /api/upload...")
# Create a valid test frame
test_img = np.zeros((300, 400, 3), dtype=np.uint8)
# Draw a simple shape so it's a valid JPEG image
cv2.rectangle(test_img, (50, 50), (250, 250), (100, 200, 100), -1)
_, img_bytes = cv2.imencode(".jpg", test_img)
files = {"file": ("test_audit.jpg", img_bytes.tobytes(), "image/jpeg")}
r_upload = client.post("/api/upload", files=files)
print("Status:", r_upload.status_code)
data_upload = r_upload.json()
print("Success:", data_upload.get("success"))
print("Summary:", data_upload.get("inference", {}).get("summary"))
assert r_upload.status_code == 200
assert data_upload.get("success") is True
print("-> PASS: File upload and YOLO detection pipeline preserved.")

# 5. New WebSocket Live Stream Endpoint
print("\n[5/5] Testing WebSocket /ws/live-stream...")
with client.websocket_connect("/ws/live-stream") as ws:
    print("WebSocket successfully connected to /ws/live-stream.")

    # 5A: Test invalid / empty frame handling
    print("  -> Subtest 5A: Sending empty binary payload...")
    ws.send_bytes(b"")
    resp_empty = ws.receive_json()
    print("     Response:", resp_empty)
    assert resp_empty.get("success") is False
    assert "Empty or unreadable" in resp_empty.get("error", "")
    print("     PASS: Empty frame safely handled without server crash.")

    # 5B: Test sending real frame binary bytes
    print("  -> Subtest 5B: Sending valid frame binary bytes...")
    ws.send_bytes(img_bytes.tobytes())
    resp_bytes = ws.receive_json()
    print("     Response success:", resp_bytes.get("success"))
    print("     Model:", resp_bytes.get("model"))
    print("     Latency:", resp_bytes.get("latency_ms"), "ms")
    print("     Safe workers:", resp_bytes.get("safe_workers"))
    print("     Violations:", resp_bytes.get("violations_found"))
    print("     Detections count:", len(resp_bytes.get("detections", [])))
    assert resp_bytes.get("success") is True
    print("     PASS: Real frame processed through YOLO detector.")

    # 5C: Test sending base64 data URL string (as sent by HTML5 Canvas)
    print("  -> Subtest 5C: Sending base64 data URL string...")
    b64_str = "data:image/jpeg;base64," + base64.b64encode(img_bytes).decode("utf-8")
    ws.send_text(b64_str)
    resp_b64 = ws.receive_json()
    print("     Response success:", resp_b64.get("success"))
    print("     Detections count:", len(resp_b64.get("detections", [])))
    assert resp_b64.get("success") is True
    print("     PASS: Base64 data URL string processed cleanly.")

print("  -> Subtest 5D: Clean client disconnection verified.")

print("\n=== ALL TESTS PASSED (5/5) ===")
