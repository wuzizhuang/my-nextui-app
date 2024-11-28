"use client";
import { useState } from "react";
import {Input,Button, Slider} from "@nextui-org/react";


export default function ApiCheck(){
    const [apiUrl, setApiUrl] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [modelNames, setModelNames] = useState("");

    const handleSubmit = () => {
        console.log(apiUrl, apiKey, modelNames);
    };

    return (
        <section className="h-full w-full flex justify-center items-center">
            <div className="container">
                <h1 className="text-2xl font-bold mb-4 text-center">
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
                    onChange={(e) => setApiUrl(e.target.value)}
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
                <Input
                    isRequired
                    type="text"
                    label="接口地址"
                    placeholder="支持手动模型名称用逗号分隔多个模型"
                    className="w-full mb-2 mr-2" // 确保输入框宽度为100%
                    value={modelNames}
                    onChange={(e) => setModelNames(e.target.value)}
                />
                    <Button color="primary" className="h-14">提交</Button> {/* 设置按钮宽度为100% */}
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
                
            </div>
        </section>
    )
}