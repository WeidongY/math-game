// 音效管理
class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private isMuted: boolean = false;

  constructor() {
    // 预加载音效
    this.sounds = {
      correct: new Audio('/sounds/correct.wav'),
      wrong: new Audio('/sounds/wrong.wav'),
      click: new Audio('/sounds/click.wav'),
      success: new Audio('/sounds/success.wav')
    };

    // 设置音量
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.5;
    });
  }

  play(soundName: keyof typeof this.sounds) {
    if (this.isMuted) return;
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0; // 重置播放位置
      sound.play().catch(error => {
        console.log('播放音效失败:', error);
      });
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  isSoundMuted() {
    return this.isMuted;
  }
}

export const soundManager = new SoundManager(); 