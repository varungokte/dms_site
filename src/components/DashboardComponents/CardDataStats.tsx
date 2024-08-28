import { Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function CardDataStats(props:{title: string, total: string, rate: string, levelUp?: boolean, levelDown?: boolean,}){
  
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
      </div>

      <div className="mt-4 flex items-center justify-center flex-col ">
        <div>
          <h3 className="text-title-lg font-bold text-black dark:text-white text-center">{props.total}</h3>
          <span className="text-md font-medium text-center">{props.title}</span>
        </div>

        <div className="flex flex-row">
          <div>
            {props.levelUp &&<ArrowDropUpIcon color="success" />}
            {props.levelDown && <ArrowDropDownIcon color="error" />}
          </div>
          <Typography color={props.levelDown?"error":(props.levelUp?"green":"")}>
            {props.rate}
          </Typography>
        </div>
        
      </div>
    </div>
  )
}

export default CardDataStats;