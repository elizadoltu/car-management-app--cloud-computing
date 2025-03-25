import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [latestBill, setLatestBill] = useState(null);
  const [latestReservation, setLatestReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        const userResponse = await axios.get(
          'https://user-service-car-management-production.up.railway.app/api/profile', 
          { headers }
        );
        setUser(userResponse.data.user);
        
        const billsResponse = await axios.get(
          'https://reservations-and-bills-services-production.up.railway.app/api/bill',
          { headers }
        );
        console.log(billsResponse);
        
        if (billsResponse.data.bills && billsResponse.data.bills.length >= 0) {
          const sortedBills = [...billsResponse.data.bills].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLatestBill(sortedBills[0]);
        }
        
        const reservationsResponse = await axios.get(
          'https://reservations-and-bills-services-production.up.railway.app/api/reservation',
          { headers }
        );
        
        if (reservationsResponse.data && reservationsResponse.data.length >= 0) {
          const sortedReservations = [...reservationsResponse.data].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLatestReservation(sortedReservations[0]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch data', error);
        navigate('/');
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
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
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.fullName}</h1>
          <p className="mt-1 text-sm text-gray-500">Here's a summary of your latest activity</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Latest Bill</h2>
              {latestBill ? (
                <div>
                  <p className="text-sm text-gray-500">Amount: <span className="font-medium text-gray-900">${latestBill.amount}</span></p>
                  <p className="text-sm text-gray-500">Status: <span className={`font-medium ${latestBill.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {latestBill.isPaid ? 'Paid' : 'Unpaid'}
                  </span></p>
                  <p className="text-sm text-gray-500">Date: {new Date(latestBill.createdAt).toLocaleDateString()}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No bills found</p>
              )}
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Latest Reservation</h2>
              {latestReservation ? (
                <div>
                  <p className="text-sm text-gray-500">Car: <span className="font-medium text-gray-900">{latestReservation.carId}</span></p>
                  <p className="text-sm text-gray-500">Status: <span className={`font-medium ${
                    latestReservation.status === 'confirmed' ? 'text-green-600' : 
                    latestReservation.status === 'pending' ? 'text-yellow-600' : 
                    latestReservation.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {latestReservation.status.charAt(0).toUpperCase() + latestReservation.status.slice(1)}
                  </span></p>
                  <p className="text-sm text-gray-500">From: {new Date(latestReservation.startDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">To: {new Date(latestReservation.endDate).toLocaleDateString()}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reservations found</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
