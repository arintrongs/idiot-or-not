import React from 'react';

class Leaderboard extends React.Component {
  render() {
    return (
      <div style={{padding: '40px', marginLeft: '60px'}}> 
      <div style={{fontSize: '36px'}}>Leaderboard </div>
        {this.props.data.map((val,idx)=>{
      return(
        <div style={{padding: '20px', fontSize: '20px'}}> {val.uid}: {val.score} </div>
      ) 
    })}
      </div>
      
    )
  }
}

export default Leaderboard;