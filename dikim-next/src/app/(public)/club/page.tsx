import Link from 'next/link';

export default function ClubPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="home" id="home" style={{ minHeight: '60vh', height: '60vh' }}>
        <div className="swiper home-slider">
          <div className="swiper-wrapper">
            <div className="swiper-slide slide" style={{ backgroundImage: 'url(/images/water.jpg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', height: '100%' }}>
              <div className="content">
                <div className="hero-pill">Ultimate Entertainment</div>
                <h3>Nightclub &amp; Karaoke</h3>
                <p>Unleash the night with high-energy beats, premium lighting, and private karaoke rooms designed for unforgettable memories.</p>
                <div className="hero-btns">
                  <Link href="/contact" className="btn btn-primary">Book A Lounge</Link>
                  <a href="#club-details" className="btn btn-outline">Explore Nightlife</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="details" id="club-details" style={{ padding: '8rem 8%' }}>
        <div className="row">
          <div className="content">
            <h3 style={{ fontSize: '2.6rem', color: 'var(--g700)', fontFamily: 'var(--ff-display)', fontWeight: 700, marginBottom: '2rem' }}>NIGHT CLUB</h3>
            <p style={{ fontSize: '1.6rem', color: 'var(--gray)', lineHeight: 1.8 }}>Our premium nightclub is equipped with a state-of-the-art sound system, dynamic lighting, and an outstanding DJ lineup playing a blend of local and international hits. Relax in the lounge or hit the dance floor under standard air conditioning and tight security.</p>
          </div>
          <div className="image">
            <img src="/images/home.jpg" alt="Club at Dikim" style={{ borderRadius: 'var(--r)', boxShadow: 'var(--sh-md)' }} />
          </div>
        </div>

        <div className="row reverse" style={{ marginTop: '8rem' }}>
          <div className="content">
            <h3 style={{ fontSize: '2.6rem', color: 'var(--g700)', fontFamily: 'var(--ff-display)', fontWeight: 700, marginBottom: '2rem' }}>KARAOKE LOUNGE</h3>
            <p style={{ fontSize: '1.6rem', color: 'var(--gray)', lineHeight: 1.8 }}>Gather your friends and sing your heart out in our comfortable private karaoke rooms. Choose from a vast library of classic tracks and contemporary hits, served with premium drinks and custom bites.</p>
          </div>
          <div className="image">
            <img src="/images/t2.jpg" alt="Karaoke at Dikim" style={{ borderRadius: 'var(--r)', boxShadow: 'var(--sh-md)' }} />
          </div>
        </div>
      </section>
    </>
  );
}
