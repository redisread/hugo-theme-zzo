const { defineConfig } = require('@playwright/test');
const path = require('node:path');
const directory = path.resolve(process.env.ZZO_SITE_DIR || '.build/example');
module.exports = defineConfig({
  testDir: './tests', timeout: 30000, workers: 2,
  use: { baseURL: 'http://127.0.0.1:4173', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: `python3 -m http.server 4173 --bind 127.0.0.1 --directory "${directory}"`, url: 'http://127.0.0.1:4173', reuseExistingServer: false },
  reporter: [['list']],
});
