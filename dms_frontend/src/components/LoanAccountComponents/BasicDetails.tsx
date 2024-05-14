import { useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";
import { FormTextField, FormSelectField } from "../BasicComponents/FormFields";
import { EnumIteratorValues, ZoneList } from "../BasicComponents/Constants";
import {FormSectionNavigation} from "./../BasicComponents/FormSectionNavigation";
import moment from "moment";

function BasicDetails(props:any) {

  useEffect(()=>{
    if (props.actionType=="EDIT" && props.preexistingValues){
      const obj:any ={};
      Object.keys(props.preexistingValues).map(value=>{
        if (value=="SD" || value=="DD" || value=="CD" || value=="RED")
          obj[value] = moment(props.preexistingValues["SD"]).format("DD/MM/YYYY");
        else
          obj[value]= props.preexistingValues[value];
      });

      setFieldValues(curr=>{
        return {...curr, ...obj}
      });
      setOldFieldValues(curr=>{
        return {...curr, ...obj}
      })
    }
  },[])

  const [oldFieldValues, setOldFieldValues] = useState({ 
    "AID": null, "Z": null, "CN": null, "PN": null, 
    "GN": null, "GST":null, "CIN": null, "I": null, 
    "SA": null, "HA":null,"DA": null, "DD": null, 
    "PS": null, "OA":null,"T": null, "P": null, 
    "ST": null, "SD": null, "CD": null, "RED": null, 
    "A": null, "F": null, "S": null, "V": null,
  }) 

  const [fieldValues, setFieldValues] = useState({ 
    "AID": null, "Z": null, "CN": null, "PN": null, 
    "GN": null, "GST":null, "CIN": null, "I": null, 
    "SA": null, "HA":null,"DA": null, "DD": null, 
    "PS": null, "OA":null,"T": null, "P": null, 
    "ST": null, "SD": null, "CD": null, "RED": null, 
    "A": null, "F": null, "S": null, "V": null,
  }) 
  const [fieldList] = useState([
    { id:"CN", name:"Company Name", type:"text", required: true },
    { id:"GN", name:"Group Name", type:"text", required: true },
    { id:"I", name:"Industry", type:"select", options:["Banking","Real Estate", "Manufacturing"], required: true },
    { id:"Z", name:"Zone", type:"select", options:EnumIteratorValues(ZoneList), required: true },
    { id:"P", name:"Loan Product", type:"select", options:["Term Loan","Drop-line LOC", "WCDL", "Debentures"], required: false },
    { id:"T", name:"Loan Type", type:"select", options:["Long Term","Short Term"], required: true },
    { id:"ST", name:"Secured", type:"select", options:["Secured","Unsecured"], required: true }, 
    { id:"PS", name:"Project Status", type:"select", options:["Not Started","In Progress","Finished"], required: true },
    { id:"PN", name:"PAN Number", type:"text", required: true },
    { id:"GST", name:"GST Number", type:"text", required: false },
    { id:"CIN", name:"CIN Number", type:"text", required: false },
    { id:"break" },
    { id:"SD", name:"Sanction Date", type:"date", required: true },
    { id:"DD", name:"Downsell Date", type:"date", required: false },
    { id:"CD", name:"Loan Closure Date", type:"date", required: true },
    { id:"RED", name:"Repayment End Date", type:"date", required: false },
    { id:"SA", name:"Sanction Amount", type:"number", required: true },
    { id:"HA", name:"Hold Amount", type:"number", required: true },
    { id:"DA", name:"Downsell Amount", type:"number", required: true },
    { id:"OA", name:"O/S Amount", type:"number", required: false },
    { unnecessaryComplication: true, id:"A", name:"DSRA Applicability", type:"select", options:["Yes","No"], required: false },
    { unnecessaryComplication: true, id:"F", name:"DSRA Form", type:"select", options:["LC","BG", "FD"], required: false },
    { unnecessaryComplication: true, id:"S", name:"DSRA Created or Not", type:"select", options:["Yes","No"], required: false },
    { unnecessaryComplication: true, id:"V", name:"DSRA Amount", type:"number", required: false },
  ]);

  const {createLoan} = useGlobalContext();

  const submitForm = (e:any) => {
    e.preventDefault();
    
    const data:any={};
    const dsra:any={};

    Object.keys(fieldValues).map(field=>{
      if (field=="A" && fieldValues[field]==2)
        dsra[field] = fieldValues[field]
      else if (field=="A" || field=="F" || field=="S" || field=="V"){
        if (fieldValues[field]!=null && fieldValues[field]==oldFieldValues[field])
          dsra[field] = fieldValues[field];
      }
      //@ts-ignore
      if (fieldValues[field]==null || fieldValues[field]==-1 || (props.actionType=="EDIT" && fieldValues[field]==oldFieldValues[field]))
        return;
      //@ts-ignore
      data[field] = fieldValues[field];
    })

    if (Object.keys(dsra).length!=0)
      data["dsra"] = dsra

    if (Object.keys(data).length!=0){
      console.log("SUBMITTED NOW",data);

      data["AID"]= props.AID;
      data["_loanId"]= props.loanId;

      if (fieldValues["ST"]==2)
        props.setShowSecurityDetails(false);

      createLoan(data).then(res=> {
        if (res==200)
          props.goToNextSection();
      }   
      ).catch(err=> console.log(err))
    }
    else{
      if (fieldValues["ST"]==2)
        props.setShowSecurityDetails(false);
        props.goToNextSection();
    }
  }

  return(
    <div className="">
      <br/>
      <p className="italic">Fields marked with <span className="text-red-600">*</span> are required fields</p>
      <br/>
      <form onSubmit={submitForm}>
        <div className="grid grid-cols-4">
        {fieldList.map((field,index)=>{
          let disabled = false;
          if (field.id=="break")
            return<div key={index}></div>
          if ((fieldValues["A"]==-1 || fieldValues["A"]==2 || fieldValues["A"]==null) && (field.id=="F" || field.id=="S" || field.id=="V"))
            disabled=true
          if (field.type=="select")
          //@ts-ignore
            return <FormSelectField key={field.id} id={field.id} name={field.name} setter={setFieldValues} value={fieldValues[field.id]} optionsList={field.options} required={field.required} disabled={disabled} />
          else
          //@ts-ignore
            return <FormTextField key={field.id}  id={field.id} name={field.name} setter={setFieldValues} value={fieldValues[field.id]} type={field.type} required={field.required} disabled={disabled} />
        })}
        </div>
        <br/>
        <FormSectionNavigation currentSection={props.currentSection} goToNextSection={props.goToNextSection} isForm={true} />
      </form>
      <br/>
    </div>
  )
}


export default BasicDetails;