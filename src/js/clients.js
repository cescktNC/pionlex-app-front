import { getRecords, deleteRecord } from './API'
import $ from 'jquery';
import * as bootstrap from 'bootstrap'; // Para poder crear instancias de bootstrap

( () => {

  // Variables
  const urlClients = "http://localhost:4000/clients";
  const deleteClientButton = document.querySelector('#deleteClientButton');
  const deletingClientButton = document.querySelector('#deletingClientButton');
  const deleteClientToast = document.getElementById('deleteClientToast');

  const deleteClientModal = new bootstrap.Modal(document.querySelector('#deleteClientModal'));
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(deleteClientToast);

  // Eventos
  deleteClientButton.addEventListener('click', deleteClient);
  
  // Funciones
  async function showClients() {
    const clients = await getRecords(urlClients);

    $('#clientsTable').DataTable({
      data: clients,
      columns: [
        { 
          data: null,
          className: 'td td-align-left',
          render: data => `${data.nombre} ${data.apellido}`
        },
        { data: 'telefono', className: 'td td-align-center' },
        { data: 'email', className: 'td td-align-center' },
        { data: 'poblacion', className: 'td td-align-center' },
        { data: 'fecha_alta', className: 'td td-align-center' },
        // { 
        //   data: 'fecha_alta',
        //   className: 'td td-align-center',
        //   render: data => {
        //     const [year, month, day] = data.split('-');
        //     return `${day}/${month}/${year}`;
        //   }
        // },
        { 
          data: null,
          className: 'td td-align-center',
          width: '140px',
          render: data => {
            return `
              <div class="client-status">
                <span>${data.estado}</span>
              </div>`;
          }
        },
        {
          data: null,
          className: 'td td-align-center',
          orderable: false,
          render: data => {
            return `
              <button type="button" data-bs-toggle="modal" data-bs-target="#editClientModal" class="btn-edit" data-id="${data.id}">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" data-bs-toggle="modal" data-bs-target="#deleteClientModal" class="btn-delete" data-id="${data.id}">
                <i class="fa-solid fa-trash"></i>
              </button>
            `;
          }
        }
      ],
      language: {
        "lengthMenu": "Mostrar _MENU_ clientes",
        "search": "Buscar:",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ clientes",
        "infoEmpty": "Mostrando 0 a 0 de 0 clientes",
        "infoFiltered": "(filtrado de _MAX_ clientes en total)",
        "infoPostFix": "", // Añade información al final del 'info'
        "paginate": {
          "first": "Primero",
          "last": "Último",
          "next": "Siguiente",
          "previous": "Anterior"
        },
        "emptyTable": "No hay información",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "zeroRecords": "No se encontraron resultados",
        "thousands": ".",
        "decimal": ",",
        // Añade una descripción de que se puede ordenar de forma ascendente y descendente para lectores de pantalla (accesibilidad)
        "aria": {
          "sortAscending": ": activar para ordenar la columna de manera ascendente",
          "sortDescending": ": activar para ordenar la columna de manera descendente"
        }
      },
      createdRow: function(row, data) {
        const estadoCell = $('td', row).eq(5);
        let div = estadoCell.find('div');

        switch (data.estado.toLocaleLowerCase()) {
          case 'en proceso':
            div.addClass('in-progress');
            break;
          case 'esperando documentación':
            div.addClass('awaiting-documentation');
            break;
          case 'cerrado':
            div.addClass('closed');
            break;
          case 'nuevo':
            div.addClass('new');
            break;
          case 'pendiente de pago':
            div.addClass('pending-payment');
            break;
          case 'en revisión':
            div.addClass('under-review');
            break;
          case 'en espera de resolución':
            div.addClass('awaiting-resolution');
            break;
          case 'moroso':
            div.addClass('overdue');
            break;
          case 'archivado':
            div.addClass('archived');
            break;
          case 'con resolución pendiente':
            div.addClass('pending-resolution');
            break;
        }
      }
    });

    $('#clientsTable').on('click', '.btn-delete', (event) => {
      const deleteButton = event.target.parentElement;
      const idClient = deleteButton.dataset.id;

      // Se obtiene la fila del cliente que se quiere eliminar
      const dataTableClients = $('#clientsTable').DataTable();
      const row = dataTableClients.row($(deleteButton).closest('tr'));

      // Se guarda el nombre completo del cliente
      const rowData = row.data();
      const fullName = `${rowData.nombre} ${rowData.apellido}`;

      saveDataClientToTheDeleteClientButton(idClient, fullName);
    });

  }

  function saveDataClientToTheDeleteClientButton(idClient, fullName) {
    deleteClientButton.dataset.idClient = idClient;
    deleteClientButton.dataset.fullName = fullName;
  }

  async function deleteClient(e) {
    const idClient = parseInt(deleteClientButton.dataset.idClient);
    const response = await deleteRecord(idClient, urlClients);

    deleteClientButton.classList.add('d-none');
    deletingClientButton.classList.remove('d-none');
    // Esto es temporal para simular el tiempo de respuesta del backend
    setTimeout( () => {
      deleteClientModal.hide();
      deleteClientButton.classList.remove('d-none');
      deletingClientButton.classList.add('d-none');
      refreshDatatable();
      showToast(response);
    }, 2000);

    // Cuando se quite el codigo temporal anterior hay que descomentar estas líneas
    // deleteClientModal.hide();
    // deleteClientButton.classList.remove('d-none');
    // deletingClientButton.classList.add('d-none');
    // refreshDatatable();
    // showToast(response);
  }

  async function refreshDatatable() {
    const dataTableClients = $('#clientsTable').DataTable();
    const currentPage = dataTableClients.page();

    // Se refresca el datatable con el listado de clientes actualizado
    const clients = await getRecords(urlClients);
    dataTableClients.clear();
    dataTableClients.rows.add(clients);
    dataTableClients.draw();
    dataTableClients.page(currentPage).draw('page');
  }

  function showToast(response) {
    const iconToastHeader = deleteClientToast.querySelector('.toast-header i');
    const toastBody = deleteClientToast.querySelector('.toast-body');
    const fullName = deleteClientButton.dataset.fullName;

    if (response) {
      iconToastHeader.classList.add('fa-solid', 'fa-check');
      toastBody.innerText = `${fullName} se ha eliminado correctamente.`;
      deleteClientToast.classList.add('toastSuccess');
    } else {
      iconToastHeader.classList.add('fa-solid', 'fa-triangle-exclamation');
      toastBody.innerText = `${fullName} no ha podido ser eliminado.`;
      deleteClientToast.classList.add('toastError');
    }
    toastBootstrap.show();
  }

  // Lógica
  showClients();

})();