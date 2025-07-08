const barra = document.querySelector('.barra-ocupacion');
const progreso = document.querySelector('.progreso');
const registroForm = document.getElementById('registroForm');
const parqueaderoList = document.querySelector('.parqueadero-list');
const temporal = document.querySelector('.temporal');
const historialList = document.querySelector('.historial-list');
const tipoVehiculoSelect = document.getElementById('tipo');
const campoPlaca = document.getElementById('placa-label');
const pocen = document.querySelector('.porcen');
const info = document.querySelector('#info');

const capacidad = {
  Carro: 1.0,
  Moto: 0.5,
  Bicicleta: 0.25
};

const tarifas = {
  Carro: 3000,
  Moto: 1500,
  Bicicleta: 800
};

const capacidadTotal = 25;
let unidadesOcupadas = 0;

const iconos = {
  Carro: 'fas fa-car',
  Moto: 'fas fa-motorcycle',
  Bicicleta: 'fas fa-bicycle'
};

// Cambia texto si es bicicleta
tipoVehiculoSelect.addEventListener('change', () => {
  campoPlaca.textContent =
    tipoVehiculoSelect.value === 'Bicicleta'
      ? 'Descripción de Bicicleta'
      : 'Placa del Vehículo';
});

// Mostrar u ocultar mensaje temporal
function actualizarMensajeTemporal() {
  const items = parqueaderoList.querySelectorAll('li:not(.temporal)');
  temporal.style.display = items.length === 0 ? 'list-item' : 'none';
}

// Actualiza la barra de ocupación
function actualizarBarra() {
  const porcentaje = (unidadesOcupadas / capacidadTotal) * 100;
  progreso.style.width = `${porcentaje}%`;
  pocen.textContent = `Capacidad al ${porcentaje.toFixed(0)}%`;

  barra.classList.remove('anim-scale');
  void barra.offsetWidth;
  barra.classList.add('anim-scale');

  barra.classList.remove(
    'barra-verde',
    'barra-amarilla',
    'barra-roja',
    'barra-pelig'
  );

  if (porcentaje >= 100) {
    barra.classList.add('barra-pelig');
  } else if (porcentaje > 70) {
    barra.classList.add('barra-roja');
  } else if (porcentaje > 30) {
    barra.classList.add('barra-amarilla');
  } else {
    barra.classList.add('barra-verde');
  }

  const textoOcupacion = document.querySelector('.texto-ocupacion');
  if (textoOcupacion) {
    textoOcupacion.textContent = `${unidadesOcupadas.toFixed(2)} / ${capacidadTotal} unidades ocupadas`;
  }
}

// Validar si placa o descripción ya existe
function existeVehiculo(valor) {
  const lista = parqueaderoList.querySelectorAll('li');
  for (let item of lista) {
    if (item.textContent.includes(valor)) {
      return true;
    }
  }
  return false;
}

// Registro de vehículos
registroForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!registroForm.checkValidity()) return;

  const valor = registroForm.placa.value.trim();
  const tipoVehiculo = registroForm.tipo.value;
  const unidadVehiculo = capacidad[tipoVehiculo];

  if (existeVehiculo(valor)) {
    info.textContent = 'Este vehículo ya está registrado.';
    info.style.color = 'red';
    return;
  } else {
    info.textContent = "";
  }

  if (unidadesOcupadas + unidadVehiculo > capacidadTotal) {
    alert('Capacidad máxima alcanzada.');
    return;
  }

  // Crear elemento visual
  const nuevoVehiculo = document.createElement('li');
  const texto = tipoVehiculo === 'Bicicleta'
    ? `${tipoVehiculo} - Descripción: ${valor}`
    : `${tipoVehiculo} - Placa: ${valor}`;
  nuevoVehiculo.innerHTML = `
    <i class="${iconos[tipoVehiculo]}"></i> ${texto}
    <button class="btn-salida">Salir</button>
  `;
  parqueaderoList.appendChild(nuevoVehiculo);
  actualizarMensajeTemporal();

  // Guardar hora de entrada
  const horaEntrada = new Date();

  // Actualizar ocupación
  unidadesOcupadas += unidadVehiculo;
  actualizarBarra();

  // Botón de salida
  const btnSalida = nuevoVehiculo.querySelector('.btn-salida');
  btnSalida.addEventListener('click', () => {
    nuevoVehiculo.remove();
    unidadesOcupadas -= unidadVehiculo;
    if (unidadesOcupadas < 0) unidadesOcupadas = 0;
    actualizarBarra();
    actualizarMensajeTemporal();

    // Simulación para pruebas
  const horaEntrada = new Date(new Date().getTime() - 2 * 60 * 60 * 1000);
    const horaSalida = new Date();
    const tiempoMs = horaSalida - horaEntrada;
    const horas = tiempoMs / (1000 * 60 * 60); // tiempo real en horas decimales

    let precio = 0;
    if (horas >= 1) {
      precio = Math.ceil(horas) * tarifas[tipoVehiculo];
    }


    const itemHistorial = document.createElement('li');
    itemHistorial.innerHTML = `
      ${texto}<br>
      <small>Entrada: ${horaEntrada.toLocaleString('es-CO')}<br>
      Salida: ${horaSalida.toLocaleString('es-CO')}<br>
      Valor: $${precio.toLocaleString()}</small>
    `;
    historialList.appendChild(itemHistorial);
  });

const buscador = document.getElementById('buscador');

buscador.addEventListener('input', () => {
  const valor = buscador.value.toLowerCase();

  const vehiculos = parqueaderoList.querySelectorAll('li:not(.temporal)');

  vehiculos.forEach((li) => {
    const texto = li.textContent.toLowerCase();
    if (texto.includes(valor)) {
      li.style.display = 'flex'; // ✅ Mantenemos tus estilos
    } else {
      li.style.display = 'none';
    }
  });

  actualizarMensajeTemporal();
});



  // Limpiar form
  registroForm.reset();
});
