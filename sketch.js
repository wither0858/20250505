// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX = 320; // 圓的初始 X 座標
let circleY = 240; // 圓的初始 Y 座標
let circleRadius = 50; // 圓的半徑
let isDragging = false; // 是否正在拖曳圓
let draggingFinger = null; // 紀錄正在拖曳的手指類型（"thumb" 或 "index"）

let trail = []; // 儲存拖曳軌跡的陣列

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  // 繪製影片畫面（不覆蓋整個畫布，保留軌跡）
  image(video, 0, 0, width, height);

  // 畫出儲存的軌跡線條
  noFill();
  strokeWeight(10); // 線條粗細為 10
  for (let i = 1; i < trail.length; i++) {
    let prev = trail[i - 1];
    let curr = trail[i];
    stroke(curr.color); // 使用軌跡的顏色
    line(prev.x, prev.y, curr.x, curr.y); // 連接前一點與目前點
  }

  // 畫出圓
  fill(0, 255, 0);
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // 確保至少有一隻手被偵測到
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 獲取大拇指的 keypoint (keypoints[4])
        let thumb = hand.keypoints[4];
        // 獲取食指的 keypoint (keypoints[8])
        let finger = hand.keypoints[8];

        // 計算大拇指與圓心的距離
        let thumbDistance = dist(thumb.x, thumb.y, circleX, circleY);
        // 計算食指與圓心的距離
        let fingerDistance = dist(finger.x, finger.y, circleX, circleY);

        // 如果大拇指接觸到圓，開始拖曳
        if (thumbDistance < circleRadius) {
          isDragging = true;
          draggingFinger = "thumb";
        }

        // 如果食指接觸到圓，開始拖曳
        if (fingerDistance < circleRadius) {
          isDragging = true;
          draggingFinger = "index";
        }

        // 如果正在拖曳，讓圓跟隨對應的手指移動，並紀錄軌跡
        if (isDragging) {
          let activeFinger = draggingFinger === "thumb" ? thumb : finger;
          let color = draggingFinger === "thumb" ? "green" : "red";

          // 加入目前手指座標到軌跡陣列，並記錄顏色
          trail.push({ x: activeFinger.x, y: activeFinger.y, color });

          // 畫出目前的拖曳線條
          stroke(color);
          line(circleX, circleY, activeFinger.x, activeFinger.y);

          // 更新圓的位置
          circleX = activeFinger.x;
          circleY = activeFinger.y;
        }
      }
    }
  } else {
    // 如果沒有手偵測到，停止拖曳
    isDragging = false;
    draggingFinger = null;
  }
}

// 按下 'c' 鍵可以清除軌跡
function keyPressed() {
  if (key === 'c') {
    trail = []; // 清空軌跡資料
  }
}
