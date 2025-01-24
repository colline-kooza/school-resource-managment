import React from "react";
import CloseButton from "./dashboard/FormInputs/CloseButton";
import SubmitButton from "./dashboard/FormInputs/SubmitButton";

export default function FormFooter({
  href,
  editingId,
  loading,
  title,
  parent,
}: {
  href: string;
  editingId: string | undefined;
  loading: boolean;
  title: string;
  parent?: string;
}) {
  return (
    <div className="flex items-center  gap-2 py-4 justify-between ">
      <CloseButton href={href} parent={parent} />
      <SubmitButton
        text=""
        title={title}
        loading={loading}
      />
    </div>
  );
}
