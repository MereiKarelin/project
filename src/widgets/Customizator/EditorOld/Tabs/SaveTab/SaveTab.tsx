import { SESSION_STORAGE_ITEMS } from '../../consts';
import { prefix, saveHtmlTemplate } from '../../utils/utils';
import Tab from '../Tab';

export default class SaveTab extends Tab {
  constructor(props: any) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  public static id = 'Save';
  public title = 'Save';
  public renderTab() {
    // @ts-ignore
    const { inputValue } = this.state;
    // @ts-ignore
    const url = window.location.href;
    const isProfile = !url.includes('customization/post');
    const onHandleSave = async () => {
      if (isProfile) {
        if (inputValue.trim() === '') return;
        // const savedTargets = window.document.getElementsByClassName('scena-viewport')[0].innerHTML;
        // window.localStorage.setItem(SESSION_STORAGE_ITEMS.CUSTOMIZATION_SAVED_TEMPLATE, savedTargets);
        // @ts-ignore
        window.localStorage.removeItem(SESSION_STORAGE_ITEMS.CUSTOMIZATION_SAVED_JSON_DESKTOP);
        // @ts-ignore
        window.localStorage.removeItem(SESSION_STORAGE_ITEMS.CUSTOMIZATION_SAVED_JSON_TABLET);
        // @ts-ignore
        window.localStorage.removeItem(SESSION_STORAGE_ITEMS.CUSTOMIZATION_SAVED_JSON_MOBILE);
        await saveHtmlTemplate('profile', inputValue);
        // @ts-ignore
        window.location.href = '/id';
      } else {
        await saveHtmlTemplate('post');
        // @ts-ignore
        window.location.href = '/feed';
      }
    };

    return (
      <div className={prefix('font-tab')}>
        <div className="flex flex-col gap-2">
          {isProfile && (
            <input
              value={inputValue}
              onChange={(e) => {
                // @ts-ignore
                this.setState({ inputValue: e.target.value });
              }}
              type="text"
              className="py-1 px-2 outline-0 border-[1px] border-black rounded-md"
            />
          )}
          <button
            onClick={onHandleSave}
            className="bg-green-400 text-white font-bold rounded-md py-1 px-2 hover:bg-green-500 hover:text-gray-200 transition-all ease-in"
          >
            Save
          </button>
        </div>
      </div>
    );
  }
  public componentDidMount() {
    this.addEvent('render', this.onRender as any);
    this.addEvent('setSelectedTargets', this.setTargets as any);
  }

  private onRender = () => {
    this.forceUpdate();
  };
  private setTargets = () => {
    this.forceUpdate();
  };
}
