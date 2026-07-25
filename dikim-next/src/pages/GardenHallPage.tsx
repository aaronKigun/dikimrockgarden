import { Link } from 'react-router-dom';

export default function GardenHallPage() {
  return (
    <section className="about about-stack" id="about">
      <div className="row" data-reveal="left">
        <div className="image">
          <img src="/images/g3.jpg" alt="Garden view" />
        </div>
        <div className="content">
          <div className="section-eyebrow">Outdoor Oasis</div>
          <h3>The Garden</h3>
          <p>
            Enjoy nature in our garden — a peaceful space filled with greenery and open views. Perfect for picnics, photo shoots, weddings, or simply relaxing in the fresh air.
          </p>
          <Link to="/contact" className="btn btn-primary">Book Garden Space</Link>
        </div>
      </div>

      <div className="row reverse" data-reveal="right">
        <div className="content">
          <div className="section-eyebrow">Event Space</div>
          <h3>The Event Hall</h3>
          <p>
            A spacious, well-equipped venue for weddings, conferences, birthdays, and gatherings — designed to make every occasion memorable.
          </p>
          <Link to="/contact" className="btn btn-green-outline">Rent Hall</Link>
        </div>
        <div className="image">
          <img src="/images/bar.jpg" alt="Hall venue" />
        </div>
      </div>
    </section>
  );
}
