// Fungsi untuk menentukan status tekanan darah
function getTekananDarahStatus(tekanan) {
    return tekanan >= 90 && tekanan <= 120 ? "Normal" : "Tidak Normal";
}

// Fungsi untuk menghitung IMT dan status kesehatan
function hitungIMT(tinggi, berat) {
    let tinggiMeter = tinggi / 100;
    let imt = berat / (tinggiMeter * tinggiMeter);
    let status;
    if (imt < 18.5) {
        status = "Kurus";
    } else if (imt >= 18.5 && imt <= 24.9) {
        status = "Ideal";
    } else if (imt >= 25 && imt <= 29.9) {
        status = "Gemuk";
    } else {
        status = "Obesitas";
    }
    return { imt: imt.toFixed(1), status };
}

// Fungsi untuk menyimpan data ke localStorage
function simpanData() {
    const tanggal = document.getElementById("tanggal").value;
    const tinggi = document.getElementById("tinggi").value;
    const berat = document.getElementById("berat").value;
    const tekanan = document.getElementById("tekanan").value;

    if (!tanggal || !tinggi || !berat || !tekanan) {
        alert("Harap lengkapi semua data.");
        return;
    }

    const { imt, statusIMT } = hitungIMT(tinggi, berat);
    const statusTekananDarah = getTekananDarahStatus(tekanan);

    // Ambil data riwayat yang ada, atau buat array kosong jika belum ada
    let riwayat = JSON.parse(localStorage.getItem("riwayatKesehatan")) || [];

    // Tambahkan data baru ke dalam riwayat
    const dataBaru = { tanggal, tinggi, berat, tekanan, imt, statusIMT, statusTekananDarah };
    riwayat.push(dataBaru);

    // Filter data yang masih dalam waktu satu bulan
    riwayat = riwayat.filter((data) => {
        const dataDate = new Date(data.tanggal);
        return isWithinOneMonth(dataDate);
    });

    // Simpan data yang sudah difilter kembali ke localStorage
    localStorage.setItem("riwayatKesehatan", JSON.stringify(riwayat));

    // Tampilkan data terbaru
    tampilkanData();
}

// Fungsi untuk menampilkan data
function tampilkanData() {
    let riwayat = JSON.parse(localStorage.getItem("riwayatKesehatan")) || [];
    let dataTable = document.getElementById("data-table");
    dataTable.innerHTML = "";

    // Balik array agar data terbaru muncul di atas
    riwayat.slice().reverse().forEach((data) => {
        let row = `<tr>
            <td>${data.tanggal}</td>
            <td>${data.tinggi}</td>
            <td>${data.berat}</td>
            <td>${data.tekanan} (${data.statusTekananDarah})</td>
            <td>${data.imt}</td>
            <td>${data.statusIMT}</td>
        </tr>`;
        dataTable.innerHTML += row;
    });
}

// Fungsi untuk memeriksa apakah data masih dalam waktu satu bulan
function isWithinOneMonth(date) {
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    return date >= oneMonthAgo && date <= currentDate;
}

// Fungsi untuk menambahkan data baru (untuk button "Tambah Data")
function tambahData() {
    let tanggal = document.getElementById("tanggal").value;
    let tinggi = document.getElementById("tinggi").value;
    let berat = document.getElementById("berat").value;
    let tekanan = document.getElementById("tekanan").value;

    if (!tanggal || !tinggi || !berat || !tekanan) {
        alert("Harap lengkapi semua data.");
        return;
    }

    let { imt, status } = hitungIMT(tinggi, berat);
    let statusTekananDarah = getTekananDarahStatus(tekanan);

    let data = { tanggal, tinggi, berat, tekanan, imt, statusIMT: status, statusTekananDarah };

    // Simpan data ke localStorage
    let riwayat = JSON.parse(localStorage.getItem("riwayatKesehatan")) || [];
    riwayat.push(data);
    localStorage.setItem("riwayatKesehatan", JSON.stringify(riwayat));

    alert("Data berhasil ditambahkan!");
    // Kosongkan input setelah data ditambahkan
    document.getElementById("tanggal").value = "";
    document.getElementById("tinggi").value = "";
    document.getElementById("berat").value = "";
    document.getElementById("tekanan").value = "";

    // Tampilkan data terbaru
    tampilkanData();
}
