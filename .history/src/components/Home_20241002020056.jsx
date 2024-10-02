import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import Card from "../components/Card";
import logo from "../assets/fuel_logo.png";
import Forms from "../components/Forms";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import {
  FiPlusCircle,
  FiUser,
  FiTruck,
  FiSettings,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { db } from "../Firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Component() {
  const { currentUser } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidenav]

  const handleOpen = () => setIsOpen(!isOpen);
  const handleClick = () => setShowForm(!showForm);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleAddCard = (newCardData) => {
    setCards([...cards, newCardData]);
    setShowForm(false);
    toast.success("New station added");
  };

  const handleDeleteCard = (cardIndex) => {
    setCards(cards.filter((_, index) => index !== cardIndex));
    toast.success("Card deleted");
  };

  const handleEditCard = (cardIndex) => {
    const cardToEdit = cards[cardIndex];
    setEditingCard({ index: cardIndex, ...cardToEdit });
    setShowForm(true);
  };

  const handleSaveEdit = (updatedCardData) => {
    const updatedCards = [...cards];
    updatedCards[editingCard.index] = updatedCardData;
    setCards(updatedCards);
    setEditingCard(null);
    setShowForm(false);
    toast.success("Card updated");
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "petrolStations"),
      (snapshot) => {
        const fetchedCards = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(fetchedCards);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <Toaster position="top-right" />
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      <motion.nav
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : "-100%",
          width: "16rem",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 bottom-0 w-64 bg-gray-800 p-6 flex flex-col z-50 lg:relative lg:translate-x-0"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <img src={logo} alt="logo" className="w-10 h-10 mr-3" />
            <h1 className="text-xl font-bold">Sentinel Fuel</h1>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden">
            <RxCross2 size={24} />
          </button>
        </div>
        <div className="flex flex-col space-y-4">
          <NavLink icon={<FiUser />} text="Add Driver" />
          <NavLink icon={<FiTruck />} text="Add Petrol Pump" />
          <NavLink icon={<FiSettings />} text="Settings" />
          <NavLink icon={<FiLogOut />} text="Log Out" to="/login" />
        </div>
      </motion.nav>
      <div className="flex-1 flex flex-col lg:ml-64">
        <header className="bg-gray-800 p-4 flex justify-between items-center lg:hidden">
          <button onClick={toggleSidebar} aria-label="Open menu">
            <FiMenu size={24} />
          </button>
          <h1 className="text-xl font-bold">Sentinel Fuel</h1>
        </header>
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
          >
            Welcome, {currentUser.displayName}
          </motion.h1>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gray-800 rounded-lg p-6 mb-8 cursor-pointer shadow-lg"
            onClick={handleOpen}
          >
            <h2 className="text-2xl font-semibold mb-4">Analytics Overview</h2>
            <p className="text-gray-400">Click to view detailed analytics</p>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-8 px-6 py-3 bg-blue-500 rounded-full flex items-center space-x-2 hover:bg-blue-600 transition duration-300"
            onClick={handleClick}
          >
            <FiPlusCircle />
            <span>Add New Station</span>
          </motion.button>
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-gray-800 rounded-lg p-6 mb-8 relative"
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  onClick={handleClick}
                >
                  <RxCross2 size={24} />
                </button>
                <Forms
                  onAddCard={handleAddCard}
                  cardData={editingCard}
                  onSaveEdit={handleSaveEdit}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {cards.map((card, index) => (
              <Card
                key={card.id}
                cardIndex={index}
                id={card.name}
                iamge={card.imageUrl}
                add={card.address}
                onDelete={() => handleDeleteCard(index)}
                onEdit={() => handleEditCard(index)}
              />
            ))}
          </motion.div>
        </main>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 p-8 rounded-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Detailed Analytics</h2>
              <p className="mb-4">Total Amount Due: $10,000</p>
              <p className="mb-4">Total Trucks Live: 25</p>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLink({ icon, text, to = "#" }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 text-gray-300 hover:text-white transition duration-300"
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}
