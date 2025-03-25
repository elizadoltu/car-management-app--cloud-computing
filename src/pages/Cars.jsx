import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";

function Cars() {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
  });
  const [editingCarId, setEditingCarId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cars associated with the client
  useEffect(() => {
    const fetchCars = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
  
      try {
        const clientId = JSON.parse(atob(token.split(".")[1])).sub;
        console.log(`Fetching cars for clientId: ${clientId}`);
  
        const response = await axios.get(
          `https://cloud-computing-uaic-production.up.railway.app/cars/${clientId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
  
        console.log('API Response:', response);
        setCars(Array.isArray(response.data) ? response.data : []);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch cars", error);
        if (error.response) {
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        setCars([]);
        setIsLoading(false);
      }
    };
  
    fetchCars();
  }, [navigate]);  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  
  const handleCreateCar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const clientId = JSON.parse(atob(token.split(".")[1])).sub;

      const carData = {
        ...formData,
        clientId: clientId,
      };

      const response = await axios.post(
        `https://cloud-computing-uaic-production.up.railway.app/cars`,
        carData
      );

      setCars([...cars, response.data]);
      setFormData({ make: "", model: "", year: "", color: "" });
    } catch (error) {
      console.error("Failed to create car", error);
    }
  };

  // Update an existing car
  const handleUpdateCar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `https://cloud-computing-uaic-production.up.railway.app/cars/${editingCarId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCars(
        cars.map((car) => (car._id === editingCarId ? response.data : car))
      );
      setEditingCarId(null);
      setFormData({ make: "", model: "", year: "", color: "" });
    } catch (error) {
      console.error("Failed to update car", error);
    }
  };

  // Delete a car
  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://cloud-computing-uaic-production.up.railway.app/cars/${carId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCars(cars.filter((car) => car._id !== carId));
    } catch (error) {
      console.error("Failed to delete car", error);
    }
  };

  // Set the form data for editing a car
  const handleEditClick = (car) => {
    setEditingCarId(car._id);
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      color: car.color,
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Cars</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your cars below</p>
        </div>

        {/* Create or Update Car Form */}
        <form
          onSubmit={editingCarId ? handleUpdateCar : handleCreateCar}
          className="mb-6 bg-white shadow rounded-md p-4"
        >
          <h2 className="text-lg font-medium mb-4">
            {editingCarId ? "Edit Car" : "Create Car"}
          </h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Make
            </label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={(e) =>
                setFormData({ ...formData, make: e.target.value })
              }
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-[#131313] ${
              editingCarId
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {editingCarId ? "Update Car" : "Create Car"}
          </button>
        </form>

        {/* List of Cars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.isArray(cars) && cars.map((car, index) => (
            <div
            key={car._id || index} 
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {car.make} {car.model}
                </h3>
                <p className="text-sm text-gray-500">
                  Year:{" "}
                  <span className="font-medium text-gray-900">{car.year}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Color:{" "}
                  <span className="font-medium text-gray-900">{car.color}</span>
                </p>
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => handleEditClick(car)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCar(car._id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {(!Array.isArray(cars) || cars.length === 0) && (
    <div className="col-span-full text-center text-gray-500 py-8">
      No cars found. Add your first car using the form above.
    </div>
  )}
        </div>
      </main>
    </div>
  );
}

export default Cars;
