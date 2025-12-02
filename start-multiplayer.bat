@echo off
echo ========================================
echo   Monster Chain 游戏 - 多人模式启动脚本
echo ========================================
echo.

echo [1/2] 启动后端服务器...
start "Monster Backend" cmd /k "cd monster-backend && npm start"
timeout /t 3 /nobreak >nul

echo [2/2] 启动前端应用...
start "Monster Frontend" cmd /k "cd monsterchain && npm start"

echo.
echo ========================================
echo   服务启动完成！
echo ========================================
echo.
echo 后端服务器: http://localhost:3001
echo 前端应用: http://localhost:5173
echo WebSocket: ws://localhost:3001
echo.
echo 按任意键关闭此窗口...
pause >nul
