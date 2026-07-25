import { Link } from 'react-router-dom';

export default function VIPLoungePage() {
  return (
    <section className="about about-stack" id="about">
      <div className="row" data-reveal="left">
        <div className="image">
          <img src="/images/viplounge2.jpg" alt="VIP Lounge" />
        </div>
        <div className="content">
          <div className="section-eyebrow">Exclusive VIP</div>
          <h3>VIP Lounge</h3>
          <p>
            Relax in style at our VIP Lounge — a private, comfortable space for those who want a little extra exclusivity. Ideal for quiet chats or hosting a small gathering in an elegant atmosphere.
          </p>
          <Link to="/contact" className="btn btn-primary">Reserve Lounge</Link>
        </div>
      </div>

      <div className="row reverse" data-reveal="right">
        <div className="content">
          <div className="section-eyebrow">Relax &amp; Unwind</div>
          <h3>Exquisite Lounge</h3>
          <p>
            Sit back, enjoy good conversation, or simply take a peaceful moment in our inviting lounge — the perfect spot to unwind.
          </p>
          <Link to="/contact" className="btn btn-green-outline">Book Space</Link>
        </div>
        <div className="image">
          <img src="/images/lounge1.jpg" alt="Lounge area" />
        </div>
      </div>

      <div className="row" data-reveal="left">
        <div className="image">
          <img src="/images/mainbar.jpg" alt="Bar" />
        </div>
        <div className="content">
          <div className="section-eyebrow">Premium Drinks</div>
          <h3>The Bar</h3>
          <p>
            Classic favorites and unique blends served in a space built for casual hangouts and nights out — there&apos;s always something to enjoy.
          </p>
          <Link to="/contact" className="btn btn-primary">View Drinks Menu</Link>
        </div>
      </div>
    </section>
  );
}
