import { makeAutoObservable } from 'mobx';
import * as _THREE from 'three/webgpu';
import { createContext, useContext } from 'react';

export type PartColor = {
  id: string;
  name: string;
  originalColor: string; // The color inside the default SVG
  color: string; // Current Hex color
};

export function renderTextToDataUrl(
  text: string,
  fontFamily: string = 'Impact',
  color: string = '#ffffff'
): { src: string; width: number; height: number; aspectRatio: number } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const fontSize = 160;
  const fontStr = `bold ${fontSize}px ${fontFamily || 'Impact, sans-serif'}`;
  ctx.font = fontStr;

  const str = text || ' ';
  const metrics = ctx.measureText(str);

  const ascent = metrics.actualBoundingBoxAscent ?? (fontSize * 0.75);
  const descent = metrics.actualBoundingBoxDescent ?? (fontSize * 0.2);
  const left = metrics.actualBoundingBoxLeft ?? 0;
  const right = metrics.actualBoundingBoxRight ?? metrics.width;

  const glyphWidth = Math.max(20, Math.ceil(left + right));
  const glyphHeight = Math.max(20, Math.ceil(ascent + descent));

  const padX = Math.ceil(fontSize * 0.08);
  const padY = Math.ceil(fontSize * 0.08);

  canvas.width = glyphWidth + padX * 2;
  canvas.height = glyphHeight + padY * 2;

  ctx.font = fontStr;
  ctx.fillStyle = color || '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Exact pixel placement: glyph top is at padY, glyph bottom is at padY + glyphHeight
  ctx.fillText(str, padX + left, padY + ascent);

  return {
    src: canvas.toDataURL('image/png'),
    width: canvas.width,
    height: canvas.height,
    aspectRatio: canvas.width / canvas.height
  };
}

export type ConfiguratorLogo = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  isText?: boolean;
  text?: string;
  fontFamily?: string;
  textColor?: string;
};

export type ConfiguratorText = {
  id: string;
  text: string;
  fontFamily: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
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

  public get texts(): ConfiguratorLogo[] {
    return this.logos.filter(l => l.isText);
  }

  public get selectedTextId(): string | null {
    const selected = this.logos.find(l => l.id === this.selectedLogoId);
    return selected?.isText ? selected.id : null;
  }

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

  public onLogoTransform?: (id: string, transform: { x: number; y: number; width: number; height: number; rotation: number }) => void;
  public onSelectLogo?: (id: string | null) => void;
  public onLogosChanged?: () => void;

  setSelectedLogo(id: string | null) {
    this.selectedLogoId = id;
    if (this.onSelectLogo) {
      this.onSelectLogo(id);
    }
  }

  setSelectedText(id: string | null) {
    this.setSelectedLogo(id);
  }

  setPartColor(id: string, color: string) {
    const part = this.parts.find(p => p.id === id);
    if (part) {
      part.color = color;
    }
  }

  addLogo(logo: ConfiguratorLogo) {
    this.logos.push(logo);
    if (this.onLogosChanged) {
      this.onLogosChanged();
    }
  }

  updateLogo(id: string, updates: Partial<ConfiguratorLogo>) {
    const index = this.logos.findIndex(l => l.id === id);
    if (index !== -1) {
      const srcChanged = updates.src !== undefined && updates.src !== this.logos[index].src;
      this.logos[index] = { ...this.logos[index], ...updates };
      const item = this.logos[index];
      if (this.onLogoTransform) {
        this.onLogoTransform(id, {
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          rotation: item.rotation || 0
        });
      }
      if (srcChanged && this.onLogosChanged) {
        this.onLogosChanged();
      }
    }
  }

  removeLogo(id: string) {
    this.logos = this.logos.filter(l => l.id !== id);
    if (this.selectedLogoId === id) {
      this.selectedLogoId = null;
    }
    if (this.onLogosChanged) {
      this.onLogosChanged();
    }
  }

  addText(params: {
    id: string;
    text: string;
    fontFamily: string;
    color: string;
    x: number;
    y: number;
    rotation?: number;
    height?: number;
    width?: number;
  }) {
    const rendered = renderTextToDataUrl(params.text, params.fontFamily, params.color);
    const height = params.height || 120;
    const width = Math.round(height * rendered.aspectRatio);

    const overlay: ConfiguratorLogo = {
      id: params.id,
      src: rendered.src,
      x: params.x,
      y: params.y,
      width,
      height,
      rotation: params.rotation || 0,
      isText: true,
      text: params.text,
      fontFamily: params.fontFamily,
      textColor: params.color
    };

    this.logos.push(overlay);
    this.setSelectedLogo(params.id);
  }

  updateText(id: string, updates: Partial<{ text: string; fontFamily: string; color: string; x: number; y: number; width: number; height: number; rotation: number }>) {
    const item = this.logos.find(l => l.id === id);
    if (!item) return;

    const newText = updates.text !== undefined ? updates.text : (item.text || '');
    const newFont = updates.fontFamily !== undefined ? updates.fontFamily : (item.fontFamily || 'Impact');
    const newColor = updates.color !== undefined ? updates.color : (item.textColor || '#ffffff');

    let newSrc = item.src;
    let newWidth = updates.width !== undefined ? updates.width : item.width;
    let newHeight = updates.height !== undefined ? updates.height : item.height;

    if (updates.text !== undefined || updates.fontFamily !== undefined || updates.color !== undefined) {
      const rendered = renderTextToDataUrl(newText, newFont, newColor);
      newSrc = rendered.src;
      // Preserve current height, adjust width according to new text length
      newWidth = Math.round(newHeight * rendered.aspectRatio);
    }

    this.updateLogo(id, {
      ...updates,
      text: newText,
      fontFamily: newFont,
      textColor: newColor,
      src: newSrc,
      width: newWidth,
      height: newHeight
    });
  }

  removeText(id: string) {
    this.removeLogo(id);
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
