import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import Card from "../components/Card";
import Forms from "../components/Forms";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { FiPlusCircle, FiMenu } from "react-icons/fi";
import { auth, db } from "../Firebase";
import { addDoc, collection, onSnapshot, doc, updateDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { getStorage, ref, deleteObject } from "firebase/storage";
import Navbar from "./NavBar";
import Logout from "./Logout";

export default function Home() {
  const { currentUser } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const handleOpen = () => setIsOpen(!isOpen);
  const handleClick = () => {
    setShowForm(!showForm);
    setEditingCard(null);
  };
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleAddCard = async (newCardData) => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "petrolStations"), 
          where("name", "==", newCardData.name),
          where("address", "==", newCardData.address),
          where("userId", "==", currentUser.uid)
        )
      );
      
      if (!querySnapshot.empty) {
        toast.error("Station with the same name and address already exists.");
        return;
      }

      const cardDataWithUserId = {
        ...newCardData,
        userId: currentUser.uid
      };

      const docRef = await addDoc(collection(db, "petrolStations"), cardDataWithUserId);
      toast.success("New station added");
      setShowForm(false);
    } catch (error) {
      toast.error("Error adding station: " + error.message);
    }
  };

  const handleDeleteCard = async (cardIndex) => {
    const station = cards[cardIndex];
    const stationRef = doc(db, "petrolStations", station.id);
  
    const storage = getStorage();
    const imageRef = ref(storage, station.imageUrl);
  
    try {
      await deleteDoc(stationRef);
      await deleteObject(imageRef);
      toast.success("Station deleted");
    } catch (error) {
      toast.error("Error deleting station: " + error.message);
    }
  };

  const handleEditCard = (cardIndex) => {
    const cardToEdit = cards[cardIndex];
    setEditingCard({ index: cardIndex, ...cardToEdit });
    setShowForm(true);
  };

  const handleSaveEdit = async (updatedCardData) => {
    const stationRef = doc(db, "petrolStations", editingCard.id);
    try {
      await updateDoc(stationRef, updatedCardData);
      toast.success("Card updated");
      setEditingCard(null);
      setShowForm(false);
    } catch (error) {
      toast.error("Error updating station: " + error.message);
    }
  };

  const handleLogout = async () => {
    // await signOut(auth);
    // localStorage.removeItem('userId');
    // navigate("/login");
    <Logout />
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const unsubscribe = onSnapshot(
      query(collection(db, "petrolStations"), where("userId", "==", currentUser.uid)),
      (snapshot) => {
        const fetchedCards = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(fetchedCards);
      }
    );

    return () => unsubscribe();
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <Toaster position="bottom-right" />
      <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 p-4 flex justify-between items-center lg:hidden">
          <button onClick={toggleSidebar} aria-label="Open menu">
            <FiMenu size={24} />
          </button>
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
            className="mb-8 px-6 py-3 bg-blue-500 rounded-full flex items-center space-x-2 hover:bg-blue-700 transition duration-300"
            onClick={handleClick}
          >
            <span>{editingCard ? "Edit Station" : "Add New Station"}</span>
            <FiPlusCircle />
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
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
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
                capacity={card.capacity}
                fuelTypes={card.fuelTypes}
                operatingHours={card.operatingHours}
                contactNumber={card.contactNumber}
                managerName={card.managerName}
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