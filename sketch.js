// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

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
  image(video, 0, 0);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Draw lines connecting keypoints 0 to 4
        for (let i = 0; i < 4; i++) {
          let keypoint1 = hand.keypoints[i];
          let keypoint2 = hand.keypoints[i + 1];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            stroke(255, 0, 255); // Pink for left hand
          } else {
            stroke(255, 255, 0); // Yellow for right hand
          }

          strokeWeight(4);
          line(keypoint1.x, keypoint1.y, keypoint2.x, keypoint2.y);
        }

        // Draw lines connecting keypoints 5 to 8
        for (let i = 5; i < 8; i++) {
          let keypoint1 = hand.keypoints[i];
          let keypoint2 = hand.keypoints[i + 1];

          if (hand.handedness == "Left") {
            stroke(255, 0, 255); // Pink for left hand
          } else {
            stroke(255, 255, 0); // Yellow for right hand
          }

          strokeWeight(4);
          line(keypoint1.x, keypoint1.y, keypoint2.x, keypoint2.y);
        }

        // Draw lines connecting keypoints 9 to 12
        for (let i = 9; i < 12; i++) {
          let keypoint1 = hand.keypoints[i];
          let keypoint2 = hand.keypoints[i + 1];

          if (hand.handedness == "Left") {
            stroke(255, 0, 255); // Pink for left hand
          } else {
            stroke(255, 255, 0); // Yellow for right hand
          }

          strokeWeight(4);
          line(keypoint1.x, keypoint1.y, keypoint2.x, keypoint2.y);
        }

        // Draw circles for all keypoints
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }
      }
    }
  }
}
