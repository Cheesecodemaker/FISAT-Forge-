import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Adash.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [conductedBy, setConductedBy] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await axios.get("http://localhost:5000/events");
    setEvents(response.data);
  };

  const addEvent = async () => {
    if (!name || !details || !startDate || !endDate || !conductedBy) {
      return alert("Please fill in all fields");
    }
    await axios.post("http://localhost:5000/events", { name, details, startDate, endDate, conductedBy });
    resetForm();
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await axios.delete(`http://localhost:5000/events/${id}`);
    fetchEvents();
  };

  const updateEvent = async () => {
    if (!name || !details || !startDate || !endDate || !conductedBy) {
      return alert("Please fill in all fields");
    }
    await axios.put(`http://localhost:5000/events/${editingEvent._id}`, { name, details, startDate, endDate, conductedBy });
    resetForm();
    fetchEvents();
  };

  const resetForm = () => {
    setName("");
    setDetails("");
    setStartDate("");
    setEndDate("");
    setConductedBy("");
    setEditingEvent(null);
  };

  const handleLogout = () => {
    // Clear any auth tokens or session data
    localStorage.removeItem("adminToken");
    // Redirect to admin login page
    navigate("/admin-login");
  };

  return (
    <div className="admin-dashboardx">
      <header className="admin-headerx">
        <h1>Admin Dashboard</h1>
        <button className="logout-btnx" onClick={handleLogout}>Logout</button>
      </header>
      <div className="dashboard-containerx">
        <h2>Manage Events</h2>
        <div className="event-formx">
          <div className="form-groupx">
            <label htmlFor="eventName">Event Name</label>
            <input 
              id="eventName"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter event name" 
            />
          </div>
          <div className="form-groupx">
            <label htmlFor="eventDetails">Event Details</label>
            <textarea 
              id="eventDetails"
              value={details} 
              onChange={(e) => setDetails(e.target.value)} 
              placeholder="Enter event details"
              rows="4"
            ></textarea>
          </div>
          <div className="form-rowx">
            <div className="form-groupx">
              <label htmlFor="startDate">Start Date</label>
              <input 
                id="startDate"
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </div>
            <div className="form-groupx">
              <label htmlFor="endDate">End Date</label>
              <input 
                id="endDate"
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
          </div>
          <div className="form-groupx">
            <label htmlFor="conductedBy">Conducted By</label>
            <input 
              id="conductedBy"
              type="text" 
              value={conductedBy} 
              onChange={(e) => setConductedBy(e.target.value)} 
              placeholder="Enter organizer/conductor" 
            />
          </div>
          <div className="form-actionsx">
            {editingEvent ? (
              <>
                <button className="update-btnx" onClick={updateEvent}>Update Event</button>
                <button className="cancel-btnx" onClick={resetForm}>Cancel</button>
              </>
            ) : (
              <button className="add-btnx" onClick={addEvent}>Add Event</button>
            )}
          </div>
        </div>
        <div className="events-sectionx">
          <h3>Upcoming Events</h3>
          <ul className="event-listx">
            {events.length > 0 ? (
              events.map((event) => (
                <li key={event._id} className="event-itemx">
                  <div className="event-contentx">
                    <h4>{event.name}</h4>
                    <p className="event-descriptionx">{event.details}</p>
                    <div className="event-metax">
                      <span className="event-datesx">
                        <i className="fa fa-calendar"></i> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </span>
                      <span className="event-conductorx">
                        <i className="fa fa-user"></i> {event.conductedBy}
                      </span>
                    </div>
                  </div>
                  <div className="event-actionsx">
                    <button className="edit-btnx" onClick={() => { 
                      setName(event.name); 
                      setDetails(event.details); 
                      setStartDate(event.startDate.split('T')[0]); 
                      setEndDate(event.endDate.split('T')[0]); 
                      setConductedBy(event.conductedBy); 
                      setEditingEvent(event); 
                    }}>Edit</button>
                    <button className="delete-btnx" onClick={() => deleteEvent(event._id)}>Delete</button>
                  </div>
                </li>
              ))
            ) : (
              <li className="no-eventsx">No events found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;