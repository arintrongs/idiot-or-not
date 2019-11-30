import React from 'react';
import { Table, Divider, Tag } from 'antd';
import axios from 'axios'

class Leaderboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [{uid: 'eqsk134', score: 999999}],
    };
    setInterval(async () => {
      const response = await axios.get('http://192.168.0.113:5000/leaderboard');
      const dataLeaderboard = JSON.parse(response.data || '')
      this.setState({ data: dataLeaderboard.data});
      console.log('after set',dataLeaderboard.data)
    }, 1000);
  }
  
  render() {

    const columns = [
      {
        title: 'Username',
        dataIndex: 'uid',
        key: 'uid',
        render: text => <b>{text}</b>,
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
      },
    ];

    return (
      <div style={{padding: '40px', marginLeft: '60px'}}> 
      <div style={{fontSize: '36px'}}>Leaderboard </div>
      <Table columns={columns} dataSource={this.state.data} />
      
        {/* {this.props.data.map((val,idx)=>{
      return(
        <div style={{padding: '20px', fontSize: '20px'}}> {val.uid}: {val.score} </div>
      ) 
    })} */}
      </div>
      
    )
  }
}

export default Leaderboard;