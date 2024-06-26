import { ReactElement, useEffect, useState } from "react";
import useGlobalContext from "../../../GlobalContext";
import { DocumentRejectionReasonList } from "./../../../Constants";
import { DocumentStatus, FieldValues } from "./../../../DataTypes";

import { Dialog,DialogContent,DialogTitle } from "@mui/material";
import LoadingMessage from "./LoadingMessage";

import view_icon from "./../static/view_files_icon.svg";
import { SubmitButtonStyling } from "./PurpleButtonStyling";
import CloseIcon from '@mui/icons-material/Close';

type CommonFileViewer = {AID:string, fileName:string, actualName:string, status:DocumentStatus, rejectionReason?:string, setAdded:Function,sectionName:string };

type DocumentFileViewer = {type:"doc", loanId:string, docId:string, };

type PaymentFileViewer = {type:"pay", _id:string, index:number, schedule:FieldValues[] };


function ViewFileButton(props:CommonFileViewer & (DocumentFileViewer|PaymentFileViewer)){
  
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div>
      <button onClick={()=>setOpenDialog(true)}
       className="flex flex-row rounded-xl m-auto p-3 w-28 inline-block align-middle" 
       style={{backgroundColor:"rgba(255, 245, 204, 1)"}}
      >
        <img className="m-auto" src={view_icon} />
        <span className="m-auto" style={{color:"rgba(255, 178, 0, 1)"}}>View</span>
      </button>
      {openDialog
        ?<Dialog open={openDialog} onClose={()=>setOpenDialog(false)} fullScreen>
          <FileViewer {...props} setOpenDialog={setOpenDialog} status={props.status} setAdded={props.setAdded} rejectionReason={props.rejectionReason} />
        </Dialog>
        :<></>
      }
    </div>
  )
};

function FileViewer(props:CommonFileViewer & (DocumentFileViewer|PaymentFileViewer) & {setOpenDialog:Function}){      
  //IMPORTANT
  //docId is only present when !isPayment
  const [showDoc, setShowDoc] = useState<ReactElement>(<LoadingMessage sectionName="file"/>);
  const [verified, setVerified] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionText, setRejectionText] = useState("");
  const [errorMessage, setErrorMessage] = useState(<></>);
  const [rejectionError, setRejectionError] = useState(<></>);

  const {fetchDocument,editDocument, addPaymentSchedule}=useGlobalContext();

  const [openRejectionDialog, setOpenRejectionDialog] = useState(false);
  
  useEffect(()=>{
    fetchDocument(props.AID, props.sectionName,props.fileName).then(res=>{
      if (res.status==200)
        setShowDoc(<iframe src={res.url} width="97%" height="95%" title="Document Viewer"></iframe>)
      else
        setShowDoc(<p className="text-center m-auto text-red-600">There was an error getting this file.</p>)
    }).catch(()=>{
      setShowDoc(<p className="text-center m-auto text-red-600">There was an error getting this file.</p>)
    })
  },[]);

  useEffect(()=>{
    if (props.status=="Rejected")
      setRejected(true);
    if (props.status=="Verified")
      setVerified(true);
  },[props.status]);
  
  const changeStatus = async (status:DocumentStatus) => {
    const data:FieldValues= {};

    let res;

    if (props.type=="pay"){
      data["_id"]=props._id;
      data["POS"]=props.index;

      props.schedule[props.index]["S"]=status;
      if (status=="Rejected")
        props.schedule[props.index]["R"]=rejectionReason=="Other"?rejectionText:rejectionReason;
      else if (props.schedule[props.index]["R"])
        delete props.schedule[props.index]["R"];
      data["GS"] = props.schedule;
      
      res = await addPaymentSchedule(data);
    }
    else{
      data["_loanId"]=props.loanId;
      data["_id"]=props.docId;
      data["SN"]=props.sectionName;
      data["S"]=status;
      
      if (status=="Rejected")
        data["R"]=rejectionReason=="Other"?rejectionText:rejectionReason;
      else if (status=="Verified" && data["R"])
        delete data["R"];
     
      res = (await editDocument(data)).status;
    } 

    console.log("response",res)
   
    if (res==200){
      if (status=="Verified")
        setVerified(true);
      else
        setRejected(true);
      setOpenRejectionDialog(false);
      props.setAdded(true);
    }
    else
      setErrorMessage(<p className="text-yellow-700">Something went wrong</p>)
  }


  return (<>
    <div className="flex flex-row p-2 bg-black">
      <p className="flex-auto text-white m-auto mx-2 ">{props.actualName}</p>
      
      {rejected?<span className="text-red-500 flex-auto my-auto">Document Rejected: {props.rejectionReason}</span>:<></>}
      
      {/* <button className="border-2 m-auto mx-5 p-2 rounded-if border-white text-white">Replace</button>
      <button className="border-2 m-auto mx-5 p-2 rounded-if border-red-600 text-red-600">Delete</button> */}
      
      {rejected
        ?<></>
        :<button className={`border-2 mx-5 w-28 p-2 m-auto rounded-if text-white hover:bg-gray-800 click:bg-gray-800 `}onClick={()=>setOpenRejectionDialog(true)}>Reject</button>
      }

      <Dialog onClose={()=>setOpenRejectionDialog(false)} open={openRejectionDialog} maxWidth="sm" fullWidth>
        <DialogTitle><div>Reject Document</div></DialogTitle>
        <DialogContent>
          <b className="text-lg">Reason</b>
          {DocumentRejectionReasonList.map((reason,index)=>{
            if (index!=0)
              return (
                <div key={index} className="my-2">
                  <input id={index+""} type="checkbox" className="mx-5" 
                    checked={rejectionReason==reason}
                    onChange={(e)=>{
                      if (e.target.checked)
                        setRejectionReason(reason);
                      else if (rejectionReason==reason)
                        setRejectionReason("");
                      }}
                    />
                  <label id={index+"label"} htmlFor={index+""}>{reason}</label>
                </div>
              )
          })}
          {rejectionReason=="Other"?<textarea className="border rounded-if w-full h-full p-4 mx-3  my-1" value={rejectionText} onChange={(e)=>setRejectionText(e.target.value)}/>:<></>}
          {/* <b className="text-lg">Others</b><br/> 
          <br/> */}
          <button onClick={()=>{if (rejectionReason) changeStatus("Rejected"); else setRejectionError(<p className="text-red-500 mx-2">A reason or comment must be provided.</p>)}} className={`float-right ${SubmitButtonStyling} mt-5 h-[40px]`}>Submit</button>
          {rejectionError}
        </DialogContent>
      </Dialog>

      {rejected
        ?<></>
        :<button 
          className={`border-2 mx-5 py-2 px-5  m-auto rounded-if ${verified?"border-lime-700":"border-lime-500"} ${verified?"bg-lime-700":"bg-lime-500"} text-white`}
          onClick={()=>changeStatus("Verified")}
          disabled={verified}
        >
          {verified?"Verified":"Verify"}
        </button>
      }
      <button className="mx-5 p-2 text-white m-auto mx-2" onClick={()=>props.setOpenDialog(false)}>{<CloseIcon/>}</button>
    </div>
    <DialogContent>
      {errorMessage}
      {showDoc}
    </DialogContent>
  </>)
}

export default ViewFileButton;