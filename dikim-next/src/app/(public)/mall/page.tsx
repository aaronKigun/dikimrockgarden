export default function BoutiquePage() {
  const items = [
    'b01.jpg', 'b1.jpg', 'b2.jpg', 'b03.jpg', 
    'b3.jpg', 'b4.jpg', 'b5.jpg', 'b6.jpg', 
    'b7.jpg', 'b8.jpg', 'b9.jpg'
  ];

  return (
    <section className="picture-grid" data-reveal="fade" style={{ marginTop: '8rem', padding: '8rem 8%' }}>
      <h1 style={{ fontSize: '3rem', fontFamily: 'var(--ff-display)', color: 'var(--g700)', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }}>BOUTIQUE</h1>
      <p className="token" style={{ fontSize: '1.6rem', color: 'var(--gray)', textAlign: 'center', lineHeight: 1.8, marginBottom: '4rem' }}>
        Welcome to our Boutique, where you'll find a handpicked selection of stylish clothes, accessories, and unique items you won't find anywhere else.
        <br />
        Whether you're treating yourself or looking for the perfect gift, you're sure to find something special here.
      </p>
      
      <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(25rem, 1fr))', gap: '2.5rem' }}>
        {items.map((item, idx) => (
          <div className="grid-item" key={idx} style={{ overflow: 'hidden', borderRadius: 'var(--r)', boxShadow: 'var(--sh-sm)' }}>
            <img src={`/images/${item}`} alt={`Boutique item ${idx + 1}`} style={{ width: '100%', height: '30rem', objectFit: 'cover', transition: 'var(--tr)' }} />
          </div>
        ))}
      </div>
    </section>
  );
}
