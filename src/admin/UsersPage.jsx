import { useEffect, useState } from 'react';
import axios from 'axios';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'client',
  });
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }

      try {
        const response = await axios.get(
          'https://user-service-car-management-production.up.railway.app/api/admin/users',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.post(
        'https://user-service-car-management-production.up.railway.app/api/admin/users',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers([...users, response.data]);
      setFormData({ username: '', email: '', fullName: '', role: 'client' });
    } catch (error) {
      console.error('Failed to create user', error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.put(
        `https://user-service-car-management-production.up.railway.app/api/users/${editingUserId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((user) => (user._id === editingUserId ? response.data : user)));
      setEditingUserId(null);
      setFormData({ username: '', email: '', fullName: '', role: 'client' });
    } catch (error) {
      console.error('Failed to update user', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(
        `https://user-service-car-management-production.up.railway.app/api/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role || 'client',
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl font-bold mb-4">Users Management</h1>

      {/* Create or Update User Form */}
      <form
        onSubmit={editingUserId ? handleUpdateUser : handleCreateUser}
        className="mb-6 bg-white shadow rounded-md p-4"
      >
        <h2 className="text-lg font-medium mb-4">
          {editingUserId ? 'Edit User' : 'Create User'}
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
            className="w-full p-2 border rounded-md"
          >
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-[#131313] ${
            editingUserId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {editingUserId ? 'Update User' : 'Create User'}
        </button>
      </form>

      {/* List of Users */}
      <ul className="divide-y divide-gray-200 bg-white shadow overflow-hidden sm:rounded-md">
        {users.map((user) => (
          <li key={user._id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
            <div>
              <p><strong>{user.fullName}</strong></p>
              <p>Email: {user.email}</p>
              <p>Username: {user.username}</p>
              <p>Role: {user.role}</p>
              <p>Cars: {user.cars?.join(', ')}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditClick(user)}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {users.length === 0 && (
          <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No users found</li>
        )}
      </ul>
    </main>
  );
}

export default UsersPage;
