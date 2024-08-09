import { ReactElement, useEffect, useRef, useState } from "react";
import useGlobalContext from "../../GlobalContext";
import moment from "moment";
import { DocumentStatus, DocumentSectionDetails, FieldValues } from "DataTypes";

import SingleDealDocuments from "./SingleDealDocuments";
import SingleDealPayments from "./SingleDealPayments";

import TableCollapsible from "./BasicComponents/TableCollapsible";
import ProgressBar from "./BasicComponents/ProgressBar";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
import LoadingMessage from "./BasicMessages/LoadingMessage";
import { useLocation } from "react-router-dom";
import { Pagination } from "./BasicComponents/Pagination";
import { sectionNames } from "./../../Constants";

type DocumentDetails= {
  _id:string,
  AID:string, 
  CN:string, 
  SD:Date|string,
  details: {S:DocumentStatus}[]
}

function DealsList(props:{label:string, masters?:boolean, docData?:FieldValues}) {
  useEffect(()=>{
    if (!props.masters)
		  document.title=props.label+" | Beacon DMS"
	},[]);

  const {state} = useLocation();
  const dealRefs = useRef<any>([]);
  const admin = sectionNames[props.label].split("/").length>1;

  const setSection = (): DocumentSectionDetails => {
    const label = sectionNames[props.label].split("/")[0];
    if (label=="transaction")
      return { sectionName: "TD", sectionType:"document" }
    else if (label=="compliance")
      return { sectionName: "CD", sectionType:"document" }
    else if (label=="covenants")
      return { sectionName: "C", sectionType:"covenant" }
    else if (label=="precedent")
      return { sectionName: "CP", sectionType:"condition" }
    else if (label=="subsequent")
      return { sectionName: "CS", sectionType:"condition" }
    else
      return { sectionName:"PD", sectionType:"payment" }
  }

  const sectionDetails = setSection();

  const [dealData, setDealData] = useState<DocumentDetails[]>();

  const [calculate, setCalculate] = useState(true);
  const [searchString, _] = useState("");
  const [showDeals, setShowDeals] = useState<boolean[]>();
  const [fromRedirect, setFromRedirect] = useState(true);
  const [currentTab, setCurrentTab] = useState(-1);

  const { getDealList} = useGlobalContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(()=>{
    setCalculate(true);
  },[currentPage,rowsPerPage]);

  const getDocData = async () => {
    const res =props.masters?(props.docData):await getDealList({ admin,sectionName:sectionDetails.sectionName, currentPage, rowsPerPage});

    if (!res)
      return;

    try{
      setDealData(res.obj[0]["data"]);
      const arr = new Array(res.obj.length).fill(false);
      if (currentTab!=-1)
        arr[currentTab] = true;
      setShowDeals(arr);
      setCurrentTab(-1);
      setTotalPages(Math.ceil(Number(res.obj[0]["metadata"][0]["total"])/Number(rowsPerPage)));
    }
    catch(e){
      setDealData([]);
    }
  setCalculate(false);
    return  res;
  }

  useEffect(()=>{
    setCalculate(true)
  },[props.docData])

  useEffect(()=>{
    if (calculate)
      getDocData();
  },[calculate]);

  useEffect(()=>{
    if (!state)
      setFromRedirect(false);
    else if (fromRedirect)
      openDeal();
  },[state,dealData]);

  const openDeal = () =>{
    if (!dealData || !showDeals)
      return;

    let dealIndex = -1;
    dealData.map((deal,index)=>{if (deal.AID==state)dealIndex=index});
    if (dealIndex)
      setShowDeals((curr:boolean[]|undefined)=>{
        if (!curr)
          return;
        curr[dealIndex] = true;
        return [...curr];
    })
  }

  return(
    <div>
      {props.masters?<></>:<p className="text-3xl font-bold m-7">{props.label}</p>}
			<div className="flex flex-row">
        <div className='mx-7'>
        </div>
      </div>

      <div className="bg-white m-7 rounded-xl">
        <br/>
        {dealData==undefined
          ?<LoadingMessage sectionName="data" />
          :dealData.length==0
            ?<EmptyPageMessage sectionName="deals"/>
            :dealData.map((deal,index)=>{
              return <div ref={el=>dealRefs.current[index]=el} key={index}>
                <SingleDealDetails key={index} label={props.label} index={index} deal={deal} sectionDetails={sectionDetails} searchString={searchString} showDeals={showDeals||[]} setShowDeals={setShowDeals} calculate={calculate} setCalculate={setCalculate} linkSource={state} setCurrentTab={setCurrentTab} admin={admin} />
              </div>
            })
        }
        <br/>
        {dealData && dealData.length>0
          ?<Pagination className="mx-5" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
          :<></>
        }
      </div>
    </div>
  )
}

function SingleDealDetails(props:{index:number, label:string, deal:DocumentDetails, sectionDetails:DocumentSectionDetails, searchString:string, showDeals:boolean[],setShowDeals:Function, calculate:boolean, setCalculate:Function, linkSource?:string,setCurrentTab:Function, admin:boolean}) {
  const [added,setAdded] = useState(true);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(()=>{
    if (added){
      props.setCalculate(true);
      if (props.showDeals[props.index])
        props.setCurrentTab(props.index);
    }
  },[added]);

  useEffect(()=>{
    const totalDocs = props.deal.details.length;
    let verifiedDocs = 0;
    for (let i=0; i<totalDocs; i++){
      if (props.deal.details[i]["S"]=="Verified")
        verifiedDocs++;
    }
    const percentage = (verifiedDocs/totalDocs*100).toFixed(2);
    setProgressValue(Number(percentage));
  },[props.deal,props.calculate]);

  const tableTopRow:[string,string][] = [
    [props.deal.AID, "w-[20%] font-medium text-base"],
    [props.deal.CN, "w-[20%] font-medium text-base"], 
    [moment(props.deal.SD).format("DD-MM-yyyy"), "w-[30%] font-medium text-base"],
  ];

  const tableBottomRow:[string|ReactElement,string][] = [
    ["Agreement ID", "font-light"], 
    ["Company Name", "font-light"],
    ["Sanction Date", "font-light"],
  ];

  if (props.sectionDetails.sectionType!="payment"){
    tableTopRow.push(["Verified Documents", "w-[26.70%] font-medium text-base text-justify"])
    tableBottomRow.push([<ProgressBar value={progressValue} />, "content-center"])
  }

  return(
    <TableCollapsible key={props.index} index={props.index}
      topRow={tableTopRow}
      bottomRow={tableBottomRow}
      showTabs={props.showDeals} setShowTabs={props.setShowDeals}
      content={props.sectionDetails.sectionType=="payment"
        ?<SingleDealPayments label={props.label} loanId={props.deal["_id"]} AID={props.deal.AID} sectionDetails={props.sectionDetails} admin={props.admin} />
        :<SingleDealDocuments label={props.label} loanId={props.deal["_id"]} AID={props.deal.AID} sectionDetails={props.sectionDetails} added={added} setAdded={setAdded} open={props.showDeals[props.index]} admin={props.admin} />
      }
      searchString={props.searchString}
    />
  )
}

export default DealsList;