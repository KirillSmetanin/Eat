const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function run(command, args, cwd, name) {
  const proc = spawn(command, args, { cwd, shell: true, stdio: 'inherit' });
  proc.on('close', code => {
    console.log(`[${name}] завершён с кодом ${code}`);
  });
}

// Пути к папкам
const root = __dirname;
const backend = path.join(root, 'backend');
const frontend = path.join(root, 'frontend');

// Проверка и установка зависимостей backend
const backendNodeModules = path.join(backend, 'node_modules');
if (!fs.existsSync(backendNodeModules)) {
  console.log('[backend] Устанавливаю зависимости...');
  run('npm', ['install'], backend, 'backend-install');
}

// Проверка и установка зависимостей frontend
const frontendNodeModules = path.join(frontend, 'node_modules');
if (!fs.existsSync(frontendNodeModules)) {
  console.log('[frontend] Устанавливаю зависимости...');
  run('npm', ['install'], frontend, 'frontend-install');
}

// Запуск backend
run('npm', ['start'], backend, 'backend');

// Запуск frontend
run('npm', ['run', 'dev'], frontend, 'frontend');