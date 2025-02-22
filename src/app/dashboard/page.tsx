"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Subscription } from "../lib/db";

export default function DashboardPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscription/status");
      const data = await response.json();

      if (response.ok) {
        setSubscription(data.subscription);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to fetch subscription status");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const response = await fetch("/api/subscription/create", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setSubscription(data.subscription);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to create subscription");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Coffee Shop Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!subscription ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Get Started</h2>
          <p className="mb-4">
            You don&apos;t have an active subscription yet.
          </p>
          <button
            onClick={handleSubscribe}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Subscribe Now (Mock Payment)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Subscription Status</h2>
            <div className="space-y-2">
              <p>
                Drinks Remaining Today:{" "}
                <span className="font-semibold">
                  {subscription.daily_drinks_remaining}
                </span>
              </p>
              <p>
                Last Reset:{" "}
                <span className="font-semibold">
                  {new Date(subscription.last_reset_date).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your QR Code</h2>
            <div className="flex justify-center">
              <QRCodeSVG
                value={subscription.id}
                size={200}
                level="H"
                includeMargin
              />
            </div>
            <p className="text-center mt-4 text-sm text-gray-600">
              Show this to the barista to redeem your drink
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
