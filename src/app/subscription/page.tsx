"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Subscription } from "../lib/db";

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/subscription");
      const data = await response.json();

      if (response.ok) {
        setSubscription(data.subscription);
      } else {
        setError(data.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to fetch subscription status");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subscription", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setSubscription(data.subscription);
        setError(null);
      } else {
        setError(data.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to create subscription");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading your coffee subscription...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your Coffee Subscription
          </h1>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {!subscription ? (
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4M12 20V4"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
                Start Your Coffee Journey
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Subscribe now to enjoy daily coffee benefits
              </p>
            </div>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                "Subscribe Now"
              )}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Subscription Status
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Drinks Remaining Today
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {subscription.daily_drinks_remaining}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last Reset
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(subscription.last_reset_date).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Your QR Code
              </h2>
              <div className="bg-white rounded-lg p-4 flex flex-col items-center">
                <QRCodeSVG
                  value={`${window.location.origin}/verify/${subscription.id}`}
                  size={200}
                  level="H"
                  includeMargin
                  className="dark:bg-white p-2 rounded"
                />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                  Show this QR code to the barista to redeem your drink
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
