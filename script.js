// --- [TAHAP FINAL] LOGIKA STABIL + MUSIK LATAR (BGM) ---

// Inisialisasi Audio Efek
const suaraKlik = new Audio('audio/klik.mp3');
const suaraNotif = new Audio('audio/notif.mp3');
const suaraJatuh = new Audio('audio/jatuh.mp3');
const suaraSukses = new Audio('audio/sukses.mp3');

// [BARU] Inisialisasi Musik Latar
const musikLatar = new Audio('audio/bgm.mp3');
musikLatar.loop = true;   // Agar musik berputar terus (looping)
musikLatar.volume = 0.2;  // Volume kecil (20%) agar tidak berisik

// Fungsi Aman untuk Memutar Suara Efek
function mainkanSuara(audioObj) {
    if (audioObj) {
        audioObj.currentTime = 0; 
        const playPromise = audioObj.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Audio error (abaikan jika file belum ada):", error);
            });
        }
    }
}

// [BARU] Fungsi Pintar Memutar Musik Latar
function putarMusikLatar() {
    // Hanya putar jika musik sedang mati (paused)
    if (musikLatar.paused) {
        const playPromise = musikLatar.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Menunggu interaksi user untuk memutar musik...");
                // Jika gagal autoplay, pasang listener untuk klik pertama
                document.addEventListener('click', () => {
                    musikLatar.play();
                }, { once: true }); // once: true artinya hanya jalan sekali saja
            });
        }
    }
}

// [BARU] Fungsi Stop Musik
function stopMusikLatar() {
    musikLatar.pause();
    musikLatar.currentTime = 0; // Reset ke awal lagu
}

// 1. DEFINISI DATA KARTU (VERSI BARU: LEBIH NATURAL & EMOJI REAL)
const daftarKartu = [
    // --- KATEGORI: DISIPLIN (🕒) ---
    { tipe: "disiplin", teks: "Habis bangun tidur, kasurnya dibiarin berantakan atau dirapikan dulu?", respon: ["🛏️ Rapikan Dulu", "🏃 Langsung Lari"] },
    { tipe: "disiplin", teks: "Wah, sudah jam makan siang! Cuci tangan dulu atau langsung ambil sendok?", respon: ["🧼 Cuci Tangan", "🍽️ Langsung Makan"] },
    { tipe: "disiplin", teks: "Mainan sudah selesai dipakai nih. Siapa yang harus membereskan?", respon: ["🙋 Aku Sendiri", "👵 Minta Nenek"] },
    { tipe: "disiplin", teks: "Ada PR dari Bu Guru. Dikerjakan pulang sekolah atau nanti malam pas ngantuk?", respon: ["📝 Pulang Sekolah", "😴 Pas Ngantuk"] },
    { tipe: "disiplin", teks: "Masuk ke rumah teman, nyelonong masuk atau ketuk pintu dulu?", respon: ["🚪 Ketuk Pintu", "🏃 Nyelonong"] },
    { tipe: "disiplin", teks: "Sampah bekas jajan ini dibuang ke mana ya?", respon: ["🗑️ Tong Sampah", "🪟 Lempar Jendela"] },
    { tipe: "disiplin", teks: "Kalau antri beli es krim, ada teman nyerobot. Kamu ikutan nyerobot nggak?", respon: ["⛔ Enggak Dong", "🏃 Ikut Nyerobot"] },
    { tipe: "disiplin", teks: "Besok sekolah pagi. Malam ini tidurnya larut malam atau tepat waktu?", respon: ["⏰ Tepat Waktu", "🎮 Gadang Main HP"] },
    { tipe: "disiplin", teks: "Lampu merah menyala! Ayah mau jalan terus, kamu bilang apa?", respon: ["🛑 Berhenti Yah!", "🚗 Gas Terus!"] },
    { tipe: "disiplin", teks: "Mau pinjam pensil teman. Langsung ambil atau bilang 'pinjam ya'?", respon: ["🗣️ Izin Dulu", "🤏 Asal Ambil"] },
    // --- KATEGORI: JUJUR (💖) ---
    { tipe: "jujur", teks: "Waduh, gelas Ibu pecah tersenggol kamu! Bilang jujur atau sembunyi?", respon: ["🥺 Bilang Maaf", "🫣 Sembunyi"] },
    { tipe: "jujur", teks: "Eh, nemu uang jatuh di jalan. Bukan punyamu sih. Gimana dong?", respon: ["👮 Lapor Guru/Ortu", "🍬 Buat Jajan"] },
    { tipe: "jujur", teks: "Ibu kembalian belanja kelebihan uangnya. Kamu balikin atau simpan?", respon: ["💰 Balikin ke Ibu", "🤫 Simpan Aja"] },
    { tipe: "jujur", teks: "Nilai ulangan jelek nih. Berani kasih lihat Ayah/Ibu nggak?", respon: ["📄 Berani Dong", "🗑️ Umpetin"] },
    { tipe: "jujur", teks: "Lagi puasa, tapi di kulkas ada sirup dingin. Minum diam-diam nggak?", respon: ["💪 Tetap Puasa", "🥤 Minum Dikit"] },
    { tipe: "jujur", teks: "Temanmu lupa bawa bekal. Kamu mau berbagi atau makan sendiri?", respon: ["🍱 Bagi Dua", "😋 Makan Sendiri"] },
    { tipe: "jujur", teks: "Ditanya Guru: 'Siapa yang coret-coret tembok?'. Kalau itu kamu, kamu ngaku?", respon: ["☝️ Saya Bu", "👉 Tunjuk Teman"] },
    { tipe: "jujur", teks: "Main congklak ini seru. Kalau kalah, boleh marah-marah nggak?", respon: ["🤝 Salaman", "😡 Marah-marah"] },
    { tipe: "jujur", teks: "Janji mau main ke rumah teman jam 4. Kamu datang jam berapa?", respon: ["🕓 Jam 4 Pas", "🕔 Jam 5 Sore"] },
    { tipe: "jujur", teks: "Ada kue di meja makan. Boleh dimakan tanpa izin Ibu?", respon: ["🗣️ Tanya Dulu", "🍰 Makan Aja"] }
];

// 2. REFERENSI ELEMEN HTML
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
const urlParams = new URLSearchParams(window.location.search);
const paramGiliran = urlParams.get('giliran'); 
const giliranAwal = paramGiliran ? parseInt(paramGiliran) : 1;

let skorP1 = { disiplin: 0, jujur: 0 };
let skorP2 = { disiplin: 0, jujur: 0 };
let kartuSekarang = null;
let lubangDiKlikIndex = null;
let giliranPemain = giliranAwal; 
let permainanSelesai = false;
let sedangAnimasi = false;
let toastTimer;
const TARGET_MENANG = 30; 

const papanAwalState = [
    7, 7, 7, 7, 7, 7, 7, 0, // 0-7 (Milik P1)
    7, 7, 7, 7, 7, 7, 7, 0  // 8-15 (Milik P2)
];
let papanState = [...papanAwalState];
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function showToast(pesan) {
    clearTimeout(toastTimer);
    mainkanSuara(suaraNotif);
    toastPesanEl.innerText = pesan;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => { toastEl.classList.remove('show'); }, 2500);
}

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

        lubang.innerHTML = '';
        if (isLumbung) {
            const spanAngka = document.createElement('span');
            spanAngka.classList.add('jumlah-biji-angka');
            spanAngka.innerText = jumlah;
            lubang.appendChild(spanAngka);
        } else {
            if (jumlah > 0) {
                const visualLimit = Math.min(jumlah, 15); 
                for(let i = 0; i < visualLimit; i++) {
                    const biji = document.createElement('div');
                    biji.classList.add('biji');
                    lubang.appendChild(biji);
                }
            }
        }
        lubang.classList.remove('highlight-gerak');
        if (index === highlightIndex) { lubang.classList.add('highlight-gerak'); }

        if (!isLumbung) {
            lubang.classList.remove('giliran-pemain-1', 'giliran-pemain-2', 'nonaktif');
            if (permainanSelesai) {
                lubang.classList.add('nonaktif');
            } else if (sedangAnimasi) {
                if (papanState[index] === 0) lubang.classList.add('nonaktif');
                else if (giliranPemain === 1 && index <= 6) lubang.classList.add('giliran-pemain-1');
                else if (giliranPemain === 2 && index >= 8 && index <= 14) lubang.classList.add('giliran-pemain-2');
                else lubang.classList.add('nonaktif');
            } else {
                if (papanState[index] === 0) { lubang.classList.add('nonaktif'); } 
                else if (giliranPemain === 1 && index <= 6) { lubang.classList.add('giliran-pemain-1'); } 
                else if (giliranPemain === 2 && index >= 8 && index <= 14) { lubang.classList.add('giliran-pemain-2'); } 
                else { lubang.classList.add('nonaktif'); }
            }
        }
    });
}

function gantiGiliran() {
    giliranPemain = (giliranPemain === 1) ? 2 : 1;
    showToast(giliranPemain === 1 ? "Giliran Pemain 1 (Bawah)" : "Giliran Pemain 2 (Atas)"); 
    updateTampilanPapan();
}

function cekAkhirPermainan() {
    if (papanState[7] >= TARGET_MENANG) { tampilkanHasil("Pemain 1 Menang!"); return true; }
    if (papanState[15] >= TARGET_MENANG) { tampilkanHasil("Pemain 2 Menang!"); return true; }

    let totalBijiP1 = 0;
    for (let i = 0; i <= 6; i++) { totalBijiP1 += papanState[i]; }
    let totalBijiP2 = 0;
    for (let i = 8; i <= 14; i++) { totalBijiP2 += papanState[i]; }

    if (totalBijiP1 === 0 || totalBijiP2 === 0) {
        for (let i = 0; i <= 6; i++) { papanState[7] += papanState[i]; papanState[i] = 0; }
        for (let i = 8; i <= 14; i++) { papanState[15] += papanState[i]; papanState[i] = 0; }
        
        if (papanState[7] > papanState[15]) tampilkanHasil("Pemain 1 Menang!");
        else if (papanState[15] > papanState[7]) tampilkanHasil("Pemain 2 Menang!");
        else tampilkanHasil("Seri!");
        return true;
    }
    return false;
}

// --- FUNGSI PERAYAAN MENANG (AUDIO & VISUAL) ---

function tampilkanHasil(pemenangText) {
    permainanSelesai = true;
    updateTampilanPapan();
    stopMusikLatar(); // Matikan musik background biar fokus ke suara menang
    
    // 1. Mainkan Suara Menang (Pastikan file audio/sukses.mp3 adalah suara tepuk tangan/hore)
    mainkanSuara(suaraSukses);

    // 2. Munculkan Notifikasi Teks
    showToast(pemenangText);

    // 3. [BARU] Luncurkan Efek Konfeti (Visual)
    luncurkanKonfeti();

    // 4. Tunda munculnya Modal Refleksi selama 3 detik
    // Agar anak bisa melihat konfeti dan merayakan kemenangan dulu
    setTimeout(() => {
        modalRefleksiEl.classList.remove('tersembunyi');
    }, 3000); 
}

// [BARU] Fungsi Membuat Ledakan Konfeti
function luncurkanKonfeti() {
    // Cek apakah library confetti berhasil dimuat
    if (typeof confetti === 'function') {
        
        // Ledakan 1: Tengah
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 9999
        });

        // Ledakan 2: Dari Kiri (setelah 300ms)
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                zIndex: 9999
            });
        }, 300);

        // Ledakan 3: Dari Kanan (setelah 300ms)
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                zIndex: 9999
            });
        }, 300);
        
    } else {
        console.warn("Library Confetti belum dimuat. Pastikan ada internet.");
    }
    }

// LOGIKA GERAKAN BIJI (Lumbung Lawan Dilewati)
async function gerakkanBiji(startIndex) {
    // [BARU] Pastikan musik menyala saat pemain mulai berinteraksi
    putarMusikLatar(); 

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
        
        if (suaraJatuh) {
            try { const clone = suaraJatuh.cloneNode(); clone.volume = 0.5; clone.play().catch(()=>{}); } catch(e){}
        }
        updateTampilanPapan(currentIndex);
    }

    await sleep(200);
    updateTampilanPapan(null);

    if ((giliranPemain === 1 && currentIndex === 7) || (giliranPemain === 2 && currentIndex === 15)) {
        if (cekAkhirPermainan()) { sedangAnimasi = false; return; }
        mainkanSuara(suaraSukses); 
        sedangAnimasi = false;
        showToast("Hore! Main Lagi!");
        return;
    }

    if (cekAkhirPermainan()) { sedangAnimasi = false; return; }
    
    sedangAnimasi = false;
    gantiGiliran();
}

function tampilkanKartuAcak() {
    kartuSekarang = daftarKartu[Math.floor(Math.random() * daftarKartu.length)];
    const kartuKonten = modalKartuEl.querySelector('.kartu-konten');
    const kartuIkonEl = document.getElementById('kartu-ikon');

    if (kartuSekarang.tipe === 'disiplin') {
        kartuJudulEl.innerHTML = '<i class="fas fa-clock"></i> Kartu Kedisiplinan';
        kartuKonten.style.borderColor = '#4caf50'; 
        kartuIkonEl.innerHTML = '<i class="fas fa-hourglass-half"></i>';
        kartuIkonEl.className = 'ikon-besar-modal warna-jam';
    } else {
        kartuJudulEl.innerHTML = '<i class="fas fa-heart"></i> Kartu Kejujuran';
        kartuKonten.style.borderColor = '#e91e63'; 
        kartuIkonEl.innerHTML = '<i class="fas fa-hand-holding-heart"></i>';
        kartuIkonEl.className = 'ikon-besar-modal warna-hati';
    }

    kartuTeksEl.innerText = kartuSekarang.teks;
    kartuResponEl.innerHTML = '';
    
    kartuSekarang.respon.forEach(teksTombol => {
        const tombol = document.createElement('button');
        tombol.innerHTML = teksTombol; 
        tombol.classList.add('tombol-respon');
        tombol.addEventListener('click', () => handleRespon(kartuSekarang.tipe));
        kartuResponEl.appendChild(tombol);
    });
    
    tombolLanjutEl.disabled = true;
    modalKartuEl.classList.remove('tersembunyi');
}

function handleRespon(tipeNilai) {
    mainkanSuara(suaraKlik);
    if (giliranPemain === 1) {
        if (tipeNilai === 'disiplin') { skorP1.disiplin++; meterDisiplinP1El.innerText = skorP1.disiplin; }
        else { skorP1.jujur++; meterJujurP1El.innerText = skorP1.jujur; }
    } else {
        if (tipeNilai === 'disiplin') { skorP2.disiplin++; meterDisiplinP2El.innerText = skorP2.disiplin; }
        else { skorP2.jujur++; meterJujurP2El.innerText = skorP2.jujur; }
    }
    kartuResponEl.innerHTML = '<p style="font-weight:bold; color:#2e7d32; margin-top:10px;">Bagus! Jawaban dicatat.</p>';
    tombolLanjutEl.disabled = false;
}

function sembunyikanKartu() {
    mainkanSuara(suaraKlik); 
    modalKartuEl.classList.add('tersembunyi');
    if (lubangDiKlikIndex !== null) {
        gerakkanBiji(lubangDiKlikIndex);
    }
    lubangDiKlikIndex = null;
}

function tampilkanLencana() {
    modalRefleksiEl.classList.add('tersembunyi');
    const totalDisiplin = skorP1.disiplin + skorP2.disiplin;
    const totalJujur = skorP1.jujur + skorP2.jujur;
    
    lencanaGambarEl.className = 'ikon-besar-modal';
    if (totalJujur > totalDisiplin) {
        lencanaJudulEl.innerText = "Hebat, Anak Jujur!";
        lencanaGambarEl.innerHTML = '<i class="fas fa-heart"></i>';
        lencanaGambarEl.classList.add('warna-hati');
        lencanaTeksEl.innerText = "Kalian mendapatkan Lencana 'Anak Jujur Hari Ini'!";
        lencanaKontenEl.style.borderColor = '#e91e63';
    } else if (totalDisiplin > totalJujur) {
        lencanaJudulEl.innerText = "Hebat, Anak Disiplin!";
        lencanaGambarEl.innerHTML = '<i class="fas fa-medal"></i>';
        lencanaGambarEl.classList.add('warna-jam');
        lencanaTeksEl.innerText = "Kalian mendapatkan Lencana 'Anak Disiplin Hari Ini'!";
        lencanaKontenEl.style.borderColor = '#4caf50';
    } else {
        lencanaJudulEl.innerText = "Luar Biasa!";
        lencanaGambarEl.innerHTML = '<i class="fas fa-trophy"></i>';
        lencanaGambarEl.classList.add('warna-emas');
        lencanaTeksEl.innerText = "Kalian hebat dalam Kejujuran dan Kedisiplinan!";
        lencanaKontenEl.style.borderColor = '#FFD700';
    }
    modalLencanaEl.classList.remove('tersembunyi');
}

function resetGame() {
    mainkanSuara(suaraKlik);
    
    // [BARU] Restart musik saat main lagi
    musikLatar.currentTime = 0; 
    putarMusikLatar();
    
    modalLencanaEl.classList.add('tersembunyi');
    papanState = [...papanAwalState];
    skorP1 = { disiplin: 0, jujur: 0 };
    skorP2 = { disiplin: 0, jujur: 0 };
    giliranPemain = giliranAwal ? giliranAwal : 1;
    permainanSelesai = false;
    sedangAnimasi = false;
    meterDisiplinP1El.innerText = "0";
    meterJujurP1El.innerText = "0";
    meterDisiplinP2El.innerText = "0";
    meterJujurP2El.innerText = "0";
    showToast("Permainan Dimulai!");
    updateTampilanPapan();
}

// Event Listeners
tombolLanjutEl.addEventListener('click', sembunyikanKartu);
semuaLubangEl.forEach(lubang => {
    lubang.addEventListener('click', () => {
        // [BARU] Putar musik jika ini klik pertama (sebagai cadangan)
        putarMusikLatar();

        if (permainanSelesai) return;
        if (sedangAnimasi) return;

        const indexStr = lubang.dataset.index;
        if (!indexStr) return; 
        const index = parseInt(indexStr);

        if (papanState[index] === 0) return;
        if (giliranPemain === 1 && (index < 0 || index > 6)) return;
        if (giliranPemain === 2 && (index < 8 || index > 14)) return;
        
        lubangDiKlikIndex = index;
        tampilkanKartuAcak();
    });
});
refleksiTombolEl.forEach(tombol => {
    tombol.addEventListener('click', () => {
        mainkanSuara(suaraKlik); 
        tampilkanLencana();
    });
});
tombolMainLagiEl.addEventListener('click', resetGame);

// STARTUP
updateTampilanPapan();
// [BARU] Coba putar musik saat loading (mungkin diblok browser, gpp)
putarMusikLatar();

setTimeout(() => {
    if(giliranPemain === 1) showToast("Mulai: Giliran Pemain 1");
    else showToast("Mulai: Giliran Pemain 2");
}, 500);