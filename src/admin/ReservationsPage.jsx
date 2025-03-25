import { useEffect, useState } from 'react';
import axios from 'axios';

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    clientId: '',
    carId: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    totalPrice: ''
  });
  const [editingReservationId, setEditingReservationId] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }

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

  const handleCreateReservation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.post(
        'https://reservations-and-bills-services-production.up.railway.app/api/reservation',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations([...reservations, response.data]);
      setFormData({ clientId: '', carId: '', startDate: '', endDate: '', status: 'pending', totalPrice: '' });
    } catch (error) {
      console.error('Failed to create reservation', error);
    }
  };

  const handleUpdateReservation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.put(
        `https://reservations-and-bills-services-production.up.railway.app/api/reservation/${editingReservationId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(
        reservations.map((reservation) =>
          reservation._id === editingReservationId ? response.data : reservation
        )
      );
      setEditingReservationId(null);
      setFormData({ clientId: '', carId: '', startDate: '', endDate: '', status: 'pending', totalPrice: '' });
    } catch (error) {
      console.error('Failed to update reservation', error);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;
    const token = localStorage.getItem('adminToken');
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
      clientId: reservation.clientId,
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
      <h1 className="text-xl font-bold mb-4">Reservations Management</h1>

      {/* Create or Update Reservation Form */}
      <form
        onSubmit={editingReservationId ? handleUpdateReservation : handleCreateReservation}
        className="mb-6 bg-white shadow rounded-md p-4"
      >
        <h2 className="text-lg font-medium mb-4">
          {editingReservationId ? 'Edit Reservation' : 'Create Reservation'}
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Client ID</label>
          <input
            type="text"
            name="clientId"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
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
          className={`px-4 py-2 rounded-md text-white ${
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

export default ReservationsPage;
