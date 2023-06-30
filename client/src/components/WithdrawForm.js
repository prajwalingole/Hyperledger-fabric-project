import React, { useState } from 'react';
import axios from 'axios';

function WithdrawForm(props) {
    const logo={
        border: '2px solid black',
        width: '110px',
         height: '40px',
         color: 'black',
         marginRight: '220px'
     }
  const [amount, setAmount] = useState('');
  const [balance,setBalance] = useState(null)
  const {data1,data2} = props.data;
  // const {userId,data2,affiliation} = props;
  console.log(props.data); 
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    console.log(data2)
    console.log(data1)
    axios.post('http://localhost:5000/withdraw', {
      orgMspId: data2,
      userId: data1,
      affiliation: `${data2.toLowerCase()}.department1`,
      amount: amount
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  };
  const handlebalance =(e)=>{
    e.preventDefault();
    axios.post('http://localhost:5000/balance', {
      orgMspId: data2,
      userId: data1,
      affiliation: `${data2.toLowerCase()}.department1`,
      amount: amount
  })
    .then(function (response) {
      setBalance(response.data)
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });


  }

  return (
    <div>
      <div>
        <h3>Amount: </h3>
        <input type="text" placeholder="Enter amount to be withdrawl" style={{ width: '450px', height: '40px', border: '2px solid black'}} value={amount} onChange={handleAmountChange} />
        <button class="btn btn-info" style={logo} onClick={handleWithdraw}>Withdraw</button>
      </div>
    <br/>
      <div>
      <h3>Balance: </h3>
        {/* <input type="text" style={{ width: '450px', height: '40px', border: '2px solid black'}} value={amount} onChange={handleAmountChange} /> */}
        <div>
          <button class="btn btn-info" style={logo} onClick={handlebalance}>getBalance</button>
          {balance!=null?(<p>Account balance is : {balance}</p>):(<p></p>)}
        </div>
      </div>



    </div>
  );
}

export default WithdrawForm;
