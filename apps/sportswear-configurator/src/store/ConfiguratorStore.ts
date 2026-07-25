import { makeAutoObservable } from 'mobx';
import * as _THREE from 'three/webgpu';
import { createContext, useContext } from 'react';

export type PartColor = {
  id: string;
  name: string;
  originalColor: string; // The color inside the default SVG
  color: string; // Current Hex color
};

export type ConfiguratorLogo = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export type ConfiguratorText = {
  id: string;
  text: string;
  fontFamily: string;
  color: string;
  x: number;
  y: number;
  fontSize: number;
  rotation: number;
};

export class ConfiguratorStore {
  // Mapping based on typical legacy SVG structures (ColoursDefault mappings)
  public parts: PartColor[] = [];

  setPartsFromColors(colors: string[]) {
    // Premium default color palette
    const premiumPalette = ['#1A1A1A', '#D4AF37', '#F0F0F0', '#0A1128', '#780000'];
    
    this.parts = colors.map((colorHex, index) => ({
      id: `part-${index}`,
      name: `Color Layer ${index + 1}`,
      originalColor: colorHex.toUpperCase(),
      color: premiumPalette[index % premiumPalette.length]
    }));
    
    if (this.parts.length > 0) {
      this.activePartId = this.parts[0].id;
    }
  }

  public logos: ConfiguratorLogo[] = [];
  public selectedLogoId: string | null = null;

  public texts: ConfiguratorText[] = [];
  public selectedTextId: string | null = null;

  public activePartId: string = 'body';
  public isLoading: boolean = true;
  
  public centerUV: { x: number, y: number } | null = null;
  public viewTrigger: { view: 'front' | 'back' | 'left' | 'right', timestamp: number } | null = null;
  public fabricType: 'mesh' | 'knit' | 'smooth' = 'mesh';
  
  public showOrderForm: boolean = false;
  public orderScreenshots: string[] = [];
  public generateScreenshotsTrigger: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  triggerGenerateScreenshots() {
    this.generateScreenshotsTrigger = Date.now();
  }

  setShowOrderForm(show: boolean) {
    this.showOrderForm = show;
  }

  setOrderScreenshots(shots: string[]) {
    this.orderScreenshots = shots;
  }

  setFabricType(type: 'mesh' | 'knit' | 'smooth') {
    this.fabricType = type;
  }

  setCenterUV(uv: { x: number, y: number } | null) {
    this.centerUV = uv;
  }

  triggerViewChange(view: 'front' | 'back' | 'left' | 'right') {
    this.viewTrigger = { view, timestamp: Date.now() };
  }

  setSelectedLogo(id: string | null) {
    this.selectedLogoId = id;
    if (id) this.selectedTextId = null;
  }

  setSelectedText(id: string | null) {
    this.selectedTextId = id;
    if (id) this.selectedLogoId = null;
  }

  setPartColor(id: string, color: string) {
    const part = this.parts.find(p => p.id === id);
    if (part) {
      part.color = color;
    }
  }

  addLogo(logo: ConfiguratorLogo) {
    this.logos.push(logo);
  }

  updateLogo(id: string, updates: Partial<ConfiguratorLogo>) {
    const index = this.logos.findIndex(l => l.id === id);
    if (index !== -1) {
      this.logos[index] = { ...this.logos[index], ...updates };
    }
  }

  removeLogo(id: string) {
    this.logos = this.logos.filter(l => l.id !== id);
  }

  addText(text: ConfiguratorText) {
    this.texts.push(text);
  }

  updateText(id: string, updates: Partial<ConfiguratorText>) {
    const index = this.texts.findIndex(t => t.id === id);
    if (index !== -1) {
      this.texts[index] = { ...this.texts[index], ...updates };
    }
  }

  removeText(id: string) {
    this.texts = this.texts.filter(t => t.id !== id);
  }

  setActivePart(id: string) {
    this.activePartId = id;
  }

  setIsLoading(loading: boolean) {
    this.isLoading = loading;
  }

  get activePart() {
    return this.parts.find(p => p.id === this.activePartId);
  }
}

export const configStore = new ConfiguratorStore();
export const ConfigStoreContext = createContext<ConfiguratorStore>(configStore);

export const useConfigStore = () => {
  const store = useContext(ConfigStoreContext);
  if (!store) {
    throw new Error('useConfigStore must be used within a ConfigStoreContext.Provider');
  }
  return store;
};
