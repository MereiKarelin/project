export type CustomizationScreens = 'Desktop' | 'Tablet' | 'Mobile';

export interface ICustomizationLocalStorage {
  screen: CustomizationScreens;
  customizationItem: {
    contentHTML: string;
    styles: string;
    scripts: string;
  };
  isCustomized: boolean;
}

export interface ICustomizationSettings {
  Desktop?: boolean;
  Tablet?: boolean;
  Mobile?: boolean;
}
