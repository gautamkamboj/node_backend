import axios from "axios";
import {load} from 'cheerio';
import xlsx from 'xlsx';


(async()=>{
    const url = "https://www.linkedin.com/jobs/search?keywords=Full%20Stack%20Engineer&location=India&geoId=102713980&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0";
    try{
        const res = await axios.get(url);
        const html = res.data;
       const jq = load(html);
       const jobs = jq('.base-search-card__info');
       // console.log(jobs.length)
       const data =[];
       data.push(['Title','Company Name','Location', 'Job Type','Posted Date']);
       jobs.each((_,element)=>{
            const container = jq(element);
         
            const title = container.find('h3.base-search-card__title').text().trim();
            const company = container.find('h4.base-search-card__subtitle').text().trim();
            const location = container.find('.job-search-card__location').text().trim();
            const type = container.find('.job-posting-benefits__text').text().trim();
            const date = container.find('.job-search-card__listdate').attr().datetime;
           // console.log(title);
             data.push([title,company,location,type,date]);
        
       });
       const workbook = xlsx.utils.book_new();
       const sheet = xlsx.utils.aoa_to_sheet(data);
       xlsx.utils.book_append_sheet(workbook,sheet,"DATA");
       xlsx.writeFile(workbook,"Jobs_data.xlsx");
       console.log('done');
    }
    
    catch(e){
        console.log(e.response);
    }

})();
