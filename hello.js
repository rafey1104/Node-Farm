const url = require('url');
const http = require('http');
const fs = require('fs');
const replaceTemplate =(temp, product) => {
    let output = temp.replace(/%productName%/g, product.productName);
    output =output.replace(/%image%/g, product.image);
    output =output.replace(/%price%/g, product.price);
    output =output.replace(/%from%/g, product.from);
    output =output.replace(/%nutrients%/g, product.nutrients);
    output =output.replace(/%quantity%/g, product.quantity);
    output =output.replace(/%description%/g, product.description);
    output =output.replace(/%id%/g, product.id);

    if(!product.organic) output =output.replace(/%not_organic%/g, 'not-organic');
    return output;
}


const tempcard  = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempoverview  = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempproduct  = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data  = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataobj=JSON.parse(data); 
const server = http.createServer((req,res) => {
    const {query, pathname} = url.parse(req.url, true);
    
    if(pathname === '/' || pathname ==='/overview'){
        res.writeHead(200, {'Content-type':'text/html'});

        const cardsHtml =dataobj.map(el => replaceTemplate(tempcard,el)).join('');
        const output = tempoverview.replace('%product_cards%', cardsHtml);
        res.end(output);
        
    }
    else if(pathname === '/product'){
        res.writeHead(200, {'Content-type':'text/html'});
        const product =dataobj[query.id];
        const output = replaceTemplate(tempproduct, product);
        res.end(output);

    }
    else if(pathname === '/api'){
        res.writeHead(200, {'Content-type':'application/json'});
        res.end(data);
    }
    else{
        res.end('error 404');
    }
    
});
server.listen(8000, '127.0.0.1', () =>{
    console.log('listening on port 8000');
});