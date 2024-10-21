"use client";

import React, { useState } from "react";
import {
  Bell,
  Fuel,
  MapPin,
  Truck,
  Users,
  AlertTriangle,
  BarChart3,
  Settings,
  Search,
  Plus,
  Edit,
  Eye,
  Navigation,
  Phone,
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("petrol-pumps");

  // Mock data for demonstration
  const petrolPumps = [
    {
      id: 1,
      name: "City Fuel Station",
      address: "123 Main St",
      fuelRequired: 5000,
      pendingCost: 10000,
    },
    {
      id: 2,
      name: "Highway Gas Stop",
      address: "456 Route 66",
      fuelRequired: 7500,
      pendingCost: 15000,
    },
  ];

  const drivers = [
    {
      id: 1,
      name: "John Doe",
      truckId: "TR-001",
      currentLocation: "En route to City Fuel Station",
      fuelLevel: 80,
    },
    {
      id: 2,
      name: "Jane Smith",
      truckId: "TR-002",
      currentLocation: "At Highway Gas Stop",
      fuelLevel: 45,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Sentinel Fuel</h1>
        </div>
        <nav className="mt-6">
          {[
            { icon: Fuel, label: "Petrol Pumps", value: "petrol-pumps" },
            { icon: Truck, label: "Drivers", value: "drivers" },
            { icon: MapPin, label: "Track Shipments" },
            { icon: AlertTriangle, label: "Alerts" },
            { icon: BarChart3, label: "Reports" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex items-center w-full px-4 py-2 text-left ${
                activeTab === item.value ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              onClick={() => item.value && setActiveTab(item.value)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
              Dashboard
            </h2>
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-gray-200 mr-2">
                <Bell className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-200">
                <Users className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="mb-4">
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-t-lg ${
                  activeTab === "petrol-pumps"
                    ? "bg-white text-blue-600"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("petrol-pumps")}
              >
                Petrol Pumps
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg ${
                  activeTab === "drivers"
                    ? "bg-white text-blue-600"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("drivers")}
              >
                Drivers
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            {activeTab === "petrol-pumps" && (
              <>
                <h3 className="text-lg font-semibold mb-2">
                  Manage Petrol Pumps
                </h3>
                <p className="text-gray-600 mb-4">
                  View and manage petrol pump details
                </p>
                <div className="mb-4 flex justify-between">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search petrol pumps..."
                      className="pl-10 pr-4 py-2 border rounded-lg"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Pump
                  </button>
                </div>
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fuel Required (L)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pending Cost ($)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {petrolPumps.map((pump) => (
                      <tr key={pump.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {pump.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {pump.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {pump.fuelRequired}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {pump.pendingCost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-900 mr-2">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeTab === "drivers" && (
              <>
                <h3 className="text-lg font-semibold mb-2">Manage Drivers</h3>
                <p className="text-gray-600 mb-4">
                  View and manage driver details
                </p>
                <div className="mb-4 flex justify-between">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search drivers..."
                      className="pl-10 pr-4 py-2 border rounded-lg"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Driver
                  </button>
                </div>
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Truck ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fuel Level (%)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {drivers.map((driver) => (
                      <tr key={driver.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {driver.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {driver.truckId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {driver.currentLocation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {driver.fuelLevel}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-900 mr-2">
                            <Navigation className="h-5 w-5" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Phone className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
