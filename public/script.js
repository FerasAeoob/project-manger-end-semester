
document.getElementById('imageFile').addEventListener('change', function () {
  let f = this.files[0];
  let preview = document.getElementById('preview');
  if (f) {
    preview.src = URL.createObjectURL(f);
    preview.style.display = 'inline';
  } else {
    preview.src = '';
    preview.style.display = 'none';
  }
});


document.getElementById('saveBtn').addEventListener('click', function () {
  addOrEdit();
});
document.getElementById('clearBtn').addEventListener('click', function () {
  clearForm();
});


document.getElementById('search').addEventListener('input', function () {
  getData();
});


getData();

function clearForm() {
  document.getElementById('projId').value = '';
  document.getElementById('projectTitle').value = '';
  document.getElementById('clientName').value = '';
  document.getElementById('notes').value = '';
  document.getElementById('imageFile').value = '';
  document.getElementById('preview').src = '';
}

async function getData() {
  try {
    let response = await fetch('/projects');
    let data = await response.json();

   
    let q = document.getElementById('search').value.trim().toLowerCase();
    if (q) {
      data = data.filter(p => (p.projectTitle + ' ' + p.clientName).toLowerCase().includes(q));
    }

    
    window._projectsCache = data;
    renderGrid(data);
  } catch (err) {
    alert(err);
  }
}

function renderGrid(data) {
  let html = '';
  for (let obj of data) {
    if (!obj) continue;
    html += `<div class="card">
      <div class="meta"><strong>${escapeHtml(obj.projectTitle)}</strong></div>
      <div class="small">Notes: ${escapeHtml(obj.notes || '')}</div>
      <div class="actions">
        <button class="editBtn" onclick="getById(${obj.id})">Edit</button>
        <button class="delBtn" onclick="deleteProject(${obj.id})">Delete</button>
      </div>
    </div>`;
  }
  document.getElementById('grid').innerHTML = html;
}

function escapeHtml(s) {
  if (!s) return '';
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

async function addProject() {
  try {
    let formData = new FormData();
    formData.append('projectTitle', document.getElementById('projectTitle').value);
    formData.append('clientName', document.getElementById('clientName').value);
    formData.append('notes', document.getElementById('notes').value);
    let file = document.getElementById('imageFile').files[0];
    if (file) formData.append('image', file);

    await fetch('/projects', { method: 'POST', body: formData });
    getData();
    clearForm();
  } catch (err) {
    alert(err);
  }
}

async function deleteProject(id) {
  try {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await fetch(`/projects/${id}`, { method: 'DELETE' });
    getData();
  } catch (err) {
    alert(err);
  }
}

async function getById(id) {
  try {
    let res = await fetch(`/projects/${id}`);
    let obj = await res.json();
    if (!obj || obj.message) {
      alert('Not found');
      return;
    }
    document.getElementById('projId').value = obj.id;
    document.getElementById('projectTitle').value = obj.projectTitle;
    document.getElementById('clientName').value = obj.clientName;
    document.getElementById('notes').value = obj.notes;
    document.getElementById('preview').src = obj.imageFile ? ('../images/' + obj.imageFile) : '';
  } catch (err) {
    alert(err);
  }
}

async function editProject(id) {
  try {
    let formData = new FormData();
    formData.append('projectTitle', document.getElementById('projectTitle').value);
    formData.append('clientName', document.getElementById('clientName').value);
    formData.append('notes', document.getElementById('notes').value);
    let file = document.getElementById('imageFile').files[0];
    if (file) formData.append('image', file);

    await fetch(`/projects/${id}`, { method: 'PATCH', body: formData });
    getData();
    clearForm();
  } catch (err) {
    alert(err);
  }
}


function addOrEdit() {
  let id = document.getElementById('projId').value;
  if (id) {
    editProject(id);
  } else {
    addProject();
  }
}

