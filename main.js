const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const modeToggle = document.getElementById('modeToggle');
const snackbar = document.getElementById('snackbar');
const loginContainer = document.getElementById('login');
const loginForm = document.getElementById('loginForm');
const app = document.getElementById('app');

function showPage(id) {
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

navLinks.forEach(btn => {
  if (btn.dataset.target) {
    btn.addEventListener('click', () => showPage(btn.dataset.target));
  }
});

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

function toast(msg) {
  snackbar.textContent = msg;
  snackbar.classList.add('show');
  setTimeout(() => snackbar.classList.remove('show'), 3000);
}

// Simple auth
function checkAuth() {
  if (localStorage.getItem('loggedIn') === 'true') {
    loginContainer.classList.add('hidden');
    app.classList.remove('hidden');
  } else {
    loginContainer.classList.remove('hidden');
    app.classList.add('hidden');
  }
}

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  if (u === 'admin' && p === 'password') {
    localStorage.setItem('loggedIn', 'true');
    checkAuth();
  } else {
    toast('Invalid credentials');
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('loggedIn');
  checkAuth();
});

checkAuth();

// LocalStorage helpers
function save(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
function load(key) { return JSON.parse(localStorage.getItem(key) || '[]'); }

// Clients
let clients = load('clients');
const clientList = document.getElementById('clientList');
const clientModal = document.getElementById('clientModal');
const clientForm = document.getElementById('clientForm');
const clientSearch = document.getElementById('clientSearch');

function renderClients() {
  clientList.innerHTML = '';
  const term = clientSearch.value.toLowerCase();
  clients.filter(c => c.name.toLowerCase().includes(term)).forEach((client, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>${client.name}</strong><br>${client.email}<br>${client.service}
      <div><button onclick="editClient(${index})"><i class='fas fa-edit'></i></button>
      <button onclick="deleteClient(${index})"><i class='fas fa-trash'></i></button></div>`;
    clientList.appendChild(card);
  });
  document.getElementById('statClients').textContent = `Clients: ${clients.length}`;
}

function openClientModal(client, index) {
  clientModal.classList.remove('hidden');
  clientForm.reset();
  document.getElementById('clientId').value = index;
  if (client) {
    document.getElementById('clientName').value = client.name;
    document.getElementById('clientEmail').value = client.email;
    document.getElementById('clientService').value = client.service;
  }
}

document.getElementById('newClientBtn').addEventListener('click', () => openClientModal());
document.getElementById('closeClientModal').addEventListener('click', () => clientModal.classList.add('hidden'));
clientSearch.addEventListener('input', renderClients);

clientForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('clientId').value;
  const client = {
    name: document.getElementById('clientName').value,
    email: document.getElementById('clientEmail').value,
    service: document.getElementById('clientService').value
  };
  if (id) clients[id] = client; else clients.push(client);
  save('clients', clients);
  clientModal.classList.add('hidden');
  renderClients();
  toast('Client saved');
});

function editClient(i) { openClientModal(clients[i], i); }
function deleteClient(i) { clients.splice(i,1); save('clients', clients); renderClients(); toast('Client deleted'); }

// Leads
let leads = load('leads');
const leadList = document.getElementById('leadList');
const leadModal = document.getElementById('leadModal');
const leadForm = document.getElementById('leadForm');
const leadSearch = document.getElementById('leadSearch');

function renderLeads() {
  leadList.innerHTML = '';
  const term = leadSearch.value.toLowerCase();
  leads.filter(l => l.name.toLowerCase().includes(term)).forEach((lead, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<strong>${lead.name}</strong><br>${lead.email}<br>Status: ${lead.status}
      <div><button onclick="editLead(${index})"><i class='fas fa-edit'></i></button>
      <button onclick="deleteLead(${index})"><i class='fas fa-trash'></i></button></div>`;
    leadList.appendChild(card);
  });
  document.getElementById('statLeads').textContent = `Leads: ${leads.length}`;
}

function openLeadModal(lead, index) {
  leadModal.classList.remove('hidden');
  leadForm.reset();
  document.getElementById('leadId').value = index;
  if (lead) {
    document.getElementById('leadName').value = lead.name;
    document.getElementById('leadEmail').value = lead.email;
    document.getElementById('leadStatus').value = lead.status;
    document.getElementById('leadNotes').value = lead.notes;
  }
}

document.getElementById('newLeadBtn').addEventListener('click', () => openLeadModal());
document.getElementById('closeLeadModal').addEventListener('click', () => leadModal.classList.add('hidden'));
leadSearch.addEventListener('input', renderLeads);

leadForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('leadId').value;
  const lead = {
    name: document.getElementById('leadName').value,
    email: document.getElementById('leadEmail').value,
    status: document.getElementById('leadStatus').value,
    notes: document.getElementById('leadNotes').value
  };
  if (id) leads[id] = lead; else leads.push(lead);
  save('leads', leads);
  leadModal.classList.add('hidden');
  renderLeads();
  toast('Lead saved');
});

function editLead(i) { openLeadModal(leads[i], i); }
function deleteLead(i) { leads.splice(i,1); save('leads', leads); renderLeads(); toast('Lead deleted'); }

// Invoices
const invoiceArea = document.getElementById('invoiceArea');
document.getElementById('generateInvoice').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Sample Invoice', 10, 10);
  doc.save('invoice.pdf');
});

// Documents
let docs = load('documents');
const docFile = document.getElementById('docFile');
const documentList = document.getElementById('documentList');

function renderDocuments() {
  documentList.innerHTML = '';
  docs.forEach((d, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<a href="${d.data}" download="${d.name}">${d.name}</a> <button onclick="deleteDocument(${i})"><i class='fas fa-trash'></i></button>`;
    documentList.appendChild(card);
  });
}

document.getElementById('uploadDoc').addEventListener('click', () => {
  const file = docFile.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    docs.push({ name: file.name, data: e.target.result });
    save('documents', docs);
    renderDocuments();
    docFile.value = '';
    toast('Document uploaded');
  };
  reader.readAsDataURL(file);
});

function deleteDocument(i) {
  docs.splice(i,1);
  save('documents', docs);
  renderDocuments();
  toast('Document deleted');
}

// Contracts
const contractForm = document.getElementById('contractForm');
const contractPreview = document.getElementById('contractPreview');
contractForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('contractClient').value;
  const desc = document.getElementById('contractDesc').value;
  const rate = document.getElementById('contractRate').value;
  const text = `Contract\nClient: ${name}\nProject: ${desc}\nRate: ${rate}`;
  contractPreview.textContent = text;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(text, 10, 10);
  doc.save('contract.pdf');
});

// Initial render with dummy data if none
if (!clients.length) {
  clients = [
    { name: 'Acme Co', email: 'contact@acme.com', service: 'Logo design' },
    { name: 'Globex', email: 'hello@globex.com', service: 'Brand identity' }
  ];
  save('clients', clients);
}
if (!leads.length) {
  leads = [
    { name: 'Jane Doe', email: 'jane@example.com', status: 'New', notes: '' }
  ];
  save('leads', leads);
}
renderClients();
renderLeads();
renderDocuments();
