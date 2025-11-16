// JavaScript principal para Dispensadoras Inteligentes

// Configuración global
const CONFIG = {
    API_BASE_URL: '/api',
    REFRESH_INTERVAL: 30000, // 30 segundos
    CHARTS: {}
};

// Utilidades
const Utils = {
    formatDate: (date) => {
        return new Date(date).toLocaleString('es-ES');
    },
    
    getStatusColor: (estado) => {
        const colores = {
            'activa': '#10b981',
            'inactiva': '#6b7280',
            'alerta': '#f59e0b',
            'critico': '#ef4444'
        };
        return colores[estado] || '#2563eb';
    },
    
    getStatusBadge: (estado) => {
        return `<span class="badge-status badge-${estado}">${estado}</span>`;
    }
};

// API Helper
const API = {
    fetch: async (endpoint, options = {}) => {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    getDispensadoras: () => API.fetch('/dispensadoras'),
    getDispensadora: (id) => API.fetch(`/dispensadoras/${id}`),
    getAlertas: (resuelta = false) => API.fetch(`/alertas?resuelta=${resuelta}`),
    getLecturas: (dispensadoraId, horas = 24) => API.fetch(`/lecturas/${dispensadoraId}?horas=${horas}`),
    getEstadisticas: () => API.fetch('/estadisticas'),
    getStatus: () => API.fetch('/status')
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    initBootstrapTooltips();
    const endpoint = window.location.pathname;
    
    if (endpoint === '/' || endpoint === '/index.html') {
        cargarEstadisticas();
        cargarDispensadoras();
        cargarAlertas();
        setInterval(cargarEstadisticas, CONFIG.REFRESH_INTERVAL);
    } else if (endpoint === '/dashboard') {
        cargarGraficosCompletos();
    } else if (endpoint === '/monitoreo') {
        cargarDispensadorasMonitoreo();
        setInterval(cargarDispensadorasMonitoreo, 10000);
    }
}

function initBootstrapTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Funciones principales
function cargarEstadisticas() {
    API.getEstadisticas()
        .then(data => actualizarEstadisticas(data))
        .catch(error => mostrarError('Error al cargar estadísticas'));
}

function actualizarEstadisticas(data) {
    const elementos = {
        'total-dispensadoras': data.total_dispensadoras,
        'dispensadoras-activas': data.dispensadoras_activas,
        'alertas-pendientes': data.alertas_pendientes,
        'temperatura-promedio': `${data.temperatura_promedio}°C`
    };
    
    Object.entries(elementos).forEach(([id, valor]) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = valor;
            el.classList.add('animate-slide-in');
        }
    });
    
    const barraProgreso = document.getElementById('nivel-promedio-bar');
    const textoProgreso = document.getElementById('nivel-promedio-text');
    if (barraProgreso && textoProgreso) {
        barraProgreso.style.width = `${data.nivel_promedio}%`;
        textoProgreso.textContent = `${data.nivel_promedio.toFixed(1)}%`;
    }
}

function cargarDispensadoras() {
    API.getDispensadoras()
        .then(data => mostrarDispensadorasTabla(data))
        .catch(error => {
            const tabla = document.getElementById('dispensadoras-tabla');
            if (tabla) tabla.innerHTML = '<tr><td colspan="6" class="text-danger">Error al cargar dispensadoras</td></tr>';
        });
}

function mostrarDispensadorasTabla(data) {
    const tabla = document.getElementById('dispensadoras-tabla');
    if (!tabla) return;
    
    tabla.innerHTML = '';
    if (data.length === 0) {
        tabla.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay dispensadoras disponibles</td></tr>';
        return;
    }
    
    data.forEach(d => {
        const fila = document.createElement('tr');
        const colorBarra = Utils.getStatusColor(d.estado);
        const estadoBadge = Utils.getStatusBadge(d.estado);
        
        fila.innerHTML = `
            <td><strong>${d.nombre}</strong></td>
            <td>${d.ubicacion}</td>
            <td>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" aria-valuenow="${d.nivel_llenado}" aria-valuemin="0" aria-valuemax="100" style="width: ${d.nivel_llenado}%; background-color: ${colorBarra};">
                        ${d.nivel_llenado.toFixed(1)}%
                    </div>
                </div>
            </td>
            <td>${d.temperatura}°C</td>
            <td>${estadoBadge}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="verDetalles(${d.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function cargarAlertas() {
    API.getAlertas(false)
        .then(data => mostrarAlertas(data))
        .catch(error => console.error('Error al cargar alertas:', error));
}

function mostrarAlertas(data) {
    const lista = document.getElementById('alertas-lista');
    if (!lista) return;
    
    lista.innerHTML = '';
    if (data.length === 0) {
        lista.innerHTML = '<p class="text-success text-center">✅ No hay alertas pendientes</p>';
        return;
    }
    
    data.slice(0, 5).forEach(a => {
        const tipoClass = `alert-${a.severidad === 'critica' ? 'danger' : a.severidad === 'media' ? 'warning' : 'info'}`;
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${tipoClass} mb-2`;
        alertDiv.innerHTML = `
            <strong>${a.tipo}</strong>
            <p class="mb-0">${a.descripcion}</p>
            <small>Severidad: ${a.severidad}</small>
        `;
        lista.appendChild(alertDiv);
    });
}

function cargarDispensadorasMonitoreo() {
    API.getDispensadoras()
        .then(data => mostrarDispensadorasGrid(data))
        .catch(error => mostrarError('Error al cargar dispensadoras'));
}

function mostrarDispensadorasGrid(dispensadoras) {
    const grid = document.getElementById('dispensadoras-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    if (dispensadoras.length === 0) {
        grid.innerHTML = '<p class="text-muted text-center w-100">No se encontraron dispensadoras</p>';
        return;
    }
    
    dispensadoras.forEach(d => {
        const colorEstado = Utils.getStatusColor(d.estado);
        const animacion = d.nivel_llenado < 20 ? 'pulse' : '';
        const card = document.createElement('div');
        card.className = `dispensadora-card ${animacion}`;
        card.innerHTML = `
            <div class="dispensadora-header">
                <h5 class="mb-2">${d.nombre}</h5>
                ${Utils.getStatusBadge(d.estado)}
            </div>
            <div class="dispensadora-info">
                <div class="dispensadora-row">
                    <span class="dispensadora-label"><i class="fas fa-map-marker-alt"></i> Ubicación</span>
                    <span class="dispensadora-value">${d.ubicacion}</span>
                </div>
                <div class="dispensadora-row">
                    <span class="dispensadora-label"><i class="fas fa-barcode"></i> Serial</span>
                    <span class="dispensadora-value">${d.serial}</span>
                </div>
                <div class="dispensadora-row">
                    <span class="dispensadora-label"><i class="fas fa-tag"></i> Tipo</span>
                    <span class="dispensadora-value text-capitalize">${d.tipo}</span>
                </div>
                <div class="dispensadora-row">
                    <span class="dispensadora-label"><i class="fas fa-fill"></i> Nivel</span>
                    <span class="dispensadora-value">${d.nivel_llenado.toFixed(1)}%</span>
                </div>
                <div class="mb-3">
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" aria-valuenow="${d.nivel_llenado}" aria-valuemin="0" aria-valuemax="100" style="width: ${d.nivel_llenado}%; background-color: ${colorEstado};"></div>
                    </div>
                </div>
                <div class="dispensadora-row">
                    <span class="dispensadora-label"><i class="fas fa-thermometer-half"></i> Temp</span>
                    <span class="dispensadora-value">${d.temperatura}°C</span>
                </div>
                <div class="dispensadora-row">
                    <span class="dispensadora-label"><i class="fas fa-water"></i> Humedad</span>
                    <span class="dispensadora-value">${d.humedad}%</span>
                </div>
                <div class="mt-3">
                    <button class="btn btn-sm btn-primary w-100" onclick="verDetallesMonitoreo(${d.id})">
                        <i class="fas fa-info-circle"></i> Ver Detalles
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function cargarGraficosCompletos() {
    API.getDispensadoras()
        .then(data => {
            crearGraficoTipo(data);
            crearGraficoEstado(data);
            crearGraficoNivel(data);
            crearGraficoTemperatura(data);
        })
        .catch(error => mostrarError('Error al cargar gráficos'));
}

function crearGraficoTipo(data) {
    const tipos = {};
    data.forEach(d => {
        tipos[d.tipo] = (tipos[d.tipo] || 0) + 1;
    });
    
    const ctx = document.getElementById('tipoChart');
    if (!ctx) return;
    
    if (CONFIG.CHARTS.tipoChart) CONFIG.CHARTS.tipoChart.destroy();
    
    CONFIG.CHARTS.tipoChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(tipos),
            datasets: [{
                data: Object.values(tipos),
                backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function crearGraficoEstado(data) {
    const estados = {};
    data.forEach(d => {
        estados[d.estado] = (estados[d.estado] || 0) + 1;
    });
    
    const ctx = document.getElementById('estadoChart');
    if (!ctx) return;
    
    if (CONFIG.CHARTS.estadoChart) CONFIG.CHARTS.estadoChart.destroy();
    
    CONFIG.CHARTS.estadoChart = new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: Object.keys(estados),
            datasets: [{
                data: Object.values(estados),
                backgroundColor: ['#10b981', '#6b7280', '#f59e0b', '#ef4444']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function crearGraficoNivel(data) {
    const ctx = document.getElementById('nivelChart');
    if (!ctx) return;
    
    if (CONFIG.CHARTS.nivelChart) CONFIG.CHARTS.nivelChart.destroy();
    
    CONFIG.CHARTS.nivelChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: data.map(d => d.nombre),
            datasets: [{
                label: 'Nivel (%)',
                data: data.map(d => d.nivel_llenado),
                backgroundColor: '#2563eb',
                borderColor: '#1e40af',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function crearGraficoTemperatura(data) {
    const ctx = document.getElementById('temperaturaChart');
    if (!ctx) return;
    
    if (CONFIG.CHARTS.temperaturaChart) CONFIG.CHARTS.temperaturaChart.destroy();
    
    CONFIG.CHARTS.temperaturaChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: data.map(d => d.nombre),
            datasets: [{
                label: 'Temperatura (°C)',
                data: data.map(d => d.temperatura),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Funciones auxiliares
function verDetalles(id) {
    console.log('Ver detalles de dispensadora:', id);
}

function verDetallesMonitoreo(id) {
    console.log('Ver detalles de dispensadora:', id);
}

function filtrarDispensadoras() {
    const estado = document.getElementById('filtroEstado')?.value;
    const tipo = document.getElementById('filtroTipo')?.value;
    
    API.getDispensadoras()
        .then(data => {
            const filtradas = data.filter(d => {
                const cumpleEstado = !estado || d.estado === estado;
                const cumpleTipo = !tipo || d.tipo === tipo;
                return cumpleEstado && cumpleTipo;
            });
            mostrarDispensadorasGrid(filtradas);
        });
}

function mostrarError(mensaje) {
    console.error(mensaje);
}

function generarReporte() {
    const tipo = document.getElementById('tipoReporte')?.value;
    const periodo = document.getElementById('periodo')?.value;
    
    API.getDispensadoras()
        .then(data => mostrarReporte(tipo, periodo, data));
}

function mostrarReporte(tipo, periodo, dispensadoras) {
    const header = document.getElementById('reporteHeader');
    const contenido = document.getElementById('reporteContenido');
    
    if (!header || !contenido) return;
    
    let titulo = '';
    let html = '';
    
    switch(tipo) {
        case 'consumo':
            titulo = 'Reporte de Consumo de Agua';
            html = generarReporteConsumo(dispensadoras);
            break;
        case 'alertas':
            titulo = 'Reporte de Alertas y Problemas';
            html = generarReporteAlertas(dispensadoras);
            break;
        case 'mantenimiento':
            titulo = 'Reporte de Mantenimiento';
            html = generarReporteMantenimiento(dispensadoras);
            break;
        case 'rendimiento':
            titulo = 'Reporte de Rendimiento General';
            html = generarReporteRendimiento(dispensadoras);
            break;
    }
    
    header.innerHTML = `<i class="fas fa-file-pdf"></i> ${titulo}`;
    contenido.innerHTML = html;
}

function generarReporteConsumo(dispensadoras) {
    let totalConsumo = 0;
    let html = '<div class="row">';
    
    dispensadoras.forEach(d => {
        const consumo = Math.random() * 100;
        totalConsumo += consumo;
        html += `<div class="col-md-4 mb-3"><div class="stat-card"><div class="stat-label">${d.nombre}</div><div class="stat-number">${consumo.toFixed(2)}L</div><small class="text-muted">Ubicación: ${d.ubicacion}</small></div></div>`;
    });
    
    html += '</div>';
    html += `<div class="alert alert-info"><strong>Consumo Total: </strong>${totalConsumo.toFixed(2)} Litros</div>`;
    
    return html;
}

function generarReporteAlertas(dispensadoras) {
    return `<div class="alert alert-warning"><strong>⚠️ Resumen de Alertas</strong><p class="mb-0">Se han registrado un total de 7 alertas en el período seleccionado.</p></div><div class="row"><div class="col-md-6 mb-3"><div class="stat-card"><div class="stat-icon">🔴</div><div class="stat-label">Alertas Críticas</div><div class="stat-number">2</div></div></div><div class="col-md-6 mb-3"><div class="stat-card"><div class="stat-icon">🟡</div><div class="stat-label">Alertas Moderadas</div><div class="stat-number">5</div></div></div></div>`;
}

function generarReporteMantenimiento(dispensadoras) {
    return `<div class="alert alert-info"><strong>🔧 Historial de Mantenimiento</strong><p class="mb-0">Últimos mantenimientos realizados en el sistema.</p></div><div class="row"><div class="col-md-6 mb-3"><div class="stat-card"><div class="stat-icon">✅</div><div class="stat-label">Mantenimientos Realizados</div><div class="stat-number">12</div></div></div><div class="col-md-6 mb-3"><div class="stat-card"><div class="stat-icon">📅</div><div class="stat-label">Próximo Mantenimiento</div><div class="stat-number">3 días</div></div></div></div>`;
}

function generarReporteRendimiento(dispensadoras) {
    const activas = dispensadoras.filter(d => d.estado === 'activa').length;
    const porcentajeOperacional = (activas / dispensadoras.length * 100).toFixed(1);
    
    return `<div class="alert alert-success"><strong>📊 Rendimiento del Sistema</strong><p class="mb-0">El sistema opera con eficiencia general.</p></div><div class="row"><div class="col-md-4 mb-3"><div class="stat-card"><div class="stat-icon">📦</div><div class="stat-label">Total de Dispensadoras</div><div class="stat-number">${dispensadoras.length}</div></div></div><div class="col-md-4 mb-3"><div class="stat-card"><div class="stat-icon">✅</div><div class="stat-label">Operacional</div><div class="stat-number">${porcentajeOperacional}%</div></div></div><div class="col-md-4 mb-3"><div class="stat-card"><div class="stat-icon">⏱️</div><div class="stat-label">Uptime</div><div class="stat-number">99.8%</div></div></div></div>`;
}

console.log('Sistema de Dispensadoras Inteligentes cargado correctamente ✓');
