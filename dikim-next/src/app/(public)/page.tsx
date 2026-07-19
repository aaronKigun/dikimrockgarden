'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface Room {
  id: number;
  name: string;
  price: number;
  image_path: string;
  rating: number;
}

interface GalleryItem {
  id: number;
  image_path: string;
  caption: string;
}

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  // Load dynamic data from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch rooms
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*')
          .order('price', { ascending: true });

        if (roomsError) throw roomsError;
        if (roomsData) setRooms(roomsData);

        // Fetch gallery
        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery')
          .select('*')
          .order('id', { ascending: false });

        if (galleryError) throw galleryError;
        if (galleryData) setGallery(galleryData);

      } catch (err) {
        console.error('Error fetching landing page data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      {/* Hero Home Slider */}
      <section className="home" id="home">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          grabCursor={true}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{ clickable: true }}
          className="home-slider"
        >
          <SwiperSlide className="slide" style={{ backgroundImage: 'url(/images/h1.jpg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="content">
              <div className="hero-pill">A Feel of Nature</div>
              <h3>Unwind In Serenity</h3>
              <p>Welcome to a sanctuary where luxury meets natural elegance. Discover our premium gardens, luxury lodging, and premier dining.</p>
              <div className="hero-btns">
                <a href="#about" className="btn btn-primary">Discover More</a>
                <Link href="/contact" className="btn btn-outline">Contact Us</Link>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="slide" style={{ backgroundImage: 'url(/images/g1.jpg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="content">
              <div className="hero-pill">Lush &amp; Vibrant Gardens</div>
              <h3>Beautiful Outdoor Venues</h3>
              <p>Host your events or simply relax in our beautifully manicured green lawns and botanical gardens.</p>
              <div className="hero-btns">
                <Link href="/gh" className="btn btn-primary">Our Garden &amp; Hall</Link>
                <Link href="/paymentform" className="btn btn-outline">Book Now</Link>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide className="slide" style={{ backgroundImage: 'url(/images/corridor.jpg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="content">
              <div className="hero-pill">Exquisite Spaces</div>
              <h3>Intoxicating Lodging &amp; Lounge</h3>
              <p>Experience lodging with maximum privacy and premium hospitality services in the heart of Jos.</p>
              <div className="hero-btns">
                <a href="#room" className="btn btn-primary">View Rooms</a>
                <Link href="/vlb" className="btn btn-outline">VIP Lounge</Link>
              </div>
            </div>
          </SwiperSlide>

          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>
      </section>

      {/* About Us */}
      <section className="about" id="about">
        <div className="row">
          <div className="image">
            <img src="/images/reception.jpg" alt="Dikim Rock Garden Reception" />
          </div>
          <div className="content">
            <div className="section-eyebrow">About Us</div>
            <h3>Nature, Luxury &amp; Entertainment</h3>
            <p>Welcome to Dikim Rock Garden, a premium destination that beautifully merges the charm of nature with modern luxury, relaxation, and high-energy entertainment. Our property offers a stunning garden oasis, a fully stocked premium bar, a VIP lounge, private club and karaoke, comfortable lodging suites, an exquisite restaurant with international and local cuisines, and event halls for rent.</p>
            <Link href="/contact" className="btn">Get in touch</Link>
          </div>
        </div>
      </section>

      {/* Lodging Suites */}
      <section className="room" id="room">
        <div className="section-eyebrow" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>Our Lodging</div>
        <h1 className="heading">LUXURIOUS SUITES</h1>
        <p className="sub-heading">Escape the daily rush and relax in our beautifully designed rooms, tailored to offer maximum comfort and absolute privacy.</p>

        <div className="swiper-container" style={{ position: 'relative' }}>
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: '1.6rem', padding: '5rem 0', color: 'var(--gray)' }}>Loading rooms packages...</div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={24}
              grabCursor={true}
              loop={rooms.length > 2}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                991: { slidesPerView: 3 },
              }}
              className="room-slider"
            >
              {rooms.length === 0 ? (
                // Fallback display
                ['Small Room', 'Family Room', 'Exclusive Suite'].map((defaultName, idx) => (
                  <SwiperSlide key={idx} className="slide">
                    <div className="image">
                      <img src={`/images/${idx === 0 ? 'smallroom' : idx === 1 ? 'familyroom' : 'mediumroom'}.jpg`} alt={defaultName} />
                    </div>
                    <div className="content">
                      <h3>{defaultName}</h3>
                      <div className="stars">
                        <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                      </div>
                      <Link href="/paymentform" className="btn">Book Now</Link>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                rooms.map((room) => {
                  const fullStars = Math.floor(room.rating || 4.5);
                  const halfStar = (room.rating - fullStars) >= 0.5 ? 1 : 0;
                  return (
                    <SwiperSlide key={room.id} className="slide">
                      <div className="image">
                        <img src={room.image_path} alt={room.name} />
                      </div>
                      <div className="content">
                        <h3>{room.name}</h3>
                        <div className="stars">
                          {Array.from({ length: fullStars }).map((_, i) => (
                            <i key={`f-${i}`} className="fas fa-star"></i>
                          ))}
                          {halfStar === 1 && <i className="fas fa-star-half-alt"></i>}
                          {Array.from({ length: 5 - fullStars - halfStar }).map((_, i) => (
                            <i key={`e-${i}`} className="far fa-star"></i>
                          ))}
                        </div>
                        <Link href="/paymentform" className="btn">Book Now</Link>
                      </div>
                    </SwiperSlide>
                  );
                })
              )}
            </Swiper>
          )}
        </div>
      </section>

      {/* Services Grid */}
      <section className="services">
        <div className="section-eyebrow" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>Experience Dikim</div>
        <h1 className="heading">PREMIUM AMENITIES</h1>
        <p className="sub-heading">Every service we offer is curated to provide the ultimate blend of comfort, elegance, and captivating fun.</p>

        <div className="box-container">
          {[
            { icon: 'fa-solid fa-bed', label: 'Accommodation' },
            { icon: 'fa-solid fa-utensils', label: 'Gourmet Food' },
            { icon: 'fa-solid fa-tree', label: 'Scenic Garden' },
            { icon: 'fa-solid fa-bag-shopping', label: 'Boutique' },
            { icon: 'fa-solid fa-couch', label: 'VIP Lounge' },
            { icon: 'fa-solid fa-martini-glass-citrus', label: 'Bar & Club' },
          ].map((item, idx) => (
            <div className="box" key={idx}>
              <div className="icon-wrap">
                <i className={item.icon}></i>
              </div>
              <h3>{item.label}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="gallery" id="gallery">
        <div className="section-eyebrow" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>Visual Tour</div>
        <h1 className="heading">OUR GALLERY</h1>
        <p className="sub-heading">Browse through our beautifully captured moments of relaxation, nature, events, and style.</p>

        <div className="swiper-container" style={{ position: 'relative' }}>
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: '1.6rem', padding: '5rem 0', color: 'var(--gray)' }}>Loading photo gallery...</div>
          ) : (
            <Swiper
              modules={[Autoplay]}
              spaceBetween={16}
              grabCursor={true}
              loop={gallery.length > 3}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                991: { slidesPerView: 4 },
              }}
              className="gallery-slider"
            >
              {gallery.length === 0 ? (
                // Fallback slides
                ['b02.jpg', 'fountain1.jpg', 'g5.jpg', 'g2.jpg'].map((img, idx) => (
                  <SwiperSlide key={idx} className="slide">
                    <img src={`/images/${img}`} alt="Gallery display" />
                    <div className="icon">
                      <i className="fas fa-magnifying-glass-plus"></i>
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                gallery.map((item) => (
                  <SwiperSlide key={item.id} className="slide">
                    <img src={item.image_path} alt={item.caption || 'Gallery photo'} />
                    <div className="icon">
                      <i className="fas fa-magnifying-glass-plus"></i>
                    </div>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          )}
        </div>
      </section>

      {/* Guest Reviews */}
      <section className="review" id="review">
        <div className="review-bg"></div>

        <div className="review-panel">
          <Swiper
            modules={[Autoplay, Pagination]}
            grabCursor={true}
            loop={true}
            autoplay={{ delay: 7000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="review-slider"
          >
            <SwiperSlide className="slide">
              <span className="big-quote">“</span>
              <h2 className="heading">HEAR FROM OUR GUESTS</h2>
              <p>If you are looking for a nice place to relax, look no further than Dikim Rock Garden. The combination of nature, VIP service, and standard security is unmatched.</p>
              <div className="user">
                <img src="/images/about.jpg" alt="Aaron Kigun" />
                <div className="user-info">
                  <h3>Aaron Kigun</h3>
                  <div className="stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide className="slide">
              <span className="big-quote">“</span>
              <h2 className="heading">HEAR FROM OUR GUESTS</h2>
              <p>If you are looking for an intoxicating picnic spot or private club environment, check out Dikim Rock Garden. Beautiful lawns and amazing staff!</p>
              <div className="user">
                <img src="/images/about.jpg" alt="Andrew Peter" />
                <div className="user-info">
                  <h3>Andrew Peter</h3>
                  <div className="stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* FAQs */}
      <section className="faqs" id="faq">
        <div className="section-eyebrow" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>Got Questions?</div>
        <h1 className="heading">FREQUENTLY ASKED QUESTIONS</h1>
        <p className="sub-heading">Find quick answers about payment options, garden availability, and general lodging rules.</p>

        <div className="row">
          <div className="image">
            <img src="/images/faq_illustration.png" alt="FAQ illustration" className="bounce" />
          </div>

          <div className="content">
            <div className={`box ${activeFaq === 0 ? 'active' : ''}`} onClick={() => toggleFaq(0)}>
              <h3>What are the payment methods? <i className="fas fa-chevron-down" style={{ display: 'none' }}></i></h3>
              <p>Through secure card payments online (via Paystack), bank transfers, or cash payments at our reception.</p>
            </div>

            <div className={`box ${activeFaq === 1 ? 'active' : ''}`} onClick={() => toggleFaq(1)}>
              <h3>Can the Garden be used for a picnic or private shoot? <i className="fas fa-chevron-down" style={{ display: 'none' }}></i></h3>
              <p>Yes, our garden is perfect for picnics, birthday shoots, weddings, and music videos. Please book a day in advance through our contact form.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
