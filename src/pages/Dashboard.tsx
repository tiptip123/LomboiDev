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
  IonModal
} from '@ionic/react';
import { timeOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/SupabaseClient';

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

  // Fetch items from the database
  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('items').select('*');
    if (!error) setItems(data || []);
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
    setHistory(data || []);
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
    setMyBorrowings(data || []);
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

    // 3. Refresh lists
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
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
  );
};

export default Dashboard;