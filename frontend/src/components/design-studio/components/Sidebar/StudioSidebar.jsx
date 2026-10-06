import React from 'react';
import { Sliders, Type, UploadCloud, Shapes, Grid, Folder, Palette, Plus } from 'lucide-react';
import TextPanel from './panels/TextPanel';
import TemplateColorPanel from './panels/TemplateColorPanel';
import TemplateSwitcherPanel from './panels/TemplateSwitcherPanel';
import UploadsPanel from './panels/UploadsPanel';
import ProductOptionsPanel from './panels/ProductOptionsPanel';
import GraphicsPanel from './panels/GraphicsPanel';
import BackgroundPanel from './panels/BackgroundPanel';
import MorePanel from './panels/MorePanel';
import '../../css/StudioSidebar.css';

export default function StudioSidebar({
  activeTool,
  setActiveTool,
  panelWidth,
  handleStartPanelResize,
  // Panel Props
  activeField,
  setActiveField,
  fields,
  updateField,
  activeFieldStyle,
  updateActiveStyle,
  handleAddCustomField,
  activeColor,
  setActiveColor,
  layout,
  palette,
  allTemplates,
  activeTemplate,
  setActiveTemplate,
  setFrontArtwork,
  setBackArtwork,
  setFields,
  activeSide,
  setActiveSide = () => {},
  frontArtwork,
  backArtwork,
  frontArtworkTransform,
  setFrontArtworkTransform,
  backArtworkTransform,
  setBackArtworkTransform,
  handleRemoveArtwork,
  fileInputRef,
  handleArtworkUpload,
  uploadedLogo,
  setUploadedLogo = () => {},
  logoTransform,
  setLogoTransform,
  handleRemoveLogo,
  logoInputRef,
  handleLogoFileChange,
  setIsLogoModalOpen,
  isCustomMode,
  initialTemplate = {},
  setBackOption = () => {},
  handleArtworkAlign = () => {},
  paperStock,
  setPaperStock,
  finishType,
  setFinishType,
  cornerStyle,
  setCornerStyle,
  orientation,
  setOrientation,
  cardDimension,
  setCardDimension,
  backsideType,
  setBacksideType,
  currentCard,
  graphicsCategory,
  setGraphicsCategory,
  graphicsSearch,
  setGraphicsSearch,
  cardGraphics,
  setCardGraphics,
  handleAddGraphic,
  alignGraphic,
  updateGraphic,
  removeGraphic,
  qrInput,
  setQrInput,
  qrType,
  setQrType,
  renderGraphicPreview,
  cardBackground,
  setCardBackground,
  dimensionUnit,
  setDimensionUnit,
  activeGuide,
  setPinnedGuide,
  handleDownloadVCard,
  handleAddQrCode,
}) {
  return (
    <>
      {/* SUB-COLUMN 1: ICON TOOLBAR */}
      <aside className="vp-studio-icon-toolbar">
        <button
          type="button"
          className={`vp-studio-tool-item ${activeTool === 'product_options' ? 'active' : ''}`}
          onClick={() => setActiveTool('product_options')}
        >
          <Sliders size={20} />
          <span>Product options</span>
        </button>

        <button
          type="button"
          className={`vp-studio-tool-item ${activeTool === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTool('text')}
        >
          <Type size={20} />
          <span>Text</span>
        </button>

        <button
          type="button"
          className={`vp-studio-tool-item ${activeTool === 'uploads' ? 'active' : ''}`}
          onClick={() => {
            setActiveTool('uploads');
            if (fileInputRef.current) fileInputRef.current.click();
          }}
        >
          <UploadCloud size={20} />
          <span>Uploads</span>
        </button>

        <button
          type="button"
          className={`vp-studio-tool-item ${activeTool === 'graphics' ? 'active' : ''}`}
          onClick={() => setActiveTool('graphics')}
        >
          <Shapes size={20} />
          <span>Graphics</span>
        </button>

        <button
          type="button"
          className={`vp-studio-tool-item ${activeTool === 'background' ? 'active' : ''}`}
          onClick={() => setActiveTool('background')}
        >
          <Grid size={20} />
          <span>Background</span>
        </button>

        <button
          type="button"
          className={`vp-studio-tool-item ${activeTool === 'template' ? 'active' : ''}`}
          onClick={() => setActiveTool('template')}
        >
          <Folder size={20} />
          <span>Template</span>
        </button>

        <button
          type="button"
          className={`vp-studio-tool-item ${activeTool === 'template_color' ? 'active' : ''}`}
          onClick={() => setActiveTool('template_color')}
        >
          <Palette size={20} />
          <span>Template color</span>
        </button>

        <button
          type="button"
          className={`vp-studio-tool-item ${activeTool === 'more' ? 'active' : ''}`}
          onClick={() => setActiveTool('more')}
        >
          <Plus size={20} />
          <span>More</span>
        </button>
      </aside>

      {/* SUB-COLUMN 2: PROPERTIES / TEXT PANEL */}
      <section className="vp-studio-properties-panel" style={{ width: `${panelWidth}px` }}>
        {activeTool === 'text' && (
          <TextPanel
            activeField={activeField}
            setActiveField={setActiveField}
            fields={fields}
            updateField={updateField}
            activeFieldStyle={activeFieldStyle}
            updateActiveStyle={updateActiveStyle}
            handleAddCustomField={handleAddCustomField}
            activeColor={activeColor}
            layout={layout}
            isCustomMode={isCustomMode}
            setFields={setFields}
            initialTemplate={initialTemplate}
          />
        )}

        {activeTool === 'template_color' && (
          <TemplateColorPanel
            activeColor={activeColor}
            setActiveColor={setActiveColor}
            palette={palette}
          />
        )}

        {activeTool === 'template' && (
          <TemplateSwitcherPanel
            allTemplates={allTemplates}
            activeTemplate={activeTemplate}
            setActiveTemplate={setActiveTemplate}
            setActiveColor={setActiveColor}
            setFrontArtwork={setFrontArtwork}
            setBackArtwork={setBackArtwork}
            setFields={setFields}
          />
        )}

        {activeTool === 'uploads' && (
          <UploadsPanel
            activeSide={activeSide}
            setActiveSide={setActiveSide}
            frontArtwork={frontArtwork}
            setFrontArtwork={setFrontArtwork}
            backArtwork={backArtwork}
            setBackArtwork={setBackArtwork}
            frontArtworkTransform={frontArtworkTransform}
            setFrontArtworkTransform={setFrontArtworkTransform}
            backArtworkTransform={backArtworkTransform}
            setBackArtworkTransform={setBackArtworkTransform}
            fileInputRef={fileInputRef}
            uploadedLogo={uploadedLogo}
            setUploadedLogo={setUploadedLogo}
            logoTransform={logoTransform}
            setLogoTransform={setLogoTransform}
            logoInputRef={logoInputRef}
            handleLogoFileChange={handleLogoFileChange}
            setIsLogoModalOpen={setIsLogoModalOpen}
            isCustomMode={isCustomMode}
            handleArtworkAlign={handleArtworkAlign}
          />
        )}

        {activeTool === 'product_options' && (
          <ProductOptionsPanel
            paperStock={paperStock}
            setPaperStock={setPaperStock}
            finishType={finishType}
            setFinishType={setFinishType}
            cornerStyle={cornerStyle}
            setCornerStyle={setCornerStyle}
            orientation={orientation}
            setOrientation={setOrientation}
            cardDimension={cardDimension}
            setCardDimension={setCardDimension}
            backsideType={backsideType}
            setBacksideType={setBacksideType}
            currentCard={currentCard}
            activeColor={activeColor}
            setBackOption={setBackOption}
          />
        )}

        {activeTool === 'graphics' && (
          <GraphicsPanel
            graphicsCategory={graphicsCategory}
            setGraphicsCategory={setGraphicsCategory}
            graphicsSearch={graphicsSearch}
            setGraphicsSearch={setGraphicsSearch}
            activeSide={activeSide}
            cardGraphics={cardGraphics}
            setCardGraphics={setCardGraphics}
            handleAddGraphic={handleAddGraphic}
            alignGraphic={alignGraphic}
            updateGraphic={updateGraphic}
            removeGraphic={removeGraphic}
            qrInput={qrInput}
            setQrInput={setQrInput}
            qrType={qrType}
            setQrType={setQrType}
            activeField={activeField}
            setActiveField={setActiveField}
            renderGraphicPreview={renderGraphicPreview}
            activeColor={activeColor}
          />
        )}

        {activeTool === 'background' && (
          <BackgroundPanel
            activeSide={activeSide}
            setActiveSide={setActiveSide}
            cardBackground={cardBackground}
            setCardBackground={setCardBackground}
          />
        )}

        {activeTool === 'more' && (
          <MorePanel
            fields={fields}
            qrType={qrType}
            setQrType={setQrType}
            qrInput={qrInput}
            setQrInput={setQrInput}
            handleAddQrCode={handleAddQrCode}
            paperStock={paperStock}
            finishType={finishType}
            dimensionUnit={dimensionUnit}
            setDimensionUnit={setDimensionUnit}
            activeGuide={activeGuide}
            setPinnedGuide={setPinnedGuide}
            handleDownloadVCard={handleDownloadVCard}
          />
        )}
      </section>

      {/* DRAGGABLE PROPERTIES PANEL RESIZER */}
      <div
        className="vp-studio-panel-resizer"
        onMouseDown={handleStartPanelResize}
        title="Drag horizontally to resize side panel"
      />
    </>
  );
}
