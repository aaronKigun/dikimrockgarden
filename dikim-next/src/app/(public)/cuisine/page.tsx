import Link from 'next/link';

export default function CuisinePage() {
  return (
    <section className="about" id="about">
      <div className="row" data-reveal="fade">
        <div className="image">
          <img src="/images/stick meat.jpg" alt="Stick Meat Cuisine" />
        </div>
        <div className="content">
          <div className="section-eyebrow">Our Menu</div>
          <h3>Exquisite &amp; Fine Dining</h3>
          <p>
            Indulge in delicious flavors featuring local favorites and continental dishes. From hearty meals to fresh appetizers, our kitchen has something to satisfy every taste.
          </p>
          <Link href="/contact" className="btn btn-primary">Book A Table</Link>
        </div>
      </div>
    </section>
  );
}
