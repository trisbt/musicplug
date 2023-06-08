// import React, { useState } from 'react';
// let token = 'oLJ3HV2evNygH4j--uTKP0dcHb9wJ2kQ-dkI4ho3_ISU4_ifJDydJWtEBGsiUt6B';
// const SearchGenius = ({ name }) => {
//     // console.log(name);
//     // const [response, setResponse] = useState('');
//     // 
//     fetch(`http://api.genius.com/search?q=${name}&access_token=${token}`, {
//         // headers: {
//         //     'Authorization': `Bearer ${ accessToken }` // Use the access token for authorization
//         // }
//     })
//         // fetch(`${url}&access_token=${token}`)
//         .then(response => response.json())
//         .then(data => {
//             // console.log(data);
//             // gsetResponse(data);
//             // setResponse(data);
//         })
//         .catch(err => {
//             console.log(err);
//         })
//     return (
//         // onClick={SearchGenius}
//         <div>
//             <button className='search-id' onClick={SearchGenius}>Get Credits</button>
//             {/* {response} */}
//         </div>
//     );
// }
// export default SearchGenius;