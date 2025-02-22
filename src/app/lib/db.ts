import { supabase } from "./supabase";

export interface Subscription {
  id: string;
  user_id: string;
  daily_drinks_remaining: number;
  last_reset_date: Date;
  created_at: Date;
}

export interface Redemption {
  id: string;
  subscription_id: string;
  created_at: Date;
}

export const dbUtils = {
  // Get subscription for a user
  async getSubscriptionByUserId(userId: string) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      // If no subscription found, return null instead of throwing error
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data as Subscription;
  },

  // Get subscription by id
  async getSubscriptionById(subscriptionId: string) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .single();

    if (error) {
      // If no subscription found, return null instead of throwing error
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }
    return data as Subscription;
  },

  // Create new subscription
  async createSubscription(userId: string) {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert([{ user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data as Subscription;
  },

  // Update drinks remaining
  async updateDrinksRemaining(subscriptionId: string, drinks: number) {
    const { data, error } = await supabase
      .from("subscriptions")
      .update({ daily_drinks_remaining: drinks })
      .eq("id", subscriptionId)
      .select()
      .single();

    if (error) throw error;
    return data as Subscription;
  },

  // Create redemption
  async createRedemption(subscriptionId: string) {
    const { data, error } = await supabase
      .from("redemptions")
      .insert([{ subscription_id: subscriptionId }])
      .select()
      .single();

    if (error) throw error;
    return data as Redemption;
  },

  // Reset daily drinks (to be called by cron job or similar)
  async resetDailyDrinks() {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        daily_drinks_remaining: 3,
        last_reset_date: new Date().toISOString(),
      })
      .filter(
        "last_reset_date",
        "lt",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      );

    if (error) throw error;
  },

  // Get redemption history for a subscription
  async getRedemptions(subscriptionId: string) {
    const { data, error } = await supabase
      .from("redemptions")
      .select("*")
      .eq("subscription_id", subscriptionId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Redemption[];
  },
};
