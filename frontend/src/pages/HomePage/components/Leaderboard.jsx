import React from 'react';
import { Table, Divider, Tag } from 'antd';

class Leaderboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data || [],
    };
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
      <Table columns={columns} dataSource={this.props.data} />
      
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