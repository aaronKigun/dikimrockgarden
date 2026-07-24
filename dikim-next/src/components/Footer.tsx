import Link from 'next/link';

export default function Footer() {
  return (
    <section className="footer">
      <div className="box-container">
        <div className="box">
          <h3>Contact Us</h3>
          <a href="tel:+2349039284897">
            <i className="fa-solid fa-mobile"></i>+2349039284897
          </a>
          <p style={{ color: '#aaa', fontSize: '1.3rem', padding: '.2rem 0' }}>OR</p>
          <a href="tel:+2347051555529">
            <i className="fa-solid fa-mobile"></i>+2347051555529
          </a>
          <a href="mailto:dikimrockgarden@gmail.com">
            <i className="fa-solid fa-paper-plane"></i>dikimrockgarden@gmail.com
          </a>
          <a href="#">
            <i className="fa-solid fa-location-crosshairs"></i>Mountain Green Street, Jos, Plateau State, Nigeria
          </a>
        </div>

        <div className="box">
          <h3>Links</h3>
          <Link href="/">Home</Link>
          <Link href="/#room">Lodging</Link>
          <Link href="/cuisine">Cuisine</Link>
          <Link href="/vlb">Lounge</Link>
          <Link href="/gh">Garden</Link>
          <Link href="/club">Club &amp; Karaoke</Link>
        </div>

        <div className="box">
          <h3>Resources</h3>
          <a href="#">Refund Policy</a>
          <Link href="/#faq">FAQs</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="share">
          <a href="#" className="fab fa-facebook-f" aria-label="Facebook"></a>
          <a href="#" className="fab fa-instagram" aria-label="Instagram"></a>
          <a href="#" className="fab fa-twitter" aria-label="Twitter"></a>
          <a href="#" className="fab fa-whatsapp" aria-label="WhatsApp"></a>
        </div>

        <div className="credit">
          <div>&copy; 2026 Dikim Rock Garden</div>
          <div>Built by <span>URRANTECH</span></div>
        </div>
      </div>
      <div className="down">All Rights Reserved</div>
    </section>
  );
}
