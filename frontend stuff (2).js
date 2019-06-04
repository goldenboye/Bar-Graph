  
  const signin = (email, password) =>{
      //email and password from forms
    fetch("https://tranquil-depths-95886.herokuapp.com/signin", {
        method:'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            email:email,
            password:password
        })
    })
        .then(response => response.json())
        .then( result => {
            console.log(result);
        let resObject =   {
                    name: result.name,
                    type:'customer',
                    phone:result.phone,
                    address:result.address,
                    email:result.email
                    }
               // do what u want with response object, it contains these fields, u can ignore it and move on to next screen
               console.log("resObj", resObject);
        })
        .catch(err => console.log('err', err));// here u can say failed to signin
  }


  const register = (email,name,password, phone, address)=> {
    fetch("https://tranquil-depths-95886.herokuapp.com/register", {
        method:'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify( {
            email:email,
            name:name,
            password:password,
            phone:phone,
            address:address
        })
    })
        .then(response => response.json())
        .then( result => {
            if(result.email){
                //say successful
                    console.log("registered")
            }

        })
        .catch(err => console.log('err', err));// say unable to register
  }

           