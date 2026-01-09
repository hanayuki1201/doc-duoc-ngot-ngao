/* --- FILE DỮ LIỆU CỦA KAIL'S UNIVERSE --- */

const charData = [

  // =========================
  // SFW
  // =========================
  { 
    name: "RASSID", 
    sub: "Hoàng đế si tình", 
    quote: "Ta có thể trao cho em cả giang sơn, chỉ cần em cười.", 
    img: "avatars/rassid_avt.png", 
    tags: ["Hoàng gia", "Chiếm hữu", "Ngọt ngào"], 
    label: "My Emperor", stats: "1.1m",
    backstory: "Rassid là vị hoàng đế trẻ tuổi nhất lịch sử...",
    public_info: "Tuổi: 24 | Chiều cao: 1m88",
    links: { mirai: "#", doki: "#", lovey: "#" }
  },
  { 
    name: "KAITO", 
    sub: "Học đường", 
    quote: "Đừng nhìn tớ như thế!", 
    img: "avatars/kaito_avt.png", 
    tags: ["Học đường", "Hài hước", "Bạn thuở nhỏ"], 
    label: "Senpai", stats: "89k",
    backstory: "Bạn thanh mai trúc mã...",
    public_info: "Tuổi: 17 | Thích: Bóng rổ",
    links: { mirai: "#", doki: "#", lovey: "#" }
  },

  // SFW 3 -> 6 (placeholder)
  { name: "SFW CHAR 3", sub: "Danh hiệu...", quote: "...", img: "avatars/sfw3.png", tags: ["Ngọt ngào"], label: "SFW", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "SFW CHAR 4", sub: "Danh hiệu...", quote: "...", img: "avatars/sfw4.png", tags: ["Hoàng gia"], label: "SFW", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "SFW CHAR 5", sub: "Danh hiệu...", quote: "...", img: "avatars/sfw5.png", tags: ["Học đường"], label: "SFW", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "SFW CHAR 6", sub: "Danh hiệu...", quote: "...", img: "avatars/sfw6.png", tags: ["Hài hước"], label: "SFW", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },

  // =========================
  // NSFW (gắn tag 18+ để lọc)
  // =========================
  { 
    name: "LUCIEN HAN", 
    sub: "Ông trùm Yandere", 
    quote: "Em không thể trốn thoát đâu.", 
    img: "avatars/lucien_avt.png", 
    tags: ["Yandere", "Mafia", "18+"], 
    label: "Dangerous", stats: "212k",
    backstory: "Ông trùm thế giới ngầm...",
    // chỉnh nhẹ để public site “an toàn chia sẻ” hơn
    public_info: "Tuổi: 29 | Vibe: nguy hiểm | Chủ đề: chiếm hữu",
    links: { mirai: "#", doki: "https://www.dokichat.club/chat/1c3ba98a-77b0-41eb-bee7-8b0526cb07f0?isShare=true", lovey: "#" }
  },

  // NSFW 2 -> 25 (placeholder)
  { name: "NSFW CHAR 2", sub: "...", quote: "...", img: "avatars/n2.png", tags: ["18+", "Chiếm hữu"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 3", sub: "...", quote: "...", img: "avatars/n3.png", tags: ["18+", "Giam cầm"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 4", sub: "...", quote: "...", img: "avatars/n4.png", tags: ["18+", "Bad Boy"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 5", sub: "...", quote: "...", img: "avatars/n5.png", tags: ["18+", "Mafia"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 6", sub: "...", quote: "...", img: "avatars/n6.png", tags: ["18+", "Yandere"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 7", sub: "...", quote: "...", img: "avatars/n7.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 8", sub: "...", quote: "...", img: "avatars/n8.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 9", sub: "...", quote: "...", img: "avatars/n9.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 10", sub: "...", quote: "...", img: "avatars/n10.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 11", sub: "...", quote: "...", img: "avatars/n11.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 12", sub: "...", quote: "...", img: "avatars/n12.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 13", sub: "...", quote: "...", img: "avatars/n13.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 14", sub: "...", quote: "...", img: "avatars/n14.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 15", sub: "...", quote: "...", img: "avatars/n15.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 16", sub: "...", quote: "...", img: "avatars/n16.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 17", sub: "...", quote: "...", img: "avatars/n17.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 18", sub: "...", quote: "...", img: "avatars/n18.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 19", sub: "...", quote: "...", img: "avatars/n19.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 20", sub: "...", quote: "...", img: "avatars/n20.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 21", sub: "...", quote: "...", img: "avatars/n21.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 22", sub: "...", quote: "...", img: "avatars/n22.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 23", sub: "...", quote: "...", img: "avatars/n23.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 24", sub: "...", quote: "...", img: "avatars/n24.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
  { name: "NSFW CHAR 25", sub: "...", quote: "...", img: "avatars/n25.png", tags: ["18+"], label: "18+", stats: "0", backstory: "...", public_info: "...", links: { mirai: "#", doki: "#", lovey: "#" } },
];

// =========================
// GALLERY & CONFIG
// =========================
const galleryData = [
  { src: "gallery/lucien_cg_1.png", tag: "NSFW" },
  { src: "gallery/rassid_cg_1.png", tag: "SFW" },
  { src: "gallery/kaito_cg_1.png", tag: "SFW" },
  { src: "gallery/lucien_cg_2.png", tag: "NSFW" },
];

const configTags = {
  "NSFW": ["Yandere", "Mafia", "18+", "Bad Boy", "Giam cầm", "Chiếm hữu"],
  "SFW": ["Ngọt ngào", "Chiếm hữu", "Hoàng gia", "Học đường", "Hài hước", "Đời thường", "Bạn thuở nhỏ"]
};
