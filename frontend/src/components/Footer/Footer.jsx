import './Footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className='footer' id='footer'>
            <p className="footer-copyright">
                Copyright {currentYear} @ By Me - All Rights Reserved
            </p>
        </div>
    );
};

export default Footer;
