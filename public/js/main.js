// Purchase form functionality
document.addEventListener('DOMContentLoaded', function () {
  const purchaseForm = document.getElementById('purchaseForm');

  if (purchaseForm) {
    const produkSelect = document.getElementById('produk_id');
    const jumlahInput = document.getElementById('jumlah');
    const stockInfo = document.getElementById('stockInfo');
    const totalHarga = document.getElementById('totalHarga');

    function updateForm() {
      const selectedOption = produkSelect.options[produkSelect.selectedIndex];

      if (selectedOption.value) {
        const harga = parseInt(selectedOption.dataset.harga);
        const stock = parseInt(selectedOption.dataset.stock);
        const jumlah = parseInt(jumlahInput.value) || 0;

        // Update stock info
        stockInfo.textContent = `Stock tersedia: ${stock}`;
        stockInfo.className = stock > 10 ? 'form-text text-success' : stock > 0 ? 'form-text text-warning' : 'form-text text-danger';

        // Update input max
        jumlahInput.max = stock;

        // Update total harga
        const total = harga * jumlah;
        totalHarga.textContent = `Rp ${total.toLocaleString('id-ID')}`;

        // Validate jumlah
        if (jumlah > stock) {
          jumlahInput.setCustomValidity('Jumlah melebihi stock yang tersedia');
        } else {
          jumlahInput.setCustomValidity('');
        }
      } else {
        stockInfo.textContent = '';
        totalHarga.textContent = 'Rp 0';
        jumlahInput.max = '';
      }
    }

    produkSelect.addEventListener('change', updateForm);
    jumlahInput.addEventListener('input', updateForm);
  }
});

// Cancel purchase functionality
function cancelPurchase(id) {
  if (confirm('Apakah Anda yakin ingin membatalkan pembelian ini?')) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/purchases/cancel/' + id;
    document.body.appendChild(form);
    form.submit();
  }
}

// Toast notifications
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

  toastContainer.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  });
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
  document.body.appendChild(container);
  return container;
}
