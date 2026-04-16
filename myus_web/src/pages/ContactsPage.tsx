import { useEffect, useState } from 'react';
import { Search, RefreshCw, Trash2, User, Phone, Mail } from 'lucide-react';
import { Card, DataTable, LoadingSpinner, EmptyState } from '../components/common';
import { useMonitoringStore } from '../store/monitoringStore';
import { useAuthStore } from '../store/authStore';
import { contactsApi } from '../api/endpoints';
import { Contact } from '../types';

export const ContactsPage = () => {
  const { contacts, setContacts, isLoading, setLoading, errors, setError } = useMonitoringStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const fetchContacts = async () => {
    if (!user?.deviceId) return;
    setLoading('contacts', true);
    try {
      const response = await contactsApi.getAll(user.deviceId);
      setContacts(response.data || []);
    } catch (err: any) {
      setError('contacts', err.message || 'Error al cargar contactos');
    } finally {
      setLoading('contacts', false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user?.deviceId]);

  const handleDelete = async (id: string) => {
    try {
      await contactsApi.delete(id);
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumbers.some((p) => p.number.includes(searchQuery)) ||
      c.emails.some((e) => e.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (item: Contact) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(94,106,210,0.12)' }}
          >
            {item.photoUri ? (
              <img src={item.photoUri} alt={item.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={15} style={{ color: '#7170ff' }} />
            )}
          </div>
          <span className="font-medium text-sm" style={{ color: '#f7f8f8' }}>
            {item.name}
          </span>
        </div>
      ),
    },
    {
      key: 'phoneNumbers',
      label: 'Teléfonos',
      render: (item: Contact) => (
        <div className="space-y-1">
          {item.phoneNumbers.slice(0, 2).map((phone, i) => (
            <div key={i} className="flex items-center gap-2 text-sm" style={{ color: '#d0d6e0' }}>
              <Phone size={12} style={{ color: '#62666d' }} />
              <span>{phone.number}</span>
              <span className="text-xs" style={{ color: '#62666d' }}>({phone.type})</span>
            </div>
          ))}
          {item.phoneNumbers.length > 2 && (
            <span className="text-xs" style={{ color: '#62666d' }}>
              +{item.phoneNumbers.length - 2} más
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'emails',
      label: 'Emails',
      render: (item: Contact) => (
        <div className="space-y-1">
          {item.emails.slice(0, 2).map((email, i) => (
            <div key={i} className="flex items-center gap-2 text-sm" style={{ color: '#d0d6e0' }}>
              <Mail size={12} style={{ color: '#62666d' }} />
              <span className="truncate max-w-[200px]">{email.email}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (item: Contact) => (
        <button
          onClick={() => handleDelete(item.id)}
          className="p-2 rounded-md transition-all duration-150"
          style={{ color: '#62666d' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = '#ef4444';
            el.style.backgroundColor = 'rgba(239,68,68,0.08)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = '#62666d';
            el.style.backgroundColor = 'transparent';
          }}
        >
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#f7f8f8', letterSpacing: '-0.03em' }}>
            Contactos
          </h1>
          <p className="text-sm mt-1" style={{ color: '#62666d' }}>
            {contacts.length} contactos sincronizados
          </p>
        </div>
        <button
          onClick={fetchContacts}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-150"
          style={{ backgroundColor: '#5e6ad2', letterSpacing: '-0.01em' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#7170ff'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#5e6ad2'; }}
        >
          <RefreshCw size={14} />
          Sincronizar
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: '#62666d' }}
        />
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o email…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md py-2.5 pl-10 pr-4 text-sm transition-all duration-150"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#f7f8f8',
            outline: 'none',
            letterSpacing: '-0.01em',
          }}
          onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(113,112,255,0.5)'; }}
          onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
        />
      </div>

      {/* Data Table */}
      {isLoading.contacts ? (
        <div
          className="flex items-center justify-center py-16 rounded-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <LoadingSpinner size="lg" />
        </div>
      ) : errors.contacts ? (
        <Card>
          <EmptyState
            icon={<User size={40} />}
            title="Error al cargar"
            description={errors.contacts}
            action={
              <button
                onClick={fetchContacts}
                className="px-4 py-2 text-sm font-medium text-white rounded-md transition-all duration-150"
                style={{ backgroundColor: '#5e6ad2' }}
              >
                Reintentar
              </button>
            }
          />
        </Card>
      ) : (
        <Card className="p-0">
          <DataTable
            columns={columns}
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            emptyMessage="No hay contactos que coincidan"
          />
        </Card>
      )}
    </div>
  );
};
