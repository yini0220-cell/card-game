import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA7Zpohy6B5frsV1xJZgJ8hZxH0L7J1G8Q",
  authDomain: "card-game-demo-123.firebaseapp.com",
  databaseURL: "https://card-game-demo-123-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "card-game-demo-123",
  storageBucket: "card-game-demo-123.appspot.com",
  messagingSenderId: "1069166669663",
  appId: "1:1069166669663:web:0a9b8c7d6e5f4a3b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const cardPool = [
"朱志鑫","苏新皓","张极","张泽禹","左航","宋亚轩","张真源","刘耀文",
"丁程鑫","马嘉祺","严浩翔","贺峻霖","李天泽","敖子逸","黄宇航","林墨",
"邓佳鑫","穆祉丞","张峻豪","童禹坤","黄朔","zimo","张函瑞","张桂圆",
"杨博文","左奇函","王橹杰","陈浚铭","陈思罕","张奕然","魏子宸","李煜东",
"官俊臣","杨涵博","聂玮辰","陈奕恒","易烊千玺","王俊凯","王源",
"小新","肥嘟嘟左卫门","典娜","熊大","熊二","猪猪侠","权志龙","李飞","黄锐"
];

let roomId = null;
let isHost = false;
let myHand = [];
let selected = [];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// 创建房间
document.getElementById("create").onclick = async () => {
  roomId = Math.random().toString(36).slice(2,6).toUpperCase();
  isHost = true;
  document.getElementById("roomId").innerText = roomId;
  myHand = shuffle(cardPool).slice(0,10);
  await set(ref(db, "rooms/"+roomId), {
    p1: { hand: myHand, played: [] },
    p2: { played: [] }
  });
  sync();
  renderMyHand();
};

// 加入房间
document.getElementById("join").onclick = async () => {
  let v = document.getElementById("inputRoom").value.trim().toUpperCase();
  if(!v) return alert("输入房间号");
  roomId = v;
  isHost = false;
  document.getElementById("roomId").innerText = roomId;
  myHand = shuffle(cardPool).slice(0,10);
  sync();
  renderMyHand();
};

// 同步对方出牌
function sync() {
  onValue(ref(db, "rooms/"+roomId), snap => {
    const d = snap.val();
    if(!d) return;
    const oppoPlayed = isHost ? d.p2.played : d.p1.played;
    renderOpponent(oppoPlayed);
  });
}

// 选牌
window.toggleCard = (card) => {
  if(selected.includes(card)) {
    selected = selected.filter(c => c !== card);
  } else {
    if(selected.length >=4) return;
    selected.push(card);
  }
  renderMyHand();
};

// 出牌
document.getElementById("play").onclick = async () => {
  if(selected.length < 1) return alert("至少选1张");
  const path = isHost ? "p1/played" : "p2/played";
  await update(ref(db, "rooms/"+roomId), { [path]: selected });
  myHand = myHand.filter(c => !selected.includes(c));
  selected = [];
  renderMyHand();
};

// 重置
document.getElementById("reset").onclick = async () => {
  if(!roomId) return;
  await update(ref(db, "rooms/"+roomId), {
    "p1/played": [], "p2/played": []
  });
};

// 渲染
function renderMyHand() {
  document.getElementById("myHand").innerHTML = myHand.map(c =>
    `<div class="card ${selected.includes(c)?'selected':''}" onclick="toggleCard('${c}')">${c}</div>`
  ).join("");
}

function renderOpponent(cards) {
  document.getElementById("opponentPlayed").innerHTML = cards.map(c =>
    `<div class="card">${c}</div>`
  ).join("");
}