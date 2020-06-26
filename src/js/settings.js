import performRequests from 'app/js/utils/perform-requests';
import Api from 'app/js/api';

class Settings {
  constructor() {
    this.api = new Api();

    this.wordsPerDay = undefined;
    this.minigames = {
      speakit: {},
      englishPuzzle: {},
      savannah: {},
      audioCall: {},
      sprint: {},
      ourGame: {},
    };

    // add more settings
  }

  async getSettings() {
    const settings = await performRequests([this.api.getSettings()]);

    if (settings) {
      this.setSettings(...settings);
    }
  }

  setSettings(settings) {
    const {
      wordsPerDay = 1,
      optional: {
        minigames = {},
      },
    } = settings;

    this.wordsPerDay = wordsPerDay;
    this.minigames = minigames;
  }

  update(key, value) {
    this.localUpdates(key, value);
    this.postUpdates();
  }

  localUpdates(key, value) {
    switch (key) {
      case 'speakit':
      case 'englishPuzzle':
      case 'savannah':
      case 'audioCall':
      case 'sprint':
      case 'ourGame':
        this.minigames[key] = value;
        break;
      default:
        this[key] = value;
        break;
    }
  }

  async postUpdates() {
    const {
      wordsPerDay,
      minigames,
    } = this;

    const settings = {
      wordsPerDay,
      optional: {
        minigames,
      },
    };

    const response = await performRequests([this.api.upsertSettings(settings)]);

    if (response) {
      console.log('Ответ: ', ...response);
    }
  }
}

export default Settings;
