// Muat file audio
const suaraKlik = new Audio('audio/klik.wav');
const suaraNotif = new Audio('audio/notif.wav');
const suaraJatuh = new Audio('audio/jatuh.wav');
const suaraSukses = new Audio('audio/sukses.wav');

// 1. DEFINISI DATA KARTU
const daftarKartu = [
    // 10 Kartu Kedisiplinan
    { tipe: "disiplin", teks: "Kalau Ibu bilang mandi, kamu langsung mandi atau main dulu?", respon: ["🚿", "🧸"] },
    { tipe: "disiplin", teks: "Sekarang pura-pura berbaris yuk!", respon: ["Siap!"] },
    { tipe: "disiplin", teks: "Waktunya membereskan mainan. Kamu lakukan sendiri atau disuruh?", respon: ["🙋", "🗣️"] },
    { tipe: "disiplin", teks: "Sebelum makan, apa yang kamu lakukan dulu?", respon: ["🧼", "🍚"] },
    { tipe: "disiplin", teks: "Sekarang pura-pura duduk rapi seperti di kelas!", respon: ["Duduk Rapi"] },
    { tipe: "disiplin", teks: "Kalau lampu merah di jalan, apa yang kamu lakukan?", respon: ["🛑 Berhenti", "🏃 Jalan"] },
    { tipe: "disiplin", teks: "Kalau main congklak, giliran siapa dulu?", respon: ["Aku", "Teman"] },
    { tipe: "disiplin", teks: "Saat guru bicara, kamu mendengarkan atau bicara juga?", respon: ["👂", "🗣️"] },
    { tipe: "disiplin", teks: "Ayo kita tepuk tangan tiga kali sebelum mulai main.", respon: ["Tepuk!"] },
    { tipe: "disiplin", teks: "Kalau sudah selesai, apa yang kamu ucapkan?", respon: ["Terima kasih"] },

    // 10 Kartu Kejujuran
    { tipe: "jujur", teks: "Kalau kamu salah tekan biji, apa yang kamu lakukan?", respon: ["Aku Jujur"] },
    { tipe: "jujur", teks: "Kalau temanmu menjatuhkan biji, kamu bantu atau diam?", respon: ["🤝", "🙈"] },
    { tipe: "jujur", teks: "Kalau kamu belum cuci tangan tapi mau makan, apa yang kamu lakukan?", respon: ["🧼", "🍚"] },
    { tipe: "jujur", teks: "Guru bertanya: siapa belum mengumpulkan tugas? Kamu angkat tangan atau diam?", respon: ["✋", "🤫"] },
    { tipe: "jujur", teks: "Pernahkah kamu bilang 'tidak tahu' saat belum bisa?", respon: ["Ya", "Belum"] },
    { tipe: "jujur", teks: "Kalau kamu menumpahkan air, kamu bilang ke guru atau diam?", respon: ["🗣️", "🤫"] },
    { tipe: "jujur", teks: "Sekarang pura-pura bilang jujur pada teman.", respon: ["Aku jujur, ya."] },
    { tipe: "jujur", teks: "Kalau kamu kalah main, apa yang kamu lakukan?", respon: ["😊", "😡"] },
    { tipe: "jujur", teks: "Kalau ada mainan rusak, kamu bilang siapa yang rusak?", respon: ["Bilang Guru"] },
    { tipe: "jujur", teks: "Kamu suka orang yang jujur?", respon: ["❤️", "😐"] }
];

// 2. REFERENSI ELEMEN
// [MODIFIKASI] Referensi panel skor baru
const meterDisiplinP1El = document.getElementById('meter-disiplin-p1');
const meterJujurP1El = document.getElementById('meter-jujur-p1');
const meterDisiplinP2El = document.getElementById('meter-disiplin-p2');
const meterJujurP2El = document.getElementById('meter-jujur-p2');
const panelP1El = document.getElementById('panel-pemain-1');
const panelP2El = document.getElementById('panel-pemain-2');

const modalKartuEl = document.getElementById('modal-kartu');
const kartuJudulEl = document.getElementById('kartu-judul');
const kartuTeksEl = document.getElementById('kartu-teks');
const kartuResponEl = document.getElementById('kartu-respon');
const tombolLanjutEl = document.getElementById('tombol-lanjut');
const semuaLubangPapanEl = document.querySelectorAll('[data-index]');
const semuaLubangEl = document.querySelectorAll('.lubang');
const modalRefleksiEl = document.getElementById('modal-refleksi');
const refleksiTombolEl = document.querySelectorAll('.refleksi-pilihan button');
const modalLencanaEl = document.getElementById('modal-lencana');
const lencanaJudulEl = document.getElementById('lencana-judul');
const lencanaGambarEl = document.getElementById('lencana-gambar');
const lencanaTeksEl = document.getElementById('lencana-teks');
const lencanaKontenEl = document.getElementById('lencana-konten');
const tombolMainLagiEl = document.getElementById('tombol-main-lagi');
const toastEl = document.getElementById('toast-notif');
const toastPesanEl = document.getElementById('toast-pesan');

// 3. VARIABEL STATE PERMAINAN
// [MODIFIKASI] Skor sekarang disimpan dalam obyek per pemain
let skorP1 = { disiplin: 0, jujur: 0 };
let skorP2 = { disiplin: 0, jujur: 0 };

let kartuSekarang = null;
let lubangDiKlikIndex = null;
let giliranPemain = 1;
let permainanSelesai = false;
let toastTimer;

const papanAwalState = [
    7, 7, 7, 7, 7, 7, 7, 0,
    7, 7, 7, 7, 7, 7, 7, 0
];
let papanState = [...papanAwalState];

// 4. FUNGSI-FUNGSI UTAMA

function showToast(pesan) {
    clearTimeout(toastTimer);
    try { suaraNotif.play(); } catch(e) { console.log("Audio notif error"); }
    toastPesanEl.innerText = pesan;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => {
        toastEl.classList.remove('show');
    }, 2500);
}

function updateTampilanPapan() {
    // [BARU] Logika untuk highlight panel pemain aktif
    if (giliranPemain === 1) {
        panelP1El.classList.add('active');
        panelP2El.classList.remove('active');
    } else {
        panelP1El.classList.remove('active');
        panelP2El.classList.add('active');
    }
    
    // Update biji di papan
    semuaLubangPapanEl.forEach(lubang => {
        const index = parseInt(lubang.dataset.index);
        const spanBiji = lubang.querySelector('.jumlah-biji');
        spanBiji.innerText = papanState[index];

        if (!lubang.classList.contains('lumbung')) {
            lubang.classList.remove('giliran-pemain-1', 'giliran-pemain-2', 'nonaktif');
            if (permainanSelesai) {
                lubang.classList.add('nonaktif');
            } else if (papanState[index] === 0) {
                lubang.classList.add('nonaktif');
            } else if (giliranPemain === 1 && index <= 6) {
                lubang.classList.add('giliran-pemain-1');
            } else if (giliranPemain === 2 && index >= 8 && index <= 14) {
                lubang.classList.add('giliran-pemain-2');
            } else {
                lubang.classList.add('nonaktif');
            }
        }
    });
    console.log(`Giliran Pemain: ${giliranPemain}`);
}

function gantiGiliran() {
    giliranPemain = (giliranPemain === 1) ? 2 : 1;
    showToast(giliranPemain === 1 ? "Giliran Pemain 1" : "Giliran Pemain 2"); 
    updateTampilanPapan();
}

function tampilkanHasil() {
    console.log("Permainan Selesai!");
    permainanSelesai = true;
    updateTampilanPapan();
    showToast("Permainan Selesai!");

    setTimeout(() => {
        try { suaraSukses.play(); } catch(e) { console.log("Audio sukses error"); }
        modalRefleksiEl.classList.remove('tersembunyi');
    }, 500);
}

// [MODIFIKASI] Logika lencana sekarang menghitung total skor
function tampilkanLencana() {
    modalRefleksiEl.classList.add('tersembunyi');

    const totalDisiplin = skorP1.disiplin + skorP2.disiplin;
    const totalJujur = skorP1.jujur + skorP2.jujur;

    if (totalJujur > totalDisiplin) {
        lencanaJudulEl.innerText = "Hebat, Anak Jujur!";
        lencanaGambarEl.innerText = "💖";
        lencanaTeksEl.innerText = "Kalian mendapatkan Lencana 'Anak Jujur Hari Ini'!";
        lencanaKontenEl.className = "kartu-konten jujur";
    } else if (totalDisiplin > totalJujur) {
        lencanaJudulEl.innerText = "Hebat, Anak Disiplin!";
        lencanaGambarEl.innerText = "🕒";
        lencanaTeksEl.innerText = "Kalian mendapatkan Lencana 'Anak Disiplin Hari Ini'!";
        lencanaKontenEl.className = "kartu-konten disiplin";
    } else {
        lencanaJudulEl.innerText = "Luar Biasa!";
        lencanaGambarEl.innerText = "🏆";
        lencanaTeksEl.innerText = "Kalian hebat dalam Kejujuran dan Kedisiplinan!";
        lencanaKontenEl.className = "kartu-konten";
    }
    modalLencanaEl.classList.remove('tersembunyi');
}

// [MODIFIKASI] Reset game sekarang mereset skor kedua pemain
function resetGame() {
    try { suaraKlik.play(); } catch(e) { console.log("Audio klik error"); }
    modalLencanaEl.classList.add('tersembunyi');

    papanState = [...papanAwalState];
    skorP1 = { disiplin: 0, jujur: 0 };
    skorP2 = { disiplin: 0, jujur: 0 };
    giliranPemain = 1;
    permainanSelesai = false;

    // Reset tampilan meteran
    meterDisiplinP1El.innerText = "0";
    meterJujurP1El.innerText = "0";
    meterDisiplinP2El.innerText = "0";
    meterJujurP2El.innerText = "0";
    
    showToast("Permainan Dimulai!");
    updateTampilanPapan(); // Ini akan meng-highlight panel P1
}

function cekAkhirPermainan() {
    let totalBijiP1 = 0;
    for (let i = 0; i <= 6; i++) { totalBijiP1 += papanState[i]; }
    let totalBijiP2 = 0;
    for (let i = 8; i <= 14; i++) { totalBijiP2 += papanState[i]; }

    if (totalBijiP1 === 0 || totalBijiP2 === 0) {
        for (let i = 0; i <= 6; i++) {
            papanState[7] += papanState[i];
            papanState[i] = 0;
        }
        for (let i = 8; i <= 14; i++) {
            papanState[15] += papanState[i];
            papanState[i] = 0;
        }
        tampilkanHasil();
        return true;
    }
    return false;
}

function gerakkanBiji(startIndex) {
    try { suaraJatuh.play(); } catch(e) { console.log("Audio jatuh error"); }
    let bijiDiTangan = papanState[startIndex];
    papanState[startIndex] = 0;
    let currentIndex = startIndex;

    while (bijiDiTangan > 0) {
        currentIndex = (currentIndex + 1) % 16;
        if (giliranPemain === 1 && currentIndex === 15) continue;
        if (giliranPemain === 2 && currentIndex === 7) continue;
        papanState[currentIndex]++;
        bijiDiTangan--;
    }

    if ((giliranPemain === 1 && currentIndex === 7) || (giliranPemain === 2 && currentIndex === 15)) {
        if (cekAkhirPermainan()) return;
        updateTampilanPapan();
        return;
    }

    const bijiDiLubangTerakhir = papanState[currentIndex];
    const sisiPemain1 = currentIndex >= 0 && currentIndex <= 6;
    const sisiPemain2 = currentIndex >= 8 && currentIndex <= 14;

    if (bijiDiLubangTerakhir === 1) {
        if (giliranPemain === 1 && sisiPemain1) {
            const indexLawan = 14 - currentIndex;
            if (papanState[indexLawan] > 0) {
                const bijiDitembak = papanState[indexLawan] + 1;
                papanState[indexLawan] = 0;
                papanState[currentIndex] = 0;
                papanState[7] += bijiDitembak;
            }
        } else if (giliranPemain === 2 && sisiPemain2) {
            const indexLawan = 14 - currentIndex;
            if (papanState[indexLawan] > 0) {
                const bijiDitembak = papanState[indexLawan] + 1;
                papanState[indexLawan] = 0;
                papanState[currentIndex] = 0;
                papanState[15] += bijiDitembak;
            }
        }
    }

    if (cekAkhirPermainan()) return;
    gantiGiliran();
}

function tampilkanKartuAcak() {
    kartuSekarang = daftarKartu[Math.floor(Math.random() * daftarKartu.length)];
    const kartuKonten = modalKartuEl.querySelector('.kartu-konten');
    if (kartuSekarang.tipe === 'disiplin') {
        kartuJudulEl.innerText = '🕒 Kartu Kedisiplinan';
        kartuKonten.style.borderColor = '#90EE90';
    } else {
        kartuJudulEl.innerText = '💖 Kartu Kejujuran';
        kartuKonten.style.borderColor = '#FFD700';
    }
    kartuTeksEl.innerText = kartuSekarang.teks;
    kartuResponEl.innerHTML = '';
    kartuSekarang.respon.forEach(teksTombol => {
        const tombol = document.createElement('button');
        tombol.innerText = teksTombol;
        tombol.classList.add('tombol-respon');
        tombol.addEventListener('click', () => handleRespon(kartuSekarang.tipe));
        kartuResponEl.appendChild(tombol);
    });
    tombolLanjutEl.disabled = true;
    modalKartuEl.classList.remove('tersembunyi');
}

// [MODIFIKASI] Fungsi ini sekarang menambahkan skor ke pemain yang aktif
function handleRespon(tipeNilai) {
    try { suaraKlik.play(); } catch(e) { console.log("Audio klik error"); }
    
    if (giliranPemain === 1) {
        // Tambahkan skor ke Pemain 1
        if (tipeNilai === 'disiplin') {
            skorP1.disiplin++;
            meterDisiplinP1El.innerText = skorP1.disiplin;
        } else {
            skorP1.jujur++;
            meterJujurP1El.innerText = skorP1.jujur;
        }
    } else {
        // Tambahkan skor ke Pemain 2
        if (tipeNilai === 'disiplin') {
            skorP2.disiplin++;
            meterDisiplinP2El.innerText = skorP2.disiplin;
        } else {
            skorP2.jujur++;
            meterJujurP2El.innerText = skorP2.jujur;
        }
    }

    kartuResponEl.innerHTML = '<p>Bagus! Kamu sudah merespon.</p>';
    tombolLanjutEl.disabled = false;
}

function sembunyikanKartu() {
    try { suaraKlik.play(); } catch(e) { console.log("Audio klik error"); }
    modalKartuEl.classList.add('tersembunyi');
    if (lubangDiKlikIndex !== null) {
        gerakkanBiji(lubangDiKlikIndex);
    }
    lubangDiKlikIndex = null;
}

// 5. EVENT LISTENERS
tombolLanjutEl.addEventListener('click', sembunyikanKartu);

semuaLubangEl.forEach(lubang => {
    lubang.addEventListener('click', () => {
        if (permainanSelesai) return;
        const index = parseInt(lubang.dataset.index);
        if (papanState[index] === 0) return;
        if (giliranPemain === 1 && index > 6) return;
        if (giliranPemain === 2 && (index < 8 || index > 14)) return;
        lubangDiKlikIndex = index;
        tampilkanKartuAcak();
    });
});

refleksiTombolEl.forEach(tombol => {
    tombol.addEventListener('click', () => {
        try { suaraKlik.play(); } catch(e) { console.log("Audio klik error"); }
        tampilkanLencana();
    });
});

tombolMainLagiEl.addEventListener('click', resetGame);

// 6. INISIALISASI PERMAINAN
updateTampilanPapan(); // Memulai permainan