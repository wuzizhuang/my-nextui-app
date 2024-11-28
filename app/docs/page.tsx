"use client";
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/react";
import { showAlert } from "@/components/Alert";
import { successAlertConfig } from "@/components/Alert/AlertButton";

export default function DocsPage() {
  const handleClick = () => {
    showAlert(successAlertConfig);
  };
  return (
    <>
      <Button onClick={handleClick}>确定</Button>
    </>
  );
}
