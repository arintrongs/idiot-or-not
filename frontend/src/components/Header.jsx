import React, { PureComponent } from 'react';
import { Row, Col, Menu, Dropdown } from 'antd';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import logo from '../images/footer.png'
import './Header.scss';

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { toggle: false };
  }
	render() {

    const dropdownMenu = (
      <Menu className='Header__dropdownMenu'>
        {
          map(this.props.navbarItems, data => (
            <Menu.Item key={data.label} className='Header__Card'>
              <div className='nav-item'>
                <a className='nav-link' href={data.href} target='_blank' rel='noopener noreferrer'>
                  {data.label}
                </a>
              </div>
            </Menu.Item>
          ))
        }
      </Menu>
    )
    
    return (
      <header>
        <div className='container-fluid'>
          <Row>
            <Col span={24}>
              <ul className='header-links'>
               { map(this.props.navbarItems, data=> (
                  <li key={data.label}><a href={data.href} target='_blank' rel='noopener noreferrer'>{data.label}</a></li>
                ))}
              </ul>
            </Col>
          </Row>
        </div>
        <div className='header-link-mobile'>
          <div className='navbar'>
            <a className='navbar-brand' href='#'><img src={logo}/></a>
            <Dropdown
              overlay={dropdownMenu}
              className='dropdown'
              placement='bottomRight'
              trigger={['click']}
            >
              <div className={'hamburger hamburger--elastic ' + (this.state.toggle ? 'is-active' : '')} 
                onClick={()=>{this.setState({toggle: this.state.toggle ? false : true})}} >
                <div className='hamburger-box'>
                  <div className='hamburger-inner'></div>
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      </header>
    );
  }
}
export default Header;

Header.defaultProps = {
  navbarItems: [
    {
      'label': 'ลงทะเบียนเข้าร่วมมาตรการ',
      'href': 'https://regist.ชิมช้อปใช้.com/Register/'
    },
    {
      'label': 'ขั้นตอนการเข้าร่วม',
      'href': 'https://www2.ชิมช้อปใช้.com/howto-register'
    },
    {
      'label': 'ร้านค้าที่เข้าร่วม',
      'href': 'https://www2.ชิมช้อปใช้.com/thung-ngern-shop-province'
    }
  ]
};
Header.propTypes = {
  navbarItems: PropTypes.array
};