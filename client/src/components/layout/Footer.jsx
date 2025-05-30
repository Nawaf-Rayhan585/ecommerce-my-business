import React from 'react';
import '../../assets/css/footer.css';
import paymentImg from '../../assets/images/payment.png';
import { FiFacebook, FiYoutube, FiInstagram, FiMail, FiPhone, FiGlobe, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-payments-row">
        <div className="footer-payments-title-img">
          <div className="footer-payments-title">Payment Methods</div>
          <img src={paymentImg} alt="Payment Methods" className="footer-payment-img" />
        </div>
      </div>
      <div className="footer-main">
        <div className="footer-col about">
          <h2 className="footer-logo">Shukr</h2>
          <p className="footer-desc">
            Your trusted destination for the latest gadgets and lighting products in Bangladesh. Discover our curated selection and stay ahead in the digital world.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="YouTube"><FiYoutube /></a>
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
          </div>
          <div className="footer-copyright">
            ©2025 SHUKR, ALL RIGHTS RESERVED.<br />
            DEVELOPED BY <a href="https://github.com/nawaf-rayhan585" target="_blank" rel="noopener noreferrer">Nawaf Rayhan</a>
          </div>
        </div>
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><FiArrowRight /> Shop</li>
            <li><FiArrowRight /> Offers</li>
            <li><FiArrowRight /> Top Sales</li>
            <li><FiArrowRight /> All Products</li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>About Business</h3>
          <ul>
            <li><FiArrowRight /> About us</li>
            <li><FiArrowRight /> Contact us</li>
            <li><FiArrowRight /> Privacy Policy</li>
            <li><FiArrowRight /> Refund Policy</li>
            <li><FiArrowRight /> Terms & Conditions</li>
          </ul>
        </div>
        <div className="footer-col contact">
          <h3>Contact Us</h3>
          <p>Sylhet Sadar, Sylhet-3100<br />Bangladesh.</p>
          <p><FiPhone /> +8801785932606</p>
          <p><FiMail /> fayaz7rg@gmail.com</p>
          <p><FiGlobe /> <a href="https://badhonsworld.com" target="_blank" rel="noopener noreferrer">mywebsite.com</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <div>
          Customer's review | About | FAQ | Made With 🩵 By Nawaf Rayhan
        </div>
      </div>
    </footer>
  );
};

export default Footer;
