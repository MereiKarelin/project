import { uploadImageHandler } from '@/shared/api/file';
import { PhotoCameraIcon } from '@/shared/assets/icons/PhotoCameraIcon';

import { prefix } from '../../utils/utils';
import Tab from '../Tab';

export default // @ts-ignore
class ImageTab extends Tab {
  constructor(props: any) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  public static id = 'Img';
  public title = 'Img';
  public static icon = PhotoCameraIcon;

  public renderTab() {
    // @ts-ignore
    const { inputValue } = this.state;
    const uploadImage = (e: any) => {
      const loadingImage = document.createElement('span');
      const file = e.target.files[0];
      loadingImage.className = 'loader';
      loadingImage.style.color = 'black';

      const formData = new FormData();
      formData.append('name', file?.name);
      formData.append('file', file);

      void uploadImageHandler(formData)
        .then((r) => renderResult(r))
        .catch((err) => console.log(err));

      async function renderResult(response: any) {
        const image = document.createElement('img');
        image.src = response.url;
        image.className = 'h-[100px] w-[100px] absolute target image';
        loadingImage.replaceWith(image);
        if (!image.src) return;
        // file.src = response.url
        // console.log(file)
        // const blob = new Blob([file], { type: file.type });
        // void appendBlob(blob)
        await createBlobFromImage(image).then((blob: any) => appendBlob(blob));
      }

      const createBlobFromImage = (imgElement: HTMLImageElement) => {
        return new Promise((resolve, reject) => {
          const src = imgElement.src;
          fetch(src)
            .then((response) => response.blob())
            .then((blob) => resolve(blob))
            .catch((err) => console.log(err));
        });
      };
      const appendBlob = (blob: Blob) => this.context.appendBlob(blob);
    };
    return (
      <div className={prefix('img-tab')}>
        <div className="flex flex-col gap-2">
          <input placeholder="choose img" type="file" onChange={uploadImage} />
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
