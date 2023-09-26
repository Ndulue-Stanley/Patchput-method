import axios from 'axios';
import http,{ServerResponse, IncomingMessage, createServer} from 'http'

const port: number = 3500
interface iMessage {
    data: null|{} | {}[]
    success: boolean;
    message: string;
}

const Server = http.createServer((req: IncomingMessage, res: ServerResponse<IncomingMessage>)=>{
   res.setHeader('Content-type', 'application/json')
   const {method, url } = req
   let status:number = 404

   let response:iMessage = {
    data: null,
    success: false,
    message: 'Page not found'
   }
   let Container = ''
   
 req.on('data', (chunk: any)=>{
    Container += chunk
 });
 req.on("end" ,async ()=>{
    if (method === "GET"){
        const OriginUrl:any = url?.split("/")[1];
        const usedUrl = parseInt(OriginUrl);

        const fakestoreproduct = await axios.get('https://fakestoreapi.com/products')

        if(fakestoreproduct.status){
            let Datafakestoreproduct = fakestoreproduct.data;
            let originalData = Datafakestoreproduct.filter((el:any)=>{
                return el?.id === usedUrl
            })
            status= 200
            response.data = originalData
            response.message = 'All products gotten'
            response.success = true
            res.write(JSON.stringify({response, status}))
            res.end()
        }else{
            res.write(JSON.stringify({ status, response }));
            res.end();
        }
    }else{
        response.message = "Invalid Route";
        response.data = null;
        response.success = false;
        res.write(JSON.stringify({ status, response }));
        res.end();
    }
 })

    res.end()
})

Server.listen(port, ()=>{
    console.log(`Listening on port : ${port}`);    
})