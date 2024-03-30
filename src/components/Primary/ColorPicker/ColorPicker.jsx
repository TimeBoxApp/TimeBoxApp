import { Col, ColorPicker, Divider, Row } from 'antd';
import { green, presetPalettes, red, cyan, blue, purple } from '@ant-design/colors';

import styles from './color-picker.module.scss';

const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map(([label, colors]) => ({
    label,
    colors
  }));

const TimeboxColorPicker = ({ onChange, label, value }) => {
  const presets = genPresets({
    red,
    purple,
    green,
    cyan,
    blue
  });
  const customPanelRender = (_, { components: { Picker, Presets } }) => (
    <Row justify="space-between" style={{ width: '100%' }} wrap={false}>
      <Col span={12}>
        <Presets />
      </Col>
      <Divider
        type="vertical"
        style={{
          height: 'auto'
        }}
      />
      <Col flex="auto">
        <Picker />
      </Col>
    </Row>
  );

  return (
    <div className={styles.titleWrapper}>
      {label ? <span>{label}</span> : null}
      <ColorPicker
        showText
        disabledAlpha
        format={'hex'}
        destroyTooltipOnHide
        onChangeComplete={onChange}
        value={value || 'e0e5f2'}
        defaultValue={null}
        styles={{
          popupOverlayInner: {
            width: 480
          }
        }}
        presets={presets}
        panelRender={customPanelRender}
      />
    </div>
  );
};

export default TimeboxColorPicker;
