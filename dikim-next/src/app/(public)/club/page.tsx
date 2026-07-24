import Link from 'next/link';

export default function ClubPage() {
  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: 'url(/images/water.jpg)' }}
      >
        <div className="content">
          <div className="brand">Dikim Rock Garden</div>
          <h1>Nightclub &amp; Karaoke</h1>
          <p>High-energy beats, premium lighting, and private karaoke rooms for unforgettable nights.</p>
          <div className="hero-btns">
            <Link href="/contact" className="btn btn-primary">Book A Lounge</Link>
            <a href="#club-details" className="btn btn-outline">Explore Nightlife</a>
          </div>
        </div>
      </section>

      <section className="about about-stack" id="club-details">
        <div className="row" data-reveal="left">
          <div className="image">
            <img src="/images/lounge2.jpg" alt="Nightclub Lounge" />
          </div>
          <div className="content">
            <div className="section-eyebrow">The Nightclub</div>
            <h3>Intoxicating Beats &amp; Premium Energy</h3>
            <p>
              Step into the ultimate party destination in Jos. Our nightclub features state-of-the-art sound systems, captivating laser shows, and guest DJs spinning the hottest tracks. Enjoy our premium bar services and high-energy dance floor designed to keep you grooving all night long.
            </p>
            <Link href="/contact" className="btn">VIP Reservations</Link>
          </div>
        </div>

        <div className="row reverse" data-reveal="right">
          <div className="image">
            <img src="/images/viplounge.jpg" alt="Karaoke Lounge" />
          </div>
          <div className="content">
            <div className="section-eyebrow">Karaoke Lounge</div>
            <h3>Sing Your Heart Out</h3>
            <p>
              Gather your friends and family for an intimate and fun musical experience. Our private karaoke rooms are equipped with top-tier microphones, an extensive multi-genre song catalog, and personal bar service. Whether you&apos;re a professional singer or just looking to have fun, we have the perfect stage for you.
            </p>
            <Link href="/contact" className="btn btn-green-outline">Book Private Room</Link>
          </div>
        </div>
      </section>
    </>
  );
}
