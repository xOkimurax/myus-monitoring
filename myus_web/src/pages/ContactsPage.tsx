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
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {item.photoUri ? (
              <img src={item.photoUri} alt={item.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={20} className="text-primary" />
            )}
          </div>
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'phoneNumbers',
      label: 'Teléfonos',
      render: (item: Contact) => (
        <div className="space-y-1">
          {item.phoneNumbers.slice(0, 2).map((phone, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Phone size={14} className="text-gray-500" />
              <span>{phone.number}</span>
              <span className="text-xs text-gray-500">({phone.type})</span>
            </div>
          ))}
          {item.phoneNumbers.length > 2 && (
            <span className="text-xs text-gray-400">+{item.phoneNumbers.length - 2} más</span>
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
            <div key={i} className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-gray-500" />
              <span className="truncate max-w-xs">{email.email}</span>
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
          className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
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
          <h1 className="text-2xl font-bold">Contactos</h1>
          <p className="text-gray-400 mt-1">{contacts.length} contactos sincronizados</p>
        </div>
        <button
          onClick={fetchContacts}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={18} />
          Sincronizar
        </button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
          />
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        {isLoading.contacts ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : errors.contacts ? (
          <EmptyState
            icon={<User size={48} />}
            title="Error al cargar"
            description={errors.contacts}
            action={
              <button
                onClick={fetchContacts}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Reintentar
              </button>
            }
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            emptyMessage="No hay contactos"
          />
        )}
      </Card>
    </div>
  );
};