import React, { useState } from 'react';
import axios from 'axios';

function DepositForm(props) {
    const logo={
        border: '2px solid black',
        width: '80px',
         height: '40px',
         color: 'black',
     }
  const [amount, setAmount] = useState('');

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };
  const {data1,data2} = props.data;

  const handleDeposit = (e) => {
    // deposit logic 
    console.log(data2)
    console.log(data1)
    axios.post('http://localhost:5000/deposit', {
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
    console.log(`Amount: ${amount} - Deposit`);
  };

  return (
    <div>
        <div>
        <h2 style={{}}>Amount:</h2>
        <input type="text" value={amount} placeholder="Enter amount to deposit" style={{ width: '450px', height: '40px', border: '2px solid black'}} onChange={handleAmountChange} />
        <button class="btn btn-info" style={logo} onClick={handleDeposit}>Deposit</button>
        </div>
    </div>
  );
}

export default DepositForm;
