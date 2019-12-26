


export function getHeaderXToken(token){
    return  {
        headers: {
            'Content-Type': "application/json", 'x-access-token': 'Token ' + token
        },
    }
}


export function getPostHeaderXToken(token,body){
    return  {
        method: 'POST',
        headers: {
            'Content-Type': "application/json", 'x-access-token': 'Token ' + token
        },
        body: JSON.stringify(body)
    };
}


export function getPutHeaderXToken(token,body){
    return  {
        method: 'PUT',
        headers: {
            'Content-Type': "application/json", 'x-access-token': 'Token ' + token
        },
        body: JSON.stringify(body)
    };
}