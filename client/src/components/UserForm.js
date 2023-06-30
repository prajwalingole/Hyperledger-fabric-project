import React, { useState } from 'react';
import axios from 'axios';
import './UserForm.css'; 

function UserForm(props) {
    const containerStyle = {
        // backgroundImage: "url('https://dt2sdf0db8zob.cloudfront.net/wp-content/uploads/2020/02/form-builders-11.webp')", // Set the path to your desired background image
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        // padding: '20px',
        // borderRadius: '5px',
        background: 'warning', // Set the desired background color with transparency (alpha value)
        padding: '20px',
        border:'2px solid black',
        background: '0,0,0,0',
        borderRadius: '5px',

      };
    const headingStyle = {
        textAlign: 'center',
        background: '0,0,0,0',
        color: 'black',
        fontSize: '44px',
        border:'3px solid black'
      };
      const headingStyle1 = {
        textAlign: 'center',
        display: 'block',
          margin: 'auto',
        color: 'black',
        fontSize: '24px',
        border:'3px solid black'
      };
//  const logo={
//     margin:'9px',
//     border: '2px solid black'
//  }
  const [userId, setUserId] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [balance,setBalance] = useState(null)

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
    props.setData({...props.data,data1:e.target.value})
  };

  const handleOrganizationNameChange = (e) => {
    setOrganizationName(e.target.value);
    props.setData({...props.data,data2:e.target.value})
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(organizationName);
    console.log(userId)
    axios.post('http://localhost:5000/connect', {
      orgMspId: organizationName,
      userId: userId,
      affiliation: `${organizationName.toLowerCase()}.department1`
  })
    .then(function (response) {
      setBalance(response.data)
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

    // console.log(`User ID: ${userId}`);
    // console.log(`Organization Name: ${organizationName}`);
    // can make api calls here
  };
  return (
    <div className="user-form-container" style={containerStyle}>

      <h2 className="container" style={headingStyle}>User Form</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="userId" style={{color:'black'}}>User ID:</label>
        <input type="text" id="userId" placeholder="Enter user id" style={{border:'2px solid black'}} value={userId} onChange={handleUserIdChange} />
      </div>
      <div className="form-group">
        <label className="organizationName" style={{color:'black'}}>Organization Name:</label>
        <input type="text" id="organizationName" placeholder="Enter organization name" style={{border:'2px solid black'}} value={organizationName} onChange={handleOrganizationNameChange} />
      </div>
      <div>
      {balance==null ? (
        <button className="btn btn-success" type="submit" style={headingStyle1}>Submit</button>
      ) : (
        <h3>Account created successfully with balance: {balance}</h3>
      )}
    </div>
      {/* <button className="btn btn-success" type="submit" style={headingStyle1}>Submit</button> */}
      </form>
      {/* <p>Account created successfully with balance: {balance}</p> */}
      
    </div>
  );
}

export default UserForm;
