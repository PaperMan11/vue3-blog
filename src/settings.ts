interface ISettings {
  title: string;
  showSettings: boolean;
}

const settings:ISettings = {
  title: 'Vue3 Blog',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,
};

export default settings;
