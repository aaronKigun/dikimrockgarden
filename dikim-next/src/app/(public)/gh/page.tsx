import Link from 'next/link';

export default function GardenHallPage() {
  return (
    <section className="about" id="about" style={{ marginTop: '8rem' }}>
      <div className="row" data-reveal="left">
        <div className="image">
          <img src="/images/g3.jpg" alt="Garden view" />
        </div>
        <div className="content">
          <div className="section-eyebrow">Outdoor Oasis</div>
          <h3>THE GARDEN</h3>
          <p>Enjoy the beauty of nature in our Garden at Dikim Rock Garden, a peaceful place filled with fresh plants and an open view. It's the perfect location for a picnic, a quiet stroll, photo shoots, weddings, or simply to relax and take in the fresh air.</p>
          <Link href="/contact" className="btn btn-primary">Book Garden space</Link>
        </div>
      </div>

      <div className="row reverse" style={{ marginTop: '8rem' }} data-reveal="right">
        <div className="content">
          <div className="section-eyebrow">Event Space</div>
          <h3>THE EVENT HALL</h3>
          <p>Our Hall is the perfect venue for all your special events. Whether it's a wedding, conference, birthday, or any gathering, we provide a spacious and well-equipped setting to make your occasion memorable.</p>
          <Link href="/contact" className="btn btn-green-outline">Rent Hall</Link>
        </div>
        <div className="image">
          <img src="/images/bar.jpg" alt="Hall venue" />
        </div>
      </div>
    </section>
  );
}
