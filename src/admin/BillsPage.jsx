import { useEffect, useState } from 'react';
import axios from 'axios';

function BillsPage() {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    isPaid: false,
    paymentDate: '',
    paymentMethod: ''
  });
  const [editingBillId, setEditingBillId] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        window.location.href = '/admin/login';
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

  const handleCreateBill = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
        const response = await axios.post(
            'https://reservations-and-bills-services-production.up.railway.app/api/bill',
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setBills([...bills, response.data]);
        setFormData({ clientId: '', amount: '', isPaid: false, paymentDate: '', paymentMethod: '' });
    } catch (error) {
        console.error('Failed to create bill', error);
    }
  };
  
  const handleUpdateBill = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
        const response = await axios.put(
            `https://reservations-and-bills-services-production.up.railway.app/api/bill/${editingBillId}`,
            formData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setBills(bills.map((bill) => (bill._id === editingBillId ? response.data : bill)));
        setEditingBillId(null);
        setFormData({ clientId: '', amount: '', isPaid: false, paymentDate: '', paymentMethod: '' });
    } catch (error) {
        console.error('Failed to update bill', error);
    }
  };
  

  const handleDeleteBill = async (billId) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;
    const token = localStorage.getItem('adminToken');
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

  const handleEditClick = (bill) => {
    setEditingBillId(bill._id);
    setFormData({
      clientId: bill.clientId,
      amount: bill.amount,
      isPaid: bill.isPaid,
      paymentDate: bill.paymentDate || '',
      paymentMethod: bill.paymentMethod
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
      <h1 className="text-xl font-bold mb-4">Bills Management</h1>

      {/* Create or Update Bill Form */}
      <form
        onSubmit={editingBillId ? handleUpdateBill : handleCreateBill}
        className="mb-6 bg-white shadow rounded-md p-4"
      >
        <h2 className="text-lg font-medium mb-4">{editingBillId ? 'Edit Bill' : 'Create Bill'}</h2>
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
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Is Paid</label>
          <select
            name="isPaid"
            value={formData.isPaid}
            onChange={(e) => setFormData({ ...formData, isPaid: e.target.value === 'true' })}
            className="w-full p-2 border rounded-md"
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
  <select
    name="paymentMethod"
    value={formData.paymentMethod}
    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
    required
    className="w-full p-2 border rounded-md"
  >
    <option value="">Select a payment method</option>
    <option value="credit_card">Credit Card</option>
    <option value="debit_card">Debit Card</option>
    <option value="cash">Cash</option>
    <option value="bank_transfer">Bank Transfer</option>
  </select>
</div>

        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-[#131313] ${
            editingBillId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {editingBillId ? 'Update Bill' : 'Create Bill'}
        </button>
      </form>

      {/* List of Bills */}
      <ul className="divide-y divide-gray-200 bg-white shadow overflow-hidden sm:rounded-md">
        {bills.map((bill) => (
          <li key={bill._id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
            <div>
              <p><strong>Bill #{bill._id.substring(0, 8)}</strong></p>
              <p>Client ID: {bill.clientId}</p>
              <p>Amount: ${bill.amount}</p>
              <p>Status: {bill.isPaid ? 'Paid' : 'Unpaid'}</p>
              {bill.paymentDate && (
                <p>Payment Date: {new Date(bill.paymentDate).toLocaleDateString()}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditClick(bill)}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
              >
                Edit
              </button>
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

export default BillsPage;
