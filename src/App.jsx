import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Nav from "./nav";
import Footer from "./footer";
import Landbody from "./landbody";
import LoginPage from "./login";
import Dash from "./dashboard";
import Profile from "./profile";
import ViewProfile from "./viewprofile";
import JobListings from "./JobListings";
import JobPostForm from "./JobPostForm";
import CreatePost from "./CreatePost";
import PostList from "./PostList";
import AdminLogin from "./Adlogin";
import AdminDashboard from "./AdminDashboard";
import About from "./about";
import EventListing from "./eventlisting";
import Chat from "./chat";




function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const hideNavRoutes = ["/view-profile", "/jobs", "/community", "/login", "/post-job", "/create-post", "/admin-login","/admin/dashboard","/events","/chat"];
  const showFooterRoutes = ["/", "/dashboard", "/login", "/admin-login"];
  const shouldHideNav = hideNavRoutes.some((path) => location.pathname.startsWith(path));
  const shouldShowFooter = showFooterRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!shouldHideNav && <Nav />}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Landbody />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dash />} />
          <Route path="/events" element={<EventListing />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/post-job" element={<JobPostForm onSuccess={() => (window.location.href = "/jobs")} />} />
          <Route path="/view-profile/:id" element={<ViewProfile />} />
          <Route path="/profile/:id" element={<Profile key={window.location.pathname} />} />
          <Route path="/community" element={<PostList />} />
          <Route path="/create-post" element={<CreatePost onPostCreated={() => (window.location.href = "/community")} />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/chat/:userId/:recipientId" element={<Chat />} />
          <Route path="*" element={<h1 style={{ textAlign: "center" }}>404 - Page Not Found</h1>} />
        </Routes>
      </div>

      {/* Show footer only on specific pages */}
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default App;