import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import '@/styles/paymentform.css';

interface Room {
  id: number;
  name: string;
  price: number;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function BookingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Load active rooms from Supabase
  useEffect(() => {
    async function loadRooms() {
      // Check if Supabase env credentials are still default placeholders
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
        console.log('Supabase has not been configured. Loading default static categories.');
        setRooms([
          { id: 1, name: 'Small Room', price: 10000 },
          { id: 2, name: 'Family Room', price: 15000 },
          { id: 3, name: 'Exclusive Suite', price: 20000 },
          { id: 4, name: 'Executive Suite', price: 25000 },
          { id: 5, name: 'Executive Suite II', price: 30000 }
        ]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('id, name, price')
          .order('price', { ascending: true });

        if (error) throw error;
        if (data) setRooms(data);
      } catch (err) {
        console.error('Error fetching room categories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, []);

  // Update form price when selected room changes
  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomName = e.target.value;
    setSelectedRoomName(roomName);
    const room = rooms.find(r => r.name === roomName);
    if (room) {
      setAmount(room.price);
    } else {
      setAmount('');
    }
  };

  const handleBooking = () => {
    if (!name || !email || !selectedRoomName || !amount || !arrivalDate) {
      alert('Please fill in all fields.');
      return;
    }

    if (typeof window === 'undefined' || !window.PaystackPop) {
      alert('Paystack SDK is still loading. Please try again in a moment.');
      return;
    }

    const paystackAmount = amount * 100; // Convert Naira to kobo

    const paystack = new window.PaystackPop();
    paystack.newTransaction({
      key: 'pk_test_ff9bbe45e79d4b4251701f919281da84ac9661fd',
      email: email,
      amount: paystackAmount,
      currency: 'NGN',
      ref: 'TX' + Math.floor(Math.random() * 1000000000 + 1),
      onSuccess: function (response: any) {
        // Fetch to local Next.js verification API route
        fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: response.reference,
            name: name,
            email: email,
            room: selectedRoomName,
            amount: amount,
            arrival_date: arrivalDate,
          }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert('Booking and payment verified successfully!');
              setName('');
              setEmail('');
              setSelectedRoomName('');
              setAmount('');
              setArrivalDate('');
            } else {
              alert('Payment verification failed: ' + data.message);
            }
          })
          .catch(error => {
            console.error('Error verifying payment:', error);
            alert('An error occurred while verifying the payment. Contact support.');
          });
      },
      onCancel: function () {
        alert('Transaction was not completed.');
      },
    });
  };

  return (
    <div className="payform-container">
<div className="payform" data-reveal="fade">
        <div className="section-eyebrow">Reservations</div>
        <h2>Book a Room</h2>
        <p>Select your suite and complete a secure booking in minutes.</p>
        <form id="paymentForm" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />

          <select 
            value={selectedRoomName} 
            onChange={handleRoomChange} 
            required
            disabled={loading}
          >
            <option value="" disabled>
              {loading ? 'Loading rooms...' : 'Select a Room'}
            </option>
            {rooms.map(room => (
              <option key={room.id} value={room.name}>
                {room.name} - ₦{room.price.toLocaleString()}
              </option>
            ))}
          </select>

          <input 
            type="number" 
            placeholder="Amount (₦)" 
            value={amount} 
            required 
            readOnly 
          />

          <label className="payform-label" htmlFor="arrivalDate">Arrival Date</label>
          <input
            type="date"
            id="arrivalDate"
            value={arrivalDate}
            onChange={(e) => setArrivalDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          
          <button type="button" onClick={handleBooking}>
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}
