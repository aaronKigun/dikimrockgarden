import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { downloadBookingsPdf, buildBookingsPdf } from '@/lib/downloadBookingsPdf';
import '@/styles/admin.css';

interface Transaction {
  id: number;
  name: string;
  email: string;
  room: string;
  amount: number;
  reference: string;
  status: string;
  arrival_date?: string | null;
  created_at: string;
}

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

interface BoutiqueItem {
  id: number;
  title: string;
  image_path: string;
}

interface Feedback {
  id: number;
  guest_name: string;
  message: string;
  rating: number;
  photo_path: string | null;
  is_published: boolean;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'rooms' | 'gallery' | 'boutique' | 'feedbacks' | 'messages'>('overview');
  
  // Lists data states
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [boutique, setBoutique] = useState<BoutiqueItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState({ total_revenue: 0, total_bookings: 0, total_rooms: 0, total_gallery: 0, total_boutique: 0, total_feedbacks: 0, total_messages: 0 });

  // UI state controllers
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; isError: boolean } | null>(null);
  const [sharingBookings, setSharingBookings] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Modal forms controller states
  const [activeModal, setActiveModal] = useState<'addRoom' | 'editRoom' | 'addGallery' | 'addBoutique' | 'editBoutique' | 'addFeedback' | 'editFeedback' | null>(null);

  // Forms inputs states
  const [roomName, setRoomName] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomRating, setRoomRating] = useState('4.5');
  const [roomImageFile, setRoomImageFile] = useState<File | null>(null);

  const [editRoomId, setEditRoomId] = useState<number | null>(null);
  const [editRoomName, setEditRoomName] = useState('');
  const [editRoomPrice, setEditRoomPrice] = useState('');
  const [editRoomRating, setEditRoomRating] = useState('');
  const [editRoomImageFile, setEditRoomImageFile] = useState<File | null>(null);

  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);

  const [boutiqueTitle, setBoutiqueTitle] = useState('');
  const [boutiqueImageFile, setBoutiqueImageFile] = useState<File | null>(null);
  const [editBoutiqueId, setEditBoutiqueId] = useState<number | null>(null);
  const [editBoutiqueTitle, setEditBoutiqueTitle] = useState('');
  const [editBoutiqueImageFile, setEditBoutiqueImageFile] = useState<File | null>(null);

  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState('5');
  const [feedbackPublished, setFeedbackPublished] = useState(true);
  const [feedbackImageFile, setFeedbackImageFile] = useState<File | null>(null);
  const [editFeedbackId, setEditFeedbackId] = useState<number | null>(null);
  const [editFeedbackName, setEditFeedbackName] = useState('');
  const [editFeedbackMessage, setEditFeedbackMessage] = useState('');
  const [editFeedbackRating, setEditFeedbackRating] = useState('5');
  const [editFeedbackPublished, setEditFeedbackPublished] = useState(true);
  const [editFeedbackImageFile, setEditFeedbackImageFile] = useState<File | null>(null);
  const [editFeedbackPhotoPath, setEditFeedbackPhotoPath] = useState('/images/about.jpg');

  // Session verification and initial loaders
  useEffect(() => {
    async function checkAuthAndLoad() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      } else {
        setAdminUser(session.user);
        await loadDashboardData();
      }
    }
    checkAuthAndLoad();
  }, [navigate]);

  // Display automatic notification toast alerts
  const triggerToast = (msg: string, isErr = false) => {
    setToast({ message: msg, isError: isErr });
    setTimeout(() => setToast(null), 3500);
  };

  // Logout admin
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      triggerToast('Logout failed: ' + error.message, true);
    } else {
      navigate('/admin/login');
    }
  };

  // Query stats, transactions, rooms, and gallery details from Supabase
  const loadDashboardData = async () => {
    // Verify credentials first
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
      triggerToast('Supabase is not configured yet. Set keys in .env.local', true);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch transactions
      const { data: txData, error: txErr } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (txErr) throw txErr;

      // 2. Fetch rooms
      const { data: roomsData, error: roomsErr } = await supabase
        .from('rooms')
        .select('*')
        .order('id', { ascending: false });

      if (roomsErr) throw roomsErr;

      // 3. Fetch gallery items
      const { data: galleryData, error: galleryErr } = await supabase
        .from('gallery')
        .select('*')
        .order('id', { ascending: false });

      if (galleryErr) throw galleryErr;

      // 4. Boutique (optional until SQL is run)
      const { data: boutiqueData, error: boutiqueErr } = await supabase
        .from('boutique_items')
        .select('*')
        .order('id', { ascending: true });

      if (boutiqueErr) {
        console.warn('Boutique table unavailable:', boutiqueErr.message);
      }

      // 5. Feedbacks (optional until SQL is run)
      const { data: feedbackData, error: feedbackErr } = await supabase
        .from('feedbacks')
        .select('*')
        .order('id', { ascending: false });

      if (feedbackErr) {
        console.warn('Feedbacks table unavailable:', feedbackErr.message);
      }

      const { data: messagesData, error: messagesErr } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesErr) {
        console.warn('Contact messages unavailable:', messagesErr.message);
      }

      // Set data lists
      const listTx = txData || [];
      const listRooms = roomsData || [];
      const listGallery = galleryData || [];
      const listBoutique = boutiqueData || [];
      const listFeedbacks = feedbackData || [];
      const listMessages = messagesData || [];
      setTransactions(listTx);
      setRooms(listRooms);
      setGallery(listGallery);
      setBoutique(listBoutique);
      setFeedbacks(listFeedbacks);
      setContactMessages(listMessages);

      // Compute statistics summary indicators
      const verifiedTx = listTx.filter((t: any) => t.status === 'success');
      const totalRev = verifiedTx.reduce((sum: number, t: any) => sum + parseFloat(t.amount || 0), 0);

      setStats({
        total_revenue: totalRev,
        total_bookings: verifiedTx.length,
        total_rooms: listRooms.length,
        total_gallery: listGallery.length,
        total_boutique: listBoutique.length,
        total_feedbacks: listFeedbacks.length,
        total_messages: listMessages.length,
      });
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      triggerToast('Database query error: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // Helper to upload images to Supabase Storage bucket 'dikim-images'
  const uploadImageToStorage = async (file: File, folder: 'rooms' | 'gallery' | 'boutique' | 'feedbacks'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('dikim-images')
      .upload(filePath, file);

    if (uploadError) {
      // If bucket is missing or unconfigured, log warning and request user setup
      console.warn('Storage bucket upload failed, check if "dikim-images" bucket exists in Supabase Storage dashboard.', uploadError);
      throw new Error('Storage bucket upload failed. Ensure a public bucket named "dikim-images" is created in Supabase.');
    }

    const { data } = supabase.storage
      .from('dikim-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // 1. ADD ROOM SUBMIT
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName || !roomPrice || !roomImageFile) {
      triggerToast('Please complete all form fields.', true);
      return;
    }

    try {
      // Upload image to storage bucket
      const imageUrl = await uploadImageToStorage(roomImageFile, 'rooms');

      // Insert record
      const { error } = await supabase.from('rooms').insert([
        {
          name: roomName,
          price: parseFloat(roomPrice),
          rating: parseFloat(roomRating || '4.5'),
          image_path: imageUrl
        }
      ]);

      if (error) throw error;

      triggerToast('Room package created successfully!');
      setActiveModal(null);
      setRoomName('');
      setRoomPrice('');
      setRoomRating('4.5');
      setRoomImageFile(null);
      await loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || 'Failed to add room package.', true);
    }
  };

  // 2. EDIT ROOM MODAL INITIALIZER
  const triggerEditRoom = (room: Room) => {
    setEditRoomId(room.id);
    setEditRoomName(room.name);
    setEditRoomPrice(room.price.toString());
    setEditRoomRating(room.rating.toString());
    setEditRoomImageFile(null);
    setActiveModal('editRoom');
  };

  // 3. EDIT ROOM SUBMIT
  const handleEditRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRoomId || !editRoomName || !editRoomPrice) {
      triggerToast('Please complete the room name and price.', true);
      return;
    }

    try {
      let imageUrl = '';
      if (editRoomImageFile) {
        imageUrl = await uploadImageToStorage(editRoomImageFile, 'rooms');
      }

      const updatePayload: any = {
        name: editRoomName,
        price: parseFloat(editRoomPrice),
        rating: parseFloat(editRoomRating || '4.5')
      };

      if (imageUrl) {
        updatePayload.image_path = imageUrl;
      }

      const { error } = await supabase
        .from('rooms')
        .update(updatePayload)
        .eq('id', editRoomId);

      if (error) throw error;

      triggerToast('Room details updated successfully!');
      setActiveModal(null);
      await loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || 'Failed to update room detail.', true);
    }
  };

  // 4. DELETE ROOM
  const handleDeleteRoom = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the room "${name}"?`)) return;

    try {
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      if (error) throw error;

      triggerToast(`Room package "${name}" deleted.`);
      await loadDashboardData();
    } catch (err: any) {
      triggerToast('Failed to delete room: ' + err.message, true);
    }
  };

  // 5. ADD GALLERY SUBMIT
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryImageFile) {
      triggerToast('Please upload a gallery photo.', true);
      return;
    }

    try {
      const imageUrl = await uploadImageToStorage(galleryImageFile, 'gallery');

      const { error } = await supabase.from('gallery').insert([
        {
          caption: galleryCaption || 'Gallery Photo',
          image_path: imageUrl
        }
      ]);

      if (error) throw error;

      triggerToast('Gallery item uploaded successfully!');
      setActiveModal(null);
      setGalleryCaption('');
      setGalleryImageFile(null);
      await loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || 'Failed to upload gallery item.', true);
    }
  };

  // 6. DELETE GALLERY ITEM
  const handleDeleteGallery = async (id: number) => {
    if (!confirm('Are you sure you want to remove this photo from the gallery?')) return;

    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;

      triggerToast('Gallery item removed.');
      await loadDashboardData();
    } catch (err: any) {
      triggerToast('Failed to delete gallery item: ' + err.message, true);
    }
  };

  const handleAddBoutique = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boutiqueTitle || !boutiqueImageFile) {
      triggerToast('Please add a title and photo.', true);
      return;
    }
    try {
      const imageUrl = await uploadImageToStorage(boutiqueImageFile, 'boutique');
      const { error } = await supabase.from('boutique_items').insert([
        { title: boutiqueTitle, image_path: imageUrl },
      ]);
      if (error) throw error;
      triggerToast('Boutique item added!');
      setActiveModal(null);
      setBoutiqueTitle('');
      setBoutiqueImageFile(null);
      await loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || 'Failed to add boutique item.', true);
    }
  };

  const triggerEditBoutique = (item: BoutiqueItem) => {
    setEditBoutiqueId(item.id);
    setEditBoutiqueTitle(item.title);
    setEditBoutiqueImageFile(null);
    setActiveModal('editBoutique');
  };

  const handleEditBoutiqueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBoutiqueId || !editBoutiqueTitle) return;
    try {
      const payload: { title: string; image_path?: string } = { title: editBoutiqueTitle };
      if (editBoutiqueImageFile) {
        payload.image_path = await uploadImageToStorage(editBoutiqueImageFile, 'boutique');
      }
      const { error } = await supabase.from('boutique_items').update(payload).eq('id', editBoutiqueId);
      if (error) throw error;
      triggerToast('Boutique item updated.');
      setActiveModal(null);
      await loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || 'Failed to update boutique item.', true);
    }
  };

  const handleDeleteBoutique = async (id: number, title: string) => {
    if (!confirm(`Remove boutique item "${title}"?`)) return;
    try {
      const { error } = await supabase.from('boutique_items').delete().eq('id', id);
      if (error) throw error;
      triggerToast('Boutique item removed.');
      await loadDashboardData();
    } catch (err: any) {
      triggerToast('Failed to delete boutique item: ' + err.message, true);
    }
  };

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackMessage) {
      triggerToast('Please enter guest name and message.', true);
      return;
    }
    try {
      let photoPath = '/images/about.jpg';
      if (feedbackImageFile) {
        photoPath = await uploadImageToStorage(feedbackImageFile, 'feedbacks');
      }
      const { error } = await supabase.from('feedbacks').insert([
        {
          guest_name: feedbackName,
          message: feedbackMessage,
          rating: parseFloat(feedbackRating || '5'),
          photo_path: photoPath,
          is_published: feedbackPublished,
        },
      ]);
      if (error) throw error;
      triggerToast('Feedback added to homepage reviews!');
      setActiveModal(null);
      setFeedbackName('');
      setFeedbackMessage('');
      setFeedbackRating('5');
      setFeedbackPublished(true);
      setFeedbackImageFile(null);
      await loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || 'Failed to add feedback.', true);
    }
  };

  const triggerEditFeedback = (fb: Feedback) => {
    setEditFeedbackId(fb.id);
    setEditFeedbackName(fb.guest_name);
    setEditFeedbackMessage(fb.message);
    setEditFeedbackRating(String(fb.rating));
    setEditFeedbackPublished(fb.is_published);
    setEditFeedbackPhotoPath(fb.photo_path || '/images/about.jpg');
    setEditFeedbackImageFile(null);
    setActiveModal('editFeedback');
  };

  const handleEditFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFeedbackId || !editFeedbackName || !editFeedbackMessage) return;
    try {
      let photoPath = editFeedbackPhotoPath;
      if (editFeedbackImageFile) {
        photoPath = await uploadImageToStorage(editFeedbackImageFile, 'feedbacks');
      }
      const { error } = await supabase
        .from('feedbacks')
        .update({
          guest_name: editFeedbackName,
          message: editFeedbackMessage,
          rating: parseFloat(editFeedbackRating || '5'),
          photo_path: photoPath,
          is_published: editFeedbackPublished,
        })
        .eq('id', editFeedbackId);
      if (error) throw error;
      triggerToast('Feedback updated.');
      setActiveModal(null);
      await loadDashboardData();
    } catch (err: any) {
      triggerToast(err.message || 'Failed to update feedback.', true);
    }
  };

  const handleDeleteFeedback = async (id: number, name: string) => {
    if (!confirm(`Delete feedback from "${name}"?`)) return;
    try {
      const { error } = await supabase.from('feedbacks').delete().eq('id', id);
      if (error) throw error;
      triggerToast('Feedback removed.');
      await loadDashboardData();
    } catch (err: any) {
      triggerToast('Failed to delete feedback: ' + err.message, true);
    }
  };

  const handleDeleteContactMessage = async (id: number) => {
    if (!confirm('Delete this contact message?')) return;
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      triggerToast('Message deleted.');
      await loadDashboardData();
    } catch (err: any) {
      triggerToast('Failed to delete message: ' + err.message, true);
    }
  };

  // Booking transactions search filter logic
  const filteredTransactions = transactions.filter(tx => {
    const term = searchQuery.toLowerCase();
    return (
      tx.name.toLowerCase().includes(term) ||
      tx.email.toLowerCase().includes(term) ||
      tx.room.toLowerCase().includes(term) ||
      tx.reference.toLowerCase().includes(term) ||
      tx.status.toLowerCase().includes(term)
    );
  });

  const handleDownloadBookingsPdf = async () => {
    if (filteredTransactions.length === 0) {
      triggerToast('No bookings to download.', true);
      return;
    }

    setDownloadingPdf(true);
    try {
      await downloadBookingsPdf(filteredTransactions);
      triggerToast(`Downloaded PDF with ${filteredTransactions.length} booking(s).`);
    } catch (err: any) {
      console.error('PDF download failed:', err);
      triggerToast(err?.message || 'Failed to generate PDF.', true);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleShareBookingsEmail = async () => {
    if (filteredTransactions.length === 0) {
      triggerToast('No bookings to share.', true);
      return;
    }

    setSharingBookings(true);
    try {
      const { filename, base64 } = await buildBookingsPdf(filteredTransactions);
      const res = await fetch('/api/share-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookings: filteredTransactions,
          pdfBase64: base64,
          filename,
          sharedBy: adminUser?.email || '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to share bookings list.');
      }
      triggerToast(data.message || 'Bookings list emailed to dikimrockgarden@gmail.com');
    } catch (err: any) {
      console.error('Share bookings failed:', err);
      triggerToast(err?.message || 'Failed to email bookings list.', true);
    } finally {
      setSharingBookings(false);
    }
  };

  if (!adminUser) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.8rem', background: 'var(--off-white)', color: 'var(--gray)' }}>
        Authenticating session...
      </div>
    );
  }

  return (
    <div className="admin-body">
      
      {/* Toast Alert Notification Popup */}
      {toast && (
        <div id="toastAlert" className={`alert-toast active ${toast.isError ? 'error' : ''}`}>
          <i className={`fas ${toast.isError ? 'fa-circle-xmark' : 'fa-circle-check'}`}></i> 
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="admin-header">
        <div className="logo-container">
          <img src="/images/Reallogo.jpg" alt="Dikim Rock Garden Logo" />
          <h1>Dikim Portal</h1>
        </div>
        <div className="user-menu">
          <span>
            <i className="fas fa-user-shield"></i> Active Admin:{' '}
            <strong>{adminUser.email}</strong>
          </span>
          <button className="btn-logout" onClick={handleLogout} style={{ cursor: 'pointer', border: 'none' }}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      {/* Dashboard Workspace */}
      <main className="admin-container">
        
        {/* Navigation Tabs */}
        <nav className="admin-tabs">
          <button 
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} 
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-chart-line"></i> Overview
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} 
            onClick={() => setActiveTab('bookings')}
          >
            <i className="fas fa-receipt"></i> Bookings &amp; Payments
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'rooms' ? 'active' : ''}`} 
            onClick={() => setActiveTab('rooms')}
          >
            <i className="fas fa-bed"></i> Lodging Rooms
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`} 
            onClick={() => setActiveTab('gallery')}
          >
            <i className="fas fa-images"></i> Photo Gallery
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'boutique' ? 'active' : ''}`}
            onClick={() => setActiveTab('boutique')}
          >
            <i className="fas fa-bag-shopping"></i> Boutique
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'feedbacks' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedbacks')}
          >
            <i className="fas fa-comments"></i> Feedbacks
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <i className="fas fa-envelope"></i> Messages
          </button>
        </nav>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <section id="overview" className="admin-panel active">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Total Sales</h3>
                  <div className="stat-value">₦{stats.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="stat-icon"><i className="fas fa-wallet"></i></div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Verified Bookings</h3>
                  <div className="stat-value">{stats.total_bookings}</div>
                </div>
                <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Lodging Options</h3>
                  <div className="stat-value">{stats.total_rooms}</div>
                </div>
                <div className="stat-icon"><i className="fas fa-door-open"></i></div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Gallery Photos</h3>
                  <div className="stat-value">{stats.total_gallery}</div>
                </div>
                <div className="stat-icon"><i className="fas fa-image"></i></div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Boutique Items</h3>
                  <div className="stat-value">{stats.total_boutique}</div>
                </div>
                <div className="stat-icon"><i className="fas fa-bag-shopping"></i></div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Guest Feedbacks</h3>
                  <div className="stat-value">{stats.total_feedbacks}</div>
                </div>
                <div className="stat-icon"><i className="fas fa-comments"></i></div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <h3>Contact Messages</h3>
                  <div className="stat-value">{stats.total_messages}</div>
                </div>
                <div className="stat-icon"><i className="fas fa-envelope"></i></div>
              </div>
            </div>

            <div className="panel-card">
              <div className="panel-card-header">
                <h2>Recent Transactions</h2>
                <button className="btn-primary-sm" onClick={() => setActiveTab('bookings')}>
                  View All Bookings <i className="fas fa-arrow-right"></i>
                </button>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                     <tr>
                        <th>Guest Name</th>
                        <th>Room Type</th>
                        <th>Arrival</th>
                        <th>Price Paid</th>
                        <th>Paystack Reference</th>
                        <th>Status</th>
                        <th>Date &amp; Time</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                       <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>Querying database...</td></tr>
                     ) : transactions.length === 0 ? (
                       <tr><td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>No transactions found.</td></tr>
                     ) : (
                       transactions.slice(0, 5).map(tx => (
                         <tr key={tx.id}>
                           <td><strong>{tx.name}</strong><br /><span style={{ fontSize: '1.2rem', color: 'var(--gray)' }}>{tx.email}</span></td>
                           <td>{tx.room}</td>
                           <td>{tx.arrival_date ? new Date(tx.arrival_date).toLocaleDateString() : '—'}</td>
                           <td><strong>₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></td>
                           <td><code style={{ fontFamily: 'monospace', fontSize: '1.3rem' }}>{tx.reference}</code></td>
                           <td><span className={`badge ${tx.status === 'success' ? 'success' : 'failed'}`}>{tx.status}</span></td>
                           <td>{new Date(tx.created_at).toLocaleString()}</td>
                         </tr>
                       ))
                     )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: BOOKINGS */}
        {activeTab === 'bookings' && (
          <section id="bookings" className="admin-panel active">
            <div className="panel-card">
              <div className="panel-card-header">
                <h2>All Room Bookings &amp; Transactions</h2>
                <div className="bookings-toolbar">
                  <div className="search-bar">
                    <i className="fas fa-search"></i>
                    <input 
                      type="text" 
                      placeholder="Search guests, rooms, references..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-primary-sm"
                    onClick={handleDownloadBookingsPdf}
                    disabled={filteredTransactions.length === 0 || downloadingPdf}
                    title="Download bookings as a branded PDF"
                  >
                    <i className="fas fa-file-pdf"></i>{' '}
                    {downloadingPdf ? 'Preparing…' : 'Download PDF'}
                  </button>
                  <button
                    type="button"
                    className="btn-primary-sm"
                    onClick={handleShareBookingsEmail}
                    disabled={filteredTransactions.length === 0 || sharingBookings}
                    title="Email this bookings list to dikimrockgarden@gmail.com"
                    style={{ background: 'var(--grad-dark)' }}
                  >
                    <i className="fas fa-share-nodes"></i>{' '}
                    {sharingBookings ? 'Sending…' : 'Email to Dikim'}
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                     <tr>
                        <th>ID</th>
                        <th>Guest Info</th>
                        <th>Booked Room</th>
                        <th>Arrival Date</th>
                        <th>Amount</th>
                        <th>Payment Reference</th>
                        <th>Payment Status</th>
                        <th>Created At</th>
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                       <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>Querying database...</td></tr>
                     ) : filteredTransactions.length === 0 ? (
                       <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>No transactions match search query.</td></tr>
                     ) : (
                       filteredTransactions.map(tx => (
                         <tr key={tx.id}>
                           <td>{tx.id}</td>
                           <td>
                             <strong>{tx.name}</strong><br />
                             <a href={`mailto:${tx.email}`} style={{ fontSize: '1.2rem', color: 'var(--g600)' }}>{tx.email}</a>
                           </td>
                           <td>{tx.room}</td>
                           <td>{tx.arrival_date ? new Date(tx.arrival_date).toLocaleDateString() : '—'}</td>
                           <td><strong>₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></td>
                           <td><code style={{ fontFamily: 'monospace', fontSize: '1.3rem' }}>{tx.reference}</code></td>
                           <td><span className={`badge ${tx.status === 'success' ? 'success' : 'failed'}`}>{tx.status}</span></td>
                           <td>{new Date(tx.created_at).toLocaleString()}</td>
                         </tr>
                       ))
                     )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: ROOMS */}
        {activeTab === 'rooms' && (
          <section id="rooms" className="admin-panel active">
            <div className="panel-card">
              <div className="panel-card-header">
                <h2>Manage Lodging Rooms</h2>
                <button className="btn-primary-sm" onClick={() => setActiveModal('addRoom')}>
                  <i className="fas fa-plus"></i> Add New Room
                </button>
              </div>
              
              <div className="admin-grid">
                {loading ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--gray)', padding: '5rem 0' }}>Loading rooms data...</div>
                ) : rooms.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--gray)', padding: '5rem 0' }}>No rooms stored. Add a room to get started.</div>
                ) : (
                  rooms.map(room => {
                    const fullStars = Math.floor(room.rating || 4.5);
                    const halfStar = (room.rating - fullStars) >= 0.5 ? 1 : 0;
                    return (
                      <div className="admin-grid-card" key={room.id}>
                        <img src={room.image_path} alt={room.name} className="card-img" onError={(e: any) => e.target.src = '/images/smallroom.jpg'} />
                        <div className="card-body">
                          <h3>{room.name}</h3>
                          <div className="price">₦{room.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                          <div className="rating">
                            {Array.from({ length: fullStars }).map((_, i) => <i key={i} className="fas fa-star"></i>)}
                            {halfStar === 1 && <i className="fas fa-star-half-alt"></i>}
                            {Array.from({ length: 5 - fullStars - halfStar }).map((_, i) => <i key={i} className="far fa-star"></i>)}
                            <span style={{ color: 'var(--gray)', fontSize: '1.2rem', marginLeft: '0.5rem' }}>({room.rating.toFixed(1)})</span>
                          </div>
                        </div>
                        <div className="card-actions">
                          <button className="btn-edit" onClick={() => triggerEditRoom(room)}>
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteRoom(room.id, room.name)}>
                            <i className="fas fa-trash-alt"></i> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: GALLERY */}
        {activeTab === 'gallery' && (
          <section id="gallery" className="admin-panel active">
            <div className="panel-card">
              <div className="panel-card-header">
                <h2>Manage Photo Gallery</h2>
                <button className="btn-primary-sm" onClick={() => setActiveModal('addGallery')}>
                  <i className="fas fa-plus"></i> Add Gallery Image
                </button>
              </div>
              
              <div className="admin-grid">
                {loading ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--gray)', padding: '5rem 0' }}>Loading gallery photos...</div>
                ) : gallery.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--gray)', padding: '5rem 0' }}>No gallery items. Add some photos to show on your website.</div>
                ) : (
                  gallery.map(item => (
                    <div className="admin-grid-card" key={item.id}>
                      <img src={item.image_path} alt={item.caption} className="card-img" style={{ height: '22rem' }} />
                      <div className="card-body">
                        <div className="caption">{item.caption || 'No Caption'}</div>
                      </div>
                      <div className="card-actions">
                        <button className="btn-delete" style={{ width: '100%', textAlign: 'center' }} onClick={() => handleDeleteGallery(item.id)}>
                          <i className="fas fa-trash-alt"></i> Delete Gallery Item
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* TAB 5: BOUTIQUE */}
        {activeTab === 'boutique' && (
          <section id="boutique" className="admin-panel active">
            <div className="panel-card">
              <div className="panel-card-header">
                <h2>Manage Boutique</h2>
                <button
                  className="btn-primary-sm"
                  onClick={() => {
                    setBoutiqueTitle('');
                    setBoutiqueImageFile(null);
                    setActiveModal('addBoutique');
                  }}
                >
                  <i className="fas fa-plus"></i> Add Boutique Item
                </button>
              </div>
              <div className="admin-grid">
                {loading ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--gray)', padding: '5rem 0' }}>Loading boutique…</div>
                ) : boutique.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--gray)', padding: '5rem 0' }}>
                    No boutique items yet. Run setup_boutique_feedbacks.sql in Supabase, then add or edit items here.
                  </div>
                ) : (
                  boutique.map((item) => (
                    <div className="admin-grid-card" key={item.id}>
                      <img src={item.image_path} alt={item.title} className="card-img" style={{ height: '22rem' }} />
                      <div className="card-body">
                        <h3>{item.title}</h3>
                      </div>
                      <div className="card-actions">
                        <button className="btn-edit" onClick={() => triggerEditBoutique(item)}>
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteBoutique(item.id, item.title)}>
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* TAB 6: FEEDBACKS */}
        {activeTab === 'feedbacks' && (
          <section id="feedbacks" className="admin-panel active">
            <div className="panel-card">
              <div className="panel-card-header">
                <h2>Homepage Guest Feedbacks</h2>
                <button
                  className="btn-primary-sm"
                  onClick={() => {
                    setFeedbackName('');
                    setFeedbackMessage('');
                    setFeedbackRating('5');
                    setFeedbackPublished(true);
                    setFeedbackImageFile(null);
                    setActiveModal('addFeedback');
                  }}
                >
                  <i className="fas fa-plus"></i> Add Feedback
                </button>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Message</th>
                      <th>Rating</th>
                      <th>Published</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>Loading feedbacks…</td></tr>
                    ) : feedbacks.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
                          No feedbacks yet. Run setup_boutique_feedbacks.sql, then add reviews here to show on the homepage.
                        </td>
                      </tr>
                    ) : (
                      feedbacks.map((fb) => (
                        <tr key={fb.id}>
                          <td>
                            <strong>{fb.guest_name}</strong>
                            <br />
                            <img
                              src={fb.photo_path || '/images/about.jpg'}
                              alt=""
                              style={{ width: '4rem', height: '4rem', borderRadius: '50%', objectFit: 'cover', marginTop: '0.6rem' }}
                            />
                          </td>
                          <td style={{ maxWidth: '36rem' }}>{fb.message}</td>
                          <td>{Number(fb.rating).toFixed(1)} ★</td>
                          <td>
                            <span className={`badge ${fb.is_published ? 'success' : 'failed'}`}>
                              {fb.is_published ? 'Live' : 'Hidden'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                              <button className="btn-edit" onClick={() => triggerEditFeedback(fb)}>
                                <i className="fas fa-edit"></i> Edit
                              </button>
                              <button className="btn-delete" onClick={() => handleDeleteFeedback(fb.id, fb.guest_name)}>
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'messages' && (
          <section id="messages" className="admin-panel active">
            <div className="panel-card">
              <div className="panel-card-header">
                <h2>Contact Form Messages</h2>
                <p style={{ margin: 0, fontSize: '1.35rem', color: 'var(--gray)' }}>
                  Also emailed to dikimrockgarden@gmail.com when the API is running.
                </p>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th>Received</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>Loading messages…</td></tr>
                    ) : contactMessages.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
                          No contact messages yet.
                        </td>
                      </tr>
                    ) : (
                      contactMessages.map((msg) => (
                        <tr key={msg.id}>
                          <td>
                            <strong>{msg.name}</strong>
                            <br />
                            <a href={`mailto:${msg.email}`} style={{ fontSize: '1.2rem', color: 'var(--g600)' }}>
                              {msg.email}
                            </a>
                          </td>
                          <td>{msg.subject || '—'}</td>
                          <td style={{ maxWidth: '36rem', whiteSpace: 'pre-wrap' }}>{msg.message}</td>
                          <td>{new Date(msg.created_at).toLocaleString()}</td>
                          <td>
                            <button className="btn-delete" onClick={() => handleDeleteContactMessage(msg.id)}>
                              <i className="fas fa-trash-alt"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ===== MODAL 1: ADD ROOM ===== */}
      {activeModal === 'addRoom' && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Lodging Room</h3>
              <button className="btn-close" onClick={() => setActiveModal(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddRoom}>
                <div className="form-group">
                  <label htmlFor="room_name">Room Name / Title</label>
                  <input type="text" id="room_name" value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="e.g., Luxury Honeymoon Suite" required />
                </div>
                <div className="form-group">
                  <label htmlFor="room_price">Price Per Night (₦)</label>
                  <input type="number" id="room_price" value={roomPrice} onChange={(e) => setRoomPrice(e.target.value)} placeholder="e.g., 25000" min="1" step="0.01" required />
                </div>
                <div className="form-group">
                  <label htmlFor="room_rating">Guest Rating (1.0 to 5.0)</label>
                  <input type="number" id="room_rating" value={roomRating} onChange={(e) => setRoomRating(e.target.value)} min="1.0" max="5.0" step="0.1" required />
                </div>
                <div className="form-group">
                  <label htmlFor="room_image">Room Display Photo</label>
                  <input type="file" id="room_image" onChange={(e) => setRoomImageFile(e.target.files?.[0] || null)} accept="image/*" required />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn-submit">Add Room</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL 2: EDIT ROOM ===== */}
      {activeModal === 'editRoom' && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Room Details</h3>
              <button className="btn-close" onClick={() => setActiveModal(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditRoomSubmit}>
                <div className="form-group">
                  <label htmlFor="edit_room_name">Room Name / Title</label>
                  <input type="text" id="edit_room_name" value={editRoomName} onChange={(e) => setEditRoomName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_room_price">Price Per Night (₦)</label>
                  <input type="number" id="edit_room_price" value={editRoomPrice} onChange={(e) => setEditRoomPrice(e.target.value)} min="1" step="0.01" required />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_room_rating">Guest Rating (1.0 to 5.0)</label>
                  <input type="number" id="edit_room_rating" value={editRoomRating} onChange={(e) => setEditRoomRating(e.target.value)} min="1.0" max="5.0" step="0.1" required />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_room_image">Change Display Photo (Leave blank to keep current)</label>
                  <input type="file" id="edit_room_image" onChange={(e) => setEditRoomImageFile(e.target.files?.[0] || null)} accept="image/*" />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn-submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL 3: ADD GALLERY ===== */}
      {activeModal === 'addGallery' && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Photo to Gallery</h3>
              <button className="btn-close" onClick={() => setActiveModal(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddGallery}>
                <div className="form-group">
                  <label htmlFor="gallery_caption">Image Caption / Tagline</label>
                  <input type="text" id="gallery_caption" value={galleryCaption} onChange={(e) => setGalleryCaption(e.target.value)} placeholder="e.g., Garden Wedding Event" required />
                </div>
                <div className="form-group">
                  <label htmlFor="gallery_image">Upload Photo</label>
                  <input type="file" id="gallery_image" onChange={(e) => setGalleryImageFile(e.target.files?.[0] || null)} accept="image/*" required />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn-submit">Upload Photo</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'addBoutique' && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Boutique Item</h3>
              <button className="btn-close" onClick={() => setActiveModal(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddBoutique}>
                <div className="form-group">
                  <label htmlFor="boutique_title">Title</label>
                  <input type="text" id="boutique_title" value={boutiqueTitle} onChange={(e) => setBoutiqueTitle(e.target.value)} placeholder="e.g., Summer Dress" required />
                </div>
                <div className="form-group">
                  <label htmlFor="boutique_image">Photo</label>
                  <input type="file" id="boutique_image" onChange={(e) => setBoutiqueImageFile(e.target.files?.[0] || null)} accept="image/*" required />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn-submit">Add Item</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'editBoutique' && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Boutique Item</h3>
              <button className="btn-close" onClick={() => setActiveModal(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditBoutiqueSubmit}>
                <div className="form-group">
                  <label htmlFor="edit_boutique_title">Title</label>
                  <input type="text" id="edit_boutique_title" value={editBoutiqueTitle} onChange={(e) => setEditBoutiqueTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_boutique_image">Change Photo (optional)</label>
                  <input type="file" id="edit_boutique_image" onChange={(e) => setEditBoutiqueImageFile(e.target.files?.[0] || null)} accept="image/*" />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn-submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'addFeedback' && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Guest Feedback</h3>
              <button className="btn-close" onClick={() => setActiveModal(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddFeedback}>
                <div className="form-group">
                  <label htmlFor="feedback_name">Guest Name</label>
                  <input type="text" id="feedback_name" value={feedbackName} onChange={(e) => setFeedbackName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="feedback_message">Review Message</label>
                  <textarea id="feedback_message" value={feedbackMessage} onChange={(e) => setFeedbackMessage(e.target.value)} rows={4} required style={{ width: '100%', font: 'inherit', padding: '1rem', borderRadius: '0.8rem', border: '1px solid var(--g200)' }} />
                </div>
                <div className="form-group">
                  <label htmlFor="feedback_rating">Rating (1–5)</label>
                  <input type="number" id="feedback_rating" value={feedbackRating} onChange={(e) => setFeedbackRating(e.target.value)} min="1" max="5" step="0.5" required />
                </div>
                <div className="form-group">
                  <label htmlFor="feedback_photo">Guest Photo (optional)</label>
                  <input type="file" id="feedback_photo" onChange={(e) => setFeedbackImageFile(e.target.files?.[0] || null)} accept="image/*" />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input type="checkbox" checked={feedbackPublished} onChange={(e) => setFeedbackPublished(e.target.checked)} />
                    Show on homepage
                  </label>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn-submit">Add Feedback</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'editFeedback' && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Guest Feedback</h3>
              <button className="btn-close" onClick={() => setActiveModal(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditFeedbackSubmit}>
                <div className="form-group">
                  <label htmlFor="edit_feedback_name">Guest Name</label>
                  <input type="text" id="edit_feedback_name" value={editFeedbackName} onChange={(e) => setEditFeedbackName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_feedback_message">Review Message</label>
                  <textarea id="edit_feedback_message" value={editFeedbackMessage} onChange={(e) => setEditFeedbackMessage(e.target.value)} rows={4} required style={{ width: '100%', font: 'inherit', padding: '1rem', borderRadius: '0.8rem', border: '1px solid var(--g200)' }} />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_feedback_rating">Rating (1–5)</label>
                  <input type="number" id="edit_feedback_rating" value={editFeedbackRating} onChange={(e) => setEditFeedbackRating(e.target.value)} min="1" max="5" step="0.5" required />
                </div>
                <div className="form-group">
                  <label htmlFor="edit_feedback_photo">Change Photo (optional)</label>
                  <input type="file" id="edit_feedback_photo" onChange={(e) => setEditFeedbackImageFile(e.target.files?.[0] || null)} accept="image/*" />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input type="checkbox" checked={editFeedbackPublished} onChange={(e) => setEditFeedbackPublished(e.target.checked)} />
                    Show on homepage
                  </label>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn-submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
