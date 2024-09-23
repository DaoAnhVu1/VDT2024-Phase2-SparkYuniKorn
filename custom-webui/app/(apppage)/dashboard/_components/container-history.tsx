import React from 'react'
import { CustomBarChartForTimeStamp } from '@/components/charts/bar-chart-timestamp'
import axios from 'axios'
export default async function ContainerHistoryUI() {
    const response = await axios.get("http://localhost:9889/ws/v1/history/containers")
    return (
        <div className='flex w-3/4 h-full'>
            <CustomBarChartForTimeStamp title='Containers History' rawChartData={response.data} keyField={"totalContainers"} />
        </div>
    )
}
