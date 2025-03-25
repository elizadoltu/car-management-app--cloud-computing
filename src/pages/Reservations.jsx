import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';// Make sure to install jsonwebtoken package

function Reservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientId, setClientId] = useState(null);
  const [formData, setFormData] = useState({
    carId: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    totalPrice: ''
  });
  const [editingReservationId, setEditingReservationId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    try {
      // Decode the token to get the client ID
      const decoded = jwtDecode(token);
      setClientId(decoded.clientId); // Assumes the token contains a clientId field
    } catch (error) {
      console.error('Failed to decode token', error);
      window.location.href = '/';
      return;
    }

    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          'https://reservations-and-bills-services-production.up.railway.app/api/reservation',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReservations(response.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch reservations', error);
      }
    };

    fetchReservations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'https://reservations-and-bills-services-production.up.railway.app/api/reservation',
        {
          ...formData,
          clientId: clientId // Use the clientId from the token
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations([...reservations, response.data]);
      setFormData({ carId: '', startDate: '', endDate: '', status: 'pending', totalPrice: '' });
    } catch (error) {
      console.error('Failed to create reservation', error);
    }
  };

  const handleUpdateReservation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `https://reservations-and-bills-services-production.up.railway.app/api/reservation/${editingReservationId}`,
        {
          ...formData,
          clientId: clientId // Use the clientId from the token
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(
        reservations.map((reservation) =>
          reservation._id === editingReservationId ? response.data : reservation
        )
      );
      setEditingReservationId(null);
      setFormData({ carId: '', startDate: '', endDate: '', status: 'pending', totalPrice: '' });
    } catch (error) {
      console.error('Failed to update reservation', error);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `https://reservations-and-bills-services-production.up.railway.app/api/reservation/${reservationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(reservations.filter((reservation) => reservation._id !== reservationId));
    } catch (error) {
      console.error('Failed to delete reservation', error);
    }
  };

  const handleEditClick = (reservation) => {
    setEditingReservationId(reservation._id);
    setFormData({
      carId: reservation.carId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      status: reservation.status,
      totalPrice: reservation.totalPrice
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="uppercase leading-none">
            <p className="font-bold">drive sync</p>
            <p className="opacity-50 text-sm">car management app</p>
          </div>
          
          <div className="flex space-x-4">
            <Link to="/user/bills" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
              My Bills
            </Link>
            <Link to="/user/reservations" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
              My Reservations
            </Link>
            <Link to="/user/profile" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
              Profile
            </Link>
            <Link to="/user/cars" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
              My Cars
            </Link>
            <button 
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-white bg-[#181818] hover:bg-[#333333]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <h1 className="text-xl font-bold mb-4 mt-10">Reservations Management</h1>

      <form
        onSubmit={editingReservationId ? handleUpdateReservation : handleCreateReservation}
        className="mb-6 bg-white shadow rounded-md p-4"
      >
        <h2 className="text-lg font-medium mb-4">
          {editingReservationId ? 'Edit Reservation' : 'Create Reservation'}
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Car ID</label>
          <input
            type="text"
            name="carId"
            value={formData.carId}
            onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            required
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select a status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Total Price</label>
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice}
            onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
            required
            className="w-full p-2 border rounded-md"
          />
         </div>
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-[#131313] ${
            editingReservationId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {editingReservationId ? 'Update Reservation' : 'Create Reservation'}
        </button>
      </form>

      {/* List of Reservations */}
      <ul className="divide-y divide-gray-200 bg-white shadow overflow-hidden sm:rounded-md">
        {reservations.map((reservation) => (
          <li key={reservation._id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
            <div>
              <p><strong>Reservation #{reservation._id.substring(0, 8)}</strong></p>
              <p>Client ID: {reservation.clientId}</p>
              <p>Car ID: {reservation.carId}</p>
              <p>Status: {reservation.status}</p>
              <p>Start Date: {new Date(reservation.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(reservation.endDate).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditClick(reservation)}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteReservation(reservation._id)}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {reservations.length === 0 && (
          <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No reservations found</li>
        )}
      </ul>
    </main>
  );
}

export default Reservations;