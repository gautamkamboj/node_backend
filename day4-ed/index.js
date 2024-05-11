import axios from "axios";
import {load} from 'cheerio';
import xlsx from 'xlsx';


(async()=>{
    const url = "https://www.amazon.in/gp/bestsellers/electronics/1389432031?ref_=Oct_d_obs_S&pd_rd_w=UQm8N&content-id=amzn1.sym.a0183515-a55a-48ac-a863-406c0a598721&pf_rd_p=a0183515-a55a-48ac-a863-406c0a598721&pf_rd_r=Y35AYPTQBJRV15KB0JHW&pd_rd_wg=0zDQd&pd_rd_r=ee5b3613-2d22-4bec-aba0-d76d31a4931d";
    try{
        const res = await axios.get(url);
       const html = res.data;
       const jq = load(html);
       const phones = jq('._cDEzb_grid-column_2hIsc');
       const data =[];
       data.push(['Name','Price','Rating', 'Number of Ratings']);
    //    console.log(phones.length);
       phones.each((_,element)=>{
        const container = jq(element);
        const name = container.find('._cDEzb_p13n-sc-css-line-clamp-3_g3dy1').text();
        const price = container.find('._cDEzb_p13n-sc-price_3mJ9Z').text();
        const rating = container.find('.a-icon-alt').text();
        const numberOfPeople = container.find('.a-size-small').text();
        data.push([name,price,rating,numberOfPeople]);
       });
       const workbook = xlsx.utils.book_new();
       const sheet = xlsx.utils.aoa_to_sheet(data);
       xlsx.utils.book_append_sheet(workbook,sheet,"DATA");
       xlsx.writeFile(workbook,"amazon_phone_data.xlsx");
       console.log("done");
    }
    catch(e){
        console.log(e);
    }

})();