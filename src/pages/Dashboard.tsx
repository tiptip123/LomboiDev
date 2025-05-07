// src/pages/Dashboard.tsx
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonModal,
  IonMenu,
  IonMenuButton,
  IonAvatar
} from '@ionic/react';
import { timeOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/SupabaseClient';
import { useHistory } from 'react-router-dom';

// Define the Item type
interface Item {
  id: string;
  name: string;
  specs?: string;
  category?: string;
  status?: string;
  image_url?: string;
  created_at?: string;
}

// Define the HistoryEntry type
interface HistoryEntry {
  id: string;
  user_id: string;
  item_id: string;
  borrowed_at?: string;
  returned_at?: string;
  status?: string;
  notes?: string;
  items?: {
    name?: string;
    image_url?: string;
  };
}

// Define the BorrowedItem type
interface BorrowedItem {
  id: string;
  user_id: string;
  item_id: string;
  borrowed_at?: string;
  returned_at?: string;
  status?: string;
  items?: {
    name?: string;
    image_url?: string;
  };
}

const Dashboard: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [myBorrowings, setMyBorrowings] = useState<BorrowedItem[]>([]);
  const [myBorrowingsLoading, setMyBorrowingsLoading] = useState(false);
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null);
  const routerHistory = useHistory();

  // Fetch items from the database
  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('items').select('*');
    if (!error) {
      const patched = (data || []).map(item => {
        switch (item.name) {
          case 'Dell XPS 15':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Dell%20XPS%2015.jpg' };
          case 'Arduino Starter Kit':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Arduino%20Starter%20Kit.jpg' };
          case 'Cisco Catalyst 2960 Switch':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Cisco%20Catalyst%202960%20Switch.jpg' };
          case 'Fiber Optic Termination Kit':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Fiber%20Optic%20Termination%20Kit.jpg' };
          case 'Fluke Networks Cable Tester':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Fluke%20Networks%20Cable%20Tester.jpg' };
          case 'HP ProCurve 2920 Switch':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//HP%20ProCurve%202920%20Switch.jpg' };
          case 'KVM Switch':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//KVM%20Switch.jpg' };
          case 'Laptop Docking Station':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Laptop%20Docking%20Station.jpg' };
          case 'Logic Analyzer':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Logic%20Analyzer.jpg' };
          case 'MacBook Pro 16"':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//MacBook%20Pro%2016.jpg' };
          case 'NAS Storage':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//NAS%20Storage.jpg' };
          case 'Oscilloscope':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Oscilloscope.jpg' };
          case 'Patch Panel':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Patch%20Panel.jpg' };
          case 'Raspberry Pi 4 Model B':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Raspberry%20Pi%204%20Model%20B.jpg' };
          case 'RJ45 Crimping Tool':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//RJ45%20Crimping%20Tool.jpg' };
          case 'Server Rack Cabinet':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Server%20Rack%20Cabinet.jpg' };
          case 'Ubiquiti UniFi AP AC Pro':
            return { ...item, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Ubiquiti%20UniFi%20AP%20AC%20Pro.jpg' };
          default:
            return item;
        }
      });
      setItems(patched);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setHistory([]);
      setHistoryLoading(false);
      return;
    }
    const { data } = await supabase
      .from('borrow_history')
      .select('*, items(name, image_url)')
      .eq('user_id', user.id)
      .order('borrowed_at', { ascending: false });
    const patched = (data || []).map(entry => {
      switch (entry.items?.name) {
        case 'Dell XPS 15':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Dell%20XPS%2015.jpg' } };
        case 'Arduino Starter Kit':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Arduino%20Starter%20Kit.jpg' } };
        case 'Cisco Catalyst 2960 Switch':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Cisco%20Catalyst%202960%20Switch.jpg' } };
        case 'Fiber Optic Termination Kit':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Fiber%20Optic%20Termination%20Kit.jpg' } };
        case 'Fluke Networks Cable Tester':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Fluke%20Networks%20Cable%20Tester.jpg' } };
        case 'HP ProCurve 2920 Switch':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//HP%20ProCurve%202920%20Switch.jpg' } };
        case 'KVM Switch':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//KVM%20Switch.jpg' } };
        case 'Laptop Docking Station':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Laptop%20Docking%20Station.jpg' } };
        case 'Logic Analyzer':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Logic%20Analyzer.jpg' } };
        case 'MacBook Pro 16"':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//MacBook%20Pro%2016.jpg' } };
        case 'NAS Storage':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//NAS%20Storage.jpg' } };
        case 'Oscilloscope':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Oscilloscope.jpg' } };
        case 'Patch Panel':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Patch%20Panel.jpg' } };
        case 'Raspberry Pi 4 Model B':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Raspberry%20Pi%204%20Model%20B.jpg' } };
        case 'RJ45 Crimping Tool':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//RJ45%20Crimping%20Tool.jpg' } };
        case 'Server Rack Cabinet':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Server%20Rack%20Cabinet.jpg' } };
        case 'Ubiquiti UniFi AP AC Pro':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Ubiquiti%20UniFi%20AP%20AC%20Pro.jpg' } };
        default:
          return entry;
      }
    });
    setHistory(patched);
    setHistoryLoading(false);
  };

  const fetchMyBorrowings = async () => {
    setMyBorrowingsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMyBorrowings([]);
      setMyBorrowingsLoading(false);
      return;
    }
    const { data } = await supabase
      .from('borrowed_items')
      .select('*, items(name, image_url)')
      .eq('user_id', user.id)
      .is('returned_at', null)
      .eq('status', 'Active')
      .order('borrowed_at', { ascending: false });
    const patched = (data || []).map(entry => {
      switch (entry.items?.name) {
        case 'Dell XPS 15':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Dell%20XPS%2015.jpg' } };
        case 'Arduino Starter Kit':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Arduino%20Starter%20Kit.jpg' } };
        case 'Cisco Catalyst 2960 Switch':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Cisco%20Catalyst%202960%20Switch.jpg' } };
        case 'Fiber Optic Termination Kit':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Fiber%20Optic%20Termination%20Kit.jpg' } };
        case 'Fluke Networks Cable Tester':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Fluke%20Networks%20Cable%20Tester.jpg' } };
        case 'HP ProCurve 2920 Switch':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//HP%20ProCurve%202920%20Switch.jpg' } };
        case 'KVM Switch':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//KVM%20Switch.jpg' } };
        case 'Laptop Docking Station':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Laptop%20Docking%20Station.jpg' } };
        case 'Logic Analyzer':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Logic%20Analyzer.jpg' } };
        case 'MacBook Pro 16"':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//MacBook%20Pro%2016.jpg' } };
        case 'NAS Storage':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//NAS%20Storage.jpg' } };
        case 'Oscilloscope':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Oscilloscope.jpg' } };
        case 'Patch Panel':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Patch%20Panel.jpg' } };
        case 'Raspberry Pi 4 Model B':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Raspberry%20Pi%204%20Model%20B.jpg' } };
        case 'RJ45 Crimping Tool':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//RJ45%20Crimping%20Tool.jpg' } };
        case 'Server Rack Cabinet':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Server%20Rack%20Cabinet.jpg' } };
        case 'Ubiquiti UniFi AP AC Pro':
          return { ...entry, items: { ...entry.items, image_url: 'https://qeuignqfwdwvejqndojs.supabase.co/storage/v1/object/public/avatars//Ubiquiti%20UniFi%20AP%20AC%20Pro.jpg' } };
        default:
          return entry;
      }
    });
    setMyBorrowings(patched);
    setMyBorrowingsLoading(false);
  };

  const handleReturn = async (id: string, itemId: string) => {
    // 1. Update borrowed_items
    await supabase
      .from('borrowed_items')
      .update({ returned_at: new Date().toISOString(), status: 'Returned' })
      .eq('id', id);

    // 2. Update item status to Available
    await supabase
      .from('items')
      .update({ status: 'Available' })
      .eq('id', itemId);

    // 3. Update borrow_history for this user, item, and where returned_at is null
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('borrow_history')
        .update({ returned_at: new Date().toISOString(), status: 'Returned' })
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .is('returned_at', null);
    }

    // 4. Refresh lists
    fetchMyBorrowings();
    fetchHistory();
    fetchItems();
  };

  const handleBorrow = async (item: Item) => {
    if (item.status !== 'Available') {
      alert('Item is not available for borrowing.');
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in.');
      return;
    }
    // Insert into borrowed_items
    const { error: borrowError } = await supabase
      .from('borrowed_items')
      .insert({
        user_id: user.id,
        item_id: item.id,
        status: 'Active'
      });
    if (borrowError) {
      alert('Failed to borrow item.');
      return;
    }
    // Update item status
    await supabase
      .from('items')
      .update({ status: 'In Use' })
      .eq('id', item.id);
    // Optionally, insert into borrow_history for audit
    await supabase
      .from('borrow_history')
      .insert({
        user_id: user.id,
        item_id: item.id,
        borrowed_at: new Date().toISOString(),
        status: 'Active'
      });
    // Refresh lists
    fetchItems();
    fetchMyBorrowings();
    fetchHistory();
    setShowModal(false);
  };

  useEffect(() => {
    fetchMyBorrowings();
  }, []);

  const handleClearHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('borrow_history')
      .delete()
      .eq('user_id', user.id);
    fetchHistory();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem>
              <IonAvatar slot="start">
                <img src="https://ui-avatars.com/api/?name=User" alt="avatar" />
              </IonAvatar>
              <IonLabel>
                <h2>{profile?.full_name || 'User'}</h2>
              </IonLabel>
            </IonItem>
            <IonItem button onClick={async () => {
              await supabase.auth.signOut();
              routerHistory.push('/home');
            }}>
              <IonLabel color="danger">Logout</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonMenuButton slot="start" />
            <IonTitle>Hardware Borrowing System</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonGrid>
            {/* Search Section */}
            <IonRow>
              <IonCol>
                <IonSearchbar
                  placeholder="Search devices..."
                  value={search}
                  onIonInput={e => setSearch(e.detail.value!)}
                />
              </IonCol>
            </IonRow>

            {/* Categories */}
            <IonRow>
              <IonCol>
                <div className="category-buttons">
                  <IonButton fill={category === 'All' ? 'solid' : 'outline'} onClick={() => setCategory('All')}>All</IonButton>
                  <IonButton fill={category === 'Tablets' ? 'solid' : 'outline'} onClick={() => setCategory('Tablets')}>Tablets</IonButton>
                  <IonButton fill={category === 'Monitors' ? 'solid' : 'outline'} onClick={() => setCategory('Monitors')}>Monitors</IonButton>
                  <IonButton fill={category === 'Accessories' ? 'solid' : 'outline'} onClick={() => setCategory('Accessories')}>Accessories</IonButton>
                  <IonButton fill={category === 'Networking' ? 'solid' : 'outline'} onClick={() => setCategory('Networking')}>Networking</IonButton>
                  <IonButton fill={category === 'IT Equipment' ? 'solid' : 'outline'} onClick={() => setCategory('IT Equipment')}>IT Equipment</IonButton>
                </div>
              </IonCol>
            </IonRow>

            {/* Available Hardware Section */}
            <IonRow>
              <IonCol>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Available Hardware</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {loading ? (
                      <div>Loading...</div>
                    ) : (
                      <IonList>
                        {items
                          .filter(item =>
                            (category === 'All' || item.category === category) &&
                            (item.name.toLowerCase().includes(search.toLowerCase()) ||
                              (item.specs && item.specs.toLowerCase().includes(search.toLowerCase()))
                            )
                          )
                          .map((item) => (
                            <IonItem key={item.id}>
                              <IonLabel>
                                <h2>{item.name}</h2>
                                <p>{item.specs}</p>
                              </IonLabel>
                              <IonButton
                                slot="end"
                                fill="outline"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowModal(true);
                                }}
                              >
                                View Details
                              </IonButton>
                            </IonItem>
                          ))}
                      </IonList>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>

            {/* My Borrowings Section */}
            <IonRow>
              <IonCol>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>My Borrowings</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {myBorrowingsLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <IonList>
                        {myBorrowings.map((entry) => (
                          <IonItem key={entry.id}>
                            {entry.items?.image_url && (
                              <img src={entry.items.image_url} alt={entry.items.name} style={{ width: 50, marginRight: 12, borderRadius: 4 }} />
                            )}
                            <IonLabel>
                              <h2>{entry.items?.name}</h2>
                              <p>Borrowed: {entry.borrowed_at}</p>
                            </IonLabel>
                            <IonButton
                              slot="end"
                              color="danger"
                              fill="outline"
                              onClick={() => handleReturn(entry.id, entry.item_id)}
                            >
                              Return
                            </IonButton>
                          </IonItem>
                        ))}
                      </IonList>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>

            {/* Quick Actions */}
            <IonRow>
              <IonCol size="4">
                <IonButton expand="block" fill="clear" onClick={() => { setShowHistory(true); fetchHistory(); }}>
                  <IonIcon icon={timeOutline} />
                  <br />
                  History
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Item Details Modal */}
          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>{selectedItem?.name}</IonTitle>
                <IonButton slot="end" onClick={() => setShowModal(false)}>
                  Close
                </IonButton>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              {selectedItem && (
                <>
                  {selectedItem.image_url && (
                    <img
                      src={selectedItem.image_url}
                      alt={selectedItem.name}
                      style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
                    />
                  )}
                  <h2>{selectedItem.name}</h2>
                  <p>{selectedItem.specs}</p>
                  <p>Category: {selectedItem.category}</p>
                  <p>Status: {selectedItem.status}</p>
                  {/* Add more fields as needed */}
                  <IonButton
                    expand="block"
                    color="primary"
                    onClick={() => selectedItem && handleBorrow(selectedItem)}
                    disabled={selectedItem?.status !== 'Available'}
                  >
                    Borrow
                  </IonButton>
                </>
              )}
            </IonContent>
          </IonModal>

          {/* History Modal */}
          <IonModal isOpen={showHistory} onDidDismiss={() => setShowHistory(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Borrow History</IonTitle>
                <IonButton slot="end" onClick={() => setShowHistory(false)}>
                  Close
                </IonButton>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonButton
                color="danger"
                expand="block"
                onClick={handleClearHistory}
                disabled={history.length === 0}
              >
                Clear History
              </IonButton>
              {historyLoading ? (
                <div>Loading...</div>
              ) : (
                <IonList>
                  {history.map((entry) => (
                    <IonItem key={entry.id}>
                      {entry.items?.image_url && (
                        <img src={entry.items.image_url} alt={entry.items.name} style={{ width: 50, marginRight: 12, borderRadius: 4 }} />
                      )}
                      <IonLabel>
                        <h2>{entry.items?.name}</h2>
                        <p>Borrowed: {entry.borrowed_at}</p>
                        <p>Returned: {entry.returned_at || 'Not yet returned'}</p>
                        <p>Status: {entry.status}</p>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              )}
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Dashboard;