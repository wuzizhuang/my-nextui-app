import Swal from 'sweetalert2';
const displayResultsInContainer = (results) => {
    const resultsContainer = document.getElementById('results');
    const copyToClipboard = (text) => {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('复制成功！');
    };
    
    // 复制一致模型
    window.copyConsistentModels = () => {
        const consistentModels = results.valid.map((r) => r.model).join('\n');
        if (consistentModels) {
            copyToClipboard(consistentModels);
        } else {
            alert('没有一致的模型可复制！');
        }
    };
    
    // 复制一致和不一致模型
    window.copyConsistentAndInconsistentModels = () => {
        const models = [
            ...results.valid.map((r) => r.model),
            ...results.inconsistent.map((r) => r.model),
        ].join('\n');
        if (models) {
            copyToClipboard(models);
        } else {
            alert('没有可用的模型可复制！');
        }
    };
    
    // 复制一致、不一致模型及其原始返回值
    window.copyConsistentAndInconsistentReturedModels = () => {
        const models = [
            ...results.valid.map((r) => r.model),
            ...results.inconsistent.map((r) => `${r.model} -> ${r.returnedModel || '未返回模型名称'}`),
        ].join('\n');
        if (models) {
            copyToClipboard(models);
        } else {
            alert('没有可用的原始模型可复制！');
        }
    };
    
    if (!resultsContainer) {
        console.error("无法找到容器 #results");
        return;
    }
    //温度验证
    window.verifyTemperature = async function(model){
        Swal.fire({
            title: "温度验证中...",
            html: "请稍候，正在进行温度验证...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const results = await Promise.all(
                [1, 2, 3, 4].map(() => sendTemperatureVerificationRequest(model))
            );

            const responses = results.map((result) =>
                result.choices
                    ? result?.choices?.[0]?.message?.content?.trim()
                    : "该次调用响应异常"
            );

            const referenceMap = {
                "gpt-4o-mini": 32,
                "gpt-4o": 59,
                "claude-3-5": 51,
                "claude-3.5": 51,
            };

            const matchedKey = Object.keys(referenceMap).find((key) =>
                model.startsWith(key)
            );
            const referenceValue = matchedKey ? referenceMap[matchedKey] : null;

            // 构造验证结果的 HTML
            let message = `<strong>当前待验证模型：${model}</strong><p>参考值：c3.5 = 51 (gcp测试)，gpt-4o = 59，gpt-4o-mini = 32 (azure测试)</p>`;
            message += `
                <table style="width:100%; border-collapse: collapse; margin-bottom: 20px; text-align: left;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 4px;">测试</th>
                        <th style="border: 1px solid #ddd; padding: 4px;">响应</th>
                    </tr>
            `;

            let hitReferenceCount = 0;
            let color;
            for (let i = 0; i < 4; i++) {
                if (responses[i] === referenceValue) {
                    hitReferenceCount++;
                    color = "green";
                } else if (responses[i] === "该次调用响应异常") {
                    color = "red";
                } else {
                    color = "black";
                }

                message += `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 4px;">测试 ${i + 1}</td>
                        <td style="border: 1px solid #ddd; padding: 4px; color: ${color};">${responses[i]}</td>
                    </tr>
                `;
            }

            message += "</table><strong>结论：</strong>";

            const frequencyCheckResult = findMostFrequent(responses);
            const diffentCount = frequencyCheckResult.count;

            if (diffentCount === responses.length) {
                message += "所有响应相同，可能是官方API";
            } else {
                message += `响应结果重复度：${diffentCount}/${responses.length}`;
                if (/^(gpt-4o|claude-3-5|claude-3.5)/.test(model)) {
                    message += `，参考值命中率：${hitReferenceCount}/${responses.length}`;
                }
                message += "，可能不是官方API";
            }

            message += "<br>";

            // 显示验证结果
            Swal.fire({
                title: "温度验证结果",
                html: message,
                icon: "info",
                width: "700px",
                confirmButtonText: "关闭",
            });
        } catch (error) {
            console.error("Error in verifyTemperature:", error);
            Swal.fire({
                title: "错误",
                text: "验证过程中发生错误: " + error.message,
                icon: "error",
                confirmButtonText: "关闭",
            });
        }
    }
    // Helper 函数：获取最频繁的响应值
    function findMostFrequent(arr) {
        const frequency = {};
        arr.forEach((item) => {
            frequency[item] = (frequency[item] || 0) + 1;
        });
        const mostFrequent = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0];
        return { value: mostFrequent[0], count: mostFrequent[1] };
    }
    // Helper 函数：发送验证请求
    async function sendTemperatureVerificationRequest(model) {
        const apiUrl = document.getElementById("api_url").value.replace(/\/+$/, "");
        const apiKey = document.getElementById("api_key").value;

        try {
            const response = await fetch(`${apiUrl}/v1/chat/completions`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content:
                                "You're an associative thinker. The user gives you a sequence of 6 numbers. Your task is to figure out and provide the 7th number directly, without explaining how you got there.",
                        },
                        {
                            role: "user",
                            content: "5, 15, 77, 19, 53, 54,",
                        },
                    ],
                    temperature: 0.01,
                    model: model,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error in sendTemperatureVerificationRequest:", error);
            return { error: error.message };
        }
    }
    //官方验证
    window.verifyOfficial = async function(model) {
        // 显示加载提示
        Swal.fire({
            title: "正在进行官转验证...",
            html: `请稍候，正在验证模型 <strong>${model}</strong> 的合法性和一致性...`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    
        try {
            // Seed 参数可以根据需求动态生成或传入固定值
            const seed = 1234;
    
            // 调用官方验证功能
            await performOfficialVerification(model, seed);
    
            // 验证完成后，SweetAlert2 会被 performOfficialVerification 内部处理
        } catch (error) {
            // 显示错误提示
            console.error("Error in verifyOfficial:", error);
            Swal.fire({
                icon: "error",
                title: "验证过程中发生错误",
                text: error.message,
                confirmButtonText: "关闭",
            });
        }
    }
    async function performOfficialVerification(model, seed) {
        Swal.fire({
            title: "正在进行官方验证...",
            html: "请稍候，正在验证模型和系统指纹...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    
        try {
            const results = await Promise.all([1, 2, 3, 4].map(() => sendVerificationRequest(model, seed)));
            const texts = [];
            const fingerprints = [];
    
            for (let i = 0; i < results.length; i++) {
                if (results[i].error) {
                    console.error(`Error in request ${i + 1}:`, results[i].error);
                    Swal.fire({
                        icon: "error",
                        title: "请求错误",
                        text: `请求 ${i + 1} 失败: ${results[i].error}`,
                    });
                    return;
                }
                if (!results[i].choices?.[0]?.message?.content) {
                    console.error(`Invalid response structure in request ${i + 1}:`, results[i]);
                    Swal.fire({
                        icon: "error",
                        title: "响应数据结构无效",
                        text: `请求 ${i + 1} 返回的数据结构无效`,
                    });
                    return;
                }
                texts.push(results[i].choices[0].message.content);
                fingerprints.push(results[i].system_fingerprint || "N/A");
            }
    
            const similarity = compareTextSimilarity(texts[0], texts[1], texts[2], texts[3]);
    
            let validFingerprintsCount = Object.values(fingerprints).filter(value => value !== 'N/A').length;
            let similarityCount = Object.values(similarity).filter(value => parseFloat(value) > 0.6).length;
            let lowSimilarityCount = Object.values(similarity).filter(value => parseFloat(value) < 0.1).length;
    
            let title = "验证结果";
            let message = "";
    
            if (validFingerprintsCount >= 3 && similarityCount >= 3) {
                title = "恭喜你，大概率是官方API！";
                message += "<strong>Tips: 这是官方API！</strong>";
            } else if (validFingerprintsCount >= 2 && similarityCount >= 2) {
                title = "可能是官方API";
                message += "<strong>Tips: 应该是官方的</strong>";
            } else if (validFingerprintsCount <= 2 && lowSimilarityCount >= 2) {
                title = "可能是假的";
                message += "<strong>Tips: 假的8</strong>";
            } else {
                title = "没有系统指纹且回答一致性差，则api大概率是假的";
                message += "<strong>Tips: 结果不确定，请进一步验证</strong>";
            }
    
            message += `
                <table style="width:100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px;">测试</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">文本</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">系统指纹</th>
                    </tr>
            `;
    
            for (let i = 0; i < 4; i++) {
                message += `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">测试 ${i + 1}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${texts[i]}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${fingerprints[i]}</td>
                    </tr>
                `;
            }
    
            message += `
                </table>
                相似度结果：<br>
                ${Object.entries(similarity).map(([key, value]) => `${key}: ${value}`).join("<br>")}
            `;
    
            // 显示结果
            Swal.fire({
                title: title,
                html: message,
                icon: "info",
                width: "700px",
                confirmButtonText: "关闭",
            });
        } catch (error) {
            console.error("Error in performOfficialVerification:", error);
            Swal.fire({
                icon: "error",
                title: "验证过程中发生错误",
                text: error.message,
            });
        }
    }
    async function sendVerificationRequest(model, seed) {
        const apiUrl = document.getElementById('api_url').value.replace(/\/+$/, '');
        const apiKey = document.getElementById('api_key').value;
        try {
            const response = await fetch(`${apiUrl}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: "写一个10个字的冷笑话"
                        }
                    ],
                    seed: seed,
                    temperature: 0.7,
                    model: model
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error in sendVerificationRequest:', error);
            return {error: error.message};
        }
    }
    const compareTextSimilarity = (text1, text2, text3, text4) => {
        function calculateSimilarity(str1, str2) {
            const len1 = str1.length;
            const len2 = str2.length;
            const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));

            for (let i = 0; i <= len1; i++) matrix[i][0] = i;
            for (let j = 0; j <= len2; j++) matrix[0][j] = j;

            for (let i = 1; i <= len1; i++) {
                for (let j = 1; j <= len2; j++) {
                    const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j - 1] + cost
                    );
                }
            }

            return 1 - matrix[len1][len2] / Math.max(len1, len2);
        }

        return {
            similarity12: calculateSimilarity(text1, text2).toFixed(4),
            similarity13: calculateSimilarity(text1, text3).toFixed(4),
            similarity14: calculateSimilarity(text1, text4).toFixed(4),
            similarity23: calculateSimilarity(text2, text3).toFixed(4),
            similarity24: calculateSimilarity(text2, text4).toFixed(4),
            similarity34: calculateSimilarity(text3, text4).toFixed(4)
        };
    }
    //函数验证
    window.verifyFunctionCalling = async function(model) {
        console.log("开始验证函数调用");

    // 使用 SweetAlert2 显示输入框
    const { value: formValues } = await Swal.fire({
        title: '请输入两个整数 a 和 b',
        html: `
            <div style="text-align: left;">
                <label style="margin-bottom: 8px; display: inline-block;">请输入整数 a:</label>
                <input type="number" id="inputA" class="swal2-input" value="3" style="margin-bottom: 8px;">
                <label style="margin-bottom: 8px; display: inline-block;">请输入整数 b:</label>
                <input type="number" id="inputB" class="swal2-input" value="5">
            </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
            const a = parseInt(document.getElementById('inputA').value);
            const b = parseInt(document.getElementById('inputB').value);

            if (isNaN(a) || isNaN(b)) {
                Swal.showValidationMessage('请输入有效的整数 a 和 b');
            } else {
                return { a, b };
            }
        },
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        });

        if (!formValues) {
            console.log("用户取消输入");
            return;
        }

        const { a, b } = formValues;

        // 调用验证函数
        await performFunctionCallingVerification(model, a, b);
    }
    async function sendFunctionCallingRequest(model, a, b) {
        const apiUrl = document.getElementById('api_url').value.replace(/\/+$/, '');
        const apiKey = document.getElementById('api_key').value;
    
        try {
            const response = await fetch(`${apiUrl}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: `Please add ${a} and ${b}.` },
                    ],
                    functions: [
                        {
                            name: 'add_numbers',
                            description: 'Adds two numbers together',
                            parameters: {
                                type: 'object',
                                properties: {
                                    a: { type: 'number', description: 'The first number' },
                                    b: { type: 'number', description: 'The second number' },
                                },
                                required: ['a', 'b'],
                            },
                        },
                    ],
                    function_call: 'auto',
                    temperature: 0.5,
                    model: model,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            return await response.json();
        } catch (error) {
            console.error('Error in sendFunctionCallingRequest:', error);
            return { error: error.message };
        }
    }
    async function performFunctionCallingVerification(model, a, b) {
        Swal.fire({
            title: '正在进行函数调用验证...',
            html: '请稍候，正在验证模型的函数调用能力...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    
        try {
            const result = await sendFunctionCallingRequest(model, a, b);
    
            if (result.error) {
                console.error('Error in request:', result.error);
                Swal.fire({
                    icon: 'error',
                    title: '请求失败',
                    text: result.error,
                });
                return;
            }
    
            const title = '<b><span style="color: black;">模型函数调用响应对比</span></b>';
            let text;
    
            // 判断函数调用响应的类型
            if (
                result.choices?.[0]?.finish_reason === 'function_call' ||
                result.choices?.[0]?.message?.tool_calls?.[0]?.type === 'function'
            ) {
                text = `<b><span style="color: green;">模型返回了函数调用响应，测试模型为：${model}</span></b>`;
            } else {
                text = `<b><span style="color: red;">模型无函数调用响应返回，测试模型为：${model}</span></b>`;
            }
    
            const referenceFunctionCall = JSON.stringify(
                {
                    index: 0,
                    message: {
                        role: 'assistant',
                        content: null,
                        function_call: {
                            name: 'add_numbers',
                            arguments: `{"a":${a},"b":${b}}`,
                        },
                    },
                    logprobs: null,
                    finish_reason: 'function_call',
                },
                null,
                4
            );
    
            const modelFunctionCall = JSON.stringify(result.choices?.[0], null, 4);
    
            // 构造结果表格
            const message = `
                ${text}
                <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr>
                            <th style="padding: 8px; background-color: #f2f2f2;">OpenAI 标准输出参考</th>
                            <th style="padding: 8px; background-color: #f2f2f2;">测试模型输出</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 8px;">
                                <pre style="white-space: pre-wrap; word-wrap: break-word;">${referenceFunctionCall}</pre>
                            </td>
                            <td style="padding: 8px;">
                                <pre style="white-space: pre-wrap; word-wrap: break-word;">${modelFunctionCall}</pre>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `;
    
            // 显示结果
            Swal.fire({
                title: title,
                html: message,
                width: '800px',
                confirmButtonText: '关闭',
            });
        } catch (error) {
            console.error('Error in performFunctionCallingVerification:', error);
            Swal.fire({
                icon: 'error',
                title: '验证过程中发生错误',
                text: error.message,
            });
        }
    }
    
    // 清空容器
    resultsContainer.innerHTML = '';


    

    // 创建标题
    let content = `
        <h2>测试结果</h2>
        <h3>（结果仅供参考，防君子不防小人）</h3>
        <div class="submit-container">
            <input type="button" onclick="copyConsistentModels()" value="复制一致模型" class="check-quota">
            <input type="button" onclick="copyConsistentAndInconsistentModels()" value="复制可用模型" class="check-quota">
            <input type="button" onclick="copyConsistentAndInconsistentReturedModels()" value="复制原始模型" class="check-quota">
        </div>
        <table>
            <tr>
                <th class="td1">状态</th>
                <th class="td2">模型名称</th>
                <th class="td3">响应时间 (秒)</th>
                <th class="td4">备注</th>
            </tr>
    `;

    // Helper 函数生成行
    const createRow = (status, model, responseTime, remarks) => `
        <tr>
            <td class="td1">${status}</td>
            <td class="td2"><span class="copy-btn2" onclick="copyText('${model}')">${model}</span></td>
            <td class="td3">${responseTime !== null ? responseTime.toFixed(2) : '-'}</td>
            <td class="td4">${remarks}</td>
        </tr>
    `;

    // **显示有效模型**
    results.valid.forEach((r) => {
        let verifyButtons = `
            <button class="verify-btn cyan" onclick="verifyFunctionCalling('${r.model}')">函数验证</button>
        `;
        if (/^(gpt-|chatgpt-|o1-)/.test(r.model)) {
            let officialButtonClass = results.awaitOfficialVerification.some((item) => item.model === r.model)
                ? "green"
                : "yellow";
            verifyButtons += `
                <button class="verify-btn blue" onclick="verifyTemperature('${r.model}')">温度验证</button>
                <button class="verify-btn ${officialButtonClass}" onclick="verifyOfficial('${r.model}')">官转验证</button>
            `;
        }
        content += createRow('模型一致可用', r.model, r.responseTime, `<div class="verify-btn-group">${verifyButtons}</div>`);
    });

    // **显示不一致模型**
    results.inconsistent.forEach((r) => {
        let highlightedReturnModel = r.returnedModel;
        if (r.returnedModel.startsWith(`${r.model}-`)) {
            highlightedReturnModel = `
                <span style="color: green; font-weight: bold;">${r.model}</span>${r.returnedModel.slice(r.model.length)}
                <br>可能是带版本号模型映射
            `;
        }
        let verifyButtons = `
            <button class="verify-btn cyan" onclick="verifyFunctionCalling('${r.model}')">函数验证</button>
        `;
        if (/^(gpt-|chatgpt-|o1-)/.test(r.model)) {
            let officialButtonClass = results.awaitOfficialVerification.some((item) => item.model === r.model)
                ? "green"
                : "yellow";
            verifyButtons += `
                <button class="verify-btn blue" onclick="verifyTemperature('${r.model}')">温度验证</button>
                <button class="verify-btn ${officialButtonClass}" onclick="verifyOfficial('${r.model}')">官转验证</button>
            `;
        }
        content += createRow(
            '模型不一致/映射',
            r.model,
            r.responseTime,
            `<div class="verify-btn-group">${verifyButtons}</div>
             <br>返回模型: ${highlightedReturnModel || '未返回模型名称'}`
        );
    });

    // **显示无效模型**
    results.invalid.forEach((r) => {
        content += createRow(
            '模型不可用!!!',
            r.model,
            null,
            r.error || r.responseText || '未知错误'
        );
    });

    // 结束表格
    content += '</table>';

    // 渲染内容
    resultsContainer.innerHTML = content;
  };
export default displayResultsInContainer;