import Link from 'next/link';

export default function CuisinePage() {
  return (
    <section className="about" id="about" style={{ marginTop: '8rem' }}>
      <div className="row" data-reveal="fade">
        <div className="image">
          <img src="/images/stick meat.jpg" alt="Stick Meat Cuisine" />
        </div>
        <div className="content">
          <div className="section-eyebrow">Our Menu</div>
          <h3>Exquisite &amp; Fine Dining</h3>
          <p>Indulge in a variety of delicious flavors with our Cuisine, featuring a mix of local favorites and mouthwatering Continental Dishes. Whether you're in the mood for a hearty meal, delicious appetizers, or eager to try something new, our menu has something to satisfy every taste.</p>
          <Link href="/contact" className="btn btn-primary">Book A Table</Link>
        </div>
      </div>
    </section>
  );
}
