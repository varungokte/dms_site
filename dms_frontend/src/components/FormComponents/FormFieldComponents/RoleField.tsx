import { useEffect, useState } from "react";
import SelectField from "./SelectField";
import PermissionsField from "./PermissionsField";

function RoleField (props:{index:number, id: string, name:string, roleList:any, required:boolean, disabled:boolean, prefillValues:any, setPrefillValues:Function}){

  const [allRolesPermissionsList, setAllRolesPermissionsList] = useState<any>({});
  const [currentRole, setCurrentRole] = useState("");

  useEffect(()=>{
    if (props.prefillValues["R"] && props.prefillValues["R"]!=currentRole)
      setCurrentRole(props.prefillValues["R"])
  },[props.prefillValues])

  useEffect(()=>{
    if (props.roleList==undefined)
      return;
    const obj:any={}
    for (let i=0; i<props.roleList.length; i++)
      obj[props.roleList[i]["N"]]=props.roleList[i]["P"];
    setAllRolesPermissionsList(obj);
  },[props.roleList])

  useEffect(()=>{
    props.setPrefillValues((curr:any)=>{
      console.log("OLD curr",curr);
      console.log("allRolePermissionList",allRolesPermissionsList);
      console.log(Object.keys(allRolesPermissionsList),currentRole);
      console.log("single permission",allRolesPermissionsList[currentRole])
      curr["UP"]=allRolesPermissionsList[currentRole];
      console.log("NEW curr",curr);
      return {...curr};
    })
  },[allRolesPermissionsList,currentRole])

  return (
    <div>
      <SelectField index={props.index} id={"R"} name={"Role"} options={Object.keys(allRolesPermissionsList)} required={props.required} disabled={props.disabled} prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} setRole={setCurrentRole} />
      {currentRole==""
        ?<></>
        :<PermissionsField index={props.index} id={"UP"} name={"Permission"} 
          permissionPreset={props.prefillValues["UP"]} 
          required={props.required} disabled={props.disabled} 
          setPermissionSet={props.setPrefillValues}
        />
      }
    </div>
  )
};

export default RoleField