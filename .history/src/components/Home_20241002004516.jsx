import React, { useContext, useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import Card from "../components/Card";
import logo from "../assets/fuel_logo.png";
import Forms from "../components/Forms";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { db } from "../Firebase"; // Import your Firestore instance
import { collection, onSnapshot } from "firebase/firestore"; // Firestore methods

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false); // State to track form visibility
  const [isOpen, setIsOpen] = useState(false);
  const [cards, setCards] = useState([]); // State to store card data
  const [editingCard, setEditingCard] = useState(null); // State to track the card being edited

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    setShowForm(!showForm); // Toggle the form visibility
  };

  // Handler to add new card data
  const handleAddCard = (newCardData) => {
    setCards([...cards, newCardData]); // Add new card to the list
    setShowForm(false); // Hide the form after submission
  };

  // Handler to delete a card
  const handleDeleteCard = (cardIndex) => {
    setCards(cards.filter((_, index) => index !== cardIndex)); // Remove card by id
    toast("Card Deleted");
  };

  // Handler to edit a card
  const handleEditCard = (cardIndex) => {
    const cardToEdit = cards[cardIndex];
    setEditingCard({ index: cardIndex, ...cardToEdit });
    setShowForm(true); // Show the form to edit the card
  };

  // Handler to save edited card data
  const handleSaveEdit = (updatedCardData) => {
    const updatedCards = [...cards];
    updatedCards[editingCard.index] = updatedCardData;
    setCards(updatedCards);
    setEditingCard(null);
    setShowForm(false); // Hide the form after saving
  };

  // Real-time fetching data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "petrolStations"),
      (snapshot) => {
        const fetchedCards = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Spread the Firestore document data
        }));
        setCards(fetchedCards); // Set the fetched data into state
      }
    );

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures it runs on component mount

  return (
    <>
      <div className="bg-white flex min-h-screen w-screen gap-10 pb-1/2">
        <div className="flex flex-col justify-start items-center font-bold text-xl w-1/6 gap-20 bg-gray-950 text-white min-h-screen p-10">
          <div className="flex justify-center gap-1/6 items-center">
            <img src={logo} alt="logo" className="w-1/4 h-11/12" />
            <h1>&nbsp; Sentinel Fuel</h1>
          </div>

          <div className="flex flex-col gap-10 text-xl items-start">
            <Link className=" hover:text-red-600 transition duration-300 ease-in-out">
              Add Driver
            </Link>
            <Link className=" hover:border-b-red-500 hover:text-red-600 transition duration-300 ease-in-out">
              Add Petrol Pump
            </Link>
            <Link className=" hover:border-b-red-500 hover:text-red-600 transition duration-300 ease-in-out">
              Settings
            </Link>
            <Link
              className=" hover:border-b-red-500 hover:text-red-600 transition duration-300 ease-in-out"
              to={"/login"}
            >
              Log Out
            </Link>
          </div>
        </div>

        <div className="w-9/12 flex flex-col justify-start gap-10 pt-10 h-full">
          <div className="flex items-center justify-center">
            <h1 className="text-4xl p-2 rounded-md bg-gradient-to-br from-teal-200 via-blue-300 to-indigo-400 font-bold tracking-wide mb-4 transition-colors duration-300 ease-in-out hover:text-teal-500 bg-clip-text text-transparent">
              Hello {currentUser.displayName}
            </h1>
          </div>

          <div
            className="p-5 w-full bg-[#F9F9F9] h-fit rounded-2xl z-2 shadow-2xl cursor-pointer"
            onClick={handleOpen}
          >
            <p>Analytics</p>
            <p>Total Amount Due</p>
            <p>Total number of trucks live</p>
          </div>

          {/* Pop-up Modal */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="p-10 bg-white rounded-xl shadow-2xl relative z-60"
                onClick={(e) => e.stopPropagation()} // Prevents closing modal when clicking inside it
              >
                <h1 className="text-2xl font-bold mb-4 text-center">
                  Analytics
                </h1>
                <h2 className="text-xl mb-2">Total Amount Due</h2>
                <h3 className="text-xl">Total number of trucks live</h3>
                <button
                  className="mt-5 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="bg-[#f9f9f9] z-2 w-fit hover:border-2 hover:bg-white hover:border-pink-200 shadow-md p-2 rounded-md">
            <button onClick={handleClick}> Add new stations +</button>
          </div>

          {showForm && (
            <div
              className={`w-full bg-stone-100 p-4 rounded-md shadow-md flex flex-col justify-start items-end`}
            >
              <RxCross2
                className="cursor-pointer text-2xl"
                onClick={handleClick}
              />
              <Forms
                onAddCard={handleAddCard}
                cardData={editingCard} // Pass current card data for editing
                onSaveEdit={handleSaveEdit} // Pass save handler
              />
            </div>
          )}

          <div className={`flex flex-wrap gap-10 `}>
            {/* Render each card fetched from Firestore */}
            {cards.map((card, index) => (
              <Card
                key={card.id} // Use unique key for each card
                cardIndex={index}
                id={card.name}
                iamge={card.imageUrl} // Use imageUrl fetched from Firestore
                add={card.address}
                onDelete={() => handleDeleteCard(index)}
                onEdit={handleEditCard}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
