import http, {ServerResponse, IncomingMessage} from 'http'

const port:number = 6478;

interface iMessage {
    data: null| {} |{}[]
    message: string;
    success: boolean;
}

interface iData{
    id: number
    name:string;
    stack: string;
}

let dummyData: iData[] = [
    {
        id: 2,
        name: 'Winning Always',
        stack: 'Null-stack'
    },
    {
        id: 3,
        name: 'Always Full to the brim',
        stack: 'Full-stack'
    },
    {
        id: 4,
        name: 'No time to play',
        stack: 'Half-stack'
    },
]

const Server = http.createServer((req:IncomingMessage, res: ServerResponse<IncomingMessage>)=>{
  res.setHeader('Content-type', 'Applicatin/json')
  const {method, url} = req
  let status:number = 404

  let response:iMessage = {
    data : null,
    success: false,
    message: 'Falsified information'
  }
  let Container: any = []
  req.on('data', (bits:any)=>{
    Container.push(bits)
  })
  .on('end', ()=>{
    if(url === "/homepage" && method === 'GET'){
        status = 200
        response.data = dummyData;
        response.success = true;
        response.message = 'Clean information passed and stored'
        res.write(JSON.stringify({response, status}))
        res.end()
    }
    //POST METHOD
    if(url === '/homepage' && method === 'POST')
    {
        status = 201
        response.data = dummyData;
        response.message = 'New User Accepted'
        response.success = true;
        const body = JSON.parse(Container);
                  dummyData.push(body);
        res.write(JSON.stringify({response, status}))
        res.end()
    }
    //PATCH METHOD
    if(method === 'PATCH'){
        const build = JSON.parse(Container)

        let myBioData:any = url?.split("/")[0]
        let userId = parseInt(myBioData)

        let targetValue = dummyData.some((el)=>{
            return el?.id === userId;
        })
        if(targetValue === false){
            status = 404
            response.data = null
            response.message = 'User id does not exist'
            response.success = false
            res.write(JSON.stringify({response, status}))
            res.end()
        }else{
            const  updatename = build.name

            dummyData = dummyData.map((user:any)=>{
                if(user?.id === targetValue){
                    return {
                        id: user?.id,
                        name: updatename,
                        stack: user?.stack
                    }
                }
                return user
            })
            status = 200
            response.data = dummyData
            response.message = 'User Account Details Updated'
            response.success = true
            res.write(JSON.stringify({response, status}))
            res.end()
        }

    }
    
    if(method === 'PUT'){
        const build = JSON.parse(Container)

        let userInfo: any = url?.split("/")[1]
        let userNumber = parseInt(userInfo)

        let findTarget = dummyData.some((el)=>{
            return el?.id === userNumber
        })
        if(findTarget === false){
            status = 404
            response.data = null
            response.message = 'User not found'
            response.success = false
            res.write(JSON.stringify({response, status}))
            res.end()
        }else{
            const updatename = build.name
            const updateage = build.age
            
            dummyData = dummyData.map((user:any)=>{
                if(user?.id === userNumber){
                    return{
                        id: user?.id,
                        name: updatename,
                        age: updateage
                    }
                }
                return user;
            })
            status = 200
            response.data = dummyData
            response.message = 'Done already'
            response.success = true
            res.write(JSON.stringify({response, status}))
            res.end()
        }
    }
  })
})

Server.listen(port,()=>{
    console.log(`Listening on port: ${port}`);
    
})