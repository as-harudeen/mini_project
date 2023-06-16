const fetchData = async (url, method, body) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    if (method === 'POST' || method === 'PUT') {
      options.body = JSON.stringify(body);
    }
  
    const response = await fetch(url, options);
  
    return response;
  };

export  default fetchData