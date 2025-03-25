import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Bills() {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
        return;
      }

      try {
        const response = await axios.get(
          'https://reservations-and-bills-services-production.up.railway.app/api/bill',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBills(response.data.bills || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch bills', error);
      }
    };

    fetchBills();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDeleteBill = async (billId) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `https://reservations-and-bills-services-production.up.railway.app/api/bill/${billId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBills(bills.filter((bill) => bill._id !== billId));
    } catch (error) {
      console.error('Failed to delete bill', error);
    }
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
      <h1 className="text-xl font-bold mb-4 mt-10">My Bills</h1>

      {/* List of Bills */}
      <ul className="divide-y divide-gray-200 bg-white shadow overflow-hidden sm:rounded-md">
        {bills.map((bill) => (
          <li key={bill._id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
            <div>
              <p><strong>Bill #{bill._id.substring(0, 8)}</strong></p>
              <p>Reservation ID: {bill.reservationId}</p>
              <p>Amount: ${bill.amount}</p>
              <p>Payment Method: {bill.paymentMethod}</p>
              <p>Status: {bill.isPaid ? 'Paid' : 'Unpaid'}</p>
              {bill.paymentDate && (
                <p>Payment Date: {new Date(bill.paymentDate).toLocaleDateString()}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDeleteBill(bill._id)}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {bills.length === 0 && (
          <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No bills found</li>
        )}
      </ul>
    </main>
  );
}

export default Bills;
