import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Slider from "antd/lib/slider";
import InputNumber from "antd/lib/input-number";
import { useState } from "react";

const MIN_VALUE = 1;
const MAX_VALUE = 2;
const STEP_VALUE = 0.01;

const DecimalSlider = () => {
  const [value, setValue] = useState(1);

  const onChange = (value: number) => {
    setValue(value);
  };

  return (
    <Row>
      <Col span={12}>
        <Slider
          min={MIN_VALUE}
          max={MAX_VALUE}
          onChange={onChange}
          value={typeof value === "number" ? value : 0}
          step={STEP_VALUE}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={MIN_VALUE}
          max={MAX_VALUE}
          style={{ margin: "0 16px" }}
          step={STEP_VALUE}
          value={value}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default DecimalSlider;
