import React, { useState } from "react";
import FloatingSidebar from "../components/Sidebar";
import FullScreenNavbar from "../components/Navbar";

export default function Record() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Example static data; replace with your actual data source or props
  const [tourists] = useState([
    {
      name: "John Doe",
      age: 30,
      country: "USA",
      email: "john@example.com",
      phone: "+1 555-1234",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Jane Smith",
      age: 25,
      country: "UK",
      email: "jane@example.com",
      phone: "+44 20 7946 0958",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    // Add more travellers as needed
  ]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#262d36" }}>
      {/* Navbar */}
      <FullScreenNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-60">
          <FloatingSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-5 pr-6 pb-6">
          <div className="space-y-10">
            {/* Tourist Records Card */}
            <div className="bg-[#222932] rounded-xl p-6 text-white">
              <h2 className="font-semibold text-lg mb-4">Tourist Records</h2>
              <div className="divide-y divide-gray-700">
                {tourists.length === 0 ? (
                  <div className="py-4 text-gray-400">No tourist records found.</div>
                ) : (
                  tourists.map((t, idx) => (
                    <div
                      key={idx}
                      className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={t.photo}
                          alt={`Photo of ${t.name}`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                        />
                        <div>
                          <span className="font-medium block">{t.name}</span>
                          <span className="text-gray-400 text-sm block">
                            Age: {t.age}
                          </span>
                          <span className="text-gray-400 text-sm block">
                            Country: {t.country}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end mt-2 md:mt-0">
                        <span className="text-gray-400 text-sm">
                          Phone: {t.phone}
                        </span>
                        <span className="text-gray-400 text-sm">
                          Email: {t.email}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}