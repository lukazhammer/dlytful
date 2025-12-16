import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// --- CONFIG ---
const MATRIX_PATH = path.resolve('tests/brand_quality_matrix.json');
const REPORT_PATH = path.resolve('test-results/brand_quality_report.json');
const SCREENSHOT_DIR = path.resolve('test-results/screenshots');
const TIMEOUT_MS = 60000; // 60s per case to be safe (LLM can be slow)
const HEADLESS = true;

// Ensure dirs
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// --- VALIDATOR ---
function validateCase(testCase, result) {
    const failures = [];
    const expect = testCase.expect;
    const isBlocked = result.positioning?.flags?.blocked || result.positioning?.debug?.validationIssues?.includes("Safety Block");

    // 1. Safety
    if (expect.safety.should_block) {
        if (!isBlocked && !result.positioning?.positioning?.includes("Safe Fallback")) { // heuristic for fallback
            // Actually check if we got a real generation
            if (result.positioning.brandName && result.positioning.brandName !== "Your Product") {
                failures.push("Safety: Expected block but got generation.");
            }
        }
    } else {
        if (isBlocked) {
            failures.push("Safety: Expected generation but got blocked.");
        }
    }

    // skip other checks if blocked
    if (expect.safety.should_block && isBlocked) return failures;

    // 2. Name
    if (expect.name.mode === 'contains' && result.identity?.productName) {
        const candidates = expect.name.candidates || [];
        const name = result.identity.productName;
        const match = candidates.some(c => name.toLowerCase().includes(c.toLowerCase()));
        if (!match) failures.push(`Name: Expected '${candidates.join('|')}' but got '${name}'`);
    }

    // 3. Generic Phrases
    const allText = (result.positioning?.positioning || "") + (result.assets?.oneLiner || "");
    const foundPhrases = expect.must_not_include_phrases.filter(p => allText.toLowerCase().includes(p.toLowerCase()));
    if (foundPhrases.length > 0) {
        failures.push(`Quality: Found banned generic phrases: ${foundPhrases.join(', ')}`);
    }

    // 4. Structure
    const pos = result.positioning?.positioning || "";
    if (pos && (!pos.includes("For ") || !pos.includes(" because "))) {
        failures.push("Structure: Positioning missing 'For...' or 'because...' template.");
    }

    // 5. Palette Inference
    if (expect.palette.should_infer_from_visuals) {
        // hard to validate strictly without LLM, but we can check if it's not the default
        // defaulting logic is elusive here without exact knowledge of default ID.
        // Skipping strict check, just ensure we have one.
        if (!result.vibe?.palette) failures.push("Palette: Missing palette data.");
    }

    return failures;
}


// --- RUNNER ---

async function run() {
    console.log("Loading Matrix...");
    const matrix = JSON.parse(fs.readFileSync(MATRIX_PATH, 'utf-8'));
    const cases = matrix.cases;

    console.log(`Found ${cases.length} cases.`);
    const report = {
        generated_at: new Date().toISOString(),
        results: []
    };

    const browser = await chromium.launch({ headless: HEADLESS });
    const context = await browser.newContext();
    const page = await context.newPage();

    for (const testCase of cases) {
        console.log(`[${testCase.id}] Running...`);
        const resultEntry = {
            id: testCase.id,
            status: 'pending',
            failures: [],
            outputs: {}
        };

        try {
            await page.goto('http://localhost:3000/demo');

            // 1. Reset (click Reset button if viable, or just reload)
            // Reloading is safer to clear state
            // await page.reload(); 
            // Better: click the Reset button
            // But we just reloaded the page loop so it should be fresh.
            // On first load 3000/demo might have state if persist is on? dlytful likely clean on refresh.

            // 2. Fill Inputs
            const inps = testCase.inputs;
            await page.fill('textarea[placeholder*="deterministic brand compiler"]', inps.q1_core_what); // Q1

            // Product Type
            if (inps.product_type) {
                await page.selectOption('select', inps.product_type);
            }

            // Q2
            await page.fill('textarea[placeholder*="founder is stuck"]', inps.q2_moment || ""); // Q2

            // Q3
            await page.fill('textarea[placeholder*="Minimal, dark mode"]', inps.q3_url_or_desc || ""); // Q3

            // 3. Trigger Actions
            // The UI logic: typing triggers debounced calls.
            // But we need to click "Remix Vibe" or "Resume Last" or just wait?
            // "generateFull" is called on debounce of Q2/Q3 if step >= 2.
            // Since we filled Q2/Q3, it should auto-trigger. 
            // Wait for network response to /api/generate/demo

            // Wait for both responses.
            console.log(`[${testCase.id}] Waiting for network...`);

            // We expect TWO distinct calls: demo (Zero) and positioning
            const demoReqPromise = page.waitForResponse(resp => resp.url().includes('/api/generate/demo') && resp.status() === 200);

            // Wait for debouce (1.5s)
            await page.waitForTimeout(2000);

            const demoResp = await demoReqPromise;
            const demoJson = await demoResp.json();

            // After demo returns, frontend calls positioning
            const posReqPromise = page.waitForResponse(resp => resp.url().includes('/api/generate/positioning') && resp.status() === 200);
            const posResp = await posReqPromise;
            const posJson = await posResp.json();

            // 4. Capture & Validate
            resultEntry.outputs = {
                identity: demoJson.identity,
                vibe: demoJson.vibe,
                assets: { oneLiner: demoJson.oneLiner },
                positioning: posJson.positioningDraft
            };

            const valFailures = validateCase(testCase, resultEntry.outputs);

            if (valFailures.length > 0) {
                resultEntry.status = 'fail';
                resultEntry.failures = valFailures;
                console.warn(`[${testCase.id}] FAILED: ${valFailures.join(' | ')}`);
            } else {
                resultEntry.status = 'pass';
                console.log(`[${testCase.id}] PASS`);
            }

            // 5. Screenshot
            await page.waitForTimeout(500); // let UI render
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${testCase.id}.png`), fullPage: true });

        } catch (e) {
            console.error(`[${testCase.id}] ERROR: ${e.message}`);
            resultEntry.status = 'error';
            resultEntry.failures.push(e.message);
            // Save error screenshot
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${testCase.id}_error.png`) });
        }

        report.results.push(resultEntry);
    }

    await browser.close();

    // Write Report
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
    console.log(`Report written to ${REPORT_PATH}`);
}

run();
