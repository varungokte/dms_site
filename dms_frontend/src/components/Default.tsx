import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"


function Default() {
  //An array of default cases
  //Each default case is an array where: [Deal Name, Default Type, Date]
  const [defaultData, setDefaultData] = useState([
    ["Mortgage", "Payment", "01/01/01"],
    ["Home Loan", "Covenant", "02/02/02"],
    ["Business Loan", "Bankrupcy", "03/03/03"]
  ])
  return(
    <div>
			<p className="text-3xl font-bold m-7">Team Members</p>

      <div className='flex flex-row relative'>
        <div className=''>
          <input type="text" className="border-2 mx-10 my-2 p-4 rounded-xl" placeholder="Search"/>
        </div>

        <div>
          Date Range
        </div>
      </div>
      <div className="m-7">
      <Table className="rounded-xl bg-white">
        <TableHeader className="">
          <TableRow>
            <TableHead className="w-[100px]">Sr. No.</TableHead>
            <TableHead>Deal</TableHead>
            <TableHead>Default Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {defaultData.map((val,ind)=>{
            return(
              <TableRow>
                <TableCell className="font-medium">{ind+1}</TableCell>
                <TableCell>{val[0]}</TableCell>
                <TableCell>{val[1]}</TableCell>
                <TableCell>{val[2]}</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      </div>
    </div>
  )
}

export default Default;