const cardPool = [
  "朱志鑫", "苏新皓", "张极", "张泽禹", "左航", "宋亚轩", "张真源", "刘耀文",
  "丁程鑫", "马嘉祺", "严浩翔", "贺峻霖", "李天泽", "敖子逸", "黄宇航", "林墨",
  "邓佳鑫", "穆祉丞", "张峻豪", "童禹坤", "黄朔", "zimo", "张函瑞", "张桂圆",
  "杨博文", "左奇函", "王橹杰", "陈浚铭", "陈思罕", "张奕然", "魏子宸", "李煜东",
  "官俊臣", "杨涵博", "聂玮辰", "陈奕恒", "易烊千玺", "王俊凯", "王源",
  "小新", "肥嘟嘟左卫门", "典娜", "熊大", "熊二", "猪猪侠", "权志龙", "李飞", "黄锐"
];

let roomId = null;
let myHand = [];
let selected = [];
let opponentPlayed = [];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// 创建房间
document.getElementById("create").onclick = function () {
  roomId = Math.random().toString(36).slice(2, 6).toUpperCase();
  document.getElementById("roomId").innerText = roomId;
  myHand = shuffle(cardPool).slice(0, 10);
  selected = [];
  opponentPlayed = [];
  render();
};

// 加入房间
document.getElementById("join").onclick = function () {
  let input = document.getElementById("inputRoom").value.trim().toUpperCase();
  if (!input) return alert("请输入房间号");
  roomId = input;
  document.getElementById("roomId").innerText = roomId;
  myHand = shuffle(cardPool).slice(0, 10);
  selected = [];
  opponentPlayed = [];
  render();
};

// 选牌
function toggleCard(card) {
  if (selected.includes(card)) {
    selected = selected.filter(c => c !== card);
  } else {
    if (selected.length >= 4) return;
    selected.push(card);
  }
  render();
}

// 出牌
document.getElementById("play").onclick = function () {
  if (selected.length < 1) return alert("至少选1张牌");
  opponentPlayed = [...selected];
  myHand = myHand.filter(c => !selected.includes(c));
  selected = [];
  render();
};

// 重置
document.getElementById("reset").onclick = function () {
  selected = [];
  opponentPlayed = [];
  render();
};

// 渲染界面
function render() {
  // 我的手牌
  let handHtml = "";
  myHand.forEach(card => {
    let cls = selected.includes(card) ? "card selected" : "card";
    handHtml += `<div class="${cls}" onclick="toggleCard('${card}')">${card}</div>`;
  });
  document.getElementById("myHand").innerHTML = handHtml;

  // 对方出牌
  let playedHtml = "";
  opponentPlayed.forEach(card => {
    playedHtml += `<div class="card">${card}</div>`;
  });
  document.getElementById("opponentPlayed").innerHTML = playedHtml;
}

// 全局暴露
window.toggleCard = toggleCard;