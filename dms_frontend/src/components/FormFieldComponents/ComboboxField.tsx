import { useEffect, useState } from "react";
import { Autocomplete, TextField as MUITextField } from "@mui/material";
import FieldLabel from "./FieldLabel";
import { FormFieldAttributes } from "DataTypes";

function ComboboxField (props:{index:number|string, fieldData:FormFieldAttributes, suggestions:any, prefillValue:any, setPrefillValues:Function, error?:boolean, disabled:boolean, placeholder?:string}){
  const [value, setValue] = useState("");
	const [results, setResults] = useState<any>([]);
  const [defaultValue,setDefaultValue] = useState<any>();
  const [error, setError] = useState(props.error);

  const [parameterToBeSent] = useState("E"); //Later this will be a prop

  useEffect(()=>setError(props.error),[props.error]);

  //useEffect(()=>console.log("combobox props",props),[props]);
  useEffect(()=>{
    if (props.prefillValue && props.suggestions.length!=0){
      let values=[];
      for (let i=0 ; i<props.suggestions.length; i++){
        if (props.fieldData.multiple && props.prefillValue.includes(props.suggestions[i].values["E"]))
          values.push(props.suggestions[i])
        else if (props.suggestions[i].values["E"]==props.prefillValue)
          setDefaultValue(props.suggestions[i])
      }
      if (props.fieldData.multiple && values.length!=0)
        setDefaultValue(values)
    }
    else  
      setDefaultValue(undefined);
  },[props.prefillValue,props.suggestions])

/*   useEffect(()=>{
    setDefaultValue(defaultValue) 
  },[props.suggestions]) */

  useEffect(()=>{
    props.setPrefillValues((curr:any)=>{
      curr[props.fieldData.id]=results; 
      return {...curr};
    })
  },[results]);

  useEffect(()=>{
    if (!props.prefillValue)
      return;
    for (let i=0; i<props.suggestions.length; i++)
      if (props.suggestions[i].label==props.prefillValue)
        setValue(props.suggestions[i].label);
  },[props.prefillValue]);

  return (
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
      <Autocomplete key={props.index+defaultValue} id={props.fieldData.id} disablePortal
        multiple={props.fieldData.multiple}
        disabled={props.disabled}
        limitTags={1}
        //value={(props.edit && !props.multiple)?(defaultValue||null):(defaultValue||undefined)}
  
        defaultValue={defaultValue}

        options={props.suggestions}
        getOptionLabel={(option:any)=>option.label}

        onChange={(_,temp)=>{
          setError(false);
          setResults(temp);
          if (!props.fieldData.multiple && results)
            setDefaultValue(results[0])}
        }
   
        isOptionEqualToValue={(option,value)=> option.values[parameterToBeSent]==value.values[parameterToBeSent]}
        
        filterOptions={(optionsList)=>{
          if (value=="")
            return optionsList;
          const regEx = new RegExp(value, "i");
          const newOptionsList:any = []; 
          for (let i=0; i<optionsList.length; i++){
            let found = false;
            const values=optionsList[i].values;
            
            if (values["E"].search(regEx)!==-1)
              found = true;
            else if (values["N"] && values["N"].search(regEx)!==-1)
              found=true;

            if (found)
              newOptionsList.push(optionsList[i]);
          }
          return newOptionsList;
        }}
        renderInput={(vals)=> {
          return <MUITextField 
            {...vals} 
            color="secondary"
            className="bg-white"
            error={error}
            value={value} 
            onChange={(e)=>setValue(e.target.value)}  
            placeholder={props.placeholder||`Add ${props.fieldData.name.toLowerCase()}${(props.fieldData.multiple?"s":"")}`} />}} 
        />
    </div>
  )
};

export default ComboboxField