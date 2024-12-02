"use client";
import { useState } from "react";
import {Input,Button, Slider,  Select, SelectItem} from "@nextui-org/react";
import Swal from "sweetalert2";
import { successAlertConfig } from "../../Alert/AlertButton";

import { fetchModelList } from "./checker";

import { AiOutlineApi } from 'react-icons/ai';  // 测试图标
import { BiCheckCircle } from 'react-icons/bi';  // 额度图标
import { RiDeleteBin6Line } from 'react-icons/ri';  // 清空图标

// 然后在按钮中使用


export default function ApiCheck(){
    const [apiUrl, setApiUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [urlError, setUrlError] = useState(false);
    const [modelName, setModelName] = useState('');
    const [timeout, setTimeoutValue] = useState(10);
    const [concurrency, setConcurrency] = useState(5);
    const [, setQuotaInfo] = useState('');
    const [, setUsedInfo] = useState('');
    const [, setRemainInfo] = useState('');
    const [models, setModels] = useState<{key: string, label: string}[]>([]);
    const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
    const [displayedModels, setDisplayedModels] = useState<{key: string, label: string}[]>([]);
    const [showAll, setShowAll] = useState(false);

    

    const handleChecktest =() => {
        console.log("test");
    }
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let url = e.target.value;
        if(url.endsWith('/')){
            url = url.slice(0, -1);
        }
        setApiUrl(url);
    };

    const getModelList = async () => {
        const {success, data} = await fetchModelList(apiUrl, apiKey);
        if(success){
            const modelList = data.map((model: string) => ({
                key: model,
                label: model
            }));
            setModels(modelList);
            setDisplayedModels(modelList.slice(0, 9));
            console.log(models);
            return true;
        }else{
            return false;
        }
    };
    const handleCheckModel = () => {
        getModelList();
        
    };
    return (
        <section className="h-full w-full flex justify-center items-center">
            <div className="container">
                <h1 className="text-3xl font-bold mb-4 text-center text-black tracking-tight">
                    API 信息测活工具
                </h1>
                <form className="flex flex-col items-center">
                <Input
                    isRequired
                    type="text"
                    label="接口地址"
                    placeholder="https://api.openai.com"
                    className="w-full max-w-md mb-4 justify-center"
                    value={apiUrl}
                    onChange={handleUrlChange}
                    />
                <Input
                    isRequired
                    type="text"
                    label="API Key"
                    placeholder="sk-123456"
                    className="w-full max-w-md mb-4 justify-center"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <div className="flex flex-row w-full max-w-md mb-4"> {/* 设置宽度 */}
                    <Select
                        label="模型名称"
                        placeholder="选择模型"
                        selectionMode="multiple"
                        className="w-full mb-2 mr-2"
                        selectedKeys={selectedModels}
                        onSelectionChange={(keys) => setSelectedModels(keys as Set<string>)}
                    >
                        {displayedModels.map((model) => (
                            <SelectItem key={model.key}>{model.label}</SelectItem>
                        ))}
                    </Select>
                    <Button color="primary" className="h-14" onClick={handleCheckModel}>查询</Button> {/* 设置按钮宽度为100% */}
                </div>
                <div className="flex flex-col gap-6 w-full max-w-md">
                    <Slider   
                        label="设置请求超时（秒）："
                        showTooltip={true}
                        defaultValue={10}
                        maxValue={100}
                        className="max-w-md" 
                        />
                    <Slider   
                        label="设置请求并发数量："
                        showTooltip={true}
                        defaultValue={5}
                        maxValue={50}
                        className="max-w-md" 
                        />
                </div>
                </form>
                <div className="w-full flex justify-center">
                    <div className="flex flex-row items-center justify-center w-full max-w-md gap-8 mt-4">
                        <Button 
                            color="primary"
                            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg hover:opacity-90 transition-opacity"
                            onClick={handleCheckModel}
                            startContent={<AiOutlineApi className="w-4 h-4" />}
                        >   
                        测试模型
                        </Button>
                        <Button 
                            color="secondary"
                            className="bg-gradient-to-r from-violet-500 to-violet-700 text-white shadow-lg hover:opacity-90 transition-opacity"
                            onClick={handleChecktest}
                            startContent={<BiCheckCircle className="w-4 h-4" />}
                        >
                        检查额度
                        </Button>
                        <Button 
                            color="danger"
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:opacity-90 transition-opacity"
                            onClick={handleChecktest}
                            startContent={<RiDeleteBin6Line className="w-4 h-4" />}
                        >
                        清空列表
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}