import React from 'react';

class Leaderboard extends React.Component {
  render() {
    return (
      <div style={{padding: '40px', marginLeft: '60px'}}> 
      <div style={{fontSize: '36px'}}>Leaderboard </div>
        {[5,6,7].map((val,idx)=>{
      return(
        <div style={{padding: '20px', fontSize: '20px'}}> eqsk134: {val} </div>
      ) 
    })}
      </div>
      
    )
  }
}

export default Leaderboard;