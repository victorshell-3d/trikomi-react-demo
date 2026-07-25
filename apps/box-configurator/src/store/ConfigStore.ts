import { makeAutoObservable } from 'mobx';
import { ThreeViewer, CenterModelPlugin, ExportPlugin } from '@trikomi/core';
import {
  BoxNode, EdgeType, NodeLayout, LayoutBounds, Cutout, ShapeTemplate, PathCommand,
  boxTemplates, flapTemplates,
  computeFlattenedLayout, computeLayoutBounds,
  findBoxNode, findParentNodeAndEdge,
  propagateWidthChange, clampHoleToBounds,
  applyGlobalAnimationTiming, applyGlobalBoxColor,
  convertToDisplay, convertToInternal, getFormattedValue,
} from '@trikomi/core/box';

// Re-export package types for convenience — UI components can import from here
export type { BoxNode, EdgeType, NodeLayout, LayoutBounds, Cutout, ShapeTemplate, PathCommand };

// App-specific type for 2D design overlay elements (logos, text) on the canvas
export interface DesignElement {
  id: string;
  type: 'logo' | 'text';
  text?: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  width?: number;
  height?: number;
  color?: string;
  src?: string;
  fontSize?: number;
  fontFamily?: string;
}


// Typed shape for JSON configs passed via the widget API or external loaders
export interface BoxConfigJson {
  boxWidth?: number;
  boxHeight?: number;
  boxDepth?: number;
  activePattern?: string;
  designElements?: DesignElement[];
  templateId?: string;
}

export class ConfigStore {

  // Animation State
  unfoldProgress: number = 0; // 0 = fully folded (closed), 1 = fully unfolded (flat)

  // Whole Box Templates (sourced from @trikomi/box package)
  boxTemplates = boxTemplates;
  activeBoxTemplateId: string = 'box-tuck-end';
  landingPageOpen: boolean = true;

  setLandingPageOpen(val: boolean) {
    this.landingPageOpen = val;
  }

  // Tree Data
  rootNode: BoxNode = JSON.parse(JSON.stringify(boxTemplates[0].rootNode)) as BoxNode;

  // Shape Templates (sourced from @trikomi/box package)
  templates: Record<string, ShapeTemplate> = flapTemplates.reduce((acc, t) => {
    acc[t.id] = t as ShapeTemplate;
    return acc;
  }, {} as Record<string, ShapeTemplate>);

  loadBoxTemplate(boxTemplateId: string) {
    const boxTpl = this.boxTemplates.find(b => b.id === boxTemplateId);
    if (boxTpl) {
      this.activeBoxTemplateId = boxTemplateId;
      // Deep clone to prevent mutating the original template
      this.rootNode = JSON.parse(JSON.stringify(boxTpl.rootNode));
      this.setSelectedNodeId(this.rootNode.id);
      this.unfoldProgress = 0; // Reset animation
      
      // Auto-recenter camera or trigger updates
      if (this.viewerInstance) {
        // Trigger center model
        const centerPlugin = this.viewerInstance.getPlugin(CenterModelPlugin);
        if (centerPlugin) {
          // Wait a frame for meshes to be generated
          setTimeout(() => {
            const builder = this.viewerInstance!.scene.getObjectByName('ModelGroup');
            if (builder) {
              centerPlugin.center(builder);
            }
          }, 0);
        }
      }
    }
  }

  fetchRemoteConfig(url: string) {
    console.log('[BoxApp] Fetching config from:', url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.loadFromJson(data);
        this.setLandingPageOpen(false);
      })
      .catch(err => console.error('[BoxApp] Failed to load config:', err));
  }

  showMeasurements: boolean = true;

  // UI State
  selectedNodeId: string | null = null;
  editingTemplateId: string | null = null;
  viewerInstance: ThreeViewer | null = null;
  
  designElements: DesignElement[] = [];
  selectedDesignElementId: string | null = null;
  activePattern: string = 'kraft';
  activeUnit: 'in' | 'mm' | 'cm' = 'in';
  
  // Base 2D Texture from Konva
  textureCanvas: HTMLCanvasElement | null = null;

  setViewerInstance(val: ThreeViewer | null) {
    this.viewerInstance = val;
  }

  loadFromJson(data: BoxConfigJson) {
    if (data.boxWidth) this.boxWidth = data.boxWidth;
    if (data.boxHeight) this.boxHeight = data.boxHeight;
    if (data.boxDepth) this.boxDepth = data.boxDepth;
    if (data.activePattern) this.activePattern = data.activePattern;
    if (data.designElements) this.designElements = data.designElements;
    // Apply template if given
    if (data.templateId) {
      this.loadBoxTemplate(data.templateId);
    }
  }

  setActivePattern(pattern: string) {
    this.activePattern = pattern;
  }

  setUnit(unit: 'in' | 'mm' | 'cm') {
    this.activeUnit = unit;
  }

  // Unit conversion — delegates to @trikomi/box
  convertToDisplay(val: number): number { return convertToDisplay(val, this.activeUnit); }
  convertToInternal(val: number): number { return convertToInternal(val, this.activeUnit); }
  getFormattedValue(val: number): string { return getFormattedValue(val, this.activeUnit); }

  constructor() {
    makeAutoObservable(this);
  }

  // Computed 2-D dieline layout — delegates to @trikomi/box
  get layoutBounds(): LayoutBounds { return computeLayoutBounds(this.flattenedLayout); }
  get flattenedLayout(): Record<string, NodeLayout> { return computeFlattenedLayout(this.rootNode); }

  setUnfoldProgress(val: number) { this.unfoldProgress = val; }
  setTextureCanvas(canvas: HTMLCanvasElement | null) { this.textureCanvas = canvas; }
  setSelectedNodeId(id: string | null) {
    this.selectedNodeId = id;
    if (id !== null) {
      this.selectedDesignElementId = null;
    }
  }
  setEditingTemplateId(id: string | null) { this.editingTemplateId = id; }
  setShowMeasurements(val: boolean) { this.showMeasurements = val; }
  setSelectedDesignElementId(id: string | null) {
    this.selectedDesignElementId = id;
    if (id !== null) {
      this.selectedNodeId = null;
    }
  }

  // Recursively find and update a node's color
  setNodeColor(nodeId: string, color: string) {
    const node = this.findNode(nodeId);
    if (node) node.color = color;
  }

  // Node counting for generic naming
  panelCount = 6;
  flapCount = 4;
  tuckCount = 2;

  // Node lookup — delegates to @trikomi/box
  findNode(nodeId: string): BoxNode | null { return findBoxNode(this.rootNode, nodeId); }
  findParentNodeAndEdge(childId: string) { return findParentNodeAndEdge(this.rootNode, childId); }

  addAttachment(parentId: string, edge: EdgeType, type: 'panel' | 'flap' | 'tuck') {
    const parent = this.findNode(parentId);
    if (!parent || parent.attachments[edge]) return;

    const id = `node-${Date.now()}`;
    let newNode: BoxNode;

    if (type === 'panel') {
      this.panelCount++;
      newNode = {
        id, name: `Panel ${this.panelCount}`, type: 'panel', extent: 1, foldedAngle: -90, unfoldedAngle: 0, color: '#ffffff', attachments: {}
      };
    } else if (type === 'flap') {
      this.flapCount++;
      newNode = {
        id, name: `Flap ${this.flapCount}`, type: 'flap', extent: 0.5, foldedAngle: -93, unfoldedAngle: 0, color: '#ffffff', shapeTemplateId: 'temp-sideflap', flipped: false, attachments: {}
      };
    } else {
      this.tuckCount++;
      newNode = {
        id, name: `Tuck ${this.tuckCount}`, type: 'flap', extent: 0.5, foldedAngle: -93, unfoldedAngle: 0, color: '#ffffff', shapeTemplateId: 'temp-tuck', flipped: false, attachments: {}
      };
    }

    parent.attachments[edge] = newNode;
  }

  deleteNode(nodeId: string) {
    if (this.rootNode.id === nodeId) return; // Cannot delete root
    
    const traverse = (node: BoxNode): boolean => {
      for (const edge of ['top', 'bottom', 'left', 'right'] as EdgeType[]) {
        if (node.attachments[edge]) {
          if (node.attachments[edge]!.id === nodeId) {
            delete node.attachments[edge];
            if (this.selectedNodeId === nodeId) this.selectedNodeId = null;
            return true;
          }
          if (traverse(node.attachments[edge]!)) return true;
        }
      }
      return false;
    };
    traverse(this.rootNode);
  }

  // Update shape template
  setTemplatePath(templateId: string, path: PathCommand[]) {
    if (this.templates[templateId]) {
      this.templates[templateId].path = path;
    }
  }

  updateTemplatePathCommand(templateId: string, cmdIndex: number, newCmd: PathCommand) {
    if (this.templates[templateId] && this.templates[templateId].path[cmdIndex]) {
      this.templates[templateId].path[cmdIndex] = newCmd;
    }
  }

  addTemplatePathCommand(templateId: string, cmdIndex: number, newCmd: PathCommand) {
    if (this.templates[templateId]) {
      this.templates[templateId].path.splice(cmdIndex, 0, newCmd);
    }
  }

  deleteTemplatePathCommand(templateId: string, cmdIndex: number) {
    if (this.templates[templateId] && this.templates[templateId].path.length > 2) {
      this.templates[templateId].path.splice(cmdIndex, 1);
    }
  }

  setGlobalAnimationTiming(start: number, end: number) {
    if (this.rootNode) applyGlobalAnimationTiming(this.rootNode, start, end);
  }



  updateNodeDimension(nodeId: string, dimension: 'width' | 'height', value: number) {
    propagateWidthChange(this.rootNode, nodeId, dimension, value);
  }

  setNodeFlipped(nodeId: string, value: boolean) {
    const node = this.findNode(nodeId);
    if (node) {
      node.flipped = value;
    }
  }

  addHole(nodeId: string, type: 'circle' | 'rectangle' | 'euro-hole' | 'custom') {
    const node = this.findNode(nodeId);
    if (node) {
      const newHole: Cutout = {
        id: `hole-${Date.now()}`,
        type,
        x: 0,
        y: 0,
        width: type === 'euro-hole' ? 32 : 20,
        height: type === 'euro-hole' ? 10 : 20,
        radius: 10
      };
      
      if (type === 'custom') {
        const templateId = `temp-hole-${Date.now()}`;
        this.templates[templateId] = {
          id: templateId,
          name: 'Custom Hole',
          path: [
            { type: 'M', x: -0.5, y: -0.5 },
            { type: 'L', x: -0.5, y: 0.5 },
            { type: 'L', x: 0.5, y: 0.5 },
            { type: 'L', x: 0.5, y: -0.5 }
          ]
        };
        newHole.shapeTemplateId = templateId;
      }
      
      if (!node.holes) {
        node.holes = [];
      }
      node.holes.push(newHole);
      this.updateHole(nodeId, newHole.id, {}); // Trigger bounds check immediately
    }
  }

  updateHole(nodeId: string, holeId: string, updates: Partial<Cutout>) {
    const node = this.findNode(nodeId);
    const layout = this.flattenedLayout[nodeId];
    if (node && node.holes && layout) {
      const hole = node.holes.find(h => h.id === holeId);
      if (hole) {
        Object.assign(hole, updates);
        clampHoleToBounds(hole, layout);
      }
    }
  }

  removeHole(nodeId: string, holeId: string) {
    const node = this.findNode(nodeId);
    if (node && node.holes) {
      node.holes = node.holes.filter(h => h.id !== holeId);
    }
  }

  setGlobalBoxColor(color: string) { applyGlobalBoxColor(this.rootNode, color); }

  createCustomShapeTemplate(nodeId: string) {
    const node = this.findNode(nodeId);
    if (!node) return;

    const newId = `temp-custom-${Date.now()}`;
    const customTemplate = {
      id: newId,
      name: `Custom Shape ${Object.keys(this.templates).length + 1}`,
      path: [
        { type: 'M', x: -0.5, y: 0 },
        { type: 'L', x: 0.5, y: 0 },
        { type: 'L', x: 0.4, y: 1 },
        { type: 'L', x: -0.4, y: 1 },
        { type: 'L', x: -0.5, y: 0 }
      ] as PathCommand[]
    };

    this.templates[newId] = customTemplate;
    node.shapeTemplateId = newId;
    this.editingTemplateId = newId;
  }

  exportDielineToSVG() {
    const secureSdk = this.viewerInstance?.secureSdk;
    if (!secureSdk || !secureSdk.isInitialised) {
      alert("Verification Pending: License authentication required to export dielines.");
      return;
    }

    try {
      const flattenedLayoutJson = JSON.stringify(this.flattenedLayout);
      const layoutBoundsJson = JSON.stringify(this.layoutBounds);
      const templatesJson = JSON.stringify(this.templates);

      const svgContent = secureSdk.generateDielineSvg(
        flattenedLayoutJson,
        layoutBoundsJson,
        templatesJson,
        DESIGN_SCALE,
        this.showMeasurements,
        this.activeUnit,
        this.activeBoxTemplateId
      );

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `box-dieline-${this.activeBoxTemplateId}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: Error) {
      console.error(err);
      alert(`Export Failed: ${err.message || err}`);
    }
  }

  export3DSnapshot() {
    const viewer = this.viewerInstance;
    if (viewer) {
      const exportPlugin = viewer.getPlugin(ExportPlugin);
      if (exportPlugin) {
        exportPlugin.takeScreenshot();
      }
    }
  }

  export3DGLTF() {
    const viewer = this.viewerInstance;
    if (viewer) {
      const exportPlugin = viewer.getPlugin(ExportPlugin);
      if (exportPlugin) {
        exportPlugin.exportGLTF();
      }
    }
  }
}

export const configStore = new ConfigStore();
