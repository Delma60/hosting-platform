// Cart state hook placeholder
"use client";

/**
 * useCart — Persistent shopping cart
 *
 * - Authenticated users: cart synced to Firestore `/carts/{uid}`
 * - Guests: cart persisted in localStorage under "hf_cart"
 * - On login, guest cart is merged into Firestore cart automatically
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartItemType = "domain" | "hosting" | "vps" | "ssl" | "addon";

export interface CartItem {
  /** Unique key within the cart — e.g. "swiftpay.ng" or "plan_business_monthly" */
  id: string;
  type: CartItemType;
  name: string;
  /** Human-readable description shown in cart UI */
  description?: string;
  /** Price in kobo/cents to avoid floating-point issues */
  priceKobo: number;
  currency: "NGN" | "USD";
  quantity: number;
  /** Billing period — relevant for hosting/VPS/SSL */
  billingCycle?: "monthly" | "annual" | "once";
  /** Extra metadata (tld, renewalPrice, etc.) */
  meta?: Record<string, unknown>;
}

interface CartState {
  items: CartItem[];
  /** UID of the owner whose Firestore cart is currently subscribed */
  _subscribedUid: string | null;
  _unsubscribe: Unsubscribe | null;
}

interface CartActions {
  /** Add item or increment quantity if it already exists */
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  /** Remove an item entirely */
  removeItem: (id: string) => void;
  /** Update the quantity of an item (removes if qty ≤ 0) */
  setQuantity: (id: string, quantity: number) => void;
  /** Empty the cart */
  clear: () => void;
  /** Total item count (sum of quantities) */
  totalItems: () => number;
  /** Total price in kobo */
  totalKobo: () => number;
  /** Format total as ₦ string */
  totalFormatted: () => string;
  /** Called by AuthProvider after login — syncs guest cart → Firestore */
  onLogin: (uid: string) => Promise<void>;
  /** Called by AuthProvider on logout — tears down Firestore subscription */
  onLogout: () => void;
}

// ─── Firestore helpers ────────────────────────────────────────────────────────

const cartDocRef = (uid: string) => doc(db, "carts", uid);

async function loadFirestoreCart(uid: string): Promise<CartItem[]> {
  const snap = await getDoc(cartDocRef(uid));
  if (!snap.exists()) return [];
  return (snap.data().items as CartItem[]) ?? [];
}

async function saveFirestoreCart(uid: string, items: CartItem[]): Promise<void> {
  await setDoc(
    cartDocRef(uid),
    { items, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      items: [],
      _subscribedUid: null,
      _unsubscribe: null,

      // ── Mutators ──────────────────────────────────────────────────────────

      addItem(item) {
        const newItem: CartItem = { quantity: 1, ...item };
        set((state) => {
          const existing = state.items.find((i) => i.id === newItem.id);
          const items = existing
            ? state.items.map((i) =>
                i.id === newItem.id
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              )
            : [...state.items, newItem];
          _persist(get()._subscribedUid, items);
          return { items };
        });
      },

      removeItem(id) {
        set((state) => {
          const items = state.items.filter((i) => i.id !== id);
          _persist(get()._subscribedUid, items);
          return { items };
        });
      },

      setQuantity(id, quantity) {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => {
          const items = state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          );
          _persist(get()._subscribedUid, items);
          return { items };
        });
      },

      clear() {
        const uid = get()._subscribedUid;
        set({ items: [] });
        if (uid) {
          deleteDoc(cartDocRef(uid)).catch(console.error);
        }
      },

      // ── Selectors ─────────────────────────────────────────────────────────

      totalItems() {
        return get().items.reduce((acc, i) => acc + i.quantity, 0);
      },

      totalKobo() {
        return get().items.reduce(
          (acc, i) => acc + i.priceKobo * i.quantity,
          0
        );
      },

      totalFormatted() {
        const kobo = get().totalKobo();
        const naira = kobo / 100;
        return `₦${naira.toLocaleString("en-NG", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`;
      },

      // ── Auth lifecycle ────────────────────────────────────────────────────

      async onLogin(uid) {
        // Tear down any existing subscription first
        get().onLogout();

        const guestItems = get().items;
        const firestoreItems = await loadFirestoreCart(uid);

        // Merge: guest items win on conflict (guest was just browsing)
        const merged = mergeCartItems(firestoreItems, guestItems);
        await saveFirestoreCart(uid, merged);

        // Subscribe to real-time updates (multi-tab sync)
        const unsubscribe = onSnapshot(cartDocRef(uid), (snap) => {
          if (snap.exists()) {
            const items = (snap.data().items as CartItem[]) ?? [];
            set({ items });
          }
        });

        set({ items: merged, _subscribedUid: uid, _unsubscribe: unsubscribe });
      },

      onLogout() {
        const { _unsubscribe } = get();
        if (_unsubscribe) _unsubscribe();
        set({ _subscribedUid: null, _unsubscribe: null, items: [] });
      },
    }),
    {
      name: "hf_cart",
      storage: createJSONStorage(() => localStorage),
      // Only persist items — not Firestore subscription state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ─── Convenience hook (subset of store) ──────────────────────────────────────

export function useCart() {
  return useCartStore((s) => ({
    items: s.items,
    addItem: s.addItem,
    removeItem: s.removeItem,
    setQuantity: s.setQuantity,
    clear: s.clear,
    totalItems: s.totalItems(),
    totalKobo: s.totalKobo(),
    totalFormatted: s.totalFormatted(),
  }));
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Fire-and-forget Firestore write (only when logged in) */
function _persist(uid: string | null, items: CartItem[]) {
  if (!uid) return; // guest — localStorage handles persistence via zustand/persist
  saveFirestoreCart(uid, items).catch(console.error);
}

/** Merge two carts — second list (guest) takes precedence on duplicate IDs */
function mergeCartItems(base: CartItem[], override: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of base) map.set(item.id, item);
  for (const item of override) {
    if (map.has(item.id)) {
      // Add quantities together
      map.set(item.id, {
        ...item,
        quantity: (map.get(item.id)!.quantity ?? 0) + item.quantity,
      });
    } else {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
}