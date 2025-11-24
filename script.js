// --- [TAHAP FINAL] LOGIKA STABIL (ANTI-ERROR AUDIO) ---

// Inisialisasi Audio dengan Error Handling
const suaraKlik = new Audio('audio/klik.mp3');
const suaraNotif = new Audio('audio/notif.mp3');
const suaraJatuh = new Audio('audio/jatuh.mp3');
const suaraSukses = new Audio('audio/sukses.mp3');

// [BARU] Fungsi Aman untuk Memutar Suara
// Fungsi ini mencegah game error/macet jika file audio tidak ketemu
function mainkanSuara(audioObj) {
    if (audioObj) {
        // Reset waktu agar bisa diputar berulang cepat
        audioObj.currentTime = 0; 
        const playPromise = audioObj.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Kita 'telan' errornya supaya tidak muncul merah di console
                // dan tidak menghentikan permainan.
                console.warn("Audio tidak dapat diputar (Cek file audio):", error);
            });
        }
    }
}

// 1. DEFINISI DATA KARTU
const daftarKartu = [
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
let skorP1 = { disiplin: 0, jujur: 0 };
let skorP2 = { disiplin: 0, jujur: 0 };
let kartuSekarang = null;
let lubangDiKlikIndex = null;
let giliranPemain = 1;
let permainanSelesai = false;
let sedangAnimasi = false;
let toastTimer;

// [KONFIGURASI] Target menang (bisa diubah)
const TARGET_MENANG = 30; 

const papanAwalState = [
    7, 7, 7, 7, 7, 7, 7, 0,
    7, 7, 7, 7, 7, 7, 7, 0
];
let papanState = [...papanAwalState];

// Helper untuk jeda waktu (sleep)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function showToast(pesan) {
    clearTimeout(toastTimer);
    mainkanSuara(suaraNotif); // [UBAH] Pakai fungsi aman
    toastPesanEl.innerText = pesan;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => {
        toastEl.classList.remove('show');
    }, 2500);
}

// Fungsi Update Tampilan dengan Biji Visual
function updateTampilanPapan(highlightIndex = null) {
    if (giliranPemain === 1) {
        panelP1El.classList.add('active');
        panelP2El.classList.remove('active');
    } else {
        panelP1El.classList.remove('active');
        panelP2El.classList.add('active');
    }
    
    semuaLubangPapanEl.forEach(lubang => {
        const index = parseInt(lubang.dataset.index);
        const jumlah = papanState[index];
        const isLumbung = lubang.classList.contains('lumbung');

        // Kosongkan isi lubang dulu
        lubang.innerHTML = '';

        if (isLumbung) {
            // Jika LUMBUNG: Tampilkan Angka Besar
            const spanAngka = document.createElement('span');
            spanAngka.classList.add('jumlah-biji-angka');
            spanAngka.innerText = jumlah;
            lubang.appendChild(spanAngka);
        } else {
            // Jika LUBANG KECIL: Gambar Biji-biji
            if (jumlah > 0) {
                const visualLimit = Math.min(jumlah, 20); 
                for(let i = 0; i < visualLimit; i++) {
                    const biji = document.createElement('div');
                    biji.classList.add('biji');
                    lubang.appendChild(biji);
                }
            }
        }

        lubang.classList.remove('highlight-gerak');
        if (index === highlightIndex) {
            lubang.classList.add('highlight-gerak');
        }

        if (!isLumbung) {
            lubang.classList.remove('giliran-pemain-1', 'giliran-pemain-2', 'nonaktif');
            if (permainanSelesai) {
                lubang.classList.add('nonaktif');
            } else if (sedangAnimasi) {
                if (papanState[index] === 0) lubang.classList.add('nonaktif');
                else if (giliranPemain === 1 && index <= 6) lubang.classList.add('giliran-pemain-1');
                else if (giliranPemain === 2 && index >= 8 && index <= 14) lubang.classList.add('giliran-pemain-2');
                else lubang.classList.add('nonaktif');
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
}

function gantiGiliran() {
    giliranPemain = (giliranPemain === 1) ? 2 : 1;
    showToast(giliranPemain === 1 ? "Giliran Pemain 1" : "Giliran Pemain 2"); 
    updateTampilanPapan();
}

function tampilkanHasil(pemenangText = "Permainan Selesai!") {
    permainanSelesai = true;
    updateTampilanPapan();
    showToast(pemenangText);
    setTimeout(() => {
        mainkanSuara(suaraSukses); // [UBAH] Pakai fungsi aman
        modalRefleksiEl.classList.remove('tersembunyi');
    }, 500);
}

function tampilkanLencana() {
    modalRefleksiEl.classList.add('tersembunyi');
    const totalDisiplin = skorP1.disiplin + skorP2.disiplin;
    const totalJujur = skorP1.jujur + skorP2.jujur;
    
    // Reset kelas
    lencanaGambarEl.className = 'ikon-besar-modal';

    if (totalJujur > totalDisiplin) {
        lencanaJudulEl.innerText = "Hebat, Anak Jujur!";
        // Ikon Hati Bersinar
        lencanaGambarEl.innerHTML = '<i class="fas fa-heart"></i>';
        lencanaGambarEl.classList.add('warna-hati');
        
        lencanaTeksEl.innerText = "Kalian mendapatkan Lencana 'Anak Jujur Hari Ini'!";
        lencanaKontenEl.className = "kartu-konten"; // Reset border style jika perlu
        lencanaKontenEl.style.borderColor = '#e91e63';
        
    } else if (totalDisiplin > totalJujur) {
        lencanaJudulEl.innerText = "Hebat, Anak Disiplin!";
        // Ikon Jam/Medali
        lencanaGambarEl.innerHTML = '<i class="fas fa-medal"></i>';
        lencanaGambarEl.classList.add('warna-jam');
        
        lencanaTeksEl.innerText = "Kalian mendapatkan Lencana 'Anak Disiplin Hari Ini'!";
        lencanaKontenEl.style.borderColor = '#4caf50';

    } else {
        lencanaJudulEl.innerText = "Luar Biasa!";
        // Ikon Piala Emas
        lencanaGambarEl.innerHTML = '<i class="fas fa-trophy"></i>';
        lencanaGambarEl.classList.add('warna-emas');
        
        lencanaTeksEl.innerText = "Kalian hebat dalam Kejujuran dan Kedisiplinan!";
        lencanaKontenEl.style.borderColor = '#FFD700';
    }
    modalLencanaEl.classList.remove('tersembunyi');
}

function resetGame() {
    mainkanSuara(suaraKlik); // [UBAH] Pakai fungsi aman
    modalLencanaEl.classList.add('tersembunyi');
    papanState = [...papanAwalState];
    skorP1 = { disiplin: 0, jujur: 0 };
    skorP2 = { disiplin: 0, jujur: 0 };
    giliranPemain = 1;
    permainanSelesai = false;
    sedangAnimasi = false;
    meterDisiplinP1El.innerText = "0";
    meterJujurP1El.innerText = "0";
    meterDisiplinP2El.innerText = "0";
    meterJujurP2El.innerText = "0";
    showToast("Permainan Dimulai!");
    updateTampilanPapan();
}

// Logika Cek Akhir Permainan
function cekAkhirPermainan() {
    if (papanState[7] >= TARGET_MENANG) {
        tampilkanHasil("Pemain 1 Menang!");
        return true;
    }
    if (papanState[15] >= TARGET_MENANG) {
        tampilkanHasil("Pemain 2 Menang!");
        return true;
    }

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
        
        if (papanState[7] > papanState[15]) tampilkanHasil("Pemain 1 Menang!");
        else if (papanState[15] > papanState[7]) tampilkanHasil("Pemain 2 Menang!");
        else tampilkanHasil("Seri!");
        
        return true;
    }
    return false;
}

// Logika Gerak (Tanpa Nembak)
async function gerakkanBiji(startIndex) {
    sedangAnimasi = true;
    let bijiDiTangan = papanState[startIndex];
    papanState[startIndex] = 0;
    updateTampilanPapan();
    
    let currentIndex = startIndex;

    while (bijiDiTangan > 0) {
        await sleep(400);
        currentIndex = (currentIndex + 1) % 16;
        if (giliranPemain === 1 && currentIndex === 15) continue;
        if (giliranPemain === 2 && currentIndex === 7) continue;

        papanState[currentIndex]++;
        bijiDiTangan--;
        
        // [UBAH] Kloning node audio agar bisa dimainkan tumpang tindih (rapid fire)
        // tapi tetap dibungkus fungsi aman
        if (suaraJatuh) {
            try {
               const clone = suaraJatuh.cloneNode();
               clone.volume = 0.5; // Kecilkan sedikit biar ga berisik
               clone.play().catch(() => {}); 
            } catch(e) {}
        }
        
        updateTampilanPapan(currentIndex);
    }

    await sleep(200);
    updateTampilanPapan(null);

    // Logika Masuk Lumbung Sendiri -> Main Lagi
    if ((giliranPemain === 1 && currentIndex === 7) || (giliranPemain === 2 && currentIndex === 15)) {
        if (cekAkhirPermainan()) {
            sedangAnimasi = false;
            return;
        }
        mainkanSuara(suaraSukses); // [UBAH] Pakai fungsi aman
        sedangAnimasi = false;
        showToast("Hore! Main Lagi!");
        return;
    }

    if (cekAkhirPermainan()) {
        sedangAnimasi = false;
        return;
    }
    
    sedangAnimasi = false;
    gantiGiliran();
}

function tampilkanKartuAcak() {
    kartuSekarang = daftarKartu[Math.floor(Math.random() * daftarKartu.length)];
    const kartuKonten = modalKartuEl.querySelector('.kartu-konten');
    const kartuIkonEl = document.getElementById('kartu-ikon');

    if (kartuSekarang.tipe === 'disiplin') {
        // Ganti Emoji Judul dengan Ikon Jam
        kartuJudulEl.innerHTML = '<i class="fas fa-clock"></i> Kartu Kedisiplinan';
        kartuKonten.style.borderColor = '#4caf50'; // Hijau
        // Ganti Avatar Besar
        kartuIkonEl.innerHTML = '<i class="fas fa-hourglass-half"></i>';
        kartuIkonEl.className = 'ikon-besar-modal warna-jam';
    } else {
        // Ganti Emoji Judul dengan Ikon Hati
        kartuJudulEl.innerHTML = '<i class="fas fa-heart"></i> Kartu Kejujuran';
        kartuKonten.style.borderColor = '#e91e63'; // Pink
        // Ganti Avatar Besar
        kartuIkonEl.innerHTML = '<i class="fas fa-hand-holding-heart"></i>';
        kartuIkonEl.className = 'ikon-besar-modal warna-hati';
    }

    kartuTeksEl.innerText = kartuSekarang.teks;
    kartuResponEl.innerHTML = '';
    
    kartuSekarang.respon.forEach(teksTombol => {
        const tombol = document.createElement('button');
        
        // Cek isi teks untuk memberi ikon yang sesuai di tombol
        let ikonTombol = '';
        if(teksTombol.includes('Jujur') || teksTombol === 'Aku') ikonTombol = '<i class="fas fa-check"></i> ';
        else if(teksTombol === 'Teman') ikonTombol = '<i class="fas fa-user-friends"></i> ';
        
        // Gunakan innerHTML agar ikon terbaca
        tombol.innerHTML = ikonTombol + teksTombol;
        
        tombol.classList.add('tombol-respon');
        tombol.addEventListener('click', () => handleRespon(kartuSekarang.tipe));
        kartuResponEl.appendChild(tombol);
    });
    
    tombolLanjutEl.disabled = true;
    modalKartuEl.classList.remove('tersembunyi');
}

function handleRespon(tipeNilai) {
    mainkanSuara(suaraKlik); // [UBAH] Pakai fungsi aman
    if (giliranPemain === 1) {
        if (tipeNilai === 'disiplin') {
            skorP1.disiplin++;
            meterDisiplinP1El.innerText = skorP1.disiplin;
        } else {
            skorP1.jujur++;
            meterJujurP1El.innerText = skorP1.jujur;
        }
    } else {
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
    mainkanSuara(suaraKlik); // [UBAH] Pakai fungsi aman
    modalKartuEl.classList.add('tersembunyi');
    if (lubangDiKlikIndex !== null) {
        gerakkanBiji(lubangDiKlikIndex);
    }
    lubangDiKlikIndex = null;
}

tombolLanjutEl.addEventListener('click', sembunyikanKartu);
semuaLubangEl.forEach(lubang => {
    lubang.addEventListener('click', () => {
        if (permainanSelesai) return;
        if (sedangAnimasi) return;

        const indexStr = lubang.dataset.index;
        if (!indexStr || isNaN(parseInt(indexStr[0]))) return; 
        const index = parseInt(indexStr);

        if (papanState[index] === 0) return;
        if (giliranPemain === 1 && index > 6) return;
        if (giliranPemain === 2 && (index < 8 || index > 14)) return;
        lubangDiKlikIndex = index;
        tampilkanKartuAcak();
    });
});
refleksiTombolEl.forEach(tombol => {
    tombol.addEventListener('click', () => {
        mainkanSuara(suaraKlik); // [UBAH] Pakai fungsi aman
        tampilkanLencana();
    });
});
tombolMainLagiEl.addEventListener('click', resetGame);

updateTampilanPapan();