"use client";

import { useEffect, useState } from "react";
import { Subscription } from "@/app/lib/db";

export default function VerifyPage({
  params,
}: {
  params: Promise<{ subscriptionId: string }>;
}) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const { subscriptionId } = await params;
        const response = await fetch(`/api/verify/${subscriptionId}`);
        const data = await response.json();

        if (mounted) {
          if (response.ok) {
            setSubscription(data.subscription);
          } else {
            setError(data.error);
          }
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to fetch subscription");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [params]); // params as dependency

  const handleRedeem = async () => {
    try {
      setRedeeming(true);
      const { subscriptionId } = await params;
      const response = await fetch(`/api/redeem/${subscriptionId}`, {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setSubscription(data.subscription);
        setRedeemed(true);
      } else {
        setError(data.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to redeem drink");
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Verifying subscription...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-8">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Verify Subscription
          </h1>

          {error ? (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          ) : null}

          {subscription ? (
            <div className="space-y-6">
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

              {redeemed ? (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-3 text-sm font-medium text-green-700 dark:text-green-200">
                      Drink successfully redeemed!
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleRedeem}
                  disabled={
                    redeeming || subscription.daily_drinks_remaining <= 0
                  }
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {redeeming ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : subscription.daily_drinks_remaining <= 0 ? (
                    "No drinks remaining today"
                  ) : (
                    "Confirm Redemption"
                  )}
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Subscription not found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
