/* Tamkeen hybrid cart: session-only guests, private Supabase carts for authenticated users. */
(() => {
  "use strict";

  const guestKey = "tamkeenGuestCartV1";
  const authKey = "tamkeenCustomerSessionV1";
  const oldIdsKey = "tamkeenBlueSaved";
  const oldQtyKey = "tamkeenBlueCartQty";
  const settings = window.TAMKEEN_SUPABASE || {};
  const base = String(settings.url || "").replace(/\/+$/, "");
  const apiKey = settings.anonKey || "";
  const validConfig = /^https:\/\/[^/]+\.supabase\.co$/.test(base) && Boolean(apiKey);
  const eventName = "tamkeen-cart-changed";
  let session = null;
  let items = {};
  let revision = 0;
  let remoteQueue = Promise.resolve();

  function readJson(storage, key, fallback) {
    try {
      return JSON.parse(storage.getItem(key) || "null") ?? fallback;
    } catch {
      return fallback;
    }
  }

  function clean(value) {
    const output = {};
    if (!value || typeof value !== "object" || Array.isArray(value)) return output;
    for (const [id, qty] of Object.entries(value)) {
      if (/^(catalog-\d+|[a-zA-Z0-9_-]{1,100})$/.test(id)) {
        output[id] = Math.max(1, Math.min(99, Math.floor(Number(qty) || 1)));
      }
    }
    return output;
  }

  function notify() {
    window.dispatchEvent(new Event(eventName));
    window.TamkeenRefreshCart?.();
  }

  function loadGuest() {
    return clean(readJson(sessionStorage, guestKey, {}));
  }

  function storeGuest() {
    sessionStorage.setItem(guestKey, JSON.stringify(items));
  }

  function migrateLegacy() {
    // Legacy localStorage is shared across visitors on the same browser.
    // Do not import it into any customer session; remove it to prevent leakage.
    localStorage.removeItem(oldIdsKey);
    localStorage.removeItem(oldQtyKey);
  }

  async function request(path, options = {}, retry = true) {
    if (!validConfig) throw new Error("Supabase public configuration is missing.");
    const headers = {
      apikey: apiKey,
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...options.headers,
    };
    const response = await fetch(base + path, { ...options, headers });
    if (response.status === 401 && session?.refresh_token && retry) {
      await refreshSession();
      return request(path, options, false);
    }
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.msg || body.message || body.error_description || body.error || `Request failed (${response.status})`);
    }
    if (response.status === 204) return null;
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  function saveSession(value) {
    session = value?.access_token && value?.user?.id ? value : null;
    if (session) sessionStorage.setItem(authKey, JSON.stringify(session));
    else sessionStorage.removeItem(authKey);
    window.dispatchEvent(new Event("tamkeen-auth-changed"));
  }

  async function refreshSession() {
    if (!session?.refresh_token) throw new Error("Please sign in again.");
    const result = await fetch(base + "/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      headers: { apikey: apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    if (!result.ok) {
      saveSession(null);
      items = loadGuest();
      notify();
      throw new Error("Your session has expired. Please sign in again.");
    }
    saveSession(await result.json());
  }

  function user() {
    return session?.user || null;
  }

  async function readRemote() {
    if (!user()) return {};
    const rows = await request(`/rest/v1/customer_cart_items?select=course_id,quantity&user_id=eq.${encodeURIComponent(user().id)}`);
    return clean(Object.fromEntries((rows || []).map((row) => [row.course_id, row.quantity])));
  }

  async function writeRemote(snapshot, accountId) {
    if (!session || session.user.id !== accountId) return;
    const rows = Object.entries(snapshot).map(([course_id, quantity]) => ({
      user_id: accountId,
      course_id,
      quantity,
    }));
    // Use an RPC transaction so removals and quantity changes are atomic.
    await request("/rest/v1/rpc/replace_customer_cart", {
      method: "POST",
      body: JSON.stringify({ new_items: rows }),
    });
  }

  function scheduleSync() {
    if (!user()) return;
    const accountId = user().id;
    const snapshot = { ...items };
    const currentRevision = ++revision;
    remoteQueue = remoteQueue
      .catch(() => {})
      .then(async () => {
        if (currentRevision !== revision || user()?.id !== accountId) return;
        await writeRemote(snapshot, accountId);
      })
      .catch((error) => {
        console.error("Tamkeen cart could not sync:", error);
        window.dispatchEvent(new CustomEvent("tamkeen-cart-sync-error", { detail: error.message }));
      });
  }

  function update(next) {
    items = clean(next);
    if (user()) scheduleSync();
    else storeGuest();
    notify();
  }

  async function loadAccountCart(mergeGuest = false) {
    const accountId = user()?.id;
    if (!accountId) return;
    const remote = await readRemote();
    if (user()?.id !== accountId) return;
    const guest = mergeGuest ? loadGuest() : {};
    // Merge by maximum quantity, never double-add a course already in the account.
    const merged = { ...remote };
    for (const [id, qty] of Object.entries(guest)) {
      merged[id] = Math.max(merged[id] || 0, qty);
    }
    items = clean(merged);
    notify();
    if (mergeGuest && Object.keys(guest).length) {
      await writeRemote(items, accountId);
      sessionStorage.removeItem(guestKey);
    }
  }

  async function login(email, password) {
    const result = await request("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    saveSession(result);
    await loadAccountCart(true);
    return user();
  }

  async function register(email, password) {
    return request("/auth/v1/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async function resetPassword(email) {
    return request("/auth/v1/recover", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async function logout() {
    const token = session?.access_token;
    revision++;
    saveSession(null);
    items = {};
    sessionStorage.removeItem(guestKey);
    notify();
    if (token && validConfig) {
      try {
        await fetch(base + "/auth/v1/logout", {
          method: "POST",
          headers: { apikey: apiKey, Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.warn("Remote logout unavailable; local session cleared.", error);
      }
    }
  }

  migrateLegacy();
  items = loadGuest();
  session = readJson(sessionStorage, authKey, null);
  if (!session?.user?.id || !session?.access_token) session = null;

  const ready = (async () => {
    if (!session) return;
    try {
      if (session.expires_at && Date.now() / 1000 > session.expires_at - 60) {
        await refreshSession();
      }
      await loadAccountCart(false);
    } catch (error) {
      console.error("Unable to load account cart:", error);
      // Never display a previous account's cart as a guest cart.
      if (!user()) {
        items = loadGuest();
        notify();
      }
    }
  })();

  window.TamkeenCart = {
    ready,
    user,
    async getPurchaseHistory() {
      if (!user()) throw new Error("Please sign in to view your purchase history.");
      if (session.expires_at && Date.now() / 1000 > session.expires_at - 60) await refreshSession();
      return request("/rest/v1/customer_purchases?select=id,course_id,course_title,amount,currency,purchased_at,payment_status&order=purchased_at.desc", {method:"GET"});
    },
    login,
    register,
    resetPassword,
    logout,
    ids: () => Object.keys(items),
    quantities: () => ({ ...items }),
    setIds(ids) {
      const next = {};
      for (const id of ids) next[id] = items[id] || 1;
      update(next);
    },
    setQuantity(id, quantity) {
      update({ ...items, [id]: quantity });
    },
    add(id) {
      if (!id || items[id]) return;
      update({ ...items, [id]: 1 });
    },
    clear() {
      update({});
    },
  };
  document.addEventListener("DOMContentLoaded", notify);
})();
