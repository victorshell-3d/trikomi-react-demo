@echo off
setlocal
cd /d %~dp0
title Trikomi Studio
echo ============================================
echo   Trikomi Studio - setup and start
echo ============================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed on this PC.
  echo Install the LTS version from https://nodejs.org then double-click this file again.
  goto :end
)
where pnpm >nul 2>nul
if errorlevel 1 (
  echo pnpm not found, enabling it with corepack...
  call corepack enable >nul 2>nul
  call corepack prepare pnpm@latest --activate >nul 2>nul
)
where pnpm >nul 2>nul
if errorlevel 1 (
  echo corepack did not work, installing pnpm with npm...
  call npm i -g pnpm
)
where pnpm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Could not set up pnpm. Run this in a terminal: npm i -g pnpm
  goto :end
)
echo [1/3] Installing packages, first run can take a few minutes...
call pnpm install
if errorlevel 1 (
  echo [ERROR] Package install failed. Check the internet connection and try again.
  goto :end
)
echo.
echo [2/3] Building the studio, first run can take a minute...
call pnpm --filter @trikomi/app-jewelry-configurator build
if errorlevel 1 (
  echo [ERROR] Build failed. Check the messages above and try again.
  goto :end
)
echo.
echo [3/3] Starting the studio...
echo When you see "Local:", open that address in your browser, for example http://localhost:4173
echo Keep this window open while using the studio.
echo.
call pnpm --filter @trikomi/app-jewelry-configurator preview --port 4173 --host

:end
echo.
pause
