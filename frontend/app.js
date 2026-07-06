const API_URL = '/api/computers';

const form = document.getElementById('computer-form');
const listBody = document.getElementById('computer-list');
const editIdField = document.getElementById('edit-id');
const submitBtn = document.getElementById('submit-btn');

function statusBadgeClass(status) {
  if (status === 'ใช้งาน') return 'badge-active';
  if (status === 'ส่งซ่อม') return 'badge-repair';
  return 'badge-retired';
}

async function fetchComputers() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    console.error('โหลดข้อมูลไม่สำเร็จ:', err);
  }
}

function renderTable(items) {
  listBody.innerHTML = '';
  items.forEach((item) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.asset_code}</td>
      <td>${item.brand_model}</td>
      <td>${item.cpu}</td>
      <td>${item.ram_gb}</td>
      <td>${item.room}</td>
      <td><span class="badge ${statusBadgeClass(item.status)}">${item.status}</span></td>
      <td class="actions">
        <button class="btn-edit" data-id="${item.id}">แก้ไข</button>
        <button class="btn-delete" data-id="${item.id}">ลบ</button>
      </td>
    `;
    listBody.appendChild(tr);
  });

  document.querySelectorAll('.btn-edit').forEach((btn) => {
    btn.addEventListener('click', () => editComputer(btn.dataset.id));
  });
  document.querySelectorAll('.btn-delete').forEach((btn) => {
    btn.addEventListener('click', () => deleteComputer(btn.dataset.id));
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    asset_code: document.getElementById('asset_code').value,
    brand_model: document.getElementById('brand_model').value,
    cpu: document.getElementById('cpu').value,
    ram_gb: parseInt(document.getElementById('ram_gb').value, 10),
    room: document.getElementById('room').value,
    status: document.getElementById('status').value,
  };

  const id = editIdField.value;
  try {
    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    resetForm();
    fetchComputers();
  } catch (err) {
    console.error('บันทึกข้อมูลไม่สำเร็จ:', err);
  }
});

function resetForm() {
  form.reset();
  editIdField.value = '';
  submitBtn.textContent = '➕ บันทึกข้อมูล';
}

async function editComputer(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) return;
  const item = await res.json();
  document.getElementById('asset_code').value = item.asset_code;
  document.getElementById('brand_model').value = item.brand_model;
  document.getElementById('cpu').value = item.cpu;
  document.getElementById('ram_gb').value = item.ram_gb;
  document.getElementById('room').value = item.room;
  document.getElementById('status').value = item.status;
  editIdField.value = item.id;
  submitBtn.textContent = '💾 อัปเดตข้อมูล';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteComputer(id) {
  if (!window.confirm('ยืนยันการลบข้อมูลนี้?')) return;
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchComputers();
}

fetchComputers();
