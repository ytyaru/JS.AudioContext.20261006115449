// AudioContextの生成（ユーザー操作前に生成するとブラウザによっては警告が出ますが、ここでは元の構成を維持します）
const audioCtx = new AudioContext();

// 現在再生中のオシレーターを保持する変数（最初は null）
let currentOscillator = null;

window.addEventListener('DOMContentLoaded', async () => {
  console.log('Hello JS !!');
  console.log('audioCtx:', audioCtx);

  document.querySelector('#play').addEventListener('click', async () => {
    // 1. すでに再生中の場合：停止して初期化する
    if (currentOscillator) {
      currentOscillator.stop();
      currentOscillator.disconnect(); // 接続を解除
      currentOscillator = null;       // 状態をクリア
      console.log('Stopped');
      return; // 処理を終了
    }

    // Chrome等のブラウザ対策：中断状態であれば再開させる
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // 2. 再生中でない場合：新しくオシレーターを作成して再生する
    const oscillator = audioCtx.createOscillator();
    // "sine", "square", "sawtooth", "triangle", "custom"
    //oscillator.type = "square";
    //oscillator.type = "sine";
    oscillator.type = document.querySelector('#wave-type').selectedValue;
//    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
    oscillator.frequency.setValueAtTime(parseFloat(document.querySelector('#frequency').value), audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    
    // 現在のインスタンスを保持
    currentOscillator = oscillator;
    console.log('Started');
  });

  document.querySelector('#play').focus();
});

window.addEventListener('beforeunload', async () => {
  audioCtx?.close();
  console.log('Bye JS !!');
});
