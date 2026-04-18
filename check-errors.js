import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        console.log(`[PAGE LOG] ${msg.type()}: ${msg.text()}`);
        if (msg.type() === 'error') {
            console.error(msg.location());
        }
    });

    page.on('pageerror', error => {
        console.log(`[PAGE ERROR] ${error.message}`);
    });

    console.log("Navigating to localhost...");

    try {
        await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0', timeout: 10000 });
    } catch (e) {
        console.log("Navigation timeout or error", e);
    }

    await browser.close();
})();
