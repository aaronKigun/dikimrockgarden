import Link from 'next/link';

export default function VIPLoungePage() {
  return (
    <section className="about" id="about" style={{ marginTop: '8rem' }}>
      <div className="row" data-reveal="left">
        <div className="image">
          <img src="/images/viplounge2.jpg" alt="VIP Lounge" />
        </div>
        <div className="content">
          <div className="section-eyebrow">Exclusive VIP</div>
          <h3>VIP LOUNGE</h3>
          <p>Relax in style at our VIP Lounge at Dikim Rock Garden. It's a private and comfortable space designed for those who want a little extra exclusivity. Whether you're having a quiet chat, or hosting a small gathering, our VIP Lounge offers a cozy and elegant atmosphere just for you.</p>
          <Link href="/contact" className="btn btn-primary">Reserve Lounge</Link>
        </div>
      </div>

      <div className="row reverse" style={{ marginTop: '8rem' }} data-reveal="right">
        <div className="content">
          <div className="section-eyebrow">Relax &amp; Unwind</div>
          <h3>EXQUISITE LOUNGE</h3>
          <p>Take a break and enjoy the comfortable setting of our Lounge. It's the perfect spot to sit back, have a good conversation, or simply enjoy a peaceful moment in a relaxed and inviting atmosphere.</p>
          <Link href="/contact" className="btn btn-green-outline">Book Space</Link>
        </div>
        <div className="image">
          <img src="/images/lounge1.jpg" alt="Lounge area" />
        </div>
      </div>

      <div className="row" style={{ marginTop: '8rem' }} data-reveal="left">
        <div className="image">
          <img src="/images/mainbar.jpg" alt="Bar" />
        </div>
        <div className="content">
          <div className="section-eyebrow">Premium Drinks</div>
          <h3>THE BAR</h3>
          <p>Experience the perfect blend of relaxation and excitement at our Bar. A wide variety of drinks, from classic favorites to unique blends are all served. Whether you're here for a casual hangout or a night out, there's always something to enjoy.</p>
          <Link href="/contact" className="btn btn-primary">View Drinks Menu</Link>
        </div>
      </div>
    </section>
  );
}
