// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Navbar from "../components/feedback/Navbar";
import Footer from "../components/feedback/Footer";

const FeedBack = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Welcome to the Habesha Hospitality Hub
        </h1>
        <p className="text-lg text-neutral-darker mb-8">
          Improving guest experiences through real-time feedback.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-left">
            <h3 className="font-semibold text-secondary mb-2">Give Feedback</h3>
            <p className="text-sm text-neutral-dark mb-3">
              Share your experience quickly and easily. Help us serve you
              better.
            </p>
            <Link to={user ? "/feedback" : "/login"}>
              <Button variant="secondary" size="sm">
                {" "}
                {user ? "Provide Feedback Now" : "Login to Give Feedback"}{" "}
              </Button>
            </Link>
          </Card>

          {user && (user.role === "staff" || user.role === "admin") && (
            <Card className="text-left">
              <h3 className="font-semibold text-purple-600 mb-2">
                Staff: Log Feedback
              </h3>
              <p className="text-sm text-neutral-dark mb-3">
                Log feedback received verbally or observed directly from guests.
              </p>
              <Link to="/staff/log">
                <Button variant="outline" size="sm">
                  {" "}
                  Log Entry{" "}
                </Button>
              </Link>
            </Card>
          )}

          {user && user.role === "admin" && (
            <Card className="text-left">
              <h3 className="font-semibold text-red-600 mb-2">
                Admin Dashboard
              </h3>
              <p className="text-sm text-neutral-dark mb-3">
                View all feedback, track alerts, and analyze trends.
              </p>
              <Link to="/admin/dashboard">
                <Button variant="danger" size="sm">
                  {" "}
                  View Dashboard{" "}
                </Button>
              </Link>
            </Card>
          )}
        </div>
        {/* Add more promotional content or info graphics here */}
      </div>
      <Footer />
    </>
  );
};

export default FeedBack;
