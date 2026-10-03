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

const FORMATS = {
  instagram: { width: 1080, height: 1920 },
  linkedin: { width: 1200, height: 628 },
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
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const [formatName, dimensions] of Object.entries(FORMATS)) {
    console.log(`📐 Capturing ${formatName} format (${dimensions.width}x${dimensions.height})...\n`);

    const page = await browser.newPage();
    await page.setViewport(dimensions);

    // Navigate and wait for content
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for animations to settle (5 seconds for video/animations to load)
    await sleep(5000);

    // Hide YouTube iframes to avoid blank frames
    await page.evaluate(() => {
      document.querySelectorAll('iframe').forEach(iframe => {
        const parent = iframe.parentElement;
        if (parent) {
          parent.style.background = '#000';
        }
        iframe.style.opacity = '0';
      });
    });

    for (const section of SECTIONS) {
      try {
        // Scroll to section
        await page.evaluate((sel) => {
          const element = document.querySelector(sel);
          if (element) {
            element.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }, section.selector);

        // Wait for scroll to complete
        await sleep(500);

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
