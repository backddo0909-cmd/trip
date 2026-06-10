const cityImage = document.getElementById("cityImage");
const loading = document.getElementById("loading");
const nextTripBtn = document.getElementById("nextTripBtn");
const wishlistBtn = document.getElementById("wishlistBtn");
const autoSlideCheck = document.getElementById("autoSlideCheck");
const wishlistGrid = document.getElementById("wishlistGrid");
const stampOverlay = document.getElementById("stampOverlay");

const countryFlag = document.getElementById("countryFlag");
const countryName = document.getElementById("countryName");
const cityName = document.getElementById("cityName");
const cityOneLiner = document.getElementById("cityOneLiner");
const routeList = document.getElementById("routeList");

const barFlight = document.getElementById("barFlight");
const barHotel = document.getElementById("barHotel");
const barStyle = document.getElementById("barStyle");
const txtFlight = document.getElementById("txtFlight");
const txtHotel = document.getElementById("txtHotel");
const txtStyle = document.getElementById("txtStyle");
const txtPackage = document.getElementById("txtPackage");

let currentIdx = -1;
let slideInterval = null;
let wishlist = [];

// [풍경 중심 고정 데이터베이스 - 인물/오류 404 원천 차단]
const travelDatabase = [
  {
    country: "일본", city: "도쿄", flag: "🇯🇵", 
    imgUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80", // 도쿄 타워 야경
    oneLiner: "화려한 메트로폴리스 도심 속 아기자기한 감성 미식이 융합된 곳",
    routes: ["1일차: 시부야 스카이 전망대", "2일차: 아사쿠사 센소지 & 긴자 스시", "3일차: 하라주쿠 카페 거리 & 도쿄타워", "4일차: 도쿄역 쇼핑 후 귀국"],
    expenses: { flight: 380000, hotel: 220000, style: 250000, packagePrice: "750,000" }
  },
  {
    country: "태국", city: "방콕", flag: "🇹🇭",
    imgUrl: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80", // 방콕 왓 아룬 사원
    oneLiner: "황금빛 사원들과 저렴한 야시장, 가성비 호캉스를 누리는 최고의 휴양지",
    routes: ["1일차: 카오산로드 로컬 팟타이", "2일차: 왕궁 투어 & 짜오프라야 크루즈", "3일차: 쩨프페어 야시장 미식 탐방", "4일차: 아속역 쇼핑 후 귀국"],
    expenses: { flight: 420000, hotel: 180000, style: 200000, packagePrice: "690,000" }
  },
  {
    country: "싱가포르", city: "싱가포르", flag: "🇸🇬",
    imgUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80", // 마리나베이 슈퍼트리
    oneLiner: "가든스 바이 더 베이의 미래지향적 야경과 깨끗한 도심 휴양지",
    routes: ["1일차: 마리나 베이 샌즈 레이저쇼", "2일차: 유니버셜 스튜디오 센토사", "3일차: 가든스 바이 더 베이 슈퍼트리", "4일차: 쥬얼 창공 폭포 관람 후 귀국"],
    expenses: { flight: 550000, hotel: 400000, style: 300000, packagePrice: "1,150,000" }
  },
  {
    country: "프랑스", city: "파리", flag: "🇫🇷",
    imgUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", // 에펠탑 전경
    oneLiner: "에펠탑 아래 흐르는 센강과 세계 최고의 예술 미술관들이 반겨주는 낭만의 도시",
    routes: ["1일차: 에펠탑 & 센강 유람선", "2일차: 루브르 박물관 & 개선문 전망대", "3일차: 몽마르뜨 언덕 & 오르세 미술관", "4일차: 마레 지구 쇼핑 후 귀국"],
    expenses: { flight: 1100000, hotel: 350000, style: 300000, packagePrice: "1,490,000" }
  },
  {
    country: "영국", city: "런던", flag: "🇬🇧",
    imgUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80", // 빅벤과 타워브릿지
    oneLiner: "타워브릿지와 빅벤, 빨간 2층 버스가 맞이하는 클래식과 트렌드의 공존",
    routes: ["1일차: 런던아이 & 빅벤 야경", "2일차: 대영박물관 & 타워브릿지 산책", "3일차: 소호 거리 & 뮤지컬 관람", "4일차: 하이드파크 피크닉 후 귀국"],
    expenses: { flight: 1200000, hotel: 400000, style: 320000, packagePrice: "1,650,000" }
  },
  {
    country: "이탈리아", city: "로마", flag: "🇮🇹",
    imgUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80", // 콜로세움 전경
    oneLiner: "도시 전체가 거대한 노천 박물관인 고대 로마 제국의 심장부",
    routes: ["1일차: 콜로세움 & 콘스탄티누스 개선문", "2일차: 바티칸 시국 투어 (시스티나 성당)", "3일차: 트레비 분수 동전 던지기 & 스페인 광장", "4일차: 판테온 관람 후 귀국"],
    expenses: { flight: 1050000, hotel: 300000, style: 280000, packagePrice: "1,450,000" }
  },
  {
    country: "미국", city: "뉴욕", flag: "🇺🇸",
    imgUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80", // 뉴욕 맨해튼 스카이라인 (인물 없음)
    oneLiner: "타임스퀘어의 네온사인과 브로드웨이 뮤지컬, 센트럴파크의 힐링",
    routes: ["1일차: 타임스퀘어 브로드웨이 산책", "2일차: 자유의 여신상 크루즈 & 탑오브더락 야경", "3일차: 센트럴파크 피크닉 & 메트로폴리탄 미술관", "4일차: 첼시마켓 랍스터 조식 후 귀국"],
    expenses: { flight: 1450000, hotel: 550000, style: 400000, packagePrice: "2,190,000" }
  },
  {
    country: "미국", city: "로스앤젤레스", flag: "🇺🇸",
    imgUrl: "https://images.unsplash.com/photo-1542344807-157f96350201?auto=format&fit=crop&w=800&q=80", // LA 다운타운 팜트리 거리
    oneLiner: "할리우드 명예의 거리와 라라랜드의 무대 그리피스 천문대 야경",
    routes: ["1일차: 할리우드 거리 & 산타모니카 해변", "2일차: 유니버셜 스튜디오 할리우드", "3일차: 그리피스 천문대 (라라랜드 야경)", "4일차: 더 브로드 미술관 투어 후 귀국"],
    expenses: { flight: 1150000, hotel: 380000, style: 300000, packagePrice: "1,690,000" }
  },
  {
    country: "호주", city: "시드니", flag: "🇦🇺",
    imgUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80", // 시드니 오페라 하우스
    oneLiner: "오페라하우스와 하버브릿지, 청정 해변이 결합된 남반구 최고의 에코시티",
    routes: ["1일차: 오페라 하우스 & 하버브릿지 야경", "2일차: 포트스테판 사막 샌드보딩 투어", "3일차: 블루마운틴 국립공원 궤도열차", "4일차: 본다이비치 해수 수영장 산책 후 귀국"],
    expenses: { flight: 980000, hotel: 320000, style: 280000, packagePrice: "1,390,000" }
  },
  {
    country: "이집트", city: "카이로", flag: "🇪🇬",
    imgUrl: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80", // 기자 피라미드 건축물
    oneLiner: "스핑크스와 기자 지구 대피라미드, 인류 문명의 위대한 발상지",
    routes: ["1일차: 기자 지구 3대 피라미드 & 스핑크스 투어", "2일차: 이집트 고고학 박물관 투탕카멘 황금가면", "3일차: 칸엘칼릴리 고대 전통 시장 찻집", "4일차: 나일강 펠루카 돛단배 탑승 후 귀국"],
    expenses: { flight: 1150000, hotel: 160000, style: 150000, packagePrice: "1,390,000" }
  }
];

// 데이터 및 텍스트 즉시 동기화 제어 엔진 (버튼 씹힘 완벽 수정)
function loadTravelCard() {
  // 1. 도장 애니메이션 리셋 및 실행
  stampOverlay.classList.remove("active");
  void stampOverlay.offsetWidth; 
  stampOverlay.classList.add("active");

  // 2. 새로운 무작위 인덱스 생성
  let nextIdx = currentIdx;
  while (nextIdx === currentIdx) {
    nextIdx = Math.floor(Math.random() * travelDatabase.length);
  }
  currentIdx = nextIdx;
  const data = travelDatabase[currentIdx];

  // 3. 버튼 씹힘 해결의 핵심: 텍스트 및 그래프는 이미지 대기 없이 "즉시" 로드
  countryFlag.textContent = data.flag;
  countryName.textContent = data.country;
  cityName.textContent = data.city;
  cityOneLiner.textContent = data.oneLiner;

  routeList.innerHTML = "";
  data.routes.forEach(route => {
    const li = document.createElement("li");
    li.textContent = `📌 ${route}`;
    routeList.appendChild(li);
  });

  renderExpenseBars(data.expenses);

  // 4. 비동기 이미지 로딩 처리
  cityImage.style.display = "none";
  loading.style.display = "block";
  
  // 가상의 새 이미지 객체로 캐싱 후 교체하여 깜빡임 및 락 현상 방지
  const imgCache = new Image();
  imgCache.src = data.imgUrl;
  imgCache.onload = () => {
    cityImage.src = data.imgUrl;
    cityImage.style.display = "block";
    loading.style.display = "none";
  };
}

function renderExpenseBars(exp) {
  const maxBudget = 2000000;
  
  const flightPercent = Math.min((exp.flight / maxBudget) * 100, 100);
  const hotelPercent = Math.min((exp.hotel / maxBudget) * 100, 100);
  const stylePercent = Math.min((exp.style / maxBudget) * 100, 100);

  barFlight.style.width = `${flightPercent}%`;
  barHotel.style.width = `${hotelPercent}%`;
  barStyle.style.width = `${stylePercent}%`;

  txtFlight.textContent = `${exp.flight.toLocaleString()}원`;
  txtHotel.textContent = `${exp.hotel.toLocaleString()}원`;
  txtStyle.textContent = `${exp.style.toLocaleString()}원`;
  txtPackage.textContent = `${exp.packagePrice}원~`;
}

function handleWishlist() {
  const currentCity = travelDatabase[currentIdx].city;
  const currentImg = travelDatabase[currentIdx].imgUrl;

  if (wishlist.some(item => item.city === currentCity)) {
    alert("이미 버킷리스트에 추가된 여행지입니다!");
    return;
  }
  if (wishlist.length >= 5) {
    alert("한 번에 최대 5개 도시까지만 휴가 계획을 세울 수 있습니다.");
    return;
  }

  wishlist.push({ city: currentCity, img: currentImg });
  renderWishlist();
}

function renderWishlist() {
  wishlistGrid.innerHTML = "";
  wishlist.forEach((item, index) => {
    const wrap = document.createElement("div");
    wrap.className = "wish-item-wrap";
    wrap.onclick = () => removeWishItem(index);

    const img = document.createElement("img");
    img.src = item.img;
    img.className = "wish-thumb";
    img.alt = item.city;

    wrap.appendChild(img);
    wishlistGrid.appendChild(wrap);
  });
}

function removeWishItem(index) {
  if (confirm("이 도시의 여행 계획을 취소하시겠습니까?")) {
    wishlist.splice(index, 1);
    renderWishlist();
  }
}

// 자동 타이머 기능
autoSlideCheck.addEventListener("change", (e) => {
  if (e.target.checked) {
    slideInterval = setInterval(loadTravelCard, 8000);
  } else {
    clearInterval(slideInterval);
    slideInterval = null;
  }
});

nextTripBtn.addEventListener("click", () => {
  if (autoSlideCheck.checked) {
    clearInterval(slideInterval);
    slideInterval = setInterval(loadTravelCard, 8000);
  }
  loadTravelCard();
});

wishlistBtn.addEventListener("click", handleWishlist);

// 초기화 호출
loadTravelCard();
