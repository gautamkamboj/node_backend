const puppeteer = require("puppeteer");
const fs = require("fs");

function waitForTimeout(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },5000)
    })
}

(async ()=>{

    let iplData = null;

    try{
        // Read data from file 
        iplData = fs.readFileSync("iplData.json",{encoding:"utf-8"});
    }catch(error){
        if(error.code === 'ENOENT') {
            fs.writeFileSync("iplData.json",JSON.stringify({}));
            console.log("File created and initial content written");
            iplData = fs.readFileSync("iplData.json",{encoding:"utf-8"});
        } else {
            console.error(error)
        }
    }

    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: true });

    try{

        iplData = JSON.parse(iplData);
        const page = await browser.newPage();
    
        // Navigate the page to a URL
        await page.goto("https://www.iplt20.com/stats/");

        // set timeout to custom value
        page.setDefaultNavigationTimeout(60000)
    
        // Set screen size
        await page.setViewport({width:1200,height:1024});
    
    
        // GET PLAYERS FOR ORANGE CAP
    
        // Wait for the dropdowns load fully
        await page.waitForSelector(".cSBDisplay");
    
        // Click on the first drop down
        await page.click(".cSBDisplay:nth-child(1)");
    
        // wait for the drop down to activate 
        await page.waitForSelector(".cSBList.active")
    
        // select and store the contents of the drop down that has been loaded
        const seasonSelectorParent = await page.$(".cSBList.active");

        const iplSeasonNumber = 1;
    
        // select and store the nth element with the given selectores
        const selectedSeason = await seasonSelectorParent.$(`.cSBListItems.seasonFilterItems.ng-binding.ng-scope:nth-child(${iplSeasonNumber})`);

        const seasonName = await selectedSeason.evaluate((el)=>el.textContent,selectedSeason);

        console.log(seasonName)
    
        // click on the element that was stored in the variable
        await selectedSeason.click();
    
        await page.waitForSelector(".st-ply-name.ng-binding");
    
        // get all div with names of the players
        const orangeCapPlayer =await page.$$(".st-ply-name.ng-binding");
    
        // get all divs with the runs of the players
        const orangeCapPlayerRuns = await page.$$(".ng-binding.np-tableruns");

        const topTenOrangeCapPlayers = []
    
        // get the name and runs of the top 10 players for orange cap
        for(let i = 0; i< (orangeCapPlayer.length < 10 ? orangeCapPlayer.length : 10); i++){
            const playerName = await page.evaluate((elem)=> elem.textContent,orangeCapPlayer[i]);
            const playerScore = await page.evaluate((elem) => elem.textContent, orangeCapPlayerRuns[i])
            const playerData = {
                playerName,
                playerScore
            }
            topTenOrangeCapPlayers.push(playerData);
        }
    
    
        // GET THE PLAYERS WITH MOST NUMBER OF FOURS
    
        // Wait for the dropdowns load fully
        await page.waitForSelector(".customSelecBox.statsTypeFilter");
    
        // Click on the second drop down
        await page.click(".customSelecBox.statsTypeFilter");
    
        // select and store the contents of the drop down that has been loaded
        let statesFilterSelector = await page.$(".cSBList.active");
    
        const mostFoursFilterOption = await statesFilterSelector.$(".cSBListItems.batters.selected.ng-binding.ng-scope:nth-child(4)");
    
        mostFoursFilterOption.click();

        await waitForTimeout();

        await page.waitForSelector(".st-ply-name.ng-binding");
        await page.waitForSelector(".ng-binding.np-tableruns");
    
        const numberOfFours = await page.$$(".ng-binding.np-tableruns");
        const mostFoursPlayer =await page.$$(".st-ply-name.ng-binding");

        const topTenMostFoursPlayers = []

        for(let i = 0; i< (mostFoursPlayer.length < 10 ? mostFoursPlayer.length : 10); i++){
            const playerName = await page.evaluate((elem)=> elem.textContent,mostFoursPlayer[i]);
            const playerScore = await page.evaluate((elem) => elem.textContent, numberOfFours[i])
            const playerData = {
                playerName,
                playerScore
            }
            topTenMostFoursPlayers.push(playerData)
        }

        // GET THE PLAYERS WITH MOST NUMBER OF SIXES

        // Click on the second drop down
        await page.click(".customSelecBox.statsTypeFilter");
    
        // select and store the contents of the drop down that has been loaded
        statesFilterSelector = await page.$(".cSBList.active");

        const mostSixsFilterOption = await statesFilterSelector.$(".cSBListItems.batters.selected.ng-binding.ng-scope:nth-child(6)");
        mostSixsFilterOption.click();

        await waitForTimeout();

        const numberOfSixes = await page.$$(".ng-binding.np-tableruns");
        const mostSixsPlayers = await page.$$(".st-ply-name.ng-binding");

        const topTenMostSixsPlayers = []

        for(let i = 0; i< (mostSixsPlayers.length < 10 ? mostSixsPlayers.length : 10); i++){
            const playerName = await page.evaluate((elem)=> elem.textContent,mostSixsPlayers[i]);
            const playerScore = await page.evaluate((elem) => elem.textContent, numberOfSixes[i])
            const playerData = {
                playerName,
                playerScore
            }
            topTenMostSixsPlayers.push(playerData)
        }

        // GET PLAYERS WITH MOST NUMBER OF FIFTIES 

        // Click on the second drop down
        await page.click(".customSelecBox.statsTypeFilter");
    
        // select and store the contents of the drop down that has been loaded
        statesFilterSelector = await page.$(".cSBList.active");

        const mostFifitesFilterOption = await statesFilterSelector.$(".cSBListItems.batters.selected.ng-binding.ng-scope:nth-child(7)");

        mostFifitesFilterOption.click();

        await waitForTimeout();

        const numberOfFifties = await page.$$(".ng-binding.np-tableruns");
        const mostFiftiesPlayers = await page.$$(".st-ply-name.ng-binding");

        const topTenMostFiftiesPlayers = []

        for(let i = 0; i< (mostFiftiesPlayers.length < 10 ? mostFiftiesPlayers.length : 10); i++){
            const playerName = await page.evaluate((elem)=> elem.textContent,mostFiftiesPlayers[i]);
            const playerScore = await page.evaluate((elem) => elem.textContent, numberOfFifties[i])
            const playerData = {
                playerName,
                playerScore
            }
            topTenMostFiftiesPlayers.push(playerData);
        }
        
        //  GET PLAYERS WITH MOST NUMBER OF CENTURIES

        // Click on the second drop down
        await page.click(".customSelecBox.statsTypeFilter");
    
        // select and store the contents of the drop down that has been loaded
        statesFilterSelector = await page.$(".cSBList.active");

        const mostCenturiesFilterOption = await statesFilterSelector.$(".cSBListItems.batters.selected.ng-binding.ng-scope:nth-child(8)");

        mostCenturiesFilterOption.click();

        await waitForTimeout();

        const numberOfCentuires = await page.$$(".ng-binding.np-tableruns");
        const mostCentuiresPlayers = await page.$$(".st-ply-name.ng-binding");

        const topTenMostCenturiesPlayers = [];

        for(let i = 0; i< (mostCentuiresPlayers.length < 10 ? mostCentuiresPlayers.length : 10); i++){
            const playerName = await page.evaluate((elem)=> elem.textContent,mostCentuiresPlayers[i]);
            const playerScore = await page.evaluate((elem) => elem.textContent, numberOfCentuires[i])
            const playerData = {
                playerName,
                playerScore
            }
            topTenMostCenturiesPlayers.push(playerData)
        }

        if(!iplData[seasonName]){
            iplData[seasonName] = {}
        }

        iplData[seasonName].topTenOrangeCapPlayers = topTenOrangeCapPlayers;
        iplData[seasonName].topTenMostFoursPlayers = topTenMostFoursPlayers;
        iplData[seasonName].topTenMostSixsPlayers = topTenMostSixsPlayers;
        iplData[seasonName].topTenMostFiftiesPlayers = topTenMostFiftiesPlayers;
        iplData[seasonName].topTenMostCenturiesPlayers = topTenMostCenturiesPlayers;
        fs.writeFileSync("iplData.json",JSON.stringify(iplData))

    }catch(error){
        console.log(error)
    }
    await browser.close()

})()// const puppeteer = require('puppeteer');

// async function scrapeIPLData() {
//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();
//     await page.goto('https://www.iplt20.com/stats/');
//     console.log("asd");

//     // Function to extract data from table rows
// //     function extractDataFromRows(rows) {
// //         const data = [];
// //         rows.forEach(row => {
// //             const cells = row.querySelectorAll('td');
// //             const player = cells[0].textContent.trim();
// //             const value = parseInt(cells[1].textContent.trim());
// //             data.push({ player, value });
// //         });
// //         return data.slice(0, 10); // Get top 10 players
// //     }

// //     // Function to scrape data for a specific category
// //     async function scrapeCategory(category) {
// //         // await page.click(`.cSBDisplay ng-binding`);
// //         // await page.waitForSelector('.js-stats-table');

// //         const rows = await page.$$eval('.st-team-wrp', extractDataFromRows);
// //         return rows;
// //     }

// //     // Scrape data for each category
// //     const orangeCap = await scrapeCategory('orange-cap');
// //     // const most4s = await scrapeCategory('most-fours');
// //     // const most6s = await scrapeCategory('most-sixes');
// //     // const most100s = await scrapeCategory('most-hundreds');
// //     // const most50s = await scrapeCategory('most-fifties');

// //     await browser.close();

// //     return {
// //         orangeCap,
// //         most4s,
// //         most6s,
// //         most100s,
// //         most50s
// //     };
//  }

// scrapeIPLData().then(data => {
//     console.log(data);
// }).catch(error => {
//     console.error('Error:', error);
// });
