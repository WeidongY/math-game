// 音效管理
class SoundManager {
  private enabled: boolean = true;
  private sounds: { [key: string]: HTMLAudioElement };

  constructor() {
    this.enabled = localStorage.getItem('soundEnabled') !== 'false';
    this.sounds = {
      correct: new Audio('./sounds/correct.wav'),
      wrong: new Audio('./sounds/wrong.wav'),
      click: new Audio('./sounds/click.wav'),
      success: new Audio('./sounds/success.mp3'),
    };

    // 设置音量
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.5;
    });
  }

  play(soundName: keyof typeof this.sounds) {
    if (!this.enabled) return;
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0; // 重置播放位置
      sound.play().catch(error => {
        console.log('播放音效失败:', error);
      });
    }
  }

  toggleMute() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled ? 'true' : 'false');
    return this.enabled;
  }

  isSoundMuted() {
    return !this.enabled;
  }
}

export const soundManager = new SoundManager(); 