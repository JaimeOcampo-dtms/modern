import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer';

if (!process.env.CHROME_BIN) {
  process.env.CHROME_BIN = await puppeteer.executablePath();
}

if (!existsSync(process.env.CHROME_BIN)) {
  console.error('No Chrome binary found for tests. Run: npx puppeteer browsers install chrome');
  process.exit(1);
}

const ngCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const ngArgs = ['ng', 'test', '--browsers=ChromeHeadless', ...process.argv.slice(2)];

const child = spawn(ngCommand, ngArgs, {
  stdio: 'inherit',
  env: process.env,
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
