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
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
            {item.photoUri ? (
              <img src={item.photoUri} alt={item.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={18} className="text-primary" />
            )}
          </div>
          <span className="font-medium text-text-primary">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'phoneNumbers',
      label: 'Teléfonos',
      render: (item: Contact) => (
        <div className="space-y-1">
          {item.phoneNumbers.slice(0, 2).map((phone, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
              <Phone size={13} className="text-text-muted" />
              <span>{phone.number}</span>
              <span className="text-xs text-text-muted">({phone.type})</span>
            </div>
          ))}
          {item.phoneNumbers.length > 2 && (
            <span className="text-xs text-text-muted">+{item.phoneNumbers.length - 2} más</span>
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
            <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
              <Mail size={13} className="text-text-muted" />
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
          className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Contactos</h1>
          <p className="text-sm text-text-muted mt-1">{contacts.length} contactos sincronizados</p>
        </div>
        <button
          onClick={fetchContacts}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors font-medium text-sm shadow-lg shadow-primary/25"
        >
          <RefreshCw size={16} />
          Sincronizar
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-text-primary placeholder-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
      </div>

      {/* Data Table */}
      {isLoading.contacts ? (
        <div className="flex items-center justify-center py-16 bg-surface rounded-xl border border-border">
          <LoadingSpinner size="lg" />
        </div>
      ) : errors.contacts ? (
        <Card>
          <EmptyState
            icon={<User size={48} />}
            title="Error al cargar"
            description={errors.contacts}
            action={
              <button
                onClick={fetchContacts}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium"
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
