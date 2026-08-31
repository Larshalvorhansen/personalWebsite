const JSON_FILE = './cubesat_cots.json';

const tbody = document.getElementById('tbody');
const search = document.getElementById('search');
const classFilter = document.getElementById('classFilter');
const statusBox = document.getElementById('status');
const totalCount = document.getElementById('totalCount');
const visibleCount = document.getElementById('visibleCount');
const treeNav = document.getElementById('treeNav');
const treeSelection = document.getElementById('treeSelection');
const clearTree = document.getElementById('clearTree');

let data = [];
let sortKey = 'id';
let sortDir = 1;
let activeTreePath = [];

function setStatus(message, className = '') {
  statusBox.className = 'status' + (className ? ` ${className}` : '');
  statusBox.innerHTML = message;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[char]);
}

function validateRows(rows) {
  if (!Array.isArray(rows)) {
    throw new Error('JSON root must be an array.');
  }

  const required = [
    'id',
    'tree_location',
    'item_type',
    'product_name',
    'description',
    'published_price',
    'availability',
    'procurement_class'
  ];

  rows.forEach((row, index) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      throw new Error(`Row ${index + 1} is not an object.`);
    }
    for (const key of required) {
      if (!(key in row)) {
        throw new Error(`Row ${index + 1} is missing "${key}".`);
      }
    }
  });

  return rows;
}

/*
  Example:
  tree_location = "Electrical / Avionics → Communications • Antenna"
  item_type     = "GNSS antenna"

  becomes:
  CubeSat
    Electrical / Avionics
      Communications
        Antenna
          GNSS antenna
*/
function rowTreeParts(row) {
  const parts = [];

  for (const arrowPart of String(row.tree_location || '').split(/\s*→\s*/).filter(Boolean)) {
    for (const dotPart of arrowPart.split(/\s*•\s*/).filter(Boolean)) {
      parts.push(dotPart.trim());
    }
  }

  const itemType = String(row.item_type || '').trim();
  if (itemType && parts[parts.length - 1] !== itemType) {
    parts.push(itemType);
  }

  return parts;
}

function pathKey(parts) {
  return parts.join(' › ');
}

function buildTree() {
  const root = {
    name: 'CubeSat',
    count: 0,
    children: new Map(),
    path: []
  };

  for (const row of data) {
    root.count += 1;
    let node = root;
    const runningPath = [];

    for (const part of rowTreeParts(row)) {
      runningPath.push(part);

      if (!node.children.has(part)) {
        node.children.set(part, {
          name: part,
          count: 0,
          children: new Map(),
          path: [...runningPath]
        });
      }

      node = node.children.get(part);
      node.count += 1;
    }
  }

  function renderChildren(node, depth = 0) {
    const entries = [...node.children.values()].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base'
      })
    );

    if (!entries.length) return '';

    return `<ul>${entries.map(child => {
      const key = pathKey(child.path);
      const active = key === pathKey(activeTreePath) ? ' active' : '';

      if (child.children.size) {
        return `
          <li>
            <details ${depth < 1 ? 'open' : ''}>
              <summary>
                <span class="tree-label${active}" data-tree-path="${escapeHtml(key)}">
                  ${escapeHtml(child.name)}
                  <span class="node-count">(${child.count})</span>
                </span>
              </summary>
              ${renderChildren(child, depth + 1)}
            </details>
          </li>`;
      }

      return `
        <li>
          <button class="tree-leaf${active}" type="button" data-tree-path="${escapeHtml(key)}">
            ${escapeHtml(child.name)}
            <span class="node-count">(${child.count})</span>
          </button>
        </li>`;
    }).join('')}</ul>`;
  }

  treeNav.innerHTML = `
    <ul class="tree-list">
      <li>
        <details open>
          <summary>
            <span class="tree-label${activeTreePath.length === 0 ? ' active' : ''}" data-tree-path="">
              CubeSat
              <span class="node-count">(${root.count})</span>
            </span>
          </summary>
          ${renderChildren(root)}
        </details>
      </li>
    </ul>`;

  treeNav.querySelectorAll('[data-tree-path]').forEach(element => {
    element.addEventListener('click', event => {
      event.stopPropagation();
      const key = element.dataset.treePath || '';
      activeTreePath = key ? key.split(' › ') : [];
      updateTreeSelection();
      markActiveTreeNode();
      render();
    });
  });
}

function markActiveTreeNode() {
  const wanted = pathKey(activeTreePath);

  treeNav.querySelectorAll('[data-tree-path]').forEach(element => {
    element.classList.toggle(
      'active',
      (element.dataset.treePath || '') === wanted
    );
  });
}

function updateTreeSelection() {
  treeSelection.textContent = activeTreePath.length
    ? `CubeSat › ${activeTreePath.join(' › ')}`
    : 'CubeSat / Show all';

  clearTree.hidden = activeTreePath.length === 0;
}

function refillClassFilter() {
  const classes = [...new Set(
    data.map(row => row.procurement_class).filter(Boolean)
  )].sort();

  classFilter.innerHTML =
    '<option value="">All procurement classes</option>' +
    classes.map(value =>
      `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`
    ).join('');
}

function compareRows(a, b, key) {
  if (key === 'id') {
    return Number(a.id) - Number(b.id);
  }

  return String(a[key] ?? '').localeCompare(
    String(b[key] ?? ''),
    undefined,
    { numeric: true, sensitivity: 'base' }
  );
}

function rowMatchesTree(row) {
  if (!activeTreePath.length) return true;

  const rowPath = rowTreeParts(row);

  if (rowPath.length < activeTreePath.length) {
    return false;
  }

  return activeTreePath.every((part, index) => rowPath[index] === part);
}

function currentRows() {
  const query = search.value.trim().toLowerCase();
  const procurementClass = classFilter.value;

  return data
    .filter(row => {
      const blob = [
        row.id,
        row.tree_location,
        row.item_type,
        row.product_name,
        row.vendor,
        row.description,
        row.published_price,
        row.availability,
        row.procurement_class
      ].join(' ').toLowerCase();

      return (!query || blob.includes(query))
        && (!procurementClass || row.procurement_class === procurementClass)
        && rowMatchesTree(row);
    })
    .sort((a, b) => sortDir * compareRows(a, b, sortKey));
}

function render() {
  const rows = currentRows();

  visibleCount.textContent = rows.length;
  totalCount.textContent = data.length;

  if (!rows.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty">No matching components.</td>
      </tr>`;
    return;
  }

  tbody.innerHTML = rows.map(row => `
    <tr>
      <td>${escapeHtml(row.id)}</td>
      <td class="treecol">${escapeHtml(row.tree_location)}</td>
      <td>${escapeHtml(row.item_type)}</td>
      <td>
        <a href="${escapeHtml(row.product_url || '#')}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(row.product_name)}
        </a>
        ${row.vendor ? `<div class="vendor">${escapeHtml(row.vendor)}</div>` : ''}
      </td>
      <td class="desc">${escapeHtml(row.description)}</td>
      <td class="price">${escapeHtml(row.published_price)}</td>
      <td class="availability">${escapeHtml(row.availability)}</td>
      <td><span class="pill">${escapeHtml(row.procurement_class)}</span></td>
    </tr>
  `).join('');
}

function loadData(rows, sourceLabel) {
  try {
    data = validateRows(rows);
    activeTreePath = [];
    refillClassFilter();
    buildTree();
    updateTreeSelection();
    render();

    setStatus(
      `Loaded <strong>${data.length}</strong> components from ${sourceLabel}. ` +
      `The sidetree and table are both generated from the same JSON data.`,
      'ok'
    );
  } catch (error) {
    console.error(error);
    setStatus(
      `<strong>Could not load JSON:</strong> ${escapeHtml(error.message)}`,
      'err'
    );
  }
}

async function autoLoad() {
  try {
    const response = await fetch(JSON_FILE, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    loadData(
      await response.json(),
      `<code>${escapeHtml(JSON_FILE)}</code>`
    );
  } catch (error) {
    setStatus(
      `Automatic JSON loading was blocked or unavailable (${escapeHtml(error.message)}). ` +
      `If you opened this HTML by double-clicking it, use <strong>Load JSON file</strong> ` +
      `and choose <code>cubesat_cots.json</code>, or serve the folder over HTTP.`,
      'warn'
    );
  }
}

function clearTreeSelection() {
  activeTreePath = [];
  updateTreeSelection();
  markActiveTreeNode();
  render();
}

search.addEventListener('input', render);
classFilter.addEventListener('change', render);

document.getElementById('showAllTree').addEventListener('click', clearTreeSelection);
clearTree.addEventListener('click', clearTreeSelection);

document.getElementById('expandAll').addEventListener('click', () => {
  treeNav.querySelectorAll('details').forEach(details => {
    details.open = true;
  });
});

document.getElementById('collapseAll').addEventListener('click', () => {
  treeNav.querySelectorAll('details').forEach((details, index) => {
    details.open = index === 0;
  });
});

document.getElementById('reset').addEventListener('click', () => {
  search.value = '';
  classFilter.value = '';
  activeTreePath = [];
  sortKey = 'id';
  sortDir = 1;
  updateTreeSelection();
  markActiveTreeNode();
  render();
});

document.getElementById('fileButton').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', async event => {
  const file = event.target.files[0];

  if (!file) return;

  try {
    loadData(
      JSON.parse(await file.text()),
      `<code>${escapeHtml(file.name)}</code>`
    );
  } catch (error) {
    setStatus(
      `<strong>Could not read JSON:</strong> ${escapeHtml(error.message)}`,
      'err'
    );
  }
});

document.querySelectorAll('th[data-key]').forEach(th => {
  th.addEventListener('click', () => {
    const key = th.dataset.key;

    if (sortKey === key) {
      sortDir *= -1;
    } else {
      sortKey = key;
      sortDir = 1;
    }

    render();
  });
});

autoLoad();