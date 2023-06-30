import React, { useState } from 'react';
import axios from 'axios'

function TransactionForm(props) {
    const logo={
        // margin:'9px',
        border: '2px solid black',
        width: '110px',
         height: '40px',
         color: 'black',
     }
  const [transactionUserId, setTransactionUserId] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const {data1,data2} = props.data;

  const handleTransactionUserIdChange = (e) => {
    setTransactionUserId(e.target.value);
  };

  const handleTransactionAmountChange = (e) => {
    setTransactionAmount(e.target.value);
  };

  const handleTransaction = () => {
    // transaction logic 
    // deposit logic 
    console.log(data2)
    console.log(data1)
    axios.post('http://localhost:5000/transfer', {
      orgMspId: data2,
      userId: data1,
      affiliation: `${data2.toLowerCase()}.department1`,
      userId2: transactionUserId,
      amount: transactionAmount
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    console.log(`Transaction User ID: ${transactionUserId}, Amount: ${transactionAmount} - Transaction`);
  };

  return (
    <div>
     <div>
        <div>
        <h3>Transfer User ID:</h3>
        <input type="text" placeholder="Enter Transfer user id" style={{ width: '450px', height: '40px', border: '2px solid black'}}  value={transactionUserId} onChange={handleTransactionUserIdChange} />
        </div>
        <h3>Transfer Amount:</h3>
        <input type="text" placeholder="Enter Transfer amount" style={{ width: '450px', height: '40px', border: '2px solid black'}}  value={transactionAmount} onChange={handleTransactionAmountChange} />
      </div>
      <button class="btn btn-info" style={logo} onClick={handleTransaction}>Transfer</button>
    </div>
  );
}

export default TransactionForm;
