import { useState } from "react";
import FormDialogDocuments from "../BasicComponents/FormDialogDocuments";
import { CreateButtonStyling } from "../BasicComponents/PurpleButtonStyling";
import { Table } from "../ui/table";
import { BodyRowsMapping, HeaderRows } from "../BasicComponents/Table";
import edit_icon from "./../static/edit_icon.svg";
import DeleteConfirmation from "../BasicComponents/DeleteConfirmation";
import { EnumIteratorValues, PriorityValues } from "../BasicComponents/Constants";
import EmptyPageMessage from "../BasicComponents/EmptyPageMessage";
import { FormSectionNavigation } from "../BasicComponents/FormSectionNavigation";

function LoanConditions(props:{key:number,actionType: string, loanId: string, setLoanId: Function, AID: string, setAID: Function, currentSection: number, setCurrentSection: Function, goToNextSection: Function, setOkToChange: Function, label: string, setShowSecurityDetails: Function, showSecurityDetails: boolean, setOkToFrolic: Function, preexistingValues:any,}){
  
  const [newFiles, setNewFiles] = useState<any>([]);
  const [conditionsList] = useState([
    /* { D:"A description of this condition", SD:"23/09/1222", ED:"21/10/1321", PL:"A", EL:"B" } */
  ]);

  const [fieldValues, setFieldValues] = useState<any>({});

  const [fieldList] = useState([
    { category:"grid", row:2, fields:[
      { id:"N", name:"Condition Name", type:"select", options:["Condition1", "Condition2"] },
      { id:"P", name: "Priority", type:"select", options:EnumIteratorValues(PriorityValues)},
      { id:"SD", name:"Start Date", type:"date" },
      { id:"ED", name:"End Date", type:"date" },
      { id:"PL", name:"Physical Location", type:"text" },
      { id:"EL", name:"Execution Location", type:"text" },
    ]},
    { category:"single", id:"D", name:"Description", type:"textarea" },
  ]);

  const [uploadField] = useState(
    { category:"single", id: "U", name:"Upload Document", type:"file", }
  );

  const addCondtion = () => {
    if (fieldValues["F"] && fieldValues["T"]!=1)
      delete fieldValues["F"];
    console.log(fieldValues)
  };

  const editCondtion = (e:any) => {
    e.preventDefault();
  };

  const deleteCondtion = (userIndex:number) => {
    const userid=0//get user from userIndex
    console.log(userIndex,userid);
  }

  return ( 
    <div className="bg-white rounded-xl">
      <br/>
      {/* <p className="text-2xl font-bold m-7 mt-5">Covenants</p> */}

      <div className="flex flex-row">
        {/* <div>
          <Search setter={setSearchString} label="Search" />
        </div> */}

        <div className="flex-auto">
          {/* <Filter setter={setPriority} listsAreSame={false} 
            labelList={EnumIteratorValues(CovenantType)} valueList={EnumIteratorKeys(CovenantType).map(val=>{return Number(val)+1})}
          /> */}
        </div>

        <div className="mr-3">
          <FormDialogDocuments key={-5} index={-5} edit={false} type="con" currentFields={fieldValues}
            triggerText="+ Add" triggerClassName={`${CreateButtonStyling} w-28`} formTitle={props.label} formSubmit={addCondtion}
            detailForm={fieldList} setter={setFieldValues} fieldValues={fieldValues}
            uploadForm={uploadField} fileSetter={setNewFiles} fileList={newFiles}
          />
        </div>
      </div>
      <br/>
      <div className="">
        {conditionsList.length==0
          ?<EmptyPageMessage sectionName="documents" />
          :<Table className="border rounded-2xl">
            <HeaderRows headingRows={[["Description"],["Phyical Location"], ["Execution Location"], ["Start Date"],["End Date"], ["Action"]]} />
            <BodyRowsMapping
              list={conditionsList} columns={["D","PL","EL", "SD", "ED"]} dataType={["text", "text","text", "text", "text", "action"]}
              searchRows={[]} filterRows={[]}
              action = {conditionsList.map((item:any, index:number)=>{
                item;
                return(
                  <div className="flex flex-row">
                    <FormDialogDocuments key={index} index={index} edit={true} type="con" 
                      triggerText={<img src={edit_icon} className="mr-5"/>} triggerClassName={""} formTitle={props.label} formSubmit={editCondtion}
                      detailForm={fieldList} setter={setFieldValues} fieldValues={fieldValues}
                      uploadForm={uploadField} fileSetter={setNewFiles} fileList={newFiles}
                      currentFields={conditionsList[index]}
                    />
                    <DeleteConfirmation thing="covenant" deleteFunction={deleteCondtion} currIndex={index}/>
                  </div>
                )
              })}
            />
          </Table>
        }
      </div>
      <br/>
      <FormSectionNavigation isForm={false} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
    </div>
  )

}


export default LoanConditions;