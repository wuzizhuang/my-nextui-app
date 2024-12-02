import {showError} from '../../Alert/SwalConfig'

export const fetchModelList = async (apiUrl, apiKey) => {
    if (!apiUrl || !apiKey) {
        showError("请输入 API URL 和 API Key。");
        return { success: false, data: [] };
    }
    
    try {
        const response = await fetch(`${apiUrl}/v1/models`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const modelList = data.data.map((model) => model.id).sort();
        return { success: true, data: modelList };
        
    } catch (error) {
        console.error("Error fetching model list:", error);
        return { success: false, data: [] };
    }
};

export const fetchCheckQuota = async (apiUrl, apiKey) => {
    if(!apiUrl ||!apiKey){
        return { success: false, data: [] };
    }
    try{
        const response = await fetch(`${apiUrl}/dashboard/billing/subscription`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        const quotaData = await response.json();
        const totalQuota = `${quotaData.hard_limit_usd.toFixed(2)} $`; 
        
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-${day}`;

        const usageResponse = await fetch(`${apiUrl}/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });
        const usageData = await usageResponse.json();

        const usedInfo = `${(usageData.total_usage / 100).toFixed(2)} $`;
        const quotaNumber = parseFloat(quotaData.hard_limit_usd);
        const usedNumber = parseFloat(usageData.total_usage / 100);

        let remainInfo = '无法计算剩余额度';
        if (!isNaN(quotaNumber) && !isNaN(usedNumber)) {
            remainInfo = `${(quotaNumber - usedNumber).toFixed(2)} $`;
        }
        
        // Format and show the information
        return {
            success: true,
            data: {
                remainInfo,
                usedInfo,
                totalQuota
            }
        };
    }catch(error){
        return { success: false, data: [] };
    };
};
