import React from 'react';
import { Form, Select, Button, Input } from 'antd';
import axios from 'axios';

const { Option } = Select;


class PriceInput extends React.Component {

  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.num,
      op: ['+', '+', '+', '+', '+', '+', '+', '+', '+', '+'],
      user: '',
      ans: this.props.ans,
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.num !== this.props.num) {
      this.setState({ data: this.props.num });
    }
    if (prevProps.ans !== this.props.ans) {
      this.setState({ ans: this.props.ans });
    }
  }

  handleUser = user => {
    if (!('value' in this.props)) {
      this.setState({ user: user.target.value });
    }
    this.triggerChange({ user: user.target.value });
  };

  handleCurrencyChange2 = (currency2, idx) => {
    var tmp = []
    for (var i = 0; i < this.state.data.length; i += 1) {
      if (idx === i) {
        tmp.push(currency2)
      }
      else {
        tmp.push(this.state.op[i])
      }
    }
    this.setState({ op: tmp });
    this.triggerChange({ op: tmp });
  };

  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        ...this.state,
        ...changedValue,
      });
    }
  };

  render() {
    const { size } = this.props;
    const { data, op, user } = this.state;
    console.log('From Form', this.props.num, this.props.ans);

    return <div style={{ display: 'flex', 'flexDirection': 'row' }}>
      {data.map((val, idx) => {
        if (idx + 1 == data.length) {
          return null;
        }
        return (
          <div style={{ display: 'flex', flex: 3 }}>
            <div style={{ width: '40%', display: 'inline-block', textAlign: 'center' }}> {val} </div>

            <Select
              value={op[idx]}
              size={'large'}
              style={{ width: '60%', display: 'inline-block' }}
              onChange={(e) => this.handleCurrencyChange2(e, idx)}
            >
              <Option value="+">+</Option>
              <Option value="-">-</Option>
              <Option value="*">*</Option>
              <Option value="/">/</Option>
              <Option value="^">^</Option>
            </Select> </div>
        )
      })}
      <div style={{ display: 'flex', flex: 1.2, justifyContent: 'center' }}> {data[data.length - 1]} </div>
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}> = </div>
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}> {this.props.ans} </div>
      <div style={{ display: 'flex', flex: 3, justifyContent: 'center', marginLeft: '60px' }}>
        <div style={{ width: '30%', display: 'inline-block' }}>user: </div>
        <Input style={{ width: '70%' }} value={user} onChange={(e) => this.handleUser(e)} />
      </div>
    </div>
  }
}

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      response: '',
      time: 20,
      interval: setInterval(() => {
        const newTime = this.state.time - 1;
        if (newTime === 0) {
          clearInterval(this.state.interval)
          const btn = document.getElementById('summitBtn');
          btn.click();
        }
        this.setState({ time: newTime });
      }, 1000)
    };
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  handleSubmit = e => {
    clearInterval(this.state.interval)
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const result = await axios.post('http://192.168.0.113:5000/submit', {
          uid: values.Calculator.user,
          num: values.Calculator.data,
          op: values.Calculator.op,
          ans: values.Calculator.ans,
        })
        console.log('result', result)
        const res = result.data;
        if (res.result === true) {
          this.setState({ response: 'success' })
        } else if (result.result === false) {
          this.setState({ response: 'fail' })
        } else {
          this.setState({ response: '' })
        }
      }
    });
  };

  renderResponse = (res) => {
    if (!res || res === '') {
      return ''
    } else if (res == 'success') {
      return (<div style={{ padding: '40px', fontSize: '48px', color: 'green', paddingBottom: '0px', textAlign: 'center', width: '100%' }}>
        Correct!, you are not idiot
    </div>)
    }
    return (<div style={{ padding: '40px', fontSize: '48px', color: 'red', paddingBottom: '0px', textAlign: 'center', width: '100%' }}>
      Wrong answer, you idiot
    </div>)
  }

  render() {
    console.log('time', this.state.time)
    const { getFieldDecorator } = this.props.form;
    console.log('From Problem', this.props.num, this.props.ans);
    return (
      <React.Fragment>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item label="Calculator" style={{ width: '80%', fontSize: '20px' }}>
            {getFieldDecorator('Calculator', {
              initialValue: { op: ['+', '+', '+', '+', '+', '+', '+', '+', '+', '+'], user: '' },
            })(<PriceInput num={this.props.num} ans={this.props.ans} />)}
          </Form.Item>
          <Form.Item style={{ width: '100px' }}>
            <Button id='summitBtn' type="primary" htmlType="submit" disabled={this.state.time <= 0}>
              Submit
            </Button>
          </Form.Item>
        </Form>
        <div className='time-out'>
          <text className={this.state.time > 5 ? 'green' : 'red'}>
            {this.state.time}{this.state.time > 5 ? '' : " !!!"}
          </text>
        </div>
        {this.renderResponse(this.state.response)}
      </React.Fragment>
    );
  }
}

export default Form.create({ name: 'customized_form_controls' })(Demo);