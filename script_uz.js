// Aral Sea Monitoring System - Uzbek Version
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeCounters();
    initializeMap();
    initializeCharts();
    startLiveDataUpdates();
    populateDailyTable();
});

// Real Aral Sea Data
const aralData = {
    location: {
        lat: 43.75,
        lng: 59.00,
        name: "Mo'ynoq, Qoraqalpog'iston"
    },
    salinity: {
        current: 95,
        dailyIncrease: 0.18,
        ocean: 35,
        historical1960: 10
    },
    waterLevel: {
        current: 38,
        historical1960: 53,
        historical1990: 42
    },
    area: {
        current: 8000,
        historical1960: 68000
    },
    rivers: {
        amuDarya: {
            current: 450,
            yearly: 14.2,
            average: "500-1500",
            decrease: 70
        },
        syrDarya: {
            current: 280,
            yearly: 8.8,
            average: "300-900",
            decrease: 65
        }
    }
};

// Initialize Counters
function initializeCounters() {
    animateCounter('currentSalinity', aralData.salinity.current, 2000);
    animateCounter('amuDaily', aralData.rivers.amuDarya.current, 1500);
    animateCounter('syrDaily', aralData.rivers.syrDarya.current, 1500);
    animateCounter('saltIncrease', aralData.salinity.dailyIncrease, 1000);
    
    document.getElementById('currentSal').textContent = aralData.salinity.current + ' ppt';
    document.getElementById('dailyIncrease').textContent = '+' + aralData.salinity.dailyIncrease + ' ppt';
    document.getElementById('amuFlowValue').textContent = aralData.rivers.amuDarya.current + ' m³/s';
    document.getElementById('syrFlowValue').textContent = aralData.rivers.syrDarya.current + ' m³/s';
    document.getElementById('amuYearly').textContent = aralData.rivers.amuDarya.yearly + ' km³';
    document.getElementById('syrYearly').textContent = aralData.rivers.syrDarya.yearly + ' km³';
    document.getElementById('amuCurrent').textContent = aralData.rivers.amuDarya.current + ' m³/s';
    document.getElementById('syrCurrent').textContent = aralData.rivers.syrDarya.current + ' m³/s';
}

// Counter Animation
function animateCounter(elementId, target, duration) {
    const element = document.getElementById(elementId);
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = typeof target === 'number' && target % 1 !== 0 ? 
            current.toFixed(2) : Math.floor(current);
    }, 16);
}

// Initialize Map
function initializeMap() {
    const map = L.map('aralMap').setView([aralData.location.lat, aralData.location.lng], 7);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add markers
    const markers = [
        { lat: 43.75, lng: 59.00, title: "Mo'ynoq", type: "main" },
        { lat: 46.00, lng: 61.00, title: "Shimoliy Orol", type: "sensor" },
        { lat: 44.00, lng: 58.50, title: "Janubiy Orol", type: "sensor" }
    ];
    
    markers.forEach(marker => {
        const icon = marker.type === 'main' ? 
            L.divIcon({ html: '<i class="fas fa-map-marker-alt" style="color: #e63946; font-size: 2rem;"></i>', iconSize: [30, 30] }) :
            L.divIcon({ html: '<i class="fas fa-satellite-dish" style="color: #0077b6; font-size: 1.5rem;"></i>', iconSize: [25, 25] });
        
        L.marker([marker.lat, marker.lng], { icon: icon })
            .addTo(map)
            .bindPopup(`<b>${marker.title}</b><br>GPS: ${marker.lat}°N, ${marker.lng}°E`);
    });
    
    // Draw Aral Sea area (approximate)
    const aralSeaArea = [
        [46.5, 60.0],
        [46.0, 62.0],
        [44.5, 61.5],
        [43.0, 60.0],
        [43.5, 58.0],
        [45.0, 57.5]
    ];
    
    L.polygon(aralSeaArea, {
        color: '#0077b6',
        fillColor: '#00b4d8',
        fillOpacity: 0.3,
        weight: 2
    }).addTo(map).bindPopup("Orol dengizi hududi");
}

// Initialize Charts
function initializeCharts() {
    // Amu Darya Chart
    const amuCtx = document.getElementById('amuChart');
    if (amuCtx) {
        new Chart(amuCtx, {
            type: 'line',
            data: {
                labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
                datasets: [{
                    label: 'Amudaryo oqimi (m³/s)',
                    data: [380, 420, 480, 550, 620, 580, 520, 480, 440, 420, 400, 390],
                    borderColor: '#0077b6',
                    backgroundColor: 'rgba(0, 119, 182, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: false, min: 300 }
                }
            }
        });
    }
    
    // Syr Darya Chart
    const syrCtx = document.getElementById('syrChart');
    if (syrCtx) {
        new Chart(syrCtx, {
            type: 'line',
            data: {
                labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
                datasets: [{
                    label: 'Sirdaryo oqimi (m³/s)',
                    data: [240, 260, 300, 340, 380, 350, 320, 300, 280, 270, 260, 250],
                    borderColor: '#00b4d8',
                    backgroundColor: 'rgba(0, 180, 216, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: false, min: 200 }
                }
            }
        });
    }
}

// Live Data Updates
function startLiveDataUpdates() {
    setInterval(() => {
        // Simulate small fluctuations
        const amuVariation = (Math.random() - 0.5) * 10;
        const syrVariation = (Math.random() - 0.5) * 8;
        const salinityVariation = 0.001;
        
        const newAmu = aralData.rivers.amuDarya.current + amuVariation;
        const newSyr = aralData.rivers.syrDarya.current + syrVariation;
        const newSalinity = aralData.salinity.current + salinityVariation;
        
        document.getElementById('amuDaily').textContent = newAmu.toFixed(1);
        document.getElementById('syrDaily').textContent = newSyr.toFixed(1);
        document.getElementById('currentSalinity').textContent = newSalinity.toFixed(2);
    }, 5000);
}

// Populate Daily Data Table
function populateDailyTable() {
    const tbody = document.getElementById('dailyDataTable');
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const amuFlow = (aralData.rivers.amuDarya.current + (Math.random() - 0.5) * 50).toFixed(1);
        const syrFlow = (aralData.rivers.syrDarya.current + (Math.random() - 0.5) * 30).toFixed(1);
        const totalFlow = (parseFloat(amuFlow) + parseFloat(syrFlow)).toFixed(1);
        const salinity = (aralData.salinity.current + (6-i) * aralData.salinity.dailyIncrease).toFixed(2);
        const change = (Math.random() * 0.1 + 0.1).toFixed(2);
        
        const row = `
            <tr>
                <td>${date.toLocaleDateString('uz-UZ')}</td>
                <td>${amuFlow} m³/s</td>
                <td>${syrFlow} m³/s</td>
                <td><strong>${totalFlow} m³/s</strong></td>
                <td>${salinity} ppt</td>
                <td style="color: #e63946;">+${change} ppt</td>
            </tr>
        `;
        tbody.innerHTML += row;
    }
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

console.log('%c🌊 AralClean - Orol Dengizini Saqlash', 'color: #0077b6; font-size: 20px; font-weight: bold;');
console.log('%cQoraqalpog\'iston Respublikasi - Mo\'ynoq', 'color: #00b4d8; font-size: 14px;');