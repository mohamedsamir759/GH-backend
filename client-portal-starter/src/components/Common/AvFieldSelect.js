
import React, { useRef } from "react";
import {
  AvField
} from "availity-reactstrap-validation";
import Select from "react-select";

function AvFieldSelecvt(props) {
  const ref1 = useRef();
  const [state, setState] = React.useState(null);
  const onFieldChange = (e) => {
    setState(e.value);
    if (props.onChange) {
      props.onChange(e.value);
    }
  };
  const { label, ...params } = props;
  let options = props.options || [];
  if (props.placeholder) {
    options = [
      {
        label: props.placeholder,
        value: "",
      },
      ...options
    ];
  }
  // React.useEffect(()=>{
  //   setState(params.value);
  // }, [props]);
  return (<React.Fragment>
    <label>{label}</label>
    <Select
      ref={ref1}
      defaultValue={options.find(obj => obj.value === props.value) || {}}
      options={options} 
      onChange={onFieldChange}
    />
    <AvField
      {...params}
      type="select"
      value={state === null ? props.value : state}
      style={{
        opacity: 0,
        height: 0,
        margin: -10,
        "pointer-events": "none",
      }}
    >
      {options.map((obj, index) => {
        return (<option key={index} value={obj.value}>{obj.label}</option>);
      })}
    </AvField>
    

  </React.Fragment>);
}

export default AvFieldSelecvt;
