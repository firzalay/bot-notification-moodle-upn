const puppeteer = require("puppeteer");

async function getAssignments(username, password) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://ilmu2.upnjatim.ac.id/login/index.php");

    await page.type("#username", username);
    await page.type("#password", password);
    await Promise.all([page.click("#loginbtn"), page.waitForNavigation({ waitUntil: "networkidle0" })]);

    await page.goto("https://ilmu2.upnjatim.ac.id/my/", { waitUntil: "networkidle0" });

    const assignments = await page.evaluate(() => {
        const results = [];

        const dateBlocks = document.querySelectorAll('[data-region="event-list-content"]');

        dateBlocks.forEach((block) => {
            const dateEl = block.querySelector("h5");
            const dateText = dateEl ? dateEl.innerText.trim() : "";

            const assignmentEls = block.querySelectorAll(".event-name.mb-0 > a");
            assignmentEls.forEach((el) => {
                const title = el.getAttribute("title") || el.innerText.trim();
                results.push({ title, deadline: dateText });
            });
        });

        return results;
    });

    await browser.close();
    return assignments;
}

module.exports = { getAssignments };
