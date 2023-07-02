const fetchData = async (url, method, body, token) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    if (method === 'POST' || method === 'PUT') {
      options.body = JSON.stringify(body);
    }
  
    if(token) options.headers.Authorization = 'Bearer ' + token

    const response = await fetch(url, options);
  
    return response;
  };

export  default fetchData