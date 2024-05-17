const puppeteer = require("puppeteer");
const fs = require("fs");

async function waitForTimeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function readOrCreateFile(filePath) {
    try {
        return fs.readFileSync(filePath, { encoding: "utf-8" });
    } catch (error) {
        if (error.code === 'ENOENT') {
            fs.writeFileSync(filePath, JSON.stringify({}));
            console.log("File created and initial content written");
            return fs.readFileSync(filePath, { encoding: "utf-8" });
        } else {
            throw error;
        }
    }
}

async function selectDropdownOption(page, dropdownSelector, optionSelector) {
    await page.waitForSelector(dropdownSelector);
    await page.click(dropdownSelector);
    await page.waitForSelector(optionSelector);
    const option = await page.$(optionSelector);
    if (option) {
        await option.click();
        await waitForTimeout(5000);
    } else {
        throw new Error(`Option with selector ${optionSelector} not found`);
    }
}

async function extractPlayerData(page, nameSelector, scoreSelector) {
    await page.waitForSelector(nameSelector);
    const playerNames = await page.$$(nameSelector);
    const playerScores = await page.$$(scoreSelector);
    const players = [];

    for (let i = 0; i < Math.min(playerNames.length, 10); i++) {
        const playerName = await page.evaluate(el => el.textContent, playerNames[i]);
        const playerScore = await page.evaluate(el => el.textContent, playerScores[i]);
        players.push({ playerName, playerScore });
    }
    return players;
}

(async () => {
    const filePath = "iplData.json";
    let iplData = await readOrCreateFile(filePath);
    iplData = JSON.parse(iplData);

    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();
        await page.goto("https://www.iplt20.com/stats/");
        page.setDefaultNavigationTimeout(60000);
        await page.setViewport({ width: 1200, height: 1024 });

        const currentYear = new Date().getFullYear();

        for (let year = currentYear; year > currentYear - 5; year--) {
            try {
                console.log(`Selecting season year: ${year}`);
                const dropdownSelector = ".cSBDisplay:nth-child(1)";
                await page.waitForSelector(dropdownSelector);
                await page.click(dropdownSelector);
                const activeListSelector = ".cSBList.active";
                await page.waitForSelector(activeListSelector);
                const seasonOptionSelector = `${activeListSelector} .cSBListItems.seasonFilterItems.ng-binding.ng-scope[data-val='${year}']`;
                const seasonOption = await page.$(seasonOptionSelector);

                if (!seasonOption) {
                    throw new Error(`Season option not found for selector: ${seasonOptionSelector}`);
                }

                const seasonName = await page.evaluate(el => el.textContent.trim(), seasonOption);
                console.log(`Selected season: ${seasonName}`);

                await seasonOption.click();
                await waitForTimeout(5000);

                if (!iplData[seasonName]) {
                    iplData[seasonName] = {};
                }

                iplData[seasonName].topTenOrangeCapPlayers = await extractPlayerData(page, ".st-ply-name.ng-binding", ".ng-binding.np-tableruns");

                await selectDropdownOption(page, ".customSelecBox.statsTypeFilter", ".cSBList.active .cSBListItems.batters.selected.ng-binding.ng-scope:nth-child(4)");
                iplData[seasonName].topTenMostFoursPlayers = await extractPlayerData(page, ".st-ply-name.ng-binding", ".ng-binding.np-tableruns");

                await selectDropdownOption(page, ".customSelecBox.statsTypeFilter", ".cSBList.active .cSBListItems.batters.selected.ng-binding.ng-scope:nth-child(6)");
                iplData[seasonName].topTenMostSixsPlayers = await extractPlayerData(page, ".st-ply-name.ng-binding", ".ng-binding.np-tableruns");

                await selectDropdownOption(page, ".customSelecBox.statsTypeFilter", ".cSBList.active .cSBListItems.batters.selected.ng-binding.ng-scope:nth-child(7)");
                iplData[seasonName].topTenMostFiftiesPlayers = await extractPlayerData(page, ".st-ply-name.ng-binding", ".ng-binding.np-tableruns");

                await selectDropdownOption(page, ".customSelecBox.statsTypeFilter", ".cSBList.active .cSBListItems.batters.selected.ng-binding.ng-scope:nth-child(8)");
                iplData[seasonName].topTenMostCenturiesPlayers = await extractPlayerData(page, ".st-ply-name.ng-binding", ".ng-binding.np-tableruns");

            } catch (seasonError) {
                console.error(`Error processing season year ${year}:`, seasonError);
            }
        }

        fs.writeFileSync(filePath, JSON.stringify(iplData, null, 2));

    } catch (error) {
        console.error("An error occurred during the scraping process:", error);
    } finally {
        await browser.close();
    }
})();
