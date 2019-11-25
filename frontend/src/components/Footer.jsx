import React from 'react';
import { Row, Col } from 'antd';

import './Footer.scss';

import logo from '../images/footer.png';

const Footer = () => {
	return (
		<footer>
			<div className='footer-1'>
				<div className='container'>
					<Row>
						<Col md={6} sm={24}>
							<img className='logo' src={logo}/>
						</Col>
						<Col md={6} sm={8} xs={24}>
							<div className='head'>ข้อมูลลงทะเบียนประชาชน</div>
							<div className='detail'>
								การรับสิทธิ การใช้งานแอปพลิเคชั่น <span className='nowrap'>“เป๋าตัง”</span> และ <span className='nowrap'>“ถุงเงิน”</span>
							</div>
							<div className='detail'>
								ติดต่อ ชิมช้อปใช้ Call Center by Krungthai โทร.<a className='ml-1' href='tel:021111144'><span className='nowrap'>0 2111 1144</span></a>
							</div>
						</Col>
						<Col md={6} sm={8} xs={24}>
							<div className='head'>ข้อมูลลงทะเบียนผู้ประกอบการ</div>
							<div className='detail'>เงื่อนไขและวิธีการเข้าร่วมมาตรการฯ</div>
							<div className='detail'>
								ติดต่อ โทร.<a className='ml-1' href='tel:022706400'><span className='nowrap'>0 2270 6400 กด 7</span></a>
							</div>
						</Col>
						<Col md={6} sm={8} xs={24}>
							<div className='head'>ข้อมูลเที่ยวชิมช้อปใช้</div>
							<div className='detail'>ติดต่อ ททท.</div>
							<div className='detail'>โทร<a className='ml-1' href='tel:1672'><span>1672</span></a></div>
						</Col>
					</Row>
				</div>  
			</div>
			<div className='footer-2'>
				<div className='container'>
					<Row className='no-gutters'>
						<Col lg={6} md={6} sm={24}>
							<div className='copyright'>Copyright © 2003-2019</div>
						</Col>
						<Col lg={18} md={18} sm={24}>
							<Row className='nav no-pad'>
								<Col lg={8} md={8} sm={8} xs={24}>
									<a className='nav-link' href='https://regist.ชิมช้อปใช้.com/Register/' target='_blank' rel='noopener noreferrer'>ลงทะเบียนเข้าร่วมมาตรการ</a>
								</Col>
								<Col lg={8} md={8} sm={8} xs={24}>
									<a className='nav-link' href='https://www2.ชิมช้อปใช้.com/howto-register' target='_blank' rel='noopener noreferrer'>ขั้นตอนการเข้าร่วมทั้งหมด</a>
								</Col>
								<Col lg={8} md={8} sm={8} xs={24}>
									<a className='nav-link' href='https://www2.ชิมช้อปใช้.com/thung-ngern-shop-province' target='_blank' rel='noopener noreferrer'>รายชื่อร้านค้าที่เข้าร่วมรายการ</a>
								</Col>
							</Row>
						</Col>
					</Row>
				</div>
			</div>
		</footer>
	);
}

export default Footer;