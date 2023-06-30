import React, { useState } from 'react';
import UserForm from './components/UserForm';
import DepositForm from './components/DepositForm';
import TransactionForm from './components/TransactionForm';
import WithdrawForm from './components/WithdrawForm';
// import Userbalance from './components/Userbalance';



function App() {
  const [prim,setPrim] = useState({data1:'',data2:""})
  const backgroundContainerStyle = {
    // backgroundImage: "url('https://www.91-cdn.com/hub/wp-content/uploads/2023/04/best-powerbank-in-india.jpg')",
    backgroundColor:'teal',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    width: '100%',
  };
  console.log(prim)
  
  return (
       <div style={backgroundContainerStyle}>
       <div class="container">
      <UserForm data={prim} setData={setPrim} />
      <br/>
      <div class="flexx my-3" style={{border:'2px solid black'}}>
      <DepositForm data={prim} />
      <br/>
      <TransactionForm data={prim}  />
      <br/>
      <WithdrawForm data={prim}  />
      </div>
    
      </div>
      </div>
  );
}

export default App;
