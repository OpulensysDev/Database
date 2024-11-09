document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        for (const file of fileInput.files) {
            formData.append('files', file);
        }

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                alert('Arquivo(s) enviado(s) com sucesso!');
                updateFileList();
            } else {
                alert('Erro ao enviar arquivo(s)');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar arquivo(s)');
        }
    });

    async function updateFileList() {
        try {
            const response = await fetch('/files');
            const files = await response.json();
            fileList.innerHTML = '';
            files.forEach(file => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = `/files/${file}`;
                link.textContent = file;
                link.className = 'file-link';
                link.target = '_blank';
                li.appendChild(link);
                fileList.appendChild(li);
            });
        } catch (error) {
            console.error('Erro ao atualizar lista de arquivos:', error);
        }
    }

    updateFileList();
});
