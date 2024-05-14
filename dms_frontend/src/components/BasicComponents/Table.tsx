import { TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { PriorityValues, PriorityStyling,DocumentStatusValues, DocumentStatusStyling, UserStatusValues, UserStatusStyling, UserRoles, RatingTypes, RatingOutlook, RatingAgencies, ZoneList, EnumIteratorValues, FrequencyType, TransactionDocumentTypes, FileTypes } from "./Constants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";

import chevron_down from "./../static/chevron-down.svg";

function HeaderRows(props:any){
  return(
    <TableHeader className={props.className}>
      <TableRow>
      {props.headingRows.map((heading:any,index:number)=>{
        return <TableHead key={index} className={heading.length>1?heading[1]:""}>{heading[0]}</TableHead>
      })}
      </TableRow>
    </TableHeader>
  )
}

function BodyRowsMapping(props:any){
  return(
    <TableBody>
      {props.list.map((singleRow:any, index:number)=>{
        let searchValid = true;
        if (props.searchRows.length>0){
          searchValid = false;
          const regEx = new RegExp(props.searchRows[0], "i");
          for (let i=1; i<props.searchRows.length; i++)
            if ((singleRow[props.searchRows[i]]+"").search(regEx)!==-1)
            searchValid=true;
        }

        let filterValid = true
        if (props.filterRows.length>0){
          filterValid = false;
          const filter = props.filterRows[0];
          for (let i=1; i<props.filterRows.length; i++){
            if ((singleRow[props.filterRows[i]])==Number(filter)+1)
              filterValid = true;
          }
        }

        if (searchValid && filterValid)
          return <SingleRow key={index} rowIndex={index} singleRow={singleRow} cellClassName={props.cellClassName} dataType={props.dataType} action={props.action} columns={props.columns} />
        else
          return ""
      })}
    </TableBody>
  )
}

function SingleRow(props:any){
  return(
    <TableRow key={props.rowIndex}>
      {props.dataType.map((dataType:any, index:number)=>{
        let cellClassName="";
        const uniqueIndex = props.rowIndex+"_"+index;
        if (props.cellClassName)
          cellClassName = props.cellClassName[index];
      
        if (dataType=="index")
          return handleIndex(props.rowIndex+1, cellClassName, uniqueIndex);
      
        else if (dataType=="action")
          return handleAction(props.action[props.rowIndex], cellClassName, uniqueIndex)
    
        const item = props.singleRow[props.columns[props.dataType[0]=="index"?index-1:index]];

        if (dataType=="text")
          return handleText(item, cellClassName, uniqueIndex);
        else if (dataType=="priority")
          return handlePriority(Number(item)-1, cellClassName, uniqueIndex);
        else if (dataType=="docStatus")
          return handleDocStatus(Number(item), cellClassName, uniqueIndex);
        else if (dataType=="userStatus")
          return handleUserStatus(Number(item), cellClassName, uniqueIndex);
        else if (dataType=="role")
          return handleRole(Number(item), cellClassName, uniqueIndex);
        else if(dataType=="zone")
          return handleZone(Number(item), cellClassName, uniqueIndex);
        else if (dataType=="ratingAgency")
          return handleRatingAgency(Number(item)-1, cellClassName, uniqueIndex);
        else if (dataType=="ratingType")
          return handleRatingType(Number(item)-1, cellClassName, uniqueIndex);
        else if (dataType=="ratingOutlook")
          return handleRatingOutlook(Number(item)-1, cellClassName, uniqueIndex);
        else if (dataType=="frequency")
          return handleFrequency(Number(item)-1, cellClassName, uniqueIndex);
        else if (dataType=="transaction")
          return handleTransactionDocumentType(Number(item)-1, cellClassName, uniqueIndex);
        else if (dataType=="file")
          return handleFileType(Number(item)-1, cellClassName, uniqueIndex);
      })}
    </TableRow>
  )
}

const handleIndex = (index:number, cellClassName:string, uniqueIndex:string) =>{
  return <TableCell key={uniqueIndex}  className={cellClassName}>{index}</TableCell>
}
const handleText = (item:String, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{item}</TableCell>
}

const handlePriority = (index:number, cellClassName:string, uniqueIndex:string) => {
  return(
    <TableCell key={uniqueIndex}>
      <div className={`${PriorityStyling[index]} rounded-lg text-center ${cellClassName}`}>
        {PriorityValues[index]}
      </div>
    </TableCell>
  )
}

const handleDocStatus = (index:number, cellClassName:string, uniqueIndex:string) => {
  return(
    <TableCell key={uniqueIndex} className={`${DocumentStatusStyling[index]} ${cellClassName}`}>
      {DocumentStatusValues[index]}
    </TableCell>
  )
}

const handleUserStatus = (index:number, cellClassName:string, uniqueIndex:string) => {
  return (
    <TableCell key={uniqueIndex} className={cellClassName}>
      <DropdownMenu>
      <DropdownMenuTrigger className={`${UserStatusStyling[index]} w-28 h-10 text-center rounded-xl `}>
        <div className="flex flex-row w-full" >
          <p className=" m-auto">{UserStatusValues[index]}</p>
          <img className="mr-2" src={chevron_down} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        <DropdownMenuItem className="bg-white text-yellow-600">{UserStatusValues[1]}</DropdownMenuItem>
        <DropdownMenuItem className="bg-white text-green-600">{UserStatusValues[2]}</DropdownMenuItem>
        <DropdownMenuItem className="bg-white text-red-600">{UserStatusValues[3]}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </TableCell>
  )
}

const handleRole = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{EnumIteratorValues(UserRoles)[index]}</TableCell>
}

const handleZone = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{EnumIteratorValues(ZoneList)[index+1]}</TableCell>
}

const handleAction = (action:any, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{action}</TableCell>
}

const handleRatingAgency = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{RatingAgencies[index]}</TableCell>
}

const handleRatingType = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{RatingTypes[index]}</TableCell>
}

const handleRatingOutlook = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{RatingOutlook[index]}</TableCell>
}

const handleFrequency = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{FrequencyType[index]}</TableCell>
}

const handleTransactionDocumentType = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{TransactionDocumentTypes[index]}</TableCell>
}

const handleFileType = (index:number, cellClassName:string, uniqueIndex:string) => {
  return <TableCell key={uniqueIndex} className={cellClassName}>{FileTypes[index]}</TableCell>
}

export { HeaderRows, BodyRowsMapping }

/* 
  props to HeaderRows:
    headingRows= [
      ["Title","text-white bg-white"],
      ["Name"],
    ],

  props to BodyRows:
    bodyRows = [
      [row1 Style, ROw1 Label],
      [Row2 Style, Row2 Label]
    ]

  props to BodyRowsMapping:
    list = {[
      [singleRow1],
      [singleRow2]
    ]}  REQ
    dataType =  ["text", "priority"]  cloumn data type  REQ
    searchRows = [] if searchString is "", else [searchString, 0,1] do regExp search in columns 0 and 1  REQ
    filterRows = [[priority, 2], [companyName, 1]]  REQ
    action ={<>Component to be rendered</>}
    cellClassName={["Styling for Col1", "Styling for Col2"]}
 */