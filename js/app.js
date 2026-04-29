// =====================================================================
// IN-MEMORY DATABASE - Simulates MySQL tables
// =====================================================================
const DB = {
  users: [],
  locations: [],
  propertyTypes: [],
  owners: [],
  agents: [],
  properties: [],
  bookings: [],
  payments: [],
  reviews: []
};

const IDs = { users: 0, locations: 0, propertyTypes: 0, owners: 0, agents: 0, properties: 0, bookings: 0, payments: 0, reviews: 0 };
const nextId = (table) => ++IDs[table];

// =====================================================================
// SAMPLE DATA
// =====================================================================
function loadSampleData() {
  Object.keys(DB).forEach((k) => DB[k] = []);
  Object.keys(IDs).forEach((k) => IDs[k] = 0);

  [
    "Hyderabad,Telangana,500034,Banjara Hills",
    "Mumbai,Maharashtra,400005,Colaba",
    "Bengaluru,Karnataka,560034,Koramangala",
    "Delhi,Delhi,110001,Connaught Place",
    "Pune,Maharashtra,411038,Kothrud",
    "Chennai,Tamil Nadu,600028,Adyar"
  ].forEach((d) => {
    const [city, state, pincode, locality] = d.split(",");
    DB.locations.push({ location_id: nextId("locations"), city, state, pincode, locality, country: "India" });
  });

  DB.propertyTypes.push({ type_id: nextId("propertyTypes"), type_name: "Residential", parent_id: null, description: "All residential properties" });
  DB.propertyTypes.push({ type_id: nextId("propertyTypes"), type_name: "Commercial", parent_id: null, description: "Commercial properties" });
  DB.propertyTypes.push({ type_id: nextId("propertyTypes"), type_name: "Apartment", parent_id: 1, description: "Residential apartment" });
  DB.propertyTypes.push({ type_id: nextId("propertyTypes"), type_name: "Villa", parent_id: 1, description: "Independent villa" });
  DB.propertyTypes.push({ type_id: nextId("propertyTypes"), type_name: "Indep. House", parent_id: 1, description: "Independent house" });
  DB.propertyTypes.push({ type_id: nextId("propertyTypes"), type_name: "Office Space", parent_id: 2, description: "Commercial office" });
  DB.propertyTypes.push({ type_id: nextId("propertyTypes"), type_name: "Retail Shop", parent_id: 2, description: "Retail shop" });

  [
    ["Rajesh Kumar", "rk@gmail.com", "9876543210", "Individual", "Hyderabad"],
    ["Lakshmi Builders", "lb@builders.com", "9988776655", "Builder", "Mumbai"],
    ["Arjun Singh", "as@gmail.com", "9876501234", "Individual", "Delhi"],
    ["Prestige Group", "prestige@group.com", "8088001234", "Builder", "Bengaluru"]
  ].forEach(([n, e, p, t, c]) => {
    DB.owners.push({ owner_id: nextId("owners"), owner_name: n, contact_email: e, phone: p, owner_type: t, city: c, joined_date: "2023-01-15" });
  });

  [
    ["Priya Mehta", "priya@realty.com", "9871234567", "StarRealty Pvt Ltd", "MH/REA/2023/001"],
    ["Arun Patel", "arun@props.com", "9823456789", "PropStar India", "TG/REA/2022/044"],
    ["Sunita Reddy", "sunita@housing.com", "9945678901", "HousingPro", "DL/REA/2021/112"]
  ].forEach(([n, e, p, ag, l]) => {
    DB.agents.push({ agent_id: nextId("agents"), agent_name: n, contact_email: e, phone: p, agency_name: ag, license_no: l, joined_date: "2023-03-10" });
  });

  [
    ["rahul_sharma", "rahul@email.com", "9812345678", "buyer"],
    ["priya_tenant", "priya@email.com", "9823456780", "tenant"],
    ["admin_user", "admin@realty.com", "9834567890", "admin"],
    ["vikas_buyer", "vikas@email.com", "9845678901", "buyer"],
    ["meena_tenant", "meena@email.com", "9856789012", "tenant"]
  ].forEach(([u, e, p, r]) => {
    DB.users.push({ user_id: nextId("users"), username: u, email: e, phone: p, role: r, password_hash: "$2b$12$hashed", created_at: today() });
  });

  const props = [
    ["Luxury Villa in Banjara Hills", 4, 1, 2, 1, 35000000, 3200, 4, "Fully Furnished", "Sale", "Available"],
    ["3BHK Sea-View Apartment in Colaba", 3, 2, 1, 2, 18500000, 1450, 3, "Semi-Furnished", "Sale", "Available"],
    ["Independent House in Koramangala", 5, 4, null, 3, 12000000, 1800, 4, "Unfurnished", "Sale", "Sold"],
    ["Premium Office Space in Connaught Pl.", 6, 3, 3, 4, 9000000, 2200, 0, "Fully Furnished", "Lease", "Available"],
    ["2BHK Apartment in Kothrud", 3, 1, 1, 5, 6000000, 950, 2, "Semi-Furnished", "Rent", "Booked"],
    ["3BHK Apartment in Adyar", 3, 2, 2, 6, 8500000, 1300, 3, "Unfurnished", "Sale", "Available"],
    ["Retail Shop in Connaught Place", 7, 3, 3, 4, 4000000, 500, 0, "Unfurnished", "Sale", "Available"]
  ];
  props.forEach(([title, type_id, owner_id, agent_id, location_id, price, area, beds, furn, listing, status]) => {
    DB.properties.push({ property_id: nextId("properties"), title, type_id, owner_id, agent_id, location_id, price, area_sqft: area, bedrooms: beds, furnishing: furn, listing_type: listing, availability_status: status, created_at: today() });
  });

  const bookData = [
    [1, 1, "Purchase", 35000000, "Completed", "Advance paid"],
    [2, 4, "Purchase", 18500000, "Confirmed", "Document verification pending"],
    [3, 2, "Rent", 25000, "Completed", "Monthly rental agreement"],
    [4, 1, "SiteVisit", 0, "Completed", "Site visit done"],
    [5, 5, "Rent", 18000, "Confirmed", "Rental confirmed"],
    [6, 4, "Purchase", 8500000, "Pending", "Awaiting bank loan approval"],
    [7, 2, "SiteVisit", 0, "Cancelled", "Changed preference"]
  ];
  bookData.forEach(([pid, uid, type, amt, status, notes]) => {
    DB.bookings.push({ booking_id: nextId("bookings"), property_id: pid, user_id: uid, booking_date: today(), booking_type: type, total_amount: amt, status, notes });
  });

  const payData = [
    [1, 500000, "Bank Transfer", "Success"],
    [1, 34500000, "NEFT/RTGS", "Success"],
    [2, 1850000, "UPI", "Success"],
    [3, 25000, "UPI", "Success"],
    [5, 18000, "Bank Transfer", "Success"],
    [6, 100000, "Cheque", "Pending"]
  ];
  payData.forEach(([bid, amt, method, status]) => {
    DB.payments.push({ payment_id: nextId("payments"), booking_id: bid, amount: amt, payment_date: today(), payment_method: method, status });
  });

  const revData = [
    [1, 1, 5, "Excellent villa, worth every rupee! Great views."],
    [2, 4, 4, "Beautiful apartment, sea view is stunning."],
    [3, 2, 5, "Perfect location, smooth transaction."],
    [5, 5, 3, "Decent apartment, but maintenance could be better."],
    [1, 4, 4, "Premium property in great location."]
  ];
  revData.forEach(([pid, uid, rating, text]) => {
    DB.reviews.push({ review_id: nextId("reviews"), property_id: pid, user_id: uid, rating, review_text: text, created_at: today() });
  });

  toast("Sample data loaded! All 9 tables populated.", "success");
  refreshAll();
}

// =====================================================================
// HELPERS
// =====================================================================
function today() { return new Date().toISOString().split("T")[0]; }

function fmt(n) {
  if (n >= 10000000) return "INR " + (n / 10000000).toFixed(2) + " Cr";
  if (n >= 100000) return "INR " + (n / 100000).toFixed(2) + " L";
  return "INR " + Number(n || 0).toLocaleString("en-IN");
}

function getPropertyName(id) { const p = DB.properties.find((x) => x.property_id == id); return p ? p.title.substring(0, 30) + "..." : "-"; }
function getOwnerName(id) { const o = DB.owners.find((x) => x.owner_id == id); return o ? o.owner_name : "-"; }
function getTypeName(id) { const t = DB.propertyTypes.find((x) => x.type_id == id); return t ? t.type_name : "-"; }
function getLocationCity(id) { const l = DB.locations.find((x) => x.location_id == id); return l ? l.city : "-"; }
function getUserName(id) { const u = DB.users.find((x) => x.user_id == id); return u ? u.username : "-"; }

function statusBadge(s) {
  const m = {
    Available: "available", Booked: "booked", Sold: "sold", "Under Construction": "construction",
    Pending: "pending", Confirmed: "confirmed", Completed: "completed", Cancelled: "cancelled",
    Success: "success", Failed: "failed", buyer: "buyer", tenant: "tenant", agent: "agent", admin: "admin"
  };
  return `<span class="badge badge-${m[s] || "pending"}">${s}</span>`;
}

function stars(n) { return "★".repeat(n) + "☆".repeat(5 - n); }

// =====================================================================
// NAVIGATION
// =====================================================================
const pageTitles = {
  dashboard: ["Dashboard", "Real Estate Management System Overview"],
  properties: ["Properties", "Manage property listings and catalog"],
  bookings: ["Bookings", "Full lifecycle booking management"],
  payments: ["Payments", "Transaction records (CASCADE on delete)"],
  reviews: ["Reviews", "Customer reviews with 1-per-user constraint"],
  users: ["Users", "Role-based access control (RBAC)"],
  agents: ["Agents", "Licensed agent registry (unique license enforcement)"],
  owners: ["Owners", "Individual & Builder owner management"],
  locations: ["Locations", "Location master data (geo-based filtering)"],
  analytics: ["Analytics", "Data insights & visualizations"],
  sql: ["SQL Reference", "Schema & query implementations"]
};

function showPage(page) {
  document.querySelectorAll(".page-content").forEach((p) => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
  const pageEl = document.getElementById("page-" + page);
  if (pageEl) pageEl.classList.add("active");
  const [title, sub] = pageTitles[page] || ["Dashboard", "Overview"];
  document.getElementById("topbar-title").textContent = title;
  document.getElementById("topbar-sub").textContent = sub;
  if (page === "analytics") renderAnalytics();
  if (page === "sql") renderSQL(0);
}

function showAddModal() {
  const active = document.querySelector(".page-content.active").id.replace("page-", "");
  const modals = {
    properties: "modal-add-property", bookings: "modal-add-booking",
    payments: "modal-add-payment", reviews: "modal-add-review", users: "modal-add-user",
    agents: "modal-add-agent", owners: "modal-add-owner", locations: "modal-add-location"
  };
  if (modals[active]) { populateDropdowns(); openModal(modals[active]); }
}

// =====================================================================
// MODAL CONTROL
// =====================================================================
function openModal(id) { populateDropdowns(); document.getElementById(id).classList.add("active"); }
function closeModal(id) { document.getElementById(id).classList.remove("active"); }

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) e.target.classList.remove("active");
});

function populateDropdowns() {
  const typeOpts = DB.propertyTypes.map((t) => `<option value="${t.type_id}">${t.type_name}</option>`).join("");
  const ownerOpts = DB.owners.map((o) => `<option value="${o.owner_id}">${o.owner_name}</option>`).join("");
  const agentOpts = '<option value="">No agent</option>' + DB.agents.map((a) => `<option value="${a.agent_id}">${a.agent_name}</option>`).join("");
  const locOpts = DB.locations.map((l) => `<option value="${l.location_id}">${l.city} - ${l.locality || l.state}</option>`).join("");
  const propOpts = DB.properties.map((p) => `<option value="${p.property_id}">${p.title.substring(0, 40)}</option>`).join("");
  const userOpts = DB.users.map((u) => `<option value="${u.user_id}">${u.username}</option>`).join("");
  const bookOpts = DB.bookings.map((b) => `<option value="${b.booking_id}">Booking #${b.booking_id} - ${getPropertyName(b.property_id)}</option>`).join("");

  if (document.getElementById("p-type")) {
    document.getElementById("p-type").innerHTML = '<option value="">Select type...</option>' + typeOpts;
    document.getElementById("p-owner").innerHTML = '<option value="">Select owner...</option>' + ownerOpts;
    document.getElementById("p-agent").innerHTML = agentOpts;
    document.getElementById("p-location").innerHTML = '<option value="">Select location...</option>' + locOpts;
  }
  if (document.getElementById("b-property")) {
    document.getElementById("b-property").innerHTML = '<option value="">Select property...</option>' + propOpts;
    document.getElementById("b-user").innerHTML = '<option value="">Select user...</option>' + userOpts;
  }
  if (document.getElementById("pay-booking")) {
    document.getElementById("pay-booking").innerHTML = '<option value="">Select booking...</option>' + bookOpts;
  }
  if (document.getElementById("r-property")) {
    document.getElementById("r-property").innerHTML = '<option value="">Select property...</option>' + propOpts;
    document.getElementById("r-user").innerHTML = '<option value="">Select user...</option>' + userOpts;
  }

  const ptFilter = document.getElementById("prop-filter-type");
  if (ptFilter) ptFilter.innerHTML = '<option value="">All Types</option>' + typeOpts;
}

// =====================================================================
// CRUD - ADD RECORDS
// =====================================================================
function addProperty() {
  const title = document.getElementById("p-title").value.trim();
  const type_id = +document.getElementById("p-type").value;
  const owner_id = +document.getElementById("p-owner").value;
  const agent_id = +document.getElementById("p-agent").value || null;
  const location_id = +document.getElementById("p-location").value;
  const price = +document.getElementById("p-price").value;
  const area_sqft = +document.getElementById("p-area").value;
  const bedrooms = +document.getElementById("p-bedrooms").value || 0;
  const listing_type = document.getElementById("p-listing").value;
  const furnishing = document.getElementById("p-furnishing").value;
  const availability_status = document.getElementById("p-status").value;

  if (!title || !type_id || !owner_id || !location_id) return toast("Fill all required fields", "error");
  if (price < 0) return toast("Price must be >= 0", "error");
  if (area_sqft <= 0) return toast("Area must be > 0", "error");

  DB.properties.push({ property_id: nextId("properties"), title, type_id, owner_id, agent_id, location_id, price, area_sqft, bedrooms, furnishing, listing_type, availability_status, created_at: today() });
  closeModal("modal-add-property");
  toast("Property added successfully", "success");
  refreshAll();
}

function addBooking() {
  const property_id = +document.getElementById("b-property").value;
  const user_id = +document.getElementById("b-user").value;
  const booking_type = document.getElementById("b-type").value;
  const total_amount = +document.getElementById("b-amount").value || 0;
  const status = document.getElementById("b-status").value;
  const notes = document.getElementById("b-notes").value;

  if (!property_id || !user_id) return toast("Select property and user", "error");
  if (total_amount < 0) return toast("Amount must be >= 0", "error");

  DB.bookings.push({ booking_id: nextId("bookings"), property_id, user_id, booking_date: today(), booking_type, total_amount, status, notes });
  if (status === "Confirmed") {
    const prop = DB.properties.find((p) => p.property_id === property_id);
    if (prop) prop.availability_status = "Booked";
  }
  closeModal("modal-add-booking");
  toast("Booking created", "success");
  refreshAll();
}

function addPayment() {
  const booking_id = +document.getElementById("pay-booking").value;
  const amount = +document.getElementById("pay-amount").value;
  const payment_method = document.getElementById("pay-method").value;
  const status = document.getElementById("pay-status").value;

  if (!booking_id) return toast("Select a booking", "error");
  if (amount <= 0) return toast("Amount must be > 0", "error");

  DB.payments.push({ payment_id: nextId("payments"), booking_id, amount, payment_date: today(), payment_method, status });
  closeModal("modal-add-payment");
  toast("Payment recorded", "success");
  refreshAll();
}

function addReview() {
  const property_id = +document.getElementById("r-property").value;
  const user_id = +document.getElementById("r-user").value;
  const rating = +document.getElementById("r-rating").value;
  const review_text = document.getElementById("r-text").value;

  if (!property_id || !user_id) return toast("Select property and user", "error");
  if (DB.reviews.find((r) => r.property_id === property_id && r.user_id === user_id)) return toast("User already reviewed this property", "error");

  DB.reviews.push({ review_id: nextId("reviews"), property_id, user_id, rating, review_text, created_at: today() });
  closeModal("modal-add-review");
  toast("Review submitted", "success");
  refreshAll();
}

function addUser() {
  const username = document.getElementById("u-name").value.trim();
  const email = document.getElementById("u-email").value.trim();
  const phone = document.getElementById("u-phone").value.trim();
  const role = document.getElementById("u-role").value;

  if (!username || !email) return toast("Username and email required", "error");
  if (DB.users.find((u) => u.username === username)) return toast("Username already taken", "error");
  if (DB.users.find((u) => u.email === email)) return toast("Email already registered", "error");

  DB.users.push({ user_id: nextId("users"), username, email, phone, role, password_hash: "$2b$12$" + Math.random().toString(36).substring(2, 14), created_at: today() });
  closeModal("modal-add-user");
  toast("User registered", "success");
  refreshAll();
}

function addAgent() {
  const agent_name = document.getElementById("ag-name").value.trim();
  const contact_email = document.getElementById("ag-email").value.trim();
  const agency_name = document.getElementById("ag-agency").value.trim();
  const license_no = document.getElementById("ag-license").value.trim();
  const phone = document.getElementById("ag-phone").value.trim();

  if (!agent_name || !contact_email || !license_no) return toast("Name, email, and license required", "error");
  if (DB.agents.find((a) => a.license_no === license_no)) return toast("License number already registered", "error");
  if (DB.agents.find((a) => a.contact_email === contact_email)) return toast("Email already registered", "error");

  DB.agents.push({ agent_id: nextId("agents"), agent_name, contact_email, phone, agency_name, license_no, joined_date: today() });
  closeModal("modal-add-agent");
  toast("Agent registered", "success");
  refreshAll();
}

function addOwner() {
  const owner_name = document.getElementById("ow-name").value.trim();
  const contact_email = document.getElementById("ow-email").value.trim();
  const owner_type = document.getElementById("ow-type").value;
  const city = document.getElementById("ow-city").value.trim();
  const phone = document.getElementById("ow-phone").value.trim();

  if (!owner_name || !contact_email) return toast("Name and email required", "error");
  if (DB.owners.find((o) => o.contact_email === contact_email)) return toast("Email already exists", "error");

  DB.owners.push({ owner_id: nextId("owners"), owner_name, contact_email, phone, owner_type, city, joined_date: today() });
  closeModal("modal-add-owner");
  toast("Owner added", "success");
  refreshAll();
}

function addLocation() {
  const city = document.getElementById("l-city").value.trim();
  const state = document.getElementById("l-state").value.trim();
  const pincode = document.getElementById("l-pin").value.trim();
  const locality = document.getElementById("l-locality").value.trim();
  const country = document.getElementById("l-country").value.trim() || "India";

  if (!city || !state || !pincode) return toast("City, state, and pincode required", "error");

  DB.locations.push({ location_id: nextId("locations"), city, state, pincode, locality, country });
  closeModal("modal-add-location");
  toast("Location added", "success");
  refreshAll();
}

// =====================================================================
// DELETE + UPDATE
// =====================================================================
function deleteRecord(table, idField, id) {
  if (!confirm("Delete this record? This action cannot be undone.")) return;
  if (table === "bookings") DB.payments = DB.payments.filter((p) => p.booking_id !== id);
  DB[table] = DB[table].filter((r) => r[idField] !== id);
  toast("Record deleted", "info");
  refreshAll();
}

function updateBookingStatus(id, status) {
  const b = DB.bookings.find((x) => x.booking_id === id);
  if (!b) return;
  b.status = status;
  const prop = DB.properties.find((p) => p.property_id === b.property_id);
  if (prop) {
    if (status === "Confirmed") prop.availability_status = "Booked";
    else if (status === "Completed" && b.booking_type === "Purchase") prop.availability_status = "Sold";
    else if (status === "Cancelled") prop.availability_status = "Available";
  }
  toast(`Booking status updated to ${status}`, "success");
  refreshAll();
}

// =====================================================================
// RENDERERS
// =====================================================================
function renderProperties() {
  const search = (document.getElementById("prop-search") || { value: "" }).value.toLowerCase();
  const statusF = (document.getElementById("prop-filter-status") || { value: "" }).value;
  const typeF = (document.getElementById("prop-filter-type") || { value: "" }).value;

  const data = DB.properties.filter((p) => {
    const city = getLocationCity(p.location_id).toLowerCase();
    const match = !search || p.title.toLowerCase().includes(search) || city.includes(search);
    const statMatch = !statusF || p.availability_status === statusF;
    const typeMatch = !typeF || p.type_id == typeF;
    return match && statMatch && typeMatch;
  });

  const el = document.getElementById("properties-table");
  const cnt = document.getElementById("prop-count");
  if (cnt) cnt.textContent = data.length + " records";

  el.innerHTML = data.length ? data.map((p) => `
    <tr>
      <td><strong>#${p.property_id}</strong></td>
      <td><strong>${p.title}</strong><br><small style="color:var(--text-muted)">${p.bedrooms > 0 ? p.bedrooms + " BHK · " : ""} ${p.area_sqft} sq.ft · ${p.furnishing}</small></td>
      <td>${getTypeName(p.type_id)}</td>
      <td>${getOwnerName(p.owner_id)}</td>
      <td>${getLocationCity(p.location_id)}</td>
      <td><strong>${fmt(p.price)}</strong></td>
      <td>${p.listing_type}</td>
      <td>${statusBadge(p.availability_status)}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-danger btn-sm" onclick="deleteRecord('properties','property_id',${p.property_id})">Delete</button>
      </td>
    </tr>`).join("") : '<tr><td colspan="9" class="no-data">No properties match filters</td></tr>';
}

function renderBookings() {
  const statusF = (document.getElementById("book-filter-status") || { value: "" }).value;
  const typeF = (document.getElementById("book-filter-type") || { value: "" }).value;
  const data = DB.bookings.filter((b) => (!statusF || b.status === statusF) && (!typeF || b.booking_type === typeF));
  const el = document.getElementById("bookings-table");
  const cnt = document.getElementById("book-count");
  if (cnt) cnt.textContent = data.length + " records";
  el.innerHTML = data.length ? data.map((b) => `
    <tr>
      <td><strong>#${b.booking_id}</strong></td>
      <td>${getPropertyName(b.property_id)}</td>
      <td>${getUserName(b.user_id)}</td>
      <td>${b.booking_date}</td>
      <td>${b.booking_type}</td>
      <td>${b.total_amount > 0 ? fmt(b.total_amount) : "Free visit"}</td>
      <td>${statusBadge(b.status)}</td>
      <td style="white-space:nowrap">
        <select onchange="updateBookingStatus(${b.booking_id},this.value)" style="background:var(--bg-secondary);border:1px solid var(--border-light);border-radius:6px;padding:4px 8px;color:var(--text-primary);font-size:11px;cursor:pointer">
          ${["Pending", "Confirmed", "Completed", "Cancelled"].map((s) => `<option ${b.status === s ? "selected" : ""}>${s}</option>`).join("")}
        </select>
        <button class="btn btn-danger btn-sm" onclick="deleteRecord('bookings','booking_id',${b.booking_id})" style="margin-left:4px">Delete</button>
      </td>
    </tr>`).join("") : '<tr><td colspan="8" class="no-data">No bookings</td></tr>';
}

function renderPayments() {
  const statusF = (document.getElementById("pay-filter-status") || { value: "" }).value;
  const data = DB.payments.filter((p) => !statusF || p.status === statusF);
  const el = document.getElementById("payments-table");
  el.innerHTML = data.length ? data.map((p) => {
    const b = DB.bookings.find((x) => x.booking_id === p.booking_id);
    return `<tr>
      <td><strong>#${p.payment_id}</strong></td>
      <td>Booking #${p.booking_id}</td>
      <td>${b ? getPropertyName(b.property_id) : "-"}</td>
      <td><strong>${fmt(p.amount)}</strong></td>
      <td>${p.payment_method || "-"}</td>
      <td>${p.payment_date}</td>
      <td>${statusBadge(p.status)}</td>
    </tr>`;
  }).join("") : '<tr><td colspan="7" class="no-data">No payments</td></tr>';
}

function renderReviews() {
  const el = document.getElementById("reviews-table");
  el.innerHTML = DB.reviews.length ? DB.reviews.map((r) => `
    <tr>
      <td><strong>#${r.review_id}</strong></td>
      <td>${getPropertyName(r.property_id)}</td>
      <td>${getUserName(r.user_id)}</td>
      <td><span class="stars">${stars(r.rating)}</span></td>
      <td>${r.review_text || "-"}</td>
      <td>${r.created_at}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteRecord('reviews','review_id',${r.review_id})">Delete</button></td>
    </tr>`).join("") : '<tr><td colspan="7" class="no-data">No reviews</td></tr>';
}

function renderUsers() {
  const search = (document.getElementById("user-search") || { value: "" }).value.toLowerCase();
  const roleF = (document.getElementById("user-filter-role") || { value: "" }).value;
  const data = DB.users.filter((u) => (!search || u.username.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)) && (!roleF || u.role === roleF));
  const el = document.getElementById("users-table");
  el.innerHTML = data.length ? data.map((u) => `
    <tr>
      <td><strong>#${u.user_id}</strong></td>
      <td><strong>${u.username}</strong></td>
      <td>${u.email}</td>
      <td>${u.phone || "-"}</td>
      <td>${statusBadge(u.role)}</td>
      <td>${u.created_at}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteRecord('users','user_id',${u.user_id})">Delete</button></td>
    </tr>`).join("") : '<tr><td colspan="7" class="no-data">No users</td></tr>';
}

function renderAgents() {
  const search = (document.getElementById("agent-search") || { value: "" }).value.toLowerCase();
  const data = DB.agents.filter((a) => !search || a.agent_name.toLowerCase().includes(search) || (a.agency_name || "").toLowerCase().includes(search));
  const el = document.getElementById("agents-table");
  el.innerHTML = data.length ? data.map((a) => `
    <tr>
      <td><strong>#${a.agent_id}</strong></td>
      <td><strong>${a.agent_name}</strong></td>
      <td>${a.agency_name || "-"}</td>
      <td>${a.contact_email}</td>
      <td><code style="background:var(--bg-secondary);padding:2px 6px;border-radius:4px;font-size:11px">${a.license_no}</code></td>
      <td>${a.joined_date}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteRecord('agents','agent_id',${a.agent_id})">Delete</button></td>
    </tr>`).join("") : '<tr><td colspan="7" class="no-data">No agents</td></tr>';
}

function renderOwners() {
  const search = (document.getElementById("owner-search") || { value: "" }).value.toLowerCase();
  const typeF = (document.getElementById("owner-filter-type") || { value: "" }).value;
  const data = DB.owners.filter((o) => (!search || o.owner_name.toLowerCase().includes(search)) && (!typeF || o.owner_type === typeF));
  const el = document.getElementById("owners-table");
  el.innerHTML = data.length ? data.map((o) => `
    <tr>
      <td><strong>#${o.owner_id}</strong></td>
      <td><strong>${o.owner_name}</strong></td>
      <td>${statusBadge(o.owner_type)}</td>
      <td>${o.contact_email}</td>
      <td>${o.city || "-"}</td>
      <td>${o.joined_date}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteRecord('owners','owner_id',${o.owner_id})">Delete</button></td>
    </tr>`).join("") : '<tr><td colspan="7" class="no-data">No owners</td></tr>';
}

function renderLocations() {
  const search = (document.getElementById("loc-search") || { value: "" }).value.toLowerCase();
  const data = DB.locations.filter((l) => !search || l.city.toLowerCase().includes(search) || l.state.toLowerCase().includes(search));
  const el = document.getElementById("locations-table");
  el.innerHTML = data.length ? data.map((l) => `
    <tr>
      <td><strong>#${l.location_id}</strong></td>
      <td><strong>${l.city}</strong></td>
      <td>${l.state}</td>
      <td>${l.pincode}</td>
      <td>${l.locality || "-"}</td>
      <td>${l.country}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteRecord('locations','location_id',${l.location_id})">Delete</button></td>
    </tr>`).join("") : '<tr><td colspan="7" class="no-data">No locations</td></tr>';
}

function renderDashboard() {
  document.getElementById("stat-properties").textContent = DB.properties.length;
  document.getElementById("stat-bookings").textContent = DB.bookings.length;
  document.getElementById("stat-users").textContent = DB.users.length;

  const rev = DB.bookings.filter((b) => ["Confirmed", "Completed"].includes(b.status)).reduce((s, b) => s + b.total_amount, 0);
  document.getElementById("stat-revenue").textContent = fmt(rev);

  document.getElementById("badge-properties").textContent = DB.properties.length;
  document.getElementById("badge-bookings").textContent = DB.bookings.length;

  const topProps = DB.properties.map((p) => {
    const pRev = DB.bookings.filter((b) => b.property_id === p.property_id && ["Confirmed", "Completed"].includes(b.status)).reduce((s, b) => s + b.total_amount, 0);
    return { ...p, rev: pRev };
  }).filter((p) => p.rev > 0).sort((a, b) => b.rev - a.rev).slice(0, 5);

  document.getElementById("top-properties-table").innerHTML = topProps.length ? topProps.map((p, i) => `
    <tr>
      <td>${["1", "2", "3", "4", "5"][i]}</td>
      <td><strong>${p.title.substring(0, 35)}</strong></td>
      <td>${getLocationCity(p.location_id)}</td>
      <td>${getTypeName(p.type_id)}</td>
      <td><strong style="color:var(--accent-green)">${fmt(p.rev)}</strong></td>
    </tr>`).join("") : '<tr><td colspan="5" class="no-data">No completed bookings yet</td></tr>';

  document.getElementById("recent-bookings-table").innerHTML = DB.bookings.slice(-5).reverse().map((b) => `
    <tr><td>#${b.booking_id}</td><td>${getPropertyName(b.property_id)}</td><td>${getUserName(b.user_id)}</td><td>${b.booking_type}</td><td>${fmt(b.total_amount)}</td><td>${statusBadge(b.status)}</td><td>${b.booking_date}</td></tr>`).join("") || '<tr><td colspan="7" class="no-data">No bookings</td></tr>';

  const counts = { Completed: 0, Confirmed: 0, Pending: 0, Cancelled: 0 };
  DB.bookings.forEach((b) => counts[b.status] = (counts[b.status] || 0) + 1);
  const total = DB.bookings.length;
  if (total > 0) {
    document.getElementById("booking-status-chart").innerHTML = Object.entries(counts).map(([k, v]) => {
      const colors = { Completed: "var(--accent-green)", Confirmed: "var(--accent-blue)", Pending: "var(--accent-gold)", Cancelled: "var(--accent-red)" };
      const pct = Math.round(v / total * 100);
      return `<div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px">
          <span style="color:var(--text-secondary)">${k}</span><span style="color:var(--text-primary);font-weight:600">${pct}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${colors[k]}"></div></div>
      </div>`;
    }).join("");
  }
}

// =====================================================================
// ANALYTICS
// =====================================================================
let chartRevenue = null;
let chartBookingStatus = null;
let chartLocations = null;

function renderAnalytics() {
  const typeRevenue = {};
  DB.propertyTypes.forEach((t) => typeRevenue[t.type_id] = { name: t.type_name, rev: 0 });
  DB.bookings.filter((b) => ["Confirmed", "Completed"].includes(b.status)).forEach((b) => {
    const prop = DB.properties.find((p) => p.property_id === b.property_id);
    if (prop && typeRevenue[prop.type_id]) typeRevenue[prop.type_id].rev += b.total_amount;
  });
  const revData = Object.values(typeRevenue).filter((t) => t.rev > 0).sort((a, b) => b.rev - a.rev);
  chartRevenue = drawBarChartWithChartJS("chart-revenue", chartRevenue, revData.map((d) => d.name), revData.map((d) => +(d.rev / 10000000).toFixed(2)), ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4", "#f97316"]);

  const sc = { Completed: 0, Confirmed: 0, Pending: 0, Cancelled: 0 };
  DB.bookings.forEach((b) => sc[b.status] = (sc[b.status] || 0) + 1);
  chartBookingStatus = drawPieChartWithChartJS("chart-booking-status", chartBookingStatus, Object.keys(sc), Object.values(sc), ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]);

  const locRev = {};
  DB.locations.forEach((l) => locRev[l.location_id] = { name: l.city, rev: 0 });
  DB.bookings.filter((b) => ["Confirmed", "Completed"].includes(b.status)).forEach((b) => {
    const prop = DB.properties.find((p) => p.property_id === b.property_id);
    if (prop && locRev[prop.location_id]) locRev[prop.location_id].rev += b.total_amount;
  });
  const locData = Object.values(locRev).filter((l) => l.rev > 0).sort((a, b) => b.rev - a.rev).slice(0, 6);
  chartLocations = drawBarChartWithChartJS("chart-locations", chartLocations, locData.map((d) => d.name), locData.map((d) => +(d.rev / 10000000).toFixed(2)), ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"]);

  const ratList = document.getElementById("ratings-list");
  const propRatings = DB.properties.map((p) => {
    const revs = DB.reviews.filter((r) => r.property_id === p.property_id);
    const avg = revs.length ? (revs.reduce((s, r) => s + r.rating, 0) / revs.length).toFixed(1) : null;
    return { title: p.title, avg, count: revs.length };
  }).filter((p) => p.avg);

  ratList.innerHTML = propRatings.length ? propRatings.map((p) => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:12px;color:var(--text-primary);font-weight:500;margin-bottom:3px">${p.title.substring(0, 38)}</div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="stars" style="font-size:13px">${"★".repeat(Math.round(p.avg))}</span>
        <span style="font-size:12px;color:var(--text-secondary)">${p.avg} (${p.count} reviews)</span>
      </div>
    </div>`).join("") : '<div style="color:var(--text-muted);text-align:center;padding:30px;font-size:13px">No reviews yet</div>';
}

function drawBarChartWithChartJS(canvasId, chartInstance, labels, values, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return chartInstance;
  
  if (chartInstance) {
    chartInstance.destroy();
  }

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue (Cr)',
        data: values,
        backgroundColor: colors,
        borderWidth: 0,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: '#94a3b8' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#94a3b8' }
        }
      }
    }
  });
}

function drawPieChartWithChartJS(canvasId, chartInstance, labels, values, colors) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return chartInstance;

  if (chartInstance) {
    chartInstance.destroy();
  }

  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#0a0e1a'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#94a3b8', font: { family: 'DM Sans', size: 11 } }
        }
      }
    }
  });
}

// =====================================================================
// SQL REFERENCE
// =====================================================================
const sqlSnippets = [
  `-- Database Initialization\nCREATE DATABASE IF NOT EXISTS real_estate_db;\nUSE real_estate_db;\n\nCREATE TABLE USERS (...);\nCREATE TABLE LOCATIONS (...);\nCREATE TABLE PROPERTY_TYPES (...);\nCREATE TABLE OWNERS (...);\nCREATE TABLE AGENTS (...);\nCREATE TABLE PROPERTIES (...);\nCREATE TABLE BOOKINGS (...);\nCREATE TABLE PAYMENTS (...);\nCREATE TABLE REVIEWS (...);`,
  `-- Query 1: Full Property Listing\nSELECT p.property_id, p.title, p.price, pt.type_name, l.city, o.owner_name, a.agent_name\nFROM PROPERTIES p\nJOIN PROPERTY_TYPES pt ON p.type_id = pt.type_id\nJOIN LOCATIONS l ON p.location_id = l.location_id\nJOIN OWNERS o ON p.owner_id = o.owner_id\nLEFT JOIN AGENTS a ON p.agent_id = a.agent_id\nWHERE p.availability_status = 'Available'\nORDER BY p.price DESC;`,
  `-- Query 2: Revenue by Type\nSELECT pt.type_name, COUNT(b.booking_id) AS total_bookings, SUM(b.total_amount) AS total_revenue\nFROM PROPERTY_TYPES pt\nJOIN PROPERTIES p ON pt.type_id = p.type_id\nJOIN BOOKINGS b ON p.property_id = b.property_id\nWHERE b.status IN ('Confirmed', 'Completed')\nGROUP BY pt.type_id\nORDER BY total_revenue DESC;`,
  `-- Query 3: Top Agents and Ratings\nSELECT a.agent_name, a.agency_name, COUNT(b.booking_id) AS total_bookings, SUM(b.total_amount) AS total_transaction_value\nFROM AGENTS a\nJOIN PROPERTIES p ON a.agent_id = p.agent_id\nJOIN BOOKINGS b ON p.property_id = b.property_id\nWHERE b.status IN ('Confirmed', 'Completed')\nGROUP BY a.agent_id\nORDER BY total_bookings DESC\nLIMIT 5;`,
  `-- ACID Transaction Example\nSET TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nSTART TRANSACTION;\nSELECT availability_status FROM PROPERTIES WHERE property_id = 4 FOR UPDATE;\nINSERT INTO BOOKINGS (property_id, user_id, booking_type, total_amount, status) VALUES (4, 101, 'Purchase', 35000000.00, 'Confirmed');\nINSERT INTO PAYMENTS (booking_id, amount, payment_method, status) VALUES (LAST_INSERT_ID(), 500000.00, 'Bank Transfer', 'Success');\nUPDATE PROPERTIES SET availability_status = 'Booked' WHERE property_id = 4;\nCOMMIT;`
];

const sqlTitles = ["CREATE TABLE Statements", "Query 1: Full Property Listing", "Query 2: Revenue by Type", "Query 3: Top Agents + Ratings", "ACID Transaction Example"];

function showSqlTab(idx) {
  document.querySelectorAll(".tab").forEach((t, i) => t.classList.toggle("active", i === idx));
  renderSQL(idx);
}

function renderSQL(idx) {
  document.getElementById("sql-viewer").textContent = sqlSnippets[idx];
  document.getElementById("sql-tab-title").textContent = sqlTitles[idx];
}

function copySQL() {
  const text = document.getElementById("sql-viewer").innerText;
  navigator.clipboard.writeText(text).then(() => toast("SQL copied to clipboard", "success"));
}

// =====================================================================
// TOAST + REFRESH + INIT
// =====================================================================
function toast(msg, type = "info") {
  const el = document.createElement("div");
  el.className = \`toast \${type}\`;
  el.innerHTML = msg;
  document.getElementById("toast-container").appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function refreshAll() {
  renderDashboard();
  renderProperties();
  renderBookings();
  renderPayments();
  renderReviews();
  renderUsers();
  renderAgents();
  renderOwners();
  renderLocations();
}

document.addEventListener("DOMContentLoaded", () => {
  renderSQL(0);
  if (DB.properties.length === 0 && DB.users.length === 0) {
    loadSampleData();
  } else {
    refreshAll();
  }
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function () {
      document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
      this.classList.add("active");
    });
  });
});
