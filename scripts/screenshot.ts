import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const SECTIONS = [
  { name: '01-hero', selector: 'section:nth-of-type(1)' },
  { name: '02-opening', selector: 'section:nth-of-type(2)' },
  { name: '03-malaysia2017', selector: 'section:nth-of-type(3)' },
  { name: '04-championship', selector: 'section:nth-of-type(4)' },
  { name: '05-racebuilder', selector: 'section:nth-of-type(5)' },
  { name: '06-mercedes-upgrade', selector: 'section:nth-of-type(6)' },
  { name: '07-what-to-watch', selector: 'section:nth-of-type(7)' },
  { name: '08-attribution', selector: 'footer' },
];

// Instagram: Use mobile viewport width to trigger mobile CSS (video zoom),
// then use deviceScaleFactor to render at 1080x1920 output resolution
// 1080/1920 = 9/16, so viewport needs same ratio: 390 x 693.33 ≈ 390 x 693
const FORMATS = {
  instagram: {
    viewport: { width: 390, height: 693 },  // Mobile viewport (9:16 ratio) triggers mobile CSS
    deviceScaleFactor: 1080 / 390,          // ~2.77x scale to get 1080x1920 output
  },
  linkedin: {
    viewport: { width: 1200, height: 628 },
    deviceScaleFactor: 1,
  },
};

const BASE_URL = 'http://localhost:3000/f1-sepang-2026';
const OUTPUT_DIR = path.join(process.cwd(), 'screenshots');

async function ensureDirectories() {
  for (const format of Object.keys(FORMATS)) {
    const dir = path.join(OUTPUT_DIR, format);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

async function captureScreenshots() {
  console.log('🚀 Starting screenshot capture...\n');

  await ensureDirectories();

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required'],
  });

  for (const [formatName, format] of Object.entries(FORMATS)) {
    const outputWidth = Math.round(format.viewport.width * format.deviceScaleFactor);
    const outputHeight = Math.round(format.viewport.height * format.deviceScaleFactor);
    console.log(`📐 Capturing ${formatName} format (${outputWidth}x${outputHeight})...\n`);

    const page = await browser.newPage();
    await page.setViewport({
      width: format.viewport.width,
      height: format.viewport.height,
      deviceScaleFactor: format.deviceScaleFactor,
    });

    // Navigate and wait for content
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });

    console.log('  ⏳ Waiting 10s for YouTube videos to load...');
    await sleep(10000);

    for (const section of SECTIONS) {
      try {
        // Scroll to section
        await page.evaluate((sel) => {
          const element = document.querySelector(sel);
          if (element) {
            element.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }, section.selector);

        // Wait for section to render and video frame to appear
        await sleep(2000);

        // Take full viewport screenshot
        const outputPath = path.join(OUTPUT_DIR, formatName, `${section.name}.png`);
        await page.screenshot({
          path: outputPath,
          type: 'png',
        });

        console.log(`  ✅ ${section.name}.png`);
      } catch (error) {
        console.error(`  ❌ Failed to capture ${section.name}:`, error);
      }
    }

    await page.close();
    console.log('');
  }

  await browser.close();
  console.log(`✨ Screenshots saved to ${OUTPUT_DIR}`);
}

captureScreenshots().catch(console.error);
