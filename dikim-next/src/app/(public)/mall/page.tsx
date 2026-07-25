import '@/app/mall.css';

export default function BoutiquePage() {
  const items = [
    'b01.jpg', 'b1.jpg', 'b2.jpg', 'b03.jpg',
    'b3.jpg', 'b4.jpg', 'b5.jpg', 'b6.jpg',
    'b7.jpg', 'b8.jpg', 'b9.jpg',
  ];

  return (
    <section className="picture-grid" data-reveal="fade">
      <div className="section-eyebrow">Shop</div>
      <h1 className="heading">Boutique</h1>
      <p className="token">
        A handpicked selection of stylish clothes, accessories, and unique finds — perfect for gifts or treating yourself.
      </p>

      <div className="grid-container">
        {items.map((item, idx) => (
          <div className="grid-item" key={idx}>
            <img src={`/images/${item}`} alt={`Boutique item ${idx + 1}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
