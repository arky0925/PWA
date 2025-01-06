const scriptURL = 'https://script.google.com/macros/s/AKfycbw1B8X2A0o2qt0Fd-6nID1XoXdP1VdJoXxUzJjvO7Z7dc7k8Q3qgFloYzhcKe0eHu3m/exec'

document.getElementById('fetchDataButton').addEventListener('click', () => {
    fetch(scriptURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const display = document.getElementById('dataDisplay');
            display.innerHTML = ''; // 既存の内容をクリア

            data.forEach(row => {
                const newRow = document.createElement('tr');
                row.forEach(cell => {
                    const newCell = document.createElement('td');
                    newCell.innerText = cell; // セルの内容を追加
                    newRow.appendChild(newCell);
                });
                display.appendChild(newRow); // 新しい行をテーブルに追加
            });
        })
        .catch(error => console.error('Error!', error.message));
});
