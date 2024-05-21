import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';

import {
  CustomizationScreens,
  ICustomizationLocalStorage,
  ICustomizationSettings,
} from '@/entities/Customization/types/types';
import CheckMark from '@/shared/assets/icons/CheckMark';
import DesktopModeIcon from '@/shared/assets/icons/DesktopModeIcon';
import MobileModeIcon from '@/shared/assets/icons/MobileModeIcon';
import TabletModeIcon from '@/shared/assets/icons/TabletModeIcon';
import { LOCALSTORAGE_ITEMS, SESSION_STORAGE_ITEMS } from '@/widgets/Customizator/EditorOld/consts';

import styles from './CustomizationDynamicInfoBar.module.scss';

interface CustomizationDynamicInfoBarProps {
  className?: string;
}

const screenArr = [
  {
    icon: <DesktopModeIcon fill="black" />,
    name: 'Desktop',
    bg: '#ef4444',
    hoverBg: '#dc2626',
  },
  {
    icon: <TabletModeIcon fill="black" />,
    name: 'Tablet',
    bg: '#f97316',
    hoverBg: '#ea580c',
  },
  {
    icon: <MobileModeIcon fill="black" />,
    name: 'Mobile',
    bg: '#f59e0b',
    hoverBg: '#d97706',
  },
];

export const CustomizationDynamicInfoBar = (props: CustomizationDynamicInfoBarProps) => {
  const url = window.location.href;
  const { className } = props;
  const [screenType, setScreenType] = useState<CustomizationScreens>('Desktop');
  const [customizationSettings, setCustomizationSettings] = useState<ICustomizationSettings>({});
  const savedScreenType =
    window.localStorage.getItem(SESSION_STORAGE_ITEMS.CUSTOMIZATION_SCREEN) || 'Desktop';
  const savedSettings = window.localStorage.getItem(SESSION_STORAGE_ITEMS.CUSTOMIZATION_SETTINGS);

  const saveHtmlContent = () => {
    const divContent = document.getElementsByClassName('scena-viewport')[0].outerHTML;

    if (divContent !== null) {
      const localStorageContent: ICustomizationLocalStorage = {
        screen: screenType,
        // @ts-ignore
        customizationItem: divContent,
        isCustomized: Boolean(divContent),
      };
      const tablet = window && window.localStorage.getItem(LOCALSTORAGE_ITEMS.CUSTOMIZATION_TABLET);
      const mobile = window && window.localStorage.getItem(LOCALSTORAGE_ITEMS.CUSTOMIZATION_MOBILE);
      switch (screenType) {
        case 'Desktop':
          window &&
            window.localStorage.setItem(
              LOCALSTORAGE_ITEMS.CUSTOMIZATION_DESKTOP,
              JSON.stringify(localStorageContent),
            );
          if (
            (!tablet && !mobile) ||
            (!customizationSettings?.Tablet && !customizationSettings?.Mobile)
          ) {
            window &&
              window.localStorage.setItem(
                LOCALSTORAGE_ITEMS.CUSTOMIZATION_TABLET,
                JSON.stringify(localStorageContent),
              );
            window &&
              window.localStorage.setItem(
                LOCALSTORAGE_ITEMS.CUSTOMIZATION_MOBILE,
                JSON.stringify(localStorageContent),
              );
          }
          if (!tablet || !customizationSettings?.Tablet) {
            window &&
              window.localStorage.setItem(
                LOCALSTORAGE_ITEMS.CUSTOMIZATION_TABLET,
                JSON.stringify(localStorageContent),
              );
          }
          break;
        case 'Tablet':
          window &&
            window.localStorage.setItem(
              LOCALSTORAGE_ITEMS.CUSTOMIZATION_TABLET,
              JSON.stringify(localStorageContent),
            );
          if (!mobile || !customizationSettings?.Mobile) {
            window &&
              window.localStorage.setItem(
                LOCALSTORAGE_ITEMS.CUSTOMIZATION_MOBILE,
                JSON.stringify(localStorageContent),
              );
          }
          break;
        case 'Mobile':
          window &&
            window.localStorage.setItem(
              LOCALSTORAGE_ITEMS.CUSTOMIZATION_MOBILE,
              JSON.stringify(localStorageContent),
            );
          break;
      }
    }
  };

  const onChangeType = (type: CustomizationScreens) => {
    setScreenType(type);
    window.localStorage.setItem(SESSION_STORAGE_ITEMS.CUSTOMIZATION_SCREEN, type);
    window.location.reload();
  };
  const onClickDisableDependency = useCallback(
    (type: CustomizationScreens) => {
      switch (type) {
        case 'Desktop':
          setCustomizationSettings((prev) => ({ ...prev, Desktop: !prev.Desktop }));
          break;
        case 'Tablet':
          setCustomizationSettings((prev) => ({ ...prev, Tablet: !prev.Tablet }));
          window.localStorage.setItem(
            SESSION_STORAGE_ITEMS.CUSTOMIZATION_SETTINGS,
            JSON.stringify({ ...customizationSettings, Tablet: !customizationSettings.Tablet }),
          );
          break;
        case 'Mobile':
          setCustomizationSettings((prev) => ({ ...prev, Mobile: !prev.Mobile }));
          window.localStorage.setItem(
            SESSION_STORAGE_ITEMS.CUSTOMIZATION_SETTINGS,
            JSON.stringify({ ...customizationSettings, Mobile: !customizationSettings.Mobile }),
          );
          break;
      }
      saveHtmlContent();
    },
    [customizationSettings],
  );

  useEffect(() => {
    if (savedScreenType) {
      setScreenType(savedScreenType as CustomizationScreens);
    }
  }, [savedScreenType]);

  useEffect(() => {
    if (savedSettings) {
      setCustomizationSettings(JSON.parse(savedSettings));
    }
  }, []);
  if (!url?.includes('customization/post')) {
    return (
      <div className="fixed rounded-md top-0 left-[30%] z-40 mt-3">
        <div className={styles.bar}>
          <div className="flex gap-3 items-center">
            {screenArr.map((screen) => (
              <div
                style={{
                  marginBottom: screen.name === 'Desktop' ? '1rem' : '',
                }}
                key={screen.name}
                className="grid items-center justify-items-center gap-1 cursor-pointer "
              >
                <span
                  onClick={() => {
                    onChangeType(screen.name as CustomizationScreens);
                  }}
                  className={classNames(
                    `bg-[${screen.bg}] hover:bg-[${screen.hoverBg}]
                                       transition-all p-2 rounded-md text-black',
                                      ${screenType === screen.name && 'bg-green-500'} `,
                  )}
                >
                  {screen.icon}
                </span>
                {screen.name !== 'Desktop' && (
                  <div
                    onClick={() => onClickDisableDependency(screen.name as CustomizationScreens)}
                    // onMouseOver={() => setHoveredDevice(screen.name as CustomizationScreens)}
                    // onMouseLeave={() => setHoveredDevice(null)}
                    className="h-[30px] z-50  w-[30px]  flex-shrink-0 border-[1px] flex items-center justify-center border-black cursor-pointer"
                  >
                    {
                      // @ts-ignore
                      customizationSettings[`${screen.name}`] && (
                        <CheckMark
                          className="cursor-pointer"
                          onClick={() => console.log('123')}
                          fill="black"
                        />
                      )
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};
