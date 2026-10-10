@echo off
echo ==============================================================
echo       INDUSTRIAL SAFETY AI - BPUT HACKATHON 2026
echo       Smarter Vision. Safer Workplaces.
echo ==============================================================
echo.
echo [1/3] Starting FastAPI YOLOv8 AI Backend on http://localhost:8000 ...
start "Industrial Safety AI - YOLOv8 Backend" cmd /k "cd backend && .venv\Scripts\python -m uvicorn main:app --reload --port 8000"
echo.
echo [2/3] Starting Industrial Safety Frontend on http://localhost:5173 ...
start "Industrial Safety AI - Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo [3/3] Launching Industrial Safety AI Command Center in browser...
timeout /t 3 >nul
start http://localhost:5173
echo.
echo System online! Press any key to close this launcher.
pause
