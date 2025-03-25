import { Link, Routes, Route } from 'react-router-dom';
import UsersPage from './UsersPage';
import BillsPage from './BillsPage';
import ReservationsPage from './ReservationsPage';

function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="uppercase leading-none">
            <p className="font-bold">drive sync</p>
            <p className="opacity-50 text-sm">admin portal</p>
          </div>
          <div className="flex space-x-4">
            <Link to="/admin/dashboard/users" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
              Users
            </Link>
            <Link to="/admin/dashboard/bills" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
              Bills
            </Link>
            <Link to="/admin/dashboard/reservations" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
              Reservations
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
      <Routes>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/bills" element={<BillsPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
      </Routes>
    </div>
  );
}

export default AdminDashboard;
