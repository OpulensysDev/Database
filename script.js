let chart;
let datasets = [
    {
        label: 'Dados 1',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
        label: 'Dados 2',
        data: [7, 11, 5, 8, 3, 7],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }
];
let labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

function initChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Meu Gráfico'
                }
            }
        }
    });
}

function updateChart() {
    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.options.plugins.legend.display = document.getElementById('show-legend').checked;
    chart.options.plugins.title.text = document.getElementById('chart-title').value;
    chart.options.animation.duration = parseInt(document.getElementById('animation-duration').value);
    chart.update();
}

function renderDatasets() {
    const container = document.getElementById('datasets-container');
    container.innerHTML = '';

    datasets.forEach((dataset, index) => {
        const datasetElement = document.createElement('div');
        datasetElement.className = 'dataset';
        datasetElement.innerHTML = `
            <div class="dataset-header">
                <input type="text" class="dataset-title" value="${dataset.label}" data-index="${index}">
                <div class="dataset-controls">
                    <button class="change-color" data-index="${index}">Mudar Cor</button>
                    <button class="remove-dataset" data-index="${index}">Remover</button>
                </div>
            </div>
            <div class="data-inputs">
                ${dataset.data.map((value, i) => `
                    <div class="data-input">
                        <label>${labels[i] || `Valor ${i + 1}`}</label>
                        <input type="number" value="${value}" data-dataset="${index}" data-index="${i}">
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(datasetElement);
    });

    // Adicionar listeners para os inputs
    document.querySelectorAll('.data-inputs input').forEach(input => {
        input.addEventListener('change', (e) => {
            const datasetIndex = parseInt(e.target.dataset.dataset);
            const valueIndex = parseInt(e.target.dataset.index);
            datasets[datasetIndex].data[valueIndex] = parseFloat(e.target.value);
            updateChart();
        });
    });

    // Listener para mudança de título do dataset
    document.querySelectorAll('.dataset-title').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            datasets[index].label = e.target.value;
            updateChart();
        });
    });

    // Listener para remoção de dataset
    document.querySelectorAll('.remove-dataset').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            datasets.splice(index, 1);
            renderDatasets();
            updateChart();
        });
    });

    // Listener para mudança de cor
    document.querySelectorAll('.change-color').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const newColor = getRandomColor();
            datasets[index].borderColor = newColor;
            datasets[index].backgroundColor = newColor.replace('rgb', 'rgba').replace(')', ', 0.5)');
            updateChart();
        });
    });
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
}

document.getElementById('chart-type').addEventListener('change', (e) => {
    chart.config.type = e.target.value;
    updateChart();
});

document.getElementById('chart-title').addEventListener('input', updateChart);
document.getElementById('show-legend').addEventListener('change', updateChart);
document.getElementById('animation-duration').addEventListener('input', (e) => {
    document.getElementById('animation-duration-value').textContent = e.target.value;
    updateChart();
});

document.getElementById('add-dataset').addEventListener('click', () => {
    const newColor = getRandomColor();
    datasets.push({
        label: `Dados ${datasets.length + 1}`,
        data: Array(labels.length).fill(0),
        borderColor: newColor,
        backgroundColor: newColor.replace('rgb', 'rgba').replace(')', ', 0.5)'),
    });
    renderDatasets();
    updateChart();
});

document.getElementById('export-image').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'meu-grafico.png';
    link.href = document.getElementById('myChart').toDataURL();
    link.click();
});

// Inicialização
initChart();
renderDatasets();
