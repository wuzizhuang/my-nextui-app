"use client";
import { title } from "@/components/primitives";
import {Accordion, AccordionItem} from "@nextui-org/react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import {Button} from "@nextui-org/react";
import { useState } from "react";

import AIChat from "@/components/AI/AIChat/App";
import ApiCheck from "@/components/AI/ApiCheck/page";

export default function ToolsPage() {
    const [selectedTool, setSelectedTool] = useState("ShowAll");

    const renderTool = () => {
        switch(selectedTool) {
            case "AIChat":
                return <AIChat />;
            case "CheckApi":
                return <ApiCheck />;
            case "Edit file":
                return <div>Edit File Tool</div>;
            default:
                return <div><ApiCheck /></div>;
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-row justify-between">
                <h1 className={title()}>Tools</h1>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered">
                            {selectedTool}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu 
                        aria-label="Static Actions"
                        onAction={(key) => setSelectedTool(key.toString())}
                    >
                        <DropdownItem key="AIChat">AIChat</DropdownItem>
                        <DropdownItem key="CheckApi">CheckApi</DropdownItem>
                        <DropdownItem key="Edit file">Edit file</DropdownItem>
                        <DropdownItem key="ShowAll" className="text-danger" color="danger">
                            ShowAll
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            
            <section className="w-full">
                {renderTool()}
            </section>
        </div>
    );
}
